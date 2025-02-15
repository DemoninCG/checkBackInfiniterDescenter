const XPButtonUnlockLevels = [0,2,3,6,10,15,20,30,40,60,90,150,200,300,400,Infinity];
const XPButtonGains = [10,20,40,75,150,250,400,750,1200,1800,2400,4000,6000,9000,11500];
const XPButtonCooldowns = [10,30,60,120,300,600,1200,2400,3600,5400,7200,14400,21600,32400,43200,Infinity];
const XPButtonColors = ["#00ffff","#0080ff","#0000ff","#8000ff","#ff00ff","#ff0080","#ff0000","#ff8000","#ffff00","#80ff00","#00ff00","#00ff80"];

const chestButtonUnlockLevels = [0,3,5,10,20,50,100,200,300,500,750,1000,1500,2000,2500,3000,4000,5000,7500,10000,Infinity];
const chestButtonCooldowns = [300, 600, 900, 1200, 1800, 2700, 3600, 5400, 5400, 5400, 5400, 5400, 5400, 5400, 5400, 5400, 5400, 5400, 5400, 5400];
const rarityColors = ["#bbb", "#0e0", "#02f", "#c3f", "#fb0", "#f00", "#6cf", "#306", "#0a8", "#222", "#a08", "#f88", "#070", "#f80", "#0ff", "#fff", "#afa", "#00f", "#987", "#b00"];
const rarityNames = ["common", "uncommon", "rare", "epic", "legendary", "mythical", "celestial", "void", "life", "infinite", "eternal", "rainbow", "verdant", "inferno", "frutiger", "anti", "mint", "vaporwave", "dust", "finality"];
const rarityChances = [524288, 262144, 131072, 65536, 32768, 16384, 8192, 4096, 2048, 1024, 512, 256, 128, 64, 32, 16, 8, 4, 2, 1];
/*
const rarityChances = [
    [192,64, 32, 16, 8,  4,  2,  1], //Common chest
    [112,128,64, 24, 12, 6,  3,  1], //Uncommon chest
    [64, 128,96, 48, 16, 8,  4,  2], //Rare chest
    [48, 96, 128,72, 40, 16, 8,  4], //Epic chest
    [32, 64, 96, 128,80, 40, 16, 8], //Legendary chest
    [24, 48, 80, 112,112,72, 24, 12], //Mythical chest
    [16, 32, 64, 96, 128,96, 48, 16], //Celestial chest
    [8,  16, 32, 64, 96, 112,96, 48], //Void chest
]*/
const potionNames = ["tiny", "basic", "round", "triangular", "wide", "rotund", "large", "tall round", "tall triangular", "tall wide", "bulbous", "massive"];
const potionChances = [15, 12, 9, 7, 5.5, 4, 3, 2.5, 2, 1.5, 1.2, 1];
const potionXPGains = [0, 0.02, 0.04, 0.06, 0.08, 0.1, 0.12, 0.14, 0.16, 0.18, 0.2, 0.22, 0.5];
const potionRarityXPMultipliers = [1, 1.5, 2, 2.5, 3, 3.5, 4, 5, 6.5, 8, 10, 15, 20, 30, 40, 50, 75, 100, 150, 200];

const romanNumerals = [
    ["M", 1000],
    ["CM", 900],
    ["D", 500],
    ["CD", 400],
    ["C", 100],
    ["XC", 90],
    ["L", 50],
    ["XL", 40],
    ["X", 10],
    ["IX", 9],
    ["V", 5],
    ["IV", 4],
    ["I", 1]
];

const ranks = [
    [1, "Beginner"],
    [2, "Basic"],
    [3, "Unremarkable"],
    [4, "Mediocre"],
    [5, "Average"],
    [6, "Competent"],
    [8, "Respectable"],
    [10, "Proficient"],
    [12, "Skilled"],
    [14, "Talented"],
    [16, "Expert"],
    [18, "Exceptional"],
    [20, "Brilliant"],
    [25, "Master"],
    [30, "Extraordinary"],
    [35, "Renowned"],
    [40, "Unmatched"],
    [45, "Superior"],
    [50, "Legendary"],
    [60, "Mythical"],
    [70, "Extreme"],
    [80, "Insane"],
    [90, "Supreme"],
    [100, "Immortal"],
    [120, "Celestial"],
    [140, "Galactic"],
    [160, "Godly"],
    [180, "Transcendent"],
    [200, "Cosmic"],
    [220, "Demonic"],
    [240, "Eternal"],
    [260, "Voidborn"],
    [280, "Universal"],
    [300, "Multiversal"],
    [350, "Omniversal"],
    [400, "Omnipotent"],
    [450, "Incomprehensible"],
    [500, "Infinite"],
    [550, "Infinite+"],
    [600, "Infinite++"],
    [650, "Infinite+++"],
    [700, "Infinite++++"],
    [750, "Infinite+++++"],
    [800, "Mega"],
    [850, "Mega+"],
    [900, "Mega++"],
    [950, "Mega+++"],
    [1000, "Mega++++"],
    [1050, "Mega+++++"],
    [1100, "Giga"],
    [1150, "Giga+"],
    [1200, "Giga++"],
    [1250, "Giga+++"],
    [1300, "Giga++++"],
    [1350, "Giga+++++"],
    [1400, "Tera"],
    [1450, "Tera+"],
    [1500, "Tera++"],
    [1550, "Tera+++"],
    [1600, "Tera++++"],
    [1650, "Tera+++++"],
    [1700, "Peta"],
    [1750, "Peta+"],
    [1800, "Peta++"],
    [1850, "Peta+++"],
    [1900, "Peta++++"],
    [1950, "Peta+++++"],
    [2000, "Omega"],
    [Infinity, "Error"],
]