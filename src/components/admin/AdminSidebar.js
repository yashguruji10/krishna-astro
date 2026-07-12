'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

const links = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
  { href: '/admin/services', label: 'Services & Products', icon: '🔮' },
  { href: '/admin/orders', label: 'Orders / Enquiries', icon: '📩' },
  { href: '/admin/settings', label: 'Site Settings', icon: '⚙️' }
];

export default function AdminSidebar({ adminEmail }) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  }

  return (
    <>
      {/* Mobile top bar */}
      <div className="md:hidden w-full bg-maroon text-cream p-4 flex items-center justify-between sticky top-0 z-40">
        <h1 className="text-base font-bold text-gold">Jay Durga Jyotish Admin</h1>
        <button onClick={handleLogout} className="text-sm bg-white/10 px-3 py-1.5 rounded-md">
          Logout
        </button>
      </div>
      <nav className="md:hidden bg-maroon text-cream flex overflow-x-auto sticky top-[60px] z-30 border-t border-cream/10">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`flex-shrink-0 px-4 py-2.5 text-sm font-medium whitespace-nowrap ${
              pathname.startsWith(link.href) ? 'bg-saffron text-white' : ''
            }`}
          >
            {link.icon} {link.label}
          </Link>
        ))}
      </nav>

      {/* Desktop sidebar */}
      <aside className="w-64 bg-maroon text-cream flex-shrink-0 hidden md:flex flex-col admin-sidebar">
        <div className="p-5 border-b border-cream/10">
          <h1 className="text-lg font-bold text-gold">Jay Durga Jyotish</h1>
          <p className="text-xs text-cream/70 mt-1 truncate">{adminEmail}</p>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg font-medium transition-colors ${
                pathname.startsWith(link.href) ? 'active' : 'hover:bg-white/10'
              }`}
            >
              <span>{link.icon}</span> {link.label}
            </Link>
          ))}
        </nav>
        <div className="p-3 border-t border-cream/10">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg font-medium hover:bg-white/10"
          >
            🚪 Logout
          </button>
        </div>
      </aside>
    </>
  );
}
