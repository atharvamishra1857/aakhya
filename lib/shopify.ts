// lib/shopify.ts

// ============================================================
// TYPES
// ============================================================

export type ShopifyImageEdge = {
  node: {
    url: string;
    altText?: string;
  };
};

export type ShopifyProduct = {
  id: string;
  title: string;
  handle: string;
  description: string;
  priceRange: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
  images: {
    edges: ShopifyImageEdge[];
  };
  variants: {
    edges: {
      node: {
        id: string;
        title: string;
        availableForSale: boolean;
        price: {
          amount: string;
          currencyCode: string;
        };
      };
    }[];
  };
};

export type ShopifyProductNode = {
  node: ShopifyProduct;
};

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
          price: {
            amount: string;
            currencyCode: string;
          };
        };
      };
    }[];
  };
  cost: {
    totalAmount: {
      amount: string;
      currencyCode: string;
    };
  };
};

// ============================================================
// CONFIGURATION — all values come from environment variables,
// never hardcoded. These are server-side only (no NEXT_PUBLIC_).
// ============================================================

function getShopifyConfig() {
  const domain = process.env.SHOPIFY_STORE_DOMAIN;
  const token = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;

  if (!domain || !token) {
    throw new Error(
      "Missing Shopify environment variables. " +
      "Ensure SHOPIFY_STORE_DOMAIN and SHOPIFY_STOREFRONT_ACCESS_TOKEN are set in .env.local"
    );
  }

  return {
    endpoint: `https://${domain}/api/2024-01/graphql.json`,
    token,
  };
}

// ============================================================
// CORE FETCHER — one place for all Shopify API calls
// ============================================================

type ShopifyFetchOptions = {
  query: string;
  variables?: Record<string, unknown>;
  tags?: string[]; // For Next.js cache tag revalidation
};

async function shopifyFetch<T>({ query, variables, tags }: ShopifyFetchOptions): Promise<T> {
  const { endpoint, token } = getShopifyConfig();

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // Storefront API token — safe to use here since this runs server-side only
      "X-Shopify-Storefront-Access-Token": token,
    },
    body: JSON.stringify({ query, variables }), // variables = safe, no string interpolation
    next: {
      // Cache responses; revalidate every 60s or when a tag is invalidated
      revalidate: 60,
      tags,
    },
  });

  if (!response.ok) {
    throw new Error(`Shopify API error: ${response.status} ${response.statusText}`);
  }

  const json = await response.json();

  // Shopify returns HTTP 200 even for GraphQL errors — check explicitly
  if (json.errors) {
    console.error("Shopify GraphQL errors:", json.errors);
    throw new Error(json.errors[0]?.message ?? "Unknown Shopify GraphQL error");
  }

  return json.data as T;
}

// ============================================================
// QUERIES — parameterized with variables, never interpolated
// ============================================================

const PRODUCTS_QUERY = `
  query getProducts($first: Int!) {
    products(first: $first) {
      edges {
        node {
          id
          title
          handle
          description
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
          images(first: 5) {
            edges {
              node {
                url
                altText
              }
            }
          }
          variants(first: 10) {
            edges {
              node {
                id
                title
                availableForSale
                price {
                  amount
                  currencyCode
                }
              }
            }
          }
        }
      }
    }
  }
`;

// Handle is passed as a variable — NOT string-interpolated into the query
const PRODUCT_BY_HANDLE_QUERY = `
  query getProduct($handle: String!) {
    product(handle: $handle) {
      id
      title
      handle
      description
      priceRange {
        minVariantPrice {
          amount
          currencyCode
        }
      }
      images(first: 5) {
        edges {
          node {
            url
            altText
          }
        }
      }
      variants(first: 10) {
        edges {
          node {
            id
            title
            availableForSale
            price {
              amount
              currencyCode
            }
          }
        }
      }
    }
  }
`;

const CREATE_CART_MUTATION = `
  mutation createCart($lines: [CartLineInput!]) {
    cartCreate(input: { lines: $lines }) {
      cart {
        id
        checkoutUrl
        lines(first: 10) {
          edges {
            node {
              id
              quantity
              merchandise {
                ... on ProductVariant {
                  id
                  title
                  price { amount currencyCode }
                  product {
                    title
                    images(first: 1) { edges { node { url altText } } }
                  }
                }
              }
            }
          }
        }
        cost {
          totalAmount { amount currencyCode }
        }
      }
    }
  }
`;

const ADD_TO_CART_MUTATION = `
  mutation addToCart($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart {
        id
        checkoutUrl
        lines(first: 10) {
          edges {
            node {
              id
              quantity
              merchandise {
                ... on ProductVariant {
                  id
                  title
                  price { amount currencyCode }
                  product {
                    title
                    images(first: 1) { edges { node { url altText } } }
                  }
                }
              }
            }
          }
        }
        cost {
          totalAmount { amount currencyCode }
        }
      }
    }
  }
`;

const GET_CART_QUERY = `
  query getCart($cartId: ID!) {
    cart(id: $cartId) {
      id
      checkoutUrl
      lines(first: 10) {
        edges {
          node {
            id
            quantity
            merchandise {
              ... on ProductVariant {
                id
                title
                price { amount currencyCode }
                product {
                  title
                  images(first: 1) { edges { node { url altText } } }
                }
              }
            }
          }
        }
      }
      cost {
        totalAmount { amount currencyCode }
      }
    }
  }
`;

// ============================================================
// PUBLIC API — these are the functions your pages/components call
// ============================================================

export async function getProductsInCollection(first = 20): Promise<ShopifyProductNode[]> {
  const data = await shopifyFetch<{ products: { edges: ShopifyProductNode[] } }>({
    query: PRODUCTS_QUERY,
    variables: { first },
    tags: ["products"],
  });

  return data.products.edges;
}

export async function getProduct(handle: string): Promise<ShopifyProduct | null> {
  // Basic validation before it even reaches the API
  if (!handle || typeof handle !== "string" || !/^[a-z0-9-]+$/.test(handle)) {
    return null;
  }

  const data = await shopifyFetch<{ product: ShopifyProduct | null }>({
    query: PRODUCT_BY_HANDLE_QUERY,
    variables: { handle }, // passed as variable, never interpolated
    tags: [`product-${handle}`],
  });

  return data.product;
}

export async function createCart(
  variantId: string,
  quantity = 1
): Promise<ShopifyCart> {
  const data = await shopifyFetch<{ cartCreate: { cart: ShopifyCart } }>({
    query: CREATE_CART_MUTATION,
    variables: {
      lines: [{ merchandiseId: variantId, quantity }],
    },
  });

  return data.cartCreate.cart;
}

export async function addToCart(
  cartId: string,
  variantId: string,
  quantity = 1
): Promise<ShopifyCart> {
  const data = await shopifyFetch<{ cartLinesAdd: { cart: ShopifyCart } }>({
    query: ADD_TO_CART_MUTATION,
    variables: {
      cartId,
      lines: [{ merchandiseId: variantId, quantity }],
    },
  });

  return data.cartLinesAdd.cart;
}

export async function getCart(cartId: string): Promise<ShopifyCart | null> {
  const data = await shopifyFetch<{ cart: ShopifyCart | null }>({
    query: GET_CART_QUERY,
    variables: { cartId },
  });

  return data.cart;
}

// login  

export function getShopifyAccountUrl(path: 'login' | 'register' | 'orders' = 'login') {
  // Make sure this matches the variable name in your .env file
  const domain = process.env.SHOPIFY_STORE_DOMAIN || process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
  
  // If the domain is missing, gracefully fallback to the homepage to prevent crashes
  if (!domain) return '/';
  
  return `https://${domain}/account/${path}`;
}