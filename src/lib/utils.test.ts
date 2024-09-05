import { Neo4jNumber, Neo4jDate } from "../types"
import { capitalizeWords, convertNeo4jDateToString, formatCurrency, convertNeoNumberToJsNumber } from "./utils";

describe('formatCurrency', () => {
    it('formats a number to GBP currency with no decimals', () => {
        expect(formatCurrency(1234.56)).toBe('£1,235');
    });

    it('handles zero values', () => {
        expect(formatCurrency(0)).toBe('£0');
    });

    it('handles negative values', () => {
        expect(formatCurrency(-500)).toBe('-£500');
    });
});

describe('convertNeoNumberToJsNumber', () => {
    it('converts large Neo4j numbers correctly 1', () => {
        const neoNumber: Neo4jNumber = { low: -1552734958, high: 1 };
        const jsNumber = convertNeoNumberToJsNumber(neoNumber);
        expect(jsNumber).toEqual(BigInt("7037199634")); // Use string representation
    });
});

describe('capitalizeWords', () => {
    it('capitalizes the first letter of each word', () => {
        expect(capitalizeWords('hello world')).toBe('Hello World');
    });

    it('handles empty strings', () => {
        expect(capitalizeWords('')).toBe('');
    });

    it('handles multiple spaces', () => {
        expect(capitalizeWords('hello   world')).toBe('Hello   World');
    });

    it('handles leading/trailing spaces', () => {
        expect(capitalizeWords('  hello world  ')).toBe('  Hello World  ');
    });

});

describe('convertNeo4jDateToString', () => {
    it('converts a valid Neo4j date to a formatted string', () => {
        const neo4jDate:Neo4jDate = {
            year: { low: 2024 },
            month: { low: 9 }, 
            day: { low: 5 }
        };
        
        expect(convertNeo4jDateToString(neo4jDate)).toBe('5 September 2024');
    });
    
    it('handles invalid Neo4j date formats gracefully', () => {                
        const invalidMonth: Neo4jDate = { year: { low: 2023 }, month: { low: 0 }, day: { low: 15 } }; // Month out of range (0)        
        expect(convertNeo4jDateToString(invalidMonth)).toBe('Invalid Date');
        
      });

});