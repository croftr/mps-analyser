export interface Vote {
    DivisionId: number,
    Title: string,
    Date: string
  }

  export interface Party {
    name: string,
    total: number,
    backgroundColour: string
    foregroundColour: string,
  }

  export interface Neo4jNumber {
    low: number,
    high: number,  
  }

  export interface Neo4jDate {
    year: { low: number };
    month: { low: number };
    day: { low: number };
  }

export interface LastUpdateDataType {
    donationsLastUpdate: Neo4jDate|undefined;
    mpsLastUpdate: Neo4jDate|undefined;
    contractsLastUpdate: Neo4jDate|undefined;
    divisionsLastUpdate: Neo4jDate|undefined;
  }
  