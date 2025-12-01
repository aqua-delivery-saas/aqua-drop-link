import { z } from 'zod';

// Validação de CNPJ
function validateCNPJ(cnpj: string): boolean {
  if (cnpj.length !== 14) return false;
  
  // Rejeita CNPJs com todos os dígitos iguais
  if (/^(\d)\1+$/.test(cnpj)) return false;
  
  // Validação dos dígitos verificadores
  let sum = 0;
  let pos = 5;
  
  for (let i = 0; i < 12; i++) {
    sum += parseInt(cnpj.charAt(i)) * pos;
    pos = pos === 2 ? 9 : pos - 1;
  }
  
  let result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (result !== parseInt(cnpj.charAt(12))) return false;
  
  sum = 0;
  pos = 6;
  
  for (let i = 0; i < 13; i++) {
    sum += parseInt(cnpj.charAt(i)) * pos;
    pos = pos === 2 ? 9 : pos - 1;
  }
  
  result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  return result === parseInt(cnpj.charAt(13));
}

// Schema de CNPJ
export const cnpjSchema = z.string()
  .min(14, 'CNPJ deve ter 14 dígitos')
  .max(18, 'CNPJ inválido')
  .transform(val => val.replace(/[^\d]/g, ''))
  .refine(val => val.length === 14, {
    message: 'CNPJ deve ter 14 dígitos'
  })
  .refine(validateCNPJ, {
    message: 'CNPJ inválido'
  });

// Schema de Telefone/WhatsApp brasileiro
export const phoneSchema = z.string()
  .min(10, 'Telefone inválido')
  .max(15, 'Telefone inválido')
  .transform(val => val.replace(/[^\d]/g, ''))
  .refine(val => val.length === 10 || val.length === 11, {
    message: 'Telefone deve ter 10 ou 11 dígitos (DDD + número)'
  });

export const whatsappSchema = phoneSchema
  .refine(val => val.length === 11 && val[2] === '9', {
    message: 'WhatsApp deve ter 11 dígitos e começar com 9 após o DDD'
  });

// Schema de CEP
export const cepSchema = z.string()
  .min(8, 'CEP inválido')
  .max(9, 'CEP inválido')
  .transform(val => val.replace(/[^\d]/g, ''))
  .refine(val => val.length === 8, {
    message: 'CEP deve ter 8 dígitos'
  });

// Schema de Endereço completo
export const addressSchema = z.object({
  cep: cepSchema,
  street: z.string().min(3, 'Rua deve ter ao menos 3 caracteres').max(200, 'Rua muito longa'),
  number: z.string().min(1, 'Número obrigatório').max(10, 'Número muito longo'),
  complement: z.string().max(100, 'Complemento muito longo').optional(),
  neighborhood: z.string().min(3, 'Bairro deve ter ao menos 3 caracteres').max(100, 'Bairro muito longo'),
  city: z.string().min(2, 'Cidade deve ter ao menos 2 caracteres').max(100, 'Cidade muito longa'),
  state: z.string().length(2, 'Estado deve ter 2 letras (ex: SP)').toUpperCase(),
});

// Schema de Email
export const emailSchema = z.string()
  .email('E-mail inválido')
  .toLowerCase()
  .max(255, 'E-mail muito longo');

// Schema de Senha
export const passwordSchema = z.string()
  .min(6, 'Senha deve ter no mínimo 6 caracteres')
  .max(100, 'Senha muito longa')
  .regex(/[A-Z]/, 'Senha deve conter ao menos uma letra maiúscula')
  .regex(/[0-9]/, 'Senha deve conter ao menos um número');

// Schema simplificado de senha (para casos onde não é obrigatório a complexidade)
export const simplePasswordSchema = z.string()
  .min(6, 'Senha deve ter no mínimo 6 caracteres')
  .max(100, 'Senha muito longa');

// Schema de Nome
export const nameSchema = z.string()
  .min(3, 'Nome deve ter ao menos 3 caracteres')
  .max(100, 'Nome muito longo')
  .regex(/^[a-zA-ZÀ-ÿ\s]+$/, 'Nome deve conter apenas letras');

// Formatadores
export const formatCNPJ = (value: string): string => {
  const cnpj = value.replace(/[^\d]/g, '');
  return cnpj
    .replace(/^(\d{2})(\d)/, '$1.$2')
    .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1/$2')
    .replace(/(\d{4})(\d)/, '$1-$2')
    .slice(0, 18);
};

export const formatPhone = (value: string): string => {
  const phone = value.replace(/[^\d]/g, '');
  if (phone.length <= 10) {
    return phone
      .replace(/^(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{4})(\d)/, '$1-$2')
      .slice(0, 14);
  } else {
    return phone
      .replace(/^(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .slice(0, 15);
  }
};

export const formatCEP = (value: string): string => {
  const cep = value.replace(/[^\d]/g, '');
  return cep.replace(/^(\d{5})(\d)/, '$1-$2').slice(0, 9);
};

// Schema de Agendamento de Entrega
export const scheduledDeliverySchema = z.object({
  scheduledDate: z.date({
    required_error: "Selecione uma data",
  }).refine((date) => date > new Date(), {
    message: "A data deve ser no futuro",
  }),
  scheduledTime: z.string({
    required_error: "Selecione um horário",
  }).regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, "Horário inválido"),
  productId: z.string().min(1, "Selecione um produto"),
  quantity: z.number().min(1, "Quantidade mínima é 1"),
  address: z.string().min(5, "Endereço obrigatório"),
  paymentMethod: z.string().min(1, "Selecione forma de pagamento"),
});