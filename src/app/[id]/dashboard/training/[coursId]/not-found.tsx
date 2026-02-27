import Link from "next/link";
import { GraduationCap } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex h-full min-h-0 items-center justify-center p-6">
      <div className="w-full max-w-xl rounded-3xl p-8 text-center shadow-(--neu-raised)">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl shadow-(--neu-pressed)">
          <GraduationCap className="h-6 w-6 text-emerald-600" />
        </div>
        <h1 className="mt-5 text-2xl font-bold">Cours introuvable</h1>
        <p className="mt-2 text-sm text-(--neu-text-muted)">
          Ce cours n&apos;existe pas ou tu n&apos;y as pas accès.
        </p>
        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="../"
            className="inline-flex items-center justify-center rounded-full px-5 py-2 text-sm font-semibold shadow-(--neu-raised-sm) no-underline"
          >
            Retour à l&apos;entraînement
          </Link>
        </div>
      </div>
    </div>
  );
}
