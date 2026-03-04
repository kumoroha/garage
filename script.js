// 読み込み元を esm.run から UNPKG に変更（より安定した最新版）
import { GoogleGenerativeAI } from "https://unpkg.com/@google/generative-ai@0.1.0/dist/index.js";

// キーの入力
const API_KEY = prompt("20.25 SYSTEM: 認証キーを入力してください。"); 

if (!API_KEY) {
    alert("CRITICAL ERROR: キーが未入力です。");
}

const genAI = new GoogleGenerativeAI(API_KEY);

// モデルの取得方法を変更
// 404が出る場合、バージョン指定を明示的に行う
const model = genAI.getGenerativeModel({ 
    model: "gemini-1.5-flash",
});

// チャットセッション（履歴で設定を流し込む）
const chat = model.startChat({
    history: [
        {
            role: "user",
            parts: [{ text: "指令：あなたは地下ガレージのXE7740サーバー管理AIです。まどマギ・リゼロ等の知識を背景に、冷徹かつ忠実な相棒として振る舞ってください。復唱。" }],
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
        // sendMessage を実行
        const result = await chat.sendMessage(text);
        const response = await result.response;
        addMessage(response.text(), "ai");
    } catch (error) {
        console.error("詳細ログ:", error);
        // エラー内容を詳細に表示
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
