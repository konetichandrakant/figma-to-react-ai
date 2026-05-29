import React from "react";
import { useNavigate, Link } from "react-router-dom";
import useAuthStore from "../../store/authStore";
import { theme } from "../../styles/theme";

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      height: "64px",
      background: "rgba(255,255,255,0.95)",
      backdropFilter: "blur(20px)",
      borderBottom: `1px solid ${theme.colors.border}`,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 32px",
      zIndex: 1000,
      boxShadow: theme.shadows.sm,
    }}>
      <Link to="/editor" style={{
        fontFamily: theme.fonts.heading,
        fontWeight: 800,
        fontSize: "1.4rem",
        background: theme.colors.gradientPrimary,
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        textDecoration: "none",
      }}>
        FigmaReact AI
      </Link>

      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        {user && (
          <>
            <span style={{ fontSize: "0.9rem", color: theme.colors.textLight }}>
              {user.username}
            </span>
            <button
              onClick={handleLogout}
              style={{
                padding: "8px 20px",
                borderRadius: theme.radius.pill,
                border: `1px solid ${theme.colors.border}`,
                background: "transparent",
                color: theme.colors.textSecondary,
                fontWeight: 500,
                fontSize: "0.85rem",
                cursor: "pointer",
                transition: theme.transitions.normal,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = theme.colors.primary;
                e.currentTarget.style.color = "#fff";
                e.currentTarget.style.borderColor = theme.colors.primary;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = theme.colors.textSecondary;
                e.currentTarget.style.borderColor = theme.colors.border;
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
