import { Outlet } from "react-router-dom";
import "../assets/styles/Layout.css";
import Footer from "./Footer";
import Header from "./Header";

function Layout() {
  return (
    <>
      <Header />
      <main className="content-wrapper">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

export default Layout;
