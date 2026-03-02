/// <reference types="npm:@types/react@18.3.1" />

import * as React from 'npm:react@18.3.1'

import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Preview,
  Text,
} from 'npm:@react-email/components@0.0.22'

interface ReauthenticationEmailProps {
  token: string
}

export const ReauthenticationEmail = ({ token }: ReauthenticationEmailProps) => (
  <Html lang="ro" dir="ltr">
    <Head />
    <Preview>Codul tău de verificare — Prima Dance Studio</Preview>
    <Body style={main}>
      <Container style={container}>
        <Img
          src="https://scevrsybmtguihndslhk.supabase.co/storage/v1/object/public/email-assets/logo.png"
          alt="Prima Dance Studio"
          width="160"
          height="auto"
          style={logo}
        />
        <Heading style={h1}>Codul tău de verificare</Heading>
        <Text style={text}>
          Folosește codul de mai jos pentru a-ți confirma identitatea:
        </Text>
        <Text style={codeStyle}>{token}</Text>
        <Text style={text}>
          Используйте код выше для подтверждения вашей личности.
        </Text>
        <Text style={footer}>
          Codul va expira în scurt timp. Dacă nu ai solicitat acest cod, poți ignora emailul.
          <br />
          Код скоро истечёт. Если вы его не запрашивали, проигнорируйте письмо.
        </Text>
      </Container>
    </Body>
  </Html>
)

export default ReauthenticationEmail

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
const codeStyle = {
  fontFamily: 'Courier, monospace',
  fontSize: '28px',
  fontWeight: 'bold' as const,
  color: '#141511',
  margin: '0 0 24px',
  letterSpacing: '4px',
}
const footer = { fontSize: '12px', color: '#999999', margin: '30px 0 0', lineHeight: '1.5' }
