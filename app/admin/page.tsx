import { getApplications, getEnquiries, getContactMessages, getActiveCandidates, getCompanies } from "./actions";
import { AdminDashboard } from "./AdminDashboard";

export const metadata = { title: "Admin — Neura Recruitment" };
export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const [applications, enquiries, messages, activeCandidates, companies] = await Promise.all([
    getApplications(),
    getEnquiries(),
    getContactMessages(),
    getActiveCandidates(),
    getCompanies(),
  ]);

  return (
    <AdminDashboard
      applications={applications}
      enquiries={enquiries}
      messages={messages}
      activeCandidates={activeCandidates}
      companies={companies}
    />
  );
}
