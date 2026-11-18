import { NextResponse } from 'next/server';
import { db } from '@/lib/firebaseAdmin';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get('sessionId');

  try {
    // If a specific sessionId is requested, return its messages
    if (sessionId) {
      const snapshot = await db
        .collection('chats')
        .doc(sessionId)
        .collection('messages')
        .orderBy('createdAt', 'asc')
        .get();

      const messages = snapshot.docs.map((doc) => ({
        id: doc.id,
        role: doc.data().role,
        content: doc.data().content,
      }));

      return NextResponse.json({ messages });
    }

    // Otherwise, return the list of all saved chat sessions
    const chatsSnapshot = await db
      .collection('chats')
      .orderBy('updatedAt', 'desc')
      .limit(20)
      .get();

    const sessions = chatsSnapshot.docs.map((doc) => ({
      id: doc.id,
      title: doc.data().title || 'New Conversation',
    }));

    return NextResponse.json({ sessions });
  } catch (error) {
    console.error('Firestore History Error:', error);
    return NextResponse.json({ error: 'Failed to load history' }, { status: 500 });
  }
}
