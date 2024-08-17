
import { ContractParams, OrgParams, CommonParams } from './insightTypes';

export const generateHeaderFromQueryParams = (params: {
    typeParam: string;
    commonParams?: CommonParams;
    voteType?: string | null;
    contractParams?: ContractParams;
    orgParams?: OrgParams;
  }): string => {

    let header = "";

    switch (params.typeParam.toLocaleLowerCase()) {
      case "mp":
        header = `${params.commonParams?.voted === "most" ? "MPs who voted most" : "MPs who voted least"}`;
        if (params.commonParams?.category !== 'Any') header += ` on ${params.commonParams?.category}`;
        if (params.commonParams?.party !== 'Any' && params.commonParams?.party !== 'Any Party') header += ` from the ${params.commonParams?.party}`;
        header += ` between ${params.commonParams?.fromDate} and ${params.commonParams?.toDate}`;
        if (params.commonParams?.name && params.commonParams?.name !== 'Any') {
          header = `MPs with ${params.commonParams.name} in thier name`;

          if (params.commonParams?.party && params.commonParams.party !== "Any Party" && params.commonParams.party !== "Any") {
            header += ` from the ${params.commonParams?.party} party`
          }

          header += ` who ${params.commonParams?.voted === "most" ? "voted most" : "voted least"}`;

          header += ` on ${params.commonParams?.category || "Any"} division`;

        }
        break;
      case "division":
        header = "Divisions"

        header += ` voted ${params.voteType ? params.voteType : ''} the ${params.commonParams?.voted}`;
        if (params.commonParams?.category !== 'Any') header += ` on ${params.commonParams?.category}`;
        header += ` between ${params.commonParams?.fromDate} and ${params.commonParams?.toDate}`;
        if (params.commonParams?.name && params.commonParams?.name !== 'Any') {

          header += ` with ${params.commonParams?.name} in the name`;
        }
        break;
      case "contract":

        if (params.contractParams?.groupByContractParam) {
          header = `Organisations awared more than ${params.contractParams.awardedCountParam} contracts`;
          if (params.contractParams.awardedByParam !== 'Any Party') header += ` by ${params.contractParams?.awardedByParam}`;
          if (params.contractParams?.awardedToParam && params.contractParams.awardedToParam !== 'Any') {
            header += ` with ${params.contractParams.awardedToParam} in their name`;
          }

          header += ". Grouped by organisation"
        } else {
          header = "Contracts awarded";
          if (params.contractParams?.awardedByParam !== 'Any Party') header += ` by ${params.contractParams?.awardedByParam}`;
          if (params.contractParams?.awardedToParam && params.contractParams?.awardedToParam !== 'Any') {
            header += ` to organisations with ${params.contractParams.awardedToParam} in thier name`;
          }
          if (params.contractParams?.awardedCountParam) {
            header += ` with value over £${params.contractParams.awardedCountParam}`;
          }

        }
        break;
      case "org":

        header = "Organisations and individuals";

        if (params.orgParams?.nameParam) {
          header += ` with ${params.orgParams.nameParam} in thier name`;
        }

        if (params.orgParams?.minTotalDonationValue) {
          header += ` who donated more than £${params.orgParams?.minTotalDonationValue} to ${params.orgParams?.donatedtoParam}`
        } 
                
        if (params.orgParams?.minContractCount) {
            header += ` where awarded more than ${params.orgParams?.minContractCount} contracts by ${params.orgParams?.awardedbyParam}`
        }
        
    
        break;
    }
    
    return header;
  }
