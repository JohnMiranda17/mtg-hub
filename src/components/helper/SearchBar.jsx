export default function SearchBar({ value, onChange, resultCount }) {
  return (
    <div className="search-wrapper">
      <div className="search-box">
        <span className="search-icon">🔍</span>
        <input
          type="text"
          placeholder="Search keywords, abilities, card types, rules…"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="search-input"
          autoFocus
        />
        {value && (
          <button className="search-clear" onClick={() => onChange("")}>
            ✕
          </button>
        )}
      </div>
      {value && (
        <p className="search-result-count">
          {resultCount === 0
            ? "No results found — try a different term"
            : `${resultCount} result${resultCount !== 1 ? "s" : ""} for "${value}"`}
        </p>
      )}
    </div>
  );
}
