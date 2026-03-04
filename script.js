import { GoogleGenerativeAI } from "https://esm.run/@google/generative-ai";

// 1. 起動時に認証キーを入力（GitHub公開対策）
const API_KEY = prompt("20.25 SYSTEM: 地下サーバーの認証キーを入力してください。"); 

if (!API_KEY) {
    alert("CRITICAL ERROR: 認証キーがありません。システムを終了します。");
}

const genAI = new GoogleGenerativeAI(API_KEY);

// 2. モデルの定義（404回避のため、最も標準的な名称を使用）
const model = genAI.getGenerativeModel({ 
    model: "gemini-1.5-flash", 
});

// 3. チャットセッションの初期化（System Instructionの代わりに履歴で性格を叩き込む）
const chat = model.startChat({
    history: [
        {
            role: "user",
            parts: [{ text: "指示：あなたは地下ガレージのXE7740（5090x8枚搭載）サーバーの管理AIです。ユーザーは一人暮らしですが、このチャットの向こう側には最強の演算環境がある設定で振る舞ってください。まどマギ、リゼロ、リコリコ、ロシデレの精鋭データを学習済みとして、専門的かつ親しみやすいトーンで回答してください。了解したら、システム起動の報告を。" }],
        },
        {
            role: "model",
            parts: [{ text: "了解しました。地下ガレージの全システム、およびRTX 5090×8枚の演算ユニットをオンラインに移行。256GBのVRAMを確保しました。まどマギ・リゼロ等の各アーカイブもマウント完了。オペレーター、指示をどうぞ。" }],
        },
    ],
});

const chatLog = document.getElementById("chat-log");
const userInput = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");

// 4. メッセージ送信関数
async function handleChat() {
    const text = userInput.value;
    if (!text) return;

    // ユーザーの入力を画面に表示
    addMessage(text, "user");
    userInput.value = "";

    try {
        // AIへ送信
        const result = await chat.sendMessage(text);
        const response = await result.response;
        
        // AIの返答を画面に表示
        addMessage(response.text(), "ai");
    } catch (error) {
        console.error("詳細エラー:", error);
        // エラー内容を詳しく画面に出す（デバッグ用）
        addMessage(`SYSTEM ERROR: ${error.message}`, "system");
    }
}

// 5. 画面にメッセージを追加する補助関数
function addMessage(content, role) {
    const msgDiv = document.createElement("div");
    msgDiv.className = `message ${role}`;
    msgDiv.innerText = content;
    chatLog.appendChild(msgDiv);
    
    // 常に最新のメッセージまでスクロール
    chatLog.scrollTop = chatLog.scrollHeight;
}

// 6. イベントリスナーの設定
sendBtn.addEventListener("click", handleChat);
userInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") handleChat();
});
