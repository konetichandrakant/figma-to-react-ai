import React, { useEffect, useState } from "react";
import useEditorStore from "../../store/editorStore";
import { theme } from "../../styles/theme";

const STYLE_CATEGORIES = [
  {
    label: "Layout",
    fields: [
      { key: "display", label: "Display" },
      { key: "flexDirection", label: "Direction" },
      { key: "justifyContent", label: "Justify" },
      { key: "alignItems", label: "Align" },
      { key: "gap", label: "Gap" },
    ],
  },
  {
    label: "Spacing",
    fields: [
      { key: "padding", label: "Padding" },
      { key: "margin", label: "Margin" },
      { key: "width", label: "Width" },
      { key: "minHeight", label: "Min Height" },
    ],
  },
  {
    label: "Typography",
    fields: [
      { key: "fontSize", label: "Font Size" },
      { key: "fontWeight", label: "Weight" },
      { key: "color", label: "Color" },
      { key: "lineHeight", label: "Line Height" },
      { key: "textAlign", label: "Align" },
    ],
  },
  {
    label: "Appearance",
    fields: [
      { key: "background", label: "Background" },
      { key: "border", label: "Border" },
      { key: "borderRadius", label: "Radius" },
      { key: "boxShadow", label: "Shadow" },
    ],
  },
];

export default function PropertyPanel() {
  const { selectedId, getSelectedNode, updateNode } = useEditorStore();
  const node = getSelectedNode();
  const [localStyles, setLocalStyles] = useState<Record<string, string>>({});
  const [localText, setLocalText] = useState("");
  const [localProps, setLocalProps] = useState<Record<string, string>>({});

  useEffect(() => {
    if (node) {
      setLocalStyles({ ...node.styles });
      setLocalText(node.text || "");
      setLocalProps({ ...node.props });
    }
  }, [selectedId, node?.id]);

  if (!node) {
    return (
      <div style={{
        width: "280px",
        minWidth: "280px",
        height: "100%",
        background: "rgba(247, 250, 252, 0.7)",
        backdropFilter: "blur(8px)",
        borderLeft: `1px solid ${theme.colors.borderLight}`,
        padding: "24px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        color: theme.colors.textMuted,
        fontSize: "0.9rem",
      }}>
        <div style={{ fontSize: "2rem", marginBottom: "12px", opacity: 0.25 }}>⊹</div>
        Select a component to edit its properties
      </div>
    );
  }

  const handleStyleChange = (key: string, value: string) => {
    const updated = { ...localStyles, [key]: value };
    setLocalStyles(updated);
    updateNode(node.id, { styles: updated });
  };

  const handleTextChange = (value: string) => {
    setLocalText(value);
    updateNode(node.id, { text: value });
  };

  const handlePropChange = (key: string, value: string) => {
    const updated = { ...localProps, [key]: value };
    setLocalProps(updated);
    updateNode(node.id, { props: updated });
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "6px 10px",
    borderRadius: theme.radius.sm,
    border: `1px solid ${theme.colors.border}`,
    fontSize: "0.78rem",
    fontFamily: theme.fonts.body,
    outline: "none",
    background: "#ffffff",
    boxSizing: "border-box",
    color: theme.colors.textPrimary,
    transition: theme.transitions.fast,
  };

  const labelStyle: React.CSSProperties = {
    fontSize: "0.68rem",
    fontWeight: 600,
    color: theme.colors.textMuted,
    marginBottom: "3px",
    display: "block",
  };

  return (
    <div style={{
      width: "280px",
      minWidth: "280px",
      height: "100%",
      background: "rgba(247, 250, 252, 0.7)",
      backdropFilter: "blur(8px)",
      borderLeft: `1px solid ${theme.colors.borderLight}`,
      overflowY: "auto",
    }}>
      <div style={{
        padding: "16px",
        borderBottom: `1px solid ${theme.colors.borderLight}`,
      }}>
        <div style={{
          fontWeight: 700,
          fontSize: "0.7rem",
          textTransform: "uppercase" as const,
          letterSpacing: "0.8px",
          color: theme.colors.textMuted,
          marginBottom: "8px",
        }}>
          Properties
        </div>
        <div style={{
          background: theme.colors.gradientPrimary,
          color: "#fff",
          fontSize: "0.75rem",
          fontWeight: 600,
          padding: "3px 12px",
          borderRadius: theme.radius.pill,
          display: "inline-block",
        }}>
          {node.type}
        </div>
      </div>

      {/* Text content */}
      {(node.type === "Text" || node.type === "Heading" || node.type === "Button" || node.type === "ListItem") && (
        <div style={{ padding: "12px 16px", borderBottom: `1px solid ${theme.colors.borderLight}` }}>
          <label style={labelStyle}>Content</label>
          <textarea
            value={localText}
            onChange={(e) => handleTextChange(e.target.value)}
            style={{ ...inputStyle, minHeight: "60px", resize: "vertical" }}
          />
        </div>
      )}

      {/* Props */}
      {(node.type === "Input" || node.type === "Image") && (
        <div style={{ padding: "12px 16px", borderBottom: `1px solid ${theme.colors.borderLight}` }}>
          <div style={{ ...labelStyle, marginBottom: "8px" }}>Attributes</div>
          {node.type === "Input" && (
            <div style={{ marginBottom: "8px" }}>
              <label style={labelStyle}>Placeholder</label>
              <input style={inputStyle} value={localProps.placeholder || ""} onChange={(e) => handlePropChange("placeholder", e.target.value)} />
            </div>
          )}
          {node.type === "Image" && (
            <>
              <div style={{ marginBottom: "8px" }}>
                <label style={labelStyle}>Image URL</label>
                <input style={inputStyle} value={localProps.src || ""} onChange={(e) => handlePropChange("src", e.target.value)} />
              </div>
              <div>
                <label style={labelStyle}>Alt Text</label>
                <input style={inputStyle} value={localProps.alt || ""} onChange={(e) => handlePropChange("alt", e.target.value)} />
              </div>
            </>
          )}
        </div>
      )}

      {/* Style categories */}
      {STYLE_CATEGORIES.map((cat) => (
        <div key={cat.label} style={{ padding: "12px 16px", borderBottom: `1px solid ${theme.colors.borderLight}` }}>
          <div style={{
            fontWeight: 700,
            fontSize: "0.68rem",
            textTransform: "uppercase" as const,
            letterSpacing: "0.8px",
            color: theme.colors.textMuted,
            marginBottom: "8px",
          }}>
            {cat.label}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
            {cat.fields.map((field) => (
              <div key={field.key} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <label style={{ ...labelStyle, width: "70px", minWidth: "70px", marginBottom: 0 }}>{field.label}</label>
                <input
                  style={{ ...inputStyle, flex: 1 }}
                  value={localStyles[field.key] || ""}
                  onChange={(e) => handleStyleChange(field.key, e.target.value)}
                  placeholder="—"
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = theme.colors.primary;
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = theme.colors.border;
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
