"use client";

import React, { useState, useEffect } from "react";

interface DiaryEntry {
  id: number;
  title: string;
  description?: string | null;
  image?: string | null;
  createdAt: string;
  updatedAt: string;
}

export default function Home() {
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    id: 0,
    title: "",
    description: "",
    image: "",
  });
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all diary entries from API
  const fetchEntries = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/items");
      const data = await res.json();
      if (Array.isArray(data)) {
        setEntries(data);
        setError(null);
      } else {
        setEntries([]);
        setError(data.error || "Failed to load entries");
      }
    } catch (err) {
      setError("Failed to load entries");
      setEntries([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  // Handle form change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Reset form
  const resetForm = () => {
    setFormData({ id: 0, title: "", description: "", image: "" });
    setEditing(false);
    setError(null);
  };

  // Submit form for create or update
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!formData.title.trim()) {
      setError("Title is required");
      return;
    }
    try {
      if (editing && formData.id) {
        // Update entry
        const res = await fetch(`/api/items/${formData.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        if (!res.ok) throw new Error("Failed to update entry");
      } else {
        // Create entry
        const res = await fetch("/api/items", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        if (!res.ok) throw new Error("Failed to create entry");
      }
      resetForm();
      fetchEntries();
    } catch (err) {
      setError((err as Error).message);
    }
  };

  // Handle edit click: fill form with entry data
  const handleEdit = (entry: DiaryEntry) => {
    setFormData({
      id: entry.id,
      title: entry.title,
      description: entry.description || "",
      image: entry.image || "",
    });
    setEditing(true);
  };

  // Handle delete click
  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this entry?")) return;
    try {
      const res = await fetch(`/api/items/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete entry");
      fetchEntries();
    } catch (err) {
      setError("Failed to delete entry");
    }
  };

  // Format date
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };

  return (
    <div className="container py-4">
      <h1 className="mb-4">My Diary</h1>

      <form onSubmit={handleSubmit} className="mb-4">
        {error && <div className="alert alert-danger">{error}</div>}
        <div className="mb-3">
          <label htmlFor="title" className="form-label">
            Judul
          </label>
          <input
            type="text"
            className="form-control"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Masukkan judul"
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="description" className="form-label">
            Deskripsi
          </label>
          <textarea
            className="form-control"
            id="description"
            name="description"
            rows={3}
            value={formData.description}
            onChange={handleChange}
            placeholder="Masukkan deskripsi"
          ></textarea>
        </div>
        <div className="mb-3">
          <label htmlFor="image" className="form-label">
            URL Gambar
          </label>
          <input
            type="text"
            className="form-control"
            id="image"
            name="image"
            value={formData.image}
            onChange={handleChange}
            placeholder="Masukkan URL gambar"
          />
        </div>
        <button type="submit" className="btn btn-primary me-2">
          {editing ? "Update Entry" : "Tambah Entry"}
        </button>
        {editing && (
          <button type="button" className="btn btn-secondary" onClick={resetForm}>
            Batal
          </button>
        )}
      </form>

      <h2>Dashboard</h2>
      {loading && <div>Loading...</div>}
      {!loading && entries.length === 0 && <div>Belum ada data diary</div>}
      <div className="row g-3">
        {entries.map((entry) => (
          <div className="col-12 col-md-6 col-lg-4" key={entry.id}>
            <div className="card h-100">
              {entry.image && (
                <img
                  src={entry.image}
                  alt={entry.title}
                  className="card-img-top"
                  style={{ maxHeight: "200px", objectFit: "cover" }}
                />
              )}
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{entry.title}</h5>
                <p className="card-text">{entry.description}</p>
                <p className="card-text">
                  <small className="text-muted">Tanggal: {formatDate(entry.createdAt)}</small>
                </p>
                <div className="mt-auto">
                  <button
                    className="btn btn-sm btn-warning me-2"
                    onClick={() => handleEdit(entry)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDelete(entry.id)}
                  >
                    Hapus
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
