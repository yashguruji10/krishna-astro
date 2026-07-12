import { getTranslations } from 'next-intl/server';
import SaturnLoader from '@/components/SaturnLoader';

export default async function Loading() {
  let label = '🪐 Loading...';
  try {
    const t = await getTranslations();
    label = `🪐 ${t('common.loading')}`;
  } catch {
    // fall back to default label if translations aren't resolvable yet
  }
  return <SaturnLoader label={label} />;
}
