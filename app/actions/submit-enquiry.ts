"use server";

import { z } from "zod";
import { createSupabaseClient } from "@/lib/supabase/server";
import { sendEnquiryNotification } from "@/lib/email";

const enquirySchema = z.object({
  company_name: z.string().min(2, "Company name is required"),
  contact_name: z.string().min(2, "Contact name is required"),
  email: z.string().email("Valid email required"),
  phone: z.string().min(7, "Phone number required"),
  message: z.string().min(10, "Please provide more detail"),
});

export type EnquiryState = {
  success?: boolean;
  error?: string;
  fieldErrors?: Record<string, string[]>;
};

export async function submitEnquiry(
  _prevState: EnquiryState,
  formData: FormData
): Promise<EnquiryState> {
  const raw = {
    company_name: formData.get("company_name"),
    contact_name: formData.get("contact_name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    message: formData.get("message"),
  };

  const parsed = enquirySchema.safeParse(raw);
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  try {
    const supabase = createSupabaseClient();
    const { error } = await supabase.from("employer_enquiries").insert(parsed.data);

    if (error) {
      return { error: "Failed to submit enquiry. Please try again." };
    }

    sendEnquiryNotification(parsed.data).catch(() => null);

    return { success: true };
  } catch {
    return {
      error:
        "Enquiry service unavailable. Please email hello@neurarecruitment.com",
    };
  }
}
