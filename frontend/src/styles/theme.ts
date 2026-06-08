export const theme = {
  colors: {
    primary: "#667eea",
    primaryDark: "#5a67d8",
    primaryLight: "#7c8efc",
    accent: "#a5b4fc",          // indigo-300, matches portfolio accent family
    accentLight: "#c7d2fe",     // indigo-200
    secondary: "#48bb78",
    accentOrange: "#f6ad55",
    textPrimary: "#1a202c",
    textSecondary: "#2d3748",
    textLight: "#4a5568",
    textMuted: "#718096",
    bgPrimary: "#ffffff",
    bgSecondary: "#f7fafc",
    bgLight: "#edf2f7",
    border: "#e2e8f0",
    borderLight: "rgba(102, 126, 234, 0.1)",   // thin accent borders (portfolio pattern)
    gradientPrimary: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    gradientSecondary: "linear-gradient(135deg, #48bb78 0%, #38a169 100%)",
    gradientAccent: "linear-gradient(135deg, #f6ad55 0%, #ed8936 100%)",
    // Card backgrounds at very low opacity (portfolio pattern)
    cardBg: "linear-gradient(135deg, rgba(102, 126, 234, 0.06), rgba(118, 75, 162, 0.02))",
    cardBgHover: "linear-gradient(135deg, rgba(102, 126, 234, 0.10), rgba(118, 75, 162, 0.04))",
    // Heading gradient (portfolio pattern — top-to-bottom fade)
    headingGradient: "linear-gradient(to bottom, #1a202c, #718096)",
  },
  fonts: {
    body: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    heading: "'Poppins', sans-serif",
  },
  shadows: {
    sm: "0 1px 3px rgba(0,0,0,0.06)",
    md: "0 4px 6px rgba(0,0,0,0.07)",
    lg: "0 10px 15px rgba(0,0,0,0.08)",
    xl: "0 20px 25px rgba(0,0,0,0.08)",
    // Portfolio-style accent shadows (soft colored glow)
    accent: "0 25px 50px rgba(102, 126, 234, 0.12)",
    accentHover: "0 25px 50px rgba(102, 126, 234, 0.18)",
    glow: "0 0 20px rgba(102, 126, 234, 0.15)",
  },
  radius: {
    sm: "6px",
    md: "8px",
    lg: "12px",       // portfolio standard card radius
    xl: "20px",
    pill: "50px",
  },
  transitions: {
    fast: "all 150ms ease-in-out",       // portfolio pattern
    normal: "all 300ms ease-in-out",      // portfolio pattern
    slow: "all 500ms ease-in-out",
  },
  spacing: {
    xs: "0.25rem",    // 4px
    sm: "0.5rem",     // 8px
    md: "1rem",       // 16px
    lg: "1.75rem",    // 28px
    xl: "2.5rem",     // 40px
    "2xl": "3rem",    // 48px
    "3xl": "3.5rem",  // 56px
  },
};
