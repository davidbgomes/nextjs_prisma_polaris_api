import { AppProvider } from '@shopify/polaris';
import enTranslations from '@shopify/polaris/locales/en.json';
import { AppProps } from 'next/app';

import '@shopify/polaris/dist/styles.css';
import '@/styles/globals.css';

export default function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  return (
    <AppProvider i18n={enTranslations} features={{ newDesignLanguage: true }}>
      <Component {...pageProps} />
    </AppProvider>
  );
}
