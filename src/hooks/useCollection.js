import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

const LS_KEY = 'mtg-hub:collection';

function loadLocal() {
  try { return JSON.parse(localStorage.getItem(LS_KEY)) ?? []; }
  catch { return []; }
}

function toLocal(dbRow) {
  return {
    id:         dbRow.id,
    name:       dbRow.name,
    scryfallId: dbRow.scryfall_id,
    setCode:    dbRow.set_code,
    setName:    dbRow.set_name,
    typeLine:   dbRow.type_line,
    manaCost:   dbRow.mana_cost,
    imageUri:   dbRow.image_uri,
    price:      dbRow.price ? parseFloat(dbRow.price) : null,
    priceFoil:  dbRow.price_foil ? parseFloat(dbRow.price_foil) : null,
    quantity:   dbRow.quantity,
    condition:  dbRow.condition,
    foil:       dbRow.foil,
    forTrade:   dbRow.for_trade,
    tradeNote:  dbRow.trade_note,
    addedAt:    new Date(dbRow.added_at).getTime(),
  };
}

function toDb(card, userId) {
  return {
    user_id:     userId,
    name:        card.name,
    scryfall_id: card.scryfallId,
    set_code:    card.setCode,
    set_name:    card.setName,
    type_line:   card.typeLine,
    mana_cost:   card.manaCost,
    image_uri:   card.imageUri,
    price:       card.price,
    price_foil:  card.priceFoil,
    quantity:    card.quantity,
    condition:   card.condition,
    foil:        card.foil ?? false,
    for_trade:   card.forTrade ?? false,
    trade_note:  card.tradeNote ?? null,
  };
}

async function logActivity(userId, type, card, qty) {
  if (!supabase) return;
  await supabase.from('activities').insert({
    user_id:        userId,
    type,
    card_name:      card.name,
    card_image_uri: card.imageUri ?? card.image_uri,
    quantity:       qty ?? card.quantity,
  }).catch(() => {});
}

export function useCollection() {
  // Safely access AuthContext — may be null if AuthProvider isn't mounted yet
  const auth = useContext(AuthContext);
  const user = auth?.user ?? null;

  const [cards, setCards]   = useState([]);
  const [loading, setLoading] = useState(true);

  // Load on mount + when auth changes
  useEffect(() => {
    if (user && supabase) {
      loadFromSupabase();
    } else {
      setCards(loadLocal());
      setLoading(false);
    }
  }, [user?.id]);

  // Persist to localStorage when not using Supabase
  useEffect(() => {
    if (!user || !supabase) {
      localStorage.setItem(LS_KEY, JSON.stringify(cards));
    }
  }, [cards, user]);

  async function loadFromSupabase() {
    setLoading(true);
    const { data } = await supabase
      .from('collection_cards')
      .select('*')
      .eq('user_id', user.id)
      .order('added_at', { ascending: false });
    setCards((data ?? []).map(toLocal));
    setLoading(false);
  }

  // ── mutations ────────────────────────────────────────────────────────────

  async function addCard(card) {
    const newCard = { ...card, forTrade: card.forTrade ?? false };

    if (user && supabase) {
      // Check for duplicate (same scryfallId + foil + condition)
      const existing = cards.find(
        c => c.scryfallId === card.scryfallId && c.foil === card.foil && c.condition === card.condition
      );
      if (existing) {
        const qty = existing.quantity + card.quantity;
        await supabase.from('collection_cards').update({ quantity: qty }).eq('id', existing.id);
        setCards(prev => prev.map(c => c.id === existing.id ? { ...c, quantity: qty } : c));
      } else {
        const { data } = await supabase.from('collection_cards').insert(toDb(newCard, user.id)).select().single();
        if (data) {
          setCards(prev => [toLocal(data), ...prev]);
          await logActivity(user.id, 'card_added', data, data.quantity);
        }
      }
    } else {
      setCards(prev => {
        const existing = prev.find(
          c => c.scryfallId === card.scryfallId && c.foil === card.foil && c.condition === card.condition
        );
        if (existing) {
          return prev.map(c => c.id === existing.id ? { ...c, quantity: c.quantity + card.quantity } : c);
        }
        return [{ ...newCard, id: crypto.randomUUID(), addedAt: Date.now() }, ...prev];
      });
    }
  }

  async function updateCard(id, updates) {
    // Map JS camelCase fields to DB snake_case for Supabase
    const dbUpdates = {};
    if ('quantity'  in updates) dbUpdates.quantity  = updates.quantity;
    if ('condition' in updates) dbUpdates.condition = updates.condition;
    if ('foil'      in updates) dbUpdates.foil      = updates.foil;
    if ('forTrade'  in updates) { dbUpdates.for_trade  = updates.forTrade; }
    if ('tradeNote' in updates) { dbUpdates.trade_note = updates.tradeNote; }
    if ('scryfallId' in updates) { dbUpdates.scryfall_id = updates.scryfallId; }
    if ('setCode'   in updates) dbUpdates.set_code   = updates.setCode;
    if ('setName'   in updates) dbUpdates.set_name   = updates.setName;
    if ('imageUri'  in updates) dbUpdates.image_uri  = updates.imageUri;
    if ('price'     in updates) dbUpdates.price      = updates.price;
    if ('priceFoil' in updates) dbUpdates.price_foil = updates.priceFoil;

    // Optimistic local update
    setCards(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));

    if (user && supabase && Object.keys(dbUpdates).length) {
      await supabase.from('collection_cards').update(dbUpdates).eq('id', id);

      // If marked for trade, create/update a trade listing
      if ('forTrade' in updates) {
        const card = cards.find(c => c.id === id);
        if (card) {
          if (updates.forTrade) {
            const { data: listing } = await supabase.from('trade_listings').insert({
              user_id:           user.id,
              collection_card_id: id,
              card_name:         card.name,
              scryfall_id:       card.scryfallId,
              set_name:          card.setName,
              image_uri:         card.imageUri,
              quantity:          card.quantity,
              condition:         card.condition,
              foil:              card.foil,
            }).select().single().catch(() => ({}));
            if (listing?.data) {
              await logActivity(user.id, 'trade_listed', card, card.quantity);
            }
          } else {
            // Retract trade listing
            await supabase.from('trade_listings')
              .update({ status: 'cancelled' })
              .eq('collection_card_id', id)
              .eq('status', 'available');
          }
        }
      }
    }
  }

  async function removeCard(id) {
    setCards(prev => prev.filter(c => c.id !== id));
    if (user && supabase) {
      await supabase.from('collection_cards').delete().eq('id', id);
    }
  }

  async function importCards(newCards) {
    if (user && supabase) {
      const rows = newCards.map(c => toDb({ ...c, forTrade: false }, user.id));
      const { data } = await supabase.from('collection_cards').insert(rows).select();
      if (data) {
        setCards(prev => [...(data.map(toLocal)), ...prev]);
        if (data.length > 0) {
          // Log a single bulk-add activity
          await logActivity(user.id, 'card_added', { name: `${data.length} cards`, imageUri: data[0]?.image_uri }, data.length);
        }
      }
    } else {
      setCards(prev => {
        let updated = [...prev];
        for (const card of newCards) {
          const existing = updated.find(
            c => c.scryfallId === card.scryfallId && c.foil === card.foil && c.condition === card.condition
          );
          if (existing) {
            updated = updated.map(c =>
              c.id === existing.id ? { ...c, quantity: c.quantity + card.quantity } : c
            );
          } else {
            updated.push({ ...card, forTrade: false, id: crypto.randomUUID(), addedAt: Date.now() });
          }
        }
        return updated;
      });
    }
  }

  function clearCollection() { setCards([]); }

  const totalCards = cards.reduce((s, c) => s + c.quantity, 0);
  const totalValue = cards.reduce((s, c) => {
    const p = c.foil ? (c.priceFoil ?? c.price ?? 0) : (c.price ?? 0);
    return s + p * c.quantity;
  }, 0);

  return { cards, loading, addCard, updateCard, removeCard, importCards, clearCollection, totalCards, totalValue };
}
