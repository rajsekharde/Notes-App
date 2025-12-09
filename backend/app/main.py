from fastapi import FastAPI
from app.routes.notes import router as notes_router
from app.routes.auth import router as auth_router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = [
    "http://localhost",
    "http://localhost:80",
    "http://localhost:5173",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(notes_router) # Add all the routes from notes_router into this main app
app.include_router(auth_router)

@app.get("/")
def root():
    return {"Message": "Welcome to Notes App"}

@app.get("/health")
def health_check():
    return {"status": "ok"}