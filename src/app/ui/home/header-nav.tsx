"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import styles from "@/app/ui/home.module.css";

export default function HeaderNav() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const storedAuth = window.localStorage.getItem("aura-auth");

    setIsLoggedIn(Boolean(storedAuth));
  }, []);

  return (
    <nav
      className={`${styles.nav_neu} flex flex-wrap items-center justify-between px-5 md:px-10`}
    >
      <Link href="/" className="flex items-center gap-3 no-underline">
        <div
          className="h-[45px] w-[45px] rounded-[14px]"
          style={{
            background:
              "linear-gradient(135deg,var(--blue-electric),var(--emeraude))",
            boxShadow: "var(--neu-raised-sm)",
          }}
        />
        <span className="text-lg font-bold text-(--neu-text)">
          Aura AI
        </span>
      </Link>

      <div className="mt-3 flex items-center gap-2 md:mt-0 md:gap-3">
        <Link
          href="/about"
          className={styles.nav_link_neu}
          data-i18n="navAbout"
        >
          À propos
        </Link>
        <Link
          href="/help"
          className={styles.nav_link_neu}
          data-i18n="navHelp"
        >
          Aide
        </Link>

        {!isLoggedIn ? (
          <>
            <Link
              href="/login"
              className={styles.neu_btn}
              data-i18n="navLogin"
            >
              Connexion
            </Link>
            <Link
              href="/signin"
              className={`${styles.neu_btn} ${styles.neu_btn_primary}`}
              data-i18n="navSignup"
            >
              S&apos;inscrire
            </Link>
          </>
        ) : (
          <button
            type="button"
            className={`${styles.neu_btn} rounded-full px-3 py-1`}
          >
            <span className="mr-1 inline-flex h-7 w-7 items-center justify-center rounded-full bg-(--blue-electric) text-xs font-semibold text-white">
              AU
            </span>
            <span className="text-sm font-medium">Mon compte</span>
          </button>
        )}
      </div>
    </nav>
  );
}
