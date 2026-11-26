export function Stat({ label, value }) {
  return (
    <div className="flex flex-col items-center gap-0.5 sm:items-start">
      <span className="text-lg font-bold leading-none text-ink sm:text-xl">{value}</span>
      <span className="text-[11px] font-medium uppercase tracking-wider text-muted">{label}</span>
    </div>
  );
}
