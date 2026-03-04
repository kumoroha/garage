// importは使いません（HTMLで読み込むため）

async function bootSystem() {
    const API_KEY = prompt("20.25 SYSTEM: 認証キーを入力してください。"); 

    if (!API_KEY) {
        alert("CRITICAL ERROR: キーが未入力です。");
        return;
    }

    try {
        // window.googleGenerativeAi を使用
        const genAI = new window.googleGenerativeAi.GoogleGenerativeAI(API_KEY);
        
        // 【ここが最重要】404回避のため、安定版のAPIを指定する
        const model = genAI.getGenerativeModel(
            { model: "gemini-1.5-flash" },
            { apiVersion: "v1" } // ←ここ！テスト版ではなく安定版を指定
        );

        const chatLog = document.getElementById("chat-log");
        const userInput = document.getElementById("user-input");
        const sendBtn = document.getElementById("send-btn");

        async function handleChat() {
            const text = userInput.value;
            if (!text) return;

            addMessage(text, "user");
            userInput.value = "";

            try {
                // generateContent で直接呼ぶ（一番エラーが起きにくい）
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

        console.log("BASEMENT-GARAGE: SYSTEM ONLINE.");

    } catch (err) {
        alert("起動エラー: " + err.message);
    }
}

// ページ読み込み完了時に実行
window.onload = bootSystem;
