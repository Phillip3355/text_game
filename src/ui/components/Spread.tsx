/**
 * Two facing pages on wide screens (landscape phones, unfolded foldables,
 * tablets, desktop); a single column on portrait phones.
 *
 * On a single column both leaves dissolve (`display: contents`) and their
 * children are laid out by their `order-*` classes, so a screen can interleave
 * left- and right-page pieces in reading order, e.g. heading → photo → text.
 */
export function Spread({ left, right, className = '' }: { left: React.ReactNode; right: React.ReactNode; className?: string }) {
  return (
    <div className={`spread ${className}`}>
      <div className="leaf leaf-left">{left}</div>
      <div className="leaf leaf-right">{right}</div>
    </div>
  )
}

/** A top bar spanning both pages: label on the left, a back link on the right. */
export function TopBar({ label, back, onBack, extra }: { label: string; back: string; onBack: () => void; extra?: React.ReactNode }) {
  return (
    <div className="no-print mb-8 flex flex-wrap items-baseline justify-between gap-3 border-b border-rule pb-2 text-sm">
      <button className="link text-ink-soft" onClick={onBack}>
        ← {back}
      </button>
      <span className="flex items-baseline gap-5">
        {extra}
        <span className="small-caps text-ink-faint">{label}</span>
      </span>
    </div>
  )
}
