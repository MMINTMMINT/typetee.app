# TypeTee.app - Retro ASCII T-Shirt Designer

A Jamstack web application for designing custom ASCII art and text t-shirts with an authentic 1980s computer terminal aesthetic.

## Features

- 🎨 **Real-time Design Editor** - Text and ASCII art editor with blinking cursor
- 🖥️ **Retro Terminal Aesthetic** - Authentic 80s computer interface with chunky buttons
- 🎯 **Three Retro Fonts** - Commodore 64 Pixel, VT323, Press Start 2P
- 🖼️ **ASCII Art Generator** - Convert images to ASCII with 5 density presets
- 🎨 **Theme Toggle** - Black/white theme that controls both UI and t-shirt color
- 👕 **Live Preview** - Real-time t-shirt preview with design
- 💳 **Stripe Checkout** - Secure payment processing
- 📦 **Printify Integration** - Automatic order fulfillment with US/UK supplier routing
- 📧 **Retro Email Confirmations** - Terminal-styled HTML order emails

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS
- **State Management:** Zustand
- **Payments:** Stripe
- **Fulfillment:** Printify API
- **Image Processing:** Sharp
- **Hosting:** Netlify
- **Language:** TypeScript

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Stripe account
- Printify account

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/typetee.app.git
cd typetee.app
```

2. Install dependencies:
```bash
npm install
```
3. Set up environment variables:
```bash
cp .env.local.example .env.local
```

Then edit `.env.local` with your actual keys:
- Stripe publishable and secret keys
- Printify API key and shop ID
- Printify product IDs for black and white t-shirts
- Printify supplier IDs for US and UK

4. Run the development server:
```bash
npm run dev


npm run build

```
4606px x 5787px

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables

Required environment variables (see `.env.local.example`):

- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Your Stripe publishable key
- `STRIPE_SECRET_KEY` - Your Stripe secret key
- `STRIPE_WEBHOOK_SECRET` - Your Stripe webhook secret
- `PRINTIFY_API_KEY` - Your Printify API key
- `PRINTIFY_SHOP_ID` - Your Printify shop ID
- `PRINTIFY_PRODUCT_ID_BLACK` - Printify product ID for black t-shirts
- `PRINTIFY_PRODUCT_ID_WHITE` - Printify product ID for white t-shirts
- `PRINTIFY_SUPPLIER_US` - US supplier ID
- `PRINTIFY_SUPPLIER_UK` - UK supplier ID
- `NEXT_PUBLIC_BASE_URL` - Your site URL (for production)

## Deployment

### Netlify

1. Push your code to GitHub

2. Connect your repository to Netlify

3. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `.next`

4. Add environment variables in Netlify dashboard

5. Deploy!

GITHUB:
git add -A && git commit -m "Your commit message" && git push origin main

### Stripe Webhook Setup

1. In Stripe dashboard, go to Developers > Webhooks
2. Add endpoint: `https://yourdomain.com/api/webhooks/stripe`
3. Select event: `checkout.session.completed`
4. Copy webhook secret to `STRIPE_WEBHOOK_SECRET`

## Project Structure

```
typetee.app/
├── app/                      # Next.js app router pages
│   ├── api/                 # API routes
│   │   ├── create-checkout-session/
│   │   └── webhooks/stripe/
│   ├── checkout/            # Checkout page
│   ├── success/             # Order confirmation page
│   ├── terms/               # Terms & conditions
│   ├── sizing/              # Sizing guide
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Home page
│   └── globals.css          # Global styles
├── components/              # React components
│   ├── DesignStudio.tsx    # Main design interface
│   ├── ThemeToggle.tsx     # Theme switcher
│   ├── DesignControls.tsx  # Control panel
│   ├── TextControls.tsx    # Text editor controls
│   ├── AsciiControls.tsx   # ASCII art controls
│   ├── PlacementControls.tsx
│   ├── TShirtPreview.tsx   # Live preview
│   └── CheckoutButton.tsx  # Buy button
├── lib/                     # Utilities and helpers
│   ├── asciiConverter.ts   # Image to ASCII conversion
│   ├── imageGenerator.ts   # Print-ready image generation
│   ├── printify.ts         # Printify API integration
│   └── email.ts            # Email sending
├── store/                   # State management
│   └── designStore.ts      # Zustand store
├── public/                  # Static assets
│   └── sounds/             # UI sound effects (optional)
└── package.json
```

## Features in Detail

### Design Modes

1. **Text Mode**: Type custom text with adjustable fonts and sizes
2. **ASCII Mode**: Upload images and convert to ASCII art with density controls

### Theme System

- Synchronized UI and t-shirt color (black or white)
- Instant theme switching
- High contrast for accessibility

### Print Specifications

- Print area: 4606x5787px at 300 DPI
- DTG (Direct-to-Garment) printing
- Transparent background PNG format
- Automatic supplier routing based on shipping address

### Checkout Flow

1. Design your shirt
2. Select size (with sizing guide)
3. Enter shipping information
4. Secure payment via Stripe
5. Automatic order to Printify
6. Email confirmation

## Customization

### Adding Fonts

Edit `tailwind.config.js` and `components/TextControls.tsx` to add new retro fonts.

### Modifying ASCII Density

Adjust character sets in `lib/asciiConverter.ts`.

### Changing Pricing

Update price in `components/CheckoutButton.tsx` and `app/api/create-checkout-session/route.ts`.

## Legal & Compliance

- No cookies or tracking
- Anonymous checkout
- No user accounts
- No design storage
- Clear no-refunds policy
- Print quality disclaimer

## Support

For questions or issues:
- Email: support@typetee.app
- GitHub Issues: [Create an issue](https://github.com/yourusername/typetee.app/issues)

## License

© 2025 TypeTee.app - All Rights Reserved

## Acknowledgments

- Inspired by 1980s computer terminals
- Built with modern Jamstack architecture
- Retro fonts from Google Fonts

---

**Note**: This is a custom print-on-demand application. Remember to:
1. Configure your Printify products correctly
2. Test the full checkout flow before going live
3. Set up Stripe in production mode
4. Configure proper error tracking (Sentry, etc.)
5. Add optional analytics (privacy-friendly options)
