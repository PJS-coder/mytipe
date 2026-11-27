# Mytipe Website Analytics & Event Tracking Guide

This project implements centralized, privacy-safe website activity tracking using **Google Tag Manager (GTM) / Google Analytics 4 (`window.dataLayer`)** and **Meta Pixel (`1671422437853807`)**.

---

## 1. Integrated Tracking Systems

### A. Meta Pixel (Active)
- **Pixel ID**: `1671422437853807` (overridable via `NEXT_PUBLIC_META_PIXEL_ID`).
- **Location**: [AnalyticsScripts.tsx](file:///Users/pjs/Desktop/mytipe/src/components/analytics/AnalyticsScripts.tsx) mounted globally in [layout.tsx](file:///Users/pjs/Desktop/mytipe/src/app/layout.tsx).
- **Capabilities**:
  - Initializes `fbq('init', '1671422437853807')` once (`afterInteractive`), preventing duplicate initialization.
  - Fires `PageView` on initial load and automatically fires `PageView` on subsequent Next.js App Router SPA route transitions without double-firing.
  - Fires standard Meta conversion events: `ViewContent`, `AddToCart`, `InitiateCheckout`, `Purchase`, `Search`, `Lead`, `Contact`, and `CompleteRegistration`.

### B. Google Tag Manager (GTM) & GA4 `dataLayer`
- **Container ID**: Set via environment variable `NEXT_PUBLIC_GTM_ID` (e.g., `GTM-XXXXXXX`).
- **Safe Initialization**: `window.dataLayer` is always initialized safely on the client via `initDataLayer()` even before `NEXT_PUBLIC_GTM_ID` is added, so all events can be inspected immediately in Chrome DevTools.
- **How to enable GTM**:
  1. Add `NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX` to `.env.local` and your production hosting environment (Vercel/Railway/etc.).
  2. Redeploy or restart the server.

---

## 2. Centralized Tracking Utility

- **File**: [trackEvent.ts](file:///Users/pjs/Desktop/mytipe/src/lib/analytics/trackEvent.ts)
- **Core Function**: `trackEvent(eventName, params, options)`
  - Pushes structured payloads to `window.dataLayer`.
  - Automatically attaches `event`, `page_name`, `page_url`, `page_path`, and `timestamp`.
  - Clears `ecommerce: null` before pushing GA4 ecommerce events per Google's official GTM specification.
  - Includes built-in **deduplication** (`dedupeKey` + `dedupeWindowMs`) to prevent double-firing on rapid clicks or React StrictMode renders.
  - Strips sensitive/PII keys (`password`, `phone`, `email`, `address`, `otp`, `card`, `cvv`, `token`, `secret`) so personal data is never leaked to analytics.
  - Wrapped in `try/catch` so ad blockers or script failures never break the storefront.

---

## 3. Complete List of Implemented Events

| Event Name | Trigger / Location | Key Parameters | Meta Pixel Mapping |
| :--- | :--- | :--- | :--- |
| `page_view` | Initial load & SPA route changes | `page_path`, `page_location`, `page_title` | `PageView` |
| `navigation_click` | Header nav & logo clicks | `button_name`, `button_location`, `link_url` | — |
| `footer_link_click` | Footer link clicks | `button_name`, `button_location`, `link_url` | — |
| `dropdown_toggle` | Shop dropdown hover/open | `dropdown_name`, `state` | — |
| `button_click` | CTAs (`Buy Now`, `Login`, `SHOP NOW`) | `button_name`, `button_location`, `element_type` | — |
| `hero_banner_click` | Hero carousel slide clicks | `slide_id`, `button_name`, `button_location` | — |
| `category_click` | Homepage category card clicks | `button_name`, `button_location` | — |
| `pair_pack_click` | Story section `Pair of 1/2/3/6` clicks | `button_name`, `button_location` | — |
| `video_interaction` | Instagram reel video clicks | `video_id`, `video_src`, `button_location` | — |
| `view_item` | Product detail page & variant view | `product_id`, `product_name`, `ecommerce` | `ViewContent` |
| `select_variant` | Color or Pack Size selection | `product_id`, `option_name`, `option_value` | — |
| `add_to_cart` | Add to Cart / Quick Add / Buy Now | `product_id`, `quantity`, `value`, `ecommerce` | `AddToCart` |
| `remove_from_cart` | Remove item in Cart / Cart Drawer | `product_id`, `quantity`, `value`, `ecommerce` | — |
| `view_cart` | Opening the Cart Drawer | `value`, `items_count`, `ecommerce` | — |
| `begin_checkout` | Checkout page load with items | `value`, `items_count`, `ecommerce` | `InitiateCheckout` |
| `coupon_applied` | Valid discount code applied | `coupon_code`, `discount_amount` | — |
| `purchase` | Confirmed order on `/order-success` (deduped via `sessionStorage`) | `transaction_id`, `payment_method`, `value`, `ecommerce` | `Purchase` |
| `search` | Navbar search & live search page | `search_term`, `results_count` | `Search` |
| `form_start` | Contact form first focus | `form_name` | — |
| `form_submit_success` | Validated contact form submission | `form_name`, `subject` | `Lead` |
| `form_validation_error` | Checkout / Auth / Contact validation fail | `form_name`, `invalid_fields` | — |
| `otp_requested` | Phone OTP request in Auth modal | `form_name` | — |
| `login` | Successful OTP verification | `method` | `CompleteRegistration` |
| `spin_wheel_play` | Welcome spin wheel spin | `button_name`, `button_location` | — |
| `whatsapp_click` | Global `wa.me` / WhatsApp link click | `button_name`, `button_location`, `link_url` | `Contact` |
| `phone_click` | Global `tel:` link click | `button_name`, `button_location` | `Contact` |
| `email_click` | Global `mailto:` link click | `button_name`, `button_location` | `Contact` |
| `file_download` | Downloadable file link clicks | `file_name`, `link_url` | — |
| `external_link_click` | Outbound links to external domains | `button_name`, `link_domain`, `link_url` | — |

---

## 4. Events Requiring GTM Dashboard Configuration

Once you add your `NEXT_PUBLIC_GTM_ID`, configure the following in Google Tag Manager to forward `dataLayer` events to GA4:

1. **GA4 Configuration / Google Tag**:
   - Trigger: `Initialization - All Pages`
   - Measurement ID: `G-XXXXXXXXXX`
2. **GA4 Ecommerce Tag**:
   - Tag Type: `Google Analytics: GA4 Event`
   - Event Name: `{{Event}}`
   - More Settings → Ecommerce → Check **Send Ecommerce data** (`Data Layer`)
   - Trigger: Custom Event regex matching `^(view_item|add_to_cart|remove_from_cart|view_cart|begin_checkout|purchase)$`
3. **GA4 Custom Interaction Events Tag**:
   - Tag Type: `Google Analytics: GA4 Event`
   - Event Name: `{{Event}}`
   - Event Parameters: map `button_name`, `button_location`, `form_name`, `search_term`, `link_url`, `option_name`, `option_value` from Data Layer Variables.
   - Trigger: Custom Event regex matching `^(page_view|navigation_click|footer_link_click|dropdown_toggle|button_click|hero_banner_click|category_click|pair_pack_click|video_interaction|select_variant|coupon_applied|search|form_start|form_submit_success|form_validation_error|otp_requested|login|spin_wheel_play|whatsapp_click|phone_click|email_click|file_download|external_link_click)$`

---

## 5. Files Created & Modified

- **Created**:
  - [trackEvent.ts](file:///Users/pjs/Desktop/mytipe/src/lib/analytics/trackEvent.ts)
  - [AnalyticsScripts.tsx](file:///Users/pjs/Desktop/mytipe/src/components/analytics/AnalyticsScripts.tsx)
  - [TRACKING_README.md](file:///Users/pjs/Desktop/mytipe/TRACKING_README.md)
- **Modified**:
  - [layout.tsx](file:///Users/pjs/Desktop/mytipe/src/app/layout.tsx)
  - [CartContext.tsx](file:///Users/pjs/Desktop/mytipe/src/context/CartContext.tsx)
  - [ProductDetailClient.tsx](file:///Users/pjs/Desktop/mytipe/src/app/products/[handle]/ProductDetailClient.tsx)
  - [ProductInfo.tsx](file:///Users/pjs/Desktop/mytipe/src/components/product/ProductInfo.tsx)
  - [CheckoutClient.tsx](file:///Users/pjs/Desktop/mytipe/src/app/checkout/CheckoutClient.tsx)
  - [OrderSuccessClient.tsx](file:///Users/pjs/Desktop/mytipe/src/app/order-success/OrderSuccessClient.tsx)
  - [Navbar.tsx](file:///Users/pjs/Desktop/mytipe/src/components/layout/Navbar.tsx)
  - [Footer.tsx](file:///Users/pjs/Desktop/mytipe/src/components/layout/Footer.tsx)
  - [Hero.tsx](file:///Users/pjs/Desktop/mytipe/src/components/home/Hero.tsx)
  - [CategoryCards.tsx](file:///Users/pjs/Desktop/mytipe/src/components/home/CategoryCards.tsx)
  - [StorySection.tsx](file:///Users/pjs/Desktop/mytipe/src/components/home/StorySection.tsx)
  - [InstagramFeed.tsx](file:///Users/pjs/Desktop/mytipe/src/components/home/InstagramFeed.tsx)
  - [ContactClient.tsx](file:///Users/pjs/Desktop/mytipe/src/app/contact/ContactClient.tsx)
  - [SearchClient.tsx](file:///Users/pjs/Desktop/mytipe/src/app/search/SearchClient.tsx)
  - [AuthModal.tsx](file:///Users/pjs/Desktop/mytipe/src/components/auth/AuthModal.tsx)
  - [SpinWheelModal.tsx](file:///Users/pjs/Desktop/mytipe/src/components/rewards/SpinWheelModal.tsx)

---

## 6. Testing & Verification Checklist

1. **Meta Pixel Helper (Chrome Extension)**:
   - Open the storefront and confirm Pixel ID `1671422437853807` shows green `PageView` on initial load and on SPA route navigation without duplicates.
2. **Browser DevTools (`window.dataLayer`)**:
   - Open DevTools Console and type `window.dataLayer`.
   - Click header/footer links, hero banners, category cards, color/pack options, Add to Cart, Checkout, and Search — verify each action pushes a single clean event object with `page_name`, `page_url`, and `timestamp`.
3. **Ecommerce Funnel Check**:
   - Visit `/products/foot-alignment-socks` -> verify `view_item` (`ViewContent`).
   - Click **Add to Cart** -> verify `add_to_cart` (`AddToCart`) and `view_cart`.
   - Visit `/checkout` -> verify `begin_checkout` (`InitiateCheckout`).
   - Complete an order -> verify `purchase` (`Purchase`) fires once on `/order-success` and does **not** re-fire on page refresh.
4. **Privacy Check**:
   - Trigger `form_validation_error`, `login`, `form_submit_success` -> verify zero phone numbers, emails, OTPs, or street addresses appear in `window.dataLayer`.
