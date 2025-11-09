import "bootstrap/dist/css/bootstrap.min.css";
import { Outlet } from "react-router-dom";
import "../assets/styles/Layout.css";
import Footer from "./Footer";
import Header from "./Header";

function Layout() {
  return (
    <div className="fluid-container">
      <Header />
      <main className="content-wrapper">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default Layout;
