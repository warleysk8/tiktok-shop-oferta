import type { Metadata } from 'next';
import Funnel from '../Funnel';
import { audiences } from '../audiences';

export const metadata: Metadata = {
  title: audiences.iniciante.metaTitle,
  description: audiences.iniciante.metaDescription,
};

export default function Page() {
  return <Funnel audienceId="iniciante" />;
}
