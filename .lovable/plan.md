
# Plano: Melhorar Visibilidade dos Placeholders

## Objetivo
Tornar os textos de placeholder dos inputs mais visíveis e opacos, melhorando a experiência do usuário ao preencher formulários.

---

## Problema Atual
Os placeholders utilizam a cor `--muted-foreground`:
- **Modo claro**: `220 9% 46%` (cinza médio, pode parecer muito claro)
- **Modo escuro**: `220 9% 70%` (cinza claro)

Esses valores podem dificultar a leitura do texto de placeholder, especialmente em condições de luz ambiente variada.

---

## Solução Proposta

Ajustar os valores de `--muted-foreground` no arquivo `src/index.css` para cores mais escuras/visíveis:

| Modo | Valor Atual | Novo Valor | Mudança |
|------|-------------|------------|---------|
| Claro | `220 9% 46%` | `220 9% 38%` | -8% luminosidade (mais escuro) |
| Escuro | `220 9% 70%` | `220 9% 60%` | -10% luminosidade (menos brilhante) |

---

## Arquivo a Modificar

**`src/index.css`**

### Alteração 1 - Modo Claro (linha 33):
```css
/* De: */
--muted-foreground: 220 9% 46%;

/* Para: */
--muted-foreground: 220 9% 38%;
```

### Alteração 2 - Modo Escuro (linha 88):
```css
/* De: */
--muted-foreground: 220 9% 70%;

/* Para: */
--muted-foreground: 220 9% 60%;
```

---

## Impacto Visual

A mudança afeta todos os elementos que usam `text-muted-foreground`, incluindo:
- Placeholders de inputs e textareas
- Textos secundários/descritivos
- Labels de menor importância

Isso garante consistência visual em todo o sistema.

---

## Resultado Esperado
- Placeholders mais legíveis e com melhor contraste
- Melhor acessibilidade visual
- Experiência de preenchimento de formulários mais agradável
