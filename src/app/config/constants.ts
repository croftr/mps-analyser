
export const EARLIEST_FROM_DATE = "2010-01-01";

export const MAX_CONTRACT_VALUE = 9999999999;

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

const PARTY_COLOUR: Record<string, PartyColor> = {
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
    "Sinn Fin": { backgroundColour: "#02665f", foregroundColour: "#FFFFFF" },
    "Social Democratic and Labour Party": { backgroundColour: "#4ea268", foregroundColour: "#000000" },
    "Social Democratic & Labour Party": { backgroundColour: "#4ea268", foregroundColour: "#000000" },
    "Traditional Unionist Voice": { backgroundColour: "#0c3a6a", foregroundColour: "#ffffff" },
    "Ulster Unionist Party": { backgroundColour: "#a1cdf0", foregroundColour: "#FFFFFF" },
    "Workers Party of Britain": { backgroundColour: "#DB241E", foregroundColour: "#FFFFFF" },
    "UK Independence Party": { backgroundColour: "purple", foregroundColour: "gold" },
    "Cooperative Party": { backgroundColour: "#3f1d70", foregroundColour: "white" },
    "The Reclaim Party": { backgroundColour: "#14172d", foregroundColour: "white" },
    "The Socialist Party of Great Britain": { backgroundColour: "#cf2e2e", foregroundColour: "white" },
    "Womens Equality Party": { backgroundColour: "#6e2d91", foregroundColour: "white" },
    "British National Party": { backgroundColour: "#841416", foregroundColour: "#FFFFFF" }, // Far-right, often associated with darker reds/browns
    "The New Party": { backgroundColour: "#909090", foregroundColour: "#FFFFFF" }, // Generic grey for unknown ideology
    "Alliance Party of Northern Ireland": { backgroundColour: "#f6c644", foregroundColour: "#000000" }, // Yellow often used, assuming moderate
    "Scottish Green Party": { backgroundColour: "#6ab023", foregroundColour: "#FFFFFF" }, // Green, similar to other Green parties
    "Christian Party": { backgroundColour: "#007fff", foregroundColour: "#FFFFFF" }, // Blue often associated with Christianity
    "The Peoples Alliance": { backgroundColour: "#909090", foregroundColour: "#FFFFFF" },  // Generic grey for unknown ideology
    "Renew": { backgroundColour: "#0087dc", foregroundColour: "#FFFFFF" }, // Light blue, suggestive of renewal/progress
    "Scottish Socialist Party": { backgroundColour: "#e30613", foregroundColour: "#FFFFFF" }, // Red, typical for socialist parties
    "UNP": { backgroundColour: "#909090", foregroundColour: "#FFFFFF" },  // Generic grey, unclear what UNP stands for
    "True Fair Party": { backgroundColour: "#008080", foregroundColour: "#FFFFFF" }, // Teal, conveying balance/fairness    
    "True and Fair Party": { backgroundColour: "#008080", foregroundColour: "#FFFFFF" }, // Teal, conveying balance/fairness    
    "Communist Party of Britain": { backgroundColour: "#ed1c24", foregroundColour: "#FFFFFF" }, // Red, classic communist color
    "The Independent Group for Change": { backgroundColour: "#659cef", foregroundColour: "#FFFFFF" }, // Light blue, suggesting independence/centrism
    "The Blah Party": { backgroundColour: "#f0f0f0", foregroundColour: "#000000" }, // Very light grey for a 'blah' party
    "Cannabis is Safer than Alcohol": { backgroundColour: "#90ee90", foregroundColour: "#000000" }, // Light green, association with cannabis
    "London Real Party": { backgroundColour: "#909090", foregroundColour: "#FFFFFF" }, // Generic grey for unknown ideology   
    "Hersham Village Society": { backgroundColour: "#468499", foregroundColour: "#FFFFFF" }, // Local/community feel, muted blue
    "People Before Profit": { backgroundColour: "#be1e2d", foregroundColour: "#FFFFFF" }, // Red, left-wing/socialist leaning
    "Advance Together": { backgroundColour: "#32cd32", foregroundColour: "#000000" }, // Green, suggests progress/forward movement
    "Trust": { backgroundColour: "#ffd700", foregroundColour: "#000000" }, // Gold, conveys trust/reliability
    "Mums Army": { backgroundColour: "#f08080", foregroundColour: "#000000" }, // Light pink, maternal association
    "Scottish Voice": { backgroundColour: "#000080", foregroundColour: "#FFFFFF" }, // Dark blue, perhaps representing Scotland
    "All Peoples Party": { backgroundColour: "#ffa500", foregroundColour: "#000000" }, // Orange, suggests inclusivity
    "We Demand A Referendum Now": { backgroundColour: "#800080", foregroundColour: "#FFFFFF" }, // Purple, sense of urgency/demand
    "Pro Democracy Libertaseu": { backgroundColour: "#0000ff", foregroundColour: "#FFFFFF" }, // Blue, common for pro-democracy groups
    "Socialist Alliance": { backgroundColour: "#de0505", foregroundColour: "#FFFFFF" }, // Red, typical for socialist groups
    "No2EUYes to Democracy": { backgroundColour: "#1e90ff", foregroundColour: "#FFFFFF" }, // Blue, pro-democracy stance
    "mums4justice": { backgroundColour: "#da70d6", foregroundColour: "#000000" }, // Light purple, maternal/justice theme
    "The Respect Party": { backgroundColour: "#f4a460", foregroundColour: "#000000" }, // Sandy brown, perhaps conveying respect/dignity
    "Dont Cook Party": { backgroundColour: "#909090", foregroundColour: "#FFFFFF" }, // Generic grey, humorous/unclear ideology
    "Jury Team": { backgroundColour: "#808000", foregroundColour: "#FFFFFF" }, // Olive green, legal/justice theme
    "ProLife": { backgroundColour: "#ffc0cb", foregroundColour: "#000000" }, // Light pink, often associated with pro-life
    "Duma Polska Polish Pride": { backgroundColour: "#dc143c", foregroundColour: "#FFFFFF" }, // Crimson, perhaps Polish flag reference
    "NO2EU": { backgroundColour: "#add8e6", foregroundColour: "#000000" }, // Light blue, anti-EU stance
    "womentheworld": { backgroundColour: "#ff00ff", foregroundColour: "#FFFFFF" }, // Magenta, representing women/global theme
    "Forward Wales": { backgroundColour: "#008000", foregroundColour: "#FFFFFF" }, // Green, perhaps Welsh reference, progress
    "The Buckinghamshire Campaign for Democracy": { backgroundColour: "#4169e1", foregroundColour: "#FFFFFF" }, // Royal blue, democracy theme
    "The Liberal Party": { backgroundColour: "#ffff00", foregroundColour: "#000000" }, // Yellow, classic liberal color
    "Animal Welfare Party": { backgroundColour: "#8b4513", foregroundColour: "#FFFFFF" }, // Brown, animal/earth association
    "Legalise Cannabis Alliance": { backgroundColour: "#006400", foregroundColour: "#FFFFFF" }, // Dark green, cannabis association
    "Tower Hamlets First": { backgroundColour: "#66cdaa", foregroundColour: "#000000" }, // Local/community feel, muted green
    "The Radical Party": { backgroundColour: "#ff4500", foregroundColour: "#FFFFFF" }, // Orange-red, suggests radical change
    "All For Unity": { backgroundColour: "#87ceeb", foregroundColour: "#000000" }, // Sky blue, unity/togetherness theme
    "Freedom and Responsibility": { backgroundColour: "#a52a2a", foregroundColour: "#FFFFFF" }, // Brown, earthy/grounded feel
    "Better Bedford Independent Party": { backgroundColour: "#c6e2ff", foregroundColour: "#000000" }, // Light blue, local/independent feel
    "United Kingdom First": { backgroundColour: "#b22222", foregroundColour: "#FFFFFF" }, // Red, nationalist association
    "Fulham Group": { backgroundColour: "#ffffff", foregroundColour: "#000000" }, // White, neutral/local focus
    "Veritas": { backgroundColour: "#00ced1", foregroundColour: "#000000" }, // Turquoise, perhaps truth/transparency
    "East Herts People": { backgroundColour: "#deb887", foregroundColour: "#000000" }, // Tan, local/community feel
    "Rejoin EU": { backgroundColour: "#00008b", foregroundColour: "#FFFFFF" }, // Dark blue, pro-EU stance
    "Democracy 2015": { backgroundColour: "#483d8b", foregroundColour: "#FFFFFF" }, // Dark blue, democracy theme
    "Yorkshire Party": { backgroundColour: "#fffacd", foregroundColour: "#000000" }, // Pale yellow, perhaps Yorkshire rose reference
    "Scottish Libertarian Party": { backgroundColour: "#ffff00", foregroundColour: "#000000" },
    "Both Unions Party of Northern Ireland": { backgroundColour: "#9acd32", foregroundColour: "#FFFFFF" }
}

export const getPartyColour = (name: string): PartyColor => {

    let record: PartyColor | undefined = PARTY_COLOUR[name];

    if (record) {
        return record; // Exact match found, return immediately
    }

    // 2. If no exact match, try partial match
    const wordsToExclude = ["the", "and", "party"];
    const nameWords = name
        .toLowerCase()
        .split(/\s+/)
        .filter((word) => !wordsToExclude.includes(word));

    for (const partyName in PARTY_COLOUR) {
        if (nameWords.some((word) => partyName.toLowerCase().includes(word))) {
            record = PARTY_COLOUR[partyName];
            console.warn(`Using partial match '${partyName}' for '${name}'`);
            return record;
        }
    }

    console.warn("No match found for ", name);
    return { backgroundColour: "lightgrey", foregroundColour: "black" };

}


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

export const INDUSTRIES = [
    { value: "Any", label: "Any", icon: "Factory" },
    { value: "Advertising and Marketing", label: "Advertising and Marketing", icon: "Megaphone" },
    { value: "Agriculture", label: "Agriculture", icon: "Sprout" },
    { value: "Animals", label: "Animals", icon: "PawPrint" },
    { value: "Cleaning", label: "Cleaning", icon: "Droplets" },
    { value: "Construction and Engineering", label: "Construction and Engineering", icon: "Drill" },
    { value: "Consultancy", label: "Consultancy", icon: "UserCog" },
    { value: "Electrical and Electronics", label: "Electrical and Electronics", icon: "Plug" },
    { value: "Energy", label: "Energy", icon: "Zap" },
    { value: "Finance", label: "Finance", icon: "DollarSign" },
    { value: "Foreign Affairs", label: "Foreign Affairs", icon: "Globe" },
    { value: "Furnishing", label: "Furnishing", icon: "Sofa" },
    { value: "Health and Social Care", label: "Health and Social Care", icon: "Heart" },
    { value: "Hospitality", label: "Hospitality", icon: "Hotel" },
    { value: "Housing", label: "Housing", icon: "Home" },
    { value: "IT and Technology", label: "IT and Technology", icon: "Cpu" },
    { value: "Legal", label: "Legal", icon: "Gavel" },
    { value: "Machinery and Equipment", label: "Machinery and Equipment", icon: "Settings" },
    { value: "Postal and Courier Services", label: "Postal and Courier Services", icon: "Mail" },
    { value: "Office Supplies", label: "Office Supplies", icon: "Clipboard" },
    { value: "Other", label: "Other", icon: "HelpCircle" },
    { value: "Print Media", label: "Print Media", icon: "Printer" },
    { value: "Research and Development", label: "Research and Development", icon: "FlaskConical" },
    { value: "Retail", label: "Retail", icon: "ShoppingCart" },
    { value: "Safety and Security", label: "Safety and Security", icon: "Shield" },
    { value: "Social Services", label: "Social Services", icon: "Users" },
    { value: "Sports and Recreation", label: "Sports and Recreation", icon: "Activity" },
    { value: "Staffing and Recruitment", label: "Staffing and Recruitment", icon: "Briefcase" },
    { value: "Telecommunications", label: "Telecommunications", icon: "Antenna" },
    { value: "Training", label: "Training", icon: "BookOpen" },
    { value: "Translation", label: "Translation", icon: "Table2" },
    { value: "Transport", label: "Transport", icon: "Truck" },
    { value: "Waste Management", label: "Waste Management", icon: "Trash2" },
];