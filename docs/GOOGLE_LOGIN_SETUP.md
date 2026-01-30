# Guia Completo: Configuração do Login com Google

Este guia detalha todas as etapas necessárias para ativar o login com Google no ambiente de produção do AquaDelivery.

---

## 📋 Pré-requisitos

- Acesso ao [Google Cloud Console](https://console.cloud.google.com/)
- Acesso ao [Supabase Dashboard](https://supabase.com/dashboard)
- Domínio de produção: `app.aquadelivery.com.br`

---

## Parte 1: Configuração no Google Cloud Console

### Passo 1.1: Acessar o Projeto

1. Acesse [console.cloud.google.com](https://console.cloud.google.com/)
2. No canto superior esquerdo, clique no seletor de projeto
3. Selecione o projeto existente ou crie um novo:
   - Clique em **"Novo Projeto"**
   - Nome sugerido: `AquaDelivery Production`
   - Clique em **"Criar"**

```
┌─────────────────────────────────────────┐
│  Google Cloud Console                   │
│  ┌─────────────────────────────────┐    │
│  │ 📁 Selecionar um projeto    ▼  │    │
│  └─────────────────────────────────┘    │
│                                         │
│  Projetos recentes:                     │
│  • AquaDelivery Production ✓            │
│  • Outro projeto                        │
│                                         │
│  [+ Novo Projeto]                       │
└─────────────────────────────────────────┘
```

---

### Passo 1.2: Configurar a Tela de Consentimento OAuth

1. No menu lateral, navegue para:
   - **APIs e Serviços** → **Tela de consentimento OAuth**

2. Selecione o tipo de usuário:
   - **Externo** (para usuários fora da sua organização)
   - Clique em **"Criar"**

```
┌─────────────────────────────────────────┐
│  Tela de consentimento OAuth            │
│                                         │
│  Tipo de usuário:                       │
│  ○ Interno                              │
│  ● Externo ← Selecione esta opção       │
│                                         │
│  [Criar]                                │
└─────────────────────────────────────────┘
```

3. Preencha as informações do aplicativo:

| Campo | Valor |
|-------|-------|
| Nome do app | `AquaDelivery` |
| E-mail de suporte do usuário | `seu-email@exemplo.com` |
| Logotipo do app | (opcional - logo da AquaDelivery) |

4. **Domínios autorizados** (IMPORTANTE!):
   - Clique em **"Adicionar domínio"**
   - Adicione: `aquadelivery.com.br`
   - Adicione: `supabase.co`

```
┌─────────────────────────────────────────┐
│  Domínios autorizados                   │
│                                         │
│  ┌─────────────────────────────────┐    │
│  │ aquadelivery.com.br         ✕  │    │
│  └─────────────────────────────────┘    │
│  ┌─────────────────────────────────┐    │
│  │ supabase.co                 ✕  │    │
│  └─────────────────────────────────┘    │
│                                         │
│  [+ Adicionar domínio]                  │
└─────────────────────────────────────────┘
```

5. Informações de contato do desenvolvedor:
   - Adicione seu e-mail de desenvolvedor

6. Clique em **"Salvar e continuar"**

---

### Passo 1.3: Configurar Escopos

1. Na seção **Escopos**, clique em **"Adicionar ou remover escopos"**

2. Selecione os seguintes escopos:

| Escopo | Descrição |
|--------|-----------|
| `.../auth/userinfo.email` | Ver endereço de e-mail |
| `.../auth/userinfo.profile` | Ver informações do perfil |
| `openid` | Associar você às suas informações pessoais |

```
┌─────────────────────────────────────────┐
│  Adicionar escopos                      │
│                                         │
│  ☑ .../auth/userinfo.email              │
│  ☑ .../auth/userinfo.profile            │
│  ☑ openid                               │
│                                         │
│  [Atualizar]                            │
└─────────────────────────────────────────┘
```

3. Clique em **"Atualizar"** e depois **"Salvar e continuar"**

---

### Passo 1.4: Usuários de Teste (Modo de Desenvolvimento)

> ⚠️ **Nota**: Enquanto o app estiver em modo "Teste", apenas usuários adicionados aqui poderão fazer login.

1. Clique em **"Adicionar usuários"**
2. Adicione os e-mails dos testadores
3. Clique em **"Salvar e continuar"**

---

### Passo 1.5: Publicar o App (Para Produção)

> 🚀 **Para produção**: O app precisa ser publicado para que qualquer usuário possa fazer login.

1. Volte para a **Tela de consentimento OAuth**
2. Na seção **Status de publicação**, clique em **"Publicar aplicativo"**
3. Confirme a publicação

```
┌─────────────────────────────────────────┐
│  Status de publicação                   │
│                                         │
│  Status atual: Em teste                 │
│                                         │
│  [Publicar aplicativo]                  │
│                                         │
│  ⚠️ Isso permite que qualquer usuário   │
│  com uma conta Google faça login.       │
└─────────────────────────────────────────┘
```

---

### Passo 1.6: Criar Credenciais OAuth

1. No menu lateral: **APIs e Serviços** → **Credenciais**

2. Clique em **"+ Criar credenciais"** → **"ID do cliente OAuth"**

```
┌─────────────────────────────────────────┐
│  Criar credenciais                      │
│                                         │
│  • Chave de API                         │
│  • ID do cliente OAuth ← Selecione      │
│  • Conta de serviço                     │
└─────────────────────────────────────────┘
```

3. Configure o cliente OAuth:

| Campo | Valor |
|-------|-------|
| Tipo de aplicativo | **Aplicativo da Web** |
| Nome | `AquaDelivery Web Client` |

4. **Origens JavaScript autorizadas** (CRÍTICO!):

Clique em **"+ Adicionar URI"** e adicione:

```
https://app.aquadelivery.com.br
```

```
┌─────────────────────────────────────────┐
│  Origens JavaScript autorizadas         │
│                                         │
│  ┌─────────────────────────────────┐    │
│  │ https://app.aquadelivery.com.br │    │
│  └─────────────────────────────────┘    │
│                                         │
│  [+ Adicionar URI]                      │
└─────────────────────────────────────────┘
```

5. **URIs de redirecionamento autorizados** (CRÍTICO!):

Clique em **"+ Adicionar URI"** e adicione:

```
https://emeejnoqjvubxysxnmia.supabase.co/auth/v1/callback
```

```
┌─────────────────────────────────────────┐
│  URIs de redirecionamento autorizados   │
│                                         │
│  ┌───────────────────────────────────┐  │
│  │ https://emeejnoqjvubxysxnmia.     │  │
│  │ supabase.co/auth/v1/callback      │  │
│  └───────────────────────────────────┘  │
│                                         │
│  [+ Adicionar URI]                      │
└─────────────────────────────────────────┘
```

6. Clique em **"Criar"**

7. **IMPORTANTE**: Copie e guarde o **Client ID** e **Client Secret**:

```
┌─────────────────────────────────────────┐
│  Cliente OAuth criado                   │
│                                         │
│  Seu ID de cliente:                     │
│  ┌─────────────────────────────────┐    │
│  │ 123456789-abc.apps.google...    │ 📋 │
│  └─────────────────────────────────┘    │
│                                         │
│  Sua chave secreta do cliente:          │
│  ┌─────────────────────────────────┐    │
│  │ GOCSPX-xxxxxxxxxxxxxxxx         │ 📋 │
│  └─────────────────────────────────┘    │
│                                         │
│  [OK]                                   │
└─────────────────────────────────────────┘
```

---

## Parte 2: Configuração no Supabase Dashboard

### Passo 2.1: Acessar Configurações de Autenticação

1. Acesse [supabase.com/dashboard](https://supabase.com/dashboard)
2. Selecione o projeto: `emeejnoqjvubxysxnmia`
3. No menu lateral: **Authentication** → **Providers**

---

### Passo 2.2: Configurar Provider Google

1. Localize **Google** na lista de providers
2. Clique para expandir/editar

3. Ative o toggle **"Enable Sign in with Google"**

4. Preencha as credenciais:

| Campo | Valor |
|-------|-------|
| Client ID | Cole o Client ID do Google |
| Client Secret | Cole o Client Secret do Google |

```
┌─────────────────────────────────────────┐
│  Google                          [ON]   │
│                                         │
│  Client ID                              │
│  ┌─────────────────────────────────┐    │
│  │ 123456789-abc.apps.google...    │    │
│  └─────────────────────────────────┘    │
│                                         │
│  Client Secret                          │
│  ┌─────────────────────────────────┐    │
│  │ GOCSPX-xxxxxxxxxxxxxxxx         │    │
│  └─────────────────────────────────┘    │
│                                         │
│  Callback URL (Read-only):              │
│  https://emeejnoqjvubxysxnmia.supabase  │
│  .co/auth/v1/callback                   │
│                                         │
│  [Save]                                 │
└─────────────────────────────────────────┘
```

5. Clique em **"Save"**

---

### Passo 2.3: Configurar URLs de Redirecionamento

1. No menu lateral: **Authentication** → **URL Configuration**

2. Configure os seguintes campos:

| Campo | Valor |
|-------|-------|
| Site URL | `https://app.aquadelivery.com.br` |

3. Em **Redirect URLs**, clique em **"Add URL"** e adicione:

```
https://app.aquadelivery.com.br/**
```

```
┌─────────────────────────────────────────┐
│  URL Configuration                      │
│                                         │
│  Site URL                               │
│  ┌─────────────────────────────────┐    │
│  │ https://app.aquadelivery.com.br │    │
│  └─────────────────────────────────┘    │
│                                         │
│  Redirect URLs                          │
│  ┌─────────────────────────────────┐    │
│  │ https://app.aquadelivery.com.br │    │
│  │ /**                             │    │
│  └─────────────────────────────────┘    │
│                                         │
│  [Save]                                 │
└─────────────────────────────────────────┘
```

4. Clique em **"Save"**

---

## Parte 3: Verificação

### Checklist Final

Antes de testar, verifique:

- [ ] **Google Cloud Console**:
  - [ ] Tela de consentimento configurada
  - [ ] Domínio `aquadelivery.com.br` autorizado
  - [ ] Escopos `email`, `profile`, `openid` adicionados
  - [ ] App publicado (não em modo teste)
  - [ ] Origem JS: `https://app.aquadelivery.com.br`
  - [ ] Redirect URI: `https://emeejnoqjvubxysxnmia.supabase.co/auth/v1/callback`

- [ ] **Supabase Dashboard**:
  - [ ] Provider Google ativado
  - [ ] Client ID e Secret configurados
  - [ ] Site URL: `https://app.aquadelivery.com.br`
  - [ ] Redirect URL: `https://app.aquadelivery.com.br/**`

---

### Testando o Login

1. Acesse `https://app.aquadelivery.com.br/customer/login`
2. Clique no botão **"Google"**
3. Selecione sua conta Google
4. Você deve ser redirecionado de volta ao app, autenticado

---

## 🔧 Troubleshooting

### Erro: "redirect_uri_mismatch"

**Causa**: A URI de redirecionamento não corresponde.

**Solução**: Verifique se a URI no Google Cloud é exatamente:
```
https://emeejnoqjvubxysxnmia.supabase.co/auth/v1/callback
```

---

### Erro: "access_denied" ou "App não verificado"

**Causa**: O app ainda está em modo de teste.

**Solução**: 
1. Publique o app na Tela de consentimento
2. OU adicione o e-mail do usuário como testador

---

### Erro: "requested path is invalid"

**Causa**: Site URL incorreto no Supabase.

**Solução**: Configure `https://app.aquadelivery.com.br` como Site URL.

---

### Login funciona mas usuário não é redirecionado corretamente

**Causa**: Redirect URLs não configurados.

**Solução**: Adicione `https://app.aquadelivery.com.br/**` nos Redirect URLs do Supabase.

---

## 📚 Referências

- [Documentação Supabase - Google Auth](https://supabase.com/docs/guides/auth/social-login/auth-google)
- [Google Cloud - Configurar OAuth](https://developers.google.com/identity/protocols/oauth2)
- [Supabase Dashboard](https://supabase.com/dashboard/project/emeejnoqjvubxysxnmia/auth/providers)

---

*Última atualização: Janeiro 2026*
