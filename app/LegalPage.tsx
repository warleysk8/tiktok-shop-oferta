import type { ReactNode } from 'react';
import { COMPANY, companyLine } from './funnel-config';

/**
 * Casca das páginas legais (/privacidade e /termos).
 * Texto-modelo: revise com um advogado e preencha os dados de `COMPANY`
 * em funnel-config.ts antes de publicar/anunciar. Enquanto `legalName`,
 * `cnpj` e `email` estiverem vazios, os campos correspondentes ficam ocultos.
 */

/** Nome do responsável para uso em texto corrido. */
export const controllerName = COMPANY.legalName || 'o responsável por este site';

/** E-mail de contato: vira link quando preenchido, senão texto neutro. */
export function Contact() {
  return COMPANY.email ? (
    <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a>
  ) : (
    <>o e-mail de contato divulgado no site</>
  );
}

export default function LegalPage({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <main className="legal-page">
      {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
      <a className="legal-back" href="/">← Voltar ao site</a>
      <h1>{title}</h1>
      <p className="legal-updated">Última atualização: {COMPANY.legalUpdatedAt}</p>
      <div className="legal-body">{children}</div>
      <p className="legal-foot">
        {COMPANY.brand}
        {companyLine && ` · ${companyLine}`}
      </p>
    </main>
  );
}
