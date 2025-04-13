import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * クラス名をマージする
 * @param inputs クラス名
 * @returns マージされたクラス名
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
