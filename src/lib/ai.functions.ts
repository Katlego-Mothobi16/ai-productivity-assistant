import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const MODEL = "google/gemini-3.5-flash";
const GATEWAY_URL = "https://ai.gateway.lovable.dev/v1/chat/completions";

type ChatMessage = { role: "system" | "user" | "assistant"; content: string };

async function callAI(messages: ChatMessage[]): Promise<string> {
  const key = process.env.LOVABLE_API_KEY;
  if (!key) throw new Error("Missing LOVABLE_API_KEY");

  const res = await fetch(GATEWAY_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({ model: MODEL, messages }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    if (res.status === 429) throw new Error("Rate limit reached. Please try again in a moment.");
    if (res.status === 402) throw new Error("AI credits exhausted. Please add credits to continue.");
    throw new Error(`AI request failed (${res.status}): ${text.slice(0, 200)}`);
  }

  const data = (await res.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  return data.choices?.[0]?.message?.content ?? "";
}

const EmailInput = z.object({
  purpose: z.string().min(1),
  recipient: z.string().optional().default(""),
  tone: z.enum(["Formal", "Friendly", "Persuasive"]),
  keyPoints: z.string().optional().default(""),
});

export const generateEmail = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => EmailInput.parse(data))
  .handler(async ({ data }) => {
    const system = `You are an expert workplace communication assistant. Write a complete, professional email in a ${data.tone.toLowerCase()} tone. Include a clear subject line on the first line prefixed with "Subject: ", then a blank line, then the email body with a proper greeting, well-structured paragraphs, and a sign-off. Do not use markdown formatting. Do not include placeholder text like [Your Name] unless necessary — use "Best regards," style closings.`;
    const user = `Purpose: ${data.purpose}
Recipient: ${data.recipient || "(unspecified)"}
Tone: ${data.tone}
Key points to include: ${data.keyPoints || "(none provided — use your judgment)"}

Write the email now.`;
    const content = await callAI([
      { role: "system", content: system },
      { role: "user", content: user },
    ]);
    return { content };
  });

const PlanInput = z.object({
  goals: z.string().min(1),
  range: z.enum(["Daily", "Weekly"]),
  hoursAvailable: z.string().optional().default(""),
});

export const generatePlan = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => PlanInput.parse(data))
  .handler(async ({ data }) => {
    const system = `You are an expert productivity coach. Create a ${data.range.toLowerCase()} work plan that prioritizes tasks using the Eisenhower matrix logic (importance and urgency). For each task provide: priority (High/Medium/Low), suggested time block (e.g. "9:00–10:30" for daily, or "Mon morning" for weekly), and estimated duration. End with a "Productivity Tips" section containing 3 concise, actionable tips relevant to the goals. Use clean markdown with headings and bullet points.`;
    const user = `Planning range: ${data.range}
Available hours: ${data.hoursAvailable || "standard workday"}
Goals & tasks:
${data.goals}

Create the plan now.`;
    const content = await callAI([
      { role: "system", content: system },
      { role: "user", content: user },
    ]);
    return { content };
  });

const ChatInput = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string(),
      }),
    )
    .min(1),
});

export const chatWithAssistant = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => ChatInput.parse(data))
  .handler(async ({ data }) => {
    const system: ChatMessage = {
      role: "system",
      content:
        "You are a professional AI workplace productivity assistant. You help with tasks like drafting communication, planning work, summarizing information, brainstorming, and answering questions in a workplace context. Keep responses clear, concise, and professionally toned. Use markdown for structure when helpful. Remind users to review AI output before acting on it when relevant.",
    };
    const content = await callAI([system, ...data.messages]);
    return { content };
  });
