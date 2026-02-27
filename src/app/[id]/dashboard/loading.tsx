export default function Loading() {
  return (
    <div className="flex h-full min-h-0 flex-col gap-6 overflow-hidden animate-pulse">
      <div className="rounded-3xl p-6 shadow-(--neu-raised)">
        <div className="h-7 w-64 rounded-xl bg-black/10" />
        <div className="mt-3 h-4 w-96 max-w-full rounded-xl bg-black/10" />
        <div className="mt-4 flex flex-wrap gap-2">
          <div className="h-9 w-28 rounded-full bg-black/10" />
          <div className="h-9 w-44 rounded-full bg-black/10" />
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-hidden">
        <div className="grid h-full min-h-0 grid-cols-1 gap-6 overflow-hidden lg:grid-cols-12">
          <div className="lg:col-span-12">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="rounded-3xl p-6 shadow-(--neu-raised)">
                  <div className="h-14 w-14 rounded-2xl bg-black/10" />
                  <div className="mt-4 h-8 w-16 rounded-xl bg-black/10" />
                  <div className="mt-2 h-4 w-24 rounded-xl bg-black/10" />
                </div>
              ))}
            </div>
          </div>

          <div className="flex min-h-0 flex-col gap-6 overflow-hidden lg:col-span-4">
            <div className="rounded-3xl p-6 shadow-(--neu-raised)">
              <div className="h-5 w-32 rounded-xl bg-black/10" />
              <div className="mt-4 grid grid-cols-2 gap-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="rounded-2xl p-4 shadow-(--neu-raised-sm)">
                    <div className="h-5 w-5 rounded bg-black/10" />
                    <div className="mt-3 h-4 w-24 rounded-xl bg-black/10" />
                    <div className="mt-2 h-3 w-20 rounded-xl bg-black/10" />
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl p-6 shadow-(--neu-raised)">
              <div className="h-5 w-40 rounded-xl bg-black/10" />
              <div className="mt-4 space-y-3">
                {Array.from({ length: 2 }).map((_, i) => (
                  <div key={i} className="rounded-2xl p-4 shadow-(--neu-raised-sm)">
                    <div className="h-4 w-44 rounded-xl bg-black/10" />
                    <div className="mt-2 h-3 w-64 max-w-full rounded-xl bg-black/10" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex min-h-0 flex-col gap-6 overflow-hidden lg:col-span-8">
            <div className="rounded-3xl p-6 shadow-(--neu-raised) flex min-h-0 flex-col overflow-hidden">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="h-5 w-36 rounded-xl bg-black/10" />
                  <div className="mt-2 h-3 w-64 max-w-full rounded-xl bg-black/10" />
                </div>
                <div className="h-6 w-10 rounded-full bg-black/10" />
              </div>

              <div className="mt-5 flex-1 min-h-0 space-y-3 overflow-hidden">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="rounded-2xl p-4 shadow-(--neu-raised-sm)">
                    <div className="h-4 w-52 rounded-xl bg-black/10" />
                    <div className="mt-2 h-3 w-28 rounded-xl bg-black/10" />
                  </div>
                ))}
              </div>

              <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2">
                {Array.from({ length: 2 }).map((_, i) => (
                  <div key={i} className="rounded-2xl p-4 shadow-(--neu-raised-sm)">
                    <div className="h-4 w-44 rounded-xl bg-black/10" />
                    <div className="mt-2 h-3 w-60 max-w-full rounded-xl bg-black/10" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
