import { GoogleGenerativeAI } from "@google/generative-ai";

async function startSystem() {
    // 1. サイトを開いた瞬間に認証キーを要求
    const API_KEY = prompt("20.25 SYSTEM: 地下サーバーの認証キーを入力してください。"); 

    if (!API_KEY) {
        alert("CRITICAL ERROR: 認証キーが入力されていません。");
        return;
    }

    try {
        // ライブラリを使用して初期化
        const genAI = new GoogleGenerativeAI(API_KEY);
        
        // モデルの設定（無料枠で最強の1.5-flash）
        const model = genAI.getGenerativeModel({ 
            model: "gemini-1.5-flash" 
        });

        // チャットセッションの設定（履歴で性格を叩き込む）
        const chat = model.startChat({
            history: [
                {
                    role: "user",
                    parts: [{ text: "指令：あなたは地下ガレージの管理AIです。まどマギ、リゼロ、リコリコ、ロシデレのデータを元に、XE7740サーバーとして振る舞ってください。" }],
                },
                {
                    role: "model",
                    parts: [{ text: "了解。全ユニットオンライン。アーカイブ展開完了。オペレーター、指示をどうぞ。" }],
                }
            ],
        });

        const chatLog = document.getElementById("chat-log");
        const userInput = document.getElementById("user-input");
        const sendBtn = document.getElementById("send-btn");

        // メッセージ送信処理
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

        console.log("SYSTEM READY: XE7740 Online.");

    } catch (err) {
        alert("システム起動エラー: " + err.message);
        console.error(err);
    }
}

// 実行
startSystem();
