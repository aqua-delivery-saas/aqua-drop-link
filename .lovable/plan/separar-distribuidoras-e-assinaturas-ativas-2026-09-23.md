# Separar distribuidoras e assinaturas ativas

## Objetivo
Corrigir os indicadores administrativos para que cadastro ativo e assinatura paga sejam métricas diferentes.

## Alterações
- Exibir **Distribuidoras** como o total de distribuidoras cadastradas, sem depender do campo de ativação.
- Considerar **Assinaturas Ativas** somente quando a assinatura estiver ativa, dentro da vigência e possuir pagamento confirmado para o período vigente.
- Calcular a **Taxa de Ativação** usando assinaturas realmente ativas e pagas sobre o total de distribuidoras.
- Manter a exclusão das contas de teste já usada pelo painel.
- Ajustar os textos auxiliares dos cartões para deixar clara a diferença entre cadastro e assinatura.

## Detalhes técnicos
- Cruzar `subscriptions` com pagamentos de status `paid` e validar `expires_at`.
- Tratar assinatura sem vencimento como válida apenas quando houver pagamento confirmado.
- Reutilizar o mesmo critério nos indicadores principais e avançados para evitar números divergentes.
- Validar o resultado no painel administrativo e conferir erros de execução.
