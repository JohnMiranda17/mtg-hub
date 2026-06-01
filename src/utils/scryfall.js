const BASE = 'https://api.scryfall.com';

// Simple in-memory cache to stay within Scryfall's rate limit guidelines
const cache = new Map();

async function sfetch(url) {
  if (cache.has(url)) return cache.get(url);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Scryfall ${res.status}: ${url}`);
  const data = await res.json();
  cache.set(url, data);
  return data;
}

export async function autocomplete(query) {
  if (!query || query.length < 2) return [];
  const data = await sfetch(`${BASE}/cards/autocomplete?q=${encodeURIComponent(query)}`);
  return data.data ?? [];
}

export async function getCardByName(name) {
  return sfetch(`${BASE}/cards/named?fuzzy=${encodeURIComponent(name)}`);
}

export async function getCardById(id) {
  return sfetch(`${BASE}/cards/${id}`);
}

export async function getCardBySetNumber(set, number) {
  return sfetch(`${BASE}/cards/${encodeURIComponent(set.toLowerCase())}/${encodeURIComponent(number)}`);
}

export async function searchCards(query) {
  const data = await sfetch(`${BASE}/cards/search?q=${encodeURIComponent(query)}&order=name`);
  return data.data ?? [];
}

export function formatPrice(usd) {
  if (usd == null) return '—';
  return `$${parseFloat(usd).toFixed(2)}`;
}

export function getCardImage(card, size = 'normal') {
  return card?.image_uris?.[size] ?? card?.card_faces?.[0]?.image_uris?.[size] ?? null;
}
