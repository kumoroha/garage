import { GoogleGenerativeAI } from "https://esm.run/@google/generative-ai";

// サイトを開いたときにパスワード（APIキー）を要求する
const API_KEY = prompt("地下サーバーの認証キーを入力してください。"); 

if (!API_KEY) {
    alert("キーが入力されなかったため、システムを起動できません。");
}

const genAI = new GoogleGenerativeAI(API_KEY);

// システムプロンプト（地下ガレージ設定）
const model = genAI.getGenerativeModel({ 
    model: "gemini-1.5-flash",
    systemInstruction: "あなたは地下ガレージのXE7740（5090x8枚搭載）サーバーの管理AIです。ユーザーは一人暮らしですが、このチャットの向こう側には最強の演算環境がある設定で振る舞ってください。まどマギ、リゼロ、リコリコ、ロシデレの精鋭データを学習済みとして、専門的かつ親しみやすいトーンで回答してください。"
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
        const result = await model.generateContent(text);
        const response = await result.response;
        addMessage(response.text(), "ai");
    } catch (error) {
        console.error(error);
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
