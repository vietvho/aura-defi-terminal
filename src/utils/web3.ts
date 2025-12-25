/**
 * Truncates a Solana address for high-end UI display.
 * Example: "7xKX...4z9p"
 */
export const formatAddress = (address: string, chars = 4): string => {
  if (!address) return '';
  return `${address.slice(0, chars)}...${address.slice(-chars)}`;
};

/**
 * Standard USD Formatter using native Intl API.
 * Handles currency symbols, commas, and decimal rounding.
 */
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

/**
 * Formats crypto amounts (SOL, BTC, ETH) with specific precision.
 * Prevents "0.000000000001" layout breaks.
 */
export const formatCrypto = (amount: number, decimals = 4): string => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: decimals,
  }).format(amount);
};

/**
 * Generates a Solscan or Explorer link for transactions/addresses.
 */
export const getExplorerLink = (id: string, type: 'address' | 'tx' = 'tx'): string => {
  return `https://solscan.io/${type}/${id}`;
};