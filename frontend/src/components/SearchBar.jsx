import searchIcon from "../assets/search.svg";

export default function SearchBar({
  search,
  setSearch,
  selectedCount = 0,
  onRemoveSelected,
}) {
  return (
    <div className="d-flex justify-content-between align-items-center mb-3">
      <div className="input-group" style={{ maxWidth: "350px" }}>
        <input
          type="text"
          className="form-control"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <button
          type="button"
          className="btn btn-primary d-flex align-items-center justify-content-center"
          // purely cosmetic here (search is live on input change)
          onClick={() => {}}
        >
          <img src={searchIcon} alt="Search" width="16" height="16" />
        </button>
      </div>

      {selectedCount > 0 && (
        <button className="btn btn-danger" onClick={onRemoveSelected}>
          Remove selected
        </button>
      )}
    </div>
  );
}