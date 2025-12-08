import { useEffect, useState } from "react";
import { authFetch, logoutUser, isLoggedIn, fetchMe } from "../auth/auth";
import "./Notes.css";
import { useNavigate } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_API_URL;

export default function AdminDashboard() {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [authReady, setAuthReady] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        async function initializeAdmin() {
            try {
                const user = await fetchMe(); // FIX 1: use fetchMe

                if (!user.is_admin) {
                    window.location.href = "/notes";
                    return;
                }

                setIsAdmin(true);

                const res = await authFetch(`${BASE_URL}/auth/users`);
                const data = await res.json();
                setUsers(data);

            } catch (err) {
                window.location.href = "/login";
            } finally {
                setAuthReady(true); // FIX 2: allow page to render
            }
        }

        initializeAdmin();
    }, []);




    async function loadUsers() {
        const res = await authFetch(`${BASE_URL}/auth/users`);
        if (res.status === 403) {
            alert("You are not authorized to view this page.");
            window.location.href = "/notes";
            return;
        }
        const data = await res.json();
        setUsers(data);
    }

    if (!authReady) {
        return (
            <div id="loadingDiv">
                <h2 id="loadingHeading">Loading...</h2>
            </div>
        );
    }

    return (
        <div id="pageContainer">
            <header className="pageHeader">
                <h1 className="pageTitle">Admin Dashboard</h1>
            </header>

            <div id="notesGridDiv">
                {users.map(user => (
                    <div key={user.id} className="notesCard">
                        <h3>{user.email}</h3>
                        <small>ID: {user.id}</small><br />
                        <small>{user.is_admin ? "Admin" : "User"}</small>
                    </div>
                ))}
            </div>
            <button
                id="notesButton"
                onClick={() => (navigate("/notes"))}
            >
                Notes
            </button>

            <button
                id="logoutButton"
                onClick={logoutUser}
            >
                Logout
            </button>
        </div>
    );
}
