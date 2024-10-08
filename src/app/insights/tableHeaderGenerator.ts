
import { ContractParams, OrgParams, CommonParams } from './insightTypes';
import { formatCurrency } from "@/lib/utils";
import { EARLIEST_FROM_DATE } from "../config/constants";

const TODAY = new Date().toISOString().substring(0, 10);

function formatDate(dateString: string|undefined): string {
  
  if (!dateString) return '';

  const options: Intl.DateTimeFormatOptions = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  };
  return new Date(dateString).toLocaleDateString('en-US', options);
}

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
      header = `MPs who voted ${params.commonParams?.voted === "most" ? "<span class='text-primary'>most</span>" : "<span class='text-primary'>least</span>"}`;
      header += params.commonParams?.category !== 'Any' ? ` on <span class='text-primary'>${params.commonParams?.category}</span>` : '';
      header += params.commonParams?.party !== 'Any' && params.commonParams?.party !== 'Any Party' ? ` from the <span class='text-primary'>${params.commonParams?.party}</span>` : '';
      header += ` between <span class='text-primary'>${formatDate(params.commonParams?.fromDate)}</span> and <span class='text-primary'>${formatDate(params.commonParams?.toDate)}</span>`;

      if (params.commonParams?.name && params.commonParams?.name !== 'Any') {
        header = `MPs with <span class='text-primary'>${params.commonParams.name}</span> in their name`;

        if (params.commonParams?.party && params.commonParams.party !== "Any Party") {
          header += ` from the <span class='text-primary'>${params.commonParams?.party}</span> party`;
        }

        header += ` who ${params.commonParams?.voted === "most" ? "voted <span class='text-primary'>most</span>" : "voted <span class='text-primary'>least</span>"}`;

        if (params.commonParams?.category !== 'Any') {
          header += ` on <span class='text-primary'>${params.commonParams?.category}</span>`;
        }

        header += ` between <span class='text-primary'>${formatDate(params.commonParams?.fromDate)}</span> and <span class='text-primary'>${formatDate(params.commonParams?.toDate)}</span>`;
      }
      break;
    case "division":
      header = "Divisions";

      if (params.commonParams?.name && params.commonParams?.name !== 'Any') {
        header += ` with <span class='text-primary'>${params.commonParams?.name}</span> in the name`;
      }

      header += ` voted ${params.voteType ? `<span class='text-primary'>${params.voteType}</span>` : ''} the <span class='text-primary'>${params.commonParams?.voted}</span>`;
      if (params.commonParams?.category !== 'Any') header += ` of type <span class='text-primary'>${params.commonParams?.category}</span>`;
      header += ` between <span class='text-primary'>${formatDate(params.commonParams?.fromDate)}</span> and <span class='text-primary'>${formatDate(params.commonParams?.toDate)}</span>`;
      break;
    case "contract":

      header = `<span class='text-primary'>${params.contractParams?.industry || "Any "}</span> contracts`;

      if (params.contractParams?.contractName && params.contractParams?.contractName !== "Any") {
        header += ` with <span class='text-primary'>${params.contractParams?.contractName}</span> in their title`;
      }

      header += ` awarded`;

      if (params.contractParams?.awardedByParam !== 'Any Party') {
        header += ` by <span class='text-primary'>${params.contractParams?.awardedByParam}</span>`;
      }

      if (params.contractParams?.awardedToParam && params.contractParams?.awardedToParam !== 'Any Organisation') {
        header += ` to organisations with <span class='text-primary'>${params.contractParams.awardedToParam}</span> in their name`;
      }

      header += ` between <span class='text-primary'>${formatDate(params.contractParams?.contractFromDate)}</span> and <span class='text-primary'>${formatDate(params.contractParams?.contractToDate)}</span>`;

      if (params.contractParams?.valueFrom || params.contractParams?.valueTo) {
        header += ` with a value between <span class='text-primary'>${formatCurrency(params.contractParams?.valueFrom)}</span> and <span class='text-primary'>${formatCurrency(params.contractParams?.valueTo)}</span>`;
      }

      break;
    case "org":

      header = params.orgParams?.orgType === "Any" ? "Organisations and individuals" : `<span class='text-primary'>${params.orgParams?.orgType}s</span>`;

      if (params.orgParams?.nameParam) {
        header += ` with <span class='text-primary'>${params.orgParams.nameParam}</span> in their name`;
      }

      if (params.orgParams?.minTotalDonationValue) {
        header += ` who donated more than <span class='text-primary'>${formatCurrency(params.orgParams?.minTotalDonationValue)}</span> to <span class='text-primary'>${params.orgParams?.donatedtoParam || "Any Party"}</span>`
        //append date info only if default date values have been changed
        if (params.orgParams.donationFromDate && params.orgParams.donationFromDate !== EARLIEST_FROM_DATE || params.orgParams.donationToDate && params.orgParams.donationToDate !== TODAY) {
          header += ` between <span class='text-primary'>${formatDate(params.orgParams.donationFromDate)}</span> and <span class='text-primary'>${formatDate(params.orgParams.donationToDate)}</span>`
        }
      }

      if (params.orgParams?.minContractCount) {
        header += ` where awarded more than <span class='text-primary'>${params.orgParams?.minContractCount}</span> contracts by <span class='text-primary'>${params.orgParams?.donatedtoParam}</span>`

        //append date info only if default date values have been changed
        if (params.orgParams.contractFromDate && params.orgParams.contractFromDate !== EARLIEST_FROM_DATE || params.orgParams.contractToDate && params.orgParams.contractToDate !== TODAY) {
          header += ` between <span class='text-primary'>${formatDate(params.orgParams.contractFromDate)}</span> and <span class='text-primary'>${formatDate(params.orgParams.contractToDate)}</span>`
        }
      }

      break;
  }

  return header;
}