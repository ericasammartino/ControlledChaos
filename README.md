# ControlledChaos

Mobile-first home organizing website with Stripe Checkout support for organizing
products.

## Stripe setup

1. Copy environment template:
   - `cp .env.example .env`
2. Add your Stripe secret key in `.env`:
   - `STRIPE_SECRET_KEY=sk_test_...`
3. (Optional) Set your live domain:
   - `DOMAIN_URL=https://your-domain.com`
4. Install dependencies and run:
   - `npm install`
   - `npm start`
5. Open `http://localhost:3000` and click a **Buy with Stripe** button.

## Notes

- Checkout sessions are created on the server at:
  - `POST /api/create-checkout-session`
- Product price IDs are not required here because prices are configured as inline
  `price_data` in code.
