import type { Metadata } from "next";
import { Inter, Playfair_Display, Dancing_Script } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const script = Dancing_Script({
  subsets: ["latin"],
  variable: "--font-script",
  display: "swap",
  weight: ["600", "700"],
});

export const metadata: Metadata = {
  title: "Meal Debt — What Does Your Meal Cost?",
  description:
    "Calories don't mean much. Running 8 kilometres does. Search any meal and see what it actually costs your body.",
  openGraph: {
    title: "Meal Debt — What Does Your Meal Cost?",
    description: "Calories don't mean much. Running 8 kilometres does.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfair.variable} ${script.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem('meal-debt:theme');var d=t?t==='dark':window.matchMedia('(prefers-color-scheme: dark)').matches;if(d)document.documentElement.classList.add('dark');}catch(e){}`,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
