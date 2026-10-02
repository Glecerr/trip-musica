export default function Loading() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f4f2ed]">
      <div className="text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-black text-sm font-black text-white">
          TM
        </div>

        <div className="mx-auto mt-5 h-1 w-24 overflow-hidden rounded-full bg-black/10">
          <div className="h-full w-1/2 animate-pulse rounded-full bg-red-600" />
        </div>

        <p className="mt-4 text-xs font-black uppercase tracking-[0.2em] text-black/30">
          Trip Music
        </p>
      </div>
    </main>
  );
}