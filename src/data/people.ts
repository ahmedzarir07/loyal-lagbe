const boyNames = [
  "Rakib Hasan", "Tanvir Ahmed", "Shahin Alam", "Mehedi Hasan", "Arif Rahman",
  "Jubayer Khan", "Sakib Hossain", "Nayeem Islam", "Farhan Kabir", "Imran Hossain",
  "Rifat Uddin", "Shanto Das", "Tushar Ahmed", "Rahim Mia", "Kamal Hossain",
  "Jahid Hasan", "Sohag Mia", "Badhon Islam", "Sumon Sheikh", "Nahid Hasan",
];

const girlNames = [
  "Fatima Akter", "Nusrat Jahan", "Tasnim Rahman", "Ayesha Siddiqua", "Mariam Begum",
  "Lamia Islam", "Sumaiya Akter", "Rabeya Khatun", "Jannatul Ferdous", "Maliha Ahmed",
  "Sadia Islam", "Tamanna Akter", "Nafisa Rahman", "Bristy Das", "Rima Begum",
  "Papiya Khatun", "Sharna Islam", "Tania Sultana", "Mitu Akter", "Reshma Begum",
];

const dhakaAreas = [
  "Dhanmondi", "Gulshan", "Banani", "Mirpur", "Uttara", "Mohammadpur",
  "Motijheel", "Farmgate", "Shahbag", "Tejgaon", "Badda", "Rampura",
  "Khilgaon", "Basundhara", "Bashundhara R/A", "Jatrabari", "Demra",
  "Gabtoli", "Pallabi", "Kafrul", "Cantonment", "Lalmatia", "Elephant Road",
  "New Market", "Old Dhaka", "Wari", "Lalbagh", "Azimpur",
];

const loyaltyQuotes = [
  "Never texted anyone else 💚",
  "Waiting since 2019 🥺",
  "Only has eyes for bae 👀",
  "Phone password is partner's birthday 🔐",
  "Still uses couple DP 💑",
  "Rejected 47 proposals 💪",
  "Carries partner's photo in wallet 🪪",
  "Writes love letters in 2024 💌",
  "Never liked anyone else's photo 📱",
  "Goes offline at 10pm for bae 🌙",
];

export interface Person {
  id: string;
  name: string;
  gender: "boy" | "girl";
  area: string;
  quote: string;
  x: number; // percentage position on map
  y: number;
  realVotes: number;
  fakeVotes: number;
}

function randomPick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function generatePeople(count: number): Person[] {
  return Array.from({ length: count }, (_, i) => {
    const gender = Math.random() > 0.5 ? "boy" : "girl";
    return {
      id: `person-${i}-${Date.now()}`,
      name: gender === "boy" ? randomPick(boyNames) : randomPick(girlNames),
      gender,
      area: randomPick(dhakaAreas),
      quote: randomPick(loyaltyQuotes),
      x: 8 + Math.random() * 84,
      y: 8 + Math.random() * 84,
      realVotes: Math.floor(Math.random() * 50),
      fakeVotes: Math.floor(Math.random() * 30),
    };
  });
}
