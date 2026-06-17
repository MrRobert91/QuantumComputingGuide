"""FastAPI application entrypoint for the Qiskit certification prep backend."""
from __future__ import annotations

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api import circuits, content, health
from app.core.config import get_settings

settings = get_settings()

app = FastAPI(
    title="Qiskit Cert Prep API",
    description="Backend for the Qiskit v2.x Developer certification prep app: "
    "circuit execution (Aer/IBM), composer<->code conversion, and exercise validation.",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router, prefix="/api")
app.include_router(circuits.router, prefix="/api")
app.include_router(content.router, prefix="/api")


@app.get("/")
def root() -> dict[str, str]:
    return {"service": "qiskit-cert-prep", "docs": "/docs"}
