import { getApplications, getEnquiries, getContactMessages } from "./actions";
import { AdminDashboard } from "./AdminDashboard";

export const metadata = { title: "Admin — Neura Recruitment" };
export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const [applications, enquiries, messages] = await Promise.all([
    getApplications(),
    getEnquiries(),
    getContactMessages(),
  ]);

  return (
    <AdminDashboard
      applications={applications}
      enquiries={enquiries}
      messages={messages}
    />
  );
}
