import pytest
from sqlmodel import SQLModel, create_engine, Session
from fastapi.testclient import TestClient
from app.main import app
from app.database import get_session

TEST_DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(TEST_DATABASE_URL, connect_args={"check_same_thread": False})

def get_test_session():
    with Session(engine) as session:
        yield session

@pytest.fixture(scope="module")
def client():
    SQLModel.metadata.create_all(engine)
    app.dependency_overrides[get_session] = get_test_session

    with TestClient(app) as c:
        yield c

    SQLModel.metadata.drop_all(engine)

@pytest.fixture()
def auth_headers(client):
    # Register user
    client.post("/auth/register", json={
        "email": "test@example.com",
        "password": "password123"
    })

    # Login user
    client.post("/auth/login", json={
        "email": "test@example.com",
        "password": "password123"
    })

    # No token needed — use empty headers
    return {}

test_engine = engine