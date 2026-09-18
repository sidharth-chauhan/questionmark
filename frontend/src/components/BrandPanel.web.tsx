import React, { useState } from "react";
import { colors } from "../theme/colors";

export const BrandPanel: React.FC = () => {
  const [replayKey, setReplayKey] = useState(0);

  return (
    <div style={styles.stage}>
      <style>{`
        @keyframes qm-draw { to { stroke-dashoffset: 0; } }
        @keyframes qm-pop {
          0% { transform: scale(0); opacity: 0; }
          70% { transform: scale(1.2); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes qm-fade-up {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes qm-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes qm-glow-pulse {
          0%, 100% { opacity: 0.35; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.08); }
        }
      `}</style>

      <div key={replayKey} style={styles.floatWrap} onClick={() => setReplayKey((k) => k + 1)}>
        <div style={styles.glow} />

        <div style={styles.iconSquare}>
          <svg width="88" height="88" viewBox="0 0 200 200">
            <path
              d="M70,60 C70,30 100,15 130,25"
              stroke={colors.accentRed}
              strokeWidth="22"
              fill="none"
              strokeLinecap="round"
              style={{ strokeDasharray: 140, strokeDashoffset: 140, animation: "qm-draw 0.5s ease forwards 0.1s" }}
            />
            <path
              d="M130,25 C165,38 170,75 140,95"
              stroke={colors.primary}
              strokeWidth="22"
              fill="none"
              strokeLinecap="round"
              style={{ strokeDasharray: 140, strokeDashoffset: 140, animation: "qm-draw 0.5s ease forwards 0.5s" }}
            />
            <path
              d="M140,95 C120,108 100,110 95,135"
              stroke={colors.accentGreen}
              strokeWidth="22"
              fill="none"
              strokeLinecap="round"
              style={{ strokeDasharray: 120, strokeDashoffset: 120, animation: "qm-draw 0.5s ease forwards 0.9s" }}
            />
            <circle
              cx="95"
              cy="165"
              r="11"
              fill={colors.accentAmber}
              style={{ transformOrigin: "95px 165px", opacity: 0, animation: "qm-pop 0.4s ease forwards 1.3s" }}
            />
          </svg>
        </div>

        <div style={{ marginTop: 22, textAlign: "center" }}>
          <div style={{ opacity: 0, animation: "qm-fade-up 0.5s ease forwards 1.35s" }}>
            <span style={styles.wordmarkWhite}>Question</span>
            <span style={styles.wordmarkCoral}>Mark</span>
          </div>
          <p style={{ ...styles.tagline, animation: "qm-fade-up 0.5s ease forwards 1.6s" }}>
            Targeting errors, not volume.
          </p>
        </div>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  stage: {
    position: "relative",
    flex: "1 1 46%",
    minWidth: 340,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background,
    overflow: "hidden",
  },
  floatWrap: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    animation: "qm-float 4.5s ease-in-out infinite",
    cursor: "pointer",
  },
  glow: {
    position: "absolute",
    width: 260,
    height: 260,
    borderRadius: "50%",
    background: `radial-gradient(circle, ${colors.primary}55 0%, rgba(108,99,255,0) 70%)`,
    animation: "qm-glow-pulse 3.5s ease-in-out infinite",
    zIndex: 1,
  },
  iconSquare: {
    width: 140,
    height: 140,
    borderRadius: "26%",
    backgroundColor: colors.surfaceSubtle,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    zIndex: 2,
  },
  wordmarkWhite: { fontSize: 30, fontWeight: 800, color: colors.textPrimary, letterSpacing: -0.5 },
  wordmarkCoral: { fontSize: 30, fontWeight: 800, color: colors.accentRed, letterSpacing: -0.5 },
  tagline: { color: colors.textSecondary, fontSize: 14, marginTop: 8, opacity: 0 },
};