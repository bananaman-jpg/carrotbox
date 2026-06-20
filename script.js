const isHost = document.getElementById("send-question") !== null;
const isDisplay = document.getElementById("question") !== null;

/* ---------------- DISPLAY ---------------- */
if (isDisplay) {
    const questionEl = document.getElementById("question");
    const scoreEl = document.getElementById("player-scores");
    const correct = document.getElementById("correct-screen");
    const wrong = document.getElementById("wrong-screen");

    function renderDisplay() {
        questionEl.textContent =
            localStorage.getItem("question") || "Waiting for question...";


        scoreEl.innerHTML = "";
        const players = JSON.parse(localStorage.getItem("players") || "[]")
            .sort((a, b) => b.score - a.score);

        players.forEach((p, i) => {
            const li = document.createElement("li");
            const position = i + 1;
            let suffix = "th";

            if (position % 100 < 11 || position % 100 > 13) {
                if (position % 10 === 1) suffix = "st";
                else if (position % 10 === 2) suffix = "nd";
                else if (position % 10 === 3) suffix = "rd";
            }

    li.textContent = `${position}${suffix} - ${p.name}: ${p.score}`;
    li.style.font = `35px "Roboto Condensed", system-ui, sans-serif`;

    scoreEl.appendChild(li);
});
    }

    function showOverlay(type) {
        const el = type === "correct" ? correct : wrong;
        if (!el) return;

        el.style.display = "flex";

        setTimeout(() => {
            el.style.display = "none";
        }, 1500);
    }

    window.addEventListener("storage", (e) => {
        if (e.key === "question" || e.key === "players") {
            renderDisplay();
        }

        if (e.key === "overlay") {
            showOverlay(e.newValue);
        }

        if (e.key === "reset") {
            location.reload();
        }
    });

    renderDisplay();
}

/* ---------------- HOST ---------------- */
if (isHost) {
    const qInput = document.getElementById("question-input");
    const sendQ = document.getElementById("send-question");
    const addP = document.getElementById("add-player");
    const playersDiv = document.getElementById("players");

    const correctBtn = document.getElementById("correct");
    const wrongBtn = document.getElementById("wrong");
    const resetBtn = document.getElementById("reset-game");

    let players = JSON.parse(localStorage.getItem("players") || "[]");

    function renderHost() {
        playersDiv.innerHTML = "";

        players.forEach((p, i) => {
            const row = document.createElement("div");

            row.innerHTML = `
                <span class="player-name">${p.name}: ${p.score}</span>
                <button>+1</button>
            `;

            row.querySelector("button").onclick = () => {
                players[i].score++;
                localStorage.setItem("players", JSON.stringify(players));
                renderHost();
            };

            playersDiv.appendChild(row);
        });
    }

    sendQ.addEventListener("click", () => {
        localStorage.setItem("question", qInput.value);
    });

    addP.addEventListener("click", () => {
        const name = prompt("Player name?");
        if (!name) return;

        players.push({ name, score: 0 });
        localStorage.setItem("players", JSON.stringify(players));

        renderHost();
    });

    correctBtn.addEventListener("click", () => {
        localStorage.setItem("overlay", "correct");
    });

    wrongBtn.addEventListener("click", () => {
        localStorage.setItem("overlay", "wrong");
    });

    resetBtn.addEventListener("click", () => {
        localStorage.clear();
        localStorage.setItem("reset", "1");
    });

    renderHost();
}