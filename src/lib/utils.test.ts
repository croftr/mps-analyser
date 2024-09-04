import { convertNeoNumberToJsNumber } from "./utils";
import { NeoNumber } from "../types"

describe('convertNeoNumberToJsNumber', () => {
    it('converts large Neo4j numbers correctly 1', () => {
        const neoNumber: NeoNumber = { low: -1552734958, high: 1 };
        const jsNumber = convertNeoNumberToJsNumber(neoNumber);
        expect(jsNumber).toEqual(BigInt("7037199634")); // Use string representation
      });
  });
