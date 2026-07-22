import { lazy, Suspense } from "react";
import { Toaster } from "react-hot-toast";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { toasterOptions } from "./components/ToastConfig";
import Layout from "./components/Layout.js";
import LoadingSpinner from "./components/LoadingSpinner.js";

// Lazy-loaded route components for code splitting
const Cart = lazy(() => import("./components/Cart.js"));
const MyAccount = lazy(() => import("./components/MyAccount.js"));
const ProductDetail = lazy(() => import("./components/ProductDetail.js"));
const ProductList = lazy(() => import("./components/ProductList.js"));
const Wishlist = lazy(() => import("./components/Wishlist.js"));
const About = lazy(() => import("./pages/About.js"));
const Auth = lazy(() => import("./pages/Auth.js"));
const Contact = lazy(() => import("./pages/Contact.js"));
const Home = lazy(() => import("./pages/Home"));
const NotFound = lazy(() => import("./pages/NotFound.js"));
const Payment = lazy(() => import("./pages/Payment.js"));
const ResetPassword = lazy(() => import("./pages/ResetPassword.js"));

// Wraps lazy routes with a loading fallback
const LazyRoute = ({ element }) => (
  <Suspense fallback={<LoadingSpinner text="Loading..." fullPage />}>
    {element}
  </Suspense>
);

function PrivateRoute({ children }) {
  const isLoggedIn = !!localStorage.getItem("login_detail");
  return isLoggedIn ? children : <LazyRoute element={<Auth />} />;
}

function App() {
  return (
    <Router>
      <Toaster {...toasterOptions} />
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<LazyRoute element={<Home />} />} />
          <Route path="/signup" element={<LazyRoute element={<Auth />} />} />
          <Route path="/about" element={<LazyRoute element={<About />} />} />
          <Route path="/contact" element={<LazyRoute element={<Contact />} />} />
          <Route path="/cart" element={<PrivateRoute><LazyRoute element={<Cart />} /></PrivateRoute>} />
          <Route path="/wishlist" element={<PrivateRoute><LazyRoute element={<Wishlist />} /></PrivateRoute>} />
          <Route path="/products/:category" element={<LazyRoute element={<ProductList />} />} />
          <Route path="/products/:category/:id" element={<LazyRoute element={<ProductDetail />} />} />
          <Route path="/payment" element={<LazyRoute element={<Payment />} />} />
          <Route path="/myaccount" element={<PrivateRoute><LazyRoute element={<MyAccount />} /></PrivateRoute>} />
          <Route path="/reset-password" element={<LazyRoute element={<ResetPassword />} />} />
          <Route path="*" element={<LazyRoute element={<NotFound />} />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
