
export const EARLIEST_FROM_DATE = "2015-01-01";

export const PARTY_NAMES = [
    "Any",    
    "Alliance",
    "Conservative",
    "Democratic Unionist Party",
    "Green Party",
    "Independent",
    "Labour",
    "Liberal Democrat",
    "Plaid Cymru",
    "Reform UK",
    "Scottish National Party",
    "Sinn Féin",
    "Social Democratic & Labour Party",
    "Speaker",    
    "Traditional Unionist Voice",
    "Ulster Unionist Party"
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
    BREXIT_PARTY: "Brexit Party",
    RECLAIM: "The Reclaim Party",
    UNKNOWN: "Unknown",
    ANY: "Any",
};

interface PartyColor {
    backgroundColour: string;
    foregroundColour: string;
}

export const PARTY_COLOUR: Record<string, PartyColor> = {
    "Alliance": { backgroundColour: "#cdaf2d", foregroundColour: "#FFFFFF" },
    "Alba Party": { backgroundColour: "#0063ba", foregroundColour: "#ffffff" },
    "Conservative": { backgroundColour: "#0063ba", foregroundColour: "#ffffff" },
    "Democratic Unionist Party": { backgroundColour: "#cc3300", foregroundColour: "#FFFFFF" },
    "Green Party": { backgroundColour: "#78b82a", foregroundColour: "#FFFFFF" },
    "Independent": { backgroundColour: "#909090", foregroundColour: "#FFFFFF" },
    "Labour": { backgroundColour: "#d50000", foregroundColour: "#ffffff" },
    "Liberal Democrat": { backgroundColour: "#faa01a", foregroundColour: "#FFFFFF" },
    "Plaid Cymru": { backgroundColour: "#348837", foregroundColour: "#ffffff" },
    "Reform UK": { backgroundColour: "#12b6cf", foregroundColour: "#ffffff" },
    "Scottish National Party": { backgroundColour: "#fff685", foregroundColour: "#000000" },
    "Sinn Féin": { backgroundColour: "#02665f", foregroundColour: "#FFFFFF" },
    "Social Democratic and Labour Party": { backgroundColour: "#4ea268", foregroundColour: "#000000" },
    "Social Democratic & Labour Party": { backgroundColour: "#4ea268", foregroundColour: "#000000" },
    "Traditional Unionist Voice": { backgroundColour: "#0c3a6a", foregroundColour: "#ffffff" },
    "Ulster Unionist Party": { backgroundColour: "#a1cdf0", foregroundColour: "#FFFFFF" },
    "Workers Party of Britain": { backgroundColour: "#DB241E", foregroundColour: "#FFFFFF" },
    
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