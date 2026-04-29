"""Backend API tests for Be Dental Paradise."""
import os
import uuid
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://dental-admin-hub-2.preview.emergentagent.com").rstrip("/")
API = f"{BASE_URL}/api"

ADMIN_EMAIL = "admin@bedentalparadise.com"
ADMIN_PASSWORD = "Paradise@2026"


# ---------- Fixtures ----------
@pytest.fixture(scope="session")
def public_client():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


@pytest.fixture(scope="session")
def admin_client():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    r = s.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD})
    assert r.status_code == 200, f"Admin login failed: {r.status_code} {r.text}"
    # verify cookies set
    assert "access_token" in s.cookies, "access_token cookie not set"
    assert "refresh_token" in s.cookies, "refresh_token cookie not set"
    return s


# ---------- Health ----------
class TestHealth:
    def test_root(self, public_client):
        r = public_client.get(f"{API}/")
        assert r.status_code == 200
        assert r.json().get("status") == "ok"


# ---------- Auth ----------
class TestAuth:
    def test_login_success(self, public_client):
        r = public_client.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD})
        assert r.status_code == 200
        data = r.json()
        assert data["email"] == ADMIN_EMAIL
        assert data["role"] == "admin"
        assert "id" in data
        # check cookies
        cookies = r.cookies
        assert "access_token" in cookies
        assert "refresh_token" in cookies

    def test_login_invalid(self, public_client):
        r = public_client.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": "wrong"})
        assert r.status_code == 401

    def test_me_requires_auth(self, public_client):
        s = requests.Session()
        r = s.get(f"{API}/auth/me")
        assert r.status_code == 401

    def test_me_with_cookies(self, admin_client):
        r = admin_client.get(f"{API}/auth/me")
        assert r.status_code == 200
        assert r.json()["email"] == ADMIN_EMAIL
        assert r.json()["role"] == "admin"

    def test_refresh(self, admin_client):
        r = admin_client.post(f"{API}/auth/refresh")
        assert r.status_code == 200
        assert r.json().get("message")

    def test_logout_then_me_unauth(self):
        s = requests.Session()
        s.headers.update({"Content-Type": "application/json"})
        r = s.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD})
        assert r.status_code == 200
        assert s.get(f"{API}/auth/me").status_code == 200
        r2 = s.post(f"{API}/auth/logout")
        assert r2.status_code == 200
        # cookies should be cleared by server; clear client too just in case
        s.cookies.clear()
        r3 = s.get(f"{API}/auth/me")
        assert r3.status_code == 401


# ---------- Appointments ----------
class TestAppointments:
    created_id = None

    def test_public_create_appointment(self, public_client):
        payload = {
            "name": "TEST_John",
            "email": "TEST_john@example.com",
            "phone": "+15551234567",
            "service": "General Dentistry",
            "preferred_date": "2026-06-15",
            "preferred_time": "10:00",
            "notes": "Test booking",
        }
        r = public_client.post(f"{API}/appointments", json=payload)
        assert r.status_code == 200, r.text
        data = r.json()
        assert data["status"] == "pending"
        assert data["name"] == "TEST_John"
        assert "id" in data
        TestAppointments.created_id = data["id"]

    def test_list_without_auth_is_401(self, public_client):
        s = requests.Session()
        r = s.get(f"{API}/appointments")
        assert r.status_code == 401

    def test_list_admin(self, admin_client):
        r = admin_client.get(f"{API}/appointments")
        assert r.status_code == 200
        rows = r.json()
        assert isinstance(rows, list)
        ids = [x["id"] for x in rows]
        assert TestAppointments.created_id in ids

    def test_update_status(self, admin_client):
        assert TestAppointments.created_id
        r = admin_client.patch(f"{API}/appointments/{TestAppointments.created_id}", json={"status": "confirmed"})
        assert r.status_code == 200
        assert r.json()["status"] == "confirmed"

    def test_invalid_status(self, admin_client):
        r = admin_client.patch(f"{API}/appointments/{TestAppointments.created_id}", json={"status": "bogus"})
        assert r.status_code == 422

    def test_delete(self, admin_client):
        r = admin_client.delete(f"{API}/appointments/{TestAppointments.created_id}")
        assert r.status_code == 200
        # verify gone
        r2 = admin_client.patch(f"{API}/appointments/{TestAppointments.created_id}", json={"status": "completed"})
        assert r2.status_code == 404

    def test_create_missing_fields(self, public_client):
        r = public_client.post(f"{API}/appointments", json={"name": "x"})
        assert r.status_code == 422


# ---------- Payments ----------
class TestPayments:
    pid = None

    def test_create_requires_admin(self, public_client):
        s = requests.Session()
        r = s.post(f"{API}/payments", json={
            "patient_name": "X", "patient_email": "x@y.com", "service": "Cleaning", "amount": 50
        })
        assert r.status_code == 401

    def test_create(self, admin_client):
        r = admin_client.post(f"{API}/payments", json={
            "patient_name": "TEST_Jane",
            "patient_email": "TEST_jane@example.com",
            "service": "Whitening",
            "amount": 250.0,
            "status": "pending",
            "method": "card",
        })
        assert r.status_code == 200, r.text
        data = r.json()
        assert data["amount"] == 250.0
        assert data["status"] == "pending"
        TestPayments.pid = data["id"]

    def test_list(self, admin_client):
        r = admin_client.get(f"{API}/payments")
        assert r.status_code == 200
        assert any(p["id"] == TestPayments.pid for p in r.json())

    def test_update_status(self, admin_client):
        r = admin_client.patch(f"{API}/payments/{TestPayments.pid}", json={"status": "paid"})
        assert r.status_code == 200
        assert r.json()["status"] == "paid"

    def test_delete(self, admin_client):
        r = admin_client.delete(f"{API}/payments/{TestPayments.pid}")
        assert r.status_code == 200
        r2 = admin_client.patch(f"{API}/payments/{TestPayments.pid}", json={"status": "refunded"})
        assert r2.status_code == 404


# ---------- Contact ----------
class TestContact:
    def test_public_submit(self, public_client):
        r = public_client.post(f"{API}/contact", json={
            "name": "TEST_Alice", "email": "TEST_alice@example.com", "message": "Hello there"
        })
        assert r.status_code == 200
        assert r.json()["name"] == "TEST_Alice"

    def test_list_requires_admin(self, public_client):
        s = requests.Session()
        assert s.get(f"{API}/contact").status_code == 401

    def test_list_admin(self, admin_client):
        r = admin_client.get(f"{API}/contact")
        assert r.status_code == 200
        assert isinstance(r.json(), list)


# ---------- Stats ----------
class TestStats:
    def test_requires_admin(self):
        s = requests.Session()
        assert s.get(f"{API}/admin/stats").status_code == 401

    def test_stats(self, admin_client):
        r = admin_client.get(f"{API}/admin/stats")
        assert r.status_code == 200
        data = r.json()
        assert "appointments" in data
        assert "payments" in data
        assert "contacts" in data
        assert "revenue" in data["payments"]
