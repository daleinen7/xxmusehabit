'use clent';
import { AuthContextProvider } from './context/AuthContext';
import { Hepta_Slab } from 'next/font/google';
import localFont from 'next/font/local';
import './globals.css';
import Nav from './components/Nav';

const satoshi = localFont({
  src: [{ path: './fonts/Satoshi-Variable.ttf' }],
  variable: '--font-satoshi',
});

const satoshiItalic = localFont({
  src: [{ path: './fonts/Satoshi-VariableItalic.ttf' }],
  variable: '--font-satoshi-italic',
});

const hepta = Hepta_Slab({
  subsets: ['latin'],
  weights: [400, 700],
  variable: '--font-hepta',
});

export const metadata = {
  title: 'Musehabit',
  description: 'An online open-mic',
};

export default async function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${satoshi.variable} ${satoshiItalic.variable} ${hepta.variable}`}
      >
        <AuthContextProvider>
          <header>
            <Nav />
          </header>
          <main className="flex min-h-screen flex-col items-center justify-start">
            {children}
          </main>
        </AuthContextProvider>
      </body>
    </html>
  );
}
