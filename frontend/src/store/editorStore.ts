import { create } from "zustand";
import { UINode, ComponentType, COMPONENT_DEFAULTS } from "../types";

function uid(): string {
  return "n_" + Math.random().toString(36).slice(2, 10);
}

function createNode(type: ComponentType): UINode {
  const def = COMPONENT_DEFAULTS[type];
  return {
    id: uid(),
    type,
    props: { ...(def.props || {}) },
    styles: { ...(def.styles || {}) },
    text: def.text,
    children: [],
  };
}

function deepFind(nodes: UINode[], id: string): UINode | null {
  for (const n of nodes) {
    if (n.id === id) return n;
    const found = deepFind(n.children, id);
    if (found) return found;
  }
  return null;
}

function deepRemove(nodes: UINode[], id: string): UINode[] {
  return nodes
    .filter((n) => n.id !== id)
    .map((n) => ({ ...n, children: deepRemove(n.children, id) }));
}

function deepUpdate(nodes: UINode[], id: string, patch: Partial<UINode>): UINode[] {
  return nodes.map((n: UINode): UINode => {
    if (n.id === id) {
      return { ...n, ...patch };
    }
    return { ...n, children: deepUpdate(n.children, id, patch) };
  });
}

function addChild(nodes: UINode[], parentId: string, child: UINode): UINode[] {
  return nodes.map((n: UINode): UINode => {
    if (n.id === parentId) {
      return { ...n, children: [...n.children, child] };
    }
    return { ...n, children: addChild(n.children, parentId, child) };
  });
}

const ROOT_ID = "root";

const emptyTree: UINode = {
  id: ROOT_ID,
  type: "Container",
  props: {},
  styles: { display: "flex", flexDirection: "column", minHeight: "100%", padding: "24px", gap: "16px", background: "#ffffff" },
  children: [],
};

interface EditorState {
  tree: UINode;
  selectedId: string | null;
  generatedCode: string;
  generating: boolean;
  addNode: (type: ComponentType, parentId?: string) => void;
  selectNode: (id: string | null) => void;
  updateNode: (id: string, patch: Partial<UINode>) => void;
  removeNode: (id: string) => void;
  moveNode: (nodeId: string, targetId: string) => void;
  setTree: (tree: UINode) => void;
  setGeneratedCode: (code: string) => void;
  setGenerating: (v: boolean) => void;
  getSelectedNode: () => UINode | null;
  clearCanvas: () => void;
}

const useEditorStore = create<EditorState>((set, get) => ({
  tree: { ...emptyTree, children: [] },
  selectedId: null,
  generatedCode: "",
  generating: false,

  addNode: (type: ComponentType, parentId?: string) => {
    const node = createNode(type);
    const target = parentId || ROOT_ID;
    set((s) => {
      const newTree = addChild([s.tree], target, node)[0];
      return { tree: newTree };
    });
  },

  selectNode: (id: string | null) => set({ selectedId: id }),

  updateNode: (id: string, patch: Partial<UINode>) => {
    set((s) => {
      const newChildren = deepUpdate(s.tree.children, id, patch);
      return { tree: { ...s.tree, children: newChildren } };
    });
  },

  removeNode: (id: string) => {
    set((s) => {
      const newChildren = deepRemove(s.tree.children, id);
      return {
        tree: { ...s.tree, children: newChildren },
        selectedId: s.selectedId === id ? null : s.selectedId,
      };
    });
  },

  moveNode: (nodeId: string, targetId: string) => {
    const state = get();
    const node = deepFind(state.tree.children, nodeId);
    if (!node || nodeId === targetId) return;
    const without = deepRemove(state.tree.children, nodeId);
    let newTree: UINode;
    if (targetId === ROOT_ID) {
      newTree = { ...state.tree, children: [...without, node] };
    } else {
      newTree = { ...state.tree, children: addChild(without, targetId, node) };
    }
    set({ tree: newTree });
  },

  setTree: (tree: UINode) => set({ tree }),

  setGeneratedCode: (code: string) => set({ generatedCode: code }),
  setGenerating: (v: boolean) => set({ generating: v }),

  getSelectedNode: (): UINode | null => {
    const s = get();
    if (!s.selectedId) return null;
    return deepFind(s.tree.children, s.selectedId);
  },

  clearCanvas: () => set({ tree: { ...emptyTree, children: [] }, selectedId: null, generatedCode: "" }),
}));

export default useEditorStore;
