import { useState } from "react";
import { loginUser } from "../auth/auth";
import { useNavigate } from "react-router-dom";
import "./Notes.css";

export default function Login() {
    const navigate = useNavigate();
    const [mode, setMode] = useState("login");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        //console.log("BASE_URL =", import.meta.env.VITE_API_URL);

        const email = e.target.email.value;
        const password = e.target.password.value;

        //console.log("Submitting login…", email, password);

        if (mode === "register") {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            if (!res.ok) {
                setError("Registration failed. Try a different email.");
                setLoading(false);
                return;
            }

            alert("Registration successful! Please login.");
            e.target.reset();
            setMode("login");

            return;
        }
        setLoading(true);

        try {
            await loginUser(email, password);
            e.target.reset();
            setLoading(false);
            navigate("/notes");
        } catch {
            setError("Invalid email or password");
            setLoading(false);
        }
    }
    if (loading) {
        return (
            <div id="loadingDiv">
                <h2 id="loadingHeading">Loading...</h2>
            </div>
        );
    }

    return (
        <div id="pageContainer">
            <header className="pageHeader">
                <h1 className="pageTitle">Notes App</h1>
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
                        document.getElementById("loginForm").reset();
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
