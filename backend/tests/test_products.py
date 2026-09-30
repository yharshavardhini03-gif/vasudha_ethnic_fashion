def test_seller_create_product(client, seller_headers):
    payload = {
        "name": "Royal Emerald Kanjivaram Saree",
        "category": "Sarees",
        "sub_category": "Silk Sarees",
        "price": 4999,
        "original_price": 6999,
        "fabric": "Pure Silk",
        "color": "Emerald Green",
        "colors": ["Emerald Green", "Gold"],
        "sizes": ["Free Size"],
        "images": ["/half-saree-orange.jpg"],
        "description": "Exquisite handwoven Kanjivaram silk saree with pure gold zari borders.",
        "occasions": ["Wedding", "Festive"],
        "variants": [
            {"size": "Free Size", "color": "Emerald Green", "stock": 4},
            {"size": "Free Size", "color": "Gold", "stock": 2}
        ]
    }
    response = client.post("/api/products", json=payload, headers=seller_headers)
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == payload["name"]
    assert data["price"] == 4999
    assert data["stock"] == 6  # 4 + 2
    assert len(data["variants"]) == 2


def test_list_products_public(client, sample_product):
    response = client.get("/api/products")
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 1
    assert any(p["id"] == sample_product.id for p in data)


def test_seller_update_variant_stock(client, seller_headers, sample_product):
    # Update size M stock from 5 to 0
    response = client.patch(
        f"/api/products/{sample_product.id}/variants/stock",
        json={"size": "M", "color": "Green", "stock": 0},
        headers=seller_headers
    )
    assert response.status_code == 200
    data = response.json()
    # Find variant M
    var_m = next(v for v in data["variants"] if v["size"] == "M")
    assert var_m["stock"] == 0
