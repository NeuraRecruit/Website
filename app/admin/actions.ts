"use server";

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
