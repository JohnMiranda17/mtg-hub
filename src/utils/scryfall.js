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

export async function getPrintings(card) {
  if (!card?.prints_search_uri) return [];
  const data = await sfetch(card.prints_search_uri);
  return data.data ?? [];
}

export async function searchCards(query) {
  const url = `${BASE}/cards/search?q=${encodeURIComponent(query)}&order=name`;
  const res = await fetch(url);
  if (res.status === 404) return { data: [], total: 0 };
  if (!res.ok) throw new Error(`Scryfall ${res.status}`);
  const json = await res.json();
  return { data: json.data ?? [], total: json.total_cards ?? 0 };
}

// Not cached — each call must return a different random card.
export async function getRandomCard(query) {
  const url = `${BASE}/cards/random?q=${encodeURIComponent(query)}`;
  const res = await fetch(url);
  if (!res.ok) {
    if (res.status === 404) throw new Error('No cards match those filters. Try broadening your search.');
    throw new Error(`Scryfall error ${res.status}`);
  }
  return res.json();
}

export function formatPrice(usd) {
  if (usd == null) return '—';
  return `$${parseFloat(usd).toFixed(2)}`;
}

export function getCardImage(card, size = 'normal') {
  return card?.image_uris?.[size] ?? card?.card_faces?.[0]?.image_uris?.[size] ?? null;
}
