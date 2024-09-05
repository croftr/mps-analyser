import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { Neo4jNumber, Neo4jDate } from "../types"

import Long from 'long';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatCurrency = (value: number = 0) => {  
  
  let result =  new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
  
  return result;
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

export const convertNeo4jDateToString = (neo4jDate: Neo4jDate): string => {
  const {
    year: { low: year },
    month: { low: month },
    day: { low: day },
  } = neo4jDate;

  // Validation: Check if the month is within the valid range
  if (month < 1 || month > 12) {
    return 'Invalid Date';
  }

  // Construct a Date object (adjusting month)
  const date = new Date(Date.UTC(year, month - 1, day));

  // Additional validation: Check if the constructed date is valid
  if (isNaN(date.getTime())) {
    return 'Invalid Date';
  }

  const formattedDate = date.toLocaleString('en-GB', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  console.log("done ", formattedDate);
  

  return formattedDate;
};

export const convertNeoNumberToJsNumber = (value: Neo4jNumber): BigInt => {
  const longValue = new Long(value.low, value.high); // Create a Long object  
  return BigInt(longValue.toString())
};