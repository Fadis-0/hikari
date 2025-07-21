import './globals.css';
import Layout from '../components/Layout';
import { Providers } from '../components/Providers';

export const metadata = {
  title: 'Ecommerce App',
  description: 'ecommerce application',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Layout>{children}</Layout>
        </Providers>
      </body>
    </html>
  );
}
