import clsx from 'clsx';

export function cn(...inputs) {
  return clsx(inputs);
}

export function generateId() {
  return Math.random().toString(36).substring(2, 9);
}
