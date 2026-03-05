import RatingStars from "./RatingStars";

export default function DogsTable({
  dogs,
  selectedIds,
  onToggleOne,
  onToggleAllVisible,
  allVisibleSelected,
  onRatingChange,
  onRemoveOne,
  onEditOne,
  sortKey,
  sortDir,
  onSort,
}) {
  function getStatusClass(status) {
    if (status === "accepted") return "badge bg-success";
    if (status === "rejected") return "badge bg-secondary";
    if (status === "pending") return "badge bg-warning text-dark";
    return "badge bg-light text-dark";
  }

  function SortIcon({ active, dir }) {
    return (
      <span className={`sort-icon ${active ? "active" : ""}`}>
        <span className={`chev up ${active && dir === "asc" ? "on" : ""}`}>▲</span>
        <span className={`chev down ${active && dir === "desc" ? "on" : ""}`}>▼</span>
      </span>
    );
  }

  return (
    <div className="table-responsive">
      <table className="table table-hover align-middle mb-0">
        <thead className="table-light">
          <tr>
            <th style={{ width: 40 }}>
              <input
                type="checkbox"
                checked={allVisibleSelected}
                onChange={onToggleAllVisible}
              />
            </th>
            <th
              role="button"
              onClick={() => onSort("status")}
              className="sortable-th"
            >
              <span className="th-content">
                Status <SortIcon active={sortKey === "status"} dir={sortDir} />
              </span>
            </th>

            <th
              role="button"
              onClick={() => onSort("breed__name")}
              className="sortable-th"
            >
              <span className="th-content">
                Breed <SortIcon active={sortKey === "breed__name"} dir={sortDir} />
              </span>
            </th>

            <th
              role="button"
              onClick={() => onSort("description__text")}
              className="sortable-th"
            >
              <span className="th-content">
                Description <SortIcon active={sortKey === "description__text"} dir={sortDir} />
              </span>
            </th>

            <th
              role="button"
              onClick={() => onSort("rating")}
              className="sortable-th"
            >
              <span className="th-content">
                Rating <SortIcon active={sortKey === "rating"} dir={sortDir} />
              </span>
            </th>
            <th>Note</th>
            <th style={{ width: 140 }}>Actions</th>
          </tr>
        </thead>

        <tbody>
          {dogs.map((dog) => (
            <tr key={dog.id}>
              <td>
                <input
                  type="checkbox"
                  checked={selectedIds.has(dog.id)}
                  onChange={() => onToggleOne(dog.id)}
                />
              </td>

              <td>
                <span className={getStatusClass(dog.status)}>{dog.status}</span>
              </td>

              <td>{dog.breed_name}</td>
              <td>{dog.description_text}</td>

              <td>
                <RatingStars
                  value={dog.rating ?? 0}
                  onChange={(val) => onRatingChange?.(dog.id, val)}
                />
              </td>

              <td>{dog.note}</td>

              <td>
                <span
                  role="button"
                  className="text-danger fw-semibold me-3"
                  onClick={() => onRemoveOne(dog.id)}
                >
                  Remove
                </span>

                <span
                  role="button"
                  className="text-primary fw-semibold"
                  onClick={() => onEditOne(dog.id)}
                >
                  Edit
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}