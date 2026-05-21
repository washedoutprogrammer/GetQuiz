import os
from dotenv import load_dotenv

# Load custom environment variables from .env file
load_dotenv()


def _parse_cors_origins() -> list:
    """
    Read CORS_ORIGINS from the environment.
    Accepts a comma-separated string, e.g.:
        CORS_ORIGINS=https://getquiz.onrender.com,https://mysite.com
    Falls back to the standard local-dev ports when the variable is absent.
    """
    raw = os.getenv("CORS_ORIGINS", "").strip()
    if raw:
        return [origin.strip() for origin in raw.split(",") if origin.strip()]
    # Local-development defaults
    return [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5174",
        "http://localhost:5175",
        "http://127.0.0.1:5175",
    ]


class Settings:
    PROJECT_NAME: str = "GetQuiz AI API"
    VERSION: str = "1.0.0"

    # API Keys — loaded from environment / .env file
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    OPENROUTER_API_KEY: str = os.getenv("OPENROUTER_API_KEY", "")

    # Allowed CORS origins (local dev defaults + any extras from CORS_ORIGINS env)
    CORS_ORIGINS: list = _parse_cors_origins()


settings = Settings()
