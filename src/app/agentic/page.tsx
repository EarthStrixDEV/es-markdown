import type { Metadata } from 'next';
import { AgenticPage } from '@/modules/agentic/AgenticPage';

export const metadata: Metadata = { title: 'Agentic — ES Markdown' };

export default function Page() {
  return <AgenticPage />;
}
