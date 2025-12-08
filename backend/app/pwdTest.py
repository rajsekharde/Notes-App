from passlib.hash import argon2
from app.core.config import settings

TEST_PASSWORD = settings.ADMIN_PASSWORD

#print(argon2.hash(TEST_PASSWORD))

TEST_HASHED_PWD = argon2.hash(TEST_PASSWORD)