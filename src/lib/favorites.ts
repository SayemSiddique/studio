
import type { ScanResult } from './types';

const FAVORITES_KEY = 'saforaFavorites';

export function getFavorites(): ScanResult[] {
  if (typeof window === 'undefined') {
    return [];
  }
  const storedFavorites = localStorage.getItem(FAVORITES_KEY);
  return storedFavorites ? JSON.parse(storedFavorites) : [];
}

export function addFavorite(product: ScanResult): void {
  if (typeof window === 'undefined') return;
  const favorites = getFavorites();
  if (!favorites.find(fav => fav.barcode === product.barcode)) {
    favorites.push(product);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  }
}

export function removeFavorite(barcode: string): void {
  if (typeof window === 'undefined') return;
  let favorites = getFavorites();
  favorites = favorites.filter(fav => fav.barcode !== barcode);
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
}

export function isFavorite(barcode: string): boolean {
  if (typeof window === 'undefined') return false;
  const favorites = getFavorites();
  return !!favorites.find(fav => fav.barcode === barcode);
}

export function clearFavorites(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(FAVORITES_KEY);
}
