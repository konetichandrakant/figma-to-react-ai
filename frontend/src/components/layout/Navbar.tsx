import React from "react";
import { useNavigate, Link } from "react-router-dom";
import useAuthStore from "../../store/authStore";
import useEditorStore from "../../store/editorStore";
import { theme } from "../../styles/theme";

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const { currentProjectId, currentProjectName } = useEditorStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isInEditor = currentProjectId !== null;

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: "64px",
        background: "rgba(255, 255, 255, 0.92)",
        backdropFilter: "blur(12px)",
        borderBottom: `1px solid ${theme.colors.borderLight}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 32px",
        zIndex: 1000,
        boxShadow: theme.shadows.sm,
        transition: theme.transitions.normal,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <Link
          to="/dashboard"
          style={{
            fontFamily: theme.fonts.heading,
            fontWeight: 800,
            fontSize: "1.4rem",
            background: theme.colors.gradientPrimary,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            textDecoration: "none",
            letterSpacing: "-0.5px",
          }}
        >
          FigmaReact AI
        </Link>

        {/* Breadcrumb — only in editor */}
        {isInEditor && (
          <>
            <span style={{ color: theme.colors.border, fontSize: "1.2rem", fontWeight: 300 }}>/</span>
            <span
              style={{
                fontSize: "0.85rem",
                fontWeight: 600,
                color: theme.colors.textSecondary,
                maxWidth: "200px",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {currentProjectName}
            </span>
          </>
        )}

        {/* Back to Dashboard — only in editor */}
        {isInEditor && (
          <button
            onClick={() => navigate("/dashboard")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
              padding: "5px 14px",
              borderRadius: theme.radius.pill,
              background: "rgba(102, 126, 234, 0.06)",
              color: theme.colors.primary,
              border: "1px solid rgba(102, 126, 234, 0.12)",
              cursor: "pointer",
              fontSize: "0.78rem",
              fontWeight: 500,
              transition: theme.transitions.fast,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = theme.colors.primary;
              e.currentTarget.style.color = "#fff";
              e.currentTarget.style.borderColor = theme.colors.primary;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(102, 126, 234, 0.06)";
              e.currentTarget.style.color = theme.colors.primary;
              e.currentTarget.style.borderColor = "rgba(102, 126, 234, 0.12)";
            }}
          >
            ← Dashboard
          </button>
        )}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        {user && (
          <>
            {/* User avatar pill */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "4px 14px 4px 4px",
                borderRadius: theme.radius.pill,
                background: "rgba(102, 126, 234, 0.06)",
                border: "1px solid rgba(102, 126, 234, 0.1)",
              }}
            >
              <div
                style={{
                  width: "28px",
                  height: "28px",
                  borderRadius: "50%",
                  background: theme.colors.gradientPrimary,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  fontSize: "0.7rem",
                  fontWeight: 700,
                  textTransform: "uppercase",
                }}
              >
                {user.username?.[0] || "U"}
              </div>
              <span style={{ fontSize: "0.82rem", color: theme.colors.textSecondary, fontWeight: 500 }}>
                {user.username}
              </span>
            </div>

            <button
              onClick={handleLogout}
              style={{
                padding: "7px 18px",
                borderRadius: theme.radius.pill,
                border: `1px solid ${theme.colors.border}`,
                background: "transparent",
                color: theme.colors.textLight,
                fontWeight: 500,
                fontSize: "0.82rem",
                cursor: "pointer",
                transition: theme.transitions.fast,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = theme.colors.primary;
                e.currentTarget.style.color = theme.colors.primary;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = theme.colors.border;
                e.currentTarget.style.color = theme.colors.textLight;
              }}
            >
              Sign Out
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
