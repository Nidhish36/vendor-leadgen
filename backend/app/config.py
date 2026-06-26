from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file="../.env", env_file_encoding="utf-8")

    GOOGLE_PLACES_API_KEY: str = ""
    DATABASE_URL: str = "postgresql://leadgen_user:leadgen_pass@localhost:5432/vendor_leadgen"
    REDIS_URL: str = "redis://localhost:6379/0"
    ENVIRONMENT: str = "development"


settings = Settings()