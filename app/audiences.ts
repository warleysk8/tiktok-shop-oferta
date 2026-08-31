/**
 * ============================================================================
 * VARIAÇÕES POR PÚBLICO
 * ============================================================================
 * Um funil, quatro portas de entrada. Cada anúncio aponta para a sua rota e
 * encontra a copy que continua a promessa do criativo:
 *
 *   /             → geral        (tráfego direto, orgânico, bio)
 *   /clt          → CLT          (trabalha o dia todo, quer renda à noite)
 *   /oportunidade → oportunidade (viu que a TikTok Shop paga comissão)
 *   /iniciante    → iniciante    (quer começar e não sabe por onde)
 *
 * REGRA DE CLAREZA: nenhuma headline pode ser enigma. Quem lê em 2 segundos,
 * no celular, tem que saber (a) do que se trata e (b) o que ganha. Nada de
 * jargão de marketing, nada de frase que só faz sentido depois de pensar.
 *
 * O QUE VARIA: o hero inteiro, as perguntas do quiz (via `quiz`) e a ordem
 * dos prints no carrossel.
 *
 * O QUE NÃO VARIA e não deve variar: preço, entregáveis, garantia. Promessa
 * diferente por público é segmentação; oferta diferente por público é
 * problema.
 * ============================================================================
 */

import type { Question } from './funnel-config';

export type AudienceId = 'geral' | 'clt' | 'oportunidade' | 'iniciante';

export type Audience = {
  id: AudienceId;
  /** Só para leitura interna e para o payload das respostas. */
  label: string;
  metaTitle: string;
  metaDescription: string;
  hero: {
    eyebrow: string;
    headline: string;
    headlineAccent: string;
    lead: string;
    cta: string;
    ctaNote: string;
    trust: string[];
    /** Linha miúda abaixo dos selos. Use para citar fonte de um dado factual. */
    note?: string;
    teaserTitle: string;
    teaserItems: string[];
    teaserCta: string;
    proofLabel: string;
  };
  /**
   * Sobrescreve perguntas do quiz, por id. Pode trocar só o `kicker`, só o
   * `title`, ou as `options` inteiras — o que não vier aqui usa a versão base
   * de `funnel-config.ts`.
   *
   * REGRA: os `value` das opções são FIXOS nas quatro versões. Muda a
   * linguagem, nunca a máquina — a lógica de resultado depende deles.
   */
  quiz: Record<string, Partial<Omit<Question, 'id'>>>;
  /** Ordem dos prints no carrossel — o mais relevante para o público primeiro. */
  proofOrder: string[];
};

/* Cada rota tem o seu CTA — o botão fala a língua do ângulo daquele público.
   O texto "comece ainda esse mês" é urgência de AÇÃO (começar), não promessa
   de renda nem de prazo pra resultado — ver rodapé legal e regras de copy. */

/* Sem formulário no funil inteiro: "sem cadastro" deixou de ser promessa
   parcial e virou diferencial real. Vale dizer alto. */
const CTA_NOTE = '';

export const audiences: Record<AudienceId, Audience> = {
  /* ------------------------------------------------------------- geral --- */
  geral: {
    id: 'geral',
    label: 'Geral',
    metaTitle: 'Quer começar a ganhar com a TikTok Shop? Aprenda o caminho',
    metaDescription:
      'Sem seguidores, sem aparecer, sem experiência. Em 2 minutos, descubra como começar na TikTok Shop e dê o primeiro passo ainda este mês.',
    hero: {
      eyebrow: 'Leva 2 minutos',
      headline: 'Quer começar a ganhar com a TikTok Shop?',
      headlineAccent: 'Aprenda o caminho e dê seu primeiro passo ainda este mês.',
      lead: 'Você não precisa ter seguidores, aparecer ou ter experiência. Em 2 minutos, descubra como começar.',
      cta: 'Quero começar',
      ctaNote: CTA_NOTE,
      trust: ['✓ Só o celular', '✓ Sem seguidores', '✓ Sem aparecer, se quiser'],
      teaserTitle: 'Não é falta de seguidor.',
      teaserItems: ['O que está te travando hoje', 'O caminho certo pro seu tempo', 'Seu próximo passo'],
      teaserCta: 'Começar',
      proofLabel: 'Quem já está fazendo',
    },
    quiz: {
      mirror: {
        kicker: 'Sem julgamento',
        title: 'Qual dessas frases é você hoje?',
        options: [
          { label: 'Vivo no TikTok e não ganho nada', value: 'exploring', echo: 'Você assiste todo dia. Quem posta é que ganha.' },
          { label: 'Já tentei vender online e não deu certo', value: 'burned', echo: 'Não faltou esforço. Faltou um passo a passo.' },
          { label: 'Já posto vídeo, mas ninguém compra', value: 'publishing', echo: 'Você já grava. Falta o vídeo que vende.' },
          { label: 'Já vendi, mas depois parou', value: 'selling', echo: 'Falta constância, não talento.' },
        ],
      },
    },
    proofOrder: ['tempo', 'produto', 'curso'],
  },

  /* --------------------------------------------------------------- CLT --- */
  /* Continua o advertorial "CLT durante o dia, criador à noite". A dor é
     tempo, não dinheiro — e a promessa precisa devolver o tempo, não pedir. */
  clt: {
    id: 'clt',
    label: 'CLT',
    metaTitle: 'Seu emprego não precisa ser sua única fonte de renda',
    metaDescription:
      'Como começar no TikTok Shop sendo CLT, com 30 minutos por dia depois do expediente. Descubra o passo a passo em 2 minutos.',
    hero: {
      eyebrow: 'Leva 2 minutos',
      /**
       * "Trabalhar com" diz o que a pessoa vai fazer; "sem largar o emprego"
       * desarma o medo nº 1 desse público. Evitei "conciliar": é palavra formal
       * e não diz o que se faz.
       *
       * Variações prontas para teste (troque as duas linhas juntas):
       *   A) 'Trabalha o dia todo?' / 'Dá pra vender na TikTok Shop à noite.'
       *   B) 'Renda extra sem largar o emprego.' / 'Descubra como começar hoje.'
       */
      headline: 'Seu emprego não precisa ser',
      headlineAccent: 'sua única fonte de renda.',
      lead: 'Descubra como começar no TikTok Shop sendo CLT, dedicando apenas 30 minutos por dia depois do expediente.',
      cta: 'Quero começar esse mês',
      ctaNote: CTA_NOTE,
      trust: ['✓ Sem largar o emprego', '✓ 30 minutos por dia', '✓ Só o celular'],
      teaserTitle: 'Não é falta de tempo.',
      teaserItems: ['O que dá pra fazer em 30 minutos', 'O caminho certo pro seu cansaço', 'Seu próximo passo'],
      teaserCta: 'Começar',
      proofLabel: 'Alunos que também são CLT',
    },
    quiz: {
      mirror: {
        kicker: 'Sem julgamento',
        title: 'Como termina o seu dia hoje?',
        options: [
          { label: 'Chego em casa sem energia pra nada', value: 'exploring', echo: 'Não é preguiça. É falta de um plano curto.' },
          { label: 'Já tentei renda extra e não foi', value: 'burned', echo: 'Não faltou vontade. Faltou um passo a passo.' },
          { label: 'Posto quando dá, mas não vende', value: 'publishing', echo: 'Você já grava. Falta o vídeo que vende.' },
          { label: 'Já vendi, mas parei quando apertou', value: 'selling', echo: 'Falta constância, não talento.' },
        ],
      },
      time: {
        kicker: 'Responda o real',
        title: 'Sobra 30 minutos depois do trabalho?',
        subtitle: 'Responda o real, não o ideal.',
        options: [
          { label: 'Sim, dá pra fazer à noite', value: '30m', echo: 'Dá pra fazer em 30 minutos depois do expediente.' },
          { label: 'Só no fim de semana', value: '60m', echo: 'Então o plano se concentra no fim de semana.' },
        ],
      },
      fear: {
        kicker: 'Sem filtro',
        title: 'O que te segurou até hoje?',
        options: [
          { label: 'Medo de ser mais um curso fraco', value: 'scam' },
          { label: 'Achar que não tenho tempo', value: 'late' },
          { label: 'Sem dinheiro sobrando agora', value: 'money' },
          { label: 'Vergonha do que os outros vão falar', value: 'shame' },
        ],
      },
      goal: {
        kicker: 'Só falta isso',
        title: 'Topa começar já, no tempo que você tem?',
        subtitle: 'Seu plano cabe depois do expediente. Ele vem agora.',
      },
    },
    proofOrder: ['tempo', 'celular', 'produto'],
  },

  /* ------------------------------------------------------- oportunidade --- */
  /* Público movido por timing. A tensão vem da comparação, não de prazo
     inventado. */
  oportunidade: {
    id: 'oportunidade',
    label: 'Oportunidade',
    metaTitle: 'R$ 111 milhões: o número por trás da expansão do TikTok Shop no Brasil',
    metaDescription:
      'Você pode começar a ganhar com a TikTok Shop sem largar o emprego, sem estoque e usando só o celular. Descubra por onde entrar em 2 minutos.',
    hero: {
      eyebrow: 'Leva 2 minutos',
      /**
       * ⚠️ DADO FACTUAL — confira antes de cada campanha.
       * O número é R$ 111 milhões (não 118): é o capital social da TikTok
       * Logistics Brasil Ltda, transportadora própria aberta pelo TikTok para
       * o TikTok Shop, noticiada em agosto de 2026.
       * Fontes: fastcompanybrasil.com/tech/tiktok-investir-logistica-brasil-nova-transportadora-capital-111-milhoes/
       *         transportemoderno.com.br/2026/08/21/tiktok-entra-na-logistica-o-que-a-nova-empresa-de-r-111-milhoes-revela-sobre-o-futuro-das-entregas/
       * Se o valor mudar, mude aqui, no `note` e no metaTitle ao mesmo tempo.
       *
       * A segunda linha é obrigatória: a notícia sozinha não diz o que a pessoa
       * ganha. "Paga comissão para quem indica produto" faz essa ponte.
       *
       * Variação sem dado factual (use se não quiser sustentar o número):
       *   'A TikTok Shop paga comissão por indicação.' / 'Descubra como receber a sua.'
       */
      headline: 'R$ 111 milhões.',
      headlineAccent: 'O número por trás da expansão do TikTok Shop no Brasil.',
      lead: 'E você pode começar a ganhar com isso sem largar o emprego, sem estoque e usando apenas o celular.',
      cta: '🔥 Quero começar agora',
      ctaNote: CTA_NOTE,
      trust: ['✓ Sem estoque', '✓ Sem gastar em anúncio', '✓ Só o celular'],
      note: 'R$ 111 milhões é o capital social da TikTok Logistics Brasil Ltda, transportadora do TikTok Shop, registrada em agosto de 2026.',
      teaserTitle: 'Não precisa ter chegado primeiro.',
      teaserItems: ['Se dá pra você entrar hoje', 'Qual caminho é o seu', 'Seu próximo passo'],
      teaserCta: 'Começar',
      proofLabel: 'Quem já está fazendo',
    },
    quiz: {
      mirror: {
        kicker: 'Sem julgamento',
        title: 'Onde você está nessa história?',
        options: [
          { label: 'Vejo todo mundo ganhando, menos eu', value: 'exploring', echo: 'Você assiste. Quem posta é que ganha.' },
          { label: 'Já tentei ganhar online e não deu', value: 'burned', echo: 'Não faltou esforço. Faltou um passo a passo.' },
          { label: 'Já posto, mas ninguém compra', value: 'publishing', echo: 'Você já grava. Falta o vídeo que vende.' },
          { label: 'Já vendi e quero vender mais', value: 'selling', echo: 'Falta constância, não talento.' },
        ],
      },
      obstacle: {
        kicker: 'O que falta',
        title: 'O que te impede de começar agora?',
        options: [
          { label: 'Deixar a conta pronta pra vender', value: 'account', echo: 'Beleza. Começamos deixando sua conta pronta.' },
          { label: 'Saber qual produto divulgar', value: 'product', echo: 'Beleza. Começamos pela escolha do produto.' },
          { label: 'Saber o que falar no vídeo', value: 'content', echo: 'Beleza. Começamos pelo roteiro do vídeo.' },
          { label: 'Fazer quem assiste comprar', value: 'conversion', echo: 'Beleza. Começamos pelo que faz vender.' },
        ],
      },
      fear: {
        kicker: 'Sem filtro',
        title: 'O que te deixou de fora até hoje?',
        options: [
          { label: 'Medo de ser mais um curso fraco', value: 'scam' },
          { label: 'Achar que já perdi o timing', value: 'late' },
          { label: 'Não ter dinheiro pra investir agora', value: 'money' },
          { label: 'Vergonha do que os outros vão falar', value: 'shame' },
        ],
      },
      goal: {
        kicker: 'Só falta isso',
        title: 'Pronto pra entrar ainda esse mês?',
        subtitle: 'Seu plano de entrada aparece na próxima tela.',
      },
    },
    proofOrder: ['produto', 'parado', 'tempo'],
  },

  /* ---------------------------------------------------------- iniciante --- */
  /* A dor não é dinheiro nem tempo: é não saber a ordem. A promessa é
     clareza, e o quiz entrega exatamente isso. */
  iniciante: {
    id: 'iniciante',
    label: 'Iniciante',
    metaTitle: 'E se você também ganhasse com a TikTok Shop, em vez de só comprar?',
    metaDescription:
      'Aprenda a receber comissão indicando produtos. Sem estoque, sem seguidores, sem experiência: do zero, só com o celular.',
    hero: {
      eyebrow: 'Leva 2 minutos',
      /**
       * A virada de lado: quase todo mundo desse público já comprou algo pela
       * TikTok Shop. A headline usa essa familiaridade para mostrar que ele
       * está do lado errado da transação — sem precisar de nenhuma promessa.
       *
       * A segunda linha PRECISA dizer "ganhar com ela". A versão anterior era
       * só "Já ganhou?" e virava enigma: ganhou o quê? prêmio? sorteio?
       *
       * NÃO usar aqui: "uma das melhores fontes de renda de 2026" ou qualquer
       * superlativo do tipo. É claim que ninguém consegue provar, é o gatilho
       * clássico de reprovação de anúncio e é publicidade enganosa (CDC art. 37).
       */
      headline: 'E se, em vez de só comprar, você também ganhasse com a TikTok Shop?',
      headlineAccent: 'Aprenda a receber comissão indicando produtos.',
      lead: 'Você não precisa ter estoque, milhares de seguidores ou experiência. Descubra como começar do zero usando apenas o celular.',
      cta: 'Quero ver como funciona',
      ctaNote: CTA_NOTE,
      trust: ['✓ Sem seguidores', '✓ Sem aparecer, se quiser', '✓ Só o celular'],
      teaserTitle: 'Não é difícil. É saber a ordem.',
      teaserItems: ['O que fazer primeiro', 'O que dá pra deixar pra depois', 'Seu próximo passo'],
      teaserCta: 'Começar',
      proofLabel: 'Quem já está fazendo',
    },
    quiz: {
      mirror: {
        kicker: 'Sem julgamento',
        title: 'Em que ponto você está?',
        options: [
          { label: 'Não sei nem por onde começar', value: 'exploring', echo: 'Você não precisa saber mais. Precisa saber a ordem.' },
          { label: 'Já tentei antes e travei', value: 'burned', echo: 'Não faltou esforço. Faltou um passo a passo.' },
          { label: 'Já postei e não aconteceu nada', value: 'publishing', echo: 'Você já grava. Falta o vídeo que vende.' },
          { label: 'Já vendi uma vez, sem entender como', value: 'selling', echo: 'Falta constância, não talento.' },
        ],
      },
      obstacle: {
        kicker: 'A sua dúvida',
        title: 'Qual sua maior dúvida?',
        options: [
          { label: 'Como deixar a conta pronta', value: 'account', echo: 'Beleza. Começamos deixando sua conta pronta.' },
          { label: 'Qual produto escolher', value: 'product', echo: 'Beleza. Começamos pela escolha do produto.' },
          { label: 'O que falar no vídeo', value: 'content', echo: 'Beleza. Começamos pelo roteiro do vídeo.' },
          { label: 'Como fazer alguém comprar', value: 'conversion', echo: 'Beleza. Começamos pelo que faz vender.' },
        ],
      },
      goal: {
        kicker: 'Só falta isso',
        title: 'Pronto pra ficar do outro lado?',
        subtitle: 'Seu plano do zero já está montado.',
      },
    },
    proofOrder: ['curso', 'celular', 'produto'],
  },
};

export function getAudience(id: AudienceId): Audience {
  return audiences[id] ?? audiences.geral;
}
