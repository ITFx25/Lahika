import { google } from '@ai-sdk/google';
import { streamText } from 'ai';
import { db } from '@/lib/firebaseAdmin';

export async function POST(req: Request) {
  const { messages, sessionId = 'default-session' } = await req.json();
  const latestUserMessage = messages[messages.length - 1];

  // Save user message to Firestore
  if (latestUserMessage) {
    await db.collection('chats').doc(sessionId).collection('messages').add({
      role: 'user',
      content: latestUserMessage.content,
      createdAt: new Date(),
    });
  }

  const result = streamText({
    model: google('gemini-2.5-flash'),
    system: 'You are Lahika, a smart, helpful, and polite AI assistant. You can communicate fluently in both English and Hausa.',
    messages,
    async onFinish({ text }) {
      // Save Lahika's reply to Firestore
      await db.collection('chats').doc(sessionId).collection('messages').add({
        role: 'assistant',
        content: text,
        createdAt: new Date(),
      });
    },
  });

  return result.toDataStreamResponse();
}
