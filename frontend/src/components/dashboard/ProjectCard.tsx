import React from "react";
import { theme } from "../../styles/theme";
import { Project } from "../../types";
import { formatRelativeTime } from "../../utils/time";

interface Props {
  project: Project;
  onOpen: (id: number) => void;
  onDelete: (id: number) => void;
}

export default function ProjectCard({ project, onOpen, onDelete }: Props) {
  return (
    <div
      className="card-hover-wrapper"
      onClick={() => onOpen(project.id)}
      style={{
        background: theme.colors.cardBg,
        border: `1px solid ${theme.colors.borderLight}`,
        borderRadius: theme.radius.lg,
        cursor: "pointer",
        transition: theme.transitions.normal,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        position: "relative",
        minHeight: "240px",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = theme.colors.cardBgHover;
        e.currentTarget.style.borderColor = "rgba(102, 126, 234, 0.2)";
        e.currentTarget.style.transform = "translateY(-8px)";
        e.currentTarget.style.boxShadow = theme.shadows.accent;
        // Show accent line
        const line = e.currentTarget.querySelector(".accent-line") as HTMLElement;
        if (line) line.style.transform = "scaleX(1)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = theme.colors.cardBg;
        e.currentTarget.style.borderColor = theme.colors.borderLight;
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "none";
        const line = e.currentTarget.querySelector(".accent-line") as HTMLElement;
        if (line) line.style.transform = "scaleX(0)";
      }}
    >
      {/* Accent line at top — scales in on hover (portfolio pattern) */}
      <div
        className="accent-line"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "3px",
          background: "linear-gradient(90deg, #667eea, #764ba2, transparent)",
          transform: "scaleX(0)",
          transformOrigin: "left",
          transition: "transform 300ms ease-in-out",
          borderRadius: "12px 12px 0 0",
          zIndex: 2,
        }}
      />

      {/* Radial glow in top-right corner on hover (portfolio pattern) */}
      <div
        style={{
          position: "absolute",
          top: "-60px",
          right: "-60px",
          width: "180px",
          height: "180px",
          background: "radial-gradient(circle, rgba(102, 126, 234, 0.08), transparent)",
          borderRadius: "50%",
          pointerEvents: "none",
          opacity: 0,
          transition: "opacity 300ms ease-in-out",
          zIndex: 0,
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.opacity = "1";
        }}
      />

      {/* Content */}
      <div style={{ padding: `${theme.spacing.xl} ${theme.spacing.xl} 0`, flex: 1, position: "relative", zIndex: 1 }}>
        {/* Project name */}
        <h3
          style={{
            fontFamily: theme.fonts.heading,
            fontWeight: 700,
            fontSize: "1.1rem",
            color: theme.colors.textPrimary,
            marginBottom: theme.spacing.sm,
            lineHeight: 1.3,
          }}
        >
          {project.name}
        </h3>

        {/* Description */}
        <p
          style={{
            fontSize: "0.85rem",
            color: theme.colors.textLight,
            lineHeight: 1.6,
            marginBottom: theme.spacing.md,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {project.description || "No description"}
        </p>

        {/* Last changes chip */}
        {project.last_changes && (
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "5px",
              padding: "4px 10px",
              borderRadius: theme.radius.pill,
              background: "rgba(102, 126, 234, 0.08)",
              fontSize: "0.72rem",
              color: theme.colors.primary,
              fontWeight: 500,
              border: "1px solid rgba(102, 126, 234, 0.12)",
            }}
          >
            <span style={{ fontSize: "0.65rem" }}>🕐</span>
            {project.last_changes}
          </div>
        )}
      </div>

      {/* Footer */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: `${theme.spacing.md} ${theme.spacing.xl}`,
          borderTop: `1px solid ${theme.colors.borderLight}`,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
          {project.created_at && (
            <span style={{ fontSize: "0.7rem", color: theme.colors.textMuted }}>
              Created {formatRelativeTime(project.created_at)}
            </span>
          )}
          {project.updated_at && (
            <span style={{ fontSize: "0.7rem", color: theme.colors.textMuted }}>
              Updated {formatRelativeTime(project.updated_at)}
            </span>
          )}
        </div>
        <div style={{ display: "flex", gap: "6px" }}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpen(project.id);
            }}
            style={{
              padding: "6px 16px",
              borderRadius: theme.radius.pill,
              background: theme.colors.gradientPrimary,
              color: "#fff",
              border: "none",
              cursor: "pointer",
              fontSize: "0.72rem",
              fontWeight: 600,
              boxShadow: theme.shadows.sm,
              transition: theme.transitions.fast,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = theme.shadows.glow;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = theme.shadows.sm;
            }}
          >
            Open
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(project.id);
            }}
            style={{
              padding: "6px 12px",
              borderRadius: theme.radius.pill,
              background: "transparent",
              color: theme.colors.textMuted,
              border: `1px solid ${theme.colors.border}`,
              cursor: "pointer",
              fontSize: "0.72rem",
              fontWeight: 500,
              transition: theme.transitions.fast,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "#e53e3e";
              e.currentTarget.style.borderColor = "#fed7d7";
              e.currentTarget.style.background = "#fff5f5";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = theme.colors.textMuted;
              e.currentTarget.style.borderColor = theme.colors.border;
              e.currentTarget.style.background = "transparent";
            }}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
