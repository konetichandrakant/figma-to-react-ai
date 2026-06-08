import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import { theme } from "../styles/theme";
import { Project } from "../types";
import Navbar from "../components/layout/Navbar";
import ProjectCard from "../components/dashboard/ProjectCard";
import SaveProjectModal from "../components/dashboard/SaveProjectModal";

function ProjectCardSkeleton() {
  return (
    <div
      style={{
        background: theme.colors.cardBg,
        border: `1px solid ${theme.colors.borderLight}`,
        borderRadius: theme.radius.lg,
        padding: theme.spacing["2xl"],
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          width: "55%",
          height: "18px",
          background: "rgba(102, 126, 234, 0.1)",
          borderRadius: theme.radius.sm,
          marginBottom: theme.spacing.md,
          animation: "pulse 1.5s ease-in-out infinite",
        }}
      />
      <div
        style={{
          width: "85%",
          height: "13px",
          background: "rgba(102, 126, 234, 0.07)",
          borderRadius: theme.radius.sm,
          marginBottom: theme.spacing.sm,
          animation: "pulse 1.5s ease-in-out infinite",
          animationDelay: "0.1s",
        }}
      />
      <div
        style={{
          width: "40%",
          height: "13px",
          background: "rgba(102, 126, 234, 0.07)",
          borderRadius: theme.radius.sm,
          marginBottom: theme.spacing.lg,
          animation: "pulse 1.5s ease-in-out infinite",
          animationDelay: "0.2s",
        }}
      />
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          borderTop: `1px solid ${theme.colors.borderLight}`,
          paddingTop: theme.spacing.md,
        }}
      >
        <div style={{ width: "30%", height: "11px", background: "rgba(102, 126, 234, 0.07)", borderRadius: theme.radius.sm }} />
        <div style={{ width: "22%", height: "30px", background: "rgba(102, 126, 234, 0.07)", borderRadius: theme.radius.pill }} />
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewModal, setShowNewModal] = useState(false);

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

  const handleCreateProject = async (name: string, description: string) => {
    try {
      const res = await api.post("/api/projects", { name, description });
      setShowNewModal(false);
      navigate(`/editor?project=${res.data.id}`);
    } catch {
      // ignore
    }
  };

  const handleOpenProject = (id: number) => {
    navigate(`/editor?project=${id}`);
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
    <div className="app-bg" style={{ minHeight: "100vh", fontFamily: theme.fonts.body }}>
      <Navbar />

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: `120px ${theme.spacing.xl} ${theme.spacing["3xl"]}` }}>
        {/* ── Header ── */}
        <div style={{ marginBottom: theme.spacing["3xl"] }}>
          <p style={{ color: theme.colors.textLight, fontSize: "1.05rem", lineHeight: 1.6 }}>
            Build UIs with drag-and-drop, generate React code instantly
          </p>
        </div>

        {/* ── Project grid ── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
            gap: theme.spacing.xl,
          }}
        >
          {/* New project card */}
          <div
            onClick={() => setShowNewModal(true)}
            style={{
              background: theme.colors.cardBg,
              border: `2px dashed ${theme.colors.border}`,
              borderRadius: theme.radius.lg,
              padding: `${theme.spacing["3xl"]} ${theme.spacing.xl}`,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              transition: theme.transitions.normal,
              minHeight: "240px",
              position: "relative",
              overflow: "hidden",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = theme.colors.primary;
              e.currentTarget.style.background = theme.colors.cardBgHover;
              e.currentTarget.style.transform = "translateY(-8px)";
              e.currentTarget.style.boxShadow = theme.shadows.accent;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = theme.colors.border;
              e.currentTarget.style.background = theme.colors.cardBg;
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <div
              style={{
                width: "72px",
                height: "72px",
                borderRadius: "50%",
                background: theme.colors.gradientPrimary,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontWeight: 300,
                fontSize: "2rem",
                marginBottom: theme.spacing.md,
                boxShadow: theme.shadows.glow,
              }}
            >
              +
            </div>
            <div style={{ fontWeight: 700, fontSize: "1rem", color: theme.colors.textPrimary, marginBottom: "4px" }}>
              New Project
            </div>
            <div style={{ fontSize: "0.82rem", color: theme.colors.textMuted }}>
              Start from scratch
            </div>
          </div>

          {/* Loading skeletons */}
          {loading ? (
            <>
              <ProjectCardSkeleton />
              <ProjectCardSkeleton />
            </>
          ) : projects.length === 0 ? (
            <div
              style={{
                gridColumn: "2 / -1",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: `${theme.spacing["3xl"]} ${theme.spacing.xl}`,
                color: theme.colors.textMuted,
              }}
            >
              <div style={{ fontSize: "4rem", marginBottom: theme.spacing.md, opacity: 0.3 }}>
                📁
              </div>
              <div style={{ fontWeight: 600, fontSize: "1.1rem", marginBottom: theme.spacing.xs }}>
                No projects yet
              </div>
              <div style={{ fontSize: "0.9rem" }}>
                Create your first project to get started
              </div>
            </div>
          ) : (
            projects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onOpen={handleOpenProject}
                onDelete={handleDeleteProject}
              />
            ))
          )}
        </div>
      </div>

      <SaveProjectModal
        open={showNewModal}
        onClose={() => setShowNewModal(false)}
        onSave={handleCreateProject}
        title="Create New Project"
      />
    </div>
  );
}
