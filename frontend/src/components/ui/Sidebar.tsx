import React, { useState } from "react";
import { ComponentType } from "../../types";
import { theme } from "../../styles/theme";
import { useDrag } from "react-dnd";

const COMPONENT_ICONS: Record<ComponentType, string> = {
  Container: "⊞",
  Row: "⊞",
  Column: "⊞",
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

const CATEGORIES: { label: string; types: ComponentType[] }[] = [
  { label: "Layout", types: ["Container", "Row", "Column"] },
  { label: "Content", types: ["Text", "Heading", "Image", "Divider"] },
  { label: "Inputs", types: ["Button", "Input"] },
  { label: "Composite", types: ["Card", "Navbar", "List", "ListItem"] },
];

interface PaletteItemProps {
  type: ComponentType;
}

function PaletteItem({ type }: PaletteItemProps) {
  const [{ isDragging }, dragRef] = useDrag({
    type: "PALETTE_ITEM",
    item: { type: "PALETTE_ITEM", componentType: type },
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
  });

  return (
    <div
      ref={dragRef as unknown as React.Ref<HTMLDivElement>}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        padding: "9px 14px",
        borderRadius: theme.radius.lg,
        background: theme.colors.cardBg,
        border: `1px solid ${theme.colors.borderLight}`,
        cursor: "grab",
        opacity: isDragging ? 0.5 : 1,
        fontSize: "0.82rem",
        fontWeight: 500,
        color: theme.colors.textSecondary,
        transition: theme.transitions.fast,
        position: "relative",
        overflow: "hidden",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "rgba(102, 126, 234, 0.25)";
        e.currentTarget.style.background = theme.colors.cardBgHover;
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.boxShadow = theme.shadows.glow;
        e.currentTarget.style.color = theme.colors.primary;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = theme.colors.borderLight;
        e.currentTarget.style.background = theme.colors.cardBg;
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "none";
        e.currentTarget.style.color = theme.colors.textSecondary;
      }}
    >
      <span style={{ fontSize: "1.1rem", width: "20px", textAlign: "center", opacity: 0.8 }}>
        {COMPONENT_ICONS[type]}
      </span>
      {type}
    </div>
  );
}

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div
      style={{
        width: collapsed ? "56px" : "260px",
        minWidth: collapsed ? "56px" : "260px",
        height: "100%",
        background: "rgba(247, 250, 252, 0.7)",
        backdropFilter: "blur(8px)",
        borderRight: `1px solid ${theme.colors.borderLight}`,
        transition: theme.transitions.normal,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "16px",
          borderBottom: `1px solid ${theme.colors.borderLight}`,
        }}
      >
        {!collapsed && (
          <span
            style={{
              fontWeight: 700,
              fontSize: "0.75rem",
              textTransform: "uppercase" as const,
              letterSpacing: "1px",
              color: theme.colors.textMuted,
            }}
          >
            Components
          </span>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: "1rem",
            color: theme.colors.textLight,
            padding: "4px",
            borderRadius: theme.radius.sm,
            transition: theme.transitions.fast,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = theme.colors.primary;
            e.currentTarget.style.background = "rgba(102, 126, 234, 0.06)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = theme.colors.textLight;
            e.currentTarget.style.background = "none";
          }}
        >
          {collapsed ? "▸" : "◂"}
        </button>
      </div>

      <div style={{ padding: collapsed ? "8px" : "12px", overflowY: "auto", flex: 1 }}>
        {CATEGORIES.map((cat) => (
          <div key={cat.label} style={{ marginBottom: "16px" }}>
            {!collapsed && (
              <div
                style={{
                  fontSize: "0.68rem",
                  fontWeight: 700,
                  textTransform: "uppercase" as const,
                  letterSpacing: "1px",
                  color: theme.colors.textMuted,
                  marginBottom: "8px",
                  paddingLeft: "4px",
                }}
              >
                {cat.label}
              </div>
            )}
            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              {cat.types.map((type) => (
                <PaletteItem key={type} type={type} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
