export default function Loading() {
  return (
    <div className="flex h-full min-h-0 flex-col gap-6 overflow-hidden animate-pulse">
      <div className="rounded-3xl p-6 shadow-(--neu-raised)">
        <div className="h-7 w-80 max-w-full rounded-xl bg-black/10" />
        <div className="mt-2 h-4 w-96 max-w-full rounded-xl bg-black/10" />
      </div>

      <div className="flex-1 min-h-0 overflow-hidden">
        <div className="grid h-full min-h-0 grid-cols-1 gap-6 overflow-hidden lg:grid-cols-12">
          <div className="flex min-h-0 flex-col overflow-hidden lg:col-span-4 rounded-3xl shadow-(--neu-raised)">
            <div className="p-5 border-b border-black/5">
              <div className="h-5 w-44 rounded-xl bg-black/10" />
              <div className="mt-2 h-3 w-56 rounded-xl bg-black/10" />
            </div>
            <div className="flex-1 min-h-0 p-5 space-y-3 overflow-hidden">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="rounded-2xl p-4 shadow-(--neu-raised-sm)">
                  <div className="h-4 w-40 rounded-xl bg-black/10" />
                  <div className="mt-2 h-3 w-28 rounded-xl bg-black/10" />
                </div>
              ))}
            </div>
          </div>

          <div className="flex min-h-0 flex-col overflow-hidden lg:col-span-8 rounded-3xl shadow-(--neu-raised)">
            <div className="p-5 border-b border-black/5">
              <div className="h-5 w-48 rounded-xl bg-black/10" />
              <div className="mt-2 h-3 w-72 max-w-full rounded-xl bg-black/10" />
            </div>
            <div className="flex-1 min-h-0 p-5 space-y-4 overflow-hidden">
              <div className="h-44 w-full rounded-3xl bg-black/10" />
              <div className="flex gap-2">
                <div className="h-10 w-32 rounded-full bg-black/10" />
                <div className="h-10 w-32 rounded-full bg-black/10" />
              </div>
              <div className="h-3 w-56 rounded-xl bg-black/10" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
