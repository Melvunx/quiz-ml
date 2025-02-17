import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import Navbar from "./Navbar";

export default function Layout() {
  return (
    <div>
      <Navbar />
      <main className="min-h-screen w-full">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
