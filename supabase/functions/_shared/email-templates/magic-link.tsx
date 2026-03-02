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

interface MagicLinkEmailProps {
  siteName: string
  confirmationUrl: string
}

export const MagicLinkEmail = ({
  siteName,
  confirmationUrl,
}: MagicLinkEmailProps) => (
  <Html lang="ro" dir="ltr">
    <Head />
    <Preview>Linkul tău de autentificare — {siteName}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Img
          src="https://scevrsybmtguihndslhk.supabase.co/storage/v1/object/public/email-assets/logo.png"
          alt="Prima Dance Studio"
          width="160"
          height="auto"
          style={logo}
        />
        <Heading style={h1}>Autentificare</Heading>
        <Text style={text}>
          Apasă butonul de mai jos pentru a te autentifica pe {siteName}. Linkul va expira în scurt timp.
        </Text>
        <Button style={button} href={confirmationUrl}>
          Intră în cont
        </Button>
        <Text style={text}>
          Нажмите кнопку выше, чтобы войти в аккаунт {siteName}. Ссылка скоро истечёт.
        </Text>
        <Text style={smallText}>
          Verifică și folderul Spam dacă nu găsești emailul.
          <br />
          Проверьте также папку Спам.
        </Text>
        <Text style={footer}>
          Dacă nu ai solicitat acest link, poți ignora acest email.
          <br />
          Если вы не запрашивали ссылку, проигнорируйте это письмо.
        </Text>
      </Container>
    </Body>
  </Html>
)

export default MagicLinkEmail

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
const smallText = {
  fontSize: '13px',
  color: '#888880',
  lineHeight: '1.5',
  margin: '0 0 20px',
  fontStyle: 'italic' as const,
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
