import { stripe } from "../config/stripe.js";
import { Consultation } from "../models/Consultation.js";

export const stripeWebhookHandler = async (req, res) => {
  const signature = req.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    console.error("Webhook signature verification failed:", error.message);
    return res.status(400).send(`Webhook Error: ${error.message}`);
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;

        const consultationId = session.metadata?.consultationId;

        if (!consultationId) break;

        const consultation = await Consultation.findById(consultationId);

        if (!consultation) break;

        consultation.paymentStatus = "paid";
        consultation.paidAt = new Date();
        consultation.stripeCheckoutSessionId = session.id || consultation.stripeCheckoutSessionId;
        consultation.stripePaymentIntentId =
          typeof session.payment_intent === "string"
            ? session.payment_intent
            : consultation.stripePaymentIntentId;

        if (
          consultation.status === "pending_payment" ||
          consultation.status === "cancelled"
        ) {
          consultation.status = "waiting_for_review";
        }

        await consultation.save();
        break;
      }

      case "checkout.session.async_payment_succeeded": {
        const session = event.data.object;
        const consultationId = session.metadata?.consultationId;

        if (!consultationId) break;

        const consultation = await Consultation.findById(consultationId);
        if (!consultation) break;

        consultation.paymentStatus = "paid";
        consultation.paidAt = new Date();

        if (consultation.status === "pending_payment") {
          consultation.status = "waiting_for_review";
        }

        await consultation.save();
        break;
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object;

        await Consultation.findOneAndUpdate(
          { stripePaymentIntentId: paymentIntent.id },
          {
            paymentStatus: "unpaid",
          }
        );
        break;
      }

      default:
        break;
    }

    return res.status(200).json({ received: true });
  } catch (error) {
    console.error("Error handling Stripe webhook:", error);
    return res.status(500).json({
      success: false,
      message: "Webhook handler failed",
    });
  }
};