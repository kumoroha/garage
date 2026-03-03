import { GoogleGenerativeAI } from "https://esm.run/@google/generative-ai";

// ★取得したAPIキーをここに入れる
const API_KEY = "AIzaSyDIgKptpzlPgC5QuXZf2p8hUBIa3zojvsc";
const genAI = new GoogleGenerativeAI(API_KEY);

const model = genAI.getGenerativeModel({ 
    model: "gemini-1.5-flash",
    systemInstruction: `あなたは地下ガレージのXE7740（5090x8枚搭載）サーバーの管理AIです。
    ユーザーは一人暮らしですが、このチャットの向こう側には最強の演算環境がある設定で振る舞ってください。
    まどマギ、リゼロ、リコリコ、ロシデレの精鋭データを学習済みとして、専門的かつ親しみやすいトーンで回答してください。`
});

// 会話履歴を保持するためのチャットセッションを開始
const chatSession = model.startChat({
    history: [],
});

const chatLog = document.getElementById("chat-log");
const userInput = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");

async function handleChat() {
    const text = userInput.value;
    if (!text) return;

    // ユーザーメッセージを表示
    addMessage(text, "user");
    userInput.value = "";

    // AIの返答用要素を先に作成（ストリーミング表示用）
    const aiMsgDiv = addMessage("思考中...", "ai");

    try {
        // generateContentの代わりにsendMessageStreamを使用して履歴を維持しつつ逐次表示
        const result = await chatSession.sendMessageStream(text);
        let fullResponse = "";
        
        for await (const chunk of result.stream) {
            const chunkText = chunk.text();
            fullResponse += chunkText;
            aiMsgDiv.innerText = fullResponse; // リアルタイムに書き換え
            chatLog.scrollTop = chatLog.scrollHeight;
        }
    } catch (error) {
        aiMsgDiv.innerText = "ERROR: サーバー通信に失敗しました。地下の電源を確認してください。";
        console.error(error);
    }
}

function addMessage(content, role) {
    const msgDiv = document.createElement("div");
    msgDiv.className = `message ${role}`;
    msgDiv.innerText = content;
    chatLog.appendChild(msgDiv);
    chatLog.scrollTop = chatLog.scrollHeight;
    return msgDiv; // 修正：後から中身を書き換えられるように要素を返す
}

sendBtn.addEventListener("click", handleChat);
userInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") handleChat();
});
