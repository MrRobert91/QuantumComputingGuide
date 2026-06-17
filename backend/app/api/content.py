"""Serve exercise definitions and validate user solutions.

Exercises live in ``app/content/exercises.json``. The reference ``solution`` is never
sent to the client (this is a learning tool, but we still avoid handing over answers);
it is only used server-side by the validator.
"""
from __future__ import annotations

import json
from functools import lru_cache
from pathlib import Path

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.models.circuit import ComposerCircuit
from app.services import circuit_model
from app.services.sandbox import SandboxError, run_user_code_to_qasm
from app.services.validator import check_equivalence
from qiskit.qasm3 import loads as qasm3_loads

router = APIRouter(prefix="/content", tags=["content"])

_CONTENT_DIR = Path(__file__).resolve().parent.parent / "content"


@lru_cache
def _load_exercises() -> dict[str, dict]:
    raw = json.loads((_CONTENT_DIR / "exercises.json").read_text())
    return {ex["id"]: ex for ex in raw}


def _public_view(ex: dict) -> dict:
    """Strip the reference solution before sending to the client."""
    return {k: v for k, v in ex.items() if k != "solution"}


@router.get("/exercises")
def list_exercises() -> list[dict]:
    return [_public_view(ex) for ex in _load_exercises().values()]


@router.get("/exercises/{exercise_id}")
def get_exercise(exercise_id: str) -> dict:
    ex = _load_exercises().get(exercise_id)
    if ex is None:
        raise HTTPException(404, "Exercise not found.")
    return _public_view(ex)


class ValidateRequest(BaseModel):
    composer: ComposerCircuit | None = None
    code: str | None = None


class ValidateResponse(BaseModel):
    passed: bool
    message: str


@router.post("/exercises/{exercise_id}/validate", response_model=ValidateResponse)
def validate_exercise(exercise_id: str, req: ValidateRequest) -> ValidateResponse:
    ex = _load_exercises().get(exercise_id)
    if ex is None:
        raise HTTPException(404, "Exercise not found.")

    try:
        if req.code:
            user_qc = qasm3_loads(run_user_code_to_qasm(req.code))
        elif req.composer is not None:
            user_qc = circuit_model.composer_to_circuit(req.composer)
        else:
            raise HTTPException(400, "Provide either composer or code.")
        reference = circuit_model.composer_to_circuit(
            ComposerCircuit(**ex["solution"])
        )
    except SandboxError as exc:
        raise HTTPException(400, str(exc)) from exc
    except ValueError as exc:
        raise HTTPException(400, str(exc)) from exc

    passed, message = check_equivalence(user_qc, reference)
    return ValidateResponse(passed=passed, message=message)
