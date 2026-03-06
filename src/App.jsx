import { supabase } from "./supabase";
import { useState, useEffect } from "react";

const initialProducts = [
  { id: 1,  name: "Pilsner Urquell 0,5l",        category: "Pivo",     price: 29,  emoji: "🍺", img: "https://www.pilsnerurquell.com/sites/pilsnerurquell/files/2023-09/PU_bottle_500ml.png" },
  { id: 2,  name: "Kozel Černý 0,5l",             category: "Pivo",     price: 27,  emoji: "🍺", img: "" },
  { id: 3,  name: "Heineken 0,33l",               category: "Pivo",     price: 32,  emoji: "🍺", img: "" },
  { id: 4,  name: "Becherovka 0,5l",              category: "Lihoviny", price: 219, emoji: "🥃", img: "" },
  { id: 5,  name: "Absolut Vodka 0,7l",           category: "Lihoviny", price: 289, emoji: "🥃", img: "" },
  { id: 6,  name: "Jameson Whiskey 0,7l",         category: "Lihoviny", price: 419, emoji: "🥃", img: "" },
  { id: 7,  name: "Moravské víno červené",        category: "Víno",     price: 149, emoji: "🍷", img: "" },
  { id: 8,  name: "Prosecco DOC 0,75l",           category: "Víno",     price: 189, emoji: "🍾", img: "" },
  { id: 9,  name: "Rulandské šedé",               category: "Víno",     price: 169, emoji: "🍷", img: "" },
  { id: 10, name: "Džus pomerančový 1l",          category: "Nealko",   price: 39,  emoji: "🧃", img: "" },
  { id: 11, name: "Red Bull 0,25l",               category: "Nealko",   price: 45,  emoji: "⚡", img: "" },
  { id: 12, name: "Mattoni 0,5l",                 category: "Nealko",   price: 18,  emoji: "💧", img: "" },
  { id: 13, name: "Čerstvý chléb",                category: "Jídlo",    price: 45,  emoji: "🥖", img: "" },
  { id: 14, name: "Lays Chips 150g",              category: "Jídlo",    price: 38,  emoji: "🍟", img: "" },
  { id: 15, name: "Captain Black Original 42g",   category: "Tabák",    price: 189, emoji: "🍂", img: "" },
  { id: 16, name: "Amphora Red 50g",              category: "Tabák",    price: 165, emoji: "🍂", img: "" },
  { id: 17, name: "Stanwell Melange 50g",         category: "Tabák",    price: 179, emoji: "🍂", img: "" },
  { id: 18, name: "Mac Baren HH Old Dark Fired",  category: "Tabák",    price: 210, emoji: "🍂", img: "" },
];

const categories = ["Vše", "Pivo", "Lihoviny", "Víno", "Nealko", "Jídlo", "Tabák"];

const catAccent = {
  "Pivo":     "#f5c842",
  "Lihoviny": "#e07b4f",
  "Víno":     "#c96b8a",
  "Nealko":   "#5bc4a0",
  "Jídlo":    "#e8a24a",
  "Tabák":    "#a8856a",
  "Vše":      "#d4af6a",
};

const catEmoji = {
  "Pivo": "🍺", "Lihoviny": "🥃", "Víno": "🍷",
  "Nealko": "🧃", "Jídlo": "🥖", "Tabák": "🍂",
};

const catGradient = {
  "Pivo":     "linear-gradient(135deg, #2a2000 0%, #3d2e00 50%, #1a1500 100%)",
  "Lihoviny": "linear-gradient(135deg, #2a1200 0%, #3d1f00 50%, #1a0e00 100%)",
  "Víno":     "linear-gradient(135deg, #280a1a 0%, #3d1030 50%, #180616 100%)",
  "Nealko":   "linear-gradient(135deg, #002a1e 0%, #003d2a 50%, #001a12 100%)",
  "Jídlo":    "linear-gradient(135deg, #2a1800 0%, #3d2400 50%, #1a1000 100%)",
  "Tabák":    "linear-gradient(135deg, #1e1208 0%, #2e1c0e 50%, #120b04 100%)",
};

// Opening hours: 20:00 – 05:00
const OPEN_HOUR = 20;
const CLOSE_HOUR = 5;
function isOpen() {
  const h = new Date().getHours();
  return h >= OPEN_HOUR || h < CLOSE_HOUR;
}
function nextOpenIn() {
  const now = new Date();
  const h = now.getHours(), m = now.getMinutes();
  if (h >= CLOSE_HOUR && h < OPEN_HOUR) {
    const minsLeft = (OPEN_HOUR - h) * 60 - m;
    const hh = Math.floor(minsLeft / 60), mm = minsLeft % 60;
    return `${hh}h ${mm}min`;
  }
  return null;
}

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500;600&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #0a0a0f;
    --surface: #13131a;
    --surface2: #1c1c26;
    --border: rgba(255,255,255,0.07);
    --gold: #d4af6a;
    --gold-light: #f0d090;
    --text: #f0ede8;
    --muted: #6b6878;
    --danger: #e05555;
  }

  body { background: var(--bg); margin: 0; padding: 0; width: 100%; }
  html { width: 100%; }

  .vp-app {
    min-height: 100vh;
    width: 100%;
    background: var(--bg);
    font-family: 'DM Sans', sans-serif;
    color: var(--text);
    position: relative;
    overflow-x: hidden;
  }

  .vp-app::before {
    content: '';
    position: fixed;
    top: -200px; left: 50%;
    transform: translateX(-50%);
    width: 800px; height: 400px;
    background: radial-gradient(ellipse, rgba(212,175,106,0.08) 0%, transparent 70%);
    pointer-events: none;
    z-index: 0;
  }

  .vp-stars {
    position: fixed; inset: 0;
    pointer-events: none; z-index: 0;
    background-image:
      radial-gradient(1px 1px at 20% 30%, rgba(255,255,255,0.4) 0%, transparent 100%),
      radial-gradient(1px 1px at 80% 10%, rgba(255,255,255,0.3) 0%, transparent 100%),
      radial-gradient(1px 1px at 60% 70%, rgba(255,255,255,0.25) 0%, transparent 100%),
      radial-gradient(1px 1px at 10% 80%, rgba(255,255,255,0.2) 0%, transparent 100%),
      radial-gradient(1px 1px at 90% 50%, rgba(255,255,255,0.3) 0%, transparent 100%),
      radial-gradient(1px 1px at 45% 15%, rgba(255,255,255,0.35) 0%, transparent 100%),
      radial-gradient(1px 1px at 35% 90%, rgba(255,255,255,0.2) 0%, transparent 100%),
      radial-gradient(1px 1px at 70% 40%, rgba(255,255,255,0.25) 0%, transparent 100%);
  }

  .vp-wrap { max-width: 100%; margin: 0 auto; padding: 0 40px; position: relative; z-index: 1; }

  /* HEADER */
  .vp-header {
    padding: 28px 0 24px;
    display: flex; align-items: center; justify-content: space-between;
    border-bottom: 1px solid var(--border);
  }
  .vp-logo {
    font-family: 'Playfair Display', serif;
    font-size: 26px; font-weight: 900;
    color: var(--gold);
    letter-spacing: -0.02em;
    display: flex; align-items: center; gap: 10px;
  }
  .vp-logo-dot {
    width: 8px; height: 8px; border-radius: 50%;
    background: var(--gold);
    box-shadow: 0 0 12px var(--gold);
    animation: pulse 2s infinite;
  }
  @keyframes pulse {
    0%,100% { opacity: 1; box-shadow: 0 0 12px var(--gold); }
    50% { opacity: 0.5; box-shadow: 0 0 4px var(--gold); }
  }
  .vp-badge {
    font-size: 10px; font-weight: 600; letter-spacing: 0.15em;
    color: #5bc4a0; background: rgba(91,196,160,0.1);
    border: 1px solid rgba(91,196,160,0.25);
    padding: 4px 10px; border-radius: 20px;
    display: flex; align-items: center; gap: 5px;
  }
  .vp-badge::before {
    content: ''; width: 6px; height: 6px; border-radius: 50%;
    background: #5bc4a0; box-shadow: 0 0 6px #5bc4a0;
    animation: pulse 1.5s infinite;
  }
  .vp-header-right { display: flex; align-items: center; gap: 12px; }
  .vp-admin-btn {
    background: transparent; border: 1px solid var(--border);
    color: var(--muted); padding: 8px 16px; border-radius: 8px;
    font-size: 12px; font-family: 'DM Sans', sans-serif;
    cursor: pointer; transition: all 0.2s; letter-spacing: 0.05em;
  }
  .vp-admin-btn:hover { border-color: var(--gold); color: var(--gold); }

  /* HERO */
  .vp-hero {
    padding: 56px 0 40px;
    text-align: center;
  }
  .vp-hero-eyebrow {
    font-size: 11px; letter-spacing: 0.25em; text-transform: uppercase;
    color: var(--gold); margin-bottom: 16px; font-weight: 500;
  }
  .vp-hero-title {
    font-family: 'Playfair Display', serif;
    font-size: clamp(38px, 6vw, 64px);
    font-weight: 900; line-height: 1.05;
    color: var(--text);
    margin-bottom: 16px;
  }
  .vp-hero-title span { color: var(--gold); }
  .vp-hero-sub {
    color: var(--muted); font-size: 15px; font-weight: 300;
    max-width: 420px; margin: 0 auto 32px; line-height: 1.6;
  }
  .vp-delivery-info {
    display: inline-flex; gap: 24px;
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 40px; padding: 12px 28px;
    font-size: 13px; color: var(--muted);
  }
  .vp-delivery-info span { display: flex; align-items: center; gap: 6px; }
  .vp-delivery-info b { color: var(--text); }

  /* CATEGORIES */
  .vp-cats {
    display: flex; gap: 8px; flex-wrap: wrap;
    padding: 32px 0 0;
  }
  .vp-cat {
    padding: 9px 20px; border-radius: 24px;
    font-size: 13px; font-weight: 500;
    cursor: pointer; transition: all 0.2s;
    font-family: 'DM Sans', sans-serif;
    border: 1px solid var(--border);
    background: var(--surface); color: var(--muted);
    white-space: nowrap;
  }
  .vp-cat:hover { border-color: rgba(212,175,106,0.3); color: var(--text); }
  .vp-cat.active {
    color: #0a0a0f !important; border-color: transparent !important;
    font-weight: 600;
    box-shadow: 0 4px 16px rgba(0,0,0,0.4);
  }

  /* MAIN LAYOUT */
  .vp-main {
    display: flex; gap: 28px; padding: 28px 0 60px;
    align-items: flex-start;
    width: 100%;
  }
  .vp-products { flex: 1; min-width: 0; width: 100%; }
  .vp-section-label {
    font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase;
    color: var(--muted); margin-bottom: 20px; font-weight: 600;
  }
  .vp-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 16px;
    width: 100%;
  }

  /* CLOSED BANNER */
  .vp-closed-banner {
    background: linear-gradient(135deg, #1a0a0a, #2a1010);
    border: 1px solid rgba(224,85,85,0.3);
    border-radius: 16px; padding: 20px 28px;
    display: flex; align-items: center; justify-content: space-between;
    margin-top: 24px;
  }
  .vp-closed-left { display: flex; align-items: center; gap: 14px; }
  .vp-closed-dot {
    width: 10px; height: 10px; border-radius: 50%;
    background: #e05555; box-shadow: 0 0 10px #e05555;
    flex-shrink: 0;
  }
  .vp-closed-title { font-size: 15px; font-weight: 700; color: #f0ede8; margin-bottom: 2px; }
  .vp-closed-sub { font-size: 12px; color: #6b6878; }
  .vp-closed-time {
    font-family: 'Playfair Display', serif;
    font-size: 22px; font-weight: 700; color: var(--gold);
    white-space: nowrap;
  }

  /* PRODUCT CARD — with image */
  .vp-card-img {
    width: 100%; height: 150px;
    object-fit: contain;
    border-radius: 12px;
    display: block;
  }
  .vp-card-img-placeholder {
    width: 100%; height: 150px;
    border-radius: 12px;
    display: flex; align-items: center; justify-content: center;
    font-size: 64px;
    flex-shrink: 0;
    position: relative;
    overflow: hidden;
  }
  .vp-card-img-placeholder::after {
    content: '';
    position: absolute; inset: 0;
    background: radial-gradient(ellipse at 30% 30%, rgba(255,255,255,0.12) 0%, transparent 60%);
    pointer-events: none;
  }

  /* FREE DELIVERY PROGRESS */
  .vp-delivery-progress {
    margin-top: 4px;
  }
  .vp-delivery-progress-label {
    font-size: 11px; color: var(--muted); margin-bottom: 6px;
    display: flex; justify-content: space-between;
  }
  .vp-delivery-progress-label b { color: var(--gold); }
  .vp-progress-bar {
    height: 4px; border-radius: 4px;
    background: var(--surface2); overflow: hidden;
  }
  .vp-progress-fill {
    height: 100%; border-radius: 4px;
    background: linear-gradient(90deg, var(--gold), #f0d090);
    transition: width 0.4s ease;
  }
  .vp-free-delivery-badge {
    font-size: 11px; color: #5bc4a0;
    text-align: center; margin-top: 8px; font-weight: 600;
    letter-spacing: 0.05em;
  }
  .vp-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 16px; padding: 20px;
    display: flex; flex-direction: column; gap: 12px;
    transition: all 0.25s; cursor: default;
    position: relative; overflow: hidden;
  }
  .vp-card::before {
    content: '';
    position: absolute; top: 0; left: 0; right: 0; height: 2px;
    opacity: 0; transition: opacity 0.25s;
  }
  .vp-card:hover {
    border-color: rgba(212,175,106,0.2);
    transform: translateY(-2px);
    box-shadow: 0 12px 40px rgba(0,0,0,0.4);
  }
  .vp-card:hover::before { opacity: 1; }
  .vp-card-emoji {
    font-size: 32px; line-height: 1;
    filter: drop-shadow(0 2px 8px rgba(0,0,0,0.5));
  }
  .vp-card-name {
    font-size: 14px; font-weight: 600;
    color: var(--text); line-height: 1.35;
    flex: 1;
  }
  .vp-card-cat {
    font-size: 10px; font-weight: 600;
    letter-spacing: 0.1em; text-transform: uppercase;
    padding: 3px 8px; border-radius: 12px;
    display: inline-block;
  }
  .vp-card-bottom {
    display: flex; align-items: center; justify-content: space-between;
    margin-top: 4px;
  }
  .vp-card-price {
    font-family: 'Playfair Display', serif;
    font-size: 20px; font-weight: 700;
    color: var(--gold);
  }
  .vp-card-price span { font-size: 12px; font-family: 'DM Sans', sans-serif; font-weight: 400; color: var(--muted); }
  .vp-add {
    width: 34px; height: 34px; border-radius: 50%;
    background: var(--gold); color: #0a0a0f;
    border: none; font-size: 18px; font-weight: 300;
    cursor: pointer; display: flex; align-items: center; justify-content: center;
    transition: all 0.2s; line-height: 1;
    box-shadow: 0 4px 12px rgba(212,175,106,0.3);
  }
  .vp-add:hover {
    background: var(--gold-light);
    box-shadow: 0 4px 20px rgba(212,175,106,0.5);
    transform: scale(1.1);
  }

  /* CART */
  .vp-cart {
    width: 360px; flex-shrink: 0;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 20px; padding: 24px;
    position: sticky; top: 24px;
    display: flex; flex-direction: column; gap: 0;
  }
  .vp-cart-header {
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 20px;
  }
  .vp-cart-title {
    font-family: 'Playfair Display', serif;
    font-size: 20px; font-weight: 700; color: var(--text);
  }
  .vp-cart-count {
    background: var(--gold); color: #0a0a0f;
    font-size: 11px; font-weight: 700;
    width: 22px; height: 22px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
  }
  .vp-cart-empty {
    text-align: center; padding: 32px 0;
    color: var(--muted); font-size: 13px;
  }
  .vp-cart-empty-icon { font-size: 40px; margin-bottom: 8px; opacity: 0.4; }
  .vp-cart-items { display: flex; flex-direction: column; gap: 12px; margin-bottom: 20px; }
  .vp-cart-row {
    display: flex; align-items: center; gap: 10px;
  }
  .vp-cart-row-emoji { font-size: 20px; }
  .vp-cart-row-info { flex: 1; min-width: 0; }
  .vp-cart-row-name { font-size: 12px; font-weight: 500; color: var(--text); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .vp-cart-row-price { font-size: 11px; color: var(--muted); }
  .vp-cart-remove {
    background: rgba(224,85,85,0.1); color: var(--danger);
    border: none; border-radius: 6px;
    width: 22px; height: 22px; font-size: 9px;
    cursor: pointer; font-weight: 700; flex-shrink: 0;
    transition: background 0.15s;
  }
  .vp-cart-remove:hover { background: rgba(224,85,85,0.25); }
  .vp-divider { border: none; border-top: 1px solid var(--border); margin: 0 0 16px; }
  .vp-cart-total {
    display: flex; justify-content: space-between; align-items: baseline;
    margin-bottom: 16px;
  }
  .vp-cart-total-label { font-size: 13px; color: var(--muted); }
  .vp-cart-total-sum {
    font-family: 'Playfair Display', serif;
    font-size: 26px; font-weight: 700; color: var(--gold);
  }
  .vp-checkout-btn {
    width: 100%; padding: 14px;
    background: linear-gradient(135deg, var(--gold) 0%, #b8923e 100%);
    color: #0a0a0f; border: none; border-radius: 12px;
    font-size: 14px; font-weight: 700; cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    transition: all 0.2s; letter-spacing: 0.03em;
    box-shadow: 0 4px 20px rgba(212,175,106,0.25);
  }
  .vp-checkout-btn:hover:not(:disabled) {
    box-shadow: 0 8px 32px rgba(212,175,106,0.4);
    transform: translateY(-1px);
  }
  .vp-checkout-btn:disabled { opacity: 0.35; cursor: not-allowed; }

  /* CHECKOUT */
  .vp-checkout-wrap { max-width: 640px; margin: 0 auto; padding: 40px 0 60px; }
  .vp-back { background: none; border: none; color: var(--muted); font-size: 13px;
    font-family: 'DM Sans', sans-serif; cursor: pointer; display: flex; align-items: center; gap: 6px;
    margin-bottom: 32px; transition: color 0.2s; padding: 0;
  }
  .vp-back:hover { color: var(--gold); }
  .vp-checkout-title {
    font-family: 'Playfair Display', serif;
    font-size: 36px; font-weight: 900; color: var(--text);
    margin-bottom: 32px;
  }
  .vp-section {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 16px; padding: 24px; margin-bottom: 16px;
  }
  .vp-section-title { font-size: 12px; letter-spacing: 0.15em; text-transform: uppercase;
    color: var(--gold); margin-bottom: 16px; font-weight: 600;
  }
  .vp-input {
    width: 100%; padding: 12px 16px;
    background: var(--surface2); border: 1px solid var(--border);
    border-radius: 10px; color: var(--text); font-size: 14px;
    font-family: 'DM Sans', sans-serif; outline: none; margin-bottom: 10px;
    transition: border-color 0.2s;
  }
  .vp-input:focus { border-color: rgba(212,175,106,0.4); }
  .vp-input::placeholder { color: var(--muted); }
  .vp-payment-options { display: flex; gap: 10px; }
  .vp-payment-opt {
    flex: 1; padding: 14px 10px; border-radius: 12px;
    border: 1.5px solid var(--border);
    background: var(--surface2); color: var(--muted);
    cursor: pointer; font-size: 13px; font-weight: 500;
    font-family: 'DM Sans', sans-serif; text-align: center;
    transition: all 0.2s;
  }
  .vp-payment-opt:hover { border-color: rgba(212,175,106,0.3); color: var(--text); }
  .vp-payment-opt.active {
    border-color: var(--gold); color: var(--gold);
    background: rgba(212,175,106,0.07);
  }
  .vp-summary-row { display: flex; justify-content: space-between; padding: 6px 0; font-size: 13px; color: var(--muted); }
  .vp-summary-total { display: flex; justify-content: space-between; align-items: baseline; padding-top: 14px; border-top: 1px solid var(--border); margin-top: 6px; }
  .vp-summary-total span:first-child { font-size: 14px; color: var(--text); font-weight: 600; }
  .vp-summary-total span:last-child { font-family: 'Playfair Display', serif; font-size: 28px; color: var(--gold); }
  .vp-order-btn {
    width: 100%; padding: 16px;
    background: linear-gradient(135deg, var(--gold) 0%, #b8923e 100%);
    color: #0a0a0f; border: none; border-radius: 14px;
    font-size: 15px; font-weight: 700; cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    transition: all 0.2s; letter-spacing: 0.03em;
    box-shadow: 0 4px 20px rgba(212,175,106,0.25);
    margin-top: 8px;
  }
  .vp-order-btn:disabled { opacity: 0.35; cursor: not-allowed; }
  .vp-order-btn:hover:not(:disabled) { box-shadow: 0 8px 32px rgba(212,175,106,0.4); }

  /* SUCCESS */
  .vp-success { text-align: center; padding: 100px 20px; max-width: 480px; margin: 0 auto; }
  .vp-success-ring {
    width: 96px; height: 96px; border-radius: 50%;
    border: 2px solid var(--gold);
    display: flex; align-items: center; justify-content: center;
    margin: 0 auto 28px; font-size: 40px;
    box-shadow: 0 0 40px rgba(212,175,106,0.2);
    animation: glow 2s infinite;
  }
  @keyframes glow {
    0%,100% { box-shadow: 0 0 40px rgba(212,175,106,0.2); }
    50% { box-shadow: 0 0 60px rgba(212,175,106,0.4); }
  }
  .vp-success-title { font-family: 'Playfair Display', serif; font-size: 36px; font-weight: 900; color: var(--text); margin-bottom: 12px; }
  .vp-success-sub { color: var(--muted); font-size: 15px; line-height: 1.6; margin-bottom: 40px; }
  .vp-success-eta {
    display: inline-flex; align-items: center; gap: 8px;
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 40px; padding: 12px 24px;
    font-size: 14px; color: var(--text); margin-bottom: 40px;
  }

  /* ADMIN */
  .vp-admin-wrap { max-width: 100%; margin: 0 auto; padding: 40px 0 60px; }
  .vp-admin-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 28px; }
  .vp-product-row {
    display: flex; justify-content: space-between; align-items: center;
    padding: 10px 0; border-bottom: 1px solid var(--border);
  }
  .vp-product-row:last-child { border-bottom: none; }
  .vp-row-left { display: flex; align-items: center; gap: 10px; }
  .vp-row-emoji { font-size: 20px; }
  .vp-row-name { font-size: 13px; font-weight: 600; color: var(--text); }
  .vp-row-cat { font-size: 10px; color: var(--muted); letter-spacing: 0.05em; }
  .vp-row-right { display: flex; align-items: center; gap: 12px; }
  .vp-row-price { font-family: 'Playfair Display', serif; font-size: 16px; color: var(--gold); }
  .vp-del-btn {
    background: rgba(224,85,85,0.1); color: var(--danger);
    border: 1px solid rgba(224,85,85,0.2); border-radius: 6px;
    padding: 4px 10px; font-size: 11px; font-weight: 700;
    cursor: pointer; transition: background 0.15s; font-family: 'DM Sans', sans-serif;
  }
  .vp-del-btn:hover { background: rgba(224,85,85,0.2); }
`;

export default function App() {
  const [view, setView] = useState("shop");
  const [products, setProducts] = useState(initialProducts);
  const [cart, setCart] = useState([]);
  const [activeCat, setActiveCat] = useState("Vše");
  const [newProduct, setNewProduct] = useState({ name: "", category: "", price: "", emoji: "🛒", img: "" });
  const [orderSent, setOrderSent] = useState(false);
  const [orderInfo, setOrderInfo] = useState({ name: "", address: "", phone: "", payment: "" });
  const [open] = useState(isOpen());

  const FREE_DELIVERY = 500;
  const total = cart.reduce((s, i) => s + i.price, 0);
  const remaining = Math.max(0, FREE_DELIVERY - total);
  const progress = Math.min(100, (total / FREE_DELIVERY) * 100);
  const addToCart = (p) => setCart([...cart, p]);
  const removeFromCart = (i) => setCart(cart.filter((_, idx) => idx !== i));
  const filtered = activeCat === "Vše" ? products : products.filter((p) => p.category === activeCat);

  const addProduct = () => {
    if (!newProduct.name || !newProduct.price) return;
    setProducts([...products, { ...newProduct, id: Date.now(), price: Number(newProduct.price) }]);
    setNewProduct({ name: "", category: "", price: "", emoji: "🛒" });
  };

  const sendOrder = async () => {
    if (!orderInfo.name || !orderInfo.payment) return;
    const { error } = await supabase.from("orders").insert({
      name: orderInfo.name,
      address: orderInfo.address,
      phone: orderInfo.phone,
      payment: orderInfo.payment,
      items: cart,
      total: total,
    });
    if (error) { alert("Chyba při odesílání: " + error.message); return; }
    setOrderSent(true);
    setCart([]);
  };

  // ── ADMIN ────────────────────────────────────────────────────
  if (view === "admin") return (
    <div className="vp-app">
      <style>{css}</style>
      <div className="vp-stars" />
      <div className="vp-wrap">
        <header className="vp-header">
          <div className="vp-logo"><div className="vp-logo-dot" />VečerkaPlus</div>
          <button className="vp-admin-btn" onClick={() => setView("shop")}>← Zpět do obchodu</button>
        </header>
        <div className="vp-admin-wrap">
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 36, fontWeight: 900, color: "var(--text)", marginBottom: 4 }}>Správa produktů</h1>
          <p style={{ color: "var(--muted)", fontSize: 13 }}>Přidávejte a mažte produkty z nabídky</p>
          <div className="vp-admin-grid">
            <div className="vp-section">
              <div className="vp-section-title">Přidat produkt</div>
              <input className="vp-input" placeholder="Emoji (např. 🍺)" value={newProduct.emoji}
                onChange={(e) => setNewProduct({ ...newProduct, emoji: e.target.value })} />
              <input className="vp-input" placeholder="URL obrázku (volitelné)" value={newProduct.img}
                onChange={(e) => setNewProduct({ ...newProduct, img: e.target.value })} />
              <input className="vp-input" placeholder="Název produktu" value={newProduct.name}
                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} />
              <input className="vp-input" placeholder="Kategorie" value={newProduct.category}
                onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })} />
              <input className="vp-input" placeholder="Cena (Kč)" type="number" value={newProduct.price}
                onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })} />
              <button className="vp-order-btn" style={{ marginTop: 4 }} onClick={addProduct}>+ Přidat produkt</button>
            </div>
            <div className="vp-section">
              <div className="vp-section-title">Produkty ({products.length})</div>
              {products.map((p) => (
                <div key={p.id} className="vp-product-row">
                  <div className="vp-row-left">
                    <span className="vp-row-emoji">{p.emoji}</span>
                    <div>
                      <div className="vp-row-name">{p.name}</div>
                      <div className="vp-row-cat">{p.category}</div>
                    </div>
                  </div>
                  <div className="vp-row-right">
                    <span className="vp-row-price">{p.price} Kč</span>
                    <button className="vp-del-btn" onClick={() => setProducts(products.filter((x) => x.id !== p.id))}>✕</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // ── CHECKOUT ─────────────────────────────────────────────────
  if (view === "checkout") {
    if (orderSent) return (
      <div className="vp-app">
        <style>{css}</style>
        <div className="vp-stars" />
        <div className="vp-wrap">
          <header className="vp-header">
            <div className="vp-logo"><div className="vp-logo-dot" />VečerkaPlus</div>
          </header>
          <div className="vp-success">
            <div className="vp-success-ring">🥂</div>
            <h1 className="vp-success-title">Na zdraví, {orderInfo.name.split(" ")[0]}!</h1>
            <p className="vp-success-sub">Vaše objednávka byla přijata.<br />Kurýr je na cestě do Frýdku-Místku.</p>
            <div className="vp-success-eta">⏱ Odhadovaná doručení: <b style={{ color: "var(--gold)" }}>40–60 minut</b></div>
            <button className="vp-order-btn" onClick={() => { setView("shop"); setOrderSent(false); setOrderInfo({ name: "", address: "", phone: "", payment: "" }); }}>
              Zpět do obchodu
            </button>
          </div>
        </div>
      </div>
    );

    return (
      <div className="vp-app">
        <style>{css}</style>
        <div className="vp-stars" />
        <div className="vp-wrap">
          <header className="vp-header">
            <div className="vp-logo"><div className="vp-logo-dot" />VečerkaPlus</div>
          </header>
          <div className="vp-checkout-wrap">
            <button className="vp-back" onClick={() => setView("shop")}>← Zpět do obchodu</button>
            <h1 className="vp-checkout-title">Dokončení objednávky</h1>

            <div className="vp-section">
              <div className="vp-section-title">Kontaktní údaje</div>
              <input className="vp-input" placeholder="Jméno a příjmení" value={orderInfo.name}
                onChange={(e) => setOrderInfo({ ...orderInfo, name: e.target.value })} />
              <input className="vp-input" placeholder="Adresa doručení — Frýdek‑Místek" value={orderInfo.address}
                onChange={(e) => setOrderInfo({ ...orderInfo, address: e.target.value })} />
              <input className="vp-input" style={{ marginBottom: 0 }} placeholder="Telefon" value={orderInfo.phone}
                onChange={(e) => setOrderInfo({ ...orderInfo, phone: e.target.value })} />
            </div>

            <div className="vp-section">
              <div className="vp-section-title">Způsob platby</div>
              <div className="vp-payment-options">
                {[["💳", "Online kartou"], ["💵", "Hotově při doručení"]].map(([icon, label]) => (
                  <button key={label}
                    className={`vp-payment-opt${orderInfo.payment === label ? " active" : ""}`}
                    onClick={() => setOrderInfo({ ...orderInfo, payment: label })}>
                    {icon}<br />{label}
                  </button>
                ))}
              </div>
            </div>

            <div className="vp-section">
              <div className="vp-section-title">Shrnutí objednávky</div>
              {cart.map((item, i) => (
                <div key={i} className="vp-summary-row">
                  <span>{item.emoji} {item.name}</span>
                  <span>{item.price} Kč</span>
                </div>
              ))}
              <div className="vp-summary-total">
                <span>Celkem k úhradě</span>
                <span>{total} Kč</span>
              </div>
            </div>

            <button className="vp-order-btn"
              disabled={!orderInfo.name || !orderInfo.payment}
              onClick={sendOrder}>
              Odeslat objednávku →
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── SHOP ─────────────────────────────────────────────────────
  return (
    <div className="vp-app">
      <style>{css}</style>
      <div className="vp-stars" />
      <div className="vp-wrap">
        <header className="vp-header">
          <div className="vp-logo"><div className="vp-logo-dot" />VečerkaPlus</div>
          <div className="vp-header-right">
            <div className="vp-badge" style={open ? {} : { color: "#e05555", background: "rgba(224,85,85,0.1)", borderColor: "rgba(224,85,85,0.25)" }}>
              {open ? "OTEVŘENO" : "ZAVŘENO"} · 20:00–5:00
            </div>
            <button className="vp-admin-btn" onClick={() => setView("admin")}>⚙ Admin</button>
          </div>
        </header>

        <div className="vp-hero">
          <div className="vp-hero-eyebrow">Noční rozvoz · Frýdek-Místek</div>
          <h1 className="vp-hero-title">Víno, pivo<br />i něco <span>ostřejšího</span></h1>
          <p className="vp-hero-sub">Vše co potřebujete na večer. Doručíme rychle, diskrétně a s úsměvem.</p>
          <div className="vp-delivery-info">
            <span>⏱ <b>40–60 min</b></span>
            <span>🛵 <b>Zdarma</b> od 500 Kč</span>
            <span>🌙 <b>20:00–5:00</b></span>
          </div>
        </div>

        {!open && (
          <div className="vp-closed-banner">
            <div className="vp-closed-left">
              <div className="vp-closed-dot" />
              <div>
                <div className="vp-closed-title">Momentálně zavřeno</div>
                <div className="vp-closed-sub">Otevíráme dnes ve 20:00 · Otevřeno za <b style={{color:"var(--gold)"}}>{nextOpenIn()}</b></div>
              </div>
            </div>
            <div className="vp-closed-time">20:00</div>
          </div>
        )}

        <div className="vp-cats">
          {categories.map((cat) => {
            const color = catAccent[cat] || "#d4af6a";
            const isActive = activeCat === cat;
            return (
              <button key={cat} className={`vp-cat${isActive ? " active" : ""}`}
                style={isActive ? { background: color } : {}}
                onClick={() => setActiveCat(cat)}>
                {cat !== "Vše" ? `${catEmoji[cat] || ""} ` : "✦ "}{cat}
              </button>
            );
          })}
        </div>

        <div className="vp-main">
          <div className="vp-products">
            <div className="vp-section-label">
              {activeCat === "Vše" ? `Všechny produkty · ${filtered.length} položek` : `${activeCat} · ${filtered.length} položek`}
            </div>
            <div className="vp-grid">
              {filtered.map((p) => {
                const color = catAccent[p.category] || "#d4af6a";
                return (
                  <div key={p.id} className="vp-card"
                    style={{ "--card-accent": color }}>
                    <style>{`.vp-card:hover::before { background: linear-gradient(90deg, ${color}, transparent); }`}</style>
                    {p.img
                      ? <img src={p.img} alt={p.name} className="vp-card-img" onError={(e) => { e.target.style.display='none'; e.target.nextSibling.style.display='flex'; }} />
                      : null}
                    <div className="vp-card-img-placeholder"
                      style={{
                        display: p.img ? 'none' : 'flex',
                        background: catGradient[p.category] || "linear-gradient(135deg, #1c1c26, #13131a)",
                        boxShadow: `inset 0 0 40px ${color}22`,
                        border: `1px solid ${color}22`,
                      }}>
                      <span style={{ filter: "drop-shadow(0 4px 16px rgba(0,0,0,0.8))", fontSize: 68, lineHeight: 1 }}>{p.emoji}</span>
                    </div>
                    <div className="vp-card-name">{p.name}</div>
                    <div className="vp-card-cat"
                      style={{ background: color + "18", color }}>
                      {p.category}
                    </div>
                    <div className="vp-card-bottom">
                      <div className="vp-card-price">{p.price} <span>Kč</span></div>
                      <button className="vp-add" onClick={() => addToCart(p)}>+</button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="vp-cart">
            <div className="vp-cart-header">
              <div className="vp-cart-title">Košík</div>
              {cart.length > 0 && <div className="vp-cart-count">{cart.length}</div>}
            </div>

            {cart.length === 0 ? (
              <div className="vp-cart-empty">
                <div className="vp-cart-empty-icon">🛒</div>
                <p>Košík je prázdný</p>
                <p style={{ marginTop: 4, fontSize: 11 }}>Přidejte něco dobrého</p>
              </div>
            ) : (
              <>
                <div className="vp-cart-items">
                  {cart.map((item, i) => (
                    <div key={i} className="vp-cart-row">
                      <span className="vp-cart-row-emoji">{item.emoji}</span>
                      <div className="vp-cart-row-info">
                        <div className="vp-cart-row-name">{item.name}</div>
                        <div className="vp-cart-row-price">{item.price} Kč</div>
                      </div>
                      <button className="vp-cart-remove" onClick={() => removeFromCart(i)}>✕</button>
                    </div>
                  ))}
                </div>
                <hr className="vp-divider" />
                {total < FREE_DELIVERY ? (
                  <div className="vp-delivery-progress">
                    <div className="vp-delivery-progress-label">
                      <span>Doprava zdarma</span>
                      <b>chybí {remaining} Kč</b>
                    </div>
                    <div className="vp-progress-bar">
                      <div className="vp-progress-fill" style={{ width: `${progress}%` }} />
                    </div>
                  </div>
                ) : (
                  <div className="vp-free-delivery-badge">✓ Doprava zdarma!</div>
                )}
                <div className="vp-cart-total">
                  <span className="vp-cart-total-label">Celkem</span>
                  <span className="vp-cart-total-sum">{total} Kč</span>
                </div>
                <button className="vp-checkout-btn" onClick={() => setView("checkout")}>
                  Objednat →
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
