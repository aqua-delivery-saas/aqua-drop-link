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
  Link,
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
          <Heading style={brand}>AquaDelivery</Heading>
        </Section>
        <Section style={card}>
          <Heading style={h1}>Confirmar alteração de e-mail</Heading>
          <Text style={text}>
            Recebemos uma solicitação para alterar o e-mail da sua conta no {siteName} de{' '}
            <Link href={`mailto:${oldEmail}`} style={link}>{oldEmail}</Link>{' '}
            para{' '}
            <Link href={`mailto:${newEmail}`} style={link}>{newEmail}</Link>.
          </Text>
          <Section style={{ textAlign: 'center', margin: '32px 0' }}>
            <Button style={button} href={confirmationUrl}>
              Confirmar alteração
            </Button>
          </Section>
          <Text style={text}>
            Se você não solicitou esta alteração, proteja sua conta imediatamente.
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

export default EmailChangeEmail

const main = { backgroundColor: '#ffffff', fontFamily: "'Poppins', Arial, sans-serif" }
const container = { maxWidth: '560px', margin: '0 auto', padding: '24px' }
const header = { textAlign: 'center' as const, padding: '16px 0' }
const brand = { color: '#007BFF', fontSize: '24px', fontWeight: 'bold' as const, margin: 0 }
const card = { backgroundColor: '#F8FAFC', borderRadius: '12px', padding: '32px 24px' }
const h1 = { fontSize: '22px', fontWeight: 'bold' as const, color: '#0F172A', margin: '0 0 16px' }
const text = { fontSize: '14px', color: '#475569', lineHeight: '1.6', margin: '0 0 16px' }
const link = { color: '#007BFF', textDecoration: 'underline' }
const button = {
  backgroundColor: '#007BFF',
  color: '#ffffff',
  fontSize: '14px',
  fontWeight: 'bold' as const,
  borderRadius: '12px',
  padding: '14px 28px',
  textDecoration: 'none',
  display: 'inline-block',
}
const hr = { borderColor: '#E2E8F0', margin: '24px 0' }
const footer = { fontSize: '12px', color: '#94A3B8', textAlign: 'center' as const, margin: 0 }
