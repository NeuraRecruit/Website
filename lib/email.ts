import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM = "Neura Recruitment <hello@neurarecruitment.com>";
const TO = "hello@neurarecruitment.com";

// Escape user-provided values before interpolating into notification HTML.
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

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

export async function sendAdminLoginCode(code: string) {
  const body = `<p style="margin:0 0 16px;font-size:14px;color:#374151">
Use this code to finish signing in to the Neura admin panel:</p>
<p style="margin:0 0 16px;font-size:32px;font-weight:700;letter-spacing:0.2em;color:#111827">${escapeHtml(code)}</p>
<p style="margin:0;font-size:13px;color:#6b7280">
This code expires in 10 minutes. If you didn't try to sign in, you can safely ignore this email.</p>`;

  await resend.emails.send({
    from: FROM,
    to: TO,
    subject: "Your Neura admin login code",
    html: layout("Admin login code", body),
  });
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
    ? `<a href="${encodeURI(data.cv_url)}" style="color:#2e6bff">Download CV</a>`
    : "Not provided";

  const email = escapeHtml(data.email);
  const body = `<table cellpadding="0" cellspacing="0" style="width:100%">
${row("Name", escapeHtml(data.full_name))}
${row("Email", `<a href="mailto:${email}" style="color:#2e6bff">${email}</a>`)}
${row("Phone", escapeHtml(data.phone))}
${row("Role", escapeHtml(data.role))}
${row("Location", escapeHtml(data.location))}
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
  const email = escapeHtml(data.email);
  const body = `<table cellpadding="0" cellspacing="0" style="width:100%">
${row("Company", escapeHtml(data.company_name))}
${row("Contact", escapeHtml(data.contact_name))}
${row("Email", `<a href="mailto:${email}" style="color:#2e6bff">${email}</a>`)}
${row("Phone", escapeHtml(data.phone))}
${row("Message", `<span style="white-space:pre-wrap">${escapeHtml(data.message)}</span>`)}
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
  const email = escapeHtml(data.email);
  const body = `<table cellpadding="0" cellspacing="0" style="width:100%">
${row("Name", escapeHtml(data.full_name))}
${row("Email", `<a href="mailto:${email}" style="color:#2e6bff">${email}</a>`)}
${data.phone ? row("Phone", escapeHtml(data.phone)) : ""}
${data.company ? row("Company", escapeHtml(data.company)) : ""}
${row("Callback?", data.request_callback ? "Yes — please call" : "No")}
${row("Message", `<span style="white-space:pre-wrap">${escapeHtml(data.message)}</span>`)}
</table>`;

  await resend.emails.send({
    from: FROM,
    to: TO,
    subject: `New contact message${data.request_callback ? " (callback requested)" : ""} — ${data.full_name}`,
    html: layout("New Contact Message", body),
  });
}
