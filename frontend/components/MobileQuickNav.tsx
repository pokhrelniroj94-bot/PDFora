"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/", label: "Home", icon: "⌂" },
  { href: "/tools", label: "Tools", icon: "▦" },
  { href: "/market", label: "Market", icon: "↗" },
  { href: "/ne", label: "नेपाली", icon: "🇳🇵" },
  { href: "/blog", label: "Guides", icon: "▤" },
];

export default function MobileQuickNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Quick navigation" className="fixed inset-x-0 bottom-0 z-[70] border-t border-slate-200/90 bg-white/95 px-2 pt-2 shadow-[0_-8px_30px_rgba(15,23,42,.08)] backdrop-blur-xl md:hidden" style={{ paddingBottom: "max(.5rem, env(safe-area-inset-bottom))" }}>
      <ul className="mx-auto grid max-w-lg grid-cols-5 gap-1">
        {items.map((item) => {
          const active = item.href === "/" ? pathname === "/" : pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`flex min-h-12 flex-col items-center justify-center gap-0.5 rounded-xl px-1 py-1 text-[10px] font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700 ${active ? "bg-teal-50 text-teal-800" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"}`}
              >
                <span aria-hidden="true" className="text-lg leading-5">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
