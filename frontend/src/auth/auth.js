const BASE_URL = import.meta.env.VITE_API_URL;

let accessToken = null;
accessToken = localStorage.getItem("access_token");

export async function loginUser(email, password) {
    const res = await fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
    });

    if (!res.ok) throw new Error("Invalid credentials");

    return true;
}


export async function logoutUser() {
    await fetch(`${BASE_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
    });
    window.location.href = "/login";
}

export async function authFetch(url, options = {}) {
    let res = await fetch(url, {
        ...options,
        credentials: "include",
    });

    if (res.status === 401) {
        window.location.href = "/login";
        return;
    }

    return res;
}



export function isLoggedIn() {
    return false;
}

export async function fetchMe() {
    const res = await authFetch(`${BASE_URL}/auth/me`);
    return res.json();
}
