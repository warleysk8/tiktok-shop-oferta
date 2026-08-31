import type { Metadata } from 'next';
import Funnel from '../Funnel';
import { audiences } from '../audiences';

export const metadata: Metadata = {
  title: audiences.clt.metaTitle,
  description: audiences.clt.metaDescription,
};

export default function Page() {
  return <Funnel audienceId="clt" />;
}
