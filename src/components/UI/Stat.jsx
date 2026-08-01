export function Stat({ label, value }) {
  return (
    <div className="flex flex-col items-center gap-0.5 sm:items-start">
      <span className="text-lg font-bold leading-none text-slate-900 sm:text-xl">{value}</span>
      <span className="text-[11px] font-medium uppercase tracking-wider text-slate-400">{label}</span>
    </div>
  );
}