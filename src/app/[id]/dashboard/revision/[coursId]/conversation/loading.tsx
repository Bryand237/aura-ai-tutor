export default function Loading() {
  return (
    <div className="grid h-full min-h-0 grid-cols-1 gap-4 overflow-hidden animate-pulse lg:grid-cols-[360px_1fr]">
      <section className="rounded-3xl shadow-(--neu-raised) min-h-0 flex flex-col overflow-hidden">
        <div className="p-5 border-b border-black/5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="h-5 w-32 rounded-xl bg-black/10" />
              <div className="mt-2 h-3 w-56 rounded-xl bg-black/10" />
            </div>
            <div className="h-6 w-10 rounded-full bg-black/10" />
          </div>
        </div>
        <div className="p-5 min-h-0 flex flex-col gap-6 overflow-hidden">
          <div className="space-y-3">
            <div className="h-10 w-full rounded-2xl bg-black/10" />
            <div className="h-9 w-full rounded-full bg-black/10" />
          </div>
          <div className="flex-1 min-h-0 space-y-3 overflow-hidden">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-2xl p-4 shadow-(--neu-raised-sm)">
                <div className="h-4 w-40 rounded-xl bg-black/10" />
                <div className="mt-2 h-3 w-28 rounded-xl bg-black/10" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-3xl shadow-(--neu-raised) min-h-0 flex flex-col overflow-hidden">
        <div className="p-5 border-b border-black/5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="h-5 w-24 rounded-xl bg-black/10" />
              <div className="mt-2 h-3 w-72 max-w-full rounded-xl bg-black/10" />
            </div>
            <div className="h-9 w-28 rounded-full bg-black/10" />
          </div>
        </div>
        <div className="flex-1 min-h-0 p-5 space-y-3 overflow-hidden">
          {Array.from({ length: 7 }).map((_, i) => (
            <div
              key={i}
              className={`flex ${i % 2 === 0 ? "justify-start" : "justify-end"}`}
            >
              <div className="w-3/4 rounded-2xl p-4 shadow-(--neu-raised-sm)">
                <div className="h-4 w-64 max-w-full rounded-xl bg-black/10" />
                <div className="mt-2 h-3 w-20 rounded-xl bg-black/10" />
              </div>
            </div>
          ))}
        </div>
        <div className="p-5">
          <div className="flex flex-col gap-3 md:flex-row">
            <div className="h-14 w-full rounded-2xl bg-black/10" />
            <div className="h-12 w-32 rounded-full bg-black/10" />
          </div>
        </div>
      </section>
    </div>
  );
}
