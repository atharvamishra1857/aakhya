// lib/shopify.ts  — DEMO MODE (no API keys required)
// Replace this file with the real one once you have your Shopify credentials.

// ============================================================
// TYPES  (unchanged from production)
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
// DEMO DATA
// ============================================================

const DEMO_PRODUCTS: ShopifyProduct[] = [
  {
    id: "gid://shopify/Product/1",
    title: "Classic Leather Wallet",
    handle: "classic-leather-wallet",
    description:
      "Handcrafted from full-grain leather, this slim bifold wallet ages beautifully with use. Features 4 card slots, a bill compartment, and an ID window.",
    priceRange: { minVariantPrice: { amount: "49.99", currencyCode: "USD" } },
    images: {
      edges: [
        {
          node: {
            url: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&auto=format&fit=crop",
            altText: "Classic Leather Wallet",
          },
        },
        {
          node: {
            url: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&auto=format&fit=crop",
            altText: "Wallet open view",
          },
        },
      ],
    },
    variants: {
      edges: [
        {
          node: {
            id: "gid://shopify/ProductVariant/101",
            title: "Tan",
            availableForSale: true,
            price: { amount: "49.99", currencyCode: "USD" },
          },
        },
        {
          node: {
            id: "gid://shopify/ProductVariant/102",
            title: "Dark Brown",
            availableForSale: true,
            price: { amount: "49.99", currencyCode: "USD" },
          },
        },
        {
          node: {
            id: "gid://shopify/ProductVariant/103",
            title: "Black",
            availableForSale: false,
            price: { amount: "49.99", currencyCode: "USD" },
          },
        },
      ],
    },
  },
  {
    id: "gid://shopify/Product/2",
    title: "Merino Wool Crew Sweater",
    handle: "merino-wool-crew-sweater",
    description:
      "Ultra-soft 100% merino wool knit in a relaxed crew-neck silhouette. Temperature-regulating, odour-resistant, and machine-washable.",
    priceRange: { minVariantPrice: { amount: "129.00", currencyCode: "USD" } },
    images: {
      edges: [
        {
          node: {
            url: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&auto=format&fit=crop",
            altText: "Merino Wool Crew Sweater",
          },
        },
        {
          node: {
            url: "https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=800&auto=format&fit=crop",
            altText: "Sweater detail",
          },
        },
      ],
    },
    variants: {
      edges: [
        {
          node: {
            id: "gid://shopify/ProductVariant/201",
            title: "S / Oatmeal",
            availableForSale: true,
            price: { amount: "129.00", currencyCode: "USD" },
          },
        },
        {
          node: {
            id: "gid://shopify/ProductVariant/202",
            title: "M / Oatmeal",
            availableForSale: true,
            price: { amount: "129.00", currencyCode: "USD" },
          },
        },
        {
          node: {
            id: "gid://shopify/ProductVariant/203",
            title: "L / Navy",
            availableForSale: true,
            price: { amount: "129.00", currencyCode: "USD" },
          },
        },
        {
          node: {
            id: "gid://shopify/ProductVariant/204",
            title: "XL / Navy",
            availableForSale: false,
            price: { amount: "129.00", currencyCode: "USD" },
          },
        },
      ],
    },
  },
  {
    id: "gid://shopify/Product/3",
    title: "Ceramic Pour-Over Set",
    handle: "ceramic-pour-over-set",
    description:
      "A minimalist hand-thrown ceramic dripper and matching carafe for the discerning home barista. Lead-free glaze, dishwasher safe.",
    priceRange: { minVariantPrice: { amount: "85.00", currencyCode: "USD" } },
    images: {
      edges: [
        {
          node: {
            url: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&auto=format&fit=crop",
            altText: "Ceramic Pour-Over Set",
          },
        },
      ],
    },
    variants: {
      edges: [
        {
          node: {
            id: "gid://shopify/ProductVariant/301",
            title: "White",
            availableForSale: true,
            price: { amount: "85.00", currencyCode: "USD" },
          },
        },
        {
          node: {
            id: "gid://shopify/ProductVariant/302",
            title: "Matte Black",
            availableForSale: true,
            price: { amount: "85.00", currencyCode: "USD" },
          },
        },
      ],
    },
  },
  {
    id: "gid://shopify/Product/4",
    title: "Canvas Tote Bag",
    handle: "canvas-tote-bag",
    description:
      "12 oz heavyweight natural canvas with reinforced handles and an interior zip pocket. Fits a 15″ laptop. Spot-clean or machine-wash cold.",
    priceRange: { minVariantPrice: { amount: "38.00", currencyCode: "USD" } },
    images: {
      edges: [
        {
          node: {
            url: "https://images.unsplash.com/photo-1622560480654-d96214fdc887?w=800&auto=format&fit=crop",
            altText: "Canvas Tote Bag",
          },
        },
      ],
    },
    variants: {
      edges: [
        {
          node: {
            id: "gid://shopify/ProductVariant/401",
            title: "Natural",
            availableForSale: true,
            price: { amount: "38.00", currencyCode: "USD" },
          },
        },
        {
          node: {
            id: "gid://shopify/ProductVariant/402",
            title: "Black",
            availableForSale: true,
            price: { amount: "38.00", currencyCode: "USD" },
          },
        },
      ],
    },
  },
  {
    id: "gid://shopify/Product/5",
    title: "Stainless Steel Water Bottle",
    handle: "stainless-steel-water-bottle",
    description:
      "Triple-wall vacuum insulation keeps drinks cold 36 hrs or hot 18 hrs. 750 ml capacity, leakproof lid, BPA-free. Fits most car cup holders.",
    priceRange: { minVariantPrice: { amount: "42.00", currencyCode: "USD" } },
    images: {
      edges: [
        {
          node: {
            url: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&auto=format&fit=crop",
            altText: "Stainless Steel Water Bottle",
          },
        },
      ],
    },
    variants: {
      edges: [
        {
          node: {
            id: "gid://shopify/ProductVariant/501",
            title: "Slate Grey",
            availableForSale: true,
            price: { amount: "42.00", currencyCode: "USD" },
          },
        },
        {
          node: {
            id: "gid://shopify/ProductVariant/502",
            title: "Forest Green",
            availableForSale: true,
            price: { amount: "42.00", currencyCode: "USD" },
          },
        },
        {
          node: {
            id: "gid://shopify/ProductVariant/503",
            title: "Terracotta",
            availableForSale: true,
            price: { amount: "42.00", currencyCode: "USD" },
          },
        },
      ],
    },
  },
  {
    id: "gid://shopify/Product/6",
    title: "Scented Soy Candle",
    handle: "scented-soy-candle",
    description:
      "Hand-poured 100% soy wax in a reusable amber glass jar. Cotton wick, 50-hour burn time. Available in three hand-blended fragrances.",
    priceRange: { minVariantPrice: { amount: "28.00", currencyCode: "USD" } },
    images: {
      edges: [
        {
          node: {
            url: "https://images.unsplash.com/photo-1603905405680-6e1b4b4e0b55?w=800&auto=format&fit=crop",
            altText: "Scented Soy Candle",
          },
        },
      ],
    },
    variants: {
      edges: [
        {
          node: {
            id: "gid://shopify/ProductVariant/601",
            title: "Cedarwood & Vanilla",
            availableForSale: true,
            price: { amount: "28.00", currencyCode: "USD" },
          },
        },
        {
          node: {
            id: "gid://shopify/ProductVariant/602",
            title: "Sea Salt & Driftwood",
            availableForSale: true,
            price: { amount: "28.00", currencyCode: "USD" },
          },
        },
        {
          node: {
            id: "gid://shopify/ProductVariant/603",
            title: "Black Fig & Rose",
            availableForSale: false,
            price: { amount: "28.00", currencyCode: "USD" },
          },
        },
      ],
    },
  },
];

// ============================================================
// IN-MEMORY DEMO CART
// ============================================================

type DemoCartLine = {
  id: string;
  quantity: number;
  variantId: string;
  variantTitle: string;
  productTitle: string;
  imageUrl: string;
  imageAlt: string;
  price: string;
  currencyCode: string;
};

const demoCartStore: Record<string, DemoCartLine[]> = {};
let cartIdCounter = 1;

function buildCartResponse(cartId: string): ShopifyCart {
  const lines = demoCartStore[cartId] ?? [];
  const total = lines.reduce(
    (sum, l) => sum + parseFloat(l.price) * l.quantity,
    0
  );

  return {
    id: cartId,
    checkoutUrl: `https://demo.myshopify.com/checkouts/${cartId}`,
    lines: {
      edges: lines.map((l) => ({
        node: {
          id: l.id,
          quantity: l.quantity,
          merchandise: {
            id: l.variantId,
            title: l.variantTitle,
            product: {
              title: l.productTitle,
              images: {
                edges: [{ node: { url: l.imageUrl, altText: l.imageAlt } }],
              },
            },
            price: { amount: l.price, currencyCode: l.currencyCode },
          },
        },
      })),
    },
    cost: {
      totalAmount: { amount: total.toFixed(2), currencyCode: "USD" },
    },
  };
}

function findVariantProduct(variantId: string) {
  for (const product of DEMO_PRODUCTS) {
    for (const { node: variant } of product.variants.edges) {
      if (variant.id === variantId) {
        return { product, variant };
      }
    }
  }
  return null;
}

// ============================================================
// PUBLIC API  (same signatures as the real shopify.ts)
// ============================================================

export async function getProductsInCollection(
  first = 20
): Promise<ShopifyProductNode[]> {
  return DEMO_PRODUCTS.slice(0, first).map((node) => ({ node }));
}

export async function getProduct(
  handle: string
): Promise<ShopifyProduct | null> {
  if (!handle || typeof handle !== "string" || !/^[a-z0-9-]+$/.test(handle)) {
    return null;
  }
  return DEMO_PRODUCTS.find((p) => p.handle === handle) ?? null;
}

export async function createCart(
  variantId: string,
  quantity = 1
): Promise<ShopifyCart> {
  const cartId = `demo-cart-${cartIdCounter++}`;
  demoCartStore[cartId] = [];

  const match = findVariantProduct(variantId);
  if (match) {
    const { product, variant } = match;
    demoCartStore[cartId].push({
      id: `line-${Date.now()}`,
      quantity,
      variantId,
      variantTitle: variant.title,
      productTitle: product.title,
      imageUrl: product.images.edges[0]?.node.url ?? "",
      imageAlt: product.images.edges[0]?.node.altText ?? product.title,
      price: variant.price.amount,
      currencyCode: variant.price.currencyCode,
    });
  }

  return buildCartResponse(cartId);
}

export async function addToCart(
  cartId: string,
  variantId: string,
  quantity = 1
): Promise<ShopifyCart> {
  if (!demoCartStore[cartId]) {
    demoCartStore[cartId] = [];
  }

  const existing = demoCartStore[cartId].find((l) => l.variantId === variantId);
  if (existing) {
    existing.quantity += quantity;
  } else {
    const match = findVariantProduct(variantId);
    if (match) {
      const { product, variant } = match;
      demoCartStore[cartId].push({
        id: `line-${Date.now()}`,
        quantity,
        variantId,
        variantTitle: variant.title,
        productTitle: product.title,
        imageUrl: product.images.edges[0]?.node.url ?? "",
        imageAlt: product.images.edges[0]?.node.altText ?? product.title,
        price: variant.price.amount,
        currencyCode: variant.price.currencyCode,
      });
    }
  }

  return buildCartResponse(cartId);
}

export async function getCart(cartId: string): Promise<ShopifyCart | null> {
  if (!demoCartStore[cartId]) return null;
  return buildCartResponse(cartId);
}

export function getShopifyAccountUrl(
  path: "login" | "register" | "orders" = "login"
) {
  // In demo mode return a hash link so navigation doesn't crash
  return `#demo-${path}`;
}