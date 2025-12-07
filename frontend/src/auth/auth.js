const BASE_URL = import.meta.env.VITE_API_URL;

let accessToken = null;
accessToken = localStorage.getItem("access_token");

export async function loginUser(email, password) {
    const res = await fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    });

    if (!res.ok) throw new Error("Invalid credentials");

    const data = await res.json();

    accessToken = data.access_token;

    localStorage.setItem("access_token", data.access_token);
    localStorage.setItem("refresh_token", data.refresh_token);

    return true;
}


export function logoutUser() {
    const refresh_token = localStorage.getItem("refresh_token");
    if (refresh_token) {
        fetch(`${BASE_URL}/auth/logout`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refresh_token }),
        });
    }
    accessToken = null;
    localStorage.clear();
    window.location.href = "/login";
    return localStorage.getItem("refresh_token") !== null;
}

async function refreshToken() {
    const refresh_token = localStorage.getItem("refresh_token");
    if (!refresh_token) return null;

    const res = await fetch(`${BASE_URL}/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh_token }),
    });

    if (!res.ok) return null;

    const data = await res.json();
    accessToken = data.access_token;
    return accessToken;
}

export async function authFetch(url, options = {}) {
    if (!accessToken) {
        const newToken = await refreshToken();
        if (!newToken) {
            logoutUser();
            return;
        }
        accessToken = newToken;
    }

    options.headers = {
        ...(options.headers || {}),
        Authorization: `Bearer ${accessToken}`,
    };

    let res = await fetch(url, options);

    if (res.status === 401) {
        const newToken = await refreshToken();
        if (!newToken) {
            logoutUser();
            return;
        }
        options.headers.Authorization = `Bearer ${newToken}`;
        res = await fetch(url, options);
    }

    return res;
}


export function isLoggedIn() {
    return localStorage.getItem("refresh_token") !== null;
}

export async function fetchMe() {
    const res = await authFetch(`${BASE_URL}/auth/me`);
    return res.json();
}
