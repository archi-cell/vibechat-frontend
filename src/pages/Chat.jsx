import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createSocket } from "../socket";
import "../styles/chat.css"; // 👈 ADD THIS



const Chat = () => {
    const [socket, setSocket] = useState(null);
    const navigate = useNavigate();

    const [myId, setMyId] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);

    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [typingUser, setTypingUser] = useState(null);

    // 🔓 LOGOUT
    const handleLogout = () => {
        if (socket) socket.disconnect();
        localStorage.removeItem("token");
        navigate("/login");
    };

    // 🔌 SOCKET INIT
    useEffect(() => {
        const token = localStorage.getItem("token");
        const s = createSocket(token);

        setSocket(s);

        s.on("me", setMyId);
        s.on("online-users", setOnlineUsers);

        s.on("private-message", (data) =>
            setMessages((prev) => [...prev, data])
        );

        s.on("delivered", (messageId) => {
            setMessages((prev) =>
                prev.map((m) =>
                    m._id === messageId ? { ...m, delivered: true } : m
                )
            );
        });

        s.on("seen", () => {
            setMessages((prev) =>
                prev.map((m) => ({ ...m, seen: true }))
            );
        });

        s.on("typing", setTypingUser);
        s.on("stopTyping", () => setTypingUser(null));

        return () => {
            s.off();
            s.disconnect();
        };
    }, []);

    // 📜 LOAD HISTORY
    const loadChatHistory = async (userId) => {
        const token = localStorage.getItem("token");

        const res = await fetch(
            `http://localhost:5000/api/messages/${userId}`,
            { headers: { Authorization: `Bearer ${token}` } }
        );

        const data = await res.json();

        setMessages(
            data.map((msg) => ({
                _id: msg._id,
                from: msg.sender === myId ? "me" : msg.sender,
                message: msg.text,
                delivered: msg.delivered,
                seen: msg.seen,
            }))
        );

        socket.emit("markSeen", { to: userId });
    };

    // ✍️ TYPING
    const handleTyping = (e) => {
        setMessage(e.target.value);
        socket.emit("typing", { to: selectedUser });

        clearTimeout(window.typingTimeout);
        window.typingTimeout = setTimeout(() => {
            socket.emit("stopTyping", { to: selectedUser });
        }, 800);
    };

    // 📩 SEND
    const sendMessage = () => {
        if (!selectedUser || !message.trim()) return;

        socket.emit("private-message", {
            to: selectedUser,
            message,
        });

        setMessages((prev) => [...prev, { from: "me", message }]);
        setMessage("");
    };

    return (
        <div className="chat-container">
            {/* SIDEBAR */}
            <div className="chat-sidebar">
                <h3>Online Users</h3>

                {onlineUsers
                    .filter((user) => user.userId !== myId)
                    .map((user) => (
                        <div
                            key={user.userId}
                            className={`user-item ${selectedUser === user.userId ? "active" : ""
                                }`}
                            onClick={() => {
                                setSelectedUser(user.userId);
                                loadChatHistory(user.userId);
                            }}
                        >
                            {user.username}
                        </div>
                    ))}

            </div>

            {/* CHAT AREA */}
            <div className="chat-main">
                <div className="chat-header">
                    <span>
                        {onlineUsers.find(u => u.userId === selectedUser)?.username || "Select a user"}
                    </span>

                    <button onClick={handleLogout}>Logout</button>
                </div>

                <div className="chat-messages">
                    {messages.map((msg, i) => (
                        <div
                            key={i}
                            className={`message ${msg.from === "me" ? "me" : "other"
                                }`}
                        >
                            <span>{msg.message}</span>
                            {msg.from === "me" && (
                                <small>
                                    {msg.seen ? "👁" : msg.delivered ? "✓✓" : "✓"}
                                </small>
                            )}
                        </div>
                    ))}

                    {typingUser === selectedUser && (
                        <p className="typing">typing...</p>
                    )}
                </div>

                {selectedUser && (
                    <div className="chat-input">
                        <input
                            value={message}
                            onChange={handleTyping}
                            placeholder="Type a message..."
                        />
                        <button onClick={sendMessage}>Send</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Chat;
