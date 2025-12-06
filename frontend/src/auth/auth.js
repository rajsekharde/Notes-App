const API_URL = "http://localhost:8000"

let accessToken = null

export async function login(email, password) {
    const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({email, password})
    });

    if (!res.ok)
        throw new Error("Invalid Email or Password");

    const data = await res.json();

    accessToken = data.access_token;
    localStorage.setItem("refresh_token", data.refresh_token)
}

export function logout() {
    const refreshToken = localStorage.getItem("refresh_token");
    if (!refreshToken) {
        fetch(`${API_URL}/auth/logout`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(refreshToken),
        });
    }
    localStorage.removeItem("refresh_token");
    accessToken = null;
}

async function refreshAccessToken() {
    const refreshToken = localStorage.getItem("refresh_token");
    if (!refreshToken) return null;

    const res = await fetch(`${API_URL}/auth/refresh`, {
        method: "POST",
        headers: {"Content-Type": "applicatio/json"},
        body: JSON.stringify(refreshToken),
    });

    if(!res.ok) return null;

    const data = await res.json();
    accessToken = data.access_token;
    return accessToken;
}

export async function authFetch(url, options = {}) {
    if (!accessToken) {
        const refreshed = await refreshAccessToken();
        if (!refreshed) throw new Error("Not authenticated");
    }

    options.headers = {
        ...(options.headers || {}),
        Authorization: `Bearer ${accessToken}`
    };

    let res = await fetch(url, options);

    if (res.status == 401) {
        const refreshed = await refreshAccessToken();
        if (!refreshed) throw new Error("Authentication expired");
        options.headers.Authorization = `${accessToken}`;
        res = await fetch(url, options);
    }

    return res;
}

export function isLoggedIn() {
    return !!localStorage.getItem("refresh_token");
}