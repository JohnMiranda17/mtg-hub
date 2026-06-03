import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

const LS_KEY = 'mtg-hub:binders';

function loadLocal() {
  try { return JSON.parse(localStorage.getItem(LS_KEY)) ?? []; }
  catch { return []; }
}

function saveLocal(binders) {
  localStorage.setItem(LS_KEY, JSON.stringify(binders));
}

// ── Supabase helpers ──────────────────────────────────────────────────────────

async function sbLoadBinders(userId) {
  const { data: bRows } = await supabase
    .from('binders')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: true });

  if (!bRows?.length) return [];

  const binderIds = bRows.map(b => b.id);
  const { data: cRows } = await supabase
    .from('binder_cards')
    .select('*')
    .in('binder_id', binderIds);

  const cardsByBinder = {};
  for (const c of cRows ?? []) {
    if (!cardsByBinder[c.binder_id]) cardsByBinder[c.binder_id] = [];
    cardsByBinder[c.binder_id].push({
      id:         c.id,
      scryfallId: c.scryfall_id,
      cardName:   c.card_name,
      imageUri:   c.image_uri,
      quantity:   c.quantity,
    });
  }

  return bRows.map(b => ({
    id:          b.id,
    name:        b.name,
    description: b.description,
    color:       b.color,
    createdAt:   b.created_at,
    cards:       cardsByBinder[b.id] ?? [],
  }));
}

export function useBinders() {
  const auth   = useContext(AuthContext);
  const user   = auth?.user ?? null;

  const [binders, setBinders] = useState([]);
  const [loading, setLoading] = useState(true);

  const useSupabase = !!(user && supabase);

  useEffect(() => {
    if (useSupabase) {
      setLoading(true);
      sbLoadBinders(user.id).then(data => { setBinders(data); setLoading(false); });
    } else {
      setBinders(loadLocal());
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    if (!useSupabase) saveLocal(binders);
  }, [binders, useSupabase]);

  // ── mutations ──────────────────────────────────────────────────────────────

  async function createBinder({ name, description = '', color = '#4a8fc9' }) {
    if (useSupabase) {
      const { data } = await supabase.from('binders')
        .insert({ user_id: user.id, name, description, color })
        .select().single();
      if (data) setBinders(prev => [...prev, { ...data, cards: [] }]);
    } else {
      const b = { id: crypto.randomUUID(), name, description, color, createdAt: new Date().toISOString(), cards: [] };
      setBinders(prev => [...prev, b]);
    }
  }

  async function deleteBinder(binderId) {
    setBinders(prev => prev.filter(b => b.id !== binderId));
    if (useSupabase) {
      await supabase.from('binders').delete().eq('id', binderId);
    }
  }

  async function renameBinder(binderId, name) {
    setBinders(prev => prev.map(b => b.id === binderId ? { ...b, name } : b));
    if (useSupabase) {
      await supabase.from('binders').update({ name }).eq('id', binderId);
    }
  }

  async function addCardToBinder(binderId, { scryfallId, cardName, imageUri, quantity = 1 }) {
    const binder = binders.find(b => b.id === binderId);
    if (!binder) return;

    const existing = binder.cards.find(c => c.scryfallId === scryfallId);

    if (existing) {
      const qty = existing.quantity + quantity;
      setBinders(prev => prev.map(b =>
        b.id === binderId
          ? { ...b, cards: b.cards.map(c => c.scryfallId === scryfallId ? { ...c, quantity: qty } : c) }
          : b
      ));
      if (useSupabase) {
        await supabase.from('binder_cards').update({ quantity: qty }).eq('id', existing.id);
      }
    } else {
      if (useSupabase) {
        const { data } = await supabase.from('binder_cards')
          .insert({ binder_id: binderId, scryfall_id: scryfallId, card_name: cardName, image_uri: imageUri, quantity })
          .select().single();
        if (data) {
          setBinders(prev => prev.map(b =>
            b.id === binderId
              ? { ...b, cards: [...b.cards, { id: data.id, scryfallId, cardName, imageUri, quantity }] }
              : b
          ));
        }
      } else {
        const card = { id: crypto.randomUUID(), scryfallId, cardName, imageUri, quantity };
        setBinders(prev => prev.map(b =>
          b.id === binderId ? { ...b, cards: [...b.cards, card] } : b
        ));
      }
    }
  }

  async function removeCardFromBinder(binderId, scryfallId) {
    const binder = binders.find(b => b.id === binderId);
    const card   = binder?.cards.find(c => c.scryfallId === scryfallId);
    if (!card) return;

    setBinders(prev => prev.map(b =>
      b.id === binderId ? { ...b, cards: b.cards.filter(c => c.scryfallId !== scryfallId) } : b
    ));
    if (useSupabase) {
      await supabase.from('binder_cards').delete().eq('id', card.id);
    }
  }

  return { binders, loading, createBinder, deleteBinder, renameBinder, addCardToBinder, removeCardFromBinder };
}
