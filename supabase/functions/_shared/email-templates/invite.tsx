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

interface InviteEmailProps {
  siteName: string
  siteUrl: string
  confirmationUrl: string
}

export const InviteEmail = ({
  siteName,
  siteUrl,
  confirmationUrl,
}: InviteEmailProps) => (
  <Html lang="ro" dir="ltr">
    <Head />
    <Preview>Ai fost invitat(ă) pe {siteName}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Img
          src="https://scevrsybmtguihndslhk.supabase.co/storage/v1/object/public/email-assets/logo.png"
          alt="Prima Dance Studio"
          width="160"
          height="auto"
          style={logo}
        />
        <Heading style={h1}>Ai fost invitat(ă)</Heading>
        <Text style={text}>
          Ai fost invitat(ă) pe{' '}
          <Link href={siteUrl} style={link}>
            <strong>{siteName}</strong>
          </Link>
          . Apasă butonul de mai jos pentru a accepta invitația.
        </Text>
        <Button style={button} href={confirmationUrl}>
          Acceptă Invitația
        </Button>
        <Text style={text}>
          Вас пригласили на {siteName}. Нажмите кнопку выше, чтобы принять приглашение.
        </Text>
        <Text style={footer}>
          Dacă nu așteptai această invitație, poți ignora acest email.
          <br />
          Если вы не ожидали приглашения, проигнорируйте это письмо.
        </Text>
      </Container>
    </Body>
  </Html>
)

export default InviteEmail

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
