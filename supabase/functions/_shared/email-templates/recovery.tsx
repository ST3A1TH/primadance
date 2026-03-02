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
  Preview,
  Text,
} from 'npm:@react-email/components@0.0.22'

interface RecoveryEmailProps {
  siteName: string
  confirmationUrl: string
}

export const RecoveryEmail = ({
  siteName,
  confirmationUrl,
}: RecoveryEmailProps) => (
  <Html lang="ro" dir="ltr">
    <Head />
    <Preview>Resetează parola — {siteName}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Img
          src="https://scevrsybmtguihndslhk.supabase.co/storage/v1/object/public/email-assets/logo.png"
          alt="Prima Dance Studio"
          width="160"
          height="auto"
          style={logo}
        />
        <Heading style={h1}>Resetează parola</Heading>
        <Text style={text}>
          Am primit o solicitare de resetare a parolei pentru contul tău pe {siteName}. Apasă butonul de mai jos pentru a alege o parolă nouă.
        </Text>
        <Button style={button} href={confirmationUrl}>
          Resetează Parola
        </Button>
        <Text style={text}>
          Мы получили запрос на сброс пароля для вашей учётной записи на {siteName}. Нажмите кнопку выше.
        </Text>
        <Text style={footer}>
          Dacă nu ai solicitat resetarea parolei, poți ignora acest email.
          <br />
          Если вы не запрашивали сброс пароля, проигнорируйте это письмо.
        </Text>
      </Container>
    </Body>
  </Html>
)

export default RecoveryEmail

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
