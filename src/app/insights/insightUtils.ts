
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

        if (params.commonParams?.category !== 'Any') {
          header += ` on ${params.commonParams?.category}`;
        }

        header += ` between ${params.commonParams?.fromDate} and ${params.commonParams?.toDate}`;

      }
      break;
    case "division":
      header = "Divisions"

      header += ` voted ${params.voteType ? params.voteType : ''} the ${params.commonParams?.voted}`;
      if (params.commonParams?.category !== 'Any') header += ` of type ${params.commonParams?.category}`;
      header += ` between ${params.commonParams?.fromDate} and ${params.commonParams?.toDate}`;
      if (params.commonParams?.name && params.commonParams?.name !== 'Any') {

        header += ` with ${params.commonParams?.name} in the name`;
      }
      break;
    case "contract":
  
      if (params.contractParams?.groupByContractParam) {
        header = "Organisations"
        if (params.contractParams?.awardedToParam && params.contractParams.awardedToParam !== 'Any') {
          header += ` with ${params.contractParams.awardedToParam} in their name`;
        }

        header += ` awared more than ${params.contractParams.awardedCountParam} ${params.contractParams?.industry === "Any" ? "" : params.contractParams?.industry} contracts`;

        if (params.contractParams.awardedByParam !== 'Any Party') {
          header += ` by ${params.contractParams?.awardedByParam}`;
        }

        header += `.  Grouped by organisation`
      } else {

        header = `${params.contractParams?.industry} contracts awarded`;
      
        if (params.contractParams?.awardedByParam !== 'Any Party') {
          header += ` by ${params.contractParams?.awardedByParam}`;
        }

        if (params.contractParams?.awardedToParam && params.contractParams?.awardedToParam !== 'Any') {
          header += ` to organisations with ${params.contractParams.awardedToParam} in thier name`;
        }
      }

      if (params.contractParams?.contractName && params.contractParams?.contractName !== "Any") {
        header += ` with ${params.contractParams?.contractName} in thier title`;
      }

      header += ` with a value between £${params.contractParams?.valueFrom} and £${params.contractParams?.valueTo}`;

      break;
    case "org":

      header = params.orgParams?.orgType === "Any" ? "Organisations and individuals" : `${params.orgParams?.orgType}s`;

      if (params.orgParams?.nameParam) {
        header += ` with ${params.orgParams.nameParam} in thier name`;
      }

      if (params.orgParams?.minTotalDonationValue) {
        header += ` who donated more than £${params.orgParams?.minTotalDonationValue} to ${params.orgParams?.donatedtoParam}`
      }

      if (params.orgParams?.minContractCount) {
        header += ` where awarded more than ${params.orgParams?.minContractCount} contracts by ${params.orgParams?.donatedtoParam}` //TODO awardedbyParam can not be set yet so using the same value as donatedtoParam
      }


      break;
  }

  return header;
}
