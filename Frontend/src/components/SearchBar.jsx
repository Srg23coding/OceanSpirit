import "./SearchBar.css";

function SearchBar({ onSearch }) {
  return (
    <div className="search">
      <input
        type="text"
        placeholder="Поиск по объявлениям"
        onChange={(e) => onSearch(e.target.value)}
      />
      <button>Поиск</button>
    </div>
  );
}

export default SearchBar;