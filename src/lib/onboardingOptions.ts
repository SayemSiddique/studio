
// src/lib/onboardingOptions.ts

export const countryData: Record<string, string[]> = {
    "United States": ["New York", "Los Angeles", "Chicago", "Houston", "Phoenix", "Philadelphia", "San Antonio", "San Diego", "Dallas", "San Jose", "Austin", "Jacksonville", "Fort Worth", "Columbus", "Charlotte", "San Francisco", "Indianapolis", "Seattle", "Denver", "Washington DC", "Boston", "El Paso", "Nashville", "Detroit", "Oklahoma City", "Portland", "Las Vegas", "Memphis", "Louisville", "Baltimore", "Milwaukee", "Albuquerque", "Tucson", "Fresno", "Sacramento", "Kansas City", "Mesa", "Atlanta", "Omaha", "Colorado Springs", "Raleigh", "Miami", "Long Beach", "Virginia Beach", "Oakland", "Minneapolis", "Tampa", "Tulsa", "Arlington", "New Orleans", "Wichita"],
    "Canada": ["Toronto", "Montreal", "Vancouver", "Calgary", "Edmonton", "Ottawa", "Mississauga", "Winnipeg", "Quebec City", "Hamilton", "Brampton", "Surrey", "Laval", "Halifax", "London", "Markham", "Vaughan", "Gatineau", "Saskatoon", "Longueuil", "Burnaby", "Regina", "Richmond", "Richmond Hill", "Oakville", "Burlington", "Sherbrooke", "Oshawa", "Saguenay", "Lévis", "Barrie", "Abbotsford", "Coquitlam", "Terrebonne", "St. Catharines", "Cambridge", "Kingston", "Whitby", "Guelph", "Kelowna"],
    "United Kingdom": ["London", "Birmingham", "Liverpool", "Nottingham", "Sheffield", "Bristol", "Glasgow", "Leicester", "Edinburgh", "Leeds", "Cardiff", "Manchester", "Stoke-on-Trent", "Coventry", "Sunderland", "Birkenhead", "Islington", "Reading", "Preston", "Newport", "Swansea", "Bradford", "Southend-on-Sea", "Belfast", "Derby", "Plymouth", "Luton", "Wolverhampton", "Portsmouth", "Southampton", "Blackpool", "Milton Keynes", "Northampton", "Norwich", "Dudley", "Aberdeen", "Wigan", "Exeter", "York", "Huddersfield"],
    "Australia": ["Sydney", "Melbourne", "Brisbane", "Perth", "Adelaide", "Gold Coast", "Newcastle", "Canberra", "Central Coast", "Wollongong", "Logan City", "Geelong", "Hobart", "Townsville", "Cairns", "Darwin", "Toowoomba", "Ballarat", "Bendigo", "Albury", "Launceston", "Mackay", "Rockhampton", "Bunbury", "Bundaberg", "Coffs Harbour", "Wagga Wagga", "Hervey Bay", "Mildura", "Shepparton", "Port Macquarie", "Gladstone", "Tamworth", "Traralgon", "Orange", "Bowral", "Geraldton", "Nowra", "Warrnambool", "Kalgoorlie"],
    "Germany": ["Berlin", "Hamburg", "Munich", "Cologne", "Frankfurt am Main", "Stuttgart", "Düsseldorf", "Dortmund", "Essen", "Leipzig", "Bremen", "Dresden", "Hanover", "Nuremberg", "Duisburg", "Bochum", "Wuppertal", "Bielefeld", "Bonn", "Münster", "Karlsruhe", "Mannheim", "Augsburg", "Wiesbaden", "Gelsenkirchen", "Mönchengladbach", "Braunschweig", "Chemnitz", "Kiel", "Aachen", "Halle", "Magdeburg", "Freiburg im Breisgau", "Krefeld", "Lübeck", "Oberhausen", "Erfurt", "Mainz", "Rostock", "Kassel"],
    "France": ["Paris", "Marseille", "Lyon", "Toulouse", "Nice", "Nantes", "Strasbourg", "Montpellier", "Bordeaux", "Lille", "Rennes", "Reims", "Le Havre", "Saint-Étienne", "Toulon", "Grenoble", "Dijon", "Angers", "Nîmes", "Villeurbanne", "Saint-Denis", "Le Mans", "Aix-en-Provence", "Clermont-Ferrand", "Brest", "Limoges", "Tours", "Amiens", "Perpignan", "Metz", "Besançon", "Boulogne-Billancourt", "Orléans", "Mulhouse", "Rouen", "Argenteuil", "Caen", "Nancy", "Saint-Denis", "Saint-Paul"],
    "Japan": ["Tokyo", "Yokohama", "Osaka", "Nagoya", "Sapporo", "Kobe", "Kyoto", "Fukuoka", "Kawasaki", "Saitama", "Hiroshima", "Sendai", "Kitakyushu", "Chiba", "Sakai", "Niigata", "Hamamatsu", "Okayama", "Sagamihara", "Shizuoka", "Kumamoto", "Kagoshima", "Matsuyama", "Kanazawa", "Utsunomiya", "Matsudo", "Kawaguchi", "Ichikawa", "Suita", "Toyama", "Toyonaka", "Gifu", "Fujisawa", "Kashiwa", "Toyohashi", "Nagano", "Iwaki", "Asahikawa", "Oita", "Nara"],
    "India": ["Mumbai", "Delhi", "Bangalore", "Hyderabad", "Ahmedabad", "Chennai", "Kolkata", "Surat", "Pune", "Jaipur", "Lucknow", "Kanpur", "Nagpur", "Indore", "Thane", "Bhopal", "Visakhapatnam", "Pimpri-Chinchwad", "Patna", "Vadodara", "Ghaziabad", "Ludhiana", "Agra", "Nashik", "Faridabad", "Meerut", "Rajkot", "Kalyan-Dombivali", "Vasai-Virar", "Varanasi", "Srinagar", "Dhanbad", "Jodhpur", "Amritsar", "Raipur", "Allahabad", "Coimbatore", "Jabalpur", "Gwalior", "Vijayawada"],
    "Brazil": ["São Paulo", "Rio de Janeiro", "Brasília", "Salvador", "Fortaleza", "Belo Horizonte", "Manaus", "Curitiba", "Recife", "Goiânia", "Belém", "Porto Alegre", "Guarulhos", "Campinas", "São Luís", "São Gonçalo", "Maceió", "Duque de Caxias", "Nova Iguaçu", "Teresina", "Natal", "Osasco", "Campo Grande", "Santo André", "João Pessoa", "Jaboatão dos Guararapes", "Contagem", "São Bernardo do Campo", "Uberlândia", "Sorocaba", "Aracaju", "Feira de Santana", "Cuiabá", "Joinville", "Juiz de Fora", "Aparecida de Goiânia", "Londrina", "Ananindeua", "Serra", "Niterói"],
    "Italy": ["Rome", "Milan", "Naples", "Turin", "Palermo", "Genoa", "Bologna", "Florence", "Bari", "Catania", "Venice", "Verona", "Messina", "Padua", "Trieste", "Taranto", "Brescia", "Prato", "Parma", "Modena", "Reggio Calabria", "Reggio Emilia", "Perugia", "Livorno", "Ravenna", "Cagliari", "Foggia", "Rimini", "Salerno", "Ferrara", "Sassari", "Latina", "Giugliano in Campania", "Monza", "Syracuse", "Pescara", "Bergamo", "Forlì", "Trento", "Vicenza"],
    "Spain": ["Madrid", "Barcelona", "Valencia", "Seville", "Zaragoza", "Málaga", "Murcia", "Palma", "Las Palmas", "Bilbao", "Alicante", "Córdoba", "Valladolid", "Vigo", "Gijón", "L'Hospitalet de Llobregat", "A Coruña", "Granada", "Vitoria-Gasteiz", "Elche", "Santa Cruz de Tenerife", "Oviedo", "Badalona", "Cartagena", "Terrassa", "Jerez de la Frontera", "Sabadell", "Móstoles", "Alcalá de Henares", "Pamplona", "Fuenlabrada", "Almería", "Leganés", "Donostia-San Sebastián", "Burgos", "Santander", "Castellón de la Plana", "Alcorcón", "Albacete", "Getafe"],
    "Mexico": ["Mexico City", "Guadalajara", "Monterrey", "Puebla", "Tijuana", "León", "Juárez", "Torreón", "Querétaro", "San Luis Potosí", "Mérida", "Mexicali", "Aguascalientes", "Acapulco", "Cuernavaca", "Chihuahua", "Morelia", "Toluca", "Saltillo", "Reynosa", "Cancún", "Veracruz", "Hermosillo", "Culiacán", "Mazatlán", "Durango", "Xalapa", "Oaxaca", "Tuxtla Gutiérrez", "San Nicolás de los Garza", "Villahermosa", "Tampico", "Nuevo Laredo", "Celaya", "Irapuato", "Matamoros", "Ensenada", "Gómez Palacio", "Pachuca", "Tlalnepantla"],
    "South Korea": ["Seoul", "Busan", "Incheon", "Daegu", "Daejeon", "Gwangju", "Suwon", "Ulsan", "Changwon", "Goyang", "Yongin", "Seongnam", "Bucheon", "Cheongju", "Ansan", "Jeonju", "Anyang", "Cheonan", "Pohang", "Uijeongbu", "Siheung", "Paju", "Gimhae", "Hwaseong", "Jeju City", "Pyeongtaek", "Gunsan", "Iksan", "Yangsan", "Suncheon", "Chuncheon", "Wonju", "Gangneung", "Asan", "Mokpo", "Yeosu", "Tongyeong", "Gyeongju", "Sokcho", "Andong"],
    // Add more countries and their cities as needed
};

export const regions: string[] = [
    "All Regions",
    "Africa",
    "Asia",
    "Caribbean",
    "Central America",
    "Europe",
    "Middle East",
    "North America",
    "Oceania",
    "South America",
];


export const dietaryPaths: string[] = [
  "No Specific Diet", "Vegetarian", "Vegan", "Pescatarian", "Flexitarian", "Paleo", "Keto",
  "Low-Carb", "Mediterranean", "DASH Diet", "Whole30", "Gluten-Free",
  "Dairy-Free", "Nut-Free", "Soy-Free", "Egg-Free", "Halal", "Kosher",
  "Jain Diet", "Buddhist Diet", "Low-FODMAP", "Low-Residue", "Diabetic Diet",
  "Renal (Kidney) Diet", "Anti-Inflammatory Diet", "Raw Food Diet"
];

export const ingredientsToAvoidOptions: { name: string; emoji?: string }[] = [
  { name: "Pork", emoji: "🐖" }, { name: "Beef", emoji: "🐄" },
  { name: "Poultry", emoji: "🐔" }, { name: "Fish (general)", emoji: "🐟" },
  { name: "Shellfish (general)", emoji: "🦞" }, { name: "Alcohol", emoji: "🍷" },
  { name: "Gelatin", emoji: "🍮" }, { name: "Rennet (animal-derived)" },
  { name: "Lard/Tallow", emoji: "🥓" }, { name: "Carmine/Cochineal (E120)", emoji: "🐞" },
  { name: "Artificial Sweeteners", emoji: "🧪" }, // e.g., Aspartame, Sucralose
  { name: "Artificial Colors", emoji: "🎨" },    // e.g., Red 40, Yellow 5
  { name: "MSG (Monosodium Glutamate)", emoji: "🧂" },
  { name: "High Fructose Corn Syrup" }, { name: "Trans Fats (Partially Hydrogenated Oils)" },
  { name: "Nitrates/Nitrites (processed meats)" }, { name: "Sulfites (wine, dried fruit)" },
  { name: "Caffeine (if avoiding)", emoji: "☕" }
];

export const commonAllergens: { name: string; emoji?: string }[] = [
  { name: "Peanuts", emoji: "🥜" }, { name: "Tree Nuts", emoji: "🌰" }, // (e.g., Almonds, Walnuts)
  { name: "Milk", emoji: "🥛" }, { name: "Eggs", emoji: "🥚" },
  { name: "Wheat", emoji: "🌾" }, { name: "Gluten" }, // (distinct from wheat if needed)
  { name: "Soy", emoji: "🫘" }, { name: "Fish (specific types)", emoji: "🐟" },
  { name: "Shellfish", emoji: "🦐" }, // (e.g., Shrimp, Crab, Lobster)
  { name: "Sesame", emoji: "🌱" }, { name: "Mustard" }, { name: "Celery" },
  { name: "Lupin" }, { name: "Molluscs", emoji: "🐌" }, // (e.g., Clams, Oysters)
  { name: "Sulphites" }, { name: "Corn", emoji: "🌽" }
];

// A more extensive list for a dropdown "Other Allergies"
export const otherAllergensList: string[] = [
    "Avocado", "Banana", "Beef (Alpha-gal Syndrome)", "Buckwheat", "Chamomile", "Chicken", "Cinnamon", "Citrus Fruits", 
    "Coconut", "Kiwi", "Latex (cross-reactivity with some fruits)", "Legumes (other than soy/peanut, e.g., lentils, chickpeas)",
    "Mango", "Meat (specific types other than common ones)", "Mushroom", "Oats (often due to gluten cross-contamination)", 
    "Poppy Seed", "Potato", "Rice", "Seeds (other than sesame, e.g., sunflower, pumpkin)", "Spices (various)", "Strawberry", "Tomato",
    "Yeast", "Nightshades (general)", "Garlic", "Onion", "Capsicum (Peppers)", "Berries (general)", "Chocolate/Cocoa", "Apple"
];


export const healthConditionsOptions: string[] = [
  "None", "Diabetes (Type 1)", "Diabetes (Type 2)", "Pre-diabetes", "Hypertension (High Blood Pressure)",
  "High Cholesterol (Hyperlipidemia)", "Heart Disease (CVD)", "Arrhythmia", "Atrial Fibrillation",
  "Celiac Disease", "Crohn's Disease", "Ulcerative Colitis (IBD)",
  "IBS (Irritable Bowel Syndrome)", "GERD (Acid Reflux)/Heartburn",
  "Chronic Kidney Disease (CKD)", "Gout", "Osteoporosis/Osteopenia",
  "Anemia (Iron-deficiency or other)", "Thyroid Disorders (Hypo/Hyperthyroidism, Hashimoto's)",
  "PCOS (Polycystic Ovary Syndrome)", "Endometriosis", "Fatty Liver Disease (NAFLD/NASH)",
  "Autoimmune Conditions (e.g., Rheumatoid Arthritis, Lupus)",
  "Migraines (diet-triggered)", "Skin Conditions (e.g., Eczema, Psoriasis - diet related)",
  "Mental Health (e.g., Depression, Anxiety - diet can play a role)",
  "Cancer (active treatment or recovery)", "Food Additive Intolerance",
  "Histamine Intolerance", "Lactose Intolerance", "Fructose Malabsorption",
  "Eating Disorders (past or present - use with caution)",
  "Pregnancy/Breastfeeding (requires specific dietary considerations)",
  "Post-Surgery Recovery"
];

export const healthGoalsOptions: string[] = [
  "Weight Loss", "Weight Maintenance", "Weight Gain (Healthy)", "Muscle Building/Strength",
  "Improve Athletic Performance", "Increase Energy Levels", "Better Sleep Quality",
  "Stress Reduction/Management", "Improve Gut Health/Digestion", "Blood Sugar Management/Control",
  "Lower Cholesterol", "Lower Blood Pressure", "Improve Heart Health", "Boost Immunity",
  "Improve Skin Health", "Improve Mood/Mental Clarity", "Mindful Eating Practices",
  "Eat More Plant-Based Foods", "Reduce Processed Food Intake", "Increase Fiber Intake",
  "Stay Hydrated", "Learn Healthier Cooking", "General Well-being", "Age Gracefully",
  "Support Pregnancy/Postpartum Health", "Just Staying Safe with My Restrictions"
];
