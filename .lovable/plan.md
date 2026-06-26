## Diagnóstico

Os e-mails de teste ainda chegam com template genérico do Supabase (remetente `noreply@mail.app.supabase.io`) porque:

1. **Domínio `notify.aquadelivery.com.br`:** já está **verificado** ✅
2. **Configuração do projeto:** ainda em status **"Setting up"** — a ativação do hook de e-mails customizados ainda não foi concluída pelo backend da Lovable.

Enquanto o setup do projeto não termina, o Supabase continua enviando os e-mails pelo SMTP padrão dele (templates genéricos), ignorando o `auth-email-hook` que já deployamos.

## Plano

Não é um bug de código — é uma etapa de provisionamento assíncrono. Caminho recomendado:

1. **Aguardar a finalização automática** do setup (geralmente poucos minutos após verificação de DNS). Acompanhar em **Cloud → Emails**.
2. Quando o status mudar para **Ativo**, refazer o teste de "Esqueci minha senha" — o e-mail deve chegar do remetente `noreply@notify.aquadelivery.com.br` com o template AquaDelivery em azul.
3. Se após ~15 minutos o status continuar travado em "Setting up", eu re-deploy o `auth-email-hook` para forçar o reconcile do backend (ele detecta automaticamente e completa a ativação).
4. Validar entrega consultando `email_send_log` (tabela de auditoria) para confirmar que os e-mails passaram pela fila customizada e não pelo SMTP padrão.

## Sem alterações de código nesta etapa

Os templates, o hook e o domínio já estão corretos. A ação é apenas aguardar/monitorar e, se necessário, redisparar o deploy do hook.

<presentation-actions>
<presentation-open-email>Abrir configurações de e-mail</presentation-open-email>
</presentation-actions>
