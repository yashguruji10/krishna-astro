import { redirect } from 'next/navigation';
import { getAdminFromCookies } from '@/lib/auth';

export default function AdminIndexPage() {
  const admin = getAdminFromCookies();
  redirect(admin ? '/admin/dashboard' : '/admin/login');
}
