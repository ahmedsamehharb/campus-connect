// 1. CONFIGURATION
const API_URL = process.env.EXPO_PUBLIC_HF_API_URL || 'https://andrewsha-campus-connect.hf.space/chat';

export interface AIResponse {
    reply: string;
    error?: string;
}

export const aiService = {
    sendMessageToBot: async (message: string): Promise<AIResponse> => {
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: message,
                }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('HF Space API Error:', errorText);
                return {
                    reply: '',
                    error: `API Error: ${response.status}`,
                };
            }

            const data = await response.json();
            // The HF space returns { reply: "..." } based on the code we saw.
            // But it might also return the raw OpenAI format if the user changed it back.
            // Let's handle both.
            const botReply = data.reply || data.choices?.[0]?.message?.content;

            return {
                reply: botReply || "I didn't quite get that. Could you rephrase?",
            };
        } catch (error) {
            console.error('Network Error:', error);
            return {
                reply: '',
                error: error instanceof Error ? error.message : 'Network error',
            };
        }
    },
};
