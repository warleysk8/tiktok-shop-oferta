import type { Metadata } from 'next';
import Funnel from '../Funnel';
import { audiences } from '../audiences';

export const metadata: Metadata = {
  title: audiences.geral.metaTitle,
  description: audiences.geral.metaDescription,
};

export default function Page() {
  return <Funnel audienceId="geral" />;
}
