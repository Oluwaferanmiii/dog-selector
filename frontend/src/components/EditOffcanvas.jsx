import { useEffect, useState } from "react";

export default function EditOffcanvas({
  open,
  dog,
  onClose,
  onSave,
}) {
  const [status, setStatus] = useState("pending");
  const [note, setNote] = useState("");
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    if (dog) {
      setStatus(dog.status);
      setNote(dog.note ?? "");
      setTouched(false);
    }
  }, [dog]);

  if (!open || !dog) return null;

  const isInvalid = touched && !note.trim();

  function handleSave() {
    setTouched(true);

    if (!note.trim()) return;

    onSave({
      id: dog.id,
      status,
      note,
    });
  }

  return (
    <>
      {/* backdrop */}
      <div
        className="offcanvas-backdrop fade show"
        onClick={onClose}
      />

      <div
        className="offcanvas offcanvas-end show"
        style={{ visibility: "visible", width: 420 }}
      >
        <div className="offcanvas-header">
          <h5 className="offcanvas-title fw-semibold">Edit</h5>
          <button
            type="button"
            className="btn-close"
            onClick={onClose}
          />
        </div>

        <div className="offcanvas-body">

          {/* Breed + Description (read only) */}
          <div className="bg-light rounded p-3 mb-4">
            <div className="mb-2">
              <strong>Breed</strong>
              <div>{dog.breed_name}</div>
            </div>
            <div>
              <strong>Description</strong>
              <div>{dog.description_text}</div>
            </div>
          </div>

          {/* Status change */}
          <div className="mb-4">
            <label className="form-label fw-semibold">
              Change status
            </label>

            <div className="form-check">
              <input
                type="radio"
                className="form-check-input"
                checked={status === "pending"}
                onChange={() => setStatus("pending")}
              />
              <label className="form-check-label">Pending</label>
            </div>

            <div className="form-check">
              <input
                type="radio"
                className="form-check-input"
                checked={status === "accepted"}
                onChange={() => setStatus("accepted")}
              />
              <label className="form-check-label">Approved</label>
            </div>

            <div className="form-check">
              <input
                type="radio"
                className="form-check-input"
                checked={status === "rejected"}
                onChange={() => setStatus("rejected")}
              />
              <label className="form-check-label">Rejected</label>
            </div>
          </div>

          {/* NOTE - REQUIRED */}
          <div className="mb-3">
            <label className="form-label fw-semibold">
              Note – Why did you change status?*
            </label>

            <textarea
              className={`form-control ${isInvalid ? "is-invalid" : ""}`}
              rows={4}
              placeholder="Type here"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              onBlur={() => setTouched(true)}
            />

            {isInvalid && (
              <div className="invalid-feedback d-block">
                Mandatory field cannot stay empty.
              </div>
            )}
          </div>

          <button
            className="btn btn-primary"
            onClick={handleSave}
          >
            Save changes
          </button>
        </div>
      </div>
    </>
  );
}