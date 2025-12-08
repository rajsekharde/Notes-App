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
                const user = await fetchMe();

                if (!user.is_admin) {
                    window.location.href = "/notes";
                    return;
                }

                setIsAdmin(true);

                const res = await authFetch(`${BASE_URL}/auth/users`);
                const data = await res.json();
                //console.log(data);
                setUsers(data);

            } catch (err) {
                window.location.href = "/login";
            } finally {
                setAuthReady(true);
            }
        }

        initializeAdmin();
    }, []);


    async function remoteLogout(id) {
        await authFetch(`${BASE_URL}/auth/logout_user/${id}`, { method: "POST" });
        const res = await authFetch(`${BASE_URL}/auth/users`);
        const data = await res.json();
        setUsers(data);
        alert("User logged out");
    }

    async function deleteUser(id) {
        if (!window.confirm("Delete this user?")) return;
        await authFetch(`${BASE_URL}/auth/users/${id}`, { method: "DELETE" });
        setUsers(prev => prev.filter(u => u.id !== id));
    }



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

            <div id="usersTableDiv">
                <table className="userTable">
                    <thead>
                        <tr>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Status</th>
                            <th style={{ width: "200px" }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.id}>
                                <td>{user.email}</td>
                                <td>{user.is_admin ? "Admin" : "User"}</td>
                                <td>
                                    <span className={user.is_logged_in ? "status-active" : "status-offline"}>
                                        {user.is_logged_in ? "Online" : "Offline"}
                                    </span>
                                </td>
                                <td>
                                    <button
                                        className="action-btn warning"
                                        onClick={() => remoteLogout(user.id)}
                                        disabled={!user.is_logged_in}
                                    >
                                        Force Logout
                                    </button>

                                    <button
                                        className="action-btn danger"
                                        onClick={() => deleteUser(user.id)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
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
