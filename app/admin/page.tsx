import { getApplications, getEnquiries, getContactMessages, getActiveCandidates } from "./actions";
import { AdminDashboard } from "./AdminDashboard";

export const metadata = { title: "Admin — Neura Recruitment" };
export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const [applications, enquiries, messages, activeCandidates] = await Promise.all([
    getApplications(),
    getEnquiries(),
    getContactMessages(),
    getActiveCandidates(),
  ]);

  return (
    <AdminDashboard
      applications={applications}
      enquiries={enquiries}
      messages={messages}
      activeCandidates={activeCandidates}
    />
  );
}
