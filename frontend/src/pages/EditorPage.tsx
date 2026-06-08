import React, { useEffect } from "react";
import { useSearchParams, useLocation } from "react-router-dom";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/ui/Sidebar";
import Canvas from "../components/ui/Canvas";
import PropertyPanel from "../components/ui/PropertyPanel";
import TreeView from "../components/ui/TreeView";
import CodePreview from "../components/ui/CodePreview";
import useEditorStore from "../store/editorStore";
import api from "../utils/api";
import { UINode } from "../types";

export default function EditorPage() {
  const { setTree, setGeneratedCode, setCurrentProject, resetEditor } = useEditorStore();
  const [searchParams] = useSearchParams();
  const location = useLocation();

  useEffect(() => {
    const projectId =
      searchParams.get("project") || (location.state as any)?.projectId;

    if (projectId) {
      loadProject(Number(projectId));
    } else {
      resetEditor();
    }
  }, [searchParams]);

  const loadProject = async (id: number) => {
    try {
      const res = await api.get(`/api/projects/${id}`);
      const project = res.data;

      let tree: UINode;
      try {
        const parsed = JSON.parse(project.ui_tree || "{}");
        // If parsed tree is empty {} or missing id, use empty tree
        if (!parsed || !parsed.id) {
          tree = {
            id: "root",
            type: "Container",
            props: {},
            styles: {
              display: "flex",
              flexDirection: "column",
              minHeight: "100%",
              padding: "24px",
              gap: "16px",
              background: "#ffffff",
            },
            children: [],
          };
        } else {
          tree = parsed;
        }
      } catch {
        tree = {
          id: "root",
          type: "Container",
          props: {},
          styles: {
            display: "flex",
            flexDirection: "column",
            minHeight: "100%",
            padding: "24px",
            gap: "16px",
            background: "#ffffff",
          },
          children: [],
        };
      }

      setTree(tree);
      setGeneratedCode(project.generated_code || "");
      setCurrentProject(project.id, project.name);
    } catch {
      resetEditor();
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          background: "#ffffff",
        }}
      >
        <Navbar />
        <CodePreview />
        <div
          style={{
            display: "flex",
            flex: 1,
            overflow: "hidden",
            marginTop: "64px",
          }}
        >
          <Sidebar />
          <div
            style={{ flex: 1, position: "relative", overflow: "hidden" }}
          >
            <Canvas />
            <TreeView />
          </div>
          <PropertyPanel />
        </div>
      </div>
    </DndProvider>
  );
}
