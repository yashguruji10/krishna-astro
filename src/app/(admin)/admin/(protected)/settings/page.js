import { getSiteSettings } from '@/lib/siteSettings';
import SettingsForm from './SettingsForm';

export const dynamic = 'force-dynamic';
export default async function AdminSettingsPage() {
  const settings = await getSiteSettings();

  return (
    <div>
      <h1 className="text-2xl font-bold text-maroon mb-6">Site Settings</h1>
      <SettingsForm initial={settings} />
    </div>
  );
}
