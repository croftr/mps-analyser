// vars for contracts 
export interface ContractParams {
    awardedByParam: string;
    awardedToParam: string;
    groupByContractParam: boolean;
    awardedCountParam?: string | null;
    contractFromDate: string,
    contractToDate: string,
    contractName: string,
    industry: string
    valueFrom: number,    
    valueTo: number,    
  }
  
  // vars for orgs
  export interface OrgParams {
    nameParam: string | null;
    donatedtoParam: string;
    awardedbyParam: string;
    minTotalDonationValue: number;
    minContractCount: number;
    orgType: string;
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