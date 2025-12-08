import { useState } from "react";
import { loginUser } from "../auth/auth";
import { useNavigate } from "react-router-dom";
import "./Notes.css";

export default function Login() {
    const navigate = useNavigate();
    const [mode, setMode] = useState("login");
    const [error, setError] = useState("");

    async function handleSubmit(e) {
        e.preventDefault();
        console.log("BASE_URL =", import.meta.env.VITE_API_URL);

        const email = e.target.email.value;
        const password = e.target.password.value;

        console.log("Submitting login…", email, password);

        if (mode === "register") {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            if (!res.ok) {
                setError("Registration failed. Try a different email.");
                return;
            }
            alert("Registration successful! Please login.");
            setMode("login");
            return;
        }

        try {
            await loginUser(email, password);
            navigate("/notes");
        } catch {
            setError("Invalid email or password");
        }
    }

    return (
        <div id="pageContainer">
            <header className="pageHeader">
                <h1 className="pageTitle">{mode === "login" ? "Login" : "Register"}</h1>
            </header>

            <form id="loginForm" onSubmit={handleSubmit}>
                <input className="loginInput" name="email" type="email" placeholder="Email" required />
                <input className="loginInput" name="password" type="password" placeholder="Password" required />
                {error && <p className="errorText">{error}</p>}
                <div id="buttonDiv">
                    <button className="loginButton">
                        {mode === "login" ? "Login" : "Register"}
                    </button>
                </div>
                <p
                    id="registerParagraph"
                    className="registerParagraph"
                    onClick={() => {
                        setError("");
                        setMode(mode === "login" ? "register" : "login");
                    }}
                >
                    {mode === "login"
                        ? "New user? Register here"
                        : "Already have an account? Login"}
                </p>
            </form>
        </div>
    );
}
