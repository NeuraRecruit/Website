export type TypicalVacancy = {
  slug: string;
  title: string;
  headline: string;
  employmentType: "Permanent" | "Contract" | "Permanent & Contract";
  category: "Health & Safety" | "Construction";
  paragraphs: string[];
  requirementsTitle: string;
  requirements: string[];
  closingNote?: string;
  registerText: string;
};

export const TYPICAL_VACANCIES: TypicalVacancy[] = [
  {
    slug: "health-and-safety-advisor",
    title: "Health and Safety Advisor",
    headline:
      "Health and Safety Advisor £35,000 – £50,000 (dependent on experience and sector) — Permanent",
    employmentType: "Permanent",
    category: "Health & Safety",
    paragraphs: [
      "Are you a Health and Safety Advisor looking for your next move?",
      "Neura Recruitment is a specialist Health, Safety, Environment and Construction recruitment company, and we are continually working with contractors, developers and infrastructure businesses who are hiring Health and Safety Advisors across the UK.",
      "We would like to hear from Health and Safety Advisors who are open to new opportunities — whether you are actively looking now or simply want to be first to know when the right role appears.",
    ],
    requirementsTitle: "We typically recruit Health and Safety Advisors who have:",
    requirements: [
      "Experience in construction, civil engineering, infrastructure or a similar high-risk environment",
      "A NEBOSH General Certificate (or equivalent); NEBOSH Construction Certificate is often preferred",
      "Tech IOSH membership or working towards it",
      "Strong communication skills and the confidence to influence site teams",
      "A valid CSCS card (for site-based roles)",
    ],
    closingNote:
      "Salaries for Health and Safety Advisor roles in our market typically range from £35,000 to £50,000, with the upper end in construction and infrastructure, and many roles including a car or car allowance.",
    registerText:
      "Register your interest — send your CV to james@neurarecruitment.com or call us for a confidential conversation about the market.",
  },
  {
    slug: "health-and-safety-manager",
    title: "Health and Safety Manager",
    headline:
      "Health and Safety Manager £50,000 – £70,000 + car allowance & bonus — Permanent",
    employmentType: "Permanent",
    category: "Health & Safety",
    paragraphs: [
      "Ready to step up, or looking for a Health and Safety Manager role with more scope?",
      "Neura Recruitment specialises in Health, Safety, Environment and Construction recruitment, and we regularly work with businesses hiring Health and Safety Managers across the UK.",
      "We are always keen to speak with experienced Health and Safety Managers — and with Senior Advisors ready to make the step up.",
    ],
    requirementsTitle: "We typically recruit Health and Safety Managers who have:",
    requirements: [
      "A track record in construction, infrastructure or another high-risk sector",
      "A NEBOSH Diploma (or working towards it); CertIOSH or CMIOSH is often preferred",
      "Experience owning safety across a site, region or function",
      "The ability to drive genuine culture change, not just compliance",
      "Experience of audits, accreditation (ISO 45001) and incident investigation",
    ],
    closingNote:
      "Health and Safety Manager salaries in our market typically range from £50,000 to £70,000, frequently with a car or car allowance and a performance bonus.",
    registerText:
      "Register your interest — send your CV to james@neurarecruitment.com or call us for a confidential discussion.",
  },
  {
    slug: "sheq-advisor",
    title: "SHEQ Advisor",
    headline: "SHEQ Advisor £40,000 – £55,000 — Permanent",
    employmentType: "Permanent",
    category: "Health & Safety",
    paragraphs: [
      "Are you a SHEQ Advisor looking for a new challenge?",
      "Neura Recruitment is a specialist Health, Safety, Environment and Construction recruitment company. We work with contractors and infrastructure businesses across the UK who recruit SHEQ Advisors, HSE Advisors and HSEQ Advisors.",
    ],
    requirementsTitle: "We typically recruit SHEQ Advisors who have:",
    requirements: [
      "Experience across safety, health, environment and quality within construction or civils",
      "A NEBOSH Certificate (or equivalent)",
      "Experience with ISO 45001, ISO 14001 and ISO 9001 systems",
      "Audit and inspection experience across live sites",
      "A valid CSCS card",
    ],
    registerText:
      "Register your interest — send your CV to james@neurarecruitment.com or call us.",
  },
  {
    slug: "site-manager",
    title: "Site Manager",
    headline:
      "Site Manager £55,000 – £70,000 / competitive day rate — Permanent & Contract",
    employmentType: "Permanent & Contract",
    category: "Construction",
    paragraphs: [
      "Are you a Site Manager looking for your next project?",
      "Neura Recruitment recruits across construction and health and safety, and we work with contractors and developers hiring Site Managers across the UK — on both permanent and day-rate contracts.",
    ],
    requirementsTitle: "We typically recruit Site Managers who have:",
    requirements: [
      "Experience running sites within construction, fit-out, residential or civils",
      "SMSTS, CSCS and First Aid as standard",
      "A strong record on programme, quality and — above all — safety",
      "The ability to lead subcontractors and site teams effectively",
    ],
    registerText:
      "Register your interest — send your CV to james@neurarecruitment.com or call us.",
  },
  {
    slug: "site-foreman",
    title: "Site Foreman / Site Supervisor",
    headline: "Site Foreman Competitive day rate — Contract",
    employmentType: "Contract",
    category: "Construction",
    paragraphs: [
      "Looking for your next day-rate contract as a Site Foreman?",
      "Neura Recruitment supplies day-rate construction staff across the UK. We regularly work with contractors needing Site Foremen and Site Supervisors, often at short notice.",
    ],
    requirementsTitle: "We typically recruit Site Foremen who have:",
    requirements: [
      "Proven experience supervising trades and labour on live sites",
      "SSSTS or SMSTS, plus a valid CSCS card",
      "Reliability — turning up, on time, ready to work",
      "Own PPE",
    ],
    registerText:
      "Register your interest — send your CV to james@neurarecruitment.com or call us and we'll be in touch when work comes up in your area.",
  },
  {
    slug: "labourer-cscs",
    title: "Labourer (CSCS)",
    headline: "Labourer (CSCS) Competitive day rate — Contract",
    employmentType: "Contract",
    category: "Construction",
    paragraphs: [
      "Available for day-rate labouring work across the UK?",
      "Neura Recruitment supplies reliable, ticketed labour to contractors nationwide. We are always looking to hear from experienced labourers who want consistent work.",
    ],
    requirementsTitle: "We typically recruit Labourers who have:",
    requirements: [
      "A valid CSCS card",
      "Previous experience on construction sites",
      "Own PPE (boots, hi-vis, hard hat)",
      "Reliability and a good attitude on site",
    ],
    registerText:
      "Register your interest — call us or send your details to james@neurarecruitment.com and we'll contact you when work comes up nearby.",
  },
];

export function getRegisterInterestHref(vacancy: TypicalVacancy) {
  const params = new URLSearchParams({
    type: "worker",
    role: vacancy.title,
  });
  return `/apply?${params.toString()}`;
}
