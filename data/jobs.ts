export type Job = {
  id: string;
  role: string;
  location: string;
  trade: string;
  salary: string;
  salaryMin: number;
  featured?: boolean;
  filled?: boolean;
};

export const ALL_ROLES_FILLED = true;

export const JOBS: Job[] = [
  {
    id: "1",
    role: "Site Manager",
    location: "London",
    trade: "Site Management",
    salary: "£55,000 – £65,000",
    salaryMin: 55000,
    featured: true,
    filled: true,
  },
  {
    id: "2",
    role: "Electrician",
    location: "Manchester",
    trade: "Trades & Labour",
    salary: "£18 – £22/hr",
    salaryMin: 37440,
    featured: true,
    filled: true,
  },
  {
    id: "3",
    role: "Quantity Surveyor",
    location: "Birmingham",
    trade: "Commercial",
    salary: "£45,000 – £55,000",
    salaryMin: 45000,
    featured: true,
    filled: true,
  },
  {
    id: "4",
    role: "Carpenter",
    location: "Leeds",
    trade: "Trades & Labour",
    salary: "£17 – £20/hr",
    salaryMin: 35360,
    featured: true,
    filled: true,
  },
  {
    id: "5",
    role: "Structural Engineer",
    location: "London",
    trade: "Engineering",
    salary: "£50,000 – £60,000",
    salaryMin: 50000,
    featured: true,
    filled: true,
  },
  {
    id: "6",
    role: "Groundworker",
    location: "Bristol",
    trade: "Trades & Labour",
    salary: "£15 – £18/hr",
    salaryMin: 31200,
    featured: true,
    filled: true,
  },
  {
    id: "7",
    role: "Site Supervisor",
    location: "Glasgow",
    trade: "Site Management",
    salary: "£38,000 – £45,000",
    salaryMin: 38000,
    filled: true,
  },
  {
    id: "8",
    role: "Plumber",
    location: "Liverpool",
    trade: "Trades & Labour",
    salary: "£18 – £21/hr",
    salaryMin: 37440,
    filled: true,
  },
  {
    id: "9",
    role: "Bricklayer",
    location: "Sheffield",
    trade: "Trades & Labour",
    salary: "£16 – £19/hr",
    salaryMin: 33280,
    filled: true,
  },
  {
    id: "10",
    role: "Plant Operator",
    location: "Nottingham",
    trade: "Trades & Labour",
    salary: "£17 – £20/hr",
    salaryMin: 35360,
    filled: true,
  },
  {
    id: "11",
    role: "Civil Engineer",
    location: "Edinburgh",
    trade: "Engineering",
    salary: "£42,000 – £52,000",
    salaryMin: 42000,
    filled: true,
  },
  {
    id: "12",
    role: "Commercial Manager",
    location: "London",
    trade: "Commercial",
    salary: "£65,000 – £80,000",
    salaryMin: 65000,
    filled: true,
  },
];

export const TRADES = [
  "All Trades",
  "Trades & Labour",
  "Engineering",
  "Commercial",
  "Site Management",
] as const;

export const LOCATIONS = [
  "All Locations",
  "London",
  "Manchester",
  "Birmingham",
  "Leeds",
  "Bristol",
  "Glasgow",
  "Liverpool",
  "Sheffield",
  "Nottingham",
  "Edinburgh",
] as const;

export const SALARY_RANGES = [
  { label: "All Salaries", min: 0 },
  { label: "£30k+", min: 30000 },
  { label: "£40k+", min: 40000 },
  { label: "£50k+", min: 50000 },
] as const;
