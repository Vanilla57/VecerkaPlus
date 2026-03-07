import { useState, useEffect } from "react";
import { supabase } from "./supabase";

const ADMIN_PASSWORD = "vecerka2025";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500;600&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --bg: #0a0a0f; --surface: #13131a; --surface2: #1c1c26;
    --border: rgba(255,255,255,0.07); --gold: #d4af6a;
    --gold-light: #f0d090; --text: #f0ede8; --muted: #6b6878;
    --green: #5bc4a0; --red: #e05555; --orange: #e8a24a;
  }
  body { background: var(--bg); margin: 0; padding: 0; }

  .adm-wrap {
    min-height: 100vh; background: var(--bg);
    font-family: 'DM Sans', sans-serif; color: var(--text);
  }

  .adm-login {
    min-height: 100vh; display: flex; align-items: center;
    justify-content: center; flex-direction: column; gap: 16px;
  }
  .adm-login h1 {
    font-family: 'Playfair Display', serif;
    color: var(--gold); font-size: 28px; margin-bottom: 8px;
  }
  .adm-login input {
    background: var(--surface2); border: 1px solid var(--border);
    color: var(--text); padding: 12px 18px; border-radius: 10px;
    font-size: 15px; width: 280px; outline: none;
    font-family: 'DM Sans', sans-serif;
  }
  .adm-login input:focus { border-color: var(--gold); }
  .adm-login button {
    width: 280px; padding: 13px; border-radius: 10px;
    background: var(--gold); color: #0a0a0f;
    font-weight: 700; font-size: 15px; border: none;
    cursor: pointer; font-family: 'DM Sans', sans-serif;
    transition: opacity 0.2s;
  }
  .adm-login button:hover { opacity: 0.85; }
  .adm-login .adm-error { color: var(--red); font-size: 13px; }

  .adm-header {
    padding: 24px 40px; border-bottom: 1px solid var(--border);
    display: flex; align-items: center; justify-content: space-between;
    position: sticky; top: 0; background: var(--bg); z-index: 10;
  }
  .adm-header-logo {
    font-family: 'Playfair Display', serif;
    color: var(--gold); font-size: 22px; font-weight: 900;
  }
  .adm-header-right { display: flex; align-items: center; gap: 12px; }
  .adm-logout {
    background: transparent; border: 1px solid var(--border);
    color: var(--muted); padding: 8px 16px; border-radius: 8px;
    font-size: 12px; cursor: pointer; font-family: 'DM Sans', sans-serif;
    transition: all 0.2s;
  }
  .adm-logout:hover { border-color: var(--red); color: var(--red); }
  .adm-back {
    background: transparent; border: 1px solid var(--border);
    color: var(--muted); padding: 8px 16px; border-radius: 8px;
    font-size: 12px; cursor: pointer; font-family: 'DM Sans', sans-serif;
    transition: all 0.2s; text-decoration: none; display: inline-block;
  }
  .adm-back:hover { border-color: var(--gold); color: var(--gold); }

  .adm-content { padding: 32px 40px; }

  .adm-stats {
    display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
    gap: 16px; margin-bottom: 32px;
  }
  .adm-stat {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 14px; padding: 20px 24px;
  }
  .adm-stat-label { font-size: 11px; letter-spacing: 0.1em; color: var(--muted); text-transform: uppercase; margin-bottom: 8px; }
  .adm-stat-value { font-size: 28px; font-weight: 700; color: var(--gold); }
  .adm-stat-sub { font-size: 12px; color: var(--muted); margin-top: 4px; }

  .adm-filters {
    display: flex; gap: 8px; margin-bottom: 24px; flex-wrap: wrap;
  }
  .adm-filter {
    padding: 7px 16px; border-radius: 20px; font-size: 12px;
    border: 1px solid var(--border); background: transparent;
    color: var(--muted); cursor: pointer; font-family: 'DM Sans', sans-serif;
    transition: all 0.2s;
  }
  .adm-filter.active, .adm-filter:hover { border-color: var(--gold); color: var(--gold); }
  .adm-filter.active { background: rgba(212,175,106,0.1); }

  .adm-table-wrap {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 16px; overflow: hidden;
  }
  .adm-table { width: 100%; border-collapse: collapse; }
  .adm-table th {
    text-align: left; padding: 14px 20px;
    font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase;
    color: var(--muted); border-bottom: 1px solid var(--border);
    font-weight: 500;
  }
  .adm-table td {
    padding: 16px 20px; border-bottom: 1px solid var(--border);
    font-size: 14px; vertical-align: top;
  }
  .adm-table tr:last-child td { border-bottom: none; }
  .adm-table tr:hover td { background: rgba(255,255,255,0.02); }

  .adm-status {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 4px 12px; border-radius: 20px;
    font-size: 11px; font-weight: 600; letter-spacing: 0.05em;
  }
  .adm-status::before {
    content: ''; width: 6px; height: 6px; border-radius: 50%;
    background: currentColor;
  }
  .adm-status.nova    { color: var(--orange); background: rgba(232,162,74,0.12); }
  .adm-status.prijata { color: #5b9dc4;       background: rgba(91,157,196,0.12); }
  .adm-status.dorucena{ color: var(--green);  background: rgba(91,196,160,0.12); }
  .adm-status.zrusena { color: var(--red);    background: rgba(224,85,85,0.12); }

  .adm-status-select {
    background: var(--surface2); border: 1px solid var(--border);
    color: var(--text); padding: 6px 10px; border-radius: 8px;
    font-size: 12px; cursor: pointer; font-family: 'DM Sans', sans-serif;
    outline: none; transition: border-color 0.2s;
  }
  .adm-status-select:focus { border-color: var(--gold); }

  .adm-items { font-size: 12px; color: var(--muted); margin-top: 4px; }
  .adm-name  { font-weight: 600; color: var(--text); }
  .adm-phone { color: var(--gold); font-size: 13px; }
  .adm-total { font-weight: 700; color: var(--gold-light); font-size: 15px; }
  .adm-time  { font-size: 12px; color: var(--muted); }
  .adm-address { font-size: 12px; color: var(--muted); margin-top: 2px; }

  .adm-empty {
    text-align: center; padding: 60px; color: var(--muted);
  }
  .adm-empty-icon { font-size: 40px; margin-bottom: 12px; }

  .adm-refresh {
    background: transparent; border: 1px solid var(--border);
    color: var(--muted); padding: 8px 16px; border-radius: 8px;
    font-size: 12px; cursor: pointer; font-family: 'DM Sans', sans-serif;
    transition: all 0.2s;
  }
  .adm-refresh:hover { border-color: var(--gold); color: var(--gold); }

  .adm-loading { text-align: center; padding: 60px; color: var(--muted); }

  /* TABS */
  .adm-tabs { display: flex; gap: 4px; margin-bottom: 32px; background: var(--surface); border: 1px solid var(--border); border-radius: 12px; padding: 4px; width: fit-content; }
  .adm-tab { padding: 8px 20px; border-radius: 9px; font-size: 13px; font-weight: 500; border: none; background: transparent; color: var(--muted); cursor: pointer; font-family: 'DM Sans', sans-serif; transition: all 0.2s; }
  .adm-tab.active { background: var(--surface2); color: var(--gold); }

  /* PRODUCTS */
  .adm-products-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
  .adm-section-title { font-size: 11px; letter-spacing: 0.15em; text-transform: uppercase; color: var(--muted); margin-bottom: 16px; font-weight: 600; }
  .adm-product-list { background: var(--surface); border: 1px solid var(--border); border-radius: 16px; overflow: hidden; }
  .adm-product-row { display: flex; align-items: center; justify-content: space-between; padding: 14px 20px; border-bottom: 1px solid var(--border); }
  .adm-product-row:last-child { border-bottom: none; }
  .adm-product-row:hover { background: rgba(255,255,255,0.02); }
  .adm-prod-left { display: flex; align-items: center; gap: 10px; }
  .adm-prod-emoji { font-size: 22px; }
  .adm-prod-name { font-size: 13px; font-weight: 600; color: var(--text); }
  .adm-prod-cat { font-size: 11px; color: var(--muted); }
  .adm-prod-price { font-family: 'Playfair Display', serif; font-size: 15px; color: var(--gold); margin-right: 12px; }
  .adm-prod-del { background: rgba(224,85,85,0.1); color: var(--red); border: 1px solid rgba(224,85,85,0.2); border-radius: 6px; padding: 4px 10px; font-size: 11px; font-weight: 700; cursor: pointer; transition: background 0.15s; font-family: 'DM Sans', sans-serif; }
  .adm-prod-del:hover { background: rgba(224,85,85,0.25); }

  .adm-add-form { background: var(--surface); border: 1px solid var(--border); border-radius: 16px; padding: 24px; }
  .adm-input { width: 100%; padding: 11px 14px; background: var(--surface2); border: 1px solid var(--border); border-radius: 10px; color: var(--text); font-size: 14px; font-family: 'DM Sans', sans-serif; outline: none; margin-bottom: 10px; transition: border-color 0.2s; }
  .adm-input:focus { border-color: var(--gold); }
  .adm-input::placeholder { color: var(--muted); }
  .adm-input-row { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
  .adm-add-btn { width: 100%; padding: 13px; background: linear-gradient(135deg, var(--gold) 0%, #b8923e 100%); color: #0a0a0f; border: none; border-radius: 10px; font-size: 14px; font-weight: 700; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: opacity 0.2s; margin-top: 4px; }
  .adm-add-btn:hover { opacity: 0.85; }
  .adm-add-btn:disabled { opacity: 0.35; cursor: not-allowed; }

  @media (max-width: 768px) {
    .adm-content { padding: 20px 16px; }
    .adm-header { padding: 16px; }
    .adm-products-grid { grid-template-columns: 1fr; }
    .adm-stats { grid-template-columns: 1fr 1fr; }
    .adm-table td, .adm-table th { padding: 12px 12px; }
  }
`;

const STATUS_LABELS = ["nová", "přijatá", "doručená", "zrušená"];
const STATUS_CLASS  = { "nová": "nova", "přijatá": "prijata", "doručená": "dorucena", "zrušená": "zrusena" };

export default function Admin() {
  const [authed, setAuthed]     = useState(false);
  const [pw, setPw]             = useState("");
  const [pwError, setPwError]   = useState(false);
  const [orders, setOrders]     = useState([]);
  const [loading, setLoading]   = useState(false);
  const [filter, setFilter]     = useState("vše");
  const [tab, setTab]           = useState("objednávky");
  const [products, setProducts] = useState([]);
  const [prodLoading, setProdLoading] = useState(false);
  const [newProd, setNewProd]   = useState({ name: "", category: "", price: "", emoji: "🛒", img: "" });

  const login = () => {
    if (pw === ADMIN_PASSWORD) { setAuthed(true); }
    else { setPwError(true); setTimeout(() => setPwError(false), 2000); }
  };

  const fetchOrders = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });
    setOrders(data || []);
    setLoading(false);
  };

  useEffect(() => { if (authed) { fetchOrders(); fetchProducts(); } }, [authed]);

  const fetchProducts = async () => {
    setProdLoading(true);
    const { data } = await supabase.from("products").select("*").order("category");
    setProducts(data || []);
    setProdLoading(false);
  };

  const addProduct = async () => {
    if (!newProd.name || !newProd.price || !newProd.category) return;
    const { data, error } = await supabase.from("products").insert({
      name: newProd.name, category: newProd.category,
      price: Number(newProd.price), emoji: newProd.emoji, img: newProd.img || ""
    }).select();
    if (error) { alert("Chyba: " + error.message); return; }
    setProducts([...products, data[0]]);
    setNewProd({ name: "", category: "", price: "", emoji: "🛒", img: "" });
  };

  const deleteProduct = async (id) => {
    if (!confirm("Smazat produkt?")) return;
    await supabase.from("products").delete().eq("id", id);
    setProducts(products.filter(p => p.id !== id));
  };

  const updateStatus = async (id, status) => {
    await supabase.from("orders").update({ status }).eq("id", id);
    setOrders((prev) => prev.map((o) => o.id === id ? { ...o, status } : o));
  };

  const filtered = filter === "vše" ? orders : orders.filter((o) => o.status === filter);

  const totalRevenue = orders
    .filter((o) => o.status !== "zrušená")
    .reduce((sum, o) => sum + (o.total || 0), 0);

  const formatTime = (ts) => {
    const d = new Date(ts);
    return d.toLocaleDateString("cs-CZ", { day: "2-digit", month: "2-digit" })
      + " " + d.toLocaleTimeString("cs-CZ", { hour: "2-digit", minute: "2-digit" });
  };

  // LOGIN
  if (!authed) return (
    <div className="adm-wrap">
      <style>{css}</style>
      <div className="adm-login">
        <h1>⚙ Admin panel</h1>
        <p style={{ color: "var(--muted)", fontSize: 13 }}>VečerkaPlus · pouze pro správce</p>
        <input
          type="password" placeholder="Heslo"
          value={pw} onChange={(e) => setPw(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && login()}
        />
        {pwError && <div className="adm-error">❌ Špatné heslo</div>}
        <button onClick={login}>Přihlásit se</button>
        <a href="/" className="adm-back" style={{ textAlign: "center" }}>← Zpět do obchodu</a>
      </div>
    </div>
  );

  // PANEL
  return (
    <div className="adm-wrap">
      <style>{css}</style>

      <div className="adm-header">
        <div className="adm-header-logo">VečerkaPlus · Admin</div>
        <div className="adm-header-right">
          <a href="/" className="adm-back">← Obchod</a>
          <button className="adm-refresh" onClick={fetchOrders}>↻ Obnovit</button>
          <button className="adm-logout" onClick={() => setAuthed(false)}>Odhlásit</button>
        </div>
      </div>

      <div className="adm-content">
        {/* Tabs */}
        <div className="adm-tabs">
          {["objednávky", "produkty"].map(t => (
            <button key={t} className={`adm-tab${tab === t ? " active" : ""}`} onClick={() => setTab(t)}>
              {t === "objednávky" ? "📋 Objednávky" : "🛒 Produkty"}
            </button>
          ))}
        </div>

        {tab === "produkty" ? (
          <>
            <div className="adm-products-grid">
              {/* Seznam produktů */}
              <div>
                <div className="adm-section-title">Aktuální produkty ({products.length})</div>
                <div className="adm-product-list">
                  {prodLoading ? (
                    <div style={{ padding: 24, textAlign: "center", color: "var(--muted)" }}>Načítám...</div>
                  ) : products.length === 0 ? (
                    <div style={{ padding: 24, textAlign: "center", color: "var(--muted)" }}>Žádné produkty v databázi</div>
                  ) : products.map(p => (
                    <div key={p.id} className="adm-product-row">
                      <div className="adm-prod-left">
                        <span className="adm-prod-emoji">{p.emoji}</span>
                        <div>
                          <div className="adm-prod-name">{p.name}</div>
                          <div className="adm-prod-cat">{p.category}</div>
                        </div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <span className="adm-prod-price">{p.price} Kč</span>
                        <button className="adm-prod-del" onClick={() => deleteProduct(p.id)}>Smazat</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Přidat produkt */}
              <div>
                <div className="adm-section-title">Přidat nový produkt</div>
                <div className="adm-add-form">
                  <input className="adm-input" placeholder="Název produktu" value={newProd.name}
                    onChange={e => setNewProd({...newProd, name: e.target.value})} />
                  <div className="adm-input-row">
                    <select className="adm-input" value={newProd.category}
                      onChange={e => setNewProd({...newProd, category: e.target.value})}>
                      <option value="">Kategorie...</option>
                      {["Pivo","Lihoviny","Víno","Nealko","Jídlo","Tabák"].map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                    <input className="adm-input" placeholder="Cena (Kč)" type="number" value={newProd.price}
                      onChange={e => setNewProd({...newProd, price: e.target.value})} />
                  </div>
                  <div className="adm-input-row">
                    <input className="adm-input" placeholder="Emoji (např. 🍺)" value={newProd.emoji}
                      onChange={e => setNewProd({...newProd, emoji: e.target.value})} />
                    <input className="adm-input" placeholder="URL obrázku (volitelné)" value={newProd.img}
                      onChange={e => setNewProd({...newProd, img: e.target.value})} />
                  </div>
                  <button className="adm-add-btn"
                    disabled={!newProd.name || !newProd.price || !newProd.category}
                    onClick={addProduct}>
                    + Přidat produkt
                  </button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
        <div className="adm-stats">
          <div className="adm-stat">
            <div className="adm-stat-label">Celkem objednávek</div>
            <div className="adm-stat-value">{orders.length}</div>
          </div>
          <div className="adm-stat">
            <div className="adm-stat-label">Nové</div>
            <div className="adm-stat-value" style={{ color: "var(--orange)" }}>
              {orders.filter((o) => o.status === "nová").length}
            </div>
            <div className="adm-stat-sub">čekají na vyřízení</div>
          </div>
          <div className="adm-stat">
            <div className="adm-stat-label">Doručené</div>
            <div className="adm-stat-value" style={{ color: "var(--green)" }}>
              {orders.filter((o) => o.status === "doručená").length}
            </div>
          </div>
          <div className="adm-stat">
            <div className="adm-stat-label">Tržby celkem</div>
            <div className="adm-stat-value">{totalRevenue} Kč</div>
            <div className="adm-stat-sub">bez zrušených</div>
          </div>
        </div>

        {/* Filters */}
        <div className="adm-filters">
          {["vše", "nová", "přijatá", "doručená", "zrušená"].map((f) => (
            <button key={f} className={`adm-filter${filter === f ? " active" : ""}`}
              onClick={() => setFilter(f)}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
              {f !== "vše" && ` (${orders.filter((o) => o.status === f).length})`}
            </button>
          ))}
        </div>

        {/* Table */}
        {loading ? (
          <div className="adm-loading">Načítám objednávky...</div>
        ) : filtered.length === 0 ? (
          <div className="adm-empty">
            <div className="adm-empty-icon">📋</div>
            <p>Žádné objednávky</p>
          </div>
        ) : (
          <div className="adm-table-wrap">
            <table className="adm-table">
              <thead>
                <tr>
                  <th>Zákazník</th>
                  <th>Objednávka</th>
                  <th>Celkem</th>
                  <th>Platba</th>
                  <th>Čas</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((o) => (
                  <tr key={o.id}>
                    <td>
                      <div className="adm-name">{o.name}</div>
                      <div className="adm-address">{o.address}</div>
                      <div className="adm-phone">{o.phone}</div>
                    </td>
                    <td>
                      <div className="adm-items">
                        {Array.isArray(o.items)
                          ? o.items.map((item, i) => (
                              <div key={i}>{item.emoji} {item.name} — {item.price} Kč</div>
                            ))
                          : JSON.stringify(o.items)}
                      </div>
                    </td>
                    <td><span className="adm-total">{o.total} Kč</span></td>
                    <td style={{ fontSize: 13 }}>{o.payment}</td>
                    <td><span className="adm-time">{formatTime(o.created_at)}</span></td>
                    <td>
                      <select
                        className="adm-status-select"
                        value={o.status}
                        onChange={(e) => updateStatus(o.id, e.target.value)}
                      >
                        {STATUS_LABELS.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          </div>
        )}
          </>
        )}
      </div>
    </div>
  );
}
