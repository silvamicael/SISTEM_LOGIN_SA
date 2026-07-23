const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export async function apiFetch(path, options = {}) {
    const headers = {
        "Content-Type": "application/json",
        ...(options.headers || {})
    };

    const response = await fetch(`${API_URL}${path}`, {
        ...options,
        headers,
        credentials: "include"
    });

    const data = await response.json().catch(() => ({}));

    if (response.status === 401) {
        window.dispatchEvent(new Event("auth:logout"));
    }

    if (!response.ok) {
        throw new Error(data.erro || data.mensagem || "Erro na requisição.");
    }

    return data;
}

export { API_URL };
