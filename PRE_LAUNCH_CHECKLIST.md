# 🚀 Pre-Launch Checklist

Use this checklist before deploying TypeTee.app to production.

## 🔧 Development Setup

- [ ] All dependencies installed (`npm install`)
- [ ] Development server runs without errors (`npm run dev`)
- [ ] `.env.local` file created with all required variables
- [ ] TypeScript compiles without errors (`npm run build`)

## 🔑 API Credentials

### Stripe
- [ ] Stripe account created
- [ ] Test mode keys obtained
- [ ] Production mode keys obtained
- [ ] Webhook endpoint configured
- [ ] Webhook secret saved
- [ ] Test checkout completed successfully

### Printify
- [ ] Printify account created
- [ ] Shop created
- [ ] Products added (Black & White unisex t-shirts)
- [ ] All sizes configured (S, M, L, XL, 2XL)
- [ ] US supplier connected
- [ ] UK supplier connected
- [ ] API key generated
- [ ] Product IDs documented
- [ ] Supplier IDs documented

## 🎨 Design & Content

- [ ] All three fonts display correctly
- [ ] Text editor works with blinking cursor
- [ ] ASCII art converter functions properly
- [ ] All density presets tested
- [ ] Theme toggle switches UI and shirt color
- [ ] T-shirt preview renders correctly
- [ ] Preview updates in real-time
- [ ] Mobile responsive design verified

## 🛒 Checkout Flow

- [ ] Size selection works
- [ ] Sizing guide displays correctly
- [ ] Shipping form validates properly
- [ ] All required fields enforced
- [ ] Country selector functional
- [ ] Terms & conditions link works
- [ ] Checkout button enabled only with design
- [ ] Stripe redirect successful
- [ ] Test payment completes

## 📧 Order Processing

- [ ] Webhook receives checkout.session.completed events
- [ ] Orders created in Printify
- [ ] Correct supplier selected based on address
- [ ] Print files generated at correct resolution
- [ ] Email confirmation sends (check logs or test)
- [ ] Order details correct in email
- [ ] Design preview shows in email

## 📱 Testing

### Desktop Testing
- [ ] Chrome/Edge
- [ ] Firefox
- [ ] Safari
- [ ] Theme toggle
- [ ] All fonts
- [ ] Image upload
- [ ] Checkout flow

### Mobile Testing
- [ ] iOS Safari
- [ ] Android Chrome
- [ ] Portrait orientation
- [ ] Landscape orientation
- [ ] Touch targets (min 44px)
- [ ] Image upload from camera
- [ ] Checkout on mobile

### Edge Cases
- [ ] Very long text (word wrapping)
- [ ] Large image upload (>5MB)
- [ ] Invalid image format
- [ ] Empty design prevention
- [ ] Form validation errors
- [ ] Network errors handled gracefully

## 🔒 Security

- [ ] Environment variables not committed to git
- [ ] `.env.local` in .gitignore
- [ ] Production Stripe keys separate from test keys
- [ ] Webhook signature verification enabled
- [ ] No API keys exposed in client code
- [ ] HTTPS enabled (automatic with Netlify)

## 📄 Legal & Compliance

- [ ] Terms & Conditions page complete
- [ ] No refunds policy clearly stated
- [ ] Print quality disclaimer included
- [ ] Sizing guide accurate
- [ ] Privacy policy if needed
- [ ] Contact email configured
- [ ] Support email monitored

## 🚀 Deployment

### Pre-Deployment
- [ ] Code committed to Git
- [ ] Repository pushed to GitHub
- [ ] `.env.local` NOT in repository
- [ ] Production build tested locally (`npm run build`)
- [ ] No console errors in production build

### Netlify Setup
- [ ] Netlify account created
- [ ] Site created from GitHub repo
- [ ] Build command verified (`npm run build`)
- [ ] Publish directory verified (`.next`)
- [ ] All environment variables added to Netlify
- [ ] Production Stripe keys used
- [ ] Custom domain configured (optional)

### Post-Deployment
- [ ] Site accessible at Netlify URL
- [ ] Homepage loads correctly
- [ ] Theme toggle works
- [ ] Design interface functional
- [ ] Test purchase completed end-to-end
- [ ] Order sent to Printify
- [ ] Confirmation email received
- [ ] Success page displays

## 🎯 Final Verification

### Complete Purchase Flow
1. [ ] Visit homepage
2. [ ] Create a text design
3. [ ] Toggle theme (black/white)
4. [ ] Upload image for ASCII art
5. [ ] Adjust density
6. [ ] Select placement (front/back)
7. [ ] Click "Buy Now"
8. [ ] Select size
9. [ ] View sizing guide
10. [ ] Fill shipping form
11. [ ] Review terms
12. [ ] Complete Stripe payment
13. [ ] View success page
14. [ ] Receive confirmation email
15. [ ] Verify order in Printify
16. [ ] Check correct supplier

### Performance
- [ ] Homepage loads in < 3 seconds
- [ ] Images optimized
- [ ] Theme switch is instant
- [ ] Preview updates quickly
- [ ] Mobile performance acceptable
- [ ] Lighthouse score > 80

## 📊 Monitoring & Support

- [ ] Error tracking configured (optional: Sentry)
- [ ] Support email set up (support@typetee.app)
- [ ] Email monitoring active
- [ ] Stripe dashboard notifications enabled
- [ ] Printify notifications enabled
- [ ] Domain email working (if using custom domain)

## 📈 Post-Launch

- [ ] Test order placed and received
- [ ] Print quality verified
- [ ] Shipping times documented
- [ ] Customer support process defined
- [ ] Backup plan for order issues
- [ ] Refund/replacement policy clarified (if any exceptions)

## 🎉 Launch Day

- [ ] All tests passing
- [ ] All items above checked
- [ ] Test order received and approved
- [ ] Ready to share with the world!

---

## 🆘 Emergency Contacts

**If something goes wrong:**

- Stripe Support: https://support.stripe.com/
- Printify Support: https://printify.com/contact/
- Netlify Support: https://www.netlify.com/support/
- Next.js Docs: https://nextjs.org/docs

## ✅ Launch Approval

When everything above is checked and tested:

**Launched by:** ________________

**Launch date:** ________________

**Launch URL:** ________________

**Notes:**
___________________________________
___________________________________
___________________________________

---

**🚀 Ready to launch TypeTee.app!**
