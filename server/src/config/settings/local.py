from .base import *
from corsheaders.defaults import default_headers

DEBUG = True

ALLOWED_HOSTS = ["localhost", "127.0.0.1"]

CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

CORS_ALLOW_HEADERS = list(default_headers) + [
    "X-ORG-SLUG",
]

CORS_ALLOW_CREDENTIALS = True
