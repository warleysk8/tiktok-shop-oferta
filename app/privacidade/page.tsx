import type { Metadata } from 'next';
import LegalPage, { Contact, controllerName } from '../LegalPage';
import { COMPANY } from '../funnel-config';

export const metadata: Metadata = {
  title: `Política de Privacidade · ${COMPANY.brand}`,
  description: 'Como coletamos, usamos e protegemos os dados de quem visita este site.',
};

export default function Page() {
  return (
    <LegalPage title="Política de Privacidade">
      <p>
        Esta Política explica como os dados de quem acessa este site são tratados, em
        conformidade com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018, a LGPD).
        O responsável pelo tratamento é {controllerName}. Para contato sobre privacidade,
        use <Contact />.
      </p>

      <h2>1. Dados que coletamos</h2>
      <ul>
        <li>
          <strong>Respostas do questionário:</strong> etapa em que você está, objetivo,
          tempo disponível e preferências de conteúdo. Este site <strong>não pede</strong>{' '}
          nome, e-mail ou telefone.
        </li>
        <li>
          <strong>Dados de navegação:</strong> endereço IP, tipo de dispositivo e
          navegador, páginas visitadas, data e hora, e a origem do acesso (parâmetros de
          campanha, como UTM e identificadores de anúncio).
        </li>
        <li>
          <strong>Cookies e tecnologias similares</strong>, incluindo pixels da Meta
          (Facebook/Instagram) e do TikTok, usados para medir e otimizar anúncios.
        </li>
        <li>
          <strong>Dados de compra:</strong> se você finalizar um pagamento, o checkout é
          operado pela <strong>Ticto</strong>, que coleta os dados necessários à
          transação conforme a política de privacidade dela. Não recebemos os dados
          completos do seu cartão.
        </li>
      </ul>

      <h2>2. Para que usamos</h2>
      <ul>
        <li>Personalizar o resultado do diagnóstico e a oferta apresentada.</li>
        <li>Medir, entender e melhorar as campanhas de anúncio e o desempenho do site.</li>
        <li>Garantir segurança e prevenir fraude.</li>
        <li>Cumprir obrigações legais e regulatórias.</li>
      </ul>

      <h2>3. Base legal</h2>
      <p>
        Tratamos dados com fundamento em: consentimento (cookies e pixels não
        essenciais), legítimo interesse (medição, melhoria e segurança), execução de
        contrato (quando há compra) e cumprimento de obrigação legal.
      </p>

      <h2>4. Compartilhamento</h2>
      <p>Podemos compartilhar dados com:</p>
      <ul>
        <li>
          Provedores de tecnologia, hospedagem e analytics, incluindo Meta Platforms,
          Inc. e TikTok/ByteDance, para medição de anúncios.
        </li>
        <li>O processador de pagamento (Ticto), quando há compra.</li>
        <li>Autoridades públicas, quando exigido por lei ou ordem judicial.</li>
      </ul>
      <p>Não vendemos seus dados.</p>

      <h2>5. Transferência internacional</h2>
      <p>
        Alguns provedores podem processar dados fora do Brasil. Nesses casos, exigimos
        salvaguardas contratuais compatíveis com a LGPD.
      </p>

      <h2>6. Retenção</h2>
      <p>
        Guardamos os dados pelo tempo necessário às finalidades desta Política ou pelos
        prazos exigidos por lei. Dados de navegação são mantidos, em regra, por até 12
        meses.
      </p>

      <h2>7. Seus direitos</h2>
      <p>
        Nos termos do art. 18 da LGPD, você pode solicitar: confirmação da existência de
        tratamento, acesso, correção, anonimização, portabilidade, eliminação, informação
        sobre compartilhamento e revogação do consentimento. Para exercer, entre em
        contato por <Contact />.
      </p>

      <h2>8. Cookies</h2>
      <p>
        Você pode bloquear ou apagar cookies nas configurações do seu navegador. Bloquear
        cookies pode afetar o funcionamento de partes do site.
      </p>

      <h2>9. Segurança</h2>
      <p>
        Adotamos medidas técnicas e organizacionais razoáveis para proteger os dados
        contra acesso não autorizado, perda ou alteração.
      </p>

      <h2>10. Menores de idade</h2>
      <p>O conteúdo não é destinado a menores de 18 anos.</p>

      <h2>11. Alterações</h2>
      <p>
        Esta Política pode ser atualizada. A data no topo indica a versão vigente. Mudanças
        relevantes serão sinalizadas no site.
      </p>

      <h2>12. Contato</h2>
      <p>
        Dúvidas sobre privacidade ou sobre esta Política: <Contact />.
      </p>
    </LegalPage>
  );
}
