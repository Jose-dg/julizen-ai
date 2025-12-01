import { NextResponse } from 'next/server';
import crypto from 'crypto';

// Use the Sandbox Integrity Secret for now, or load from env
const WOMPI_INTEGRITY_SECRET = process.env.WOMPI_INTEGRITY_SECRET || 'test_integrity_j3sdrimTRdQDcbUzbqU419m7Xixxqtu0';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { event, data, signature, timestamp } = body;

        console.log('Received Wompi Webhook:', event);

        if (event === 'transaction.updated') {
            const transaction = data.transaction;

            // 1. Verify Signature
            // Wompi Event Signature: SHA256(transaction.id + transaction.status + transaction.amount_in_cents + timestamp + secret)
            // Note: The signature in the event body is calculated differently than the checkout signature.
            // Check Wompi docs: https://docs.wompi.co/en/docs/eventos/#validaci%C3%B3n-de-integridad-de-eventos
            // "checksum": SHA256(transaction.id + transaction.status + transaction.amount_in_cents + timestamp + secret)

            const textToSign = `${transaction.id}${transaction.status}${transaction.amount_in_cents}${timestamp}${WOMPI_INTEGRITY_SECRET}`;
            const calculatedChecksum = crypto.createHash('sha256').update(textToSign).digest('hex');

            if (calculatedChecksum !== signature.checksum) {
                console.error('Invalid Wompi signature');
                return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
            }

            console.log('Signature verified successfully');

            // 2. Handle Approved Transaction
            if (transaction.status === 'APPROVED') {
                console.log(`Transaction ${transaction.id} APPROVED. Reference: ${transaction.reference}`);

                // TODO: Here we would ideally trigger the order fulfillment.
                // However, we don't have the cart items here unless we saved them previously 
                // or passed them in metadata.
                // For now, we just log it.
            }
        }

        return NextResponse.json({ status: 'ok' });
    } catch (error) {
        console.error('Error processing webhook:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
