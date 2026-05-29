import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../store/authStore";
import api from "../../utils/api";
import { theme } from "../../styles/theme";
import Navbar from "../layout/Navbar";

interface Project {
  id: number;
  name: string;
  description: string;
  updated_at: string;
}

export default function Dashboard() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await api.get("/api/projects");
      setProjects(res.data);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  const handleNewProject = () => {
    navigate("/editor");
  };

  const handleOpenProject = async (id: number) => {
    try {
      const res = await api.get(`/api/projects/${id}`);
      navigate("/editor", { state: { project: res.data } });
    } catch {
      // ignore
    }
  };

  const handleDeleteProject = async (id: number) => {
    if (!confirm("Delete this project?")) return;
    try {
      await api.delete(`/api/projects/${id}`);
      setProjects(projects.filter((p) => p.id !== id));
    } catch {
      // ignore
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)", fontFamily: theme.fonts.body }}>
      <Navbar />
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "100px 32px 64px" }}>
        <div style={{ marginBottom: "48px" }}>
          <h1 style={{
            fontFamily: theme.fonts.heading,
            fontWeight: 800,
            fontSize: "clamp(2rem, 4vw, 3rem)",
            background: theme.colors.gradientPrimary,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            marginBottom: "8px",
          }}>
            Welcome back, {user?.username}
          </h1>
          <p style={{ color: theme.colors.textLight, fontSize: "1.1rem" }}>
            Build UIs with drag-and-drop, generate React code instantly
          </p>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "24px",
        }}>
          {/* New project card */}
          <div
            onClick={handleNewProject}
            style={{
              background: "#ffffff",
              borderRadius: theme.radius.xl,
              padding: "48px 32px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              border: `2px dashed ${theme.colors.border}`,
              transition: theme.transitions.normal,
              boxShadow: theme.shadows.md,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = theme.colors.primary;
              e.currentTarget.style.transform = "translateY(-4px)";
              e.currentTarget.style.boxShadow = theme.shadows.xl;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = theme.colors.border;
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = theme.shadows.md;
            }}
          >
            <div style={{
              fontSize: "3rem",
              width: "80px",
              height: "80px",
              borderRadius: "50%",
              background: theme.colors.gradientPrimary,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              marginBottom: "16px",
            }}>
              +
            </div>
            <div style={{ fontWeight: 700, fontSize: "1.1rem", color: theme.colors.textPrimary }}>New Project</div>
            <div style={{ fontSize: "0.85rem", color: theme.colors.textLight, marginTop: "4px" }}>Start from scratch</div>
          </div>

          {/* Existing projects */}
          {loading ? (
            <div style={{ padding: "48px", textAlign: "center", color: theme.colors.textMuted }}>Loading...</div>
          ) : (
            projects.map((project) => (
              <div
                key={project.id}
                style={{
                  background: "#ffffff",
                  borderRadius: theme.radius.xl,
                  padding: "24px",
                  boxShadow: theme.shadows.md,
                  cursor: "pointer",
                  transition: theme.transitions.normal,
                  display: "flex",
                  flexDirection: "column",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow = theme.shadows.xl;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = theme.shadows.md;
                }}
              >
                <div style={{ flex: 1 }}>
                  <h3 style={{
                    fontFamily: theme.fonts.heading,
                    fontWeight: 700,
                    fontSize: "1.1rem",
                    color: theme.colors.textPrimary,
                    marginBottom: "4px",
                  }}>
                    {project.name}
                  </h3>
                  <p style={{ fontSize: "0.85rem", color: theme.colors.textLight }}>
                    {project.description || "No description"}
                  </p>
                </div>
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginTop: "16px",
                  paddingTop: "12px",
                  borderTop: `1px solid ${theme.colors.border}`,
                }}>
                  <span style={{ fontSize: "0.75rem", color: theme.colors.textMuted }}>
                    {new Date(project.updated_at).toLocaleDateString()}
                  </span>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleOpenProject(project.id); }}
                      style={{
                        padding: "6px 14px",
                        borderRadius: theme.radius.pill,
                        background: theme.colors.gradientPrimary,
                        color: "#fff",
                        border: "none",
                        cursor: "pointer",
                        fontSize: "0.75rem",
                        fontWeight: 600,
                      }}
                    >
                      Open
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDeleteProject(project.id); }}
                      style={{
                        padding: "6px 14px",
                        borderRadius: theme.radius.pill,
                        background: "transparent",
                        color: "#e53e3e",
                        border: "1px solid #fed7d7",
                        cursor: "pointer",
                        fontSize: "0.75rem",
                        fontWeight: 500,
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
