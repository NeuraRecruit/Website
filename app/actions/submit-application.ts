"use server";

import { z } from "zod";
import { createSupabaseAdmin, createSupabaseClient } from "@/lib/supabase/server";
import { sendCandidateNotification } from "@/lib/email";
import { checkSpam } from "@/lib/spam";
import { isRateLimited } from "@/lib/rate-limit";
import { getTrustedIp } from "@/lib/request-ip";

const applicationSchema = z.object({
  full_name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email required"),
  phone: z.string().min(7, "Phone number required"),
  role: z.string().min(1, "Role is required"),
  location: z.string().min(1, "Location is required"),
});

export type ApplicationState = {
  success?: boolean;
  error?: string;
  fieldErrors?: Record<string, string[]>;
};

export async function submitApplication(
  _prevState: ApplicationState,
  formData: FormData
): Promise<ApplicationState> {
  if (checkSpam(formData)) return { success: true };

  const ip = await getTrustedIp();
  if (await isRateLimited(`apply:${ip}`, 5, 10 * 60 * 1000)) {
    return { error: "Too many submissions. Please try again later." };
  }

  const raw = {
    full_name: formData.get("full_name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    role: formData.get("role"),
    location: formData.get("location"),
  };

  const parsed = applicationSchema.safeParse(raw);
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const cvFile = formData.get("cv") as File | null;
  let cvStoragePath: string | null = null;
  let cvSignedUrl: string | null = null;

  // Allowed CV file types (server-side enforcement; client `accept` is not trusted)
  const MAX_CV_BYTES = 5 * 1024 * 1024; // 5 MB
  const ALLOWED_EXTENSIONS = ["pdf", "doc", "docx"] as const;
  const ALLOWED_MIME_TYPES = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];

  try {
    if (cvFile && cvFile.size > 0) {
      if (cvFile.size > MAX_CV_BYTES) {
        return { fieldErrors: { cv: ["CV must be 5 MB or smaller."] } };
      }

      const ext = cvFile.name.split(".").pop()?.toLowerCase() ?? "";
      if (!ALLOWED_EXTENSIONS.includes(ext as typeof ALLOWED_EXTENSIONS[number])) {
        return { fieldErrors: { cv: ["CV must be a PDF, DOC, or DOCX file."] } };
      }

      if (!ALLOWED_MIME_TYPES.includes(cvFile.type)) {
        return { fieldErrors: { cv: ["CV must be a PDF, DOC, or DOCX file."] } };
      }

      const admin = createSupabaseAdmin();
      const fileName = `${crypto.randomUUID()}.${ext}`;
      const buffer = Buffer.from(await cvFile.arrayBuffer());

      const { error: uploadError } = await admin.storage
        .from("cvs")
        .upload(fileName, buffer, {
          contentType: cvFile.type,
          upsert: false,
        });

      if (uploadError) {
        console.error("[CV Upload Error]", JSON.stringify(uploadError, null, 2));
        return { error: "Failed to upload CV. Please try again." };
      }
      console.log("[CV Upload Success]", fileName);

      cvStoragePath = fileName;

      // Generate a 1-hour signed URL for the notification email
      const { data: signedData } = await admin.storage
        .from("cvs")
        .createSignedUrl(fileName, 60 * 60);
      cvSignedUrl = signedData?.signedUrl ?? null;
    }

    const supabase = createSupabaseClient();
    const { error } = await supabase.from("candidate_applications").insert({
      ...parsed.data,
      cv_url: cvStoragePath,
    });

    if (error) {
      console.error("[DB Insert Error]", JSON.stringify(error, null, 2));
      return { error: "Failed to submit application. Please try again." };
    }

    // Fire-and-forget — don't fail the submission if email fails
    sendCandidateNotification({
      ...parsed.data,
      cv_url: cvSignedUrl,
    }).then(() => console.log("[Email Sent - Application]")).catch((err) => console.error("[Email Error - Application]", err?.message ?? err));

    return { success: true };
  } catch (err) {
    console.error("[Unexpected Error]", err);
    return {
      error:
        "Application service unavailable. Please email hello@neurarecruitment.com",
    };
  }
}
