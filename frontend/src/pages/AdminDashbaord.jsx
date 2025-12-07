import { useEffect, useState } from "react";
import { authFetch, logoutUser, isLoggedIn } from "../auth/auth";
import "../Notes.css";

const BASE_URL = import.meta.env.VITE_API_URL;

export default function AdminDashboard() {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        if (!isLoggedIn()) {
            window.location.href = "/login";
            return;
        }
        loadUsers();
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

    return (
        <div id="pageContainer">
            <header className="pageHeader">
                <h1 className="pageTitle">Admin Dashboard</h1>

                <button
                    className="floatingButton"
                    style={{ position: "relative", width: "auto", padding: "6px 12px" }}
                    onClick={logoutUser}
                >
                    Logout
                </button>
            </header>

            <div id="notesGridDiv">
                {users.map(user => (
                    <div key={user.id} className="notesCard">
                        <h3>{user.email}</h3>
                        <small>ID: {user.id}</small><br/>
                        <small>{user.is_admin ? "Admin" : "User"}</small>
                    </div>
                ))}
            </div>
        </div>
    );
}
