import WalletConnect from "./WalletConnect";

export default function Navbar({ currentPage, onNavigate, account, onConnect }) {
  const links = [
    { id: "browse", label: "Browse" },
    { id: "dashboard", label: "Dashboard" },
  ];

  return (
    <nav style={styles.nav}>
      <div style={styles.left}>
        <div style={styles.logo} onClick={() => onNavigate("browse")}>
          <div style={styles.logoIcon}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <polygon points="5,3 19,12 5,21" fill="#6366f1" />
            </svg>
          </div>

          <span style={styles.logoText}>DecentTube</span>
        </div>

        <div style={styles.links}>
          {links.map((link) => (
            <button
              key={link.id}
              style={{
                ...styles.navLink,
                ...(currentPage === link.id ? styles.navLinkActive : {}),
              }}
              onClick={() => onNavigate(link.id)}
            >
              {link.label}
              {currentPage === link.id && <div style={styles.activeDot} />}
            </button>
          ))}
        </div>
      </div>

      <WalletConnect
        account={account}
        onAccountChange={onConnect}
      />
    </nav>
  );
}

const styles = {
  nav: {
    background: "rgba(10, 10, 15, 0.85)",
    backdropFilter: "blur(20px)",
    borderBottom: "1px solid rgba(255,255,255,0.06)",
    padding: "0 32px",
    height: "60px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    position: "sticky",
    top: 0,
    zIndex: 100,
  },
  left: { display: "flex", alignItems: "center", gap: "32px" },
  logo: { display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" },
  logoIcon: {
    width: "32px",
    height: "32px",
    background: "rgba(99,102,241,0.15)",
    border: "1px solid rgba(99,102,241,0.3)",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  logoText: {
    fontSize: "16px",
    fontWeight: "700",
    color: "#f1f0ff",
    letterSpacing: "-0.3px",
  },
  links: { display: "flex", alignItems: "center", gap: "4px" },
  navLink: {
    background: "transparent",
    border: "none",
    color: "#8b8aa3",
    fontSize: "14px",
    fontWeight: "500",
    cursor: "pointer",
    padding: "6px 12px",
    borderRadius: "8px",
    fontFamily: "'Space Grotesk', sans-serif",
    transition: "all 0.2s",
    position: "relative",
  },
  navLinkActive: {
    color: "#f1f0ff",
    background: "rgba(255,255,255,0.06)",
  },
  activeDot: {
    position: "absolute",
    bottom: "-1px",
    left: "50%",
    transform: "translateX(-50%)",
    width: "4px",
    height: "4px",
    borderRadius: "50%",
    background: "#6366f1",
  },
};

