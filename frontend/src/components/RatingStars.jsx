import starFull from "../assets/star-full.svg";
import starHalf from "../assets/star-half.svg";
import starEmpty from "../assets/star-empty.svg";

export default function RatingStars({
  value = 0,
  onChange,          // optional: if provided, becomes editable
  size = 18,
  disabled = false,
}) {
  const editable = typeof onChange === "function" && !disabled;

  function handleClick(i) {
    if (!editable) return;

    // click the current rating again => reset to 0 (default)
    const next = i === value ? 0 : i;
    onChange(next);
  }

  function iconFor(i) {
    // supports half values if you ever store them (e.g. 3.5)
    if (value >= i) return starFull;
    if (value >= i - 0.5) return starHalf;
    return starEmpty;
  }

  return (
    <div className="d-inline-flex align-items-center gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <img
          key={i}
          src={iconFor(i)}
          alt={`${i} star`}
          width={size}
          height={size}
          role={editable ? "button" : undefined}
          style={{
            cursor: editable ? "pointer" : "default",
            userSelect: "none",
          }}
          onClick={() => handleClick(i)}
          onKeyDown={(e) => {
            if (!editable) return;
            if (e.key === "Enter" || e.key === " ") handleClick(i);
          }}
          tabIndex={editable ? 0 : -1}
        />
      ))}
    </div>
  );
}