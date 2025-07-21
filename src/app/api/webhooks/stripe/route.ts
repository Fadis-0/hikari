import { db } from "@/db";
import { orders, orderItems, carts, cartItems } from "@/db/schema";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import Stripe from "stripe";

export async function POST(request: Request) {
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeSecretKey) {
    return NextResponse.json(
      { message: "Stripe secret key is not configured." },
      { status: 500 }
    );
  }

  const stripe = new Stripe(stripeSecretKey, {
    apiVersion: "2024-06-20",
  });

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return NextResponse.json(
      { message: "Stripe webhook secret is not configured." },
      { status: 500 }
    );
  }

  const sig = request.headers.get("stripe-signature")!;
  const body = await request.text();

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ message: `Webhook Error: ${errorMessage}` }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const { userId, cartId } = session.metadata!;

    try {
      const cart = await db.query.carts.findFirst({
        where: eq(carts.id, parseInt(cartId, 10)),
        with: {
          items: {
            with: {
              product: true,
            },
          },
        },
      });

      if (!cart) {
        throw new Error("Cart not found");
      }

      const totalAmount = cart.items
        .reduce(
          (acc, item) => acc + parseFloat(item.product.price) * item.quantity,
          0
        )
        .toString();

      const newOrder = await db
        .insert(orders)
        .values({
          userId: parseInt(userId, 10),
          totalAmount,
          status: "PAID",
          shippingAddress: JSON.stringify(session.shipping_details), // Example, adjust as needed
        })
        .returning();

      const newOrderItems = cart.items.map((item) => ({
        orderId: newOrder[0].id,
        productId: item.productId,
        quantity: item.quantity,
        priceAtPurchase: item.product.price,
      }));

      await db.insert(orderItems).values(newOrderItems);

      // Clear the cart
      await db.delete(cartItems).where(eq(cartItems.cartId, parseInt(cartId, 10)));

    } catch (error) {
      console.error("Error processing order:", error);
      // If something goes wrong, you might want to handle it,
      // e.g., by logging the error and returning a 500 status.
      // This ensures Stripe knows the webhook failed and will retry.
      return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}
