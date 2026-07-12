import { redirect } from 'next/navigation';
import { getAdminFromCookies } from '@/lib/auth';
import AdminSidebar from '@/components/admin/AdminSidebar';

export default function ProtectedAdminLayout({ children }) {
  const admin = getAdminFromCookies();
  if (!admin) {
    redirect('/admin/login');
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <AdminSidebar adminEmail={admin.email} />
      <main className="flex-1 p-4 md:p-8 overflow-x-hidden max-w-full">{children}</main>
    </div>
  );
}
