import manychat from "@/db/models/manychat/manychat";
import dbConnect from "@/db/mongodb";
import OpenAI from "openai";

const openaiClient = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const ASSISTANT_ID = process.env.OPENAI_ASSISTANT_ID;

const createThread = async () => {
  return await openaiClient.beta.threads.create();
};

const createMessage = async ({
  thread_id,
  messageContent = "Default message content",
  role = "user",
}) => {
  if (!thread_id) {
    throw new Error("Thread id is required");
  }
  return await openaiClient.beta.threads.messages.create(thread_id, {
    role: role,
    content: messageContent,
  });
};

const runAssistant = async ({ threadId, assistantId = ASSISTANT_ID }) => {
  return await openaiClient.beta.threads.runs.createAndPoll(threadId, {
    assistant_id: assistantId,
  });
};

async function reply(input, threadId) {
  if (!input)
    return { messages: ["Bana bir girdi sağlayınız.."], status: run.status };
  let thread_id;
  if (!threadId) {
    const thread = await createThread();
    thread_id = thread.id;
  } else {
    thread_id = threadId;
  }
  console.log(thread_id);
  await createMessage({ thread_id, messageContent: input });
  const run = await runAssistant({ threadId: thread_id });

  while (run.status !== "completed") {
    if (run.status === "failed") {
      return { messages: null, status: run.status, error: run.last_error };
    }
    await new Promise((r) => setTimeout(r, 1000));
  }

  const messages = await openaiClient.beta.threads.messages.list(run.thread_id);

  return { messages, status: run.status, thread_id };
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  await dbConnect();
  await manychat.create(req.body);

  if (!req.body.input) {
    return res.status(400).json({ error: "Input is required" });
  }

  try {
    const { input, threadId } = req.body;
    const result = await reply(input, threadId);
    res.status(200).json({
      version: "v2",
      content: {
        type: "instagram",
        messages: [
          {
            type: "text",
            text: result.messages?.body?.data?.[0]?.content[0]?.text?.value,
          },
        ],
        actions: [],
        quick_replies: [],
      },
    });
  } catch (error) {
    console.error("Error in /api/reply:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
