import os
import bcrypt
import jwt
from typing import Annotated
from datetime import datetime, UTC, timedelta
from dotenv import load_dotenv
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer

from src.auth.user import User, UserInDB

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

users_db: dict[str, UserInDB] = {}

load_dotenv()
SECRET_KEY = os.getenv("SECRET_KEY")


def add_initial_user():
    if len(users_db) == 0:
        initial_user_name = os.getenv("INITIAL_USER_NAME")
        initial_user_password = os.getenv("INITIAL_USER_PASSWORD")
        salt = bcrypt.gensalt()
        hashed_password = hash_password(initial_user_password, salt)
        user = UserInDB(
            username=initial_user_name,
            salt=salt,
            hashed_password=hashed_password,
        )
    users_db[user.username] = user


def hash_password(password: str, salt: bytes) -> str:
    password_bytes = password.encode("utf-8")
    hashed_password = bcrypt.hashpw(password_bytes, salt=salt)
    return hashed_password.decode("utf-8")


def get_user(db, username: str):
    if username in db:
        user = db[username]
        return user


def decode_token(token: str):
    try:
        decoded = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        user_name = decoded["username"]
        return get_user(users_db, user_name)
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=400, detail="Signature has expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=400, detail="Invalid token")


def encode_token(username: str):
    payload = {
        "exp": datetime.now(UTC) + timedelta(days=2),
        "iat": datetime.now(UTC),
        "username": username,
    }
    token = jwt.encode(payload, SECRET_KEY, algorithm="HS256")
    return token


async def get_current_user(token: Annotated[str, Depends(oauth2_scheme)]):
    user = decode_token(token)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return user


async def get_current_active_user(
    current_user: Annotated[User, Depends(get_current_user)],
):
    if current_user.disabled:
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user
