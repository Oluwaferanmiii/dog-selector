export default function ConfirmModal({
  open,
  title = "Confirm",
  message = "",
  confirmText = "Confirm",
  cancelText = "Cancel",
  confirmVariant = "danger", // bootstrap: danger, primary, etc.
  onConfirm,
  onClose,
}) {
  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="modal-backdrop fade show"
        onClick={onClose}
        style={{ cursor: "pointer" }}
      />

      {/* Modal */}
      <div
        className="modal fade show"
        tabIndex="-1"
        role="dialog"
        style={{ display: "block" }}
        aria-modal="true"
      >
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content" style={{ borderRadius: 8 }}>
            <div className="modal-header">
              <h5 className="modal-title fw-semibold">{title}</h5>
              <button
                type="button"
                className="btn-close"
                aria-label="Close"
                onClick={onClose}
              />
            </div>

            <div className="modal-body">
              <p className="mb-0 text-muted">{message}</p>
            </div>

            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={onClose}>
                {cancelText}
              </button>

              <button
                className={`btn btn-${confirmVariant}`}
                onClick={onConfirm}
              >
                {confirmText}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}