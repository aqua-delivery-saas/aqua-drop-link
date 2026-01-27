
# Plano: Esconder Menu Fixo Quando Teclado Mobile Estiver Ativo

## Objetivo
Esconder automaticamente o `BottomNav` (menu fixo inferior) quando o usuário focar em um campo de input no mobile (acionando o teclado virtual), e exibi-lo novamente quando o teclado for fechado.

---

## Solução Proposta

### 1. Criar um hook personalizado `useKeyboardVisible`
**Arquivo novo:** `src/hooks/useKeyboardVisible.tsx`

Este hook detecta quando o teclado virtual está ativo observando:
- Eventos de `focus` e `blur` em elementos de input/textarea
- Mudanças na altura do viewport (técnica complementar para maior compatibilidade)

```tsx
import { useState, useEffect } from "react";

export function useKeyboardVisible() {
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  useEffect(() => {
    // Detecta focus em inputs/textareas
    const handleFocusIn = (e: FocusEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable
      ) {
        // Pequeno delay para garantir que o teclado renderizou
        setTimeout(() => setIsKeyboardVisible(true), 100);
      }
    };

    const handleFocusOut = (e: FocusEvent) => {
      const relatedTarget = e.relatedTarget as HTMLElement | null;
      // Só esconde se o foco não foi para outro input
      if (
        !relatedTarget ||
        (relatedTarget.tagName !== "INPUT" &&
          relatedTarget.tagName !== "TEXTAREA" &&
          !relatedTarget.isContentEditable)
      ) {
        setIsKeyboardVisible(false);
      }
    };

    document.addEventListener("focusin", handleFocusIn);
    document.addEventListener("focusout", handleFocusOut);

    return () => {
      document.removeEventListener("focusin", handleFocusIn);
      document.removeEventListener("focusout", handleFocusOut);
    };
  }, []);

  return isKeyboardVisible;
}
```

**Por que essa abordagem:**
- `focusin`/`focusout` são eventos que "bubblam" (propagam) para o document, então capturam qualquer input na página
- O delay de 100ms garante que o teclado já apareceu antes de esconder o menu
- A verificação do `relatedTarget` evita esconder o menu quando o usuário navega entre campos

---

### 2. Atualizar o componente `BottomNav`
**Arquivo:** `src/components/BottomNav.tsx`

Usar o novo hook para controlar a visibilidade do menu:

```tsx
import { NavLink } from "react-router-dom";
import { LayoutDashboard } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useKeyboardVisible } from "@/hooks/useKeyboardVisible";
import { cn } from "@/lib/utils";

// ... interfaces permanecem iguais

export function BottomNav({ items }: BottomNavProps) {
  const isMobile = useIsMobile();
  const isKeyboardVisible = useKeyboardVisible();

  // Não renderiza em desktop OU quando teclado está ativo no mobile
  if (!isMobile || isKeyboardVisible) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t shadow-lg">
      {/* ... conteúdo existente */}
    </nav>
  );
}
```

---

## Detalhes Técnicos

### Comportamento Esperado
| Estado | Menu Visível |
|--------|--------------|
| Mobile, nenhum input focado | Sim |
| Mobile, input focado (teclado ativo) | Não |
| Mobile, foco sai do input | Sim |
| Desktop (qualquer situação) | Não (já é o comportamento atual) |

### Compatibilidade
- **iOS Safari**: Funciona via `focusin`/`focusout`
- **Android Chrome**: Funciona via `focusin`/`focusout`
- **Outros navegadores mobile**: Cobertos pela mesma lógica

### Transição Suave (Opcional)
Para uma experiência mais fluida, podemos adicionar uma transição ao invés de simplesmente esconder:

```tsx
// Alternativa com transição
<nav className={cn(
  "fixed bottom-0 left-0 right-0 z-50 bg-card border-t shadow-lg transition-transform duration-200",
  isKeyboardVisible ? "translate-y-full" : "translate-y-0"
)}>
```

Isso faz o menu "deslizar" para baixo ao invés de desaparecer abruptamente.

---

## Arquivos a Serem Modificados

| Arquivo | Ação |
|---------|------|
| `src/hooks/useKeyboardVisible.tsx` | Criar (novo hook) |
| `src/components/BottomNav.tsx` | Modificar (usar o hook) |

---

## Resultado Final
- Quando o usuário tocar em qualquer campo de input/textarea no mobile, o menu inferior desaparecerá automaticamente
- Quando o foco sair do input (teclado fechado), o menu reaparecerá
- Sem impacto no comportamento desktop
- Experiência de digitação mobile muito mais limpa e sem obstruções
