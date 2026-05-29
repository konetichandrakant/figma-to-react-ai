import React from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Navbar from "../layout/Navbar";
import Sidebar from "../layout/Sidebar";
import Canvas from "./Canvas";
import PropertyPanel from "./PropertyPanel";
import TreeView from "./TreeView";
import CodePreview from "../preview/CodePreview";

export default function EditorPage() {
  return (
    <DndProvider backend={HTML5Backend}>
      <div style={{ display: "flex", flexDirection: "column", height: "100vh", background: "#ffffff" }}>
        <Navbar />
        <CodePreview />
        <div style={{ display: "flex", flex: 1, overflow: "hidden", marginTop: "64px" }}>
          <Sidebar />
          <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
            <Canvas />
            <TreeView />
          </div>
          <PropertyPanel />
        </div>
      </div>
    </DndProvider>
  );
}
