export function Detail({ icon, label, value }) {
  return (
    <div className="flex items-start gap-3 rounded-xl bg-beige/60 p-3">
      <span className="flex h-9 w-9 flex-none items-center justify-center rounded-lg bg-cream text-accent">
        {icon}
      </span>
      <div className="min-w-0">
        <p className="text-[11px] font-medium uppercase tracking-wider text-muted">{label}</p>
        <p className="truncate text-sm font-semibold text-ink">{value}</p>
      </div>
    </div>
  );
}
