import type { Metadata } from 'next';
import LegalPage, { Contact, controllerName } from '../LegalPage';
import { COMPANY } from '../funnel-config';

export const metadata: Metadata = {
  title: `Termos de Uso · ${COMPANY.brand}`,
  description: 'Regras de uso do site e condições da oferta.',
};

export default function Page() {
  return (
    <LegalPage title="Termos de Uso">
      <p>
        Ao acessar e usar este site, você concorda com estes Termos. Se não concordar,
        não utilize o site. O responsável por este site é {controllerName}. Contato:{' '}
        <Contact />.
      </p>

      <h2>1. O que oferecemos</h2>
      <p>
        Conteúdo educacional sobre criação de conteúdo e vendas na TikTok Shop. Não é
        consultoria financeira, contábil, jurídica ou de investimento, e não substitui
        orientação profissional.
      </p>

      <h2>2. Sem garantia de resultado</h2>
      <p>
        Os resultados dependem de esforço, execução, tempo dedicado, nicho, mercado e
        outros fatores fora do nosso controle. Os depoimentos exibidos são reais e
        individuais e <strong>não representam média nem promessa de ganho</strong>. Não
        garantimos qualquer valor de renda ou comissão.
      </p>

      <h2>3. Independência de marcas</h2>
      <p>
        Este site e este produto não têm vínculo, patrocínio, endosso ou afiliação com
        TikTok, TikTok Shop, ByteDance, Meta Platforms, Facebook ou Instagram. As marcas
        citadas pertencem aos respectivos titulares e são usadas apenas para referência.
      </p>

      <h2>4. Compra, pagamento e acesso</h2>
      <p>
        As vendas são processadas pela plataforma <strong>Ticto</strong>. O acesso ao
        conteúdo é liberado após a confirmação do pagamento, pelo e-mail informado no
        checkout.
      </p>

      <h2>5. Direito de arrependimento e garantia</h2>
      <p>
        Nos termos do art. 49 do Código de Defesa do Consumidor, você pode desistir da
        compra em até <strong>7 dias corridos</strong> a partir da liberação do acesso,
        com reembolso integral, sem necessidade de justificativa. Além desse direito,
        oferecemos uma garantia de satisfação no mesmo prazo: basta solicitar pelo e-mail
        de contato.
      </p>

      <h2>6. Propriedade intelectual</h2>
      <p>
        Todo o conteúdo (aulas, materiais, textos, vídeos e marca) é protegido por direitos
        autorais. O acesso é pessoal e intransferível. É proibido compartilhar, revender,
        reproduzir ou distribuir o conteúdo, no todo ou em parte.
      </p>

      <h2>7. Uso aceitável</h2>
      <p>
        Você concorda em não usar o site para fins ilícitos, não tentar burlar o
        pagamento, não realizar engenharia reversa e não copiar o conteúdo.
      </p>

      <h2>8. Links e serviços de terceiros</h2>
      <p>
        O site pode conter links para serviços externos (checkout, redes sociais). Não
        somos responsáveis pelo conteúdo, pelas políticas ou pela disponibilidade desses
        serviços.
      </p>

      <h2>9. Limitação de responsabilidade</h2>
      <p>
        Na máxima extensão permitida em lei, não respondemos por lucros cessantes, perda
        de dados ou danos indiretos decorrentes do uso ou da impossibilidade de uso do
        conteúdo.
      </p>

      <h2>10. Alterações</h2>
      <p>
        Podemos alterar estes Termos a qualquer momento. O uso continuado após a
        publicação das mudanças implica aceite.
      </p>

      <h2>11. Lei aplicável e foro</h2>
      <p>
        Estes Termos são regidos pelas leis do Brasil. Fica eleito o foro da comarca de{' '}
        {COMPANY.city}, ressalvado o direito do consumidor de demandar em seu próprio
        domicílio.
      </p>

      <h2>12. Contato</h2>
      <p>
        Fale conosco por <Contact />.
      </p>
    </LegalPage>
  );
}
