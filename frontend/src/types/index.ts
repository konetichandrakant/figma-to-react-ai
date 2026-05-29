export interface UINode {
  id: string;
  type: ComponentType;
  props: Record<string, string>;
  styles: Record<string, string>;
  text?: string;
  children: UINode[];
}

export type ComponentType =
  | "Container"
  | "Row"
  | "Column"
  | "Text"
  | "Heading"
  | "Button"
  | "Input"
  | "Image"
  | "Card"
  | "Navbar"
  | "List"
  | "ListItem"
  | "Divider";

export interface User {
  id: number;
  email: string;
  username: string;
}

export interface Project {
  id: number;
  name: string;
  description: string;
  ui_tree: string;
  generated_code: string;
  owner_id: number;
}

export interface DragItem {
  type: string;
  componentType: ComponentType;
  id?: string;
}

export const COMPONENT_DEFAULTS: Record<ComponentType, Partial<UINode>> = {
  Container: {
    props: {},
    styles: { display: "flex", flexDirection: "column", padding: "16px", gap: "8px", minHeight: "60px", border: "1px dashed #e2e8f0", borderRadius: "8px" },
    children: [],
  },
  Row: {
    props: {},
    styles: { display: "flex", flexDirection: "row", gap: "12px", padding: "8px", minHeight: "40px", alignItems: "center", border: "1px dashed #e2e8f0", borderRadius: "8px" },
    children: [],
  },
  Column: {
    props: {},
    styles: { display: "flex", flexDirection: "column", gap: "8px", padding: "8px", minHeight: "40px", border: "1px dashed #e2e8f0", borderRadius: "8px" },
    children: [],
  },
  Text: {
    props: {},
    styles: { fontSize: "16px", color: "#1a202c", lineHeight: "1.6" },
    text: "Edit this text",
    children: [],
  },
  Heading: {
    props: {},
    styles: { fontSize: "24px", fontWeight: "700", color: "#1a202c", fontFamily: "'Poppins', sans-serif" },
    text: "Heading",
    children: [],
  },
  Button: {
    props: {},
    styles: {
      padding: "10px 24px",
      borderRadius: "50px",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      color: "#ffffff",
      fontWeight: "600",
      fontSize: "14px",
      border: "none",
      cursor: "pointer",
    },
    text: "Button",
    children: [],
  },
  Input: {
    props: { placeholder: "Enter text..." },
    styles: {
      padding: "10px 16px",
      borderRadius: "12px",
      border: "1px solid #e2e8f0",
      fontSize: "14px",
      width: "200px",
      outline: "none",
    },
    children: [],
  },
  Image: {
    props: { src: "https://via.placeholder.com/200x150", alt: "placeholder" },
    styles: { width: "200px", height: "150px", objectFit: "cover", borderRadius: "12px" },
    children: [],
  },
  Card: {
    props: {},
    styles: {
      background: "#ffffff",
      borderRadius: "20px",
      padding: "24px",
      boxShadow: "0 4px 6px rgba(0,0,0,0.1), 0 2px 4px rgba(0,0,0,0.06)",
      minHeight: "100px",
    },
    children: [],
  },
  Navbar: {
    props: {},
    styles: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "16px 32px",
      background: "rgba(255,255,255,0.95)",
      backdropFilter: "blur(20px)",
      borderBottom: "1px solid #e2e8f0",
      borderRadius: "12px",
    },
    children: [],
  },
  List: {
    props: {},
    styles: { display: "flex", flexDirection: "column", gap: "4px", padding: "8px" },
    children: [],
  },
  ListItem: {
    props: {},
    styles: { padding: "8px 16px", borderRadius: "8px", background: "#f7fafc", color: "#2d3748", fontSize: "14px" },
    text: "List item",
    children: [],
  },
  Divider: {
    props: {},
    styles: { border: "none", borderTop: "1px solid #e2e8f0", margin: "8px 0", width: "100%" },
    children: [],
  },
};
