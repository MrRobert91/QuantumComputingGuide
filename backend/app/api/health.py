"""Health and backend-availability endpoints."""
from __future__ import annotations

from fastapi import APIRouter

from app.core.config import get_settings

router = APIRouter(tags=["meta"])


@router.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@router.get("/backends")
def backends() -> dict[str, object]:
    settings = get_settings()
    modes = ["aer"]
    if settings.ibm_enabled:
        modes.append("ibm")
    return {
        "modes": modes,
        "ibm_enabled": settings.ibm_enabled,
        "max_qubits": settings.max_qubits,
        "max_shots": settings.max_shots,
    }
