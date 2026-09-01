/**
 * ============================================================================
 * COMISSÃO EM CENA — CONFIGURAÇÃO DO FUNIL
 * ============================================================================
 * Toda a copy do funil vive aqui. Edite este arquivo para mudar texto
 * sem tocar em nenhum componente React.
 *
 * REGRA DE COPY DESTE FUNIL — público leigo, lê só título:
 *   · Headline e títulos: no máximo 8 palavras.
 *   · Apoio: 1 linha. Se precisar de 2, corte.
 *   · Opção de resposta: 3 a 5 palavras.
 *   · Nada de parágrafo antes do resultado.
 *   · CLAREZA VENCE ESPERTEZA. Sem enigma, sem jargão de marketing.
 *     Proibidos aqui: gargalo, monetizar, retenção, previsibilidade, métrica,
 *     nicho, elegível, gancho, escalar, converter (no sentido técnico).
 *     Teste: um estranho entende em 2 segundos, sem reler?
 *
 * O hero e a pergunta 1 NÃO estão aqui: variam por público, em `audiences.ts`.
 *
 * ATENÇÃO — 3 coisas precisam ser trocadas antes de colocar no ar:
 *   1. Os vídeos em /public/videos são PLACEHOLDERS de benchmark (concorrente).
 *      Troque pelos SEUS depoimentos. Ver README-CLAUDE.md.
 *   2. Nenhum número inventado sobrou: preço e parcelamento vêm do checkout Ticto.
 *      Se voltar a inventar algum, marque com [[ ]] até confirmar.
 *   3. LEAD_ENDPOINT (opcional) recebe as respostas do quiz para análise.
 * ============================================================================
 */

/* ---------------------------------------------------------------- infra --- */

/**
 * Webhook que recebe as RESPOSTAS do quiz (sem dado pessoal — o formulário de
 * captura foi removido). Vazio = salva no localStorage e não envia nada.
 */
export const LEAD_ENDPOINT: string = '';

/** Checkout Ticto do produto "Operação TikTok Shop". */
export const OFFER_URL: string = 'https://payment.ticto.app/O5562B7A7';

/* ------------------------------------------------------------- perguntas --- */

export type Option = {
  label: string;
  value: string;
  detail?: string;
  /** Devolvido ao usuário na tela seguinte. Espelhar a resposta aumenta a conclusão. */
  echo?: string;
};

export type Question = {
  id: string;
  kicker: string;
  title: string;
  subtitle?: string;
  options: Option[];
};

/**
 * A pergunta 1 ('mirror') é SEMPRE sobrescrita pela variação de público —
 * ver `audiences.ts`. O que está aqui é a versão geral, usada como base.
 * As outras seis são iguais nas quatro entradas.
 */
export const questions: Question[] = [
  {
    id: 'mirror',
    kicker: 'Sem julgamento',
    title: 'Qual dessas frases é você hoje?',
    options: [
      {
        label: 'Vivo no TikTok e não ganho nada',
        value: 'exploring',
        echo: 'Você assiste todo dia. Quem posta é que ganha.',
      },
      {
        label: 'Já tentei vender online e não deu certo',
        value: 'burned',
        echo: 'Não faltou esforço. Faltou um passo a passo.',
      },
      {
        label: 'Já posto vídeo, mas ninguém compra',
        value: 'publishing',
        echo: 'Você já grava. Falta o vídeo que vende.',
      },
      {
        label: 'Já vendi, mas depois parou',
        value: 'selling',
        echo: 'Falta constância, não talento.',
      },
    ],
  },
  {
    id: 'obstacle',
    kicker: 'Onde você trava',
    title: 'O que te trava mais?',
    options: [
      { label: 'Deixar a conta pronta pra vender', value: 'account', echo: 'Beleza. Começamos deixando sua conta pronta.' },
      { label: 'Saber qual produto divulgar', value: 'product', echo: 'Beleza. Começamos pela escolha do produto.' },
      { label: 'Saber o que falar no vídeo', value: 'content', echo: 'Beleza. Começamos pelo roteiro do vídeo.' },
      { label: 'Fazer quem assiste comprar', value: 'conversion', echo: 'Beleza. Começamos pelo que faz vender.' },
    ],
  },
  {
    /* Binária de propósito: não entra no cálculo do resultado (só no echo),
       então serve pra colher um "sim" fácil sem quebrar a lógica dos 3 perfis. */
    id: 'time',
    kicker: 'Responda o real',
    title: 'Dá pra separar 30 minutos por dia?',
    subtitle: 'É o tempo que o plano precisa pra andar.',
    options: [
      { label: 'Sim, isso eu consigo', value: '30m', echo: '30 minutos por dia já dá pra seguir o plano.' },
      { label: 'Só alguns dias na semana', value: '60m', echo: 'Sem problema. O plano cabe em poucos dias por semana.' },
    ],
  },
  {
    /* O valor não é lido em lugar nenhum além do echo. */
    id: 'style',
    kicker: 'Do seu jeito',
    title: 'Como você prefere criar seus vídeos?',
    options: [
      { label: 'Sem aparecer', value: 'hands', echo: 'Dá certo. Dá pra vender só com mãos, produto e narração.' },
      { label: 'Aparecendo e falando', value: 'face', echo: 'Então vai ser você na frente da câmera.' },
      { label: 'Ainda não sei', value: 'unknown', echo: 'Sem problema. A gente testa os formatos.' },
    ],
  },
  {
    id: 'fear',
    kicker: 'Sem filtro',
    title: 'O que te fez adiar até hoje?',
    options: [
      { label: 'Medo de ser mais um curso fraco', value: 'scam' },
      { label: 'Achar que já é tarde pra começar', value: 'late' },
      { label: 'Não ter dinheiro pra investir agora', value: 'money' },
      { label: 'Vergonha do que os outros vão falar', value: 'shame' },
    ],
  },
  {
    /* Substituiu "idade" (não mudava o plano). Alimenta a ponte motivacional
       antes da última pergunta. O valor não entra no cálculo do resultado. */
    id: 'objective',
    kicker: 'Quase lá',
    title: 'Qual é seu objetivo agora?',
    options: [
      { label: 'Fazer a primeira comissão', value: 'first' },
      { label: 'Criar uma renda extra', value: 'extra' },
      { label: 'Transformar isso em algo constante', value: 'constant' },
    ],
  },
  {
    /* Última tela antes do resultado: em vez de coletar mais um dado, ela
       cobra um "sim". Os dois caminhos levam ao mesmo resultado — o valor
       está no compromisso que a pessoa assume logo antes de ver a oferta.
       O `value` não entra no cálculo do resultado (getResult usa mirror +
       obstacle), então pode mudar livremente. */
    id: 'goal',
    kicker: 'Só falta isso',
    title: 'Pronto pra começar essa semana?',
    subtitle: 'Seu plano já está montado. Ele aparece na próxima tela.',
    options: [
      { label: 'Sim, quero começar agora', value: 'commit', echo: 'Boa. Aqui está o seu plano.' },
      { label: 'Quero ver o plano antes', value: 'preview', echo: 'Justo. Está logo aqui.' },
    ],
  },
];

/* ---------------------------------------------------- vídeos intercalados --- */

export type VideoSlot = {
  /**
   * `false` tira o vídeo do fluxo sem apagar a configuração.
   * Só UM está ligado: o hero promete 90 segundos, e 3 vídeos somavam ~3 min.
   * Prova em print custa 5 segundos; em vídeo, 40. Nos outros dois pontos,
   * o print entrega a mesma prova sem quebrar a promessa do topo.
   */
  enabled: boolean;
  /** Aparece DEPOIS da pergunta com este id. */
  afterQuestionId: string;
  src: string;
  tag: string;
  title: string;
  body: string;
  cta: string;
  /** Segundos de reprodução até liberar o botão de continuar. */
  unlockAfter: number;
};

/**
 * ⚠️ Os arquivos abaixo são depoimentos DO CONCORRENTE, baixados só para
 * benchmark. Estão aqui como placeholder de estrutura. Grave os seus e
 * troque o campo `src` antes de publicar.
 */
export const videoSlots: VideoSlot[] = [
  {
    enabled: false, // substituído por print (mesma prova, 5s em vez de 1min38)
    afterQuestionId: 'obstacle',
    src: '/videos/PLACEHOLDER-depoimento-01.mp4',
    tag: 'Pausa de 1 minuto',
    title: 'Ele começou igual a você.',
    body: 'Veja o que mudou primeiro.',
    cta: 'Continuar',
    unlockAfter: 12,
  },
  {
    // DESLIGADO até ter vídeo próprio. Os PLACEHOLDER são do concorrente e
    // estão no .gitignore (não sobem). Grave o seu, coloque em CDN e ligue.
    enabled: false,
    afterQuestionId: 'style',
    src: '/videos/PLACEHOLDER-depoimento-02.mp4',
    tag: 'A dúvida de todo mundo',
    title: 'Dá pra vender sem aparecer?',
    body: 'A resposta em 43 segundos.',
    cta: 'Continuar',
    unlockAfter: 10,
  },
  {
    enabled: false, // a ponte já ocupa esse ponto do fluxo
    afterQuestionId: 'objective',
    src: '/videos/PLACEHOLDER-depoimento-03.mp4',
    tag: 'Antes da última pergunta',
    title: '7 dias seguindo o plano.',
    body: 'O antes e o depois.',
    cta: 'Continuar',
    unlockAfter: 10,
  },
];

/* --------------------------------------------------- prints de alunos --- */

export type ProofShot = {
  id: string;
  src: string;
  /** Título curto acima do print. É a única coisa que o visitante lê. */
  claim: string;
  /** Rótulo da objeção que este print mata. */
  kills: string;
  alt: string;
};

/**
 * Prints reais de conversa com alunos. Cada um mata uma objeção diferente —
 * por isso são servidos por resposta, não como galeria genérica no rodapé.
 *
 * ANTES DE PUBLICAR: pegue autorização por escrito de cada aluno para usar a
 * conversa e a foto de perfil. Os nomes já estão rasurados; as fotos de perfil
 * ainda aparecem.
 */
export const SOCIAL_PROOF: ProofShot[] = [
  {
    id: 'tempo',
    src: '/prova/prova-tempo.jpg',
    claim: 'Ele grava depois que a casa dorme.',
    kills: 'Falta de tempo',
    alt: 'Print de conversa: aluno conta que trabalha o dia inteiro e mesmo assim gravou 4 vídeos depois que a família dorme.',
  },
  {
    id: 'produto',
    src: '/prova/prova-produto.jpg',
    claim: '3 vídeos seguindo o passo a passo. Primeira venda.',
    kills: 'Não sei escolher produto',
    alt: 'Print de conversa: aluno conta que aprendeu a analisar o produto antes de gravar, fez 3 vídeos e saiu a primeira venda, com comissão de R$ 156,70.',
  },
  {
    id: 'curso',
    src: '/prova/prova-curso.jpg',
    claim: 'Ela achava que era mais um curso.',
    kills: 'Medo de curso furado',
    alt: 'Print de conversa: aluna conta que entrou achando que seria mais um curso genérico, fez os primeiros vídeos na semana e conseguiu a primeira comissão.',
  },
  {
    id: 'parado',
    src: '/prova/prova-parado.jpg',
    claim: 'Comprou outro curso antes e ficou parada.',
    kills: 'Já tentei e não deu certo',
    alt: 'Print de conversa: aluna conta que já tinha comprado outro curso de afiliado e não saía do lugar; agora está no nono vídeo do desafio e fez a primeira venda.',
  },
  {
    id: 'celular',
    src: '/prova/prova-celular.jpg',
    claim: 'Ele achava que precisava de câmera boa.',
    kills: 'Acho que preciso investir',
    alt: 'Print de conversa: aluno conta que achava que precisava de câmera e computador, está fazendo tudo pelo celular e fez a primeira venda.',
  },
];

const proofById = (id: string) => SOCIAL_PROOF.find((shot) => shot.id === id) ?? SOCIAL_PROOF[0];

/** Print servido logo após a pergunta 2 — casado com o gargalo apontado. */
export function proofForObstacle(obstacle?: string): ProofShot {
  if (obstacle === 'account') return proofById('celular');
  return proofById('produto');
}

/** Print servido logo após a pergunta 5 — casado com o medo declarado. */
export function proofForFear(fear?: string): ProofShot {
  if (fear === 'late') return proofById('parado');
  if (fear === 'money') return proofById('celular');
  /* 'shame' ainda não tem print próprio — falta gravar um caso de "fiz sem
     mostrar o rosto e sem contar pra ninguém". Ver README. */
  return proofById('curso');
}

export const PROOF_SCREEN = {
  tagObstacle: 'Ele travava no mesmo ponto',
  tagFear: 'Você não é o único',
  cta: 'Continuar',
};

/* ------------------------------------------- carrossel da landing --- */
/**
 * Bloco de depoimentos da primeira página, abaixo do hero.
 * Prints e vídeo no mesmo carrossel: o print prova em 5 segundos, o vídeo
 * aprofunda para quem quiser. Intercalar evita que a seção vire uma parede
 * de imagem igual.
 */
export const TESTIMONIALS = {
  title: 'Depoimentos',
  lead: 'Conversas de quem já começou. Arraste para ver.',
  cta: 'Começar agora',
  ctaNote: '',
  video: {
    /** DESLIGADO até ter vídeo próprio (o PLACEHOLDER é do concorrente e não
     *  sobe no deploy). Ligue quando trocar o `src` por uma URL de CDN. */
    enabled: false,
    src: '/videos/PLACEHOLDER-depoimento-03.mp4',
    caption: '7 dias seguindo o plano. O antes e o depois.',
    /** Posição no carrossel: entra depois deste número de prints. */
    after: 2,
  },
};

/**
 * Ponte entre o entregável grátis e o produto pago. Sem ela, o visitante
 * pensa "já tenho o plano, tá bom" — e a distância percebida entre o grátis
 * e os R$ 19,90 fica curta demais para gerar compra.
 */
export const PLAN_BRIDGE =
  'Este plano diz o que fazer em cada dia. Como fazer (qual produto escolher, o que falar, como começar o vídeo) é o que está na Operação TikTok Shop.';

export const PROOF_BLOCK = {
  title: 'Quem já está fazendo',
  lead: 'Conversas de WhatsApp. Toque para ampliar.',
  disclaimer:
    'Conversas com alunos, publicadas com autorização. Resultado individual, não é promessa nem média. Nomes preservados.',
};

/**
 * Vídeo longo da página de resultado.
 * Desligado: a R$ 19,90 ninguém precisa de 2min35 de prova para decidir —
 * isso só adia o clique. Os prints entregam a prova em 5 segundos.
 * Ligue de novo se o ticket subir.
 */
export const RESULT_VIDEO = {
  enabled: false,
  src: '/videos/PLACEHOLDER-depoimento-04.mp4',
  tag: 'História completa',
  title: 'Ela já fez esse caminho.',
  body: 'Mesmo ponto de partida que o seu.',
};

/* --------------------------------------------------- ponte por objetivo --- */

export function audienceMessage(objective?: string) {
  if (objective === 'first') {
    return {
      tag: 'Foco',
      title: 'A primeira comissão muda o jogo.',
      body: 'Depois dela é repetição: você já sabe que funciona pra você. O plano te leva até lá.',
    };
  }
  if (objective === 'extra') {
    return {
      tag: 'Foco',
      title: 'Renda extra, não segundo emprego.',
      body: '30 minutos por dia, no seu ritmo. O plano é montado pra caber nisso.',
    };
  }
  if (objective === 'constant') {
    return {
      tag: 'Foco',
      title: 'Constância é o que muda tudo.',
      body: 'Seu plano é feito pra virar hábito, não pra durar uma semana e parar.',
    };
  }
  return {
    tag: 'Foco',
    title: 'Um passo por vez, na ordem certa.',
    body: 'É exatamente isso que o plano entrega.',
  };
}

/* ------------------------------------------------------------- análise --- */

export const ANALYZING_STEPS = [
  'Olhando o seu caso…',
  'Vendo o que está te travando…',
  'Escolhendo o seu caminho…',
  'Montando o seu plano…',
];

/* ------------------------------------------------------------ resultado --- */

export type ResultProfile = {
  code: string;
  route: string;
  persona: string;
  eyebrow: string;
  verdict: string;
  bottleneck: string;
  steps: string[];
};

export function getResult(answers: Record<string, string>): ResultProfile {
  if (answers.mirror === 'selling' || answers.obstacle === 'conversion') {
    return {
      code: '03',
      route: 'Constância',
      persona: 'Vende de vez em quando',
      eyebrow: 'Você já vendeu. Falta constância.',
      verdict: 'Hoje depende de sorte: um vídeo vai bem, nove não vão, e você não sabe dizer por quê.',
      bottleneck: 'Você muda tudo de uma vez e não descobre o que funcionou.',
      steps: [
        'Escolha 1 coisa pra melhorar: quem assiste até o fim, quem clica ou quem compra',
        'Pegue seu melhor vídeo e refaça 3 vezes, mudando só o começo',
        'Anote o produto, o começo e o formato de cada teste',
        'Descarte o produto que não deu nenhum clique em 3 vídeos',
        'Revise 20 minutos por semana e fique só com o que funcionou',
      ],
    };
  }
  if (answers.mirror === 'publishing' || ['product', 'content'].includes(answers.obstacle)) {
    return {
      code: '02',
      route: 'Primeira Comissão',
      persona: 'Grava, mas não vende',
      eyebrow: 'Você está mais perto do que imagina.',
      verdict: 'O problema não é a sua edição. É o produto: você grava bem um vídeo que nunca ia vender.',
      bottleneck: 'Você escolhe o produto no impulso e grava sem roteiro.',
      steps: [
        'Escolha 3 produtos que dá pra mostrar em 15 segundos',
        'Escreva 3 roteiros: chamar atenção, mostrar funcionando, pedir o clique',
        'Grave os 3 no mesmo dia',
        'Publique em dias diferentes e anote quem assistiu e quem clicou',
        'Descarte o pior e faça 2 versões do melhor',
      ],
    };
  }
  return {
    code: '01',
    route: 'Preparação',
    persona: 'Começando do zero',
    eyebrow: 'Você não está atrasado. Só não começou ainda.',
    verdict: 'Você não precisa saber mais coisa. Precisa de ordem: o que fazer hoje, amanhã e depois.',
    bottleneck: 'Sua conta não está pronta e não existe um primeiro passo definido.',
    steps: [
      'Arrume seu perfil, sua descrição e escolha um assunto',
      'Veja o que falta pra sua conta poder vender',
      'Assista 10 vídeos parecidos e anote só o começo de cada um',
      'Grave 3 vídeos sem produto, só pra perder o medo',
      'Publique o primeiro. Vídeo imperfeito no ar vale mais que perfeito na galeria',
    ],
  };
}

/** Quebra de objeção personalizada pela resposta da pergunta "fear". */
export function objectionBreaker(fear?: string) {
  if (fear === 'late') {
    return {
      title: 'Você acha que já é tarde.',
      body: 'Chegar depois sabendo o que fazer vence chegar antes sem saber. E ainda tem tipo de produto com mais gente querendo comprar do que gente gravando.',
    };
  }
  if (fear === 'money') {
    return {
      title: 'Você acha que precisa investir.',
      body: 'Seu plano de 7 dias custa R$ 0. Usa celular, internet e luz de janela. Investir é decisão do dia 8.',
    };
  }
  if (fear === 'shame') {
    return {
      title: 'Você tem vergonha do que vão falar.',
      body: 'Sua rota funciona sem mostrar o rosto e sem avisar ninguém. Eles descobrem pelo resultado.',
    };
  }
  return {
    title: 'Você teme ser mais um curso.',
    body: 'Não precisa acreditar. Faça o teste: 7 dias, 3 vídeos, os números na tela. Se não acontecer nada, você desiste com prova na mão.',
  };
}

/* -------------------------------------------------------------- método --- */

export const METHOD = {
  name: 'Método C.E.N.A.',
  pillars: [
    { letter: 'C', title: 'Catálogo', body: 'Como escolher produto que vende e paga bem.' },
    { letter: 'E', title: 'Estrutura', body: 'O roteiro que prende a pessoa até o final do vídeo.' },
    { letter: 'N', title: 'Narrativa', body: 'Os 3 primeiros segundos que fazem a pessoa parar de rolar.' },
    { letter: 'A', title: 'Ação', body: 'Como pedir o clique sem parecer propaganda.' },
  ],
};

/** Seção "o que você vai aprender" da página final. Usa os pilares do METHOD. */
export const LEARN = {
  eyebrow: 'O que você vai aprender',
  title: 'O método, em 4 partes',
  body: 'Do produto ao clique. Cada parte resolve um ponto onde a maioria trava.',
};

/* ---------------------------------------------------------- entregáveis --- */
/**
 * Bloco "o que vem junto" da página final — versão condensada.
 * Fica ENTRE o diagnóstico e os dois planos: mostra a pilha de valor primeiro,
 * depois a pessoa escolhe COMO acessa. Sem listar aula por aula: a promessa é
 * decisão rápida a R$ 19,90, não catálogo.
 *
 * Regra: tudo aqui é o conteúdo do Acesso Completo. Se mudar o que cada plano
 * entrega, ajuste também `PLANS` e o `note` abaixo.
 */
export const DELIVERABLES = {
  eyebrow: 'O que vem junto',
  title: 'Curso Nova Era do Digital',
  summary: '3 treinamentos + 2 bônus · 21 aulas',
  method: {
    label: 'Treinamentos principais',
    items: [
      'Iniciando na Nova Era · 6 aulas',
      'TikTok Shop com UGC · 4 aulas',
      'TikTok Shop com Inteligência Artificial · 4 aulas',
    ],
  },
  bonuses: [
    { tag: 'Bônus 1', title: 'TikTok Shop com Lives', body: '5 aulas, da primeira live à venda ao vivo.' },
    { tag: 'Bônus 2', title: 'Edição de Vídeos', body: '2 aulas. CapCut do zero, tudo no celular.' },
  ],
  note: 'Tudo isso está no Acesso Completo.',
};

/* --------------------------------------------------------------- oferta --- */
/**
 * DOIS PLANOS. O de R$ 10 existe para dar contraste ao de R$ 19,90: quem
 * compara os dois vê o que perde por R$ 9,90 a menos e sobe. Por isso o
 * plano parcial lista o que NÃO tem — sem isso ele vira só "o mais barato".
 *
 * ⚠️ PENDÊNCIAS SUAS:
 *   1. `PLANS[0].url` está sem link. Crie o produto de R$ 10 na Ticto e cole
 *      o checkout aqui. Enquanto estiver vazio, o botão fica desabilitado.
 *   2. Os itens de `includes` e `missing` são a minha suposição do conteúdo.
 *      Confirme o que cada plano realmente entrega antes de publicar.
 *
 * Preço, parcelamento e meios de pagamento do plano completo foram conferidos
 * no checkout Ticto em 31/08/2026. Se mudar lá, mude aqui também — preço
 * divergente entre página e checkout derruba conversão e gera disputa.
 */

export type Plan = {
  id: string;
  name: string;
  badge?: string;
  highlight: boolean;
  priceFrom?: string;
  price: string;
  priceNote: string;
  url: string;
  cta: string;
  includes: string[];
  /** Só no plano parcial: o que ele não tem. É isso que faz a comparação. */
  missing?: string[];
};

export const PLANS: Plan[] = [
  {
    id: 'parcial',
    name: 'Acesso Parcial',
    highlight: false,
    price: 'R$ 10,00',
    priceNote: 'Pagamento único',
    url: '', // ⚠️ criar na Ticto e colar aqui
    cta: 'Quero só o essencial',
    includes: [
      'Trilha do Método C.E.N.A. em aulas curtas',
      'Checklist de ativação da conta',
    ],
    missing: [
      'Sem os modelos de roteiro prontos',
      'Sem o banco de ganchos',
      'Sem atualizações',
      'Sem comunidade',
    ],
  },
  {
    id: 'completo',
    name: 'Acesso Completo',
    badge: 'Mais escolhido',
    highlight: true,
    priceFrom: 'R$ 197,00',
    price: 'R$ 19,90',
    priceNote: 'ou 3x de R$ 6,63 · Pix, cartão e Apple Pay',
    url: OFFER_URL,
    cta: 'Quero o acesso completo',
    includes: [
      'Tudo do Acesso Parcial',
      'Modelos de roteiro para os 3 estilos de gravação',
      'Banco de ganchos para os 3 primeiros segundos',
      'Filtro de escolha de produto',
      'Atualizações incluídas',
      'Comunidade e tira-dúvidas',
    ],
  },
];

export const OFFER = {
  eyebrow: 'Pronto',
  product: 'Operação TikTok Shop',
  /**
   * Título da página final. ATENÇÃO: contém promessa de renda com prazo
   * ("faturar até R$ 3 mil ainda este mês"), a pedido do cliente. Isso é
   * income claim: costuma reprovar anúncio no Meta/TikTok e é publicidade
   * enganosa pelo CDC art. 37. Os disclaimers de contrapeso estão em LEGAL
   * e nas páginas /termos e /privacidade. Reveja antes de veicular.
   */
  title: 'Aprenda a faturar até R$ 3 mil ainda este mês com a TikTok Shop.',
  body: 'Não depende de sorte nem de seguidor. Depende de seguir a ordem certa, e ela está aqui.',
  /**
   * ÂNCORA. O valor cheio (R$ 197) é o preço "de" configurado no checkout Ticto.
   * A ordem visual na página é: preço cheio riscado → preço de hoje enorme →
   * parcelamento. O olho compara 197 com 19,90 antes de ler qualquer bullet.
   * Se mudar qualquer número aqui, mude também em PLANS[completo] e no checkout.
   */
  anchor: {
    fromLabel: 'De',
    from: 'R$ 197,00',
    toLabel: 'por',
    price: 'R$ 19,90',
    installments: 'ou 3x de R$ 6,63 sem juros',
    methods: 'Pix · Cartão · Apple Pay',
  },
  /** Recap dentro da caixa, logo acima do botão — repete a pilha de valor curta. */
  recap: [
    '3 treinamentos: Nova Era, UGC e IA',
    'Bônus: TikTok Shop com Lives (5 aulas)',
    'Bônus: Edição de Vídeos no CapCut',
    '21 aulas · acesso imediato',
  ],
  cta: 'Quero o acesso completo',
  ctaNote: 'Acesso imediato após o pagamento',
  /** Reversão de risco DENTRO da caixa, no ponto da decisão. */
  guaranteeLabel: 'Garantia de 7 dias',
  /** Condicionada ao comportamento que queremos — vende melhor e filtra curioso. */
  guarantee: 'Fez os 7 dias e não publicou nada? Devolvemos. Você tem 7 dias para pedir, por lei.',
  /**
   * Reason why. Preço muito abaixo do esperado sem justificativa gera
   * desconfiança ("o que tem de errado?"), não desejo.
   */
  reasonWhy: 'Por que tão barato? Porque meu objetivo é te ver publicar o primeiro vídeo. Quem publica, volta.',
  /**
   * Downsell. Só é renderizado quando PLANS[parcial].url estiver preenchido —
   * enquanto estiver vazio, a página mostra só a oferta principal.
   */
  downsell: 'Só quero o método, sem os bônus (R$ 10)',
};

export const FAQ = [
  {
    q: 'Preciso ter seguidores?',
    a: 'Não. Seguidor não compra: quem compra é quem assiste ao vídeo. O que a plataforma exige muda com o tempo, e o checklist atualizado está no curso.',
  },
  {
    q: 'Funciona sem aparecer?',
    a: 'Sim. Dois dos três jeitos de gravar não usam o rosto: mãos e produto, ou narração com imagens.',
  },
  {
    q: 'Nunca gravei um vídeo. Serve pra mim?',
    a: 'Serve. O primeiro treinamento começa do zero: perfil, primeiro vídeo e os primeiros passos, na ordem.',
  },
  {
    q: 'Como recebo o acesso?',
    a: 'Na hora. Assim que o pagamento é confirmado, o acesso a todas as aulas cai no seu e-mail.',
  },
  {
    q: 'E se eu não gostar?',
    a: 'Fez os 7 primeiros dias, seguiu o plano e não publicou nada? Devolvemos. Você tem 7 dias para pedir, por lei.',
  },
  {
    q: 'Quanto eu vou ganhar?',
    a: 'Não prometemos valor, e desconfie de quem promete. Entregamos o processo. A execução é sua.',
  },
];

export const LEGAL =
  'Conteúdo educacional. Sem garantia de resultado financeiro: comissões dependem de execução, nicho, mercado e consistência. Os depoimentos são reais e individuais, não representam média nem promessa de resultado. Página independente, sem vínculo com o TikTok, a TikTok Shop ou a ByteDance.';

/**
 * Disclaimer exigido de fato pela política de anúncios da Meta: deixar claro
 * que o site não é operado pelo Facebook/Instagram e que, ao sair da
 * plataforma, o conteúdo é de responsabilidade do anunciante.
 */
export const META_DISCLAIMER =
  'Este site não é parte do Facebook nem do Instagram, e não é endossado pela Meta Platforms, Inc. de nenhuma forma. Depois que você sai do Facebook ou do Instagram, a responsabilidade pelo conteúdo é exclusivamente nossa. FACEBOOK, INSTAGRAM e META são marcas registradas da Meta Platforms, Inc.';

/**
 * Dados da empresa usados no rodapé e nas páginas legais.
 * ⚠️ TROQUE pelos dados reais antes de anunciar — a Meta e o TikTok recusam
 * anúncios de páginas sem identificação de responsável e sem política de
 * privacidade acessível.
 */
export const COMPANY = {
  brand: 'Operação TikTok Shop',
  /** ⚠️ PREENCHA antes de anunciar — Meta e TikTok exigem identificação do
   *  responsável e um e-mail de contato acessível na página. Enquanto vazios,
   *  o rodapé e as páginas legais escondem esses campos. */
  legalName: '',
  cnpj: '',
  email: '',
  city: 'São Paulo/SP',
  /** Data da última revisão dos documentos legais. */
  legalUpdatedAt: '31 de agosto de 2026',
};

/** Linha de identificação — só mostra o que estiver preenchido em COMPANY. */
export const companyLine = [
  COMPANY.legalName,
  COMPANY.cnpj && `CNPJ ${COMPANY.cnpj}`,
  COMPANY.email,
]
  .filter(Boolean)
  .join(' · ');
