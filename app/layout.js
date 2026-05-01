import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "aos/dist/aos.css";
import "./globals.css";

import AOSInit from "./components/AOSInit";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

export const metadata = {
  title: "Raj Biosis - Clinical Instruments",
  description: "Trusted partner for diagnostic & medical solutions.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>

        <AOSInit />

        {/* 🔥 NAVBAR */}
        <Navbar />

        {/* 🔥 PAGE CONTENT */}
        {children}

        {/* 🔥 FOOTER */}
        <Footer />

      </body>
    </html>
  );
} 