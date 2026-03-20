// lib/shopify.ts

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
    };
  };
  images: {
    edges: ShopifyImageEdge[];
  };
};

export type ShopifyProductNode = {
  node: ShopifyProduct;
};

const MOCK_PRODUCTS: ShopifyProduct[] = [
  {
    id: "1",
    title: "Banarasi Silk Saree",
    handle: "banarasi-silk",
    description: "A timeless classic from the ghats of Varanasi. Pure silk with gold zari work, perfect for weddings and special occasions. Handwoven by master artisans.",
    priceRange: { minVariantPrice: { amount: "4500.00" } },
    images: {
      edges: [
        { node: { url: "https://images.unsplash.com/photo-1610030469983-98e550d615ef?q=80&w=800&auto=format&fit=crop", altText: "Banarasi Saree Front" } },
        { node: { url: "https://images.unsplash.com/photo-1583391733959-1f5106240d16?q=80&w=800&auto=format&fit=crop", altText: "Zari Details" } },
        { node: { url: "https://images.unsplash.com/photo-1605001089332-602f32fb3039?q=80&w=800&auto=format&fit=crop", altText: "Weaving process" } },
      ],
    },
  },
  {
    id: "2",
    title: "Kanjivaram Red Saree",
    handle: "kanjivaram-red",
    description: "Authentic Kanjivaram silk from Tamil Nadu. Known for its durability and heavy zari border. A masterpiece of South Indian weaving.",
    priceRange: { minVariantPrice: { amount: "8000.00" } },
    images: {
      edges: [
        { node: { url: "https://images.unsplash.com/photo-1610030469983-98e550d615ef?q=80&w=800&auto=format&fit=crop", altText: "Kanjivaram Full Drape" } }, // Reusing working image since 404
        { node: { url: "https://images.unsplash.com/photo-1583391733959-1f5106240d16?q=80&w=800&auto=format&fit=crop", altText: "Border Work-2" } },
      ],
    },
  },
  {
    id: "3",
    title: "Cotton Handloom",
    handle: "cotton-handloom",
    description: "Lightweight and breathable cotton handloom saree, ideal for daily office wear and summer days. Elegance meets absolute comfort.",
    priceRange: { minVariantPrice: { amount: "1200.00" } },
    images: {
      edges: [
        { node: { url: "https://images.unsplash.com/photo-1605001089332-602f32fb3039?q=80&w=800&auto=format&fit=crop", altText: "Cotton Texture" } }, // Reusing working image
        { node: { url: "https://images.unsplash.com/photo-1610030469983-98e550d615ef?q=80&w=800&auto=format&fit=crop", altText: "Fabric Close Up-2" } },
      ],
    },
  },
];

// 1. Function to get ALL products (Used on the Home Page)
export async function getProductsInCollection() {
  // Simulate a quick network delay so animations trigger
  await new Promise((resolve) => setTimeout(resolve, 500));
  
  // Wrap them in the "node" structure Shopify uses
  return MOCK_PRODUCTS.map((product) => ({
    node: product,
  }));
}

// 2. Function to get ONE product by its handle (Used on the Product Page)
export async function getProduct(handle: string) {
  // Simulate a quick network delay
  await new Promise((resolve) => setTimeout(resolve, 500));
  
  // Find the exact product
  const product = MOCK_PRODUCTS.find((p) => p.handle === handle);
  
  return product || null;
}