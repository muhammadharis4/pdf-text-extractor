from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    APP_NAME: str = "PDF Text Extractor API"
    APP_VERSION: str = "1.0.0"
    API_PREFIX: str = "/api"
    CORS_ORIGINS: list[str] = ["http://localhost:5173", "http://localhost:3000"]
    MAX_FILE_SIZE: int = 10 * 1024 * 1024

    model_config = {
        "env_file": ".env",
        "env_file_encoding": "utf-8"
    }

settings = Settings()
