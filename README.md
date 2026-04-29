# ControlledChaos

Simple contact form with a Node.js backend endpoint for message delivery.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy and update environment values:
   ```bash
   cp .env.example .env
   ```
3. Start the app:
   ```bash
   npm start
   ```
4. Open `http://localhost:3000`.

## Environment variables

- `PORT` (optional): Server port (default `3000`)
- `SMTP_HOST`: SMTP server hostname
- `SMTP_PORT`: SMTP server port (usually `465`, `587`, or `2525`)
- `SMTP_SECURE`: `true` for implicit TLS (commonly with port 465), otherwise `false`
- `SMTP_USER`: SMTP username
- `SMTP_PASS`: SMTP password
- `CONTACT_FROM_EMAIL` (optional): From address used when sending contact emails
- `CONTACT_TO_EMAIL`: Destination inbox for contact form submissions
- `MOCK_EMAIL` (optional): Set to `true` to test locally without real SMTP delivery

## Local testing without SMTP

You can test the full form flow without an SMTP account:

1. Set `MOCK_EMAIL=true` in `.env`.
2. Set `CONTACT_TO_EMAIL` and `CONTACT_FROM_EMAIL` to any valid-looking email addresses.
3. Run `npm start` and submit the form.

The server will accept submissions and log a mock email payload to the console.
