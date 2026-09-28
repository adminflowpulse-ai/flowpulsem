import nodemailer from 'nodemailer';

// Utilizziamo Ethereal Email per lo sviluppo locale senza credenziali reali
// In produzione, andrebbe sostituito con le variabili d'ambiente (es. SendGrid, AWS SES)
let transporter: nodemailer.Transporter | null = null;

async function getTransporter() {
  if (transporter) return transporter;

  // Crea un account di test on-the-fly se non esistono variabili d'ambiente
  const account = await nodemailer.createTestAccount();

  transporter = nodemailer.createTransport({
    host: account.smtp.host,
    port: account.smtp.port,
    secure: account.smtp.secure,
    auth: {
      user: account.user,
      pass: account.pass,
    },
  });

  return transporter;
}

export async function sendEmail({ to, subject, html }: { to: string, subject: string, html: string }) {
  try {
    const t = await getTransporter();
    
    const info = await t.sendMail({
      from: '"FlowPulseM Admin" <noreply@flowpulse.io>',
      to,
      subject,
      html,
    });

    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    
    return { success: true, messageId: info.messageId, previewUrl: nodemailer.getTestMessageUrl(info) };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, error };
  }
}
