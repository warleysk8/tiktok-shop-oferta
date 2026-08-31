import type { Metadata } from 'next';
import Funnel from './Funnel';
import { audiences } from './audiences';

export const metadata: Metadata = {
  title: audiences.geral.metaTitle,
  description: audiences.geral.metaDescription,
};

export default function Home() {
  return <Funnel audienceId="geral" />;
}
