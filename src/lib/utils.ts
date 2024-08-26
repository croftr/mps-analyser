import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatCurrency = (value: number = 0) => {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
}

export const capitalizeWords = (inputString: string = ""): string => {
  const excludedShortWords = ["and", "or", "but", "nor", "for", "yet", "so", "a", "an", "the", "of"];

  const words = inputString.split(" ");

  const capitalizedWords = words.map((word, index) => {
    if (index === 0) { // Special case for the first word
      return word.charAt(0).toUpperCase() + word.slice(1);
    }

    if (excludedShortWords.includes(word.toLowerCase())) {
      return word.toLowerCase();
    }

    if (word.length <= 3) {
      return word.toUpperCase();
    }

    return word.charAt(0).toUpperCase() + word.slice(1);
  });

  return capitalizedWords.join(" ");
}