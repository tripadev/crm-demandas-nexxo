/**
 * CRM DEMANDAS - NEXXO | DADOS INICIAIS
 * Estrutura atualizada com IDs únicos (DEM-XXXX), controle de prazos internos e comentários
 */

const INITIAL_DATA = {
  columns: [
    { id: 'demandas', title: 'Demandas', color: '#3b82f6', count: 0 },
    { id: 'conteudo', title: 'Conteúdo', color: '#8b5cf6', count: 0 },
    { id: 'designer', title: 'Designer', color: '#f97316', count: 0 },
    { id: 'trafego', title: 'Tráfego', color: '#06b6d4', count: 0 },
    { id: 'aprovacao', title: 'Aprovação', color: '#eab308', count: 0 },
    { id: 'entrega', title: 'Entrega', color: '#10b981', count: 0 }
  ],

  members: [
    { id: 'm1', name: 'Samuel Gestor', role: 'Head de Operações' },
    { id: 'm2', name: 'Larissa Copy', role: 'Redatora & Conteúdo' },
    { id: 'm3', name: 'Matheus Designer', role: 'Designer Gráfico' },
    { id: 'm4', name: 'Beatriz Atendimento', role: 'Sucesso do Franqueado' },
    { id: 'm5', name: 'Lucas Tráfego', role: 'Gestor de Tráfego Pago' }
  ],

  clients: [
    { id: 'c1', name: 'Nexxo Jardins', workspace: 'nexxo-jardins', phone: '(11) 98765-4321', email: 'jardins@nexxofranquias.com.br', linkActive: true },
    { id: 'c2', name: 'Nexxo Moema', workspace: 'nexxo-moema', phone: '(11) 97654-3210', email: 'moema@nexxofranquias.com.br', linkActive: true },
    { id: 'c3', name: 'Nexxo Barra da Tijuca', workspace: 'nexxo-barra', phone: '(21) 99887-7665', email: 'barra@nexxofranquias.com.br', linkActive: true },
    { id: 'c4', name: 'Nexxo Alphaville', workspace: 'nexxo-alphaville', phone: '(11) 96543-2109', email: 'alphaville@nexxofranquias.com.br', linkActive: true },
    { id: 'c5', name: 'Nexxo Savassi', workspace: 'nexxo-savassi', phone: '(31) 98432-1098', email: 'savassi@nexxofranquias.com.br', linkActive: true },
    { id: 'c6', name: 'Nexxo Batel', workspace: 'nexxo-batel', phone: '(41) 99123-4567', email: 'batel@nexxofranquias.com.br', linkActive: false }
  ],

  tags: [
    { id: 't1', name: 'Social Media', bg: '#eff6ff', color: '#1d4ed8' },
    { id: 't2', name: 'Campanha Paga', bg: '#ecfeff', color: '#0e7490' },
    { id: 't3', name: 'Material Impresso', bg: '#fff7ed', color: '#c2410c' },
    { id: 't4', name: 'Vídeo / Reels', bg: '#fdf4ff', color: '#a21caf' },
    { id: 't5', name: 'Urgente Franquia', bg: '#fef2f2', color: '#b91c1c' }
  ],

  cards: [
    {
      id: 'DEM-1001',
      title: 'Campanha de Inauguração - Carrossel de 5 Lâminas',
      description: 'Criação de post carrossel apresentando a nova unidade, promoções de abertura e localização.',
      clientName: 'Nexxo Jardins',
      workspace: 'nexxo-jardins',
      statusChip: 'Pendente de Análise',
      columnId: 'demandas',
      priority: 'Alta',
      assignees: ['m1'],
      submittedAt: '16/09/2026 às 08:30',
      teamDeadline: null, // Sem prazo definido ainda: renderizará como Demanda [Cliente] Pendente!
      teamDeadlineFormatted: 'Pendente de Definição',
      isPendingAnalysis: true,
      shareLinkActive: true,
      commentsCount: 2,
      linksCount: 1,
      checklist: [
        { text: 'Validar briefing detalhado com franqueado', done: false },
        { text: 'Definir data de entrega oficial pela equipe NEXXO', done: false }
      ],
      comments: [
        {
          id: 'cmt-1',
          author: 'Samuel Gestor',
          text: 'Demanda recebida da unidade Jardins. Analisando escopo para definir o prazo de entrega.',
          timestamp: '16/09/2026 às 09:10'
        },
        {
          id: 'cmt-2',
          author: 'Larissa Copy',
          text: 'Já fiz o primeiro contato para alinhar os textos de abertura.',
          timestamp: '16/09/2026 às 10:05'
        }
      ],
      driveLink: 'https://sistema.nexxoplat.com/crm',
      history: [
        { time: '08:30', text: 'Demanda enviada pelo franqueado Nexxo Jardins' }
      ]
    },
    {
      id: 'DEM-1002',
      title: 'Roteiro de Depoimento de Clientes para Reels',
      description: 'Elaborar roteiro com gancho de 3 segundos focado no público corporativo da região de Moema.',
      clientName: 'Nexxo Moema',
      workspace: 'nexxo-moema',
      statusChip: 'Em Pesquisa',
      columnId: 'conteudo',
      priority: 'Média',
      assignees: ['m2'],
      submittedAt: '15/09/2026 às 14:20',
      teamDeadline: '2026-09-24',
      teamDeadlineFormatted: '24 Set 2026',
      isPendingAnalysis: false,
      shareLinkActive: true,
      commentsCount: 1,
      linksCount: 1,
      checklist: [
        { text: 'Pesquisar cases de sucesso da unidade', done: true },
        { text: 'Montar estrutura Hook-Story-Offer', done: false }
      ],
      comments: [
        {
          id: 'cmt-3',
          author: 'Larissa Copy',
          text: 'Prazo estipulado para entrega: 24/09. Roteiro estruturado.',
          timestamp: '15/09/2026 às 15:00'
        }
      ],
      driveLink: 'https://sistema.nexxoplat.com/crm',
      history: [
        { time: '14:20', text: 'Demanda enviada pelo franqueado' },
        { time: '15:00', text: 'Prazo oficial definido pela equipe: 24 Set 2026' },
        { time: '16:00', text: 'Movido para coluna Conteúdo' }
      ]
    },
    {
      id: 'DEM-1003',
      title: 'Design de Totem e Banners para Ponto Físico',
      description: 'Adaptação das peças promocionais no formato 80x200cm com sangria e marcas de corte.',
      clientName: 'Nexxo Alphaville',
      workspace: 'nexxo-alphaville',
      statusChip: 'No Prazo',
      columnId: 'designer',
      priority: 'Alta',
      assignees: ['m3'],
      submittedAt: '14/09/2026 às 11:00',
      teamDeadline: '2026-09-21',
      teamDeadlineFormatted: '21 Set 2026',
      isPendingAnalysis: false,
      shareLinkActive: true,
      commentsCount: 2,
      linksCount: 2,
      checklist: [
        { text: 'Verificar medidas da gráfica local', done: true },
        { text: 'Desenvolver layout no Illustrator', done: true },
        { text: 'Fechar PDF/X-1a para impressão', done: false }
      ],
      comments: [
        {
          id: 'cmt-4',
          author: 'Matheus Designer',
          text: 'Arquivo base aprovado, finalizando marcas de corte da gráfica.',
          timestamp: '15/09/2026 às 11:30'
        }
      ],
      driveLink: 'https://sistema.nexxoplat.com/crm',
      history: [
        { time: '11:00', text: 'Demanda enviada pelo franqueado' },
        { time: '11:45', text: 'Prazo oficial definido pela equipe: 21 Set 2026' }
      ]
    },
    {
      id: 'DEM-1004',
      title: 'Configuração de Campanha Meta Ads - Foco em Leads',
      description: 'Criar campanha direcionada para raio de 5km da unidade Barra, com público segmentado.',
      clientName: 'Nexxo Barra da Tijuca',
      workspace: 'nexxo-barra',
      statusChip: 'Em Pesquisa',
      columnId: 'trafego',
      priority: 'Média',
      assignees: ['m5'],
      submittedAt: '15/09/2026 às 16:30',
      teamDeadline: '2026-09-25',
      teamDeadlineFormatted: '25 Set 2026',
      isPendingAnalysis: false,
      shareLinkActive: true,
      commentsCount: 1,
      linksCount: 1,
      checklist: [
        { text: 'Validar Pixel e conversões da franquia', done: true },
        { text: 'Subir anúncios de teste A/B', done: false }
      ],
      comments: [
        {
          id: 'cmt-5',
          author: 'Lucas Tráfego',
          text: 'Públicos segmentados no Gerenciador de Anúncios.',
          timestamp: '16/09/2026 às 11:00'
        }
      ],
      driveLink: 'https://sistema.nexxoplat.com/crm',
      history: [
        { time: '16:30', text: 'Demanda enviada pelo franqueado' }
      ]
    },
    {
      id: 'DEM-1005',
      title: 'Validação Final dos Criativos de Promoção Semanal',
      description: 'Peças prontas aguardando conferência de datas e aprovação expressa do franqueado.',
      clientName: 'Nexxo Savassi',
      workspace: 'nexxo-savassi',
      statusChip: 'No Prazo',
      columnId: 'aprovacao',
      priority: 'Baixa',
      assignees: ['m4'],
      submittedAt: '13/09/2026 às 09:00',
      teamDeadline: '2026-09-19',
      teamDeadlineFormatted: '19 Set 2026',
      isPendingAnalysis: false,
      shareLinkActive: true,
      commentsCount: 3,
      linksCount: 1,
      checklist: [
        { text: 'Enviar prévia via portal para validação', done: true },
        { text: 'Aguardar aceite formal', done: false }
      ],
      comments: [
        {
          id: 'cmt-6',
          author: 'Beatriz Atendimento',
          text: 'Prévias compartilhadas no portal da Franquia Savassi.',
          timestamp: '15/09/2026 às 17:00'
        }
      ],
      driveLink: 'https://sistema.nexxoplat.com/crm',
      history: [
        { time: '09:00', text: 'Demanda enviada pelo franqueado' }
      ]
    },
    {
      id: 'DEM-1006',
      title: 'Kit Completo de Boas-Vindas da Franquia',
      description: 'Entrega final com manuais, arquivos editáveis em nuvem e templates do Canva.',
      clientName: 'Nexxo Batel',
      workspace: 'nexxo-batel',
      statusChip: 'Concluído',
      columnId: 'entrega',
      priority: 'Média',
      assignees: ['m1'],
      submittedAt: '10/09/2026 às 10:00',
      teamDeadline: '2026-09-15',
      teamDeadlineFormatted: '15 Set 2026',
      isPendingAnalysis: false,
      shareLinkActive: false, // Exemplo de link desativado
      commentsCount: 2,
      linksCount: 1,
      checklist: [
        { text: 'Organizar pastas de entrega', done: true },
        { text: 'Aviso disparado para o franqueado', done: true }
      ],
      comments: [
        {
          id: 'cmt-7',
          author: 'Samuel Gestor',
          text: 'Entrega concluída com sucesso e notificada.',
          timestamp: '15/09/2026 às 16:30'
        }
      ],
      driveLink: 'https://sistema.nexxoplat.com/crm',
      history: [
        { time: '10:00', text: 'Demanda enviada pelo franqueado' },
        { time: '16:30', text: 'Demanda finalizada na coluna Entrega' }
      ]
    }
  ]
};
