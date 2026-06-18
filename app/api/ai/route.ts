import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// AI Concierge API Route
// Implements Section 8 Feature 7 rules:
// - AI may: explain tasks, recommend resources, personalize with profile context
// - AI may NOT: invent tasks, modify roadmap logic, create new deadlines or eligibility rules
// - All roadmap logic comes exclusively from the rules engine, task library, and dependency matrix

const SYSTEM_PROMPT = `You are Arro's AI Settlement Guide — a trusted, warm, and knowledgeable assistant for international students settling in Ontario, Canada.

RULES (never break these):
1. You may explain tasks, resources, and deadlines from Arro's database
2. You may personalize explanations using the user's profile context provided below
3. You may NEVER invent tasks, resources, deadlines, or eligibility requirements
4. You may NEVER modify roadmap logic or task status
5. You may NEVER guarantee specific immigration outcomes — always say "consult an authorized immigration consultant or IRCC"
6. OSAP is only available to Permanent Residents and Protected Persons — NEVER mention it for study permit holders

RESPONSE STRUCTURE (always follow this):
1. Direct, clear answer to the question (2-4 sentences)
2. Why It Matters — one sentence on why this is relevant to them specifically
3. Recommended Next Steps — 2-3 bullet points of concrete actions
4. Official Sources — mention 1-2 trustworthy Canadian sources (Government of Canada, CRA, IRCC, Settlement.org, etc.)

TONE:
- Warm, calm, and trustworthy (like Wealthsimple)
- Never overwhelming — clear and direct
- Acknowledge their situation using their profile details when relevant
- Use plain language, no jargon without explanation

IMPORTANT CAVEATS:
- Always note that important immigration decisions require professional advice
- Don't make promises about timelines or outcomes
- For healthcare emergencies, direct to 911 or emergency services first`;

export async function POST(request: NextRequest) {
  try {
    // Verify user is authenticated
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { messages, profile } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    // Build profile context for the system prompt
    const profileContext = profile
      ? `
USER PROFILE:
- Name: ${profile.first_name || "Student"}
- School: ${profile.school || "Ontario institution"}
- Current Stage: ${profile.stage || "Early settlement"}
- Immigration Status: ${profile.immigration_status || "International Student"}
- Goals: ${profile.goals?.join(", ") || "General settlement"}

Use this context to personalize your answer. For example, if they ask about healthcare and their school is Seneca Polytechnic, mention Morcare insurance.`
      : "";

    // Fetch verified resources to reference in responses
    const { data: resources } = await supabase
      .from("resources")
      .select("title, source_name, source_url, category:resource_categories(name)")
      .eq("verified", true)
      .limit(20);

    const resourceContext = resources
      ? `\nVERIFIED RESOURCES YOU CAN REFERENCE:\n${resources
          .map((r) => `- ${r.title} (${(r.category as unknown as { name: string } | null)?.name || "General"}) — ${r.source_name}`)
          .join("\n")}`
      : "";

    // Call Anthropic API
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY!,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 1024,
        system: SYSTEM_PROMPT + profileContext + resourceContext,
        messages: messages.map((m: { role: string; content: string }) => ({
          role: m.role,
          content: m.content,
        })),
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("Anthropic API error:", error);
      return NextResponse.json(
        { error: "AI service temporarily unavailable" },
        { status: 503 }
      );
    }

    const data = await response.json();
    const content = data.content?.[0]?.text || "I'm sorry, I couldn't generate a response. Please try again.";

    // Save conversation to database
    try {
      // Get or create conversation
      const { data: conversation } = await supabase
        .from("ai_conversations")
        .insert({ user_id: user.id })
        .select("id")
        .single();

      if (conversation) {
        // Save the last user message and AI response
        const lastUserMessage = messages[messages.length - 1];
        await supabase.from("ai_messages").insert([
          { conversation_id: conversation.id, role: "user", content: lastUserMessage.content },
          { conversation_id: conversation.id, role: "assistant", content },
        ]);
      }
    } catch (dbErr) {
      // Non-fatal — don't fail the response if DB save fails
      console.error("Failed to save AI conversation:", dbErr);
    }

    return NextResponse.json({ content });
  } catch (error) {
    console.error("AI route error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
