import type { Metadata } from 'next';
import Funnel from '../Funnel';
import { audiences } from '../audiences';

export const metadata: Metadata = {
  title: audiences.oportunidade.metaTitle,
  description: audiences.oportunidade.metaDescription,
};

export default function Page() {
  return <Funnel audienceId="oportunidade" />;
}
