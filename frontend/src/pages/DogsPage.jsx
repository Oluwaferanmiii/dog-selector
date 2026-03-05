import { useEffect, useMemo, useState } from "react";
import SearchBar from "../components/SearchBar";
import DogsTable from "../components/DogsTable";
import Pagination from "../components/Pagination";
import ConfirmModal from "../components/ConfirmModal";
import { useToast } from "../components/toast/ToastProvider";
import EditOffcanvas from "../components/EditOffcanvas";

export default function DogsPage() {
  const { showToast } = useToast();

  const [dogs, setDogs] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  // bulk selection
  const [selectedIds, setSelectedIds] = useState(new Set());

  // modal control
  const [removeModalOpen, setRemoveModalOpen] = useState(false);
  const [removeTarget, setRemoveTarget] = useState(null); // { type: "single"|"bulk", ids: [] }

  const [editOpen, setEditOpen] = useState(false);
  const [editingDog, setEditingDog] = useState(null);

  const [sortKey, setSortKey] = useState(""); 
  const [sortDir, setSortDir] = useState("asc");

  const ordering = sortKey ? (sortDir === "desc" ? `-${sortKey}` : sortKey) : "";

  const API_URL = `http://localhost:8000/api/dogs/?search=${search}&page=${page}&page_size=${pageSize}&ordering=${encodeURIComponent(ordering)}`;

  // If your API base differs, change here:
  const DOG_DETAIL_URL = (id) => `http://localhost:8000/api/dogs/${id}/`;

  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => {
        if (data && Array.isArray(data.results)) {
          setDogs(data.results);
          setTotalCount(data.count ?? 0);
          return;
        }
        if (Array.isArray(data)) {
          setDogs(data);
          setTotalCount(data.length);
          return;
        }
        console.error("Unexpected API response:", data);
        setDogs([]);
        setTotalCount(0);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setDogs([]);
        setTotalCount(0);
      });
  }, [search, page, pageSize, ordering]);

  // When data changes (pagination/search), clear selection so UI doesn’t get weird
  useEffect(() => {
    setSelectedIds(new Set());
  }, [dogs]);

  const selectedCount = selectedIds.size;

  const allVisibleSelected = useMemo(() => {
    if (!dogs.length) return false;
    return dogs.every((d) => selectedIds.has(d.id));
  }, [dogs, selectedIds]);

  function toggleOne(id) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleAllVisible() {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      const shouldSelectAll = !allVisibleSelected;

      if (shouldSelectAll) {
        dogs.forEach((d) => next.add(d.id));
      } else {
        dogs.forEach((d) => next.delete(d.id));
      }

      return next;
    });
  }

  // open modal (single)
  function requestRemoveOne(id) {
    setRemoveTarget({ type: "single", ids: [id] });
    setRemoveModalOpen(true);
  }

  // open modal (bulk)
  function requestRemoveSelected() {
    if (selectedIds.size === 0) return;
    setRemoveTarget({ type: "bulk", ids: Array.from(selectedIds) });
    setRemoveModalOpen(true);
  }

  async function doDelete(ids) {
    // run deletes in parallel
    const results = await Promise.all(
      ids.map(async (id) => {
        const res = await fetch(DOG_DETAIL_URL(id), { method: "DELETE" });
        return { id, ok: res.ok, status: res.status };
      })
    );

    const failed = results.filter((r) => !r.ok);

    if (failed.length) {
      showToast("Some items could not be removed.", "danger");
      console.error("Delete failed:", failed);
    } else {
      showToast("Option was removed", "danger");
    }

    // Optimistic UI update (remove deleted rows locally)
    const deletedIds = new Set(results.filter((r) => r.ok).map((r) => r.id));
    if (deletedIds.size) {
      setDogs((prev) => prev.filter((d) => !deletedIds.has(d.id)));
      setTotalCount((prev) => Math.max(0, prev - deletedIds.size));
      setSelectedIds(new Set());
    }
  }

  async function confirmRemove() {
    const ids = removeTarget?.ids ?? [];
    setRemoveModalOpen(false);
    setRemoveTarget(null);

    if (!ids.length) return;

    try {
      await doDelete(ids);
    } catch (e) {
      console.error(e);
      showToast("Something went wrong.", "danger");
    }
  }

  async function handleEditSave({ id, status, note }) {
    try {
      const res = await fetch(
        `http://localhost:8000/api/dogs/${id}/`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status, note }),
        }
      );

      if (!res.ok) {
        showToast("Failed to save changes.", "danger");
        return;
      }

      const updated = await res.json();

      setDogs((prev) =>
        prev.map((d) => (d.id === id ? updated : d))
      );

      showToast("Changes were saved", "success");

      setEditOpen(false);
      setEditingDog(null);
    } catch (e) {
      console.error(e);
      showToast("Something went wrong.", "danger");
    }
  }

  async function handleRatingChange(dogId, newRating) {
    setDogs((prev) =>
      prev.map((d) => (d.id === dogId ? { ...d, rating: newRating } : d))
    );

    try {
      const res = await fetch(`http://localhost:8000/api/dogs/${dogId}/`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating: newRating }),
      });

      if (!res.ok) {
        setDogs((prev) => prev); 
        showToast("Failed to update rating.", "danger");
        return;
      }

      const updated = await res.json();
      setDogs((prev) => prev.map((d) => (d.id === dogId ? updated : d)));

      showToast("Changes were saved", "success");
    } catch (e) {
      console.error(e);
      showToast("Something went wrong.", "danger");
    }
  }

  function handleSort(key) {
    setPage(1);

    // if clicking same column: toggle direction
    if (sortKey === key) {
      setSortDir((prev) => (prev === "asc" ? "desc" : "asc"));
      return;
    }

    // new column: set key and reset direction
    setSortKey(key);
    setSortDir("asc");
  }

  return (
    <>
      <div className="container py-4" style={{ maxWidth: "1100px" }}>
        <SearchBar
          search={search}
          setSearch={setSearch}
          selectedCount={selectedCount}
          onRemoveSelected={requestRemoveSelected}
        />

        <div className="bg-white border rounded shadow-sm overflow-hidden">
          <DogsTable
            dogs={dogs}
            selectedIds={selectedIds}
            onToggleOne={toggleOne}
            onToggleAllVisible={toggleAllVisible}
            allVisibleSelected={allVisibleSelected}
            onRatingChange={handleRatingChange}
            onRemoveOne={requestRemoveOne}
            onEditOne={(id) => {
              const dog = dogs.find((d) => d.id === id);
              setEditingDog(dog);
              setEditOpen(true);
            }}
            sortKey={sortKey}
            sortDir={sortDir}
            onSort={handleSort}
          />

          <div className="px-3 pb-3">
            <Pagination
              page={page}
              setPage={setPage}
              pageSize={pageSize}
              setPageSize={setPageSize}
              totalCount={totalCount}
            />
          </div>
        </div>
      </div>

      <ConfirmModal
        open={removeModalOpen}
        title="You are about to remove this option."
        message="Once you remove this option the action is irreversible. Do you want to continue?"
        confirmText="Remove"
        cancelText="Cancel"
        confirmVariant="danger"
        onClose={() => {
          setRemoveModalOpen(false);
          setRemoveTarget(null);
        }}
        onConfirm={confirmRemove}
      />

      <EditOffcanvas
        open={editOpen}
        dog={editingDog}
        onClose={() => {
          setEditOpen(false);
          setEditingDog(null);
        }}
        onSave={handleEditSave}
      />
    </>
  );
}