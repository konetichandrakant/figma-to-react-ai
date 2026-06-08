import React, { useState } from "react";
import useEditorStore from "../../store/editorStore";
import { UINode } from "../../types";
import { theme } from "../../styles/theme";

interface Props {
  node: UINode;
  depth?: number;
}

function TreeNode({ node, depth = 0 }: Props) {
  const { selectedId, selectNode, removeNode } = useEditorStore();
  const [expanded, setExpanded] = useState(true);
  const hasChildren = node.children.length > 0;
  const isSelected = selectedId === node.id;

  return (
    <div>
      <div
        onClick={(e) => {
          e.stopPropagation();
          selectNode(node.id);
        }}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "4px",
          padding: "4px 8px",
          marginLeft: depth * 16,
          borderRadius: theme.radius.sm,
          fontSize: "0.78rem",
          cursor: "pointer",
          background: isSelected ? "rgba(102, 126, 234, 0.08)" : "transparent",
          color: isSelected ? theme.colors.primary : theme.colors.textSecondary,
          fontWeight: isSelected ? 600 : 400,
          transition: theme.transitions.fast,
          borderLeft: isSelected ? `2px solid ${theme.colors.primary}` : "2px solid transparent",
        }}
        onMouseEnter={(e) => {
          if (!isSelected) e.currentTarget.style.background = "rgba(102, 126, 234, 0.04)";
        }}
        onMouseLeave={(e) => {
          if (!isSelected) e.currentTarget.style.background = "transparent";
        }}
      >
        {hasChildren ? (
          <span
            onClick={(e) => {
              e.stopPropagation();
              setExpanded(!expanded);
            }}
            style={{ fontSize: "0.6rem", width: "12px", cursor: "pointer" }}
          >
            {expanded ? "▼" : "▶"}
          </span>
        ) : (
          <span style={{ width: "12px" }} />
        )}
        <span style={{ opacity: 0.5, fontSize: "0.68rem" }}>
          {getTypeIcon(node.type)}
        </span>
        <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {node.type}
          {node.text && <span style={{ opacity: 0.4, marginLeft: "4px" }}>"{node.text.slice(0, 15)}{node.text.length > 15 ? "..." : ""}"</span>}
        </span>
        <span
          onClick={(e) => {
            e.stopPropagation();
            removeNode(node.id);
          }}
          style={{
            opacity: 0,
            fontSize: "0.7rem",
            color: "#e53e3e",
            cursor: "pointer",
            width: "16px",
            textAlign: "center",
            transition: theme.transitions.fast,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = "1";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = "0";
          }}
        >
          ✕
        </span>
      </div>
      {hasChildren && expanded && node.children.map((child) => (
        <TreeNode key={child.id} node={child} depth={depth + 1} />
      ))}
    </div>
  );
}

function getTypeIcon(type: string): string {
  const icons: Record<string, string> = {
    Container: "⊞",
    Row: "⊏",
    Column: "⊑",
    Text: "T",
    Heading: "H",
    Button: "▣",
    Input: "▭",
    Image: "▨",
    Card: "▢",
    Navbar: "☰",
    List: "≡",
    ListItem: "•",
    Divider: "—",
  };
  return icons[type] || "◻";
}

export default function TreeView() {
  const { tree } = useEditorStore();
  const [visible, setVisible] = useState(true);

  return (
    <div style={{
      position: "absolute",
      bottom: "16px",
      left: "16px",
      width: "280px",
      background: "rgba(255, 255, 255, 0.95)",
      backdropFilter: "blur(12px)",
      borderRadius: theme.radius.lg,
      border: `1px solid ${theme.colors.borderLight}`,
      boxShadow: theme.shadows.lg,
      zIndex: 100,
      overflow: "hidden",
    }}>
      <div
        onClick={() => setVisible(!visible)}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "10px 14px",
          cursor: "pointer",
          borderBottom: visible ? `1px solid ${theme.colors.borderLight}` : "none",
          fontWeight: 700,
          fontSize: "0.72rem",
          textTransform: "uppercase" as const,
          letterSpacing: "0.8px",
          color: theme.colors.textMuted,
          transition: theme.transitions.fast,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = theme.colors.primary;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = theme.colors.textMuted;
        }}
      >
        <span>UI Tree</span>
        <span style={{ fontSize: "0.6rem" }}>{visible ? "▼" : "▶"}</span>
      </div>
      {visible && (
        <div style={{ padding: "8px", maxHeight: "300px", overflowY: "auto" }}>
          {(tree?.children?.length ?? 0) === 0 ? (
            <div style={{ padding: "12px", textAlign: "center", color: theme.colors.textMuted, fontSize: "0.78rem" }}>
              Empty tree
            </div>
          ) : (
            (tree?.children ?? []).map((child) => (
              <TreeNode key={child.id} node={child} />
            ))
          )}
        </div>
      )}
    </div>
  );
}
