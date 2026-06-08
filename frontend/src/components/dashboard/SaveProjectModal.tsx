import React, { useState, useEffect } from "react";
import { theme } from "../../styles/theme";

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (name: string, description: string) => void;
  initialName?: string;
  initialDescription?: string;
  title?: string;
}

export default function SaveProjectModal({
  open,
  onClose,
  onSave,
  initialName = "",
  initialDescription = "",
  title = "New Project",
}: Props) {
  const [name, setName] = useState(initialName);
  const [description, setDescription] = useState(initialDescription);

  useEffect(() => {
    if (open) {
      setName(initialName);
      setDescription(initialDescription);
    }
  }, [open, initialName, initialDescription]);

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSave(name.trim(), description.trim());
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "14px 16px",
    borderRadius: theme.radius.lg,
    border: `2px solid ${theme.colors.border}`,
    fontSize: "0.9rem",
    fontFamily: theme.fonts.body,
    outline: "none",
    boxSizing: "border-box",
    background: "#ffffff",
    color: theme.colors.textPrimary,
    transition: theme.transitions.normal,
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0, 0, 0, 0.4)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        backdropFilter: "blur(8px)",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#ffffff",
          borderRadius: theme.radius.xl,
          padding: theme.spacing["3xl"],
          width: "460px",
          maxWidth: "90vw",
          boxShadow: theme.shadows.accent,
          border: `1px solid ${theme.colors.borderLight}`,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Accent line at top */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "3px",
            background: theme.colors.gradientPrimary,
          }}
        />

        <h2
          style={{
            fontFamily: theme.fonts.heading,
            fontWeight: 700,
            fontSize: "1.3rem",
            color: theme.colors.textPrimary,
            marginBottom: theme.spacing.xl,
          }}
        >
          {title}
        </h2>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: theme.spacing.md }}>
            <label
              style={{
                display: "block",
                fontSize: "0.8rem",
                fontWeight: 600,
                color: theme.colors.textLight,
                marginBottom: "6px",
              }}
            >
              Project Name *
            </label>
            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="My Awesome Project"
              style={{
                ...inputStyle,
                borderColor: name.trim() ? "rgba(102, 126, 234, 0.3)" : theme.colors.border,
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = theme.colors.primary;
                e.currentTarget.style.boxShadow = `0 0 0 3px rgba(102, 126, 234, 0.1)`;
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = theme.colors.border;
                e.currentTarget.style.boxShadow = "none";
              }}
            />
          </div>

          <div style={{ marginBottom: theme.spacing["2xl"] }}>
            <label
              style={{
                display: "block",
                fontSize: "0.8rem",
                fontWeight: 600,
                color: theme.colors.textLight,
                marginBottom: "6px",
              }}
            >
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What's this project about?"
              rows={3}
              style={{
                ...inputStyle,
                resize: "vertical",
                minHeight: "80px",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = theme.colors.primary;
                e.currentTarget.style.boxShadow = `0 0 0 3px rgba(102, 126, 234, 0.1)`;
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = theme.colors.border;
                e.currentTarget.style.boxShadow = "none";
              }}
            />
          </div>

          <div style={{ display: "flex", gap: theme.spacing.md, justifyContent: "flex-end" }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: "10px 24px",
                borderRadius: theme.radius.pill,
                background: "transparent",
                color: theme.colors.textLight,
                border: `1px solid ${theme.colors.border}`,
                cursor: "pointer",
                fontWeight: 600,
                fontSize: "0.85rem",
                transition: theme.transitions.fast,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = theme.colors.textLight;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = theme.colors.border;
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!name.trim()}
              style={{
                padding: "10px 28px",
                borderRadius: theme.radius.pill,
                background: name.trim() ? theme.colors.gradientPrimary : theme.colors.border,
                color: "#ffffff",
                border: "none",
                cursor: name.trim() ? "pointer" : "not-allowed",
                fontWeight: 600,
                fontSize: "0.85rem",
                opacity: name.trim() ? 1 : 0.6,
                boxShadow: name.trim() ? theme.shadows.glow : "none",
                transition: theme.transitions.normal,
              }}
            >
              Create Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
