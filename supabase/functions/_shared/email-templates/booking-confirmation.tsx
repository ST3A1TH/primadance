/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1'
import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from 'npm:@react-email/components@0.0.22'

interface BookingConfirmationEmailProps {
  clientName: string
  className: string
  date: string
  time: string
  language: 'ro' | 'ru'
  logoUrl?: string
}

const copy = {
  ro: {
    preview: 'Confirmare programare – Prima Dance',
    greeting: (name: string) => `Bună, ${name}`,
    confirmation: (cls: string) => `Îți confirmăm rezervarea la ${cls}.`,
    dateLabel: 'Data',
    timeLabel: 'Ora',
    locationLabel: 'Locație',
    phoneLabel: 'Telefon',
    cancellation: 'Anulările trebuie făcute cu minim 6 ore înainte.',
    thanks: 'Mulțumim și te așteptăm cu drag!',
    team: 'Echipa Prima Dance',
    address: 'Strada Nicolae Testemițanu 19/10, MD-2025, Chișinău',
    phone: '061 100 499',
  },
  ru: {
    preview: 'Подтверждение записи – Prima Dance',
    greeting: (name: string) => `Здравствуйте, ${name}`,
    confirmation: (cls: string) => `Ваша запись на ${cls} подтверждена.`,
    dateLabel: 'Дата',
    timeLabel: 'Время',
    locationLabel: 'Адрес',
    phoneLabel: 'Телефон',
    cancellation: 'Отмена возможна минимум за 6 часов.',
    thanks: 'Благодарим и ждём вас!',
    team: 'Команда Prima Dance',
    address: 'Strada Nicolae Testemițanu 19/10, MD-2025, Chișinău',
    phone: '061 100 499',
  },
}

const main: React.CSSProperties = {
  backgroundColor: '#ffffff',
  fontFamily: "'Montserrat', 'Helvetica Neue', Arial, sans-serif",
}

const container: React.CSSProperties = {
  margin: '0 auto',
  padding: '40px 24px',
  maxWidth: '520px',
}

const logoSection: React.CSSProperties = {
  textAlign: 'center' as const,
  marginBottom: '32px',
}

const logoImage: React.CSSProperties = {
  width: '48px',
  height: '48px',
  borderRadius: '50%',
  margin: '0 auto',
}

const studioName: React.CSSProperties = {
  fontSize: '14px',
  letterSpacing: '0.2em',
  textTransform: 'uppercase' as const,
  color: '#1a1a17',
  fontWeight: 500,
  marginTop: '12px',
}

const heading: React.CSSProperties = {
  fontSize: '24px',
  fontFamily: "'Cormorant Garamond', 'Georgia', serif",
  fontWeight: 400,
  color: '#1a1a17',
  textAlign: 'center' as const,
  margin: '0 0 8px',
}

const bodyText: React.CSSProperties = {
  fontSize: '14px',
  lineHeight: '24px',
  color: '#555555',
  textAlign: 'center' as const,
  margin: '0 0 24px',
}

const detailsBox: React.CSSProperties = {
  border: '1px solid #e0e0e0',
  padding: '24px',
  marginBottom: '24px',
}

const detailRow: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  fontSize: '13px',
  lineHeight: '28px',
  color: '#1a1a17',
}

const detailLabel: React.CSSProperties = {
  color: '#888888',
  fontWeight: 400,
}

const detailValue: React.CSSProperties = {
  fontWeight: 500,
  textAlign: 'right' as const,
}

const hr: React.CSSProperties = {
  borderColor: '#e0e0e0',
  margin: '24px 0',
}

const cancellationText: React.CSSProperties = {
  fontSize: '12px',
  lineHeight: '20px',
  color: '#999999',
  textAlign: 'center' as const,
  fontStyle: 'italic' as const,
  margin: '0 0 24px',
}

const footerText: React.CSSProperties = {
  fontSize: '12px',
  lineHeight: '20px',
  color: '#aaaaaa',
  textAlign: 'center' as const,
  margin: '4px 0',
}

export function BookingConfirmationEmail({
  clientName,
  className: cls,
  date,
  time,
  language = 'ro',
  logoUrl,
}: BookingConfirmationEmailProps) {
  const t = copy[language] || copy.ro

  return (
    <Html>
      <Head />
      <Preview>{t.preview}</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Logo */}
          <Section style={logoSection}>
            {logoUrl && (
              <Img src={logoUrl} alt="Prima Dance" style={logoImage} />
            )}
            <Text style={studioName}>Prima Dance</Text>
          </Section>

          <Hr style={hr} />

          {/* Greeting */}
          <Heading style={heading}>{t.greeting(clientName)}</Heading>
          <Text style={bodyText}>{t.confirmation(cls)}</Text>

          {/* Details */}
          <Section style={detailsBox}>
            <table width="100%" cellPadding="0" cellSpacing="0" style={{ borderCollapse: 'collapse' as const }}>
              <tr>
                <td style={{ ...detailLabel, padding: '4px 0', fontSize: '13px' }}>{t.dateLabel}</td>
                <td style={{ ...detailValue, padding: '4px 0', fontSize: '13px' }}>{date}</td>
              </tr>
              <tr>
                <td style={{ ...detailLabel, padding: '4px 0', fontSize: '13px' }}>{t.timeLabel}</td>
                <td style={{ ...detailValue, padding: '4px 0', fontSize: '13px' }}>{time}</td>
              </tr>
              <tr>
                <td style={{ ...detailLabel, padding: '4px 0', fontSize: '13px' }}>{t.locationLabel}</td>
                <td style={{ ...detailValue, padding: '4px 0', fontSize: '13px' }}>{t.address}</td>
              </tr>
              <tr>
                <td style={{ ...detailLabel, padding: '4px 0', fontSize: '13px' }}>{t.phoneLabel}</td>
                <td style={{ ...detailValue, padding: '4px 0', fontSize: '13px' }}>{t.phone}</td>
              </tr>
            </table>
          </Section>

          {/* Cancellation */}
          <Text style={cancellationText}>{t.cancellation}</Text>

          <Hr style={hr} />

          {/* Sign-off */}
          <Text style={{ ...bodyText, marginBottom: '4px' }}>{t.thanks}</Text>
          <Text style={{ ...bodyText, fontWeight: 500, color: '#1a1a17' }}>{t.team}</Text>

          {/* Footer */}
          <Hr style={hr} />
          <Text style={footerText}>{t.address}</Text>
          <Text style={footerText}>{t.phone}</Text>
        </Container>
      </Body>
    </Html>
  )
}

export default BookingConfirmationEmail
