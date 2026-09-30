import uuid
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User, UserRole
from app.schemas.auth import UserRegister, UserLogin, SellerLogin, UserResponse, Token
from app.security.passwords import hash_password, verify_password
from app.security.jwt import create_access_token
from app.security.deps import get_current_user

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/register", response_model=Token, status_code=status.HTTP_201_CREATED)
def register_customer(user_in: UserRegister, db: Session = Depends(get_db)):
    """
    Real Customer Registration Endpoint.
    Strictly forces role='customer'. Seller registration is permanently prohibited.
    """
    # Prohibit any attempt to register as a seller
    if user_in.role and user_in.role.lower() in ["seller", "admin"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Seller registration is disabled. VasudhaEthnic operates with a single authorized seller."
        )

    clean_email = user_in.email.lower().strip()
    clean_user_id = (user_in.user_id or clean_email).strip()

    # Check for duplicate email
    existing_email = db.query(User).filter(User.email == clean_email).first()
    if existing_email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email address already exists."
        )

    # Check for duplicate user_id if different from email
    if clean_user_id != clean_email:
        existing_uid = db.query(User).filter(User.user_id == clean_user_id).first()
        if existing_uid:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="This username is already taken. Please choose another."
            )

    user_obj = User(
        id=f"usr_cust_{uuid.uuid4().hex[:12]}",
        user_id=clean_user_id,
        name=user_in.name.strip(),
        email=clean_email,
        phone=user_in.phone.strip() if user_in.phone else None,
        role=UserRole.CUSTOMER.value,
        hashed_password=hash_password(user_in.password),
        is_active=True
    )

    db.add(user_obj)
    db.commit()
    db.refresh(user_obj)

    token = create_access_token({"sub": user_obj.user_id, "role": user_obj.role})
    return Token(access_token=token, user=UserResponse.model_validate(user_obj))


@router.post("/login", response_model=Token)
def customer_login(login_in: UserLogin, db: Session = Depends(get_db)):
    """
    Customer Authentication Endpoint.
    Authenticates against real database users using Email or Username.
    Returns generic error on failure to protect against account enumeration.
    """
    identifier = login_in.user_id.strip()
    user_obj = db.query(User).filter(
        (User.user_id == identifier) | (User.email == identifier.lower())
    ).first()

    if not user_obj or not verify_password(login_in.password, user_obj.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password."
        )

    if not user_obj.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="This account has been deactivated."
        )

    token = create_access_token({"sub": user_obj.user_id, "role": user_obj.role})
    return Token(access_token=token, user=UserResponse.model_validate(user_obj))


@router.post("/seller/login", response_model=Token)
@router.post("/seller-login", response_model=Token)
def seller_login(login_in: SellerLogin, db: Session = Depends(get_db)):
    """
    Dedicated Single-Seller Authentication Endpoint.
    Verifies seller credentials and strictly enforces role='seller'.
    """
    identifier = (login_in.email or login_in.user_id or "").strip()
    if not identifier:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Seller email or ID is required."
        )

    user_obj = db.query(User).filter(
        (User.user_id == identifier) | (User.email == identifier.lower())
    ).first()

    if not user_obj or not verify_password(login_in.password, user_obj.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid seller credentials."
        )

    # Enforce seller role
    if user_obj.role not in [UserRole.SELLER.value, UserRole.ADMIN.value]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied: Not an authorized seller account."
        )

    if not user_obj.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="This seller account has been deactivated."
        )

    token = create_access_token({"sub": user_obj.user_id, "role": user_obj.role})
    return Token(access_token=token, user=UserResponse.model_validate(user_obj))


@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    """Return the profile of the currently logged-in user."""
    return UserResponse.model_validate(current_user)


@router.post("/logout")
def logout(current_user: User = Depends(get_current_user)):
    """Log out current session."""
    return {"message": "Successfully logged out.", "user_id": current_user.user_id}
