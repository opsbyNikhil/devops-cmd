import React, { useState, useMemo } from "react";
import { useTheme } from "../Themecontext";

interface Command {
  description: string;
  template: string;
  example?: string;
}

interface Category {
  label: string;
  icon: string;
  color: string;
  lightColor: string;
  commands: Command[];
}

const categories: Category[] = [
  {
    label: "Run & Apply",
    icon: "▶",
    color: "#a78bfa",
    lightColor: "#7c3aed",
    commands: [
      {
        description: "Apply all YAMLs in current directory",
        template: "kubectl apply -f .",
      },
      {
        description: "Apply a specific YAML file",
        template: "kubectl apply -f <filename.yaml>",
        example: "kubectl apply -f pod.yaml",
      },
    ],
  },
  {
    label: "Inspect Pods",
    icon: "🔍",
    color: "#60a5fa",
    lightColor: "#2563eb",
    commands: [
      { description: "List all pods", template: "kubectl get po" },
      { description: "Watch pods continuously", template: "kubectl get po -w" },
      {
        description: "Get all resources (pods, services, replicas)",
        template: "kubectl get all",
      },
      {
        description: "Describe a pod",
        template: "kubectl describe <pod-name>",
        example: "kubectl describe my-pod",
      },
    ],
  },
  {
    label: "Exec",
    icon: "⚡",
    color: "#fbbf24",
    lightColor: "#d97706",
    commands: [
      {
        description: "Execute into a pod",
        template: "kubectl exec -it <pod-name> -- bash",
        example: "kubectl exec -it my-pod -- bash",
      },
    ],
  },
  {
    label: "Namespaces",
    icon: "📦",
    color: "#34d399",
    lightColor: "#059669",
    commands: [
      {
        description: "Create a namespace",
        template: "kubectl create namespace <namespace-name>",
        example: "kubectl create namespace dev",
      },
      {
        description: "Switch namespace context",
        template: "kubectl config set-context --namespace=<namespace-name>",
        example: "kubectl config set-context --namespace=dev",
      },
    ],
  },
  {
    label: "EKS Cluster",
    icon: "☁",
    color: "#f87171",
    lightColor: "#dc2626",
    commands: [
      {
        description: "Create an EKS cluster",
        template:
          "eksctl create cluster <cluster-name> --region <region> --node-type <instance-type> --nodes <count>",
        example:
          "eksctl create cluster my-cluster --region ap-south-1 --node-type m7i-flex.large --nodes 2",
      },
    ],
  },
];

export const allCommands = categories.flatMap((cat) =>
  cat.commands.map((cmd) => ({
    ...cmd,
    categoryLabel: cat.label,
    categoryColor: cat.color,
    categoryLightColor: cat.lightColor,
    categoryIcon: cat.icon,
  })),
);

interface ThemeStyles {
  bg: string;
  cardBg: string;
  cardBorder: string;
  headerBg: string;
  codeBg: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  inputBg: string;
  inputBorder: string;
  tabBorder: string;
  tabBg: string;
  gridColor: string;
}

const getThemeStyles = (isDark: boolean): ThemeStyles => ({
  bg: isDark ? "#0c0c12" : "#f8f7ff",
  cardBg: isDark ? "rgba(255,255,255,0.015)" : "rgba(0,0,0,0.02)",
  cardBorder: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.08)",
  headerBg: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)",
  codeBg: isDark ? "#0a0a0f" : "#f0eeff",
  textPrimary: isDark ? "rgba(255,255,255,0.85)" : "rgba(0,0,0,0.85)",
  textSecondary: isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)",
  textMuted: isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.25)",
  inputBg: isDark ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.8)",
  inputBorder: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.12)",
  tabBorder: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.12)",
  tabBg: isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.02)",
  gridColor: isDark ? "rgba(167,139,250,0.025)" : "rgba(109,40,217,0.04)",
});

const CopyBtn: React.FC<{ text: string; color: string; isDark: boolean }> = ({
  text,
  color,
  isDark,
}) => {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1800);
      }}
      style={{
        flexShrink: 0,
        background: copied ? `${color}22` : "transparent",
        border: `1px solid ${copied ? color : isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.12)"}`,
        borderRadius: 5,
        color: copied
          ? color
          : isDark
            ? "rgba(255,255,255,0.3)"
            : "rgba(0,0,0,0.3)",
        cursor: "pointer",
        padding: "3px 9px",
        fontSize: 10,
        fontFamily: "inherit",
        letterSpacing: 0.5,
        transition: "all 0.2s",
        display: "flex",
        alignItems: "center",
        gap: 4,
      }}
    >
      {copied ? "✓" : "copy"}
    </button>
  );
};

const CommandCard: React.FC<{
  cmd: any;
  accentColor: string;
  showBadge?: boolean;
  t: ThemeStyles;
  isDark: boolean;
}> = ({ cmd, accentColor, showBadge, t, isDark }) => (
  <div
    style={{
      background: t.cardBg,
      border: `1px solid ${t.cardBorder}`,
      borderRadius: 10,
      padding: "14px 16px",
      display: "flex",
      flexDirection: "column",
      gap: 8,
    }}
  >
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 8,
      }}
    >
      <span
        style={{ color: t.textSecondary, fontSize: 11, letterSpacing: 0.3 }}
      >
        {cmd.description}
      </span>
      {showBadge && cmd.categoryLabel && (
        <span
          style={{
            fontSize: 10,
            padding: "2px 8px",
            borderRadius: 20,
            border: `1px solid ${(isDark ? cmd.categoryColor : cmd.categoryLightColor) + "55"}`,
            color: isDark ? cmd.categoryColor : cmd.categoryLightColor,
            background: `${isDark ? cmd.categoryColor : cmd.categoryLightColor}11`,
            letterSpacing: 0.4,
            whiteSpace: "nowrap",
            flexShrink: 0,
          }}
        >
          {cmd.categoryIcon} {cmd.categoryLabel}
        </span>
      )}
    </div>

    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        background: t.codeBg,
        border: `1px solid ${accentColor}33`,
        borderRadius: 7,
        padding: "8px 12px",
      }}
    >
      <span style={{ color: accentColor, fontWeight: 700, flexShrink: 0 }}>
        $
      </span>
      <span
        style={{
          flex: 1,
          fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
          fontSize: 12,
          color: t.textPrimary,
          wordBreak: "break-all",
        }}
      >
        {cmd.template.split(/(<[^>]+>)/g).map((part: string, i: number) =>
          part.startsWith("<") ? (
            <span
              key={i}
              style={{
                color: isDark ? "#fbbf24" : "#d97706",
                fontStyle: "italic",
              }}
            >
              {part}
            </span>
          ) : (
            part
          ),
        )}
      </span>
      <CopyBtn text={cmd.template} color={accentColor} isDark={isDark} />
    </div>

    {cmd.example && (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "6px 12px",
          borderRadius: 7,
          background: isDark ? "rgba(255,255,255,0.015)" : "rgba(0,0,0,0.03)",
        }}
      >
        <span style={{ color: t.textMuted, fontSize: 10, flexShrink: 0 }}>
          eg
        </span>
        <span
          style={{
            flex: 1,
            fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
            fontSize: 11,
            color: t.textMuted,
            wordBreak: "break-all",
          }}
        >
          {cmd.example}
        </span>
        <CopyBtn
          text={cmd.example}
          color={isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)"}
          isDark={isDark}
        />
      </div>
    )}
  </div>
);

export const Kubernates: React.FC = () => {
  const { isDark } = useTheme();
  const t = getThemeStyles(isDark);

  const [search, setSearch] = useState("");
  const [active, setActive] = useState("All");

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return null;
    const pool =
      active === "All"
        ? allCommands
        : allCommands.filter((c) => c.categoryLabel === active);
    return pool.filter(
      (c) =>
        c.description.toLowerCase().includes(q) ||
        c.template.toLowerCase().includes(q) ||
        c.example?.toLowerCase().includes(q),
    );
  }, [search, active]);

  const tabs = [
    { label: "All", icon: "✦ ✦", color: isDark ? "#a78bfa" : "#7c3aed" },
    ...categories.map((c) => ({
      label: c.label,
      icon: c.icon,
      color: isDark ? c.color : c.lightColor,
    })),
  ];

  const displayedCategories =
    active === "All"
      ? categories
      : categories.filter((c) => c.label === active);

  return (
    <div
      style={{
        background: t.bg,
        minHeight: "100vh",
        padding: "28px 20px 48px",
        fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
        boxSizing: "border-box",
        backgroundImage: `
          linear-gradient(${t.gridColor} 1px, transparent 1px),
          linear-gradient(90deg, ${t.gridColor} 1px, transparent 1px)
        `,
        backgroundSize: "40px 40px",
        transition: "background 0.2s, color 0.2s",
      }}
    >
      <div style={{ maxWidth: 820, margin: "0 auto" }}>
        {/* Search bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            background: t.inputBg,
            border: `1px solid ${t.inputBorder}`,
            borderRadius: 10,
            padding: "10px 16px",
            marginBottom: 18,
          }}
        >
          <span style={{ color: t.textMuted, fontSize: 15 }}>⌕</span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search Kubernetes commands..."
            style={{
              flex: 1,
              background: "transparent",
              border: "none",
              outline: "none",
              color: isDark ? "rgba(255,255,255,0.75)" : "rgba(0,0,0,0.75)",
              fontFamily: "inherit",
              fontSize: 13,
              letterSpacing: 0.3,
            }}
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              style={{
                background: "transparent",
                border: "none",
                color: t.textMuted,
                cursor: "pointer",
                fontSize: 14,
                padding: 0,
                lineHeight: 1,
              }}
            >
              ✕
            </button>
          )}
        </div>

        {/* Filter tabs */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 8,
            marginBottom: 28,
          }}
        >
          {tabs.map((tab) => {
            const isActive = active === tab.label;
            return (
              <button
                key={tab.label}
                onClick={() => setActive(tab.label)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "7px 16px",
                  borderRadius: 999,
                  border: `1px solid ${isActive ? tab.color : t.tabBorder}`,
                  background: isActive ? `${tab.color}1a` : t.tabBg,
                  color: isActive ? tab.color : t.textSecondary,
                  fontSize: 12,
                  cursor: "pointer",
                  fontFamily: "inherit",
                  letterSpacing: 0.4,
                  fontWeight: isActive ? 700 : 400,
                  transition: "all 0.18s",
                  outline: "none",
                  boxShadow: isActive ? `0 0 14px ${tab.color}25` : "none",
                }}
              >
                <span style={{ fontSize: tab.label === "All" ? 9 : 13 }}>
                  {tab.icon}
                </span>
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Search results */}
        {search.trim() && filtered !== null && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {filtered.length === 0 ? (
              <div
                style={{
                  color: t.textMuted,
                  textAlign: "center",
                  padding: "40px 0",
                  fontSize: 12,
                }}
              >
                No commands match "{search}"
              </div>
            ) : (
              filtered.map((cmd, i) => (
                <CommandCard
                  key={i}
                  cmd={cmd}
                  accentColor={
                    isDark ? cmd.categoryColor : cmd.categoryLightColor
                  }
                  showBadge={active === "All"}
                  t={t}
                  isDark={isDark}
                />
              ))
            )}
          </div>
        )}

        {/* Category cards */}
        {!search.trim() && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {displayedCategories.map((cat) => {
              const accent = isDark ? cat.color : cat.lightColor;
              return (
                <div
                  key={cat.label}
                  style={{
                    background: t.cardBg,
                    border: `1px solid ${t.cardBorder}`,
                    borderRadius: 12,
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      padding: "12px 18px",
                      borderBottom: `1px solid ${t.cardBorder}`,
                      background: `${accent}08`,
                    }}
                  >
                    <span style={{ fontSize: 15 }}>{cat.icon}</span>
                    <span
                      style={{
                        color: accent,
                        fontWeight: 700,
                        fontSize: 13,
                        letterSpacing: 0.5,
                      }}
                    >
                      {cat.label}
                    </span>
                    <span
                      style={{
                        marginLeft: "auto",
                        color: t.textMuted,
                        fontSize: 11,
                      }}
                    >
                      {cat.commands.length} cmd
                      {cat.commands.length !== 1 ? "s" : ""}
                    </span>
                  </div>
                  <div
                    style={{
                      padding: "12px 14px",
                      display: "flex",
                      flexDirection: "column",
                      gap: 10,
                    }}
                  >
                    {cat.commands.map((cmd, i) => (
                      <CommandCard
                        key={i}
                        cmd={cmd}
                        accentColor={accent}
                        showBadge={false}
                        t={t}
                        isDark={isDark}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Legend */}
        <div
          style={{
            display: "flex",
            gap: 20,
            justifyContent: "center",
            marginTop: 32,
            flexWrap: "wrap",
          }}
        >
          <span style={{ color: t.textMuted, fontSize: 11 }}>
            <span style={{ color: isDark ? "#fbbf24" : "#d97706" }}>
              &lt;param&gt;
            </span>{" "}
            = replace with your value
          </span>
          <span style={{ color: t.textMuted, fontSize: 11 }}>
            <span style={{ color: isDark ? "#a78bfa" : "#7c3aed" }}>$</span> =
            run in terminal
          </span>
        </div>
      </div>
    </div>
  );
};

export default Kubernates;
