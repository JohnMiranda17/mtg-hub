import { useState, useEffect } from 'react';

const KEY = 'mtg-hub:watchlist';

function load() {
  try { return JSON.parse(localStorage.getItem(KEY)) ?? []; }
  catch { return []; }
}

export function usePriceWatchlist() {
  const [watchlist, setWatchlist] = useState(load);

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(watchlist));
  }, [watchlist]);

  function addToWatchlist(card) {
    setWatchlist(prev => {
      if (prev.find(c => c.scryfallId === card.scryfallId)) return prev;
      return [...prev, { ...card, addedAt: Date.now() }];
    });
  }

  function removeFromWatchlist(scryfallId) {
    setWatchlist(prev => prev.filter(c => c.scryfallId !== scryfallId));
  }

  function isWatched(scryfallId) {
    return watchlist.some(c => c.scryfallId === scryfallId);
  }

  return { watchlist, addToWatchlist, removeFromWatchlist, isWatched };
}
