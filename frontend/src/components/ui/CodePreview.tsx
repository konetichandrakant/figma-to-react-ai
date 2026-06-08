import React, { useState, useEffect } from "react";
import useEditorStore from "../../store/editorStore";
import api from "../../utils/api";
import { theme } from "../../styles/theme";
import { UINode } from "../../types";
import SaveProjectModal from "../dashboard/SaveProjectModal";

function countNodes(node: UINode): number {
  return 1 + node.children.reduce((sum, c) => sum + countNodes(c), 0);
}

function computeChangeSummary(tree: UINode, generatedCode: string): string {
  const parts: string[] = [];
  const nodeCount = countNodes(tree) - 1;
  parts.push(`Updated UI (${nodeCount} component${nodeCount !== 1 ? "s" : ""})`);
  if (generatedCode) {
    parts.push("code generated");
  }
  return parts.join(", ");
}

export default function CodePreview() {
  const {
    tree,
    generatedCode,
    setGeneratedCode,
    generating,
    setGenerating,
    currentProjectId,
    currentProjectName,
    setCurrentProject,
  } = useEditorStore();

  const [copied, setCopied] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
  };

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const res = await api.post("/api/generate", {
        ui_tree: tree,
        project_name: "GeneratedComponent",
      });
      setGeneratedCode(res.data.code);
      setPanelOpen(true);
    } catch {
      setGeneratedCode(
        "// Error generating code. Make sure the backend is running.\n// The fallback template generator will work without AI."
      );
    } finally {
      setGenerating(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveExisting = async () => {
    if (!currentProjectId) return;
    try {
      const changeSummary = computeChangeSummary(tree, generatedCode);
      await api.put(`/api/projects/${currentProjectId}`, {
        ui_tree: JSON.stringify(tree),
        generated_code: generatedCode,
        last_changes: changeSummary,
      });
      showToast("Project saved!");
    } catch {
      showToast("Failed to save project", "error");
    }
  };

  const handleSaveNew = async (name: string, description: string) => {
    try {
      const res = await api.post("/api/projects", {
        name,
        description,
        ui_tree: JSON.stringify(tree),
        generated_code: generatedCode,
      });
      setCurrentProject(res.data.id, name);
      setShowSaveModal(false);
      showToast("Project created and saved!");
    } catch {
      showToast("Failed to save project", "error");
    }
  };

  const handleSave = () => {
    if (currentProjectId) {
      handleSaveExisting();
    } else {
      setShowSaveModal(true);
    }
  };

  const handleClear = () => {
    useEditorStore.getState().clearCanvas();
  };

  const toolbarBtnBase: React.CSSProperties = {
    padding: "8px 20px",
    borderRadius: theme.radius.pill,
    fontWeight: 600,
    fontSize: "0.82rem",
    border: "none",
    cursor: "pointer",
    transition: theme.transitions.fast,
    display: "flex",
    alignItems: "center",
    gap: "6px",
  };

  return (
    <>
      {/* ── Top toolbar ── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          padding: "10px 24px",
          borderBottom: `1px solid ${theme.colors.borderLight}`,
          background: "rgba(255, 255, 255, 0.92)",
          backdropFilter: "blur(8px)",
        }}
      >
        <button
          onClick={handleGenerate}
          disabled={generating}
          style={{
            ...toolbarBtnBase,
            background: theme.colors.gradientPrimary,
            color: "#fff",
            cursor: generating ? "wait" : "pointer",
            opacity: generating ? 0.7 : 1,
            boxShadow: theme.shadows.glow,
          }}
        >
          {generating ? "Generating..." : "⚡ Generate Code"}
        </button>

        <button
          onClick={handleSave}
          style={{
            ...toolbarBtnBase,
            background: currentProjectId ? "rgba(102, 126, 234, 0.08)" : theme.colors.gradientSecondary,
            color: currentProjectId ? theme.colors.primary : "#fff",
            border: currentProjectId ? "1px solid rgba(102, 126, 234, 0.15)" : "none",
          }}
          onMouseEnter={(e) => {
            if (currentProjectId) {
              e.currentTarget.style.background = "rgba(102, 126, 234, 0.14)";
            }
          }}
          onMouseLeave={(e) => {
            if (currentProjectId) {
              e.currentTarget.style.background = "rgba(102, 126, 234, 0.08)";
            }
          }}
        >
          💾 {currentProjectId ? "Save" : "Save Project"}
        </button>

        {generatedCode && (
          <button
            onClick={() => setPanelOpen(!panelOpen)}
            style={{
              ...toolbarBtnBase,
              background: "transparent",
              color: theme.colors.primary,
              border: `1px solid rgba(102, 126, 234, 0.2)`,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(102, 126, 234, 0.06)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
            }}
          >
            {panelOpen ? "Hide" : "View"} Code
          </button>
        )}

        <div style={{ flex: 1 }} />

        <button
          onClick={handleClear}
          style={{
            ...toolbarBtnBase,
            background: "transparent",
            color: theme.colors.textMuted,
            border: `1px solid ${theme.colors.border}`,
            fontSize: "0.78rem",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "#e53e3e";
            e.currentTarget.style.borderColor = "rgba(229, 62, 62, 0.2)";
            e.currentTarget.style.background = "rgba(229, 62, 62, 0.04)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = theme.colors.textMuted;
            e.currentTarget.style.borderColor = theme.colors.border;
            e.currentTarget.style.background = "transparent";
          }}
        >
          Clear
        </button>
      </div>

      {/* ── Code panel ── */}
      {panelOpen && generatedCode && (
        <div
          style={{
            height: "320px",
            borderTop: `1px solid ${theme.colors.borderLight}`,
            background: "#0f0f1a",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "8px 16px",
              background: "rgba(0,0,0,0.3)",
              borderBottom: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div style={{ display: "flex", gap: "5px" }}>
                <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#ff5f57" }} />
                <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#ffbd2e" }} />
                <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#28ca41" }} />
              </div>
              <span style={{ color: "#6b7280", fontSize: "0.78rem", fontWeight: 500 }}>
                GeneratedComponent.tsx
              </span>
            </div>
            <button
              onClick={handleCopy}
              style={{
                padding: "4px 12px",
                borderRadius: "6px",
                background: copied ? "rgba(72, 187, 120, 0.15)" : "rgba(255,255,255,0.06)",
                color: copied ? "#48bb78" : "#9ca3af",
                fontSize: "0.75rem",
                border: "none",
                cursor: "pointer",
                fontWeight: 600,
                transition: theme.transitions.fast,
              }}
            >
              {copied ? "✓ Copied!" : "Copy"}
            </button>
          </div>
          <pre
            style={{
              flex: 1,
              overflow: "auto",
              padding: "16px",
              margin: 0,
              color: "#c9d1d9",
              fontSize: "0.8rem",
              fontFamily: "'Fira Code', 'Consolas', monospace",
              lineHeight: "1.7",
              whiteSpace: "pre-wrap",
            }}
          >
            {generatedCode}
          </pre>
        </div>
      )}

      {/* ── Toast notification ── */}
      {toast && (
        <div
          style={{
            position: "fixed",
            bottom: "24px",
            right: "24px",
            padding: "12px 20px",
            borderRadius: theme.radius.lg,
            background: toast.type === "success" ? "rgba(72, 187, 120, 0.95)" : "rgba(229, 62, 62, 0.95)",
            color: "#ffffff",
            fontWeight: 600,
            fontSize: "0.85rem",
            boxShadow: theme.shadows.lg,
            zIndex: 10000,
            animation: "fadeInUp 0.3s ease",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          {toast.type === "success" ? "✓" : "✕"} {toast.message}
        </div>
      )}

      {/* ── Save modal for new projects ── */}
      <SaveProjectModal
        open={showSaveModal}
        onClose={() => setShowSaveModal(false)}
        onSave={handleSaveNew}
        initialName={currentProjectName !== "Untitled Project" ? currentProjectName : ""}
        title="Save New Project"
      />
    </>
  );
}
