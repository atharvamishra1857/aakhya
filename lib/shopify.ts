// lib/shopify.ts — PRODUCTION + MOCK MODE
//
// Set NEXT_PUBLIC_USE_MOCK_SHOPIFY=true in .env.local to skip the real
// Shopify connection and use fake data instead. Flip it back to false
// (or remove it) to go live. Nothing else in your app needs to change.

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK_SHOPIFY === "true";

const domain = USE_MOCK
  ? "mock.myshopify.com"
  : process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN!;

const token = USE_MOCK
  ? "mock-token"
  : process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN!;

if (!USE_MOCK) {
  if (!process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN) {
    throw new Error("NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN is not set");
  }
  if (!process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN) {
    throw new Error("NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN is not set");
  }
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
  updatedAt: string;
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
        compareAtPrice?: { amount: string; currencyCode: string } | null;
        selectedOptions: { name: string; value: string }[];
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
// MOCK DATA
// ============================================================

// Uses picsum.photos for stable placeholder images (no API key needed).
const MOCK_PRODUCTS: ShopifyProduct[] = [
  {
    id: "gid://shopify/Product/mock-001",
    title: "Classic White Tee",
    handle: "classic-white-tee",
    description:
      "A timeless everyday white tee crafted from 100% organic cotton.",
    descriptionHtml:
      "<p>A timeless everyday white tee crafted from <strong>100% organic cotton</strong>.</p>",
    updatedAt: "2024-01-15T10:00:00Z",
    fabricCustom: { value: "100% Organic Cotton" },
    fabricShopify: null,
    careCustom: { value: "Machine wash cold, tumble dry low" },
    careShopify: null,
    priceRange: { minVariantPrice: { amount: "29.99", currencyCode: "USD" } },
    images: {
      edges: [
        {
          node: {
            url: "https://picsum.photos/seed/white-tee-1/800/1000",
            altText: "Classic White Tee front",
          },
        },
        {
          node: {
            url: "https://picsum.photos/seed/white-tee-2/800/1000",
            altText: "Classic White Tee back",
          },
        },
      ],
    },
    variants: {
      edges: [
        {
          node: {
            id: "gid://shopify/ProductVariant/mock-001-S",
            title: "S / White",
            availableForSale: true,
            price: { amount: "29.99", currencyCode: "USD" },
            selectedOptions: [
              { name: "Size", value: "S" },
              { name: "Color", value: "White" },
            ],
          },
        },
        {
          node: {
            id: "gid://shopify/ProductVariant/mock-001-M",
            title: "M / White",
            availableForSale: true,
            price: { amount: "29.99", currencyCode: "USD" },
            selectedOptions: [
              { name: "Size", value: "M" },
              { name: "Color", value: "White" },
            ],
          },
        },
        {
          node: {
            id: "gid://shopify/ProductVariant/mock-001-L",
            title: "L / White",
            availableForSale: false,
            price: { amount: "29.99", currencyCode: "USD" },
            selectedOptions: [
              { name: "Size", value: "L" },
              { name: "Color", value: "White" },
            ],
          },
        },
      ],
    },
  },
  {
    id: "gid://shopify/Product/mock-002",
    title: "Linen Relaxed Trousers",
    handle: "linen-relaxed-trousers",
    description:
      "Breathable wide-leg linen trousers. Perfect for warm days and relaxed occasions.",
    descriptionHtml:
      "<p>Breathable wide-leg linen trousers. Perfect for <em>warm days</em> and relaxed occasions.</p>",
    updatedAt: "2024-02-10T08:30:00Z",
    fabricCustom: { value: "100% European Linen" },
    fabricShopify: null,
    careCustom: { value: "Hand wash cold or dry clean" },
    careShopify: null,
    priceRange: { minVariantPrice: { amount: "79.99", currencyCode: "USD" } },
    images: {
      edges: [
        {
          node: {
            url: "https://picsum.photos/seed/linen-trouser-1/800/1000",
            altText: "Linen Relaxed Trousers",
          },
        },
        {
          node: {
            url: "https://picsum.photos/seed/linen-trouser-2/800/1000",
            altText: "Linen Relaxed Trousers detail",
          },
        },
      ],
    },
    variants: {
      edges: [
        {
          node: {
            id: "gid://shopify/ProductVariant/mock-002-28",
            title: "28 / Sand",
            availableForSale: true,
            price: { amount: "79.99", currencyCode: "USD" },
            selectedOptions: [
              { name: "Waist", value: "28" },
              { name: "Color", value: "Sand" },
            ],
          },
        },
        {
          node: {
            id: "gid://shopify/ProductVariant/mock-002-30",
            title: "30 / Sand",
            availableForSale: true,
            price: { amount: "79.99", currencyCode: "USD" },
            selectedOptions: [
              { name: "Waist", value: "30" },
              { name: "Color", value: "Sand" },
            ],
          },
        },
        {
          node: {
            id: "gid://shopify/ProductVariant/mock-002-32",
            title: "32 / Black",
            availableForSale: true,
            price: { amount: "79.99", currencyCode: "USD" },
            selectedOptions: [
              { name: "Waist", value: "32" },
              { name: "Color", value: "Black" },
            ],
          },
        },
      ],
    },
  },
  {
    id: "gid://shopify/Product/mock-003",
    title: "Merino Wool Crewneck",
    handle: "merino-wool-crewneck",
    description:
      "Lightweight merino wool crewneck sweater. Naturally temperature-regulating and itch-free.",
    descriptionHtml:
      "<p>Lightweight merino wool crewneck sweater. <strong>Naturally temperature-regulating</strong> and itch-free.</p>",
    updatedAt: "2024-03-05T14:00:00Z",
    fabricCustom: { value: "100% Merino Wool (17.5 micron)" },
    fabricShopify: null,
    careCustom: { value: "Machine wash gentle, lay flat to dry" },
    careShopify: null,
    priceRange: { minVariantPrice: { amount: "119.00", currencyCode: "USD" } },
    images: {
      edges: [
        {
          node: {
            url: "https://picsum.photos/seed/merino-crew-1/800/1000",
            altText: "Merino Wool Crewneck front",
          },
        },
        {
          node: {
            url: "https://picsum.photos/seed/merino-crew-2/800/1000",
            altText: "Merino Wool Crewneck side",
          },
        },
        {
          node: {
            url: "https://picsum.photos/seed/merino-crew-3/800/1000",
            altText: "Merino Wool Crewneck texture",
          },
        },
      ],
    },
    variants: {
      edges: [
        {
          node: {
            id: "gid://shopify/ProductVariant/mock-003-S-navy",
            title: "S / Navy",
            availableForSale: true,
            price: { amount: "119.00", currencyCode: "USD" },
            selectedOptions: [
              { name: "Size", value: "S" },
              { name: "Color", value: "Navy" },
            ],
          },
        },
        {
          node: {
            id: "gid://shopify/ProductVariant/mock-003-M-navy",
            title: "M / Navy",
            availableForSale: true,
            price: { amount: "119.00", currencyCode: "USD" },
            selectedOptions: [
              { name: "Size", value: "M" },
              { name: "Color", value: "Navy" },
            ],
          },
        },
        {
          node: {
            id: "gid://shopify/ProductVariant/mock-003-M-oatmeal",
            title: "M / Oatmeal",
            availableForSale: false,
            price: { amount: "119.00", currencyCode: "USD" },
            selectedOptions: [
              { name: "Size", value: "M" },
              { name: "Color", value: "Oatmeal" },
            ],
          },
        },
        {
          node: {
            id: "gid://shopify/ProductVariant/mock-003-L-oatmeal",
            title: "L / Oatmeal",
            availableForSale: true,
            price: { amount: "119.00", currencyCode: "USD" },
            selectedOptions: [
              { name: "Size", value: "L" },
              { name: "Color", value: "Oatmeal" },
            ],
          },
        },
      ],
    },
  },
  {
    id: "gid://shopify/Product/mock-004",
    title: "Canvas Tote Bag",
    handle: "canvas-tote-bag",
    description:
      "Heavy-duty waxed canvas tote with interior pockets. Built to last years.",
    descriptionHtml:
      "<p>Heavy-duty waxed canvas tote with interior pockets. <strong>Built to last years.</strong></p>",
    updatedAt: "2024-01-28T09:15:00Z",
    fabricCustom: { value: "Waxed Cotton Canvas" },
    fabricShopify: null,
    careCustom: { value: "Spot clean only, re-wax annually" },
    careShopify: null,
    priceRange: { minVariantPrice: { amount: "49.00", currencyCode: "USD" } },
    images: {
      edges: [
        {
          node: {
            url: "https://picsum.photos/seed/canvas-tote-1/800/1000",
            altText: "Canvas Tote Bag",
          },
        },
        {
          node: {
            url: "https://picsum.photos/seed/canvas-tote-2/800/1000",
            altText: "Canvas Tote Bag interior",
          },
        },
      ],
    },
    variants: {
      edges: [
        {
          node: {
            id: "gid://shopify/ProductVariant/mock-004-natural",
            title: "Natural",
            availableForSale: true,
            price: { amount: "49.00", currencyCode: "USD" },
            selectedOptions: [{ name: "Color", value: "Natural" }],
          },
        },
        {
          node: {
            id: "gid://shopify/ProductVariant/mock-004-black",
            title: "Black",
            availableForSale: true,
            price: { amount: "49.00", currencyCode: "USD" },
            selectedOptions: [{ name: "Color", value: "Black" }],
          },
        },
      ],
    },
  },
  {
    id: "gid://shopify/Product/mock-005",
    title: "Oversized Denim Jacket",
    handle: "oversized-denim-jacket",
    description:
      "Vintage-wash oversized denim jacket. A wardrobe staple that only gets better with wear.",
    descriptionHtml:
      "<p>Vintage-wash oversized denim jacket. A wardrobe staple that <em>only gets better with wear</em>.</p>",
    updatedAt: "2024-02-20T11:45:00Z",
    fabricCustom: { value: "100% Cotton Denim, 12oz" },
    fabricShopify: null,
    careCustom: { value: "Machine wash cold, hang dry" },
    careShopify: null,
    priceRange: { minVariantPrice: { amount: "149.00", currencyCode: "USD" } },
    images: {
      edges: [
        {
          node: {
            url: "https://picsum.photos/seed/denim-jacket-1/800/1000",
            altText: "Oversized Denim Jacket front",
          },
        },
        {
          node: {
            url: "https://picsum.photos/seed/denim-jacket-2/800/1000",
            altText: "Oversized Denim Jacket back",
          },
        },
        {
          node: {
            url: "https://picsum.photos/seed/denim-jacket-3/800/1000",
            altText: "Oversized Denim Jacket detail",
          },
        },
      ],
    },
    variants: {
      edges: [
        {
          node: {
            id: "gid://shopify/ProductVariant/mock-005-XS",
            title: "XS",
            availableForSale: true,
            price: { amount: "149.00", currencyCode: "USD" },
            selectedOptions: [{ name: "Size", value: "XS" }],
          },
        },
        {
          node: {
            id: "gid://shopify/ProductVariant/mock-005-S",
            title: "S",
            availableForSale: true,
            price: { amount: "149.00", currencyCode: "USD" },
            selectedOptions: [{ name: "Size", value: "S" }],
          },
        },
        {
          node: {
            id: "gid://shopify/ProductVariant/mock-005-M",
            title: "M",
            availableForSale: false,
            price: { amount: "149.00", currencyCode: "USD" },
            selectedOptions: [{ name: "Size", value: "M" }],
          },
        },
        {
          node: {
            id: "gid://shopify/ProductVariant/mock-005-L",
            title: "L",
            availableForSale: true,
            price: { amount: "149.00", currencyCode: "USD" },
            selectedOptions: [{ name: "Size", value: "L" }],
          },
        },
      ],
    },
  },
];

// In-memory mock cart — persists for the lifetime of the module (one page reload).
let mockCart: ShopifyCart = {
  id: "gid://shopify/Cart/mock-cart-001",
  checkoutUrl: "https://mock.myshopify.com/checkouts/mock-cart-001",
  lines: { edges: [] },
  cost: { totalAmount: { amount: "0.00", currencyCode: "USD" } },
};

function recalcMockCartTotal(cart: ShopifyCart): void {
  const total = cart.lines.edges.reduce((sum, { node }) => {
    return sum + parseFloat(node.merchandise.price.amount) * node.quantity;
  }, 0);
  cart.cost.totalAmount.amount = total.toFixed(2);
}

function findMockVariant(variantId: string) {
  for (const product of MOCK_PRODUCTS) {
    for (const edge of product.variants.edges) {
      if (edge.node.id === variantId) {
        return { product, variant: edge.node };
      }
    }
  }
  return null;
}

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
export async function getProductsInCollection(
  first = 20,
): Promise<ShopifyProductNode[]> {
  if (USE_MOCK) {
    return MOCK_PRODUCTS.slice(0, first).map((p) => ({ node: p }));
  }

  const data = await shopifyFetch<any>(
    `
    query Products($first: Int!) {
      products(first: $first, sortKey: CREATED_AT, reverse: true) {
        edges {
          node {
            id title handle description descriptionHtml updatedAt
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
                  selectedOptions { name value }
                  price { amount currencyCode }
                  compareAtPrice { amount currencyCode }
                }
              }
            }
          }
        }
      }
    }
  `,
    { first },
  );

  return data.products.edges;
}

export async function getProduct(
  handle: string,
): Promise<ShopifyProduct | null> {
  if (USE_MOCK) {
    return MOCK_PRODUCTS.find((p) => p.handle === handle) ?? null;
  }

  const data = await shopifyFetch<any>(
    `
    query Product($handle: String!) {
      product(handle: $handle) {
        id title handle description descriptionHtml updatedAt
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
        images(first: 50) {edges { node { url altText } } }
        variants(first: 10) {
          edges {
            node {
              id title availableForSale
              selectedOptions { name value }
              price { amount currencyCode }
              compareAtPrice { amount currencyCode } 
            }
          }
        }
      }
    }
  `,
    { handle },
  );

  return data.product ?? null;
}

// ============================================================
// CART
// ============================================================
export async function createCart(
  variantId: string,
  quantity = 1,
): Promise<ShopifyCart> {
  if (USE_MOCK) {
    const found = findMockVariant(variantId);
    if (!found) throw new Error(`Mock variant not found: ${variantId}`);
    const { product, variant } = found;

    mockCart = {
      id: "gid://shopify/Cart/mock-cart-001",
      checkoutUrl: "https://mock.myshopify.com/checkouts/mock-cart-001",
      lines: {
        edges: [
          {
            node: {
              id: `mock-line-${variantId}`,
              quantity,
              merchandise: {
                id: variant.id,
                title: variant.title,
                product: {
                  title: product.title,
                  images: { edges: product.images.edges.slice(0, 1) },
                },
                price: variant.price,
              },
            },
          },
        ],
      },
      cost: { totalAmount: { amount: "0.00", currencyCode: "USD" } },
    };
    recalcMockCartTotal(mockCart);
    return mockCart;
  }

  const data = await shopifyFetch<any>(
    `
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
  `,
    { variantId, quantity },
  );
  return data.cartCreate.cart;
}

export async function addToCart(
  cartId: string,
  variantId: string,
  quantity = 1,
): Promise<ShopifyCart> {
  if (USE_MOCK) {
    const found = findMockVariant(variantId);
    if (!found) throw new Error(`Mock variant not found: ${variantId}`);
    const { product, variant } = found;

    const existingLine = mockCart.lines.edges.find(
      (e) => e.node.merchandise.id === variantId,
    );
    if (existingLine) {
      existingLine.node.quantity += quantity;
    } else {
      mockCart.lines.edges.push({
        node: {
          id: `mock-line-${variantId}-${Date.now()}`,
          quantity,
          merchandise: {
            id: variant.id,
            title: variant.title,
            product: {
              title: product.title,
              images: { edges: product.images.edges.slice(0, 1) },
            },
            price: variant.price,
          },
        },
      });
    }
    recalcMockCartTotal(mockCart);
    return mockCart;
  }

  const data = await shopifyFetch<any>(
    `
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
  `,
    { cartId, variantId, quantity },
  );
  return data.cartLinesAdd.cart;
}

export async function getCart(cartId: string): Promise<ShopifyCart | null> {
  if (USE_MOCK) {
    return mockCart.id === cartId ? mockCart : null;
  }

  const data = await shopifyFetch<any>(
    `
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
  `,
    { cartId },
  );
  return data.cart ?? null;
}

export function getShopifyAccountUrl(
  path: "login" | "register" | "orders" = "login",
) {
  return `https://${domain}/account/${path}`;
}

// ─── CUSTOMER AUTHENTICATION QUERIES ───────────────────────────────────────

// 1. Create a new customer
export async function createCustomer(
  firstName: string,
  lastName: string,
  email: string,
  password: string,
) {
  const query = `
    mutation customerCreate($input: CustomerCreateInput!) {
      customerCreate(input: $input) {
        customer {
          id
          firstName
          lastName
          email
        }
        customerUserErrors {
          code
          field
          message
        }
      }
    }
  `;

  const variables = {
    input: { firstName, lastName, email, password },
  };

  const res = await shopifyFetch<any>(query, variables);
  return res?.customerCreate;
}

// 2. Log in (Generate an Access Token)
export async function loginCustomer(email: string, password: string) {
  const query = `
    mutation customerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) {
      customerAccessTokenCreate(input: $input) {
        customerAccessToken {
          accessToken
          expiresAt
        }
        customerUserErrors {
          code
          field
          message
        }
      }
    }
  `;

  const variables = {
    input: { email, password },
  };

  const res = await shopifyFetch<any>(query, variables);
  return res?.customerAccessTokenCreate;
}
