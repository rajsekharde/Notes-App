def test_register_user(client):
    response = client.post("/auth/register", json={
        "email": "newuser@example.com",
        "password": "securepassword"
    })
    assert response.status_code == 200
    data = response.json()
    assert "id" in data
    assert data["email"] == "newuser@example.com"

def test_login_user(client):
    client.post("/auth/register", json={
        "email": "loginuser@example.com",
        "password": "password123"
    })

    response = client.post("/auth/login", json={
        "email": "loginuser@example.com",
        "password": "password123"
    })

    assert response.status_code == 200
    data = response.json()

    # Your backend returns the user object, not tokens
    assert data["email"] == "loginuser@example.com"
    assert data["id"] > 0


def test_login_wrong_password(client):
    client.post("/auth/register", json={
        "email": "wrongpass@example.com",
        "password": "correctpass"
    })

    response = client.post("/auth/login", json={
        "email": "wrongpass@example.com",
        "password": "wrongpass"
    })
    assert response.status_code == 401

def test_get_users_requires_admin(client):
    # Create normal user
    client.post("/auth/register", json={
        "email": "user@example.com",
        "password": "password123"
    })

    # Login as normal user
    client.post("/auth/login", json={
        "email": "user@example.com",
        "password": "password123"
    })

    response = client.get("/auth/users")
    assert response.status_code == 403


from sqlmodel import Session, select
from app.database import get_session
from app.models import User
from app.security import create_access_token
from tests.conftest import test_engine   # ← import test engine

def test_admin_can_get_users(client):
    # 1. Register normal user
    client.post("/auth/register", json={
        "email": "admin@example.com",
        "password": "adminpass"
    })

    # 2. Promote that user to admin in the test DB
    with Session(test_engine) as session:
        user = session.exec(select(User).where(User.email == "admin@example.com")).first()
        user.is_admin = True
        session.add(user)
        session.commit()

    # 3. Login to get user id
    login = client.post("/auth/login", json={
        "email": "admin@example.com",
        "password": "adminpass"
    })

    user_data = login.json()

    token = create_access_token({"sub": str(user_data["id"])})

    headers = {"Authorization": f"Bearer {token}"}

    # 4. Access admin route
    response = client.get("/auth/users", headers=headers)

    assert response.status_code == 200
    assert isinstance(response.json(), list)
