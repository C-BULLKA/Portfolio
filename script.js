document.addEventListener("DOMContentLoaded", function () {
    const notes = document.querySelectorAll(".note");

    const checkVisibility = () => {
        notes.forEach((note, index) => {
            const rect = note.getBoundingClientRect();
            const isVisible = rect.top < window.innerHeight * 0.8 && rect.bottom >= 0;

            if (isVisible) {
                setTimeout(() => {
                    note.classList.add("visible");
                }, index * 200);
            } else {
                note.classList.remove("visible");
            }
        });
    };

    let lastScrollY = window.scrollY;

    document.addEventListener("scroll", () => {
        lastScrollY = window.scrollY;
        checkVisibility();
    });
    checkVisibility();

    // Funkcja do pobierania danych o premierach gier z backendu
    const fetchGameReleases = async () => {
        try {
            // Zmieniamy URL na adres naszego serwera backendowego
            const response = await fetch('http://localhost:3000/api/game-releases');
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            displayGameReleases(data);
        } catch (error) {
            console.error('Error fetching game releases:', error);
            const newsContainer = document.getElementById('news-container');
            newsContainer.innerHTML += `<p>Nie udało się załadować informacji o premierach gier. ${error.message}</p>`;
        }
    };

    // Funkcja do wyświetlania informacji o premierach gier
    const displayGameReleases = (data) => {
        const newsContainer = document.getElementById('news-container');
        data.forEach(release => {
            const releaseDate = new Date(release.date * 1000);
            const releaseDateString = releaseDate.toLocaleDateString('pl-PL');
            const gameInfo = `
                <div class="game-release note">
                    <h3>${release.game.name}</h3>
                    <p>${releaseDateString}</p>
                    <div class="countdown" data-date="${releaseDate}">
                        <div class="time days"><span class="number">0</span><span class="label">DNI</span></div>
                        <div class="time hours"><span class="number">0</span><span class="label">GODZIN</span></div>
                        <div class="time minutes"><span class="number">0</span><span class="label">MINUT</span></div>
                    </div>
                </div>
            `;
            newsContainer.innerHTML += gameInfo;
        });
        initializeCountdowns();
        checkVisibility();
    };

    // Funkcja do inicjalizacji liczników czasu
    const initializeCountdowns = () => {
        const countdowns = document.querySelectorAll('.countdown');
        countdowns.forEach(countdown => {
            const targetDate = new Date(countdown.getAttribute('data-date'));
            updateCountdown(countdown, targetDate);
            setInterval(() => updateCountdown(countdown, targetDate), 60000);
        });
    };

    // Funkcja do aktualizacji licznika czasu
    const updateCountdown = (countdown, targetDate) => {
        const now = new Date();
        const timeDifference = targetDate - now;
        if (timeDifference <= 0) {
            countdown.innerHTML = '<div class="time"><span class="number">0</span><span class="label">WYDANO</span></div>';
            return;
        }
        const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
        countdown.querySelector('.days .number').textContent = days;
        countdown.querySelector('.hours .number').textContent = hours;
        countdown.querySelector('.minutes .number').textContent = minutes;
    };

    // Wywołanie funkcji pobierającej dane o premierach gier
    fetchGameReleases();
});
