import { useNavigate } from "react-router-dom";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500;600&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --bg: #0a0a0f; --surface: #13131a; --surface2: #1c1c26;
    --border: rgba(255,255,255,0.07); --gold: #d4af6a;
    --text: #f0ece4; --muted: rgba(240,236,228,0.4);
  }
  body { background: var(--bg); color: var(--text); font-family: 'DM Sans', sans-serif; }
  .vp-app { min-height: 100vh; background: var(--bg); }
  .vp-wrap { max-width: 1200px; margin: 0 auto; padding: 0 24px; }
  .vp-header {
    display: flex; align-items: center; justify-content: space-between;
    padding: 20px 0; border-bottom: 1px solid var(--border); margin-bottom: 8px;
  }
  .vp-logo {
    font-family: 'Playfair Display', serif; font-size: 22px; font-weight: 900;
    color: var(--gold); display: flex; align-items: center; gap: 8px; cursor: pointer;
  }
  .vp-logo-dot { width: 8px; height: 8px; background: var(--gold); border-radius: 50%; }
  .vp-back {
    background: none; border: 1px solid var(--border); color: var(--muted);
    padding: 8px 16px; border-radius: 8px; cursor: pointer; font-size: 13px;
    font-family: 'DM Sans', sans-serif; margin-bottom: 28px; transition: all 0.2s;
  }
  .vp-back:hover { color: var(--gold); border-color: var(--gold); }
  .vp-legal-wrap { max-width: 600px; margin: 0 auto; padding: 32px 0 80px; }
  .vp-legal-title {
    font-family: 'Playfair Display', serif; font-size: 36px; font-weight: 900;
    color: var(--text); margin-bottom: 8px;
  }
  .vp-legal-sub { color: var(--muted); font-size: 13px; margin-bottom: 36px; padding-bottom: 24px; border-bottom: 1px solid var(--border); }
  .vp-contact-card {
    background: var(--surface2); border: 1px solid var(--border);
    border-radius: 20px; padding: 28px; display: flex; flex-direction: column;
    gap: 20px; margin-bottom: 32px;
  }
  .vp-contact-row { display: flex; align-items: flex-start; gap: 16px; }
  .vp-contact-icon {
    font-size: 22px; width: 44px; height: 44px; border-radius: 12px;
    background: var(--surface); display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }
  .vp-contact-label { color: var(--muted); font-size: 11px; text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 3px; }
  .vp-contact-value { color: var(--text); font-size: 14px; font-weight: 500; }
  .vp-contact-value a { color: var(--gold); text-decoration: none; }
  .vp-contact-value a:hover { text-decoration: underline; }
  .vp-legal-h { font-size: 13px; font-weight: 700; color: var(--gold); margin-bottom: 10px; text-transform: uppercase; letter-spacing: 0.08em; }
  .vp-legal-p { color: rgba(240,236,228,0.7); font-size: 14px; line-height: 1.9; font-weight: 300; }
  .vp-open-badge {
    display: inline-flex; align-items: center; gap: 8px;
    background: rgba(91,196,160,0.1); border: 1px solid rgba(91,196,160,0.3);
    color: #5bc4a0; padding: 6px 14px; border-radius: 20px; font-size: 13px; font-weight: 600;
    margin-bottom: 24px;
  }
  .vp-open-dot { width: 7px; height: 7px; background: #5bc4a0; border-radius: 50%; animation: pulse 2s infinite; }
  @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
  .vp-footer {
    border-top: 1px solid var(--border); padding: 32px 24px;
    display: flex; flex-direction: column; align-items: center; gap: 16px; margin-top: 40px;
  }
  .vp-footer-logo { font-family: 'Playfair Display', serif; font-size: 18px; font-weight: 900; color: var(--gold); }
  .vp-footer-links { display: flex; gap: 20px; flex-wrap: wrap; justify-content: center; }
  .vp-footer-link { color: var(--muted); font-size: 13px; cursor: pointer; transition: color 0.2s; }
  .vp-footer-link:hover { color: var(--gold); }
  .vp-footer-copy { color: var(--muted); font-size: 11px; text-align: center; line-height: 1.6; }
`;

function isOpen() {
  const h = new Date().getHours();
  return h >= 20 || h < 5;
}

export default function Kontakt() {
  const navigate = useNavigate();
  const open = isOpen();

  return (
    <div className="vp-app">
      <style>{css}</style>
      <div className="vp-wrap">
        <header className="vp-header">
          <div className="vp-logo" onClick={() => navigate("/")}><div className="vp-logo-dot" />VečerkaPlus</div>
        </header>
        <div className="vp-legal-wrap">
          <button className="vp-back" onClick={() => navigate("/")}>← Zpět do obchodu</button>

          <div className="vp-legal-title">Kontakt</div>
          <div className="vp-legal-sub">Jsme tu pro vás každou noc od 20:00 do 5:00 · Frýdek-Místek</div>

          <div className={`vp-open-badge`}>
            <div className="vp-open-dot" style={{ background: open ? "#5bc4a0" : "#e05555" }} />
            {open ? "Právě otevřeno · rozvážíme" : "Momentálně zavřeno · otevíráme ve 20:00"}
          </div>

          <div className="vp-contact-card">
            {[
              ["🏢", "Provozovatel", "Filip Chytil · IČO: 19845863"],
              ["📍", "Rozvozová oblast", "Frýdek-Místek a okolí"],
              ["📧", "Email", <a href="mailto:vecerkaplus@gmail.com">vecerkaplus@gmail.com</a>],
              ["🕗", "Provozní doba", "každý den 20:00 – 5:00"],
              ["🛵", "Odhadovaná doba doručení", "40–60 minut"],
            ].map(([icon, label, value]) => (
              <div className="vp-contact-row" key={label}>
                <div className="vp-contact-icon">{icon}</div>
                <div>
                  <div className="vp-contact-label">{label}</div>
                  <div className="vp-contact-value">{value}</div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginBottom: 32 }}>
            <div className="vp-legal-h">Napište nám</div>
            <div className="vp-legal-p">
              Máte dotaz, problém s objednávkou nebo zpětnou vazbu?<br />
              Napište nám na <a href="mailto:vecerkaplus@gmail.com" style={{ color: "var(--gold)" }}>vecerkaplus@gmail.com</a> — odpovídáme co nejrychleji.
            </div>
          </div>
        </div>
      </div>
      <footer className="vp-footer">
        <div className="vp-footer-logo">🌙 VečerkaPlus</div>
        <div className="vp-footer-links">
          <span className="vp-footer-link" onClick={() => navigate("/kontakt")}>Kontakt</span>
          <span className="vp-footer-link" onClick={() => navigate("/podminky")}>Obchodní podmínky & GDPR</span>
        </div>
        <div className="vp-footer-copy">© 2025 VečerkaPlus · Filip Chytil · IČO: 19845863 · Frýdek-Místek</div>
      </footer>
    </div>
  );
}
