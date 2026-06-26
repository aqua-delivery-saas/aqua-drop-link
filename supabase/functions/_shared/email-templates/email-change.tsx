/// <reference types="npm:@types/react@18.3.1" />

import * as React from 'npm:react@18.3.1'

import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from 'npm:@react-email/components@0.0.22'

interface EmailChangeEmailProps {
  siteName: string
  oldEmail: string
  email: string
  newEmail: string
  confirmationUrl: string
}

export const EmailChangeEmail = ({
  siteName,
  oldEmail,
  newEmail,
  confirmationUrl,
}: EmailChangeEmailProps) => (
  <Html lang="pt-BR" dir="ltr">
    <Head />
    <Preview>Confirme a alteração do seu e-mail no {siteName}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={header}>
          <Text style={brand}>💧 AquaDelivery</Text>
        </Section>
        <Section style={card}>
          <Heading style={h1}>Confirme a alteração do seu e-mail</Heading>
          <Text style={text}>
            Você solicitou alterar o e-mail da sua conta no{' '}
            <strong>{siteName}</strong>, de <strong>{oldEmail}</strong> para{' '}
            <strong>{newEmail}</strong>.
          </Text>
          <Text style={text}>Clique no botão abaixo para confirmar:</Text>
          <Section style={{ textAlign: 'center', margin: '32px 0' }}>
            <Button style={button} href={confirmationUrl}>
              Confirmar novo e-mail
            </Button>
          </Section>
          <Hr style={hr} />
          <Text style={footer}>
            🔒 Se você não solicitou esta alteração, proteja sua conta
            imediatamente alterando sua senha.
          </Text>
        </Section>
        <Text style={signature}>Equipe AquaDelivery</Text>
      </Container>
    </Body>
  </Html>
)

export default EmailChangeEmail

const main = {
  backgroundColor: '#ffffff',
  fontFamily: 'Poppins, Arial, sans-serif',
  padding: '20px 0',
}
const container = { maxWidth: '560px', margin: '0 auto', padding: '0 16px' }
const header = { textAlign: 'center' as const, padding: '8px 0 16px' }
const brand = {
  fontSize: '24px',
  fontWeight: 'bold' as const,
  color: '#007BFF',
  margin: '0',
  letterSpacing: '-0.5px',
}
const card = {
  backgroundColor: '#F8FAFC',
  borderRadius: '12px',
  padding: '32px 28px',
  border: '1px solid #E2E8F0',
}
const h1 = {
  fontSize: '22px',
  fontWeight: '600' as const,
  color: '#0F172A',
  margin: '0 0 20px',
}
const text = {
  fontSize: '15px',
  color: '#334155',
  lineHeight: '1.6',
  margin: '0 0 16px',
}
const button = {
  backgroundColor: '#007BFF',
  color: '#ffffff',
  fontSize: '15px',
  fontWeight: '600' as const,
  borderRadius: '12px',
  padding: '14px 28px',
  textDecoration: 'none',
  display: 'inline-block',
}
const hr = { borderColor: '#E2E8F0', margin: '24px 0' }
const footer = {
  fontSize: '13px',
  color: '#64748B',
  lineHeight: '1.6',
  margin: '0',
}
const signature = {
  fontSize: '13px',
  color: '#94A3B8',
  textAlign: 'center' as const,
  margin: '24px 0 0',
}
