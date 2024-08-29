import json
from typing import Annotated

from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from src.models.model import Annotation, EvaluationBatch
from src.auth.user import User
from src.auth.auth import (
    decode_token,
    encode_token,
    hash_password,
    users_db,
    oauth2_scheme,
    add_initial_user,
)

app = FastAPI(openapi_prefix="/api")
add_initial_user()


async def get_current_user(token: Annotated[str, Depends(oauth2_scheme)]):
    user = decode_token(token)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return User(username=user.username)


async def get_current_active_user(
    current_user: Annotated[User, Depends(get_current_user)],
):
    return current_user


@app.post("/token")
async def login(form_data: Annotated[OAuth2PasswordRequestForm, Depends()]):
    user = users_db.get(form_data.username)
    if not user:
        raise HTTPException(status_code=400, detail="Incorrect username or password")
    hashed_password = hash_password(form_data.password, user.salt)
    if not hashed_password == user.hashed_password:
        raise HTTPException(status_code=400, detail="Incorrect username or password")

    return {"access_token": encode_token(user.username), "token_type": "bearer"}


@app.get("/annotations/completed")
async def get_annotation_count(_: Annotated[User, Depends(get_current_active_user)]):
    # read json from file
    with open("data/expert_annotations.json", "r") as f:
        data = f.read()
        data = json.loads(data)
        data = [EvaluationBatch.model_validate(d) for d in data]
        completed_indices = [i for i, d in enumerate(data) if d.annotation is not None]
        return {"total": len(data), "completed": completed_indices}


@app.get("/annotations/{id}")
async def get_annotation_item(
    id: int,
    _: Annotated[User, Depends(get_current_active_user)],
):
    # read json from file
    with open("data/expert_annotations.json", "r") as f:
        data = f.read()
        data = json.loads(data)
        data = [EvaluationBatch.model_validate(d) for d in data]
        return data[id]


@app.post("/annotations/{id}/add")
async def add_annotation(
    id: int,
    annotation: Annotation,
    _: Annotated[User, Depends(get_current_active_user)],
):
    # read / write json from file
    data = None
    with open("data/expert_annotations.json", "r") as f:
        data = f.read()
        data = json.loads(data)
        data = [EvaluationBatch.model_validate(d) for d in data]
        data[id].annotation = annotation
    if data:
        with open("data/expert_annotations.json", "w") as f:
            f.write(json.dumps([d.model_dump() for d in data], indent=4))
    return {"status": "success"}
