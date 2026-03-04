import { GoogleGenerativeAI } from "https://esm.run/@google/generative-ai";

async function bootGarageSystem() {
    // 1. 認証キーの要求（これが画面に出れば成功）
    const API_KEY = prompt("20.25 SYSTEM: 地下サーバー(XE7740)の認証キーを入力してください。"); 

    if (!API_KEY) {
        alert("ACCESS DENIED: キーが未入力です。リロードして再試行してください。");
        return;
    }

    try {
        const genAI = new GoogleGenerativeAI(API_KEY);
        
        // 404エラーを回避するため、安定版(v1)を指定
        const model = genAI.getGenerativeModel(
            { model: "gemini-1.5-flash" },
            { apiVersion: "v1" }
        );

        const chatLog = document.getElementById("chat-log");
        const userInput = document.getElementById("user-input");
        const sendBtn = document.getElementById("send-btn");

        // 初期設定を履歴として叩き込む（まどマギ・リゼロ設定）
        const chat = model.startChat({
            history: [
                {
                    role: "user",
                    parts: [{ text: "あなたは地下ガレージの管理AIです。まどマギ、リゼロ、リコリコ、ロシデレのデータを学習済みとして、XE7740サーバーの相棒として振る舞ってください。" }],
                },
                {
                    role: "model",
                    parts: [{ text: "了解。地下ガレージXE7740、全ユニットオンライン。オペレーター、指示をどうぞ。" }],
                }
            ],
        });

        async function handleChat() {
            const text = userInput.value;
            if (!text) return;

            addMessage(text, "user");
            userInput.value = "";

            try {
                const result = await chat.sendMessage(text);
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

        console.log("GARAGE OS: CONNECTED");

    } catch (err) {
        // ここで「読み込み失敗」が出る場合は、ネット制限の可能性があります
        alert("システム起動エラー: " + err.message);
    }
}

// 実行
bootGarageSystem();
