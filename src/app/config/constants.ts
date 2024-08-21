
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
  
export const INDUSTRIES = [
    { value: "Animals", label: "Animals", icon: "Dog" },
    { value: "IT and Technology", label: "IT and Technology", icon: "Cpu" },
    { value: "Health and Social Care", label: "Health and Social Care", icon: "Heart" },
    { value: "Electrical and Electronics", label: "Electrical and Electronics", icon: "Plug" },
    { value: "Research and Development", label: "Research and Development", icon: "FlaskConical" },
    { value: "Transport", label: "Transport", icon: "Truck" },
    { value: "Agriculture", label: "Agriculture", icon: "Sprout" },
    { value: "Hospitality", label: "Hospitality", icon: "Hotel" },
    { value: "Advertising and Marketing", label: "Advertising and Marketing", icon: "Megaphone" },
    { value: "Retail", label: "Retail", icon: "ShoppingCart" },
    { value: "Staffing and Recruitment", label: "Staffing and Recruitment", icon: "Briefcase" },
    { value: "Foreign Affairs", label: "Foreign Affairs", icon: "Globe" },
    { value: "Furnishing", label: "Furnishing", icon: "Sofa" },
    { value: "Finance", label: "Finance", icon: "DollarSign" },
    { value: "Energy", label: "Energy", icon: "Zap" },
    { value: "Consultancy", label: "Consultancy", icon: "UserCog" },
    { value: "Training", label: "Training", icon: "BookOpen" },
    { value: "Construction and Engineering", label: "Construction and Engineering", icon: "Drill" },
    { value: "Safety and Security", label: "Safety and Security", icon: "Shield" },
    { value: "Waste Management", label: "Waste Management", icon: "Trash2" },
    { value: "Cleaning", label: "Cleaning", icon: "Droplets" },
    { value: "Print Media", label: "Print Media", icon: "Printer" },
    { value: "Legal", label: "Legal", icon: "Gavel" },
    { value: "Housing", label: "Housing", icon: "Home" },
    { value: "Translation", label: "Translation", icon: "Table2" },
    { value: "Postal and Courier Services", label: "Postal and Courier Services", icon: "Mail" },
    { value: "Social Services", label: "Social Services", icon: "Users" },
    { value: "Sports and Recreation", label: "Sports and Recreation", icon: "Activity" },
    { value: "Office supplies", label: "Office Supplies", icon: "Clipboard" },
    { value: "Machinery and Equipment", label: "Machinery and Equipment", icon: "Settings" },
    { value: "Other", label: "Other", icon: "HelpCircle" }
  ];