import { useEffect, useState } from "react";
import "./index.css";

const API_BASE = "http://127.0.0.1:5000";

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");

  // comments state
  const [openTaskId, setOpenTaskId] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");

  const fetchTasks = async () => {
    const res = await fetch(`${API_BASE}/tasks`);
    const data = await res.json();
    setTasks(data);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // TASK CRUD
  const createTask = async () => {
    if (!title.trim()) return;
    await fetch(`${API_BASE}/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });
    setTitle("");
    fetchTasks();
  };

  const deleteTask = async (id) => {
    await fetch(`${API_BASE}/tasks/${id}`, { method: "DELETE" });
    fetchTasks();
  };

  const startEdit = (task) => {
    setEditingId(task.id);
    setEditTitle(task.title);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditTitle("");
  };

  const saveEdit = async (id) => {
    if (!editTitle.trim()) return;
    await fetch(`${API_BASE}/tasks/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: editTitle }),
    });
    cancelEdit();
    fetchTasks();
  };

  // COMMENTS
  const toggleComments = async (taskId) => {
    if (openTaskId === taskId) {
      setOpenTaskId(null);
      setComments([]);
      setCommentText("");
      return;
    }
    setOpenTaskId(taskId);
    const res = await fetch(`${API_BASE}/tasks/${taskId}/comments`);
    const data = await res.json();
    setComments(data);
  };

  const addComment = async (taskId) => {
    if (!commentText.trim()) return;
    await fetch(`${API_BASE}/tasks/${taskId}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: commentText }),
    });
    setCommentText("");
    // refresh comments
    const res = await fetch(`${API_BASE}/tasks/${taskId}/comments`);
    const data = await res.json();
    setComments(data);
  };

  const deleteComment = async (id) => {
    await fetch(`${API_BASE}/comments/${id}`, { method: "DELETE" });
    const res = await fetch(`${API_BASE}/tasks/${openTaskId}/comments`);
    const data = await res.json();
    setComments(data);
  };

  return (
    <div className="container">
      <h2>📝 Task Manager</h2>

      {/* ADD TASK */}
      <div className="input-group">
        <input
          type="text"
          placeholder="Enter a new task..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") createTask();
          }}
        />
        <button
          className="add-btn"
          onClick={createTask}
          disabled={!title.trim()}
        >
          Add
        </button>
      </div>

      {tasks.length === 0 ? (
        <p className="empty">No tasks yet. Add one 🚀</p>
      ) : (
        <ul>
          {tasks.map((task) => (
            <li key={task.id} className="task-item">
              {editingId === task.id ? (
                <>
                  <input
                    className="edit-input"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") saveEdit(task.id);
                      if (e.key === "Escape") cancelEdit();
                    }}
                  />
                  <div>
                    <button
                      className="save-btn"
                      onClick={() => saveEdit(task.id)}
                      disabled={!editTitle.trim()}
                    >
                      Save
                    </button>
                    <button className="cancel-btn" onClick={cancelEdit}>
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <span>{task.title}</span>
                  <div>
                    <button
                      className="comment-btn"
                      onClick={() => toggleComments(task.id)}
                    >
                      {openTaskId === task.id ? "Hide" : "Comments"}
                    </button>
                    <button
                      className="edit-btn"
                      onClick={() => startEdit(task)}
                    >
                      Edit
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => deleteTask(task.id)}
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}

              {openTaskId === task.id && (
                <div className="comments-box">
                  <div className="comment-input">
                    <input
                      type="text"
                      placeholder="Write a comment..."
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") addComment(task.id);
                        if (e.key === "Escape") toggleComments(task.id);
                      }}
                    />
                    <button
                      className="add-btn"
                      onClick={() => addComment(task.id)}
                      disabled={!commentText.trim()}
                    >
                      Add
                    </button>
                  </div>

                  {comments.length === 0 ? (
                    <p className="empty small">No comments yet</p>
                  ) : (
                    <ul className="comments-list">
                      {comments.map((c) => (
                        <li key={c.id} className="comment-item">
                          <span>{c.content}</span>
                          <button
                            className="delete-btn small"
                            onClick={() => deleteComment(c.id)}
                          >
                            ✕
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;
