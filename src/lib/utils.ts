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

export const convertNeo4jDateToString = (neo4jDate:any) => {
  console.log("step 1 ", neo4jDate);
  
  const {
    year: { low: year },
    month: { low: month },
    day: { low: day },  
  } = neo4jDate;

  // Construct a Date object (adjusting month as it's 0-indexed)
  const date = new Date(Date.UTC(year, month - 1, day));

  console.log("step 2 ", date);

  // Apply timezone offset (if needed)
  // date.setTime(date.getTime() - timeZoneOffsetSeconds * 1000);

  const formattedDate = date.toLocaleString('en-GB', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
    // Removed hour, minute, second, and timeZoneName options
  });
  console.log("step 3 ", formattedDate);
  return formattedDate;
}

