"use server";

import { z } from "zod";
import { createSupabaseClient } from "@/lib/supabase/server";
import { sendContactNotification } from "@/lib/email";
import { checkSpam } from "@/lib/spam";
import { isRateLimited } from "@/lib/rate-limit";
import { getTrustedIp } from "@/lib/request-ip";

const contactSchema = z.object({
  full_name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email required"),
  phone: z.string().optional(),
  company: z.string().optional(),
  message: z.string().min(10, "Please provide more detail"),
});

export type ContactState = {
  success?: boolean;
  error?: string;
  fieldErrors?: Record<string, string[]>;
};

export async function submitContact(
  _prevState: ContactState,
  formData: FormData
): Promise<ContactState> {
  if (checkSpam(formData)) return { success: true };

  const ip = await getTrustedIp();
  if (await isRateLimited(`contact:${ip}`, 5, 10 * 60 * 1000)) {
    return { error: "Too many submissions. Please try again later." };
  }

  const raw = {
    full_name: formData.get("full_name"),
    email: formData.get("email"),
    phone: formData.get("phone") || undefined,
    company: formData.get("company") || undefined,
    message: formData.get("message"),
  };

  const parsed = contactSchema.safeParse(raw);
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  try {
    const supabase = createSupabaseClient();
    const { error } = await supabase.from("contact_messages").insert({
      full_name: parsed.data.full_name,
      email: parsed.data.email,
      phone: parsed.data.phone || null,
      company: parsed.data.company || null,
      message: parsed.data.message,
      request_callback: false,
    });

    if (error) {
      return { error: "Failed to send message. Please try again." };
    }

    sendContactNotification({
      full_name: parsed.data.full_name,
      email: parsed.data.email,
      phone: parsed.data.phone ?? null,
      company: parsed.data.company ?? null,
      message: parsed.data.message,
      request_callback: false,
    }).catch(() => null);

    return { success: true };
  } catch {
    return {
      error: "Contact service unavailable. Please email hello@neurarecruitment.com",
    };
  }
}
