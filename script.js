document.addEventListener("DOMContentLoaded", function () {
    const notes = document.querySelectorAll(".note");

    const checkVisibility = () => {
        // Select all elements with class "note" again to include new ones
        const allNotes = document.querySelectorAll(".note");
        allNotes.forEach((note, index) => {
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
    console.log('newsContainer:', newsContainer); // Debug log

    // Function to fetch the latest MMO news
    const fetchLatestNews = async () => {
        try {
            const response = await fetch('https://api.allorigins.win/get?url=' + encodeURIComponent('https://www.mmobomb.com/api1/latestnews'));
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            console.log('Fetched data:', data); // Debug log
            const newsData = JSON.parse(data.contents);
            console.log('Parsed news data:', newsData); // Debug log
            displayNews(newsData);
        } catch (error) {
            console.error('Error fetching latest news:', error);
            newsContainer.innerHTML += `<p>Nie udało się załadować informacji o nowościach. ${error.message}</p>`;
        }
    };

    // Function to display the news
    const displayNews = (data) => {
        if (!data || data.length === 0) {
            newsContainer.innerHTML += '<p>Brak nowości do wyświetlenia.</p>';
            return;
        }
        data.forEach(news => {
            console.log('News item:', news); // Debug log
            const newsItem = `
                <div class="news-item note">
                    <h3>${news.title}</h3>
                    <p>${news.short_description}</p>
                    <a href="${news.article_url}" target="_blank">Read more</a>
                </div>
            `;
            newsContainer.innerHTML += newsItem;
        });
        // Call checkVisibility to trigger animation on newly inserted items
        checkVisibility();
    };

    // Fetch the latest news when the page loads
    fetchLatestNews();
});
