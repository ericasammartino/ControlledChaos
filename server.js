const path = require("path");
const express = require("express");
const Stripe = require("stripe");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

if (!process.env.STRIPE_SECRET_KEY) {
  // eslint-disable-next-line no-console
  console.warn("Missing STRIPE_SECRET_KEY. Checkout session creation will fail.");
}

const stripe = Stripe(process.env.STRIPE_SECRET_KEY || "");
const domainUrl = process.env.DOMAIN_URL || `http://localhost:${port}`;

const products = {
  label-bin-set: {
    name: "Label-Ready Bin Set",
    description: "Stackable bins for pantry, closet, and toy organization.",
    amount: 3900
  },
  drawer-divider-kit: {
    name: "Drawer Divider Kit",
    description: "Adjustable bamboo dividers for kitchen and dresser drawers.",
    amount: 3400
  },
  travel-capsule-cubes: {
    name: "Travel Capsule Cubes",
    description: "Compression packing cubes for organized and efficient trips.",
    amount: 2700
  },
  command-center-board: {
    name: "Command Center Board",
    description: "Weekly planner board for calendars, meal prep, and notes.",
    amount: 3100
  }
};

app.use(express.json());
app.use(express.static(path.join(__dirname)));

app.post("/api/create-checkout-session", async (req, res) => {
  const { productId } = req.body || {};
  const product = products[productId];

  if (!product) {
    return res.status(400).json({ error: "Invalid product selection." });
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    return res.status(500).json({
      error: "Stripe is not configured. Add STRIPE_SECRET_KEY to your environment."
    });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "usd",
            unit_amount: product.amount,
            product_data: {
              name: product.name,
              description: product.description
            }
          }
        }
      ],
      success_url: `${domainUrl}/?checkout=success`,
      cancel_url: `${domainUrl}/?checkout=cancelled`
    });

    return res.json({ url: session.url });
  } catch (error) {
    return res.status(500).json({
      error: "Unable to create Stripe Checkout session.",
      details: error.message
    });
  }
});

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server running at ${domainUrl}`);
});
