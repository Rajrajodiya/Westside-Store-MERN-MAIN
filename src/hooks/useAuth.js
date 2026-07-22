/**
 * useAuth — Single source of truth for auth state.
 *
 * Principles:
 * - DRY:             Eliminates repeated localStorage access across 8+ components.
 * - Tell, Don't Ask: Components call `auth.user` instead of asking localStorage.
 * - Law of Demeter:  Components talk to the hook, not to localStorage directly.
 * - Normalization:   Computes userKey in one place (email || emailOrPhone || "guest").
 */

import { useCallback, useEffect, useState } from "react";
import { getLogin, clearLogin, saveLogin, getCartCount } from "../lib/storage";

/** Derive the user's cart/wishlist key from their login data */
const computeUserKey = (login) => {
  if (!login) return "guest";
  return login.email || login.emailOrPhone || "guest";
};

export default function useAuth() {
  const [login, setLogin] = useState(getLogin);
  const [cartCount, setCartCount] = useState(0);

  const userKey = computeUserKey(login);

  const refreshCartCount = useCallback(() => {
    setCartCount(getCartCount(userKey));
  }, [userKey]);

  useEffect(() => {
    refreshCartCount();
    const onStorage = () => { setLogin(getLogin()); refreshCartCount(); };
    const onCartUpdate = () => refreshCartCount();
    window.addEventListener("storage", onStorage);
    window.addEventListener("cartUpdated", onCartUpdate);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("cartUpdated", onCartUpdate);
    };
  }, [refreshCartCount]);

  const logout = useCallback(() => {
    clearLogin();
    setLogin(null);
    window.location.reload();
  }, []);

  /** Persist login data after successful auth */
  const persistLogin = useCallback((data) => {
    saveLogin(data);
    setLogin(data);
  }, []);

  return {
    login,
    userKey,
    isLoggedIn: !!login,
    cartCount,
    logout,
    refreshCartCount,
    /** Use this instead of localStorage.setItem in components */
    persistLogin,
  };
}
