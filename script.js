import { GoogleGenerativeAI } from "https://esm.run/@google/generative-ai";

const API_KEY = prompt("20.25 SYSTEM: 地下認証キーを入力してください。"); 

if (!API_KEY) {
    alert("キーが未入力です。");
}

const genAI = new GoogleGenerativeAI(API_KEY);

// ここが最重要：無料枠で最も安定している「1.5-flash」をフルネームで指定
const model = genAI.getGenerativeModel({ 
    model: "gemini-1.5-flash", 
});

// チャットの履歴に「設定」を仕込む（これが一番エラーが出にくい）
const chat = model.startChat({
    history: [
        {
            role: "user",
            parts: [{ text: "指令：あなたは地下ガレージのXE7740サーバー管理AIです。まどマギ・リゼロ等の知識を背景に、冷徹かつ忠実な相棒として振る舞ってください。復唱してください。" }],
        },
        {
            role: "model",
            parts: [{ text: "了解。地下ガレージXE7740、全ユニットオンライン。まどマギ・リゼロ等のアーカイブ展開完了。オペレーター、指示を待機中。" }],
        }
    ],
});

const chatLog = document.getElementById("chat-log");
const userInput = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");

async function handleChat() {
    const text = userInput.value;
    if (!text) return;

    addMessage(text, "user");
    userInput.value = "";

    try {
        // 無料枠の場合、ここでの通信が「1.5-flash」に正しく届くはずです
        const result = await chat.sendMessage(text);
        const response = await result.response;
        addMessage(response.text(), "ai");
    } catch (error) {
        console.error("詳細ログ:", error);
        addMessage(`SYSTEM ERROR: ${error.message}`, "system");
    }
}

function addMessage(content, role) {
    const msgDiv = document.createElement("div");
    msgDiv.className = `message ${role}`;
    msgDiv.innerText = content;
    chatLog.appendChild(msgDiv);
    chatLog.scrollTop = chatLog.scrollHeight;
}

sendBtn.addEventListener("click", handleChat);
userInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") handleChat();
});
