// Mock data structure for Cidade and Distribuidora with SEO optimization

export interface Cidade {
  id: number;
  nome: string;
  estado: string;
  pais: string;
  slug: string;
  ativo: boolean;
}

export interface Distribuidora {
  id: number;
  nome: string;
  slug: string;
  cnpj: string;
  whatsapp: string;
  
  // Structured address
  rua: string;
  numero: string;
  bairro: string;
  cidade_id: number;
  cep: string;
  latitude?: number;
  longitude?: number;
  
  // SEO metadata
  descricao_curta: string;
  palavras_chave: string;
  email_contato?: string;
  telefone?: string;
  site?: string;
  
  // Business configuration
  businessHours: Array<{
    id: number;
    dia_semana: string;
    hora_abertura: string;
    hora_fechamento: string;
    ativo: boolean;
  }>;
  
  discounts: {
    tier1: { min: number; max: number; percentage: number };
    tier2: { min: number; max: number; percentage: number };
  };
  
  loyalty: {
    enabled: boolean;
    ordersRequired: number;
    reward: string;
  };
  
  products: Array<{
    id: number;
    name: string;
    litros: number;
    price: number;
    foto?: string;
  }>;
}

// Mock cities data
export const mockCidades: Cidade[] = [
  {
    id: 1,
    nome: "Rio de Janeiro",
    estado: "RJ",
    pais: "Brasil",
    slug: "rio-de-janeiro",
    ativo: true
  },
  {
    id: 2,
    nome: "São Paulo",
    estado: "SP",
    pais: "Brasil",
    slug: "sao-paulo",
    ativo: true
  },
  {
    id: 3,
    nome: "Belo Horizonte",
    estado: "MG",
    pais: "Brasil",
    slug: "belo-horizonte",
    ativo: true
  },
  {
    id: 4,
    nome: "Brasília",
    estado: "DF",
    pais: "Brasil",
    slug: "brasilia",
    ativo: true
  }
];

// Mock distribuidoras data
export const mockDistribuidoras: Distribuidora[] = [
  {
    id: 1,
    nome: "Distribuidora Água Pura",
    slug: "distribuidora-agua-pura",
    cnpj: "12.345.678/0001-90",
    whatsapp: "5521999999999",
    rua: "Rua das Palmeiras",
    numero: "123",
    bairro: "Copacabana",
    cidade_id: 1,
    cep: "22070-000",
    latitude: -22.9711,
    longitude: -43.1826,
    descricao_curta: "Distribuidora de água mineral em Copacabana com entrega rápida e preços competitivos. Atendemos toda a zona sul do Rio de Janeiro.",
    palavras_chave: "água mineral, galão de água, entrega de água, água copacabana, distribuidora água rio",
    email_contato: "contato@aguapura.com.br",
    telefone: "21 3333-4444",
    site: "https://aguapura.com.br",
    businessHours: [
      { id: 1, dia_semana: "Segunda-feira", hora_abertura: "08:00", hora_fechamento: "18:00", ativo: true },
      { id: 2, dia_semana: "Terça-feira", hora_abertura: "08:00", hora_fechamento: "18:00", ativo: true },
      { id: 3, dia_semana: "Quarta-feira", hora_abertura: "08:00", hora_fechamento: "18:00", ativo: true },
      { id: 4, dia_semana: "Quinta-feira", hora_abertura: "08:00", hora_fechamento: "18:00", ativo: true },
      { id: 5, dia_semana: "Sexta-feira", hora_abertura: "08:00", hora_fechamento: "18:00", ativo: true },
      { id: 6, dia_semana: "Sábado", hora_abertura: "08:00", hora_fechamento: "13:00", ativo: true },
      { id: 7, dia_semana: "Domingo", hora_abertura: "00:00", hora_fechamento: "00:00", ativo: false }
    ],
    discounts: {
      tier1: { min: 5, max: 10, percentage: 5 },
      tier2: { min: 11, max: 999, percentage: 10 }
    },
    loyalty: {
      enabled: true,
      ordersRequired: 10,
      reward: "1 galão grátis"
    },
    products: [
      { id: 1, name: "Água Pura", litros: 20, price: 15.00, foto: "https://images.unsplash.com/photo-1523362628745-0c100150b504?w=200" },
      { id: 2, name: "Água Pura", litros: 10, price: 10.00, foto: "https://images.unsplash.com/photo-1523362628745-0c100150b504?w=200" }
    ]
  },
  {
    id: 2,
    nome: "Água Cristal Express",
    slug: "agua-cristal-express",
    cnpj: "98.765.432/0001-21",
    whatsapp: "5521988888888",
    rua: "Avenida Atlântica",
    numero: "456",
    bairro: "Ipanema",
    cidade_id: 1,
    cep: "22021-000",
    latitude: -22.9838,
    longitude: -43.1912,
    descricao_curta: "Entrega expressa de água mineral em Ipanema e Leblon. Garantia de qualidade e pontualidade na entrega.",
    palavras_chave: "água mineral ipanema, entrega expressa água, galão água leblon, distribuidora ipanema",
    email_contato: "contato@cristalexpress.com.br",
    telefone: "21 2222-3333",
    businessHours: [
      { id: 1, dia_semana: "Segunda-feira", hora_abertura: "07:00", hora_fechamento: "19:00", ativo: true },
      { id: 2, dia_semana: "Terça-feira", hora_abertura: "07:00", hora_fechamento: "19:00", ativo: true },
      { id: 3, dia_semana: "Quarta-feira", hora_abertura: "07:00", hora_fechamento: "19:00", ativo: true },
      { id: 4, dia_semana: "Quinta-feira", hora_abertura: "07:00", hora_fechamento: "19:00", ativo: true },
      { id: 5, dia_semana: "Sexta-feira", hora_abertura: "07:00", hora_fechamento: "19:00", ativo: true },
      { id: 6, dia_semana: "Sábado", hora_abertura: "08:00", hora_fechamento: "14:00", ativo: true },
      { id: 7, dia_semana: "Domingo", hora_abertura: "00:00", hora_fechamento: "00:00", ativo: false }
    ],
    discounts: {
      tier1: { min: 6, max: 12, percentage: 7 },
      tier2: { min: 13, max: 999, percentage: 12 }
    },
    loyalty: {
      enabled: true,
      ordersRequired: 8,
      reward: "1 galão grátis"
    },
    products: [
      { id: 1, name: "Água Cristal", litros: 20, price: 18.00, foto: "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=200" },
      { id: 2, name: "Água Cristal", litros: 10, price: 12.00, foto: "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=200" }
    ]
  },
  {
    id: 3,
    nome: "Água Paulista Prime",
    slug: "agua-paulista-prime",
    cnpj: "11.222.333/0001-44",
    whatsapp: "5511977777777",
    rua: "Avenida Paulista",
    numero: "1000",
    bairro: "Bela Vista",
    cidade_id: 2,
    cep: "01310-100",
    latitude: -23.5617,
    longitude: -46.6560,
    descricao_curta: "Distribuidora premium de água mineral na Paulista. Entrega 24h e produtos de alta qualidade.",
    palavras_chave: "água mineral são paulo, distribuidora paulista, galão água sp, entrega 24h água",
    email_contato: "contato@paulistaprime.com.br",
    telefone: "11 4444-5555",
    businessHours: [
      { id: 1, dia_semana: "Segunda-feira", hora_abertura: "00:00", hora_fechamento: "23:59", ativo: true },
      { id: 2, dia_semana: "Terça-feira", hora_abertura: "00:00", hora_fechamento: "23:59", ativo: true },
      { id: 3, dia_semana: "Quarta-feira", hora_abertura: "00:00", hora_fechamento: "23:59", ativo: true },
      { id: 4, dia_semana: "Quinta-feira", hora_abertura: "00:00", hora_fechamento: "23:59", ativo: true },
      { id: 5, dia_semana: "Sexta-feira", hora_abertura: "00:00", hora_fechamento: "23:59", ativo: true },
      { id: 6, dia_semana: "Sábado", hora_abertura: "00:00", hora_fechamento: "23:59", ativo: true },
      { id: 7, dia_semana: "Domingo", hora_abertura: "00:00", hora_fechamento: "23:59", ativo: true }
    ],
    discounts: {
      tier1: { min: 10, max: 20, percentage: 10 },
      tier2: { min: 21, max: 999, percentage: 15 }
    },
    loyalty: {
      enabled: true,
      ordersRequired: 12,
      reward: "2 galões grátis"
    },
    products: [
      { id: 1, name: "Água Paulista", litros: 20, price: 20.00, foto: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=200" },
      { id: 2, name: "Água Paulista", litros: 10, price: 13.00, foto: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=200" }
    ]
  }
];

// Helper functions
export const getCidadeBySlug = (slug: string): Cidade | undefined => {
  return mockCidades.find(c => c.slug === slug);
};

export const getDistribuidoraBySlug = (slug: string): Distribuidora | undefined => {
  return mockDistribuidoras.find(d => d.slug === slug);
};

export const getDistribuidorasByCidade = (cidadeId: number): Distribuidora[] => {
  return mockDistribuidoras.filter(d => d.cidade_id === cidadeId);
};

export const getCidadeById = (id: number): Cidade | undefined => {
  return mockCidades.find(c => c.id === id);
};
