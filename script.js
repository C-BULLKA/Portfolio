document.addEventListener("DOMContentLoaded", function () {
    let allPosts = [];
    let currentEditingPostId = null;

    const notes = document.querySelectorAll(".note");

    // Funkcja do sprawdzania widoczności notatek (wspólna dla obu podstron)
    const checkVisibility = () => {
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

    // Logika dla strony blogowej (blog.html)
    if (document.getElementById('blog-posts-container')) {
        // Pobieranie wpisów z API
        const fetchBlogPosts = async () => {
            try {
                const response = await fetch('https://jsonplaceholder.typicode.com/posts');
                if (!response.ok) throw new Error(`Błąd HTTP! Status: ${response.status}`);
                allPosts = await response.json();
                renderBlogPosts();
            } catch (error) {
                console.error('Błąd pobierania wpisów:', error);
            }
        };

        // Wyświetlanie wpisów
        const displayBlogPosts = (posts) => {
            const container = document.getElementById('blog-posts-container');
            container.innerHTML = '';
            const isDesktop = window.innerWidth > 768;

            if (isDesktop) {
                // Tabela dla desktopów
                const table = document.createElement('table');
                table.innerHTML = `
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Tytuł</th>
                            <th>Treść</th>
                            <th>Akcje</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${posts.map(post => `
                            <tr>
                                <td>${post.id}</td>
                                <td>${post.title}</td>
                                <td>${post.body}</td>
                                <td>
                                    <button class="edit" onclick="editPost(${post.id})">Edytuj</button>
                                    <button class="delete" onclick="deletePost(${post.id})">Usuń</button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                `;
                container.appendChild(table);
            } else {
                // Karty dla urządzeń mobilnych
                posts.forEach(post => {
                    const postElement = document.createElement('div');
                    postElement.classList.add('note', 'blog-post');
                    postElement.innerHTML = `
                        <h3>${post.title}</h3>
                        <p>${post.body}</p>
                        <button class="edit" onclick="editPost(${post.id})">Edytuj</button>
                        <button class="delete" onclick="deletePost(${post.id})">Usuń</button>
                    `;
                    container.appendChild(postElement);
                });
            }
            checkVisibility();
        };

        // Sortowanie
        const sortPosts = (posts, sortValue) => {
            const [key, order] = sortValue.split('-');
            return [...posts].sort((a, b) => {
                if (key === 'title') {
                    return order === 'asc' ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title);
                } else {
                    return order === 'asc' ? a.id - b.id : b.id - a.id;
                }
            });
        };

        // Renderowanie z filtrowaniem i sortowaniem
        const renderBlogPosts = () => {
            const filterValue = document.getElementById('filter').value.toLowerCase();
            const sortValue = document.getElementById('sort').value;
            let posts = allPosts;
            if (filterValue) {
                posts = posts.filter(post =>
                    post.title.toLowerCase().includes(filterValue) ||
                    post.body.toLowerCase().includes(filterValue)
                );
            }
            posts = sortPosts(posts, sortValue);
            displayBlogPosts(posts);
        };

        // Dodawanie i edytowanie wpisu
        document.getElementById('add-post-btn').addEventListener('click', () => {
            document.querySelector('#add-post-form h3').textContent = 'Dodaj nowy wpis';
            document.getElementById('title').value = '';
            document.getElementById('body').value = '';
            currentEditingPostId = null;
            document.getElementById('add-post-form').style.display = 'block';
        });

        document.getElementById('cancel-add').addEventListener('click', () => {
            document.getElementById('add-post-form').style.display = 'none';
        });

        document.querySelector('#add-post-form form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const title = document.getElementById('title').value;
            const body = document.getElementById('body').value;
            try {
                if (currentEditingPostId) {
                    const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${currentEditingPostId}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ id: currentEditingPostId, title, body, userId: 1 })
                    });
                    if (!response.ok) throw new Error(`Błąd HTTP! Status: ${response.status}`);
                    const updatedPost = await response.json();
                    const index = allPosts.findIndex(p => p.id === currentEditingPostId);
                    if (index !== -1) allPosts[index] = updatedPost;
                } else {
                    const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ title, body, userId: 1 })
                    });
                    if (!response.ok) throw new Error(`Błąd HTTP! Status: ${response.status}`);
                    const newPost = await response.json();
                    allPosts.push(newPost);
                }
                renderBlogPosts();
                document.getElementById('add-post-form').style.display = 'none';
                document.getElementById('title').value = '';
                document.getElementById('body').value = '';
                currentEditingPostId = null;
            } catch (error) {
                console.error('Błąd zapisu wpisu:', error);
            }
        });

        // Edycja wpisu
        window.editPost = (postId) => {
            const post = allPosts.find(p => p.id === postId);
            if (post) {
                document.getElementById('title').value = post.title;
                document.getElementById('body').value = post.body;
                currentEditingPostId = postId;
                document.querySelector('#add-post-form h3').textContent = 'Edytuj wpis';
                document.getElementById('add-post-form').style.display = 'block';
            }
        };

        // Usuwanie wpisu
        window.deletePost = async (postId) => {
            if (confirm('Czy na pewno chcesz usunąć ten wpis?')) {
                try {
                    const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${postId}`, {
                        method: 'DELETE'
                    });
                    if (!response.ok) throw new Error(`Błąd HTTP! Status: ${response.status}`);
                    allPosts = allPosts.filter(p => p.id !== postId);
                    renderBlogPosts();
                } catch (error) {
                    console.error('Błąd usuwania wpisu:', error);
                }
            }
        };

        // Event listeners dla sortowania i filtrowania
        document.getElementById('sort').addEventListener('change', renderBlogPosts);
        document.getElementById('filter').addEventListener('input', renderBlogPosts);

        // Początkowe załadowanie wpisów
        fetchBlogPosts();

        // Aktualizacja przy zmianie rozmiaru okna
        window.addEventListener('resize', renderBlogPosts);
    }

    // Logika dla strony nowości (news.html)
    if (document.getElementById('news-container')) {
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
    }
});