import { Poppins } from "@next/font/google";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  weight: ["300", "500", "700"],
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      {/*
        <head /> will contain the components returned by the nearest parent
        head.tsx. Find out more at https://beta.nextjs.org/docs/api-reference/file-conventions/head
      */}
      <head />
      <body className={`${poppins.variable} font-poppins`}>
        <div className="min-h-screen bg-slate-700 text-gray-100 flex flex-col">
          <div className="container mx-auto flex flex-col flex-1 px-4 md:px-8">
            <header className="bg-white/5 rounded-b-md flex justify-center items-center p-4 text-yellow-300 text-2xl mb-4">
              Type Wars
            </header>
            <main className="flex-1 flex justify-center items-center">{children}</main>
          </div>
        </div>
      </body>
    </html>
  );
}
