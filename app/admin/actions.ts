"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseAdmin } from "@/lib/supabase/server";

export type CandidateApplication = {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  role: string;
  location: string;
  cv_url: string | null;
  created_at: string;
  processed: boolean;
};

export type EmployerEnquiry = {
  id: string;
  company_name: string;
  contact_name: string;
  email: string;
  phone: string;
  message: string;
  created_at: string;
  processed: boolean;
};

export type ContactMessage = {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  company: string | null;
  message: string;
  request_callback: boolean;
  created_at: string;
  processed: boolean;
};

type SubmissionTable =
  | "candidate_applications"
  | "employer_enquiries"
  | "contact_messages";

export async function toggleProcessed(
  table: SubmissionTable,
  id: string,
  processed: boolean
): Promise<void> {
  const admin = createSupabaseAdmin();
  const { error } = await admin.from(table).update({ processed }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin");
}

export async function getApplications(): Promise<CandidateApplication[]> {
  const admin = createSupabaseAdmin();
  const { data, error } = await admin
    .from("candidate_applications")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getEnquiries(): Promise<EmployerEnquiry[]> {
  const admin = createSupabaseAdmin();
  const { data, error } = await admin
    .from("employer_enquiries")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getContactMessages(): Promise<ContactMessage[]> {
  const admin = createSupabaseAdmin();
  const { data, error } = await admin
    .from("contact_messages")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getCvSignedUrl(storagePath: string): Promise<string | null> {
  const admin = createSupabaseAdmin();
  const { data } = await admin.storage
    .from("cvs")
    .createSignedUrl(storagePath, 60 * 60);
  return data?.signedUrl ?? null;
}

// ─── Delete submission rows ────────────────────────────────────────────────

export async function deleteApplication(id: string): Promise<void> {
  const admin = createSupabaseAdmin();

  // Fetch cv_url so we can delete the file too
  const { data: row } = await admin
    .from("candidate_applications")
    .select("cv_url")
    .eq("id", id)
    .single();

  if (row?.cv_url) {
    await admin.storage.from("cvs").remove([row.cv_url]);
  }

  const { error } = await admin.from("candidate_applications").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin");
}

export async function deleteEnquiry(id: string): Promise<void> {
  const admin = createSupabaseAdmin();
  const { error } = await admin.from("employer_enquiries").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin");
}

export async function deleteContactMessage(id: string): Promise<void> {
  const admin = createSupabaseAdmin();
  const { error } = await admin.from("contact_messages").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin");
}

// ─── Active candidates ─────────────────────────────────────────────────────

export type CandidateStatus = "available" | "in_work" | "unavailable";
export type CandidatePriority = "high" | "medium" | "low";

export type ActiveCandidate = {
  id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  linkedin_url: string | null;
  job_title: string | null;
  desired_role: string | null;
  location: string | null;
  salary_expectation: string | null;
  day_rate: string | null;
  previous_roles: string | null;
  qualifications: string | null;
  notice_period: string | null;
  availability: string | null;
  cv_storage_path: string | null;
  notes: string | null;
  status: CandidateStatus;
  priority: CandidatePriority;
  created_at: string;
  updated_at: string;
};

export async function getActiveCandidates(): Promise<ActiveCandidate[]> {
  const admin = createSupabaseAdmin();
  const { data, error } = await admin
    .from("active_candidates")
    .select("*")
    .order("updated_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data ?? [];
}

function optStr(formData: FormData, key: string): string | null {
  const v = (formData.get(key) as string | null)?.trim();
  return v || null;
}

export async function createActiveCandidate(formData: FormData): Promise<void> {
  const admin = createSupabaseAdmin();

  let cvStoragePath: string | null = null;
  const cvFile = formData.get("cv") as File | null;
  if (cvFile && cvFile.size > 0) {
    const ext = cvFile.name.split(".").pop() || "pdf";
    const fileName = `pool-${crypto.randomUUID()}.${ext}`;
    const buffer = Buffer.from(await cvFile.arrayBuffer());
    const { error: uploadError } = await admin.storage
      .from("cvs")
      .upload(fileName, buffer, { contentType: cvFile.type, upsert: false });
    if (uploadError) throw new Error(uploadError.message);
    cvStoragePath = fileName;
  }

  const rawStatus = (formData.get("status") as string | null)?.trim();
  const status: CandidateStatus =
    rawStatus === "in_work" || rawStatus === "unavailable" ? rawStatus : "available";

  const rawPriority = (formData.get("priority") as string | null)?.trim();
  const priority: CandidatePriority =
    rawPriority === "high" || rawPriority === "low" ? rawPriority : "medium";

  const { error } = await admin.from("active_candidates").insert({
    full_name: optStr(formData, "full_name"),
    email: optStr(formData, "email"),
    phone: optStr(formData, "phone"),
    linkedin_url: optStr(formData, "linkedin_url"),
    job_title: optStr(formData, "job_title"),
    desired_role: optStr(formData, "desired_role"),
    location: optStr(formData, "location"),
    salary_expectation: optStr(formData, "salary_expectation"),
    day_rate: optStr(formData, "day_rate"),
    previous_roles: optStr(formData, "previous_roles"),
    qualifications: optStr(formData, "qualifications"),
    notice_period: optStr(formData, "notice_period"),
    availability: optStr(formData, "availability"),
    notes: optStr(formData, "notes"),
    cv_storage_path: cvStoragePath,
    status,
    priority,
  });
  if (error) throw new Error(error.message);
  revalidatePath("/admin");
}

export async function updateActiveCandidate(id: string, formData: FormData): Promise<void> {
  const admin = createSupabaseAdmin();

  let cvStoragePath: string | undefined = undefined;
  const cvFile = formData.get("cv") as File | null;
  if (cvFile && cvFile.size > 0) {
    const ext = cvFile.name.split(".").pop() || "pdf";
    const fileName = `pool-${crypto.randomUUID()}.${ext}`;
    const buffer = Buffer.from(await cvFile.arrayBuffer());
    const { error: uploadError } = await admin.storage
      .from("cvs")
      .upload(fileName, buffer, { contentType: cvFile.type, upsert: false });
    if (uploadError) throw new Error(uploadError.message);
    cvStoragePath = fileName;
  }

  const rawStatus = (formData.get("status") as string | null)?.trim();
  const status: CandidateStatus =
    rawStatus === "in_work" || rawStatus === "unavailable" ? rawStatus : "available";

  const rawPriority = (formData.get("priority") as string | null)?.trim();
  const priority: CandidatePriority =
    rawPriority === "high" || rawPriority === "low" ? rawPriority : "medium";

  const updates: Record<string, string | null> = {
    full_name: optStr(formData, "full_name"),
    email: optStr(formData, "email"),
    phone: optStr(formData, "phone"),
    linkedin_url: optStr(formData, "linkedin_url"),
    job_title: optStr(formData, "job_title"),
    desired_role: optStr(formData, "desired_role"),
    location: optStr(formData, "location"),
    salary_expectation: optStr(formData, "salary_expectation"),
    day_rate: optStr(formData, "day_rate"),
    previous_roles: optStr(formData, "previous_roles"),
    qualifications: optStr(formData, "qualifications"),
    notice_period: optStr(formData, "notice_period"),
    availability: optStr(formData, "availability"),
    notes: optStr(formData, "notes"),
    status,
    priority,
    updated_at: new Date().toISOString(),
  };
  if (cvStoragePath !== undefined) updates.cv_storage_path = cvStoragePath;

  const { error } = await admin.from("active_candidates").update(updates).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin");
}

export async function toggleCandidateStatus(
  id: string,
  status: CandidateStatus
): Promise<void> {
  const admin = createSupabaseAdmin();
  const { error } = await admin
    .from("active_candidates")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin");
}

export async function deleteActiveCandidate(id: string): Promise<void> {
  const admin = createSupabaseAdmin();

  const { data: row } = await admin
    .from("active_candidates")
    .select("cv_storage_path")
    .eq("id", id)
    .single();

  if (row?.cv_storage_path) {
    await admin.storage.from("cvs").remove([row.cv_storage_path]);
  }

  const { error } = await admin.from("active_candidates").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin");
}

// ─── Companies ─────────────────────────────────────────────────────────────

export type Company = {
  id: string;
  company_name: string;
  industry: string | null;
  contact_name: string | null;
  contact_title: string | null;
  email: string | null;
  phone: string | null;
  website: string | null;
  location: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export async function getCompanies(): Promise<Company[]> {
  const admin = createSupabaseAdmin();
  const { data, error } = await admin
    .from("companies")
    .select("*")
    .order("company_name", { ascending: true });
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function createCompany(formData: FormData): Promise<void> {
  const admin = createSupabaseAdmin();
  const { error } = await admin.from("companies").insert({
    company_name: (formData.get("company_name") as string)?.trim() || "Unnamed company",
    industry: optStr(formData, "industry"),
    contact_name: optStr(formData, "contact_name"),
    contact_title: optStr(formData, "contact_title"),
    email: optStr(formData, "email"),
    phone: optStr(formData, "phone"),
    website: optStr(formData, "website"),
    location: optStr(formData, "location"),
    notes: optStr(formData, "notes"),
  });
  if (error) throw new Error(error.message);
  revalidatePath("/admin");
}

export async function updateCompany(id: string, formData: FormData): Promise<void> {
  const admin = createSupabaseAdmin();
  const { error } = await admin
    .from("companies")
    .update({
      company_name: (formData.get("company_name") as string)?.trim() || "Unnamed company",
      industry: optStr(formData, "industry"),
      contact_name: optStr(formData, "contact_name"),
      contact_title: optStr(formData, "contact_title"),
      email: optStr(formData, "email"),
      phone: optStr(formData, "phone"),
      website: optStr(formData, "website"),
      location: optStr(formData, "location"),
      notes: optStr(formData, "notes"),
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin");
}

export async function deleteCompany(id: string): Promise<void> {
  const admin = createSupabaseAdmin();
  const { error } = await admin.from("companies").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin");
}
