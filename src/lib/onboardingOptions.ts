// src/lib/onboardingOptions.ts

// Data from user's HTML <script> tag
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
    "South Korea": ["Seoul", "Busan", "Incheon", "Daegu", "Daejeon", "Gwangju", "Suwon", "Ulsan", "Changwon", "Goyang", "Yongin", "Seongnam", "Bucheon", "Cheongju", "Ansan", "Jeonju", "Anyang", "Cheonan", "Pohang", "Uijeongbu", "Siheung", "Paju", "Gimhae", "Hwaseong", "Jeju City", "Pyeongtaek", "Gunsan", "Iksan", "Yangsan", "Suncheon", "Chuncheon", "Wonju", "Gangneung", "Asan", "Mokpo", "Yeosu", "Tongyeong", "Gyeongju", "Sokcho", "Andong"]
};

export const regions = ["Africa", "Asia", "Europe", "North America", "Oceania", "South America"]; // Example regions

export const dietaryPaths: string[] = [
  "Vegetarian", "Vegan", "Pescatarian", "Flexitarian", "Paleo", "Keto", 
  "Low-Carb", "Mediterranean", "DASH", "Whole30", "Gluten-Free", 
  "Dairy-Free", "Nut-Free", "Soy-Free", "Egg-Free", "Halal", "Kosher", 
  "Jain", "Buddhist Diet", "Low-FODMAP", "Low-Residue", "Diabetic Diet", "Renal Diet"
];

export const ingredientsToAvoidOptions: { name: string; emoji?: string }[] = [
  { name: "Pork", emoji: "🐖" }, { name: "Alcohol", emoji: "🍷" }, 
  { name: "Shellfish", emoji: "🦞" }, { name: "Beef", emoji: "🐄" }, 
  { name: "Poultry", emoji: "🐔" }, { name: "Gelatin", emoji: "🍮" }, 
  { name: "Rennet" }, { name: "Carmine/Cochineal", emoji: "🐞" }, 
  { name: "Lard", emoji: "🥓" }, { name: "Artificial Sweeteners", emoji: "🧪" },
  { name: "Artificial Colors", emoji: "🎨" }, { name: "MSG", emoji: "🧂" },
  { name: "High Fructose Corn Syrup" }, { name: "Trans Fats" },
  { name: "Nitrates/Nitrites" }
];

export const commonAllergens: { name: string; emoji?: string }[] = [
  { name: "Peanuts", emoji: "🥜" }, { name: "Tree Nuts", emoji: "🌰" }, 
  { name: "Milk", emoji: "🥛" }, { name: "Eggs", emoji: "🥚" }, 
  { name: "Wheat/Gluten", emoji: "🌾" }, { name: "Soy", emoji: "🫘" }, 
  { name: "Fish", emoji: "🐟" }, { name: "Shellfish", emoji: "🦐" },
  { name: "Sesame Seeds" }, { name: "Mustard" }, { name: "Celery" },
  { name: "Lupin" }, { name: "Sulphites" }, { name: "Corn", emoji: "🌽" }
];

export const healthConditionsOptions: string[] = [
  "Diabetes (Type 1)", "Diabetes (Type 2)", "Hypertension (High Blood Pressure)",
  "High Cholesterol", "Heart Disease", "Celiac Disease", "Crohn's Disease",
  "Ulcerative Colitis", "IBS (Irritable Bowel Syndrome)", "GERD (Acid Reflux)",
  "Chronic Kidney Disease", "Gout", "Osteoporosis", "Anemia", "Thyroid Disorders",
  "Lactose Intolerance"
];

export const healthGoalsOptions: string[] = [
  "Weight Loss", "Weight Gain", "Muscle Building", "Improve Energy",
  "Better Sleep", "Stress Reduction", "Gut Health", "Blood Sugar Management",
  "Heart Health", "Mindful Eating", "Eat More Plants", "Reduce Processed Foods",
  "Just Staying Safe"
];
