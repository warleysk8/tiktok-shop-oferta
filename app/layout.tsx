import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Operação TikTok Shop · Descubra em 2 minutos o que trava a sua primeira comissão',
  description:
    'Descubra a sua rota na TikTok Shop, o que está te segurando e o próximo passo para publicar seus primeiros vídeos de venda. Grátis, leva 2 minutos.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}
        {/* Ticto Echo: repassa os parâmetros de UTM para o checkout da Ticto. */}
        <script src="https://echo.ticto.app/ticto-echo.min.js" async />
      </body>
    </html>
  );
}
