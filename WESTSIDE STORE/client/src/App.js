import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Cart from "./components/Cart.js";
import Layout from "./components/Layout.js";
import MyAccount from "./components/MyAccount.js";
import ProductDetail from "./components/ProductDetail.js";
import ProductList from "./components/ProductList.js";
import Wishlist from "./components/Wishlist.js";
import About from "./pages/About.js";
import Signup from "./pages/Auth";
import Contact from "./pages/Contact.js";
import Home from "./pages/Home";
import Payment from "./pages/Payment.js";
function PrivateRoute({ children }) {
  const isLoggedIn = !!localStorage.getItem("login_detail");
  return isLoggedIn ? children : <Signup />;
}

function App() {
  return ( 
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/cart" element={<PrivateRoute><Cart /></PrivateRoute>} />
          <Route path="/wishlist" element={<PrivateRoute><Wishlist /></PrivateRoute>} />
          <Route path="/:category" element={<ProductList />} />
          <Route path="/:category/:id" element={<ProductDetail />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/myaccount" element={<PrivateRoute><MyAccount /></PrivateRoute>} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
