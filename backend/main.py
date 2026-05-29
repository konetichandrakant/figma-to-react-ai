from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base
from routers import auth_router, project_router, generate_router

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Figma to React AI",
    description="AI-powered Low-Code UI Generator",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router.router)
app.include_router(project_router.router)
app.include_router(generate_router.router)


@app.get("/api/health")
def health():
    return {"status": "ok", "service": "figma-to-react-ai"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
