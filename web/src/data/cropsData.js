export const cropsData = {
    "Banana": {
        name: "Banana",
        icon: "🍌",
        scientificName: "Musa acuminata",
        season: "All Year Round (Tropical)",
        duration: "11-14 Months",
        description: "Bananas are one of the most important fruit crops. They grow in bunches and require a tropical climate with high humidity.",
        sowingTips: "Plant suckers or tissue culture plants in well-drained, fertile soil. maintain spacing of 1.8m x 1.8m.",
        watering: "Requires 1800-2000mm annual rainfall or regular irrigation. Soil should be kept moist but not waterlogged.",
        diseases: ["Panama Wilt", "Sigatoka Leaf Spot", "Bunchy Top Virus"],
        pests: ["Rhizome Weevil", "Banana Aphid", "Fruit Scaring Beetle"],
        calculatorData: {
            basis: "plant", // Calculate based on number of plants
            seedRate: 3086, // plants per hectare (1.8m x 1.8m spacing)
            seedUnit: "Suckers",
            npk: { n: 200, p: 60, k: 250 } // kg per hectare
        }
    },
    "Rice": {
        name: "Rice",
        icon: "🍚",
        scientificName: "Oryza sativa",
        season: "Kharif (June-Nov) / Rabi",
        duration: "110-150 Days",
        description: "Rice is the staple food for more than half of the world's population. It is a semi-aquatic grass.",
        sowingTips: "Sow seeds in nursery beds first. Transplant 25-30 day old seedlings to the main field. Puddle the field well.",
        watering: "Requires standing water (2-5cm) during most vegetative stages. Critical stages are tillering and flowering.",
        diseases: ["Blast", "Bacterial Leaf Blight", "Sheath Blight"],
        pests: ["Stem Borer", "Brown Plant Hopper", "Leaf Folder"],
        calculatorData: {
            basis: "area",
            seedRate: 40, // kg per hectare
            seedUnit: "kg",
            npk: { n: 100, p: 50, k: 50 } // kg per hectare
        }
    },
    "Barley": {
        name: "Barley",
        icon: "🌾",
        scientificName: "Hordeum vulgare",
        season: "Rabi (Winter)",
        duration: "100-120 Days",
        description: "Barley is a major cereal grain grown in temperate climates globally. It is more salt-tolerant than wheat.",
        sowingTips: "Sow in Oct-Nov. Seed rate 100kg/ha. Spacing 22.5cm between rows.",
        watering: "Requires 2-3 irrigations. Critical stages: Tillering and Grain Filling.",
        diseases: ["Rusts", "Powdery Mildew", "Leaf Blight"],
        pests: ["Aphids", "Termites"],
        calculatorData: {
            basis: "area",
            seedRate: 100, // kg per hectare
            seedUnit: "kg",
            npk: { n: 80, p: 40, k: 30 } // kg per hectare
        }
    },
    "Cauliflower": {
        name: "Cauliflower",
        icon: "🥦",
        scientificName: "Brassica oleracea",
        season: "Winter",
        duration: "90-120 Days",
        description: "Cauliflower is a cruciferous vegetable grown for its white curd. It thrives in cool, moist climates.",
        sowingTips: "Sow seeds in nursery. Transplant 4-5 week old seedlings. Spacing 45cm x 45cm.",
        watering: "Shallow rooted crop, needs frequent light irrigation. Soil moisture is critical during curd formation.",
        diseases: ["Black Rot", "Downy Mildew", "Club Root"],
        pests: ["Diamondback Moth", "Aphids", "Cabbage Borer"],
        calculatorData: {
            basis: "area",
            seedRate: 0.6, // kg per hectare
            seedUnit: "kg",
            npk: { n: 120, p: 80, k: 60 } // kg per hectare
        }
    },
    "Wheat": {
        name: "Wheat",
        icon: "🍞",
        scientificName: "Triticum aestivum",
        season: "Rabi (Winter)",
        duration: "120-140 Days",
        description: "Wheat is a major source of starch and energy. Adapts well to cool climates.",
        sowingTips: "Sow in Nov. Spacing 20-22.5 cm rows.",
        watering: "Requires 4-6 irrigations at critical stages like CRI (21 days).",
        diseases: ["Rusts", "Karnal Bunt"],
        pests: ["Termites", "Aphids"],
        calculatorData: {
            basis: "area",
            seedRate: 100, // kg per hectare
            seedUnit: "kg",
            npk: { n: 120, p: 60, k: 40 } // kg per hectare
        }
    },
    "Corn": {
        name: "Corn",
        icon: "🌽",
        scientificName: "Zea mays",
        season: "Kharif/Rabi",
        duration: "95-120 Days",
        description: "Maize is a versatile crop used for food, feed, and fodder.",
        sowingTips: "Sow in rows 60cm apart. Plant to plant 20cm.",
        watering: "Sensitive to both drought and waterlogging.",
        diseases: ["Leaf Blight", "Downy Mildew"],
        pests: ["Fall Armyworm", "Stem Borer"],
        calculatorData: {
            basis: "area",
            seedRate: 20, // kg per hectare
            seedUnit: "kg",
            npk: { n: 120, p: 60, k: 60 }
        }
    },
    "Guava": {
        name: "Guava",
        icon: "🍈",
        scientificName: "Psidium guajava",
        season: "Perennial",
        duration: "Years",
        description: "Hardy fruit crop.",
        sowingTips: "Planting distance 6m x 6m.",
        watering: "Regular watering required during fruit development.",
        diseases: ["Wilt", "Anthracnose"],
        pests: ["Fruit Fly"],
        calculatorData: {
            basis: "plant",
            seedRate: 277, // plants per hectare (6m x 6m)
            seedUnit: "Plants",
            npk: { n: 200, p: 80, k: 150 } // kg per hectare worth of plants
        }
    }
};

export const availableCrops = [
    { name: "Banana", icon: "🍌" },
    { name: "Rice", icon: "🍚" },
    { name: "Barley", icon: "🌾" },
    { name: "Cauliflower", icon: "🥦" },
    { name: "Wheat", icon: "🍞" },
    { name: "Corn", icon: "🌽" },
    { name: "Potato", icon: "🥔" },
    { name: "Tomato", icon: "🍅" },
    { name: "Cotton", icon: "☁️" },
    { name: "Sugarcane", icon: "🎋" }
];
