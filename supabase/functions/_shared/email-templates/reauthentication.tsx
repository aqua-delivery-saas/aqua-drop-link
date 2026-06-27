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
          <Heading style={brand}>AquaDelivery</Heading>
        </Section>
        <Section style={card}>
          <Heading style={h1}>Confirmar identidade</Heading>
          <Text style={text}>Use o código abaixo para confirmar sua identidade:</Text>
          <Text style={codeStyle}>{token}</Text>
          <Text style={text}>
            Este código expira em alguns minutos. Se você não solicitou, pode
            ignorar este e-mail com segurança.
          </Text>
          <Hr style={hr} />
          <Text style={footer}>
            © {new Date().getFullYear()} AquaDelivery. Todos os direitos reservados.
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
)

export default ReauthenticationEmail

const main = { backgroundColor: '#ffffff', fontFamily: "'Poppins', Arial, sans-serif" }
const container = { maxWidth: '560px', margin: '0 auto', padding: '24px' }
const header = { textAlign: 'center' as const, padding: '16px 0' }
const brand = { color: '#007BFF', fontSize: '24px', fontWeight: 'bold' as const, margin: 0 }
const card = { backgroundColor: '#F8FAFC', borderRadius: '12px', padding: '32px 24px' }
const h1 = { fontSize: '22px', fontWeight: 'bold' as const, color: '#0F172A', margin: '0 0 16px' }
const text = { fontSize: '14px', color: '#475569', lineHeight: '1.6', margin: '0 0 16px' }
const codeStyle = {
  fontFamily: 'Courier, monospace',
  fontSize: '32px',
  fontWeight: 'bold' as const,
  color: '#007BFF',
  letterSpacing: '6px',
  textAlign: 'center' as const,
  margin: '24px 0',
}
const hr = { borderColor: '#E2E8F0', margin: '24px 0' }
const footer = { fontSize: '12px', color: '#94A3B8', textAlign: 'center' as const, margin: 0 }
