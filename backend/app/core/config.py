from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str

    SECRET_KEY: str
    ACCESS_TOKEN_EXPIRE_MINS: int
    REFRESH_TOKEN_EXPIRE_DAYS: int

    class Config:
        env_file = ".env"

settings = Settings()