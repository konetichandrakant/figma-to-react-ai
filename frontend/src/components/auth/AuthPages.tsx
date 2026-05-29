import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import useAuthStore from "../../store/authStore";
import { theme } from "../../styles/theme";

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
    fontFamily: theme.fonts.body,
  } as React.CSSProperties,
  card: {
    background: "#ffffff",
    borderRadius: theme.radius.xl,
    padding: "48px",
    width: "100%",
    maxWidth: "440px",
    boxShadow: theme.shadows.xl,
  } as React.CSSProperties,
  logo: {
    fontFamily: theme.fonts.heading,
    fontWeight: 800 as const,
    fontSize: "2rem",
    background: theme.colors.gradientPrimary,
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    marginBottom: "8px",
    textAlign: "center" as const,
  } as React.CSSProperties,
  subtitle: {
    color: theme.colors.textLight,
    fontSize: "0.95rem",
    textAlign: "center" as const,
    marginBottom: "32px",
  } as React.CSSProperties,
  label: {
    display: "block",
    fontSize: "0.85rem",
    fontWeight: 600 as const,
    color: theme.colors.textSecondary,
    marginBottom: "6px",
  } as React.CSSProperties,
  input: {
    width: "100%",
    padding: "12px 16px",
    borderRadius: theme.radius.md,
    border: `1px solid ${theme.colors.border}`,
    fontSize: "0.95rem",
    fontFamily: theme.fonts.body,
    outline: "none",
    transition: theme.transitions.normal,
    marginBottom: "20px",
    boxSizing: "border-box" as const,
  } as React.CSSProperties,
  btnPrimary: {
    width: "100%",
    padding: "14px",
    borderRadius: theme.radius.pill,
    background: theme.colors.gradientPrimary,
    color: "#ffffff",
    fontWeight: 600 as const,
    fontSize: "1rem",
    border: "none",
    cursor: "pointer",
    boxShadow: theme.shadows.lg,
    transition: theme.transitions.normal,
    marginTop: "8px",
  } as React.CSSProperties,
  footer: {
    textAlign: "center" as const,
    marginTop: "24px",
    fontSize: "0.9rem",
    color: theme.colors.textLight,
  } as React.CSSProperties,
  link: {
    color: theme.colors.primary,
    textDecoration: "none",
    fontWeight: 600 as const,
  } as React.CSSProperties,
  error: {
    background: "#fff5f5",
    color: "#e53e3e",
    padding: "12px",
    borderRadius: theme.radius.md,
    fontSize: "0.85rem",
    marginBottom: "16px",
    border: "1px solid #fed7d7",
  } as React.CSSProperties,
};

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const login = useAuthStore((s) => s.login);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate("/editor");
    } catch (err: any) {
      const msg = err.response?.data?.detail || "Login failed. Please check your credentials and try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.logo}>FigmaReact AI</div>
        <p style={styles.subtitle}>Sign in to your account</p>
        {error && <div style={styles.error}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <label style={styles.label}>Email</label>
          <input
            style={styles.input}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
          />
          <label style={styles.label}>Password</label>
          <input
            style={styles.input}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />
          <button style={{ ...styles.btnPrimary, opacity: loading ? 0.7 : 1 }} disabled={loading} type="submit">
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
        <div style={styles.footer}>
          Don't have an account? <Link to="/register" style={styles.link}>Create one</Link>
        </div>
      </div>
    </div>
  );
}

export function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const register = useAuthStore((s) => s.register);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      await register(email, password);
      navigate("/editor");
    } catch (err: any) {
      let msg = "Registration failed. Please try again.";
      if (err.response?.data?.detail) {
        msg = err.response.data.detail;
      } else if (err.code === "ERR_NETWORK") {
        msg = "Cannot connect to server. Make sure the backend is running.";
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.logo}>FigmaReact AI</div>
        <p style={styles.subtitle}>Create your account</p>
        {error && <div style={styles.error}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <label style={styles.label}>Email</label>
          <input style={styles.input} type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
          <label style={styles.label}>Password</label>
          <input style={styles.input} type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required />
          <label style={styles.label}>Confirm Password</label>
          <input
            style={{
              ...styles.input,
              borderColor: confirmPassword && confirmPassword !== password ? "#e53e3e" : confirmPassword && confirmPassword === password ? "#48bb78" : undefined,
            }}
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••"
            required
          />
          <button style={{ ...styles.btnPrimary, opacity: loading ? 0.7 : 1 }} disabled={loading} type="submit">
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>
        <div style={styles.footer}>
          Already have an account? <Link to="/login" style={styles.link}>Sign in</Link>
        </div>
      </div>
    </div>
  );
}
