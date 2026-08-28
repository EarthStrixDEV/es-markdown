import type { Metadata } from 'next';
import { EditorPage } from '@/modules/editor/EditorPage';

export const metadata: Metadata = { title: 'Editor — ES Markdown' };

export default function Page() {
  return <EditorPage />;
}
