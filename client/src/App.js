import React, { useEffect, useState } from "react";

export default function App() {
    const [todos, setTodos] = useState([]);
    const [text, setText] = useState("");
    const [email, setEmail] = useState("");
    const [editId, setEditId] = useState(null);

    // READ
    useEffect(() => {
        fetch("/api/todos")
            .then((res) => res.json())
            .then((data) => setTodos(data))
            .catch((err) => console.error("Fetch error", err));
    }, []);

    // CREATE
    async function addTodo(e) {
        e.preventDefault();
        if (!text || !email) return;
        const res = await fetch("/api/todos", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text, email }),
        });
        if (!res.ok) return alert("Add failed");
        const newTodo = await res.json();
        setTodos([newTodo, ...todos]);
        setText("");
        setEmail("");
    }

    // START EDIT
    function startEdit(todo) {
        setEditId(todo._id);
        setText(todo.text);
        setEmail(todo.email);
    }

    // UPDATE
    async function updateTodo(e) {
        e.preventDefault();
        const res = await fetch(`/api/todos/${editId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text, email }),
        });
        if (!res.ok) return alert("Update failed");
        const updated = await res.json();
        setTodos(todos.map((t) => (t._id === editId ? updated : t)));
        setEditId(null);
        setText("");
        setEmail("");
    }

    // DELETE
    async function deleteTodo(id) {
        if (!window.confirm("Delete this todo?")) return;
        const res = await fetch(`/api/todos/${id}`, { method: "DELETE" });
        if (!res.ok) return alert("Delete failed");
        setTodos(todos.filter((t) => t._id !== id));
    }

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>✅ Todo App</h1>

            <form onSubmit={editId ? updateTodo : addTodo} style={styles.form}>
                <input
                    style={styles.input}
                    placeholder="Enter task"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                />
                <input
                    style={styles.input}
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <button style={styles.primaryBtn} type="submit">
                    {editId ? "Update" : "Add"}
                </button>
                {editId && (
                    <button
                        type="button"
                        style={styles.secondaryBtn}
                        onClick={() => {
                            setEditId(null);
                            setText("");
                            setEmail("");
                        }}>
                        Cancel
                    </button>
                )}
            </form>

            <ul style={styles.list}>
                {todos.map((t) => (
                    <li key={t._id} style={styles.item}>
                        <div>
                            <div style={styles.itemText}>{t.text}</div>
                            <div style={styles.itemSub}>{t.email}</div>
                        </div>
                        <div style={styles.actions}>
                            <button
                                style={styles.smallBtn}
                                onClick={() => startEdit(t)}>
                                ✔️
                            </button>
                            <button
                                style={styles.dangerBtn}
                                onClick={() => deleteTodo(t._id)}>
                                ❌
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

const styles = {
    container: {
        maxWidth: 500,
        margin: "40px auto",
        padding: 20,
        fontFamily: "Inter, sans-serif",
    },
    title: { textAlign: "center", marginBottom: 20, color: "#1976d2" },
    form: {
        display: "flex",
        gap: 10,
        flexWrap: "wrap",
        marginBottom: 20,
    },
    input: {
        flex: 1,
        minWidth: 140,
        padding: "10px 12px",
        border: "1px solid #ddd",
        borderRadius: 8,
        fontSize: 15,
    },
    primaryBtn: {
        padding: "10px 16px",
        background: "#1976d2",
        color: "#fff",
        border: 0,
        borderRadius: 8,
        cursor: "pointer",
    },
    secondaryBtn: {
        padding: "10px 16px",
        background: "#888",
        color: "#fff",
        border: 0,
        borderRadius: 8,
        cursor: "pointer",
    },
    list: { listStyle: "none", padding: 0, margin: 0 },
    item: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "12px 16px",
        border: "1px solid #eee",
        borderRadius: 10,
        marginBottom: 10,
        background: "#fafafa",
    },
    itemText: { fontWeight: 600, fontSize: 16 },
    itemSub: { color: "#555", fontSize: 13 },
    actions: { display: "flex", gap: 8 },
    smallBtn: {
        padding: "6px 10px",
        background: "#8de891ff",
        color: "#fff",
        border: 0,
        borderRadius: 6,
        cursor: "pointer",
    },
    dangerBtn: {
        padding: "6px 10px",
        background: "#da8987ff",
        color: "#fff",
        border: 0,
        borderRadius: 6,
        cursor: "pointer",
    },
};
