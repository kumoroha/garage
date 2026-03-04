// 読み込み元をブラウザで最も安定して動く形式に変更
import { GoogleGenerativeAI } from "https://jspm.dev/@google/generative-ai";

async function init() {
    // 1. サイトを開いた瞬間にキーを入れる
    const API_KEY = prompt("20.25 SYSTEM: 地下サーバーの認証キーを入力してください。"); 

    if (!API_KEY) {
        alert("CRITICAL ERROR: 認証キーがありません。");
        return;
    }

    try {
        const genAI = new GoogleGenerativeAI(API_KEY);
        
        // 2026年現在、最も安定しているモデル名（1.5-flash）
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const chatLog = document.getElementById("chat-log");
        const userInput = document.getElementById("user-input");
        const sendBtn = document.getElementById("send-btn");

        // 初期化メッセージ（これが出れば成功）
        console.log("System Online: XE7740");

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

    } catch (err) {
        alert("システム起動失敗: " + err.message);
    }
}

// 実行
init();
