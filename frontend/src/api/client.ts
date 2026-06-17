import type {
  BackendsInfo,
  ComposerCircuit,
  ConversionResponse,
  Exercise,
  ExecuteResponse,
  ValidateResponse,
} from "./types";

const BASE = "/api";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...init,
  });
  if (!res.ok) {
    let detail = res.statusText;
    try {
      const body = await res.json();
      detail = body.detail ?? detail;
    } catch {
      /* ignore */
    }
    throw new Error(detail);
  }
  return res.json() as Promise<T>;
}

export const api = {
  backends: () => request<BackendsInfo>("/backends"),

  executeComposer: (composer: ComposerCircuit, shots: number, mode: string) =>
    request<ExecuteResponse>("/circuits/execute", {
      method: "POST",
      body: JSON.stringify({ source_type: "composer", composer, shots, mode }),
    }),

  executeCode: (code: string, shots: number, mode: string) =>
    request<ExecuteResponse>("/circuits/execute", {
      method: "POST",
      body: JSON.stringify({ source_type: "code", code, shots, mode }),
    }),

  toCode: (composer: ComposerCircuit) =>
    request<ConversionResponse>("/circuits/to-code", {
      method: "POST",
      body: JSON.stringify(composer),
    }),

  fromCode: (code: string) =>
    request<ConversionResponse>("/circuits/from-code", {
      method: "POST",
      body: JSON.stringify({ code }),
    }),

  exercises: () => request<Exercise[]>("/content/exercises"),

  validate: (
    exerciseId: string,
    payload: { composer?: ComposerCircuit; code?: string }
  ) =>
    request<ValidateResponse>(`/content/exercises/${exerciseId}/validate`, {
      method: "POST",
      body: JSON.stringify(payload),
    }),
};
