# Jabalpur Generic Meds

A demo storefront and admin panel for a generic-medicine shop, built with React, TypeScript and Vite. Customers get an English/Hindi interface and a light/dark theme. The shop owner gets a separate admin dashboard.

## Features

- **Customer side**: product browsing and search, cart and checkout with redeemable loyalty points, English and Hindi (`name_en` / `name_hi` on every product)
- **Admin side**: dashboard with charts (Recharts), product and order management, shop settings
- **Light and dark theme**

## Demo limitations

This is a front-end demo, not a production shop:

- There is no backend. Products, orders, settings and users are stored in the browser's `localStorage` (`services/dataService.ts`) and start from the sample data in `constants.ts`.
- The login is simulated. Any password is accepted, and `admin@shop.com` opens the admin panel. Do not use it to protect real data.
- Product names and prices are sample data.

## Run locally

Requires Node.js 18 or newer.

```bash
npm install
npm run dev
```

The app runs at http://localhost:3000. Build with `npm run build`.

## Notes

The project was started in Google AI Studio and then edited by hand. The original prompt history is in `migrated_prompt_history/`.
