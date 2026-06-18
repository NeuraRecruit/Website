import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM = "Neura Recruitment <hello@neurarecruitment.com>";
const TO = "hello@neurarecruitment.com";

function row(label: string, value: string) {
  return `<tr><td style="padding:6px 0;color:#6b7280;font-size:14px;width:140px;vertical-align:top">${label}</td><td style="padding:6px 0;font-size:14px;color:#111827">${value}</td></tr>`;
}

function layout(title: string, body: string) {
  return `<!DOCTYPE html><html><body style="margin:0;padding:0;background:#f9fafb;font-family:system-ui,sans-serif">
<table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:40px 16px">
<table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;border:1px solid #e5e7eb">
<tr><td style="padding:32px 32px 24px;border-bottom:1px solid #f3f4f6">
<span style="font-size:12px;font-weight:600;letter-spacing:0.15em;text-transform:uppercase;color:#2e6bff">Neura Recruitment</span>
<h2 style="margin:8px 0 0;font-size:20px;font-weight:600;color:#111827">${title}</h2>
</td>
<tr><td style="padding:24px 32px 32px">${body}</td></tr>
</table>
</td></tr></table></body></html>`;
}

export async function sendCandidateNotification(data: {
  full_name: string;
  email: string;
  phone: string;
  role: string;
  location: string;
  cv_url: string | null;
}) {
  const cvLine = data.cv_url
    ? `<a href="${data.cv_url}" style="color:#2e6bff">Download CV</a>`
    : "Not provided";

  const body = `<table cellpadding="0" cellspacing="0" style="width:100%">
${row("Name", data.full_name)}
${row("Email", `<a href="mailto:${data.email}" style="color:#2e6bff">${data.email}</a>`)}
${row("Phone", data.phone)}
${row("Role", data.role)}
${row("Location", data.location)}
${row("CV", cvLine)}
</table>`;

  await resend.emails.send({
    from: FROM,
    to: TO,
    subject: `New candidate application — ${data.role} (${data.location})`,
    html: layout("New Candidate Application", body),
  });
}

export async function sendEnquiryNotification(data: {
  company_name: string;
  contact_name: string;
  email: string;
  phone: string;
  message: string;
}) {
  const body = `<table cellpadding="0" cellspacing="0" style="width:100%">
${row("Company", data.company_name)}
${row("Contact", data.contact_name)}
${row("Email", `<a href="mailto:${data.email}" style="color:#2e6bff">${data.email}</a>`)}
${row("Phone", data.phone)}
${row("Message", `<span style="white-space:pre-wrap">${data.message}</span>`)}
</table>`;

  await resend.emails.send({
    from: FROM,
    to: TO,
    subject: `New employer enquiry — ${data.company_name}`,
    html: layout("New Employer Enquiry", body),
  });
}

export async function sendContactNotification(data: {
  full_name: string;
  email: string;
  phone?: string | null;
  company?: string | null;
  message: string;
  request_callback: boolean;
}) {
  const body = `<table cellpadding="0" cellspacing="0" style="width:100%">
${row("Name", data.full_name)}
${row("Email", `<a href="mailto:${data.email}" style="color:#2e6bff">${data.email}</a>`)}
${data.phone ? row("Phone", data.phone) : ""}
${data.company ? row("Company", data.company) : ""}
${row("Callback?", data.request_callback ? "Yes — please call" : "No")}
${row("Message", `<span style="white-space:pre-wrap">${data.message}</span>`)}
</table>`;

  await resend.emails.send({
    from: FROM,
    to: TO,
    subject: `New contact message${data.request_callback ? " (callback requested)" : ""} — ${data.full_name}`,
    html: layout("New Contact Message", body),
  });
}
