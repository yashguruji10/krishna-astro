'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function MobileMenu({ navLinks, whatsapp }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        onClick={() => setOpen(!open)}
        aria-label="Toggle menu"
        className="text-maroon text-3xl leading-none p-1"
      >
        {open ? '✕' : '☰'}
      </button>

      {open && (
        <div className="fixed inset-0 top-[88px] bg-cream z-40 p-6 overflow-y-auto">
          <nav className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="text-lg font-semibold text-maroon border-b border-saffron/20 pb-2"
              >
                {link.label}
              </Link>
            ))}
            <a
              href={`https://wa.me/${whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary justify-center mt-4"
              onClick={() => setOpen(false)}
            >
              WhatsApp
            </a>
          </nav>
        </div>
      )}
    </div>
  );
}
