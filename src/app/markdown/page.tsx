import type { Metadata } from 'next';
import { WorkspacePage } from '@/modules/workspace/WorkspacePage';

export const metadata: Metadata = { title: 'Workspace — ES Markdown' };

export default function Page() {
  return <WorkspacePage />;
}
