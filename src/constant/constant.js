let user_mode = JSON.parse(localStorage.getItem("userMode")) || "";
let isLoggedIn = JSON.parse(localStorage.getItem("isLoggedIn")) || false;
const defaultAvatar = "https://placehold.co/120x120?text=Avatar";

console.log("userMode------>", user_mode, "isLogge----------->", isLoggedIn);

// --- Plan Configuration ---
const PLAN_HIERARCHY = ['Basic', 'Silver', 'Gold', 'Platinum'];

const PLAN_PREMIUMS = { 
    'Basic': 5000, 
    'Silver': 7500, 
    'Gold': 10000, 
    'Platinum': 15000 
};

const PLAN_COVERAGES = { 
    'Basic': 100000, 
    'Silver': 200000, 
    'Gold': 500000, 
    'Platinum': 1000000 
};

const PLAN_COLORS = { 
    'Basic': '#5dade2', 
    'Silver': '#aab7b8', 
    'Gold': '#f7dc6f', 
    'Platinum': '#d7bde2' 
};

const TELANGANA_DISTRICTS = [
    "Adilabad",
    "Bhadradri Kothagudem",
    "Hanumakonda",
    "Hyderabad",
    "Jagitial",
    "Jangaon",
    "Jayashankar Bhupalpally",
    "Jogulamba Gadwal",
    "Kamareddy",
    "Karimnagar",
    "Khammam",
    "Kumuram Bheem Asifabad",
    "Mahabubabad",
    "Mahabubnagar",
    "Mancherial",
    "Medak",
    "Medchal-Malkajgiri",
    "Mulugu",
    "Nagarkurnool",
    "Nalgonda",
    "Narayanpet",
    "Nirmal",
    "Nizamabad",
    "Peddapalli",
    "Rajanna Sircilla",
    "Rangareddy",
    "Sangareddy",
    "Siddipet",
    "Suryapet",
    "Vikarabad",
    "Wanaparthy",
    "Warangal",
    "Yadadri Bhuvanagiri"
];
