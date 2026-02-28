import { PowerIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import NavLinks from "./nav-links";

import styles from "./side-nav.module.css";
import { signOut } from "../../../../auth";

export default function Sidenav() {
  return (
    <aside className={`flex h-full flex-col px-3 py-4 md:px-4 ${styles.aside}`}>
      <div className={`mb-2 p-10 ${styles.brandCard}`}>
        <Link href={"/"}>
          <div
            className={`m-auto flex h-12 w-12 items-center justify-center gap-2 rounded-xl ${styles.brandLogo}`}
          >
            <div className={styles.brandLogoInner}>
              <Image
                src="/android-chrome-192x192.png"
                alt="Aura AI"
                fill
                sizes="48px"
                className="object-cover scale-110"
                priority
              />
            </div>
          </div>
          <p className="font-bold text-center">Aura AI</p>
        </Link>
      </div>

      <div className="flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2">
        <NavLinks />
        <div
          className={`hidden h-auto w-full grow md:block ${styles.spacer}`}
        ></div>
        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/" });
          }}
        >
          <button
            className={`flex h-12 w-full grow items-center justify-center gap-2 p-3 text-sm font-medium md:flex-none md:justify-start md:p-2 md:px-3 ${styles.actionBtn}`}
          >
            <PowerIcon className="w-6" />
            <div className="hidden md:block">Sign Out</div>
          </button>
        </form>
      </div>
    </aside>
  );
}
