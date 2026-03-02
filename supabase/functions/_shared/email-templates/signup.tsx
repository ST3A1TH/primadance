/// <reference types="npm:@types/react@18.3.1" />

import * as React from 'npm:react@18.3.1'

import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Text,
} from 'npm:@react-email/components@0.0.22'

interface SignupEmailProps {
  siteName: string
  siteUrl: string
  recipient: string
  confirmationUrl: string
}

export const SignupEmail = ({
  siteName,
  siteUrl,
  recipient,
  confirmationUrl,
}: SignupEmailProps) => (
  <Html lang="ro" dir="ltr">
    <Head />
    <Preview>Confirmă adresa ta de email — {siteName}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Img
          src="https://scevrsybmtguihndslhk.supabase.co/storage/v1/object/public/email-assets/logo.png"
          alt="Prima Dance Studio"
          width="160"
          height="auto"
          style={logo}
        />
        <Heading style={h1}>Confirmă adresa de email</Heading>
        <Text style={text}>
          Mulțumim pentru înregistrarea la{' '}
          <Link href={siteUrl} style={link}>
            <strong>{siteName}</strong>
          </Link>
          !
        </Text>
        <Text style={text}>
          Confirmă adresa ta de email (
          <Link href={`mailto:${recipient}`} style={link}>
            {recipient}
          </Link>
          ) apăsând butonul de mai jos:
        </Text>
        <Button style={button} href={confirmationUrl}>
          Confirmă Email
        </Button>
        <Text style={text}>
          Подтвердите ваш email, нажав кнопку выше.
        </Text>
        <Text style={footer}>
          Dacă nu ai creat un cont, poți ignora acest email în siguranță.
          <br />
          Если вы не создавали аккаунт, просто проигнорируйте это письмо.
        </Text>
      </Container>
    </Body>
  </Html>
)

export default SignupEmail

const main = { backgroundColor: '#ffffff', fontFamily: "'Montserrat', Arial, sans-serif" }
const container = { padding: '30px 25px' }
const logo = { margin: '0 0 24px' }
const h1 = {
  fontSize: '22px',
  fontWeight: 'bold' as const,
  color: '#141511',
  margin: '0 0 20px',
  fontFamily: "'Cormorant Garamond', Georgia, serif",
}
const text = {
  fontSize: '14px',
  color: '#666660',
  lineHeight: '1.6',
  margin: '0 0 20px',
}
const link = { color: '#141511', textDecoration: 'underline' }
const button = {
  backgroundColor: '#141511',
  color: '#ffffff',
  fontSize: '14px',
  borderRadius: '4px',
  padding: '12px 24px',
  textDecoration: 'none',
  fontFamily: "'Montserrat', Arial, sans-serif",
}
const footer = { fontSize: '12px', color: '#999999', margin: '30px 0 0', lineHeight: '1.5' }
