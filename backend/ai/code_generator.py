import json
import os
from langchain_openai import ChatOpenAI
from langchain_core.messages import SystemMessage, HumanMessage
from ai.prompts import SYSTEM_PROMPT, TREE_TO_CODE_PROMPT

_openai_key = os.getenv("OPENAI_API_KEY", "")


def _build_fallback_code(ui_tree: dict, component_name: str) -> str:
    """Generate code without AI - pure template-based fallback."""
    nodes = _flatten_tree(ui_tree)
    children_jsx = _render_nodes(ui_tree.get("children", []), 6)

    return f"""import React from 'react';

const {component_name}: React.FC = () => {{
  return (
    <div style={{{{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      padding: '24px',
      backgroundColor: '#ffffff',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    }}}}>
{children_jsx}
    </div>
  );
}};

export default {component_name};
"""


def _flatten_tree(node: dict) -> list:
    result = [node]
    for child in node.get("children", []):
        result.extend(_flatten_tree(child))
    return result


def _render_nodes(nodes: list, indent: int) -> str:
    if not nodes:
        return f"{' ' * indent}<p style={{{{ color: '#718096', textAlign: 'center' }}}}>Drop components here</p>"

    lines = []
    pad = " " * indent
    for node in nodes:
        lines.append(_render_node(node, indent))
    return "\n".join(lines)


def _render_node(node: dict, indent: int) -> str:
    pad = " " * indent
    node_type = node.get("type", "div")
    props = node.get("props", {})
    styles = node.get("styles", {})
    text = node.get("text", "")
    children = node.get("children", [])

    style_str = _style_to_jsx(styles)
    tag = _get_tag(node_type)

    if children:
        children_jsx = _render_nodes(children, indent + 2)
        return f"""{pad}<{tag} style={{{{{style_str}}}}}>
{children_jsx}
{pad}</{tag}>"""
    elif text:
        escaped = text.replace("'", "\\'")
        return f"{pad}<{tag} style={{{{{style_str}}}}}>{{'{escaped}'}}</{tag}>"
    elif node_type == "image":
        src = props.get("src", "https://via.placeholder.com/150")
        alt = props.get("alt", "image")
        return f'{pad}<{tag} src="{src}" alt="{alt}" style={{{{{style_str}}}}} />'
    elif node_type == "input":
        placeholder = props.get("placeholder", "Enter text...")
        return f'{pad}<{tag} type="text" placeholder="{placeholder}" style={{{{{style_str}}}}} />'
    elif node_type == "divider":
        return f"{pad}<hr style={{{{{style_str}}}}} />"
    else:
        return f"{pad}<{tag} style={{{{{style_str}}}}} />"


def _get_tag(node_type: str) -> str:
    mapping = {
        "container": "div",
        "row": "div",
        "column": "div",
        "text": "p",
        "heading": "h2",
        "button": "button",
        "input": "input",
        "image": "img",
        "card": "div",
        "navbar": "nav",
        "list": "ul",
        "listitem": "li",
        "divider": "hr",
    }
    return mapping.get(node_type.lower(), "div")


def _style_to_jsx(styles: dict) -> str:
    if not styles:
        return ""
    parts = []
    for k, v in styles.items():
        if isinstance(v, str) and v.isdigit():
            parts.append(f"{k}: {v}")
        else:
            parts.append(f"{k}: '{v}'")
    return ", ".join(parts)


async def generate_react_code(ui_tree: dict, component_name: str) -> str:
    """
    Generate React code from a UI tree.
    Uses LangChain + OpenAI if API key is available.
    Falls back to template-based generation otherwise (no AI cost).
    """
    if not _openai_key:
        return _build_fallback_code(ui_tree, component_name)

    try:
        llm = ChatOpenAI(model="gpt-4o-mini", temperature=0.1, max_tokens=4096)
        tree_json = json.dumps(ui_tree, indent=2)
        user_prompt = TREE_TO_CODE_PROMPT.format(
            component_name=component_name,
            ui_tree_json=tree_json,
        )
        response = await llm.ainvoke([
            SystemMessage(content=SYSTEM_PROMPT),
            HumanMessage(content=user_prompt),
        ])
        code = response.content.strip()
        if code.startswith("```"):
            lines = code.split("\n")
            code = "\n".join(lines[1:-1])
        return code
    except Exception:
        return _build_fallback_code(ui_tree, component_name)
