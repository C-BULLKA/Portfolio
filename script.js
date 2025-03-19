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


    const newsContainer = document.getElementById('news-container');

    // Function to fetch the latest MMO news
    const fetchLatestNews = async () => {
        try {
            const response = await fetch('https://www.mmobomb.com/api1/latestnews');
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            displayNews(data);
        } catch (error) {
            console.error('Error fetching latest news:', error);
            newsContainer.innerHTML += `<p>Nie udało się załadować informacji o nowościach. ${error.message}</p>`;
        }
    };

    // Function to display the news
    const displayNews = (data) => {
        data.forEach(news => {
            const newsItem = `
                <div class="news-item note">
                    <h3>${news.title}</h3>
                    <p>${news.description}</p>
                    <a href="${news.url}" target="_blank">Read more</a>
                </div>
            `;
            newsContainer.innerHTML += newsItem;
        });
    };

    // Fetch the latest news when the page loads
    fetchLatestNews();
});
