export default function Loading() {
  return (
    <div className="flex h-full min-h-0 flex-col gap-6 overflow-hidden animate-pulse">
      <div className="rounded-3xl p-6 shadow-(--neu-raised)">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="h-24 w-24 rounded-full bg-black/10" />
            <div>
              <div className="h-6 w-56 max-w-full rounded-xl bg-black/10" />
              <div className="mt-2 h-4 w-72 max-w-full rounded-xl bg-black/10" />
            </div>
          </div>
          <div className="h-10 w-28 rounded-full bg-black/10" />
        </div>
        <div className="mt-6 grid grid-cols-3 gap-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-2xl p-4 shadow-(--neu-raised-sm)">
              <div className="h-7 w-16 rounded-xl bg-black/10" />
              <div className="mt-2 h-3 w-20 rounded-xl bg-black/10" />
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-hidden">
        <div className="grid h-full min-h-0 grid-cols-1 gap-6 overflow-hidden lg:grid-cols-12">
          <div className="flex min-h-0 flex-col gap-6 overflow-hidden lg:col-span-4">
            <div className="rounded-3xl p-6 shadow-(--neu-raised)">
              <div className="h-5 w-28 rounded-xl bg-black/10" />
              <div className="mt-4 flex flex-wrap justify-center gap-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="h-12 w-12 rounded-2xl bg-black/10 shadow-(--neu-raised-sm)" />
                ))}
              </div>
            </div>
          </div>

          <div className="flex min-h-0 flex-col gap-6 overflow-hidden lg:col-span-8">
            <div className="rounded-3xl p-6 shadow-(--neu-raised)">
              <div className="h-5 w-40 rounded-xl bg-black/10" />
              <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="rounded-3xl p-6 shadow-(--neu-raised-sm)">
                    <div className="h-5 w-44 rounded-xl bg-black/10" />
                    <div className="mt-3 h-3 w-64 max-w-full rounded-xl bg-black/10" />
                    <div className="mt-4 h-3 w-full rounded-xl bg-black/10" />
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl p-6 shadow-(--neu-raised) flex min-h-0 flex-col overflow-hidden">
              <div className="h-5 w-44 rounded-xl bg-black/10" />
              <div className="mt-4 flex-1 min-h-0 space-y-3 overflow-hidden">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="h-10 w-full rounded-2xl bg-black/10" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
