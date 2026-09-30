import pytest
import os
import sys

# Ensure backend root is on sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.main import app
from app.database import Base, get_db
from app.models.user import User, UserRole
from app.models.product import Product
from app.models.variant import ProductVariant
from app.security.passwords import hash_password
from app.security.jwt import create_access_token
from app.services.embedding_service import embedding_service

# Use in-memory SQLite database for fast isolated unit testing
SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"

test_engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=test_engine)


@pytest.fixture(scope="session", autouse=True)
def setup_test_db():
    Base.metadata.create_all(bind=test_engine)
    yield
    Base.metadata.drop_all(bind=test_engine)


@pytest.fixture
def db_session():
    connection = test_engine.connect()
    transaction = connection.begin()
    session = TestingSessionLocal(bind=connection)

    yield session

    session.close()
    transaction.rollback()
    connection.close()


@pytest.fixture
def client(db_session):
    def override_get_db():
        try:
            yield db_session
        finally:
            pass

    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()


@pytest.fixture
def seller_user(db_session):
    user = User(
        id="usr_test_seller",
        user_id="testseller",
        name="Test Seller",
        email="seller@test.com",
        role=UserRole.SELLER.value,
        hashed_password=hash_password("sellerpass123"),
        is_active=True
    )
    db_session.add(user)
    db_session.commit()
    return user


@pytest.fixture
def customer_user(db_session):
    user = User(
        id="usr_test_cust",
        user_id="testcustomer",
        name="Test Customer",
        email="customer@test.com",
        role=UserRole.CUSTOMER.value,
        hashed_password=hash_password("custpass123"),
        is_active=True
    )
    db_session.add(user)
    db_session.commit()
    return user


@pytest.fixture
def seller_headers(seller_user):
    token = create_access_token({"sub": seller_user.user_id, "role": seller_user.role})
    return {"Authorization": f"Bearer {token}"}


@pytest.fixture
def customer_headers(customer_user):
    token = create_access_token({"sub": customer_user.user_id, "role": customer_user.role})
    return {"Authorization": f"Bearer {token}"}


@pytest.fixture
def sample_product(db_session):
    p_data = {
        "id": "VE_TEST_01",
        "name": "Royal Green Silk Anarkali",
        "category": "Dresses",
        "price": 2199,
        "fabric": "Silk",
        "sizes": ["S", "M", "L"],
        "colors": ["Green"],
        "description": "Handcrafted silk Anarkali in royal pine green.",
        "occasions": ["Wedding", "Festive"]
    }
    emb = embedding_service.get_embedding(embedding_service.build_product_document(p_data))
    prod = Product(
        id="VE_TEST_01",
        sku="VE-TST-001",
        name="Royal Green Silk Anarkali",
        slug="royal-green-silk-anarkali",
        category="Dresses",
        sub_category="Anarkalis",
        price=2199,
        original_price=2999,
        fabric="Silk",
        color="Green",
        colors=["Green"],
        sizes=["S", "M", "L"],
        images=["/half-saree-orange.jpg"],
        description="Handcrafted silk Anarkali in royal pine green.",
        stock=5,
        published=True,
        embedding=emb
    )
    db_session.add(prod)

    var_m = ProductVariant(
        id="var_test_m",
        product_id="VE_TEST_01",
        size="M",
        color="Green",
        stock=5,
        sku="VE-TST-001-M-Green"
    )
    var_s = ProductVariant(
        id="var_test_s",
        product_id="VE_TEST_01",
        size="S",
        color="Green",
        stock=0,
        sku="VE-TST-001-S-Green"
    )
    db_session.add(var_m)
    db_session.add(var_s)
    db_session.commit()
    return prod
