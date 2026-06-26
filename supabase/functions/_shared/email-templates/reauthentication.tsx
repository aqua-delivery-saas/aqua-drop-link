/// <reference types="npm:@types/react@18.3.1" />

import * as React from 'npm:react@18.3.1'

import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from 'npm:@react-email/components@0.0.22'

interface ReauthenticationEmailProps {
  token: string
}

export const ReauthenticationEmail = ({ token }: ReauthenticationEmailProps) => (
  <Html lang="pt-BR" dir="ltr">
    <Head />
    <Preview>Seu código de verificação AquaDelivery</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={header}>
          <Text style={brand}>💧 AquaDelivery</Text>
        </Section>
        <Section style={card}>
          <Heading style={h1}>Confirme sua identidade</Heading>
          <Text style={text}>
            Use o código abaixo para confirmar sua identidade:
          </Text>
          <Text style={codeStyle}>{token}</Text>
          <Hr style={hr} />
          <Text style={footer}>
            Este código expira em breve. Se você não solicitou, pode ignorar
            este e-mail com segurança.
          </Text>
        </Section>
        <Text style={signature}>Equipe AquaDelivery</Text>
      </Container>
    </Body>
  </Html>
)

export default ReauthenticationEmail

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
  textAlign: 'center' as const,
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
const codeStyle = {
  fontFamily: 'Courier, monospace',
  fontSize: '32px',
  fontWeight: 'bold' as const,
  color: '#007BFF',
  letterSpacing: '8px',
  margin: '24px 0',
  padding: '16px',
  backgroundColor: '#ffffff',
  borderRadius: '12px',
  border: '1px solid #E2E8F0',
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
