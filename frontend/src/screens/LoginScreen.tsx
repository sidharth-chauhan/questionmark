import React, { useState, useEffect } from "react";
import { colors } from "../theme/colors";
import { useAuth } from "../context/AuthContext";
import { BrandPanel } from "../components/BrandPanel";

const brandIconSource = require("../../assests/pic/questionmark-vibrant-v2-512.png");
const brandIconUri = typeof brandIconSource === "string" ? brandIconSource : brandIconSource.uri || brandIconSource.default;

export const LoginScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState("student@jee.com");
  const [password, setPassword] = useState("password123");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isDesktop, setIsDesktop] = useState(
    typeof window !== "undefined" ? window.innerWidth > 820 : true
  );

  useEffect(() => {
    const onResize = () => setIsDesktop(window.innerWidth > 820);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setErrorMsg("Please enter email and password.");
      return;
    }
    setIsSubmitting(true);
    setErrorMsg(null);
    try {
      await login(email.trim(), password);
    } catch (err: any) {
      console.error("Login error:", err);
      setErrorMsg(err?.response?.data?.message || "Invalid credentials. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={styles.page}>
      <style>{`
        body { margin: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }
        .qm-input {
          width: 100%;
          box-sizing: border-box;
          background: ${colors.surfaceSubtle};
          border: 1px solid transparent;
          border-radius: 12px;
          padding: 13px 14px;
          font-size: 14px;
          color: ${colors.textPrimary};
          outline: none;
          transition: border-color 0.15s ease, box-shadow 0.15s ease;
          font-family: inherit;
        }
        .qm-input::placeholder { color: ${colors.textMuted}; }
        .qm-input:focus {
          border-color: ${colors.primary};
          box-shadow: 0 0 0 3px ${colors.primary}33;
        }
        .qm-submit-btn {
          width: 100%;
          border: none;
          cursor: pointer;
          background: ${colors.primary};
          color: #FFFFFF;
          font-size: 14px;
          font-weight: 700;
          padding: 14px;
          border-radius: 12px;
          transition: filter 0.15s ease, transform 0.05s ease;
          font-family: inherit;
        }
        .qm-submit-btn:hover:not(:disabled) { filter: brightness(1.08); }
        .qm-submit-btn:active:not(:disabled) { transform: scale(0.99); }
        .qm-submit-btn:disabled { opacity: 0.5; cursor: default; }
        .qm-link-btn {
          background: none;
          border: none;
          padding: 0;
          cursor: pointer;
          color: ${colors.primary};
          font-weight: 700;
          font-size: 12.5px;
          font-family: inherit;
        }
        .qm-link-btn:hover { text-decoration: underline; }
        @keyframes qm-spin { to { transform: rotate(360deg); } }
        .qm-spinner {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          border: 2px solid rgba(255,255,255,0.35);
          border-top-color: #FFFFFF;
          animation: qm-spin 0.7s linear infinite;
          display: inline-block;
          vertical-align: middle;
        }
      `}</style>

      <div style={{ ...styles.windowCard, flexDirection: isDesktop ? "row" : "column" }}>
        {isDesktop && <BrandPanel />}

        <div style={styles.formPanel}>
          <div style={styles.formInner}>
            <div style={styles.wordmarkRow}>
              <img
                src={brandIconUri}
                style={styles.brandIcon}
              />
              <div>
                <span style={styles.wordmarkWhite}>Question</span>
                <span style={styles.wordmarkCoral}>Mark</span>
              </div>
            </div>
            <p style={styles.subtitle}>
              Sign in to review mistake patterns and nightly revision blocks.
            </p>

            <form onSubmit={handleSubmit} style={styles.form}>
              {errorMsg && (
                <div style={styles.errorBox}>
                  <span style={styles.errorText}>{errorMsg}</span>
                </div>
              )}

              <div style={styles.fieldGroup}>
                <label style={styles.fieldLabel}>Email address</label>
                <input
                  className="qm-input"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoCapitalize="none"
                  placeholder="aspirant@example.com"
                />
              </div>

              <div style={styles.fieldGroup}>
                <label style={styles.fieldLabel}>Password</label>
                <input
                  className="qm-input"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </div>

              <button type="submit" className="qm-submit-btn" disabled={isSubmitting} style={{ marginTop: 4 }}>
                {isSubmitting ? <span className="qm-spinner" /> : "Sign in"}
              </button>

              <div style={styles.demoBox}>
                <div style={styles.demoLabel}>DEMO ACCOUNT</div>
                <div style={styles.demoText}>student@jee.com · password123</div>
              </div>

              <div style={styles.switchRow}>
                <span style={styles.switchText}>Need an account?</span>{" "}
                <button
                  type="button"
                  className="qm-link-btn"
                  onClick={() => navigation.navigate("Register")}
                >
                  Create student profile
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  page: {
    width: "100%",
    minHeight: "100vh",
    backgroundColor: "#000000",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    boxSizing: "border-box",
  },
  windowCard: {
    display: "flex",
    width: "100%",
    maxWidth: 980,
    borderRadius: 24,
    overflow: "hidden",
    boxShadow: "0 30px 80px rgba(0,0,0,0.6)",
  },
  formPanel: {
    flex: "1 1 54%",
    backgroundColor: colors.surface,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    padding: "56px 48px",
    boxSizing: "border-box",
    minWidth: 0,
  },
  formInner: {
    width: "100%",
    maxWidth: 380,
  },
  wordmarkRow: { marginBottom: 6, display: "flex", flexDirection: "row", alignItems: "center", gap: 8 },
  brandIcon: { width: 32, height: 32, borderRadius: 7, objectFit: "contain" },
  wordmarkWhite: { fontSize: 28, fontWeight: 800, color: colors.textPrimary, letterSpacing: -0.5 },
  wordmarkCoral: { fontSize: 28, fontWeight: 800, color: colors.accentRed, letterSpacing: -0.5 },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 15,
    lineHeight: "22px",
    margin: "0 0 32px 0",
    maxWidth: 340,
  },
  form: { display: "flex", flexDirection: "column" },
  errorBox: {
    backgroundColor: colors.accentRedTint,
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
  },
  errorText: { color: colors.accentRed, fontSize: 12.5, fontWeight: 500 },
  fieldGroup: { marginBottom: 16, display: "flex", flexDirection: "column" },
  fieldLabel: { fontSize: 13, marginBottom: 7, fontWeight: 600, color: colors.textPrimary },
  demoBox: {
    marginTop: 18,
    paddingTop: 14,
    borderTop: `1px solid ${colors.border}`,
  },
  demoLabel: {
    fontSize: 10.5,
    color: colors.textMuted,
    fontWeight: 700,
    letterSpacing: 0.3,
    marginBottom: 3,
  },
  demoText: { fontFamily: "monospace", fontSize: 12.5, color: colors.textSecondary },
  switchRow: {
    textAlign: "center",
    marginTop: 18,
  },
  switchText: { color: colors.textSecondary, fontSize: 13 },
};