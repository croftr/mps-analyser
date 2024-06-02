
export const EARLIEST_FROM_DATE = "2015-01-01";

export const PARTY_NAMES = [
    "Any",
    "Conservative",
    "Labour",
    "Scottish National Party",
    "Labour (Co-op)",
    "The Reclaim Party",
    "Independent",
    "Plaid Cymru",
    "Green Party",
    "Sinn Féin",
    "Liberal Democrat",
    "Social Democratic & Labour Party",
    "Democratic Unionist Party",
    "Alba Party",
    "Speaker",
    "Alliance"
]

export type PartyType = 
    "Conservative" | 
    "Labour" | 
    "Liberal Democrat" | 
    "Green Party" | 
    "Scottish National Party" | 
    "Plaid Cymru" | 
    "Democratic Unionist Party" | 
    "Sinn Féin" | 
    "Ulster Unionist Party" | 
    "Social Democratic and Labour Party" | 
    "Brexit Party" | 
    "The Reclaim Party" | 
    "Unknown" | 
    "Any";

export const Party: Record<string, PartyType> = {
    CONSERVATIVE: "Conservative",
    LABOUR: "Labour",
    LIBERAL_DEMOCRATS: "Liberal Democrat",
    GREEN: "Green Party",
    SNP: "Scottish National Party",
    PLAID_CYMRU: "Plaid Cymru",
    DUP: "Democratic Unionist Party",
    SINN_FEIN: "Sinn Féin",
    UUP: "Ulster Unionist Party",
    SDLP: "Social Democratic and Labour Party",
    BREXIT_PARTY: "Brexit Party",
    RECLAIM: "The Reclaim Party",
    UNKNOWN: "Unknown",
    ANY: "Any",
};

export const VOTING_CATEGORIES = [
    "Any",
    "Finance and Economy",
    "Education",
    "Tax",
    "Workers Rights",
    "European Union",
    "Transport",
    "Energy",
    "Civil Liberties",
    "Immigration",
    "Other",
    "Policing and Crime",
    "Healthcare",
    "International Trade",
    "State Ceremonies",
    "Levelling up",
    "Government Structure",
    "Procurement",
    "Voting",
    "Drugs",
    "Northern Ireland",
    "Parliamentary Procedures",
    "Welfare",
    "Housing",
    "Environment",
    "Scotland",
    "Technology",
    "Food and Farming",
    "National Security",
    "Legal Reform",
    "Foreign Affairs",
    "Children",
    "Domestic Abuse",
    "Terrorism",
    "Wales",
    "Environmental Protection",
]