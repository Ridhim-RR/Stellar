"use client";

import { GitBranch, ExternalLink, BookOpen } from "lucide-react";

const links = [
  {
    label: "Github",
    href: "https://github.com",
    icon: GitBranch,
  },
  {
    label: "Stellar",
    href: "https://stellar.org",
    icon: ExternalLink,
  },
  {
    label: "Documentation",
    href: "#",
    icon: BookOpen,
  },
];

export function Footer() {
  return (
    <footer className="border-t border-white/10 px-4 py-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
        <p className="text-sm text-white/40">
          &copy; {new Date().getFullYear()} StellarCred. All rights reserved.
        </p>
        <div className="flex items-center gap-6">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-white/40 transition-colors hover:text-white/80"
            >
              <link.icon className="h-4 w-4" />
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
