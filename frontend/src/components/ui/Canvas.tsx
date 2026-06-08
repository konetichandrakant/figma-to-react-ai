import React, { useCallback } from "react";
import { useDrop } from "react-dnd";
import useEditorStore from "../../store/editorStore";
import { DragItem, UINode, ComponentType } from "../../types";
import { theme } from "../../styles/theme";
import CanvasNode from "./CanvasNode";

export default function Canvas() {
  const { tree, selectedId, selectNode, addNode } = useEditorStore();

  const [{ isOver, canDrop }, dropRef] = useDrop({
    accept: ["PALETTE_ITEM", "TREE_NODE"],
    drop: (item: DragItem, monitor) => {
      if (monitor.didDrop()) return;
      if (item.type === "PALETTE_ITEM") {
        addNode(item.componentType);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver({ shallow: true }),
      canDrop: monitor.canDrop(),
    }),
  });

  return (
    <div
      ref={dropRef as unknown as React.Ref<HTMLDivElement>}
      onClick={(e) => {
        if (e.target === e.currentTarget) selectNode(null);
      }}
      style={{
        flex: 1,
        overflow: "auto",
        background: isOver && canDrop ? "rgba(102, 126, 234, 0.03)" : "#ffffff",
        transition: theme.transitions.fast,
        position: "relative",
      }}
    >
      <div style={{
        maxWidth: "960px",
        margin: "0 auto",
        padding: "32px",
        minHeight: "calc(100vh - 64px)",
      }}>
        {(tree?.children?.length ?? 0) === 0 ? (
          <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "400px",
            background: theme.colors.cardBg,
            border: `2px dashed ${theme.colors.border}`,
            borderRadius: theme.radius.xl,
            color: theme.colors.textMuted,
            fontSize: "1rem",
          }}>
            <div style={{ fontSize: "3rem", marginBottom: "16px", opacity: 0.25 }}>⊕</div>
            <div style={{ fontWeight: 600, marginBottom: "4px", color: theme.colors.textLight }}>Drop components here</div>
            <div style={{ fontSize: "0.85rem" }}>Drag from the sidebar to start building</div>
          </div>
        ) : (
          (tree?.children ?? []).map((node) => (
            <CanvasNode key={node.id} node={node} selected={selectedId === node.id} />
          ))
        )}
      </div>
    </div>
  );
}
