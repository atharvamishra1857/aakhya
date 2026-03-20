"use client";

import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { X, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useCart } from "@/context/cartcontext"; // ✅ ONLY THIS
import Image from "next/image";
import Link from "next/link";

export default function CartDrawer() {
  const {
    isOpen,
    closeCart,
    cartItems,
    updateQuantity,
    removeFromCart,
    cartTotal,
  } = useCart();

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-[200]" onClose={closeCart}>
        <Transition.Child as={Fragment}>
          <div className="fixed inset-0 bg-brand-maroon/40 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child as={Fragment}>
                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                  <div className="flex h-full flex-col bg-brand-cream shadow-2xl">
                    
                    {/* Header */}
                    <div className="flex items-center justify-between px-6 py-6 border-b border-brand-maroon/10">
                      <Dialog.Title className="text-xl font-brand font-bold text-brand-maroon tracking-widest">
                        YOUR CART
                      </Dialog.Title>
                      <button onClick={closeCart} aria-label="Close cart">
                        <X size={24} />
                      </button>
                    </div>

                    {/* Items */}
                    <div className="flex-1 overflow-y-auto px-6 py-8 text-black">
                      {cartItems.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full">
                          <ShoppingBag size={48} strokeWidth={1} />
                          <p>Your cart is empty</p>
                        </div>
                      ) : (
                        <ul className="space-y-8">
                          {cartItems.map((item) => (
                            <li key={item.id} className="flex py-2">
                              
                              <div className="relative h-28 w-24">
                                <Image src={item.image} alt={item.title} fill />
                              </div>

                              <div className="ml-4 flex flex-1 flex-col">
                                <div className="flex justify-between">
                                  <h3>
                                    <Link href={`/product/${item.handle}`}>
                                      {item.title}
                                    </Link>
                                  </h3>

                                  <p>
                                    ₹{(item.price * item.quantity).toLocaleString()}
                                  </p>
                                </div>

                                <div className="flex justify-between items-end">

                                  {/* Quantity */}
                                  <div className="flex items-center border mt-2">
                                    <button
                                      aria-label="Decrease quantity"
                                      onClick={() => {
                                        if (item.quantity > 1)
                                          updateQuantity(item.id, -1);
                                      }}
                                    >
                                      <Minus size={14} />
                                    </button>

                                    <span className="px-2">{item.quantity}</span>

                                    <button
                                      aria-label="Increase quantity"
                                      onClick={() =>
                                        updateQuantity(item.id, 1)
                                      }
                                    >
                                      <Plus size={14} />
                                    </button>
                                  </div>

                                  <button
                                    aria-label="Remove item"
                                    onClick={() => removeFromCart(item.id)}
                                  >
                                    <Trash2 size={16} />
                                  </button>

                                </div>
                              </div>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>

                    {/* Footer */}
                    {cartItems.length > 0 && (
                      <div className="px-6 py-6 border-t text-black">
                        <div className="flex justify-between">
                          <p>Total</p>
                          <p>₹{cartTotal.toLocaleString()}</p>
                        </div>
                        <div className="flex justify-between">
                          <p>Delivery</p>
                          <p>Free</p>
                        </div>
                        

                        <button className="w-full mt-4 bg-brand-maroon text-brand-cream py-2 tracking-widest hover:bg-brand-gold hover:text-brand-maroon transition-all duration-300">
                          Checkout
                        </button>
                      </div>
                    )}
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
