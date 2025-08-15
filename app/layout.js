import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Álgebra Lineal Capstone",
  description: "Aplicación interactiva de álgebra lineal",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-gray-900`}>
        <div className="min-h-screen flex flex-col">
          <header className="w-full bg-white/5 backdrop-blur-md border-b border-white/10">
            <div className="max-w-4xl mx-auto flex items-center justify-between px-6 py-4">
              <h1 className="text-2xl md:text-3xl font-bold gradient-text drop-shadow">Álgebra Lineal</h1>
              <nav className="hidden md:flex gap-6 text-blue-200 text-sm">
                <a href="/" className="hover:text-white transition">Inicio</a>
                <a href="https://github.com/MateoGuilleng/Capstone-algebra-lineal" target="_blank" rel="noopener" className="hover:text-white transition">Repositorio</a>
              </nav>
            </div>
          </header>
          <main className="flex-1 flex flex-col items-center justify-center px-2 py-8">
            <section className="w-full max-w-4xl mx-auto flex-1 flex flex-col justify-center items-center">
              <div className="w-full glass-card p-6 md:p-10 flex flex-col gap-8 items-center justify-center shadow-xl">
                {children}
              </div>
            </section>
          </main>
        </div>
      </body>
    </html>
  );
}
