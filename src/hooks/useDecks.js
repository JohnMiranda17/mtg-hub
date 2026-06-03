import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

const LS_KEY = 'mtg-hub:decks';

// ── Format validation ─────────────────────────────────────────────────────────

const BASIC_LANDS = new Set(['Plains','Island','Swamp','Mountain','Forest',
  'Wastes','Snow-Covered Plains','Snow-Covered Island','Snow-Covered Swamp',
  'Snow-Covered Mountain','Snow-Covered Forest']);

export function validateDeck(deck) {
  const errors = [];
  const main     = deck.cards.filter(c => !c.isSideboard);
  const side     = deck.cards.filter(c =>  c.isSideboard);
  const mainTotal = main.reduce((s, c) => s + c.quantity, 0);
  const sideTotal = side.reduce((s, c) => s + c.quantity, 0);

  if (deck.format === 'commander') {
    const commanders = deck.cards.filter(c => c.isCommander);
    if (commanders.length === 0) errors.push('No commander designated.');
    if (commanders.length  >  1) errors.push('Only 1 commander allowed (or 2 for partner commanders).');
    if (mainTotal !== 100) errors.push(`Deck must have exactly 100 cards (currently ${mainTotal}).`);

    // Max 1 copy of each non-basic card
    for (const card of main) {
      if (!BASIC_LANDS.has(card.cardName) && card.quantity > 1) {
        errors.push(`"${card.cardName}": Commander allows only 1 copy (found ${card.quantity}).`);
      }
    }
  } else {
    // Standard / Modern
    if (mainTotal < 60) errors.push(`Main deck must have at least 60 cards (currently ${mainTotal}).`);
    if (sideTotal > 15) errors.push(`Sideboard cannot exceed 15 cards (currently ${sideTotal}).`);

    // Max 4 copies of each non-basic card
    for (const card of [...main, ...side]) {
      if (!BASIC_LANDS.has(card.cardName) && card.quantity > 4) {
        errors.push(`"${card.cardName}": maximum 4 copies allowed (found ${card.quantity}).`);
      }
    }
  }

  return errors;
}

// ── localStorage helpers ──────────────────────────────────────────────────────

function loadLocal() {
  try { return JSON.parse(localStorage.getItem(LS_KEY)) ?? []; }
  catch { return []; }
}

function saveLocal(decks) {
  localStorage.setItem(LS_KEY, JSON.stringify(decks));
}

// ── Supabase helpers ──────────────────────────────────────────────────────────

async function sbLoadDecks(userId) {
  const { data: dRows } = await supabase
    .from('decks')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: true });

  if (!dRows?.length) return [];

  const deckIds = dRows.map(d => d.id);
  const { data: cRows } = await supabase
    .from('deck_cards')
    .select('*')
    .in('deck_id', deckIds);

  const cardsByDeck = {};
  for (const c of cRows ?? []) {
    if (!cardsByDeck[c.deck_id]) cardsByDeck[c.deck_id] = [];
    cardsByDeck[c.deck_id].push({
      id:          c.id,
      scryfallId:  c.scryfall_id,
      cardName:    c.card_name,
      imageUri:    c.image_uri,
      quantity:    c.quantity,
      isCommander: c.is_commander,
      isSideboard: c.is_sideboard,
    });
  }

  return dRows.map(d => ({
    id:          d.id,
    name:        d.name,
    format:      d.format,
    description: d.description,
    createdAt:   d.created_at,
    cards:       cardsByDeck[d.id] ?? [],
  }));
}

// ── Hook ──────────────────────────────────────────────────────────────────────

export function useDecks() {
  const auth = useContext(AuthContext);
  const user = auth?.user ?? null;

  const [decks, setDecks]   = useState([]);
  const [loading, setLoading] = useState(true);

  const useSupabase = !!(user && supabase);

  useEffect(() => {
    if (useSupabase) {
      setLoading(true);
      sbLoadDecks(user.id).then(data => { setDecks(data); setLoading(false); });
    } else {
      setDecks(loadLocal());
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    if (!useSupabase) saveLocal(decks);
  }, [decks, useSupabase]);

  // ── mutations ──────────────────────────────────────────────────────────────

  async function createDeck({ name, format, description = '' }) {
    if (useSupabase) {
      const { data } = await supabase.from('decks')
        .insert({ user_id: user.id, name, format, description })
        .select().single();
      if (data) setDecks(prev => [...prev, { ...data, cards: [] }]);
    } else {
      const d = { id: crypto.randomUUID(), name, format, description, createdAt: new Date().toISOString(), cards: [] };
      setDecks(prev => [...prev, d]);
    }
  }

  async function deleteDeck(deckId) {
    setDecks(prev => prev.filter(d => d.id !== deckId));
    if (useSupabase) {
      await supabase.from('decks').delete().eq('id', deckId);
    }
  }

  async function renameDeck(deckId, name) {
    setDecks(prev => prev.map(d => d.id === deckId ? { ...d, name } : d));
    if (useSupabase) {
      await supabase.from('decks').update({ name }).eq('id', deckId);
    }
  }

  async function addCardToDeck(deckId, { scryfallId, cardName, imageUri, quantity = 1, isCommander = false, isSideboard = false }) {
    const deck     = decks.find(d => d.id === deckId);
    if (!deck) return;
    const existing = deck.cards.find(c => c.scryfallId === scryfallId && c.isSideboard === isSideboard);

    if (existing) {
      const qty = existing.quantity + quantity;
      setDecks(prev => prev.map(d =>
        d.id === deckId
          ? { ...d, cards: d.cards.map(c =>
              c.scryfallId === scryfallId && c.isSideboard === isSideboard ? { ...c, quantity: qty } : c
            )}
          : d
      ));
      if (useSupabase) {
        await supabase.from('deck_cards').update({ quantity: qty }).eq('id', existing.id);
      }
    } else {
      if (useSupabase) {
        const { data } = await supabase.from('deck_cards')
          .insert({ deck_id: deckId, scryfall_id: scryfallId, card_name: cardName, image_uri: imageUri, quantity, is_commander: isCommander, is_sideboard: isSideboard })
          .select().single();
        if (data) {
          setDecks(prev => prev.map(d =>
            d.id === deckId
              ? { ...d, cards: [...d.cards, { id: data.id, scryfallId, cardName, imageUri, quantity, isCommander, isSideboard }] }
              : d
          ));
        }
      } else {
        const card = { id: crypto.randomUUID(), scryfallId, cardName, imageUri, quantity, isCommander, isSideboard };
        setDecks(prev => prev.map(d =>
          d.id === deckId ? { ...d, cards: [...d.cards, card] } : d
        ));
      }
    }
  }

  async function removeCardFromDeck(deckId, scryfallId, isSideboard = false) {
    const deck = decks.find(d => d.id === deckId);
    const card = deck?.cards.find(c => c.scryfallId === scryfallId && c.isSideboard === isSideboard);
    if (!card) return;

    setDecks(prev => prev.map(d =>
      d.id === deckId
        ? { ...d, cards: d.cards.filter(c => !(c.scryfallId === scryfallId && c.isSideboard === isSideboard)) }
        : d
    ));
    if (useSupabase) {
      await supabase.from('deck_cards').delete().eq('id', card.id);
    }
  }

  async function setCommander(deckId, scryfallId) {
    setDecks(prev => prev.map(d =>
      d.id === deckId
        ? { ...d, cards: d.cards.map(c => ({ ...c, isCommander: c.scryfallId === scryfallId })) }
        : d
    ));
    if (useSupabase) {
      const deck = decks.find(d => d.id === deckId);
      for (const card of deck?.cards ?? []) {
        await supabase.from('deck_cards')
          .update({ is_commander: card.scryfallId === scryfallId })
          .eq('id', card.id);
      }
    }
  }

  async function updateCardQuantity(deckId, scryfallId, isSideboard, quantity) {
    if (quantity <= 0) { removeCardFromDeck(deckId, scryfallId, isSideboard); return; }
    const deck = decks.find(d => d.id === deckId);
    const card = deck?.cards.find(c => c.scryfallId === scryfallId && c.isSideboard === isSideboard);
    if (!card) return;

    setDecks(prev => prev.map(d =>
      d.id === deckId
        ? { ...d, cards: d.cards.map(c =>
            c.scryfallId === scryfallId && c.isSideboard === isSideboard ? { ...c, quantity } : c
          )}
        : d
    ));
    if (useSupabase) {
      await supabase.from('deck_cards').update({ quantity }).eq('id', card.id);
    }
  }

  return { decks, loading, createDeck, deleteDeck, renameDeck, addCardToDeck, removeCardFromDeck, setCommander, updateCardQuantity };
}
