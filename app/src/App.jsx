import React, { useEffect, useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import "./App.css";

const API_URL = "https://69a341d4be843d692bd34b32.mockapi.io/data/user";

const App = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  // ================= FETCH BLOGS =================
  async function fetchData() {
    try {
      setLoading(true);
      const result = await fetch(API_URL);
      if (!result.ok) throw new Error("Fetch failed");
      const jsonResult = await result.json();
      setData(jsonResult.reverse());
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch blogs");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  // ================= CREATE BLOG =================
  async function createBlog() {
    if (!title.trim() || !description.trim()) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title,
          description: description,
        }),
      });

      if (!response.ok) throw new Error("Create failed");

      toast.success("Blog Created 🎉");
      setTitle("");
      setDescription("");
      fetchData();
    } catch (error) {
      console.error(error);
      toast.error("Failed to create blog");
    }
  }

  // ================= DELETE BLOG =================
  async function deleteBlog(item) {
    try {
      const response = await fetch(`${API_URL}/${item.id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Delete failed");

      toast.success("Blog Deleted 🗑️");
      fetchData();
    } catch (error) {
      console.error(error);
      toast.error("Delete failed");
    }
  }

  // ================= UPDATE BLOG =================
  async function updateBlog(item) {
    const newTitle = prompt("Enter new title:", item.title);
    const newDesc = prompt("Enter new description:", item.description);

    if (!newTitle || !newDesc) {
      toast.error("Fields cannot be empty");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/${item.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: newTitle,
          description: newDesc,
        }),
      });

      if (!response.ok) throw new Error("Update failed");

      toast.success("Blog Updated ✨");
      fetchData();
    } catch (error) {
      console.error(error);
      toast.error("Update failed");
    }
  }

  return (
    <div className="app">
      <Toaster position="top-right" />
      <h1 className="heading">Premium Blog App</h1>

      {/* CREATE FORM */}
      <div className="form-card">
        <input
          type="text"
          placeholder="Enter Blog Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          placeholder="Enter Blog Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <button className="create-btn" onClick={createBlog}>
          Create Blog
        </button>
      </div>

      {/* BLOG LIST */}
      <div className="blog-list">
        {loading ? (
          <p style={{ color: "white", textAlign: "center" }}>
            Loading blogs...
          </p>
        ) : data.length === 0 ? (
          <p style={{ color: "white", textAlign: "center" }}>
            No blogs available
          </p>
        ) : (
          data.map((item) => (
            <div key={item.id} className="blog-card">
              <h2>{item.title}</h2>
              <p>{item.description}</p>

              <div className="card-buttons">
                <button
                  className="update-btn"
                  onClick={() => updateBlog(item)}
                >
                  Update
                </button>

                <button
                  className="delete-btn"
                  onClick={() => deleteBlog(item)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default App;