// lib/shopify.ts — PRODUCTION

const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN!;
const token = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN!;

if (!process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN) {
  throw new Error("NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN is not set");
}
if (!process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN) {
  throw new Error("NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN is not set");
}

const endpoint = `https://${domain}/api/2024-01/graphql.json`;

// ============================================================
// TYPES
// ============================================================
export type ShopifyImageEdge = {
  node: { url: string; altText?: string };
};

export type ShopifyProduct = {
  id: string;
  title: string;
  handle: string;
  description: string;
  descriptionHtml: string;
  fabricCustom?: any;
  fabricShopify?: any;
  careCustom?: any;
  careShopify?: any;
  priceRange: {
    minVariantPrice: { amount: string; currencyCode: string };
  };
  images: { edges: ShopifyImageEdge[] };
  variants: {
    edges: {
      node: {
        id: string;
        title: string;
        availableForSale: boolean;
        price: { amount: string; currencyCode: string };
      };
    }[];
  };
};

export type ShopifyProductNode = { node: ShopifyProduct };

export type ShopifyCart = {
  id: string;
  checkoutUrl: string;
  lines: {
    edges: {
      node: {
        id: string;
        quantity: number;
        merchandise: {
          id: string;
          title: string;
          product: {
            title: string;
            images: { edges: ShopifyImageEdge[] };
          };
          price: { amount: string; currencyCode: string };
        };
      };
    }[];
  };
  cost: { totalAmount: { amount: string; currencyCode: string } };
};

// ============================================================
// FETCH HELPER
// ============================================================
async function shopifyFetch<T>(query: string, variables = {}): Promise<T> {
  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": token,
    },
    body: JSON.stringify({ query, variables }),
  });

  const json = await res.json();
  if (json.errors) throw new Error(json.errors[0].message);
  return json.data;
}

// ============================================================
// PRODUCTS
// ============================================================
export async function getProductsInCollection(first = 20): Promise<ShopifyProductNode[]> {
  const data = await shopifyFetch<any>(`
    query Products($first: Int!) {
      products(first: $first) {
        edges {
          node {
            id title handle description descriptionHtml
            fabricCustom: metafield(namespace: "custom", key: "fabric") { value }
            fabricShopify: metafield(namespace: "shopify", key: "fabric") { 
              value 
              references(first: 10) { edges { node { ... on Metaobject { handle fields { key value } } } } }
            }
            careCustom: metafield(namespace: "custom", key: "care_instructions") { value }
            careShopify: metafield(namespace: "shopify", key: "care_instructions") { 
              value 
              references(first: 10) { edges { node { ... on Metaobject { handle fields { key value } } } } }
            }
            priceRange { minVariantPrice { amount currencyCode } }
            images(first: 5) { edges { node { url altText } } }
            variants(first: 10) {
              edges {
                node {
                  id title availableForSale
                  price { amount currencyCode }
                }
              }
            }
          }
        }
      }
    }
  `, { first });

  return data.products.edges;
}

export async function getProduct(handle: string): Promise<ShopifyProduct | null> {
  const data = await shopifyFetch<any>(`
    query Product($handle: String!) {
      product(handle: $handle) {
        id title handle description descriptionHtml
        fabricCustom: metafield(namespace: "custom", key: "fabric") { value }
        fabricShopify: metafield(namespace: "shopify", key: "fabric") { 
          value 
          references(first: 10) { edges { node { ... on Metaobject { handle fields { key value } } } } }
        }
        careCustom: metafield(namespace: "custom", key: "care_instructions") { value }
        careShopify: metafield(namespace: "shopify", key: "care_instructions") { 
          value 
          references(first: 10) { edges { node { ... on Metaobject { handle fields { key value } } } } }
        }
        priceRange { minVariantPrice { amount currencyCode } }
        images(first: 5) { edges { node { url altText } } }
        variants(first: 10) {
          edges {
            node {
              id title availableForSale
              price { amount currencyCode }
            }
          }
        }
      }
    }
  `, { handle });

  return data.product ?? null;
}

// ============================================================
// CART (unchanged)
// ============================================================
export async function createCart(variantId: string, quantity = 1): Promise<ShopifyCart> {
  const data = await shopifyFetch<any>(`
    mutation CartCreate($variantId: ID!, $quantity: Int!) {
      cartCreate(input: {
        lines: [{ merchandiseId: $variantId, quantity: $quantity }]
      }) {
        cart {
          id checkoutUrl
          lines(first: 20) { edges { node {
            id quantity
            merchandise {
              ... on ProductVariant {
                id title
                product { title images(first:1) { edges { node { url altText } } } }
                price { amount currencyCode }
              }
            }
          }}}
          cost { totalAmount { amount currencyCode } }
        }
      }
    }
  `, { variantId, quantity });
  return data.cartCreate.cart;
}

export async function addToCart(cartId: string, variantId: string, quantity = 1): Promise<ShopifyCart> {
  const data = await shopifyFetch<any>(`
    mutation CartLinesAdd($cartId: ID!, $variantId: ID!, $quantity: Int!) {
      cartLinesAdd(cartId: $cartId, lines: [{ merchandiseId: $variantId, quantity: $quantity }]) {
        cart {
          id checkoutUrl
          lines(first: 20) { edges { node {
            id quantity
            merchandise {
              ... on ProductVariant {
                id title
                product { title images(first:1) { edges { node { url altText } } } }
                price { amount currencyCode }
              }
            }
          }}}
          cost { totalAmount { amount currencyCode } }
        }
      }
    }
  `, { cartId, variantId, quantity });
  return data.cartLinesAdd.cart;
}

export async function getCart(cartId: string): Promise<ShopifyCart | null> {
  const data = await shopifyFetch<any>(`
    query Cart($cartId: ID!) {
      cart(id: $cartId) {
        id checkoutUrl
        lines(first: 20) { edges { node {
          id quantity
          merchandise {
            ... on ProductVariant {
              id title
              product { title images(first:1) { edges { node { url altText } } } }
              price { amount currencyCode }
            }
          }
        }}}
        cost { totalAmount { amount currencyCode } }
      }
    }
  `, { cartId });
  return data.cart ?? null;
}

export function getShopifyAccountUrl(path: "login" | "register" | "orders" = "login") {
  return `https://${domain}/account/${path}`;
}