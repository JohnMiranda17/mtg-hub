import { useState, useEffect } from 'react';

const KEY = 'mtg-hub:collection';

function load() {
  try { return JSON.parse(localStorage.getItem(KEY)) ?? []; }
  catch { return []; }
}

export function useCollection() {
  const [cards, setCards] = useState(load);

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(cards));
  }, [cards]);

  function addCard(card) {
    setCards(prev => {
      const existing = prev.find(
        c => c.scryfallId === card.scryfallId && c.foil === card.foil && c.condition === card.condition
      );
      if (existing) {
        return prev.map(c =>
          c.id === existing.id ? { ...c, quantity: c.quantity + card.quantity } : c
        );
      }
      return [...prev, { ...card, id: crypto.randomUUID(), addedAt: Date.now() }];
    });
  }

  function updateCard(id, updates) {
    setCards(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
  }

  function removeCard(id) {
    setCards(prev => prev.filter(c => c.id !== id));
  }

  function clearCollection() {
    setCards([]);
  }

  const totalCards = cards.reduce((sum, c) => sum + c.quantity, 0);
  const totalValue = cards.reduce((sum, c) => {
    const price = c.foil ? (c.priceFoil ?? c.price ?? 0) : (c.price ?? 0);
    return sum + price * c.quantity;
  }, 0);

  return { cards, addCard, updateCard, removeCard, clearCollection, totalCards, totalValue };
}
