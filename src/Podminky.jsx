import { useNavigate } from "react-router-dom";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500;600&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --bg: #0a0a0f; --surface: #13131a; --surface2: #1c1c26;
    --border: rgba(255,255,255,0.07); --gold: #d4af6a; --gold-light: #f0d090;
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
  .vp-legal-wrap { max-width: 700px; margin: 0 auto; padding: 32px 0 80px; }
  .vp-legal-title {
    font-family: 'Playfair Display', serif; font-size: 36px; font-weight: 900;
    color: var(--text); margin-bottom: 8px;
  }
  .vp-legal-sub { color: var(--muted); font-size: 13px; margin-bottom: 36px; padding-bottom: 24px; border-bottom: 1px solid var(--border); }
  .vp-legal-section { margin-bottom: 32px; }
  .vp-legal-h {
    font-size: 13px; font-weight: 700; color: var(--gold); margin-bottom: 10px;
    text-transform: uppercase; letter-spacing: 0.08em;
  }
  .vp-legal-p { color: rgba(240,236,228,0.7); font-size: 14px; line-height: 1.9; font-weight: 300; }
  .vp-legal-divider { border: none; border-top: 1px solid var(--border); margin: 40px 0; }
  .vp-footer {
    border-top: 1px solid var(--border); padding: 32px 24px;
    display: flex; flex-direction: column; align-items: center;
    gap: 16px; margin-top: 40px;
  }
  .vp-footer-logo { font-family: 'Playfair Display', serif; font-size: 18px; font-weight: 900; color: var(--gold); }
  .vp-footer-links { display: flex; gap: 20px; flex-wrap: wrap; justify-content: center; }
  .vp-footer-link { color: var(--muted); font-size: 13px; cursor: pointer; transition: color 0.2s; }
  .vp-footer-link:hover { color: var(--gold); }
  .vp-footer-copy { color: var(--muted); font-size: 11px; text-align: center; line-height: 1.6; }
`;

export default function Podminky() {
  const navigate = useNavigate();

  const sections = [
    ["1. Provozovatel", `VečerkaPlus, Filip Chytil, IČO: 19845863, se sídlem Frýdek-Místek. Kontakt: vecerkaplus@gmail.com`],
    ["2. Předmět služby", `VečerkaPlus provozuje noční rozvoz alkoholu, tabáku a dalšího zboží na území Frýdku-Místku. Objednávky jsou přijímány výhradně v době provozu (20:00–5:00).`],
    ["3. Věkové omezení", `Prodej alkoholu a tabáku je povolen pouze osobám starším 18 let. Při doručení je kurýr oprávněn požadovat doklad totožnosti. V případě neprokázání věku nebude zboží předáno a objednávka bude zrušena bez nároku na vrácení dopravného.`],
    ["4. Objednávka a platba", `Objednávka je závazná po jejím potvrzení. Platba je možná hotově při doručení nebo online kartou přes platební bránu GoPay. Ceny jsou uvedeny včetně DPH.`],
    ["5. Doručení", `Odhadovaná doba doručení je 40–60 minut. Doručujeme pouze na území Frýdku-Místku. Doprava je zdarma při objednávce nad 500 Kč, jinak je účtováno dopravné dle aktuálního ceníku.`],
    ["6. Reklamace a vrácení zboží", `V případě závady nebo nesprávně doručeného zboží kontaktujte nás neprodleně na vecerkaplus@gmail.com. Reklamace alkoholu a tabáku jsou řešeny individuálně v souladu s platnou legislativou.`],
    ["7. Závěrečná ustanovení", `Tyto podmínky se řídí právním řádem České republiky. Provozovatel si vyhrazuje právo podmínky měnit. Aktuální verze je vždy dostupná na vecerkaplus.cz.`],
  ];

  const gdprSections = [
    ["1. Správce osobních údajů", `Filip Chytil, IČO: 19845863, Frýdek-Místek. Email: vecerkaplus@gmail.com`],
    ["2. Jaké údaje zpracováváme", `Zpracováváme pouze údaje nezbytné pro vyřízení objednávky: jméno a příjmení, doručovací adresu a telefonní číslo.`],
    ["3. Účel zpracování", `Osobní údaje jsou zpracovávány výhradně za účelem doručení objednávky. Nejsou využívány pro marketingové účely ani předávány třetím stranám.`],
    ["4. Doba uchovávání", `Údaje jsou uchovávány po dobu nezbytně nutnou pro splnění objednávky a splnění zákonných povinností (max. 3 roky).`],
    ["5. Vaše práva", `Máte právo na přístup k údajům, jejich opravu, výmaz nebo omezení zpracování. Žádosti zasílejte na vecerkaplus@gmail.com.`],
    ["6. Zabezpečení", `Vaše údaje jsou uloženy v zabezpečené databázi (Supabase) a přenášeny šifrovaně přes HTTPS.`],
  ];

  return (
    <div className="vp-app">
      <style>{css}</style>
      <div className="vp-wrap">
        <header className="vp-header">
          <div className="vp-logo" onClick={() => navigate("/")}><div className="vp-logo-dot" />VečerkaPlus</div>
        </header>
        <div className="vp-legal-wrap">
          <button className="vp-back" onClick={() => navigate("/")}>← Zpět do obchodu</button>

          <div className="vp-legal-title">Obchodní podmínky</div>
          <div className="vp-legal-sub">Platné od 1. 1. 2025 · VečerkaPlus · Filip Chytil · IČO: 19845863</div>
          {sections.map(([h, p]) => (
            <div className="vp-legal-section" key={h}>
              <div className="vp-legal-h">{h}</div>
              <div className="vp-legal-p">{p}</div>
            </div>
          ))}

          <hr className="vp-legal-divider" />

          <div className="vp-legal-title" style={{ fontSize: 28, marginBottom: 8 }}>Zásady ochrany osobních údajů (GDPR)</div>
          <div className="vp-legal-sub">VečerkaPlus dbá na ochranu vašich osobních údajů.</div>
          {gdprSections.map(([h, p]) => (
            <div className="vp-legal-section" key={h}>
              <div className="vp-legal-h">{h}</div>
              <div className="vp-legal-p">{p}</div>
            </div>
          ))}
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
