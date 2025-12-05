import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendWelcomeEmail(email: string, name: string) {
    await resend.emails.send({
        from: 'Money for Gamers <hello@moneyforgamers.com>',
        to: email,
        subject: '🎮 ¡Bienvenido a Money for Gamers!',
        html: `
      <h1>¡Hola ${name}!</h1>
      <p>Gracias por unirte a nuestra comunidad de gamers.</p>
      <p>Usa el código <strong>WELCOME10</strong> para obtener 10% de descuento en tu primera compra.</p>
    `,
    });
}

export async function sendPurchaseConfirmation(email: string, orderDetails: any) {
    await resend.emails.send({
        from: 'Money for Gamers <orders@moneyforgamers.com>',
        to: email,
        subject: '✅ Confirmación de compra - Money for Gamers',
        html: `
      <h1>¡Tu pedido está listo!</h1>
      <p>Orden #${orderDetails.orderId}</p>
      <p>Tu código digital: <strong>${orderDetails.code}</strong></p>
    `,
    });
}
