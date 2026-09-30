def test_order_inventory_deduction_success(client, customer_headers, sample_product):
    # sample_product has size M with stock = 5
    order_payload = {
        "items": [
            {
                "id": sample_product.id,
                "name": sample_product.name,
                "price": sample_product.price,
                "quantity": 2,
                "size": "M",
                "color": "Green",
                "image": "/half-saree-orange.jpg"
            }
        ],
        "customer_name": "Meera Patel",
        "customer_email": "meera@example.com",
        "customer_phone": "+91 91234 56789",
        "shipping_address": {
            "fullName": "Meera Patel",
            "phone": "+91 91234 56789",
            "addressLine": "12 Lotus Villa, Juhu",
            "city": "Mumbai",
            "state": "Maharashtra",
            "pincode": "400049"
        },
        "subtotal": 4398,
        "shipping_fee": 0,
        "total_amount": 4398
    }

    response = client.post("/api/orders", json=order_payload, headers=customer_headers)
    assert response.status_code == 201
    order_data = response.json()
    assert order_data["status"] == "Confirmed"
    assert "tracking_number" in order_data

    # Check that product variant stock was reduced from 5 to 3
    p_res = client.get(f"/api/products/{sample_product.id}")
    p_data = p_res.json()
    var_m = next(v for v in p_data["variants"] if v["size"] == "M")
    assert var_m["stock"] == 3


def test_order_out_of_stock_rejected(client, customer_headers, sample_product):
    # sample_product has size S with stock = 0
    order_payload = {
        "items": [
            {
                "id": sample_product.id,
                "name": sample_product.name,
                "price": sample_product.price,
                "quantity": 1,
                "size": "S",
                "color": "Green",
                "image": "/half-saree-orange.jpg"
            }
        ],
        "customer_name": "Ananya Roy",
        "customer_email": "ananya@example.com",
        "customer_phone": "+91 98888 77777",
        "shipping_address": {
            "fullName": "Ananya Roy",
            "phone": "+91 98888 77777",
            "addressLine": "45 Park Street",
            "city": "Kolkata",
            "state": "West Bengal",
            "pincode": "700016"
        },
        "subtotal": 2199,
        "shipping_fee": 0,
        "total_amount": 2199
    }

    response = client.post("/api/orders", json=order_payload, headers=customer_headers)
    assert response.status_code == 400
    assert "Insufficient stock" in response.json()["detail"]
