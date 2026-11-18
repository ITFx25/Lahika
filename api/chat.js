const { GoogleGenerativeAI } = require('@google/generative-ai');
const admin = require('firebase-admin');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

const db = admin.firestore();
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY);

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { messages, sessionId } = req.body;
    const latestMessage = messages[messages.length - 1].content;

    // Save user message to Firestore
    await db.collection('chats').doc(sessionId).collection('messages').add({
      role: 'user',
      content: latestMessage,
      createdAt: new Date(),
    });

    // Call Gemini
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      systemInstruction: 'You are Lahika, a helpful AI assistant fluent in English and Hausa.',
    });

    const result = await model.generateContent(latestMessage);
    const reply = result.response.text();

    // Save Lahika's reply to Firestore
    await db.collection('chats').doc(sessionId).collection('messages').add({
      role: 'assistant',
      content: reply,
      createdAt: new Date(),
    });

    return res.status(200).json({ reply });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to generate response' });
  }
};
