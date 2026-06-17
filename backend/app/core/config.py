"""Application settings, loaded from environment variables / .env."""
from __future__ import annotations

from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    # IBM Quantum (optional). When token is set, the IBM execution mode is offered.
    ibm_quantum_token: str = ""
    ibm_quantum_channel: str = "ibm_quantum_platform"
    ibm_quantum_instance: str = ""

    # Comma-separated list of allowed CORS origins.
    cors_origins: str = "http://localhost:5173,http://localhost:8080,http://localhost"

    # Sandbox limits for user-submitted Qiskit code.
    sandbox_timeout_seconds: int = 10
    sandbox_max_memory_mb: int = 512

    # Safety cap so simulations never blow up the container.
    max_qubits: int = 12
    max_shots: int = 100_000

    @property
    def cors_origin_list(self) -> list[str]:
        return [o.strip() for o in self.cors_origins.split(",") if o.strip()]

    @property
    def ibm_enabled(self) -> bool:
        return bool(self.ibm_quantum_token)


@lru_cache
def get_settings() -> Settings:
    return Settings()
