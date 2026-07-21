/**
 * useAuth — Single source of truth for auth state.
 *
 * Principles:
 * - DRY:   Eliminates the repeated JSON.parse(localStorage.getItem("login_detail")) across 8+ components.
 * - Tell, Don't Ask:   Components call `auth.user` instead of asking localStorage "what's in there?"
 * - Law of Demeter:    Components talk to the hook, not to localStorage directly.
 * - Normalization:     Computes userKey in one place (email || emailOrPhone || "guest").
 */

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "login_detail";

const parseLogin = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

/** Derive the user's cart/wishlist key from their login data */
const computeUserKey = (login) => {
  if (!login) return "guest";
  return login.email || login.emailOrPhone || "guest";
};

export default function useAuth() {
  const [login, setLogin] = useState(parseLogin);
  const [cartCount, setCartCount] = useState(0);

  const userKey = computeUserKey(login);

  // Update cart count whenever storage or cart changes
  const refreshCartCount = useCallback(() => {
    try {
      const raw = localStorage.getItem(`cart_${userKey}`);
      const cart = raw ? JSON.parse(raw) : [];
      setCartCount(cart.length);
    } catch {
      setCartCount(0);
    }
  }, [userKey]);

  useEffect(() => {
    refreshCartCount();
    const onStorage = () => {
      setLogin(parseLogin());
      refreshCartCount();
    };
    const onCartUpdate = () => refreshCartCount();

    window.addEventListener("storage", onStorage);
    window.addEventListener("cartUpdated", onCartUpdate);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("cartUpdated", onCartUpdate);
    };
  }, [refreshCartCount]);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setLogin(null);
    window.location.reload();
  }, []);

  return {
    /** Logged-in user data (or null) */
    login,
    /** Derived key for localStorage cart/wishlist */
    userKey,
    /** Whether the user is authenticated */
    isLoggedIn: !!login,
    /** Number of items in cart */
    cartCount,
    /** Logout + reload */
    logout,
    /** Force-refresh cart count (call after adding to cart) */
    refreshCartCount,
  };
}
