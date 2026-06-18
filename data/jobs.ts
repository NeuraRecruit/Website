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
    role: "Labourer",
    location: "Sittingbourne",
    trade: "Trades & Labour",
    salary: "£13 – £15/hr",
    salaryMin: 27040,
    featured: true,
    filled: true,
  },
  {
    id: "2",
    role: "Labourer",
    location: "Croydon",
    trade: "Trades & Labour",
    salary: "£13 – £15/hr",
    salaryMin: 27040,
    featured: true,
    filled: true,
  },
  {
    id: "3",
    role: "Site Manager",
    location: "London",
    trade: "Site Management",
    salary: "£55,000 – £65,000",
    salaryMin: 55000,
    featured: true,
    filled: true,
  },
  {
    id: "4",
    role: "Electrician",
    location: "Manchester",
    trade: "Trades & Labour",
    salary: "£18 – £22/hr",
    salaryMin: 37440,
    featured: true,
    filled: true,
  },
  {
    id: "5",
    role: "Groundworker",
    location: "Bristol",
    trade: "Trades & Labour",
    salary: "£15 – £18/hr",
    salaryMin: 31200,
    filled: true,
  },
  {
    id: "6",
    role: "Bricklayer",
    location: "Sheffield",
    trade: "Trades & Labour",
    salary: "£16 – £19/hr",
    salaryMin: 33280,
    filled: true,
  },
];

export const TRADES = [
  "All Trades",
  "Trades & Labour",
  "Site Management",
] as const;

export const LOCATIONS = [
  "All Locations",
  "Sittingbourne",
  "Croydon",
  "London",
  "Manchester",
  "Bristol",
  "Sheffield",
] as const;

export const SALARY_RANGES = [
  { label: "All Salaries", min: 0 },
  { label: "£30k+", min: 30000 },
  { label: "£40k+", min: 40000 },
  { label: "£50k+", min: 50000 },
] as const;
