

# Plano: Ajustar Placeholders dos Inputs

## Problema
Os textos de placeholder nos campos de formulário estão com cor muito forte, confundindo os usuários com texto real digitado.

## Solução
Aplicar duas mudanças globais:
1. Reduzir a opacidade/clarear a cor dos placeholders
2. Adicionar estilo itálico aos placeholders

## Alterações

### 1. `src/index.css`
Adicionar regra global para placeholders:
```css
@layer base {
  *::placeholder {
    @apply italic;
  }
}
```

Ajustar a variável `--muted-foreground` para um cinza mais claro:
- **Modo claro**: de `220 9% 38%` para `220 9% 65%`
- **Modo escuro**: de `220 9% 60%` para `220 9% 50%`

### 2. `src/components/ui/input.tsx`
Atualizar a classe do placeholder:
- De: `placeholder:text-muted-foreground`
- Para: `placeholder:text-muted-foreground/60 placeholder:italic`

### 3. `src/components/ui/textarea.tsx`
Mesma alteração:
- De: `placeholder:text-muted-foreground`
- Para: `placeholder:text-muted-foreground/60 placeholder:italic`

## Resultado
Todos os campos de input e textarea do sistema terão placeholders em cinza claro e itálico, diferenciando claramente do texto digitado pelo usuário.

