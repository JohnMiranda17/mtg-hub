import { useState, useEffect, useRef } from 'react';
import { autocomplete } from '../utils/scryfall';

export default function CardSearchInput({ value, onChange, onSelect, placeholder = 'Search for a card…' }) {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const debounce = useRef(null);

  useEffect(() => {
    clearTimeout(debounce.current);
    if (!value || value.length < 2) { setSuggestions([]); setOpen(false); return; }
    setLoading(true);
    debounce.current = setTimeout(async () => {
      try {
        const results = await autocomplete(value);
        setSuggestions(results.slice(0, 20));
        setOpen(results.length > 0);
      } catch { setSuggestions([]); }
      finally { setLoading(false); }
    }, 200);
  }, [value]);

  function handleSelect(name) {
    onChange(name);
    setSuggestions([]);
    setOpen(false);
    onSelect?.(name);
  }

  return (
    <div className="card-search-wrap">
      <div className="card-search-box">
        <input
          className="card-search-input"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete="off"
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          onFocus={() => suggestions.length > 0 && setOpen(true)}
        />
        {loading && <span className="card-search-spinner">⟳</span>}
      </div>
      {open && (
        <ul className="card-search-dropdown">
          {suggestions.map(name => (
            <li key={name} className="card-search-option" onMouseDown={() => handleSelect(name)}>
              {name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
