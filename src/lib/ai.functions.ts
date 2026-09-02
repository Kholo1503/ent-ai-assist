import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const MessageSchema = z.object({
  role: z.enum(["system", "user", "assistant"]),
  content: z.string(),
});

const AiInput = z.object({
  messages: z.array(MessageSchema).min(1),
  temperature: z.number().min(0).max(2).optional(),
});

export type AiMessage = z.infer<typeof MessageSchema>;

export const aiComplete = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => AiInput.parse(input))
  .handler(async ({ data }) => {
    const key = process.env["LOVABLE_API_KEY"];
    if (!key) {
      throw new Error("AI is not configured. Missing API key.");
    }

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Lovable-API-Key": key,
        "X-Lovable-AIG-SDK": "fetch",
      },
      body: JSON.stringify({
        model: "google/gemini-3.7-flash",
        messages: data.messages,
        temperature: data.temperature ?? 0.6,
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      let message = body;
      try {
        const parsed = JSON.parse(body) as { error?: { message?: string }; message?: string };
        message = parsed.error?.message ?? parsed.message ?? body;
      } catch {
        /* keep raw text */
      }
      if (res.status === 429) {
        throw new Error("The AI is busy right now (rate limited). Please try again in a moment.");
      }
      if (res.status === 402) {
        throw new Error(message || "AI credits are exhausted. Please top up to continue.");
      }
      throw new Error(message || `AI request failed (${res.status}).`);
    }

    const json = (await res.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const text = json.choices?.[0]?.message?.content ?? "";
    return { text };
  });
