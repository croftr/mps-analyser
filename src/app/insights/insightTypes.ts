// vars for contracts 
export interface ContractParams {
    awardedByParam: string;
    awardedToParam: string;
    groupByContractParam: boolean;
    awardedCountParam?: string | null;
  }
  
  // vars for orgs
  export interface OrgParams {
    nameParam: string | null;
    donatedtoParam: string;
    awardedbyParam: string;
    minTotalDonationValue: number;
    minContractCount: number;
  }
  
  export interface CommonParams {
    name: string;
    party: string;
    limit: number;
    fromDate: string; 
    toDate: string; 
    category: string;
    voted: string;
  }