import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import "../styles/register.css"; // 👈 ADD THIS

export default function Register() {
    const [form, setForm] = useState({
        username: "",
        email: "",
        password: ""
    });

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await API.post("/auth/register", form);
            navigate("/login");
        } catch (err) {
            alert(err.response?.data?.message || "Registration failed");
        }
    };

    return (
        <div className="register-container">
            <div className="register-card">
                <h2 className="register-title">Create Account ✨</h2>
                <p className="register-subtitle">
                    Join Vibechat and start chatting
                </p>

                <form onSubmit={handleSubmit}>
                    <input
                        placeholder="Username"
                        onChange={(e) =>
                            setForm({ ...form, username: e.target.value })
                        }
                        required
                    />

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

                    <button type="submit">Register</button>
                </form>

                <p className="register-footer">
                    Already have an account?{" "}
                    <span onClick={() => navigate("/login")}>Login</span>
                </p>
            </div>
        </div>
    );
}
