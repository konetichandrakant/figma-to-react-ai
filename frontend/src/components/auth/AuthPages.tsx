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
    fontFamily: theme.fonts.body,
    position: "relative" as const,
  },
  card: {
    background: "rgba(255, 255, 255, 0.85)",
    backdropFilter: "blur(12px)",
    border: `1px solid ${theme.colors.borderLight}`,
    borderRadius: theme.radius.xl,
    padding: theme.spacing["3xl"],
    width: "100%",
    maxWidth: "440px",
    boxShadow: theme.shadows.accent,
    position: "relative" as const,
    overflow: "hidden" as const,
  },
  logo: {
    fontFamily: theme.fonts.heading,
    fontWeight: 800,
    fontSize: "2rem",
    background: theme.colors.gradientPrimary,
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    marginBottom: "4px",
    textAlign: "center" as const,
  },
  subtitle: {
    color: theme.colors.textLight,
    fontSize: "0.9rem",
    textAlign: "center" as const,
    marginBottom: theme.spacing["2xl"],
  },
  inputWrapper: {
    position: "relative" as const,
    marginBottom: theme.spacing.lg,
  },
  input: {
    width: "100%",
    padding: "22px 16px 8px",
    borderRadius: theme.radius.lg,
    border: `2px solid ${theme.colors.border}`,
    fontSize: "0.9rem",
    fontFamily: theme.fonts.body,
    outline: "none",
    transition: theme.transitions.normal,
    boxSizing: "border-box" as const,
    background: "#ffffff",
    color: theme.colors.textPrimary,
  },
  label: {
    position: "absolute" as const,
    left: "16px",
    top: "50%",
    transform: "translateY(-50%)",
    fontSize: "0.9rem",
    color: theme.colors.textMuted,
    pointerEvents: "none" as const,
    transition: theme.transitions.fast,
  },
  labelFloat: {
    position: "absolute" as const,
    left: "16px",
    top: "8px",
    fontSize: "0.65rem",
    fontWeight: 600,
    color: theme.colors.primary,
    pointerEvents: "none" as const,
    transition: theme.transitions.fast,
    textTransform: "uppercase" as const,
    letterSpacing: "0.5px",
  },
  btnPrimary: {
    width: "100%",
    padding: "14px",
    borderRadius: theme.radius.pill,
    background: theme.colors.gradientPrimary,
    color: "#ffffff",
    fontWeight: 600,
    fontSize: "0.95rem",
    border: "none",
    cursor: "pointer",
    boxShadow: theme.shadows.glow,
    transition: theme.transitions.normal,
    marginTop: theme.spacing.sm,
  },
  footer: {
    textAlign: "center" as const,
    marginTop: theme.spacing.xl,
    fontSize: "0.85rem",
    color: theme.colors.textLight,
  },
  link: {
    color: theme.colors.primary,
    textDecoration: "none",
    fontWeight: 600,
    transition: theme.transitions.fast,
  },
  error: {
    background: "rgba(229, 62, 62, 0.06)",
    color: "#e53e3e",
    padding: "12px 16px",
    borderRadius: theme.radius.lg,
    fontSize: "0.82rem",
    marginBottom: theme.spacing.md,
    border: "1px solid rgba(229, 62, 62, 0.15)",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
};

function FloatingInput({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  required,
  style,
}: {
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
  style?: React.CSSProperties;
}) {
  const [focused, setFocused] = useState(false);
  const isFloating = focused || value.length > 0;

  return (
    <div style={styles.inputWrapper}>
      <span style={isFloating ? styles.labelFloat : styles.label}>
        {label}
      </span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={isFloating ? placeholder : ""}
        required={required}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          ...styles.input,
          borderColor: focused ? "rgba(102, 126, 234, 0.4)" : theme.colors.border,
          boxShadow: focused ? "0 0 0 3px rgba(102, 126, 234, 0.08)" : "none",
          ...style,
        }}
      />
    </div>
  );
}

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
      navigate("/dashboard");
    } catch (err: any) {
      const msg = err.response?.data?.detail || "Login failed. Please check your credentials and try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-bg" style={styles.page}>
      <div style={styles.card}>
        {/* Accent line */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "3px",
            background: theme.colors.gradientPrimary,
          }}
        />

        <div style={styles.logo}>FigmaReact AI</div>
        <p style={styles.subtitle}>Sign in to your account</p>

        {error && (
          <div style={styles.error}>
            <span>⚠</span> {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <FloatingInput label="Email" type="email" value={email} onChange={setEmail} placeholder="you@example.com" required />
          <FloatingInput label="Password" type="password" value={password} onChange={setPassword} placeholder="••••••••" required />
          <button
            style={{
              ...styles.btnPrimary,
              opacity: loading ? 0.7 : 1,
              cursor: loading ? "wait" : "pointer",
            }}
            disabled={loading}
            type="submit"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div style={styles.footer}>
          Don't have an account?{" "}
          <Link to="/register" style={styles.link}>
            Create one
          </Link>
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
      navigate("/dashboard");
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

  const confirmBorderColor =
    confirmPassword && confirmPassword !== password
      ? "rgba(229, 62, 62, 0.4)"
      : confirmPassword && confirmPassword === password
        ? "rgba(72, 187, 120, 0.4)"
        : undefined;

  return (
    <div className="app-bg" style={styles.page}>
      <div style={styles.card}>
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "3px",
            background: theme.colors.gradientPrimary,
          }}
        />

        <div style={styles.logo}>FigmaReact AI</div>
        <p style={styles.subtitle}>Create your account</p>

        {error && (
          <div style={styles.error}>
            <span>⚠</span> {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <FloatingInput label="Email" type="email" value={email} onChange={setEmail} placeholder="you@example.com" required />
          <FloatingInput label="Password" type="password" value={password} onChange={setPassword} placeholder="••••••••" required />
          <FloatingInput
            label="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={setConfirmPassword}
            placeholder="••••••••"
            required
            style={{ borderColor: confirmBorderColor }}
          />
          <button
            style={{
              ...styles.btnPrimary,
              opacity: loading ? 0.7 : 1,
              cursor: loading ? "wait" : "pointer",
            }}
            disabled={loading}
            type="submit"
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <div style={styles.footer}>
          Already have an account?{" "}
          <Link to="/login" style={styles.link}>
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
