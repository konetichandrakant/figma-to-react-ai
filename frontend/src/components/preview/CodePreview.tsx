import React, { useState } from "react";
import useEditorStore from "../../store/editorStore";
import api from "../../utils/api";
import { theme } from "../../styles/theme";

export default function CodePreview() {
  const { tree, generatedCode, setGeneratedCode, generating, setGenerating } = useEditorStore();
  const [copied, setCopied] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const res = await api.post("/api/generate", {
        ui_tree: tree,
        project_name: "GeneratedComponent",
      });
      setGeneratedCode(res.data.code);
      setPanelOpen(true);
    } catch (err) {
      setGeneratedCode("// Error generating code. Make sure the backend is running.\n// The fallback template generator will work without AI.");
    } finally {
      setGenerating(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = async () => {
    try {
      await api.post("/api/projects", {
        name: "Untitled Project",
        description: "Generated with Figma to React AI",
        ui_tree: JSON.stringify(tree),
        generated_code: generatedCode,
      });
      alert("Project saved!");
    } catch {
      alert("Failed to save project");
    }
  };

  const handleClear = () => {
    useEditorStore.getState().clearCanvas();
  };

  return (
    <>
      {/* Top toolbar */}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        padding: "10px 24px",
        borderBottom: `1px solid ${theme.colors.border}`,
        background: theme.colors.bgPrimary,
      }}>
        <button onClick={handleGenerate} disabled={generating} style={{
          padding: "8px 20px",
          borderRadius: theme.radius.pill,
          background: theme.colors.gradientPrimary,
          color: "#fff",
          fontWeight: 600,
          fontSize: "0.85rem",
          border: "none",
          cursor: generating ? "wait" : "pointer",
          opacity: generating ? 0.7 : 1,
          boxShadow: theme.shadows.md,
          transition: theme.transitions.normal,
          display: "flex",
          alignItems: "center",
          gap: "6px",
        }}>
          {generating ? "Generating..." : "⚡ Generate Code"}
        </button>

        <button onClick={handleSave} style={{
          padding: "8px 20px",
          borderRadius: theme.radius.pill,
          background: theme.colors.gradientSecondary,
          color: "#fff",
          fontWeight: 600,
          fontSize: "0.85rem",
          border: "none",
          cursor: "pointer",
          boxShadow: theme.shadows.md,
        }}>
          💾 Save Project
        </button>

        {generatedCode && (
          <button onClick={() => setPanelOpen(!panelOpen)} style={{
            padding: "8px 20px",
            borderRadius: theme.radius.pill,
            background: "transparent",
            color: theme.colors.primary,
            fontWeight: 600,
            fontSize: "0.85rem",
            border: `1px solid ${theme.colors.primary}`,
            cursor: "pointer",
          }}>
            {panelOpen ? "Hide" : "View"} Code
          </button>
        )}

        <div style={{ flex: 1 }} />

        <button onClick={handleClear} style={{
          padding: "8px 16px",
          borderRadius: theme.radius.pill,
          background: "transparent",
          color: "#e53e3e",
          fontWeight: 500,
          fontSize: "0.85rem",
          border: `1px solid #fed7d7`,
          cursor: "pointer",
        }}>
          Clear
        </button>
      </div>

      {/* Code panel */}
      {panelOpen && generatedCode && (
        <div style={{
          height: "320px",
          borderTop: `1px solid ${theme.colors.border}`,
          background: "#1e1e2e",
          display: "flex",
          flexDirection: "column",
        }}>
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "8px 16px",
            background: "rgba(0,0,0,0.2)",
            borderBottom: `1px solid rgba(255,255,255,0.1)`,
          }}>
            <span style={{ color: "#a0aec0", fontSize: "0.8rem", fontWeight: 600 }}>
              GeneratedComponent.tsx
            </span>
            <button onClick={handleCopy} style={{
              padding: "4px 12px",
              borderRadius: "6px",
              background: copied ? theme.colors.secondary : "rgba(255,255,255,0.1)",
              color: "#fff",
              fontSize: "0.75rem",
              border: "none",
              cursor: "pointer",
              fontWeight: 600,
            }}>
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
          <pre style={{
            flex: 1,
            overflow: "auto",
            padding: "16px",
            margin: 0,
            color: "#c9d1d9",
            fontSize: "0.8rem",
            fontFamily: "'Fira Code', 'Consolas', monospace",
            lineHeight: "1.6",
            whiteSpace: "pre-wrap",
          }}>
            {generatedCode}
          </pre>
        </div>
      )}
    </>
  );
}
