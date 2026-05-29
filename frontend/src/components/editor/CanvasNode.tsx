import React from "react";
import { useDrag, useDrop } from "react-dnd";
import useEditorStore from "../../store/editorStore";
import { UINode, DragItem } from "../../types";
import { theme } from "../../styles/theme";

interface Props {
  node: UINode;
  selected: boolean;
}

const CONTAINER_TYPES = new Set(["Container", "Row", "Column", "Card", "Navbar", "List"]);

function isContainer(type: string): boolean {
  return CONTAINER_TYPES.has(type);
}

export default function CanvasNode({ node, selected }: Props) {
  const { selectNode, removeNode, updateNode, moveNode } = useEditorStore();

  const [{ isDragging }, dragRef] = useDrag({
    type: "TREE_NODE",
    item: { type: "TREE_NODE", id: node.id, componentType: node.type } as DragItem,
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
  });

  const [{ isOver }, dropRef] = useDrop({
    accept: ["PALETTE_ITEM", "TREE_NODE"],
    drop: (item: DragItem, monitor) => {
      if (monitor.didDrop()) return;
      if (!isContainer(node.type)) return;

      if (item.type === "PALETTE_ITEM") {
        useEditorStore.getState().addNode(item.componentType, node.id);
      } else if (item.id && item.id !== node.id) {
        moveNode(item.id, node.id);
      }
    },
    canDrop: (item: DragItem) => {
      if (item.type === "TREE_NODE" && item.id === node.id) return false;
      return isContainer(node.type);
    },
    collect: (monitor) => ({ isOver: monitor.isOver({ shallow: true }) }),
  });

  const ref = React.useRef<HTMLDivElement>(null);
  dragRef(dropRef(ref));

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    selectNode(node.id);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    removeNode(node.id);
  };

  const isLeaf = !isContainer(node.type);

  const nodeStyles: React.CSSProperties = {
    ...node.styles as React.CSSProperties,
    position: "relative" as const,
    outline: selected ? `2px solid ${theme.colors.primary}` : isOver ? `2px dashed ${theme.colors.primary}` : "none",
    outlineOffset: "2px",
    opacity: isDragging ? 0.4 : 1,
    cursor: "pointer",
    transition: theme.transitions.fast,
  };

  const childrenContent = node.children.length > 0 ? (
    node.children.map((child) => (
      <CanvasNode key={child.id} node={child} selected={useEditorStore.getState().selectedId === child.id} />
    ))
  ) : isContainer(node.type) ? (
    <div style={{
      padding: "12px",
      textAlign: "center",
      color: theme.colors.textMuted,
      fontSize: "0.75rem",
      border: `1px dashed ${theme.colors.border}`,
      borderRadius: "4px",
    }}>
      Drop here
    </div>
  ) : null;

  return (
    <div ref={ref} onClick={handleClick} style={nodeStyles}>
      {selected && (
        <div style={{
          position: "absolute",
          top: "-22px",
          left: "0",
          display: "flex",
          alignItems: "center",
          gap: "4px",
          zIndex: 10,
        }}>
          <span style={{
            background: theme.colors.primary,
            color: "#fff",
            fontSize: "0.65rem",
            fontWeight: 600,
            padding: "2px 8px",
            borderRadius: "4px 4px 0 0",
            fontFamily: theme.fonts.body,
          }}>
            {node.type}
          </span>
          <button
            onClick={handleDelete}
            style={{
              background: "#e53e3e",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              width: "18px",
              height: "18px",
              fontSize: "0.65rem",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            ✕
          </button>
        </div>
      )}

      {isLeaf ? renderLeaf(node) : childrenContent}
    </div>
  );
}

function renderLeaf(node: UINode): React.ReactNode {
  switch (node.type) {
    case "Text":
    case "Heading":
      const Tag = node.type === "Heading" ? "h2" : "p";
      return React.createElement(Tag, { style: node.styles as React.CSSProperties }, node.text || "Text");
    case "Button":
      return <button style={{ ...node.styles as React.CSSProperties, pointerEvents: "none" as const }}>{node.text || "Button"}</button>;
    case "Input":
      return <input type="text" placeholder={node.props.placeholder || "Enter text..."} style={{ ...node.styles as React.CSSProperties, pointerEvents: "none" as const }} readOnly />;
    case "Image":
      return <img src={node.props.src || "https://via.placeholder.com/200x150"} alt={node.props.alt || "img"} style={node.styles as React.CSSProperties} />;
    case "Divider":
      return <hr style={node.styles as React.CSSProperties} />;
    case "ListItem":
      return <div style={node.styles as React.CSSProperties}>{node.text || "List item"}</div>;
    default:
      return <div style={node.styles as React.CSSProperties}>{node.text}</div>;
  }
}
