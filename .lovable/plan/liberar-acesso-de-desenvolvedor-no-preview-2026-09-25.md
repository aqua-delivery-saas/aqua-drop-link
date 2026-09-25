# Liberar acesso de desenvolvedor no preview

## Objetivo
Permitir que `matheusantosg33@gmail.com` e `ziontecsuporte@gmail.com`, quando autenticados no preview do Lovable, abram páginas protegidas de administrador, distribuidora e cliente.

## Implementação
- Detectar com segurança o ambiente de preview do Lovable, incluindo o preview local, sem ativar a exceção no endereço publicado.
- Centralizar a lista dos dois e-mails autorizados em uma verificação reutilizável.
- Ignorar apenas no preview as barreiras de função e assinatura para esses usuários.
- Manter autenticação obrigatória e preservar integralmente as permissões do banco de dados; o acesso especial não será aplicado em produção.
- Validar compilação e os redirecionamentos das páginas protegidas.

## Detalhes técnicos
A exceção ficará no cliente e afetará `ProtectedRoute`, as consultas de função do estado de autenticação e `SubscriptionGuard`. As políticas de segurança do Supabase continuarão valendo, portanto páginas poderão abrir sem conceder acesso indevido a dados protegidos.
