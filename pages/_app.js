import AppNavbar from "@/components/custom/navbar";
import "@/styles/globals.css";
import { Geist } from "next/font/google";

const GeistFont = Geist({
  display: "swap",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-geist",
});

export default function App({ Component, pageProps }) {
  return (
    <main className={`${GeistFont.className} font-sans bg-[#fcfdff]`}>
      <AppNavbar />
      <div className="w-full px-10 py-6 max-lg:px-6 max-md:px-4">
        <Component {...pageProps} />
      </div>
    </main>
  );
}
