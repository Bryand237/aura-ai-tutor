export default function Loading() {
  return (
    <div className="flex h-full min-h-0 flex-col gap-6 overflow-hidden animate-pulse">
      <div className="rounded-3xl p-6 shadow-(--neu-raised)">
        <div className="h-7 w-56 rounded-xl bg-black/10" />
        <div className="mt-2 h-4 w-96 max-w-full rounded-xl bg-black/10" />
      </div>

      <div className="flex-1 min-h-0 overflow-hidden">
        <div className="grid h-full min-h-0 grid-cols-1 gap-6 overflow-hidden lg:grid-cols-12">
          <div className="lg:col-span-12">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="rounded-3xl p-6 shadow-(--neu-raised)">
                  <div className="h-14 w-14 rounded-2xl bg-black/10" />
                  <div className="mt-4 h-8 w-20 rounded-xl bg-black/10" />
                  <div className="mt-2 h-4 w-28 rounded-xl bg-black/10" />
                </div>
              ))}
            </div>
          </div>

          <div className="flex min-h-0 flex-col gap-6 overflow-hidden lg:col-span-7">
            <div className="rounded-3xl p-6 shadow-(--neu-raised)">
              <div className="h-5 w-48 rounded-xl bg-black/10" />
              <div className="mt-4 space-y-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="rounded-2xl p-4 shadow-(--neu-raised-sm)">
                    <div className="flex items-center justify-between gap-3">
                      <div className="h-4 w-40 rounded-xl bg-black/10" />
                      <div className="h-5 w-16 rounded-full bg-black/10" />
                    </div>
                    <div className="mt-3 h-3 w-full rounded-xl bg-black/10" />
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl p-6 shadow-(--neu-raised) flex min-h-0 flex-col overflow-hidden">
              <div className="h-5 w-44 rounded-xl bg-black/10" />
              <div className="mt-4 flex-1 min-h-0 grid grid-cols-7 gap-2 items-end">
                {Array.from({ length: 7 }).map((_, i) => (
                  <div key={i} className="h-24 rounded-2xl bg-black/10" />
                ))}
              </div>
            </div>
          </div>

          <div className="flex min-h-0 flex-col gap-6 overflow-hidden lg:col-span-5">
            <div className="rounded-3xl p-6 shadow-(--neu-raised)">
              <div className="h-5 w-36 rounded-xl bg-black/10" />
              <div className="mt-4 space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="rounded-2xl p-4 shadow-(--neu-raised-sm)">
                    <div className="flex items-center justify-between gap-3">
                      <div className="h-4 w-40 rounded-xl bg-black/10" />
                      <div className="h-4 w-16 rounded-xl bg-black/10" />
                    </div>
                    <div className="mt-3 h-3 w-full rounded-xl bg-black/10" />
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
