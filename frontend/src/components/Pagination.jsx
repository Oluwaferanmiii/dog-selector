import { useMemo, useState } from "react";

function getTotalPages(totalCount, pageSize) {
  return Math.max(1, Math.ceil(totalCount / pageSize));
}

function buildPages(current, total) {
  // Figma-like compact pagination: 1 ... (window) ... total
  const pages = [];
  const windowSize = 3; // pages around current

  const start = Math.max(1, current - windowSize);
  const end = Math.min(total, current + windowSize);

  pages.push(1);

  if (start > 2) pages.push("...");

  for (let p = start; p <= end; p++) {
    if (p !== 1 && p !== total) pages.push(p);
  }

  if (end < total - 1) pages.push("...");

  if (total !== 1) pages.push(total);

  // remove duplicates (can happen near edges)
  return pages.filter((v, i, arr) => arr.indexOf(v) === i);
}

export default function Pagination({
  page,
  setPage,
  pageSize,
  setPageSize,
  totalCount,
}) {
  const [goToValue, setGoToValue] = useState("");

  const totalPages = useMemo(
    () => getTotalPages(totalCount, pageSize),
    [totalCount, pageSize]
  );

  const pages = useMemo(
    () => buildPages(page, totalPages),
    [page, totalPages]
  );

  function prev() {
    setPage((p) => Math.max(1, p - 1));
  }

  function next() {
    setPage((p) => Math.min(totalPages, p + 1));
  }

  function submitGoTo(e) {
    e.preventDefault();
    const n = parseInt(goToValue, 10);
    if (!Number.isNaN(n)) {
      setPage(Math.min(Math.max(1, n), totalPages));
    }
    setGoToValue("");
  }

  return (
    <div className="d-flex justify-content-center mt-4">

        <div className="d-flex align-items-center gap-4 flex-wrap">

        {/* Total items */}
        <div className="text-muted small">
            Total {totalCount} items
        </div>

        {/* Page numbers */}
        <nav>
            <ul className="pagination mb-0">
            <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
                <button className="page-link" onClick={prev}>
                ‹
                </button>
            </li>

            {pages.map((p, idx) =>
                p === "..." ? (
                <li key={`dots-${idx}`} className="page-item disabled">
                    <span className="page-link">…</span>
                </li>
                ) : (
                <li key={p} className={`page-item ${p === page ? "active" : ""}`}>
                    <button className="page-link" onClick={() => setPage(p)}>
                    {p}
                    </button>
                </li>
                )
            )}

            <li className={`page-item ${page === totalPages ? "disabled" : ""}`}>
                <button className="page-link" onClick={next}>
                ›
                </button>
            </li>
            </ul>
        </nav>

        {/* Page size */}
        <select
            className="form-select form-select-sm"
            style={{ width: 110 }}
            value={pageSize}
            onChange={(e) => {
            setPage(1);
            setPageSize(parseInt(e.target.value, 10));
            }}
        >
            <option value={10}>10 / page</option>
            <option value={20}>20 / page</option>
            <option value={50}>50 / page</option>
        </select>

        {/* Go to */}
        <form onSubmit={submitGoTo} className="d-flex align-items-center gap-2">
            <span className="small text-muted">Go to</span>
            <input
            className="form-control form-control-sm"
            style={{ width: 70 }}
            value={goToValue}
            onChange={(e) => setGoToValue(e.target.value)}
            />
        </form>

        </div>
    </div>
    );
}