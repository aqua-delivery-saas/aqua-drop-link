# Link direto do pedido no WhatsApp

## Alteração
- Incluir no fim da mensagem automática um link para abrir o pedido recebido no painel da distribuidora.
- Usar o identificador do pedido no endereço para que a tela de pedidos destaque e abra o pedido correto.
- Manter a página protegida pelo login da distribuidora.

## Implementação
- Gerar o link a partir da origem pública configurada para o aplicativo e do ID do pedido criado.
- Fazer a página de pedidos reconhecer o ID recebido no endereço, selecionar a aba adequada e levar o pedido à área visível.
- Preservar o restante do texto atual do WhatsApp.

## Verificação
- Confirmar a compilação e testar a abertura do link no painel.
