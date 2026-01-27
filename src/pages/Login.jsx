import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import "../styles/login.css";   // 👈 ADD THIS

export default function Login() {
    const [form, setForm] = useState({
        email: "",
        password: ""
    });

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await API.post("/auth/login", form);
            localStorage.setItem("token", res.data.token);
            navigate("/chat");
        } catch (err) {
            alert(err.response?.data?.message || "Login failed");
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h2 className="login-title">Welcome Back 👋</h2>
                <p className="login-subtitle">Login to continue chatting</p>

                <form onSubmit={handleSubmit}>
                    <input
                        type="email"
                        placeholder="Email"
                        onChange={(e) =>
                            setForm({ ...form, email: e.target.value })
                        }
                        required
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        onChange={(e) =>
                            setForm({ ...form, password: e.target.value })
                        }
                        required
                    />

                    <button type="submit">Login</button>
                </form>

                <p className="login-footer">
                    Don’t have an account?{" "}
                    <span onClick={() => navigate("/")}>
                        Register
                    </span>
                </p>
            </div>
        </div>
    );
}
