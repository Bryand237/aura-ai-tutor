export default function Loading() {
  return (
    <div className="flex h-full min-h-0 flex-col gap-6 overflow-hidden animate-pulse">
      <div className="rounded-3xl p-6 shadow-(--neu-raised)">
        <div className="h-7 w-56 rounded-xl bg-black/10" />
        <div className="mt-2 h-4 w-96 max-w-full rounded-xl bg-black/10" />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-3xl p-6 shadow-(--neu-raised)">
            <div className="h-5 w-48 rounded-xl bg-black/10" />
            <div className="mt-3 h-3 w-64 max-w-full rounded-xl bg-black/10" />
            <div className="mt-4 h-10 w-40 rounded-full bg-black/10" />
          </div>
        ))}
      </div>
    </div>
  );
}
