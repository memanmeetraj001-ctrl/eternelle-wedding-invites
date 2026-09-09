/**
 * Gumroad Store & Product Configuration
 * 
 * Replace the product slugs below with your exact Gumroad product URLs
 * created at https://app.gumroad.com/products
 */

export const GUMROAD_CONFIG = {
  // Main Storefront URL
  storeUrl: 'https://manmeetraj6.gumroad.com',

  // Individual Product Links
  products: {
    // Single Event Pro Pass ($19)
    pro: {
      id: 'pro-pass',
      name: 'Éternelle Pro Wedding Pass',
      price: '$19',
      // If you create a product named "pro-pass" on Gumroad, use that URL:
      url: 'https://manmeetraj6.gumroad.com/l/pro-pass',
      fallbackUrl: 'https://manmeetraj6.gumroad.com',
    },

    // Lifetime Creator / Planner Deal ($79)
    lifetime: {
      id: 'lifetime-deal',
      name: 'Éternelle Lifetime Creator Pass',
      price: '$79',
      // If you create a product named "lifetime-deal" on Gumroad, use that URL:
      url: 'https://manmeetraj6.gumroad.com/l/lifetime-deal',
      fallbackUrl: 'https://manmeetraj6.gumroad.com',
    },
  },
};

/**
 * Open Gumroad checkout in a new window or trigger Gumroad overlay
 */
export function openGumroadProduct(plan: 'pro' | 'lifetime') {
  const product = GUMROAD_CONFIG.products[plan];
  const targetUrl = product?.url || GUMROAD_CONFIG.storeUrl;
  window.open(targetUrl, '_blank', 'noopener,noreferrer');
}
