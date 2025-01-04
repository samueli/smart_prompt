import {getRequestConfig} from 'next-intl/server';
import {locales} from './settings';
 
export default getRequestConfig(async ({locale}) => {
  const messages = (await import(`../messages/${locale}.json`)).default;
  return {
    messages,
    locale: locale || 'en'
  };
});
