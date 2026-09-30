def test_register_customer_success(client):
    response = client.post(
        "/api/auth/register",
        json={
            "name": "Pooja Sharma",
            "email": "pooja@example.com",
            "user_id": "poojasharma",
            "password": "securepassword123",
            "confirm_password": "securepassword123",
            "phone": "+91 99887 76655",
            "role": "customer"
        }
    )
    assert response.status_code == 201
    data = response.json()
    assert "access_token" in data
    assert data["user"]["user_id"] == "poojasharma"
    assert data["user"]["role"] == "customer"
    assert data["user"]["email"] == "pooja@example.com"


def test_register_customer_password_mismatch(client):
    response = client.post(
        "/api/auth/register",
        json={
            "name": "Pooja Sharma",
            "email": "pooja2@example.com",
            "password": "securepassword123",
            "confirm_password": "differentpassword",
            "phone": "+91 99887 76655"
        }
    )
    assert response.status_code == 422


def test_register_customer_duplicate_email(client, customer_user):
    response = client.post(
        "/api/auth/register",
        json={
            "name": "Duplicate User",
            "email": customer_user.email,
            "password": "somepassword123",
            "confirm_password": "somepassword123"
        }
    )
    assert response.status_code == 400
    assert "already exists" in response.json()["detail"]


def test_register_seller_prohibited(client):
    response = client.post(
        "/api/auth/register",
        json={
            "name": "Fake Seller",
            "email": "fakeseller@example.com",
            "password": "somepassword123",
            "confirm_password": "somepassword123",
            "role": "seller"
        }
    )
    assert response.status_code == 403
    assert "Seller registration is disabled" in response.json()["detail"]


def test_customer_login_success(client, customer_user):
    # Test login with email
    response = client.post(
        "/api/auth/login",
        json={
            "user_id": customer_user.email,
            "password": "custpass123"
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["user"]["user_id"] == customer_user.user_id

    # Test login with user_id
    response2 = client.post(
        "/api/auth/login",
        json={
            "user_id": customer_user.user_id,
            "password": "custpass123"
        }
    )
    assert response2.status_code == 200
    assert response2.json()["access_token"]


def test_customer_login_invalid_password(client, customer_user):
    response = client.post(
        "/api/auth/login",
        json={
            "user_id": customer_user.email,
            "password": "wrongpassword"
        }
    )
    assert response.status_code == 401
    assert "Invalid email or password" in response.json()["detail"]


def test_seller_login_success(client, seller_user):
    response = client.post(
        "/api/auth/seller/login",
        json={
            "email": seller_user.email,
            "password": "sellerpass123"
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["user"]["role"] == "seller"
    assert data["user"]["user_id"] == seller_user.user_id


def test_customer_blocked_from_seller_login(client, customer_user):
    response = client.post(
        "/api/auth/seller/login",
        json={
            "email": customer_user.email,
            "password": "custpass123"
        }
    )
    assert response.status_code == 403
    assert "Not an authorized seller account" in response.json()["detail"]


def test_seller_login_invalid_credentials(client, seller_user):
    response = client.post(
        "/api/auth/seller/login",
        json={
            "email": seller_user.email,
            "password": "wrongsellerpass"
        }
    )
    assert response.status_code == 401
    assert "Invalid seller credentials" in response.json()["detail"]


def test_get_me_authenticated(client, customer_headers):
    response = client.get("/api/auth/me", headers=customer_headers)
    assert response.status_code == 200
    assert response.json()["user_id"] == "testcustomer"


def test_customer_cannot_access_seller_endpoint(client, customer_headers):
    # Customer attempts to create product
    response = client.post(
        "/api/products",
        headers=customer_headers,
        json={
            "name": "Unauthorized Saree",
            "category": "Sarees",
            "price": 3000,
            "description": "Customer trying to add product"
        }
    )
    assert response.status_code == 403
    assert "Seller privileges required" in response.json()["detail"]

