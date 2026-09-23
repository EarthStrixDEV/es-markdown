import type { Metadata } from 'next';
import { StudioPage } from '@/modules/studio/StudioPage';

export const metadata: Metadata = { title: 'Studio — ES Markdown' };

export default function Page() {
  return <StudioPage />;
}
