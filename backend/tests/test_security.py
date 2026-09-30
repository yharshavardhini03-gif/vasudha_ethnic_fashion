import io
from PIL import Image


def test_health_check_endpoint(client):
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert "status" in data
    assert "local_ai" in data
    assert "embedding" in data
    # Ensure credentials or sensitive environment variables are not leaked
    assert "password" not in str(data).lower()
    assert "secret_key" not in str(data).lower()


def test_security_headers_present(client):
    response = client.get("/health")
    headers = response.headers
    assert headers.get("X-Content-Type-Options") == "nosniff"
    assert headers.get("X-Frame-Options") == "DENY"
    assert headers.get("X-XSS-Protection") == "1; mode=block"


def test_upload_invalid_mime_rejected(client, seller_headers):
    # Try uploading a .exe or fake file
    fake_file = io.BytesIO(b"malicious script content")
    response = client.post(
        "/api/products/upload-image",
        files={"file": ("malicious.sh", fake_file, "text/plain")},
        headers=seller_headers
    )
    assert response.status_code == 400
    assert "Invalid image format" in response.json()["detail"]
