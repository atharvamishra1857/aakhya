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
        { node: { url: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", altText: "Banarasi Saree Front" } },
        { node: { url: "https://images.unsplash.com/photo-1618901185975-d59f7091bcfe?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", altText: "Zari Details" } },
        { node: { url: "https://images.unsplash.com/photo-1610189012928-8b9612c62c82?q=80&w=2000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", altText: "Weaving process" } },
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
        { node: { url: "https://images.unsplash.com/photo-1679006831648-7c9ea12e5807?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", altText: "Kanjivaram Full Drape" } }, // Reusing working image since 404
        { node: { url: "https://images.unsplash.com/photo-1727430228383-aa1fb59db8bf?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", altText: "Border Work-2" } },
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
        { node: { url: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", altText: "Cotton Texture" } }, // Reusing working image
        { node: { url: "https://images.unsplash.com/photo-1616756141603-6d37d5cde2a2?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", altText: "Fabric Close Up-2" } },
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