// 1. Data Soal (Minimal 5 Pertanyaan)
const questions = [
    {
        question: "Apa singkatan dari HTML?",
        options: ["Hyper Text Markup Language", "Hyperlinks and Text Markup Language", "Home Tool Markup Language", "Hyper Tool Markup Language"],
        answer: "Hyper Text Markup Language"
    },
    {
        question: "Metode array apa yang digunakan untuk menambah elemen di akhir array?",
        options: ["push()", "pop()", "shift()", "unshift()"],
        answer: "push()"
    },
    {
        question: "Manakah yang BUKAN merupakan tipe data primitif di JavaScript?",
        options: ["String", "Number", "Object", "Boolean"],
        answer: "Object"
    },
    {
        question: "Apa fungsi dari `localStorage.setItem()`?",
        options: ["Menghapus data", "Mengambil data", "Menyimpan data", "Membuat database baru"],
        answer: "Menyimpan data"
    },
    {
        question: "Simbol apa yang digunakan untuk selektor ID di CSS?",
        options: [".", "#", "*", "&"],
        answer: "#"
    }
];

// State Aplikasi
let currentQuestionIndex = 0;
let score = 0;
let timerInterval;
const TIME_LIMIT = 15; // Timer per soal (Bonus)
let timeLeft = TIME_LIMIT;

const appContainer = document.getElementById('app');

// Inisialisasi Aplikasi
function initApp() {
    currentQuestionIndex = 0;
    score = 0;
    renderQuestion();
}

// 2 & 6. Render Soal dengan createElement/textContent (SPA Pattern)
function renderQuestion() {
    appContainer.innerHTML = ''; // Bersihkan container tanpa reload halaman
    clearInterval(timerInterval);
    timeLeft = TIME_LIMIT;

    const currentQ = questions[currentQuestionIndex];

    // Header (Progress & Timer)
    const header = document.createElement('div');
    header.className = 'header';
    
    const progressText = document.createElement('span');
    progressText.textContent = `Soal ${currentQuestionIndex + 1} / ${questions.length}`;
    
    const timerText = document.createElement('span');
    timerText.className = 'timer';
    timerText.textContent = `⏳ ${timeLeft}s`;

    header.append(progressText, timerText);

    // Progress Bar Visual (Bonus)
    const progressContainer = document.createElement('div');
    progressContainer.className = 'progress-container';
    const progressBar = document.createElement('div');
    progressBar.className = 'progress-bar';
    progressBar.style.width = `${((currentQuestionIndex) / questions.length) * 100}%`;
    progressContainer.appendChild(progressBar);

    // Pertanyaan
    const questionEl = document.createElement('h2');
    questionEl.className = 'question-text';
    questionEl.textContent = currentQ.question; // Menggunakan textContent (XSS Safe)[cite: 1]

    // Container Opsi Jawaban
    const optionsContainer = document.createElement('div');
    optionsContainer.className = 'options-container';

    currentQ.options.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.textContent = opt;
        btn.dataset.value = opt; // Simpan nilai untuk dicocokkan
        optionsContainer.appendChild(btn);
    });

    // Susun Elemen
    appContainer.append(header, progressContainer, questionEl, optionsContainer);

    startTimer(timerText, optionsContainer);
}

// Timer Logic
function startTimer(timerElement, optionsContainer) {
    timerInterval = setInterval(() => {
        timeLeft--;
        timerElement.textContent = `⏳ ${timeLeft}s`;
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            handleTimeOut(optionsContainer);
        }
    }, 1000);
}

function handleTimeOut(optionsContainer) {
    const buttons = optionsContainer.querySelectorAll('.option-btn');
    buttons.forEach(btn => btn.disabled = true);
    setTimeout(() => nextQuestion(), 1500);
}

// 3 & 7. Event Delegation & Feedback Visual[cite: 1]
appContainer.addEventListener('click', (e) => {
    // Mengecek apakah yang diklik adalah tombol opsi (Event Delegation)[cite: 1]
    if (e.target.classList.contains('option-btn')) {
        clearInterval(timerInterval);
        
        const selectedBtn = e.target;
        const selectedAnswer = selectedBtn.dataset.value;
        const correctAnswer = questions[currentQuestionIndex].answer;
        
        const allButtons = document.querySelectorAll('.option-btn');
        
        // Disable semua tombol agar tidak bisa klik 2 kali
        allButtons.forEach(btn => btn.disabled = true);

        // Feedback Visual (benar = hijau, salah = merah)[cite: 1]
        if (selectedAnswer === correctAnswer) {
            selectedBtn.classList.add('correct');
            score += 20; // 5 soal * 20 = 100 max
        } else {
            selectedBtn.classList.add('wrong');
            // Tunjukkan jawaban yang benar
            allButtons.forEach(btn => {
                if (btn.dataset.value === correctAnswer) {
                    btn.classList.add('correct');
                }
            });
        }

        // Lanjut ke soal berikutnya setelah 1.5 detik
        setTimeout(() => nextQuestion(), 1500);
    }

    // 8. Event Listener untuk Tombol Restart[cite: 1]
    if (e.target.id === 'restart-btn') {
        initApp();
    }
});

function nextQuestion() {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        renderQuestion();
    } else {
        renderScore();
    }
}

// 4 & 5. Skor Otomatis & High Score di LocalStorage[cite: 1]
function renderScore() {
    appContainer.innerHTML = ''; // SPA Pattern[cite: 1]
    
    // Ambil dan Set High Score di LocalStorage[cite: 1]
    const highScore = localStorage.getItem('quizHighScore') || 0;
    if (score > highScore) {
        localStorage.setItem('quizHighScore', score);
    }
    const updatedHighScore = localStorage.getItem('quizHighScore');

    const scoreScreen = document.createElement('div');
    scoreScreen.className = 'score-screen';

    const title = document.createElement('h2');
    title.textContent = 'Kuis Selesai! 🎉';

    const scoreText = document.createElement('p');
    scoreText.style.fontSize = '1.2rem';
    scoreText.style.margin = '20px 0';
    scoreText.innerHTML = `Skor Kamu: <strong>${score}</strong><br>High Score: <strong>${updatedHighScore}</strong>`;

    const restartBtn = document.createElement('button');
    restartBtn.id = 'restart-btn';
    restartBtn.className = 'btn-primary';
    restartBtn.textContent = 'Ulangi Kuis'; // Tombol restart untuk mengulang[cite: 1]

    scoreScreen.append(title, scoreText, restartBtn);
    appContainer.appendChild(scoreScreen);
}

// Mulai aplikasi pertama kali
initApp();


function nextQuestion() {
    // Tambahkan efek fade out sebentar sebelum ganti soal
    appContainer.style.animation = 'none';
    appContainer.offsetHeight; /* Trigger reflow */
    appContainer.style.animation = 'slideUpFade 0.5s ease';
    
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        renderQuestion();
    } else {
        renderScore();
    }
}

// 4 & 5. Skor Otomatis & High Score di LocalStorage
function renderScore() {
    appContainer.innerHTML = ''; 
    
    const highScore = localStorage.getItem('quizHighScore') || 0;
    if (score > highScore) {
        localStorage.setItem('quizHighScore', score);
    }
    const updatedHighScore = localStorage.getItem('quizHighScore');

    const scoreScreen = document.createElement('div');
    scoreScreen.className = 'score-screen';

    const title = document.createElement('h2');
    // Cek jika nilai sempurna beri ucapan berbeda
    title.textContent = score === 100 ? 'Sempurna! 🏆' : 'Kuis Selesai! 🎉';

    const scoreText = document.createElement('p');
    scoreText.style.fontSize = '1.3rem';
    scoreText.style.margin = '25px 0';
    scoreText.style.lineHeight = '1.8';
    scoreText.innerHTML = `
        <span style="color: #94a3b8">Skor Kamu</span><br>
        <span style="font-size: 3rem; font-weight: 800; color: #fff;">${score}</span><br>
        <span style="color: #94a3b8; font-size: 0.9rem;">High Score: ${updatedHighScore}</span>
    `;

    const restartBtn = document.createElement('button');
    restartBtn.id = 'restart-btn';
    restartBtn.className = 'btn-primary';
    restartBtn.textContent = 'Mainkan Lagi'; 

    scoreScreen.append(title, scoreText, restartBtn);
    appContainer.appendChild(scoreScreen);
}
