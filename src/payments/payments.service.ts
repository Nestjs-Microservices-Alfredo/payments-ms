import { Injectable, Logger } from '@nestjs/common';
import { envs } from 'src/config';
import Stripe from 'stripe';
import { PaymentSessionDto } from './dto';
import { Response, Request } from 'express';

@Injectable()
export class PaymentsService {

    private readonly logger = new Logger(PaymentsService.name);
    private readonly stripe = new Stripe( envs.stripeSecret );


    async createPaymentSession( paymentSessionDto: PaymentSessionDto ) {

        const { currency, items, orderId } = paymentSessionDto;

        const lineItems = items.map( ( item ) => {
            return {
                price_data: {
                    currency,
                    product_data: {
                        name: item.name,
                    },
                    unit_amount: Math.round(item.price * 100),
                },
                quantity: item.quantity,
            };
        });

        const session = await this.stripe.checkout.sessions.create({
            payment_intent_data: {
                metadata: {
                    orderId
                }
            },
            line_items: lineItems,
            mode: 'payment',
            success_url: envs.stripeSuccessUrl,
            cancel_url: envs.stripeCancelUrl,
        });

        return session;
    }

    async success() { 
        return 'Payment successful';
    }

    async cancel() { 
        return 'Payment cancelled';
    }
    async stripeWebhook( req: Request, res: Response ) { 

        const sig = req.headers['stripe-signature'];

        let event: Stripe.Event;
        // Testing
        // This is your Stripe CLI webhook secret for testing your endpoint locally.
        // const endpointSecret = "whsec_2d6a90b99f3cd5bf1ed44bae7e01ff193eb438f88226d8895cad34c8d1f5312c";

        // real
        const endpointSecret = envs.stripeEndpointSecret;

        try {
            event = this.stripe.webhooks.constructEvent(req['rawBody'], sig, endpointSecret);
        } catch (err) {
            return res.status(400).send(`Webhook Error: ${err.message}`);
        }

        // console.log(`event `, event);

        switch (event.type) {
            case 'charge.succeeded':
                const chargeSucceeded = event.data.object as unknown as Stripe.PaymentIntent;
                
                console.log({
                    metadata: chargeSucceeded.metadata
                } );
                break;
            break;

            default:
                console.log(`Unhandled event type ${event.type}`);
                

        }

        return res.status(200).json({ sig });
    }
}
