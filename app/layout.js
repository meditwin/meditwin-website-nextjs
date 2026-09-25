import { Inter } from "next/font/google";
import "bootstrap/dist/css/bootstrap.min.css";
import "./globals.css";
import Navbar from "../components/Navbar/page";
import Footer from "../components/Footer/page";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: {
    default: "Care-n-Cure Clinic | Eye & Women's Health Care",
    template: "%s | Care-n-Cure Clinic",
  },
  description: "Eye care, gynecology, diagnostics, and optical services at Care-n-Cure Clinic in Action Area I, Newtown.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
