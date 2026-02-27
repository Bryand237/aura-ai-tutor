"use client";

import {
  BookOpenText,
  ChartNoAxesCombined,
  HomeIcon,
  NotebookPen,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useParams } from "next/navigation";
import clsx from "clsx";

import styles from "./nav-links.module.css";

export default function NavLinks() {
  const params = useParams<{ id?: string }>();
  const id = typeof params?.id === "string" ? params.id : "";
  const pathname = usePathname();

  const links = [
    { name: "Vue d'ensemble", href: `/${id}/dashboard`, icon: HomeIcon },
    { name: "Revision", href: `/${id}/dashboard/revision`, icon: BookOpenText },
    {
      name: "Entrainement",
      href: `/${id}/dashboard/training`,
      icon: NotebookPen,
    },
    {
      name: "Progression",
      href: `/${id}/dashboard/progress`,
      icon: ChartNoAxesCombined,
    },
    { name: "Profile", href: `/${id}/dashboard/profile`, icon: HomeIcon },
  ];

  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;

        return (
          <Link
            href={link.href}
            key={link.name}
            className={clsx(
              "flex h-12 grow items-center justify-center gap-2 p-3 text-sm font-medium md:flex-none md:justify-start md:p-2 md:px-3",
              styles.item,
              {
                [styles.active]: pathname === link.href,
              },
            )}
          >
            <LinkIcon className="w-6" />
            <p className="hidden md:block">{link.name}</p>
          </Link>
        );
      })}
    </>
  );
}
