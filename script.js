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

    let isScrollingDown = true;
    let lastScrollY = window.scrollY;

    document.addEventListener("scroll", () => {
        const currentScrollY = window.scrollY;

        if (currentScrollY > lastScrollY) {
            isScrollingDown = true;
        } else {
            isScrollingDown = false;
        }

        lastScrollY = currentScrollY;

        checkVisibility();
    });
    checkVisibility();

    // Fetch upcoming game releases from IGDB
    const clientId = 'okxajnuv4m071nlh5n5hbhd8j00737';
    const accessToken = 'okxajnuv4m071nlh5n5hbhd8j00737';

    fetch('https://api.igdb.com/v4/release_dates', {
        method: 'POST',
        headers: {
            'Client-ID': clientId,
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        },
        body: `fields game.name, date, platform.name; where date > ${Math.floor(Date.now() / 1000)}; sort date asc; limit 10;`
    })
    .then(response => response.json())
    .then(data => {
        const newsContainer = document.getElementById('news-container');
        data.forEach(release => {
            const releaseDate = new Date(release.date * 1000).toLocaleDateString('pl-PL');
            const gameInfo = `
                <div class="game-release note">
                    <h3>${release.game.name}</h3>
                    <p>Platforma: ${release.platform.name}</p>
                    <p>Data premiery: ${releaseDate}</p>
                </div>
            `;
            newsContainer.innerHTML += gameInfo;
        });
        checkVisibility();
    })
    .catch(error => {
        console.error('Error fetching game releases:', error);
        const newsContainer = document.getElementById('news-container');
        newsContainer.innerHTML += '<p>Nie udało się załadować informacji o premierach gier.</p>';
    });
});

const checkVisibility = () => {
    const notes = document.querySelectorAll(".note");
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