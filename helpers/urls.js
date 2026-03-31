const DEFAULT_API_BASE_URL = 'http://api.docme.wavelinkllc.com';
const DEFAULT_APP_BASE_URL = 'http://docme.wavelinkllc.com';

const trimTrailingSlash = function(url) {
  return url ? url.replace(/\/+$/, '') : '';
};

const joinUrl = function(baseUrl, path = '') {
  const normalizedBaseUrl = trimTrailingSlash(baseUrl);

  if (!path) {
    return normalizedBaseUrl;
  }

  return normalizedBaseUrl + (path.startsWith('/') ? path : '/' + path);
};

export const API_BASE_URL = trimTrailingSlash(process.env.NEXT_PUBLIC_API_BASE_URL || DEFAULT_API_BASE_URL);
export const APP_BASE_URL = trimTrailingSlash(process.env.NEXT_PUBLIC_APP_BASE_URL || DEFAULT_APP_BASE_URL);

export const apiUrl = function(path = '') {
  return joinUrl(API_BASE_URL, path);
};

export const appUrl = function(path = '') {
  return joinUrl(APP_BASE_URL, path);
};

export const stripeSuccessUrl = process.env.NEXT_PUBLIC_STRIPE_SUCCESS_URL || appUrl('/myaccount/');
export const stripeCanceledUrl = process.env.NEXT_PUBLIC_STRIPE_CANCELED_URL || appUrl('/myaccount/');
