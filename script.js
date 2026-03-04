// 地下ガレージ XE7740 起動シーケンス
async function initializeGarageSystem() {
    console.log("System Check: Checking for Google AI Library...");

    // ライブラリが読み込まれるまで最大5秒待機する処理
    let retryCount = 0;
    while (!window.googleGenerativeAi && retryCount < 50) {
        await new Promise(resolve => setTimeout(resolve, 100));
        retryCount++;
    }

    if (!window.googleGenerativeAi) {
        alert("CRITICAL ERROR: AIライブラリの読み込みに失敗しました。ネット接続を確認してください。");
        return;
    }

    // 1. 認証キーの要求
    const API_KEY = prompt("20.25 SYSTEM: 地下サーバー(XE7740)の認証キーを入力してください。"); 

    if (!API_KEY) {
        alert("ACCESS DENIED: キーが未入力です。");
        return;
    }

    try {
        const genAI = new window.googleGenerativeAi.GoogleGenerativeAI(API_KEY);
        
        // 安定版の1.5-flashを指定（これが一番確実です）
        const model = genAI.getGenerativeModel(
            { model: "gemini-1.5-flash" },
            { apiVersion: "v1" }
        );

        const chatLog = document.getElementById("chat-log");
        const userInput = document.getElementById("user-input");
        const sendBtn = document.getElementById("send-btn");

        // メッセージ送信関数
        async function handleChat() {
            const text = userInput.value;
            if (!text) return;

            addMessage(text, "user");
            userInput.value = "";

            try {
                // 初回に地下ガレージの設定を混ぜて送る
                const promptText = `設定：あなたは地下ガレージの管理AIです。まどマギ、リゼロ、リコリコ、ロシデレのデータを学習済みとして振る舞ってください。質問：${text}`;
                
                const result = await model.generateContent(promptText);
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

        console.log("GARAGE OS: ONLINE");

    } catch (err) {
        alert("起動エラー: " + err.message);
    }
}

// 画面が準備できたら起動
window.addEventListener('DOMContentLoaded', initializeGarageSystem);
