// Reszta kodu w DOMContentLoaded
document.addEventListener("DOMContentLoaded", function () {
    // Logika dla menu hamburger
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
    }

    let allPosts = [];
    let currentEditingPostId = null;
    let allNews = [];
    let currentPage = 1;
    let itemsPerPage = 5;

    const notes = document.querySelectorAll(".note");

    // Funkcja do sprawdzania widoczności notatek
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

    // Logika dla "Tańca Cząsteczek" (lab.html) z Canvas API
    if (document.getElementById('particle-canvas')) {
        const canvas = document.getElementById('particle-canvas');
        const ctx = canvas.getContext('2d');
        let particles = [];
        let simulationSpeed = 1;

        function resizeCanvas() {
            const container = canvas.parentElement;
            canvas.width = container.clientWidth;
            canvas.height = Math.min(container.clientWidth * 0.5, 300);
            initParticles();
        }

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.vx = Math.random() * 2 - 1;
                this.vy = Math.random() * 2 - 1;
                this.color = '#d4a017';
                this.radius = 5;
                this.cornerHits = 0;
            }

            update() {
                this.x += this.vx * simulationSpeed;
                this.y += this.vy * simulationSpeed;

                if (this.x < this.radius || this.x > canvas.width - this.radius) {
                    this.vx *= -1;
                    this.changeColor();
                }
                if (this.y < this.radius || this.y > canvas.height - this.radius) {
                    this.vy *= -1;
                    this.changeColor();
                }

                if (
                    (this.x <= this.radius && this.y <= this.radius) ||
                    (this.x >= canvas.width - this.radius && this.y <= this.radius) ||
                    (this.x <= this.radius && this.y >= canvas.height - this.radius) ||
                    (this.x >= canvas.width - this.radius && this.y >= canvas.height - this.radius)
                ) {
                    this.cornerHits++;
                    if (this.cornerHits < 3) {
                        this.radius = Math.max(1, this.radius - 1);
                    }
                }
            }

            changeColor() {
                const r = Math.floor(Math.random() * 256);
                const g = Math.floor(Math.random() * 256);
                const b = Math.floor(Math.random() * 256);
                this.color = `rgb(${r}, ${g}, ${b})`;
            }

            show() {
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fill();
            }

            shouldRemove() {
                return this.cornerHits >= 3;
            }

            applyShockwave(centerX, centerY) {
                const dx = this.x - centerX;
                const dy = this.y - centerY;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const maxDistance = Math.sqrt(canvas.width * canvas.width + canvas.height * canvas.height) / 2;
                const force = (1 - distance / maxDistance) * 5;

                if (distance > 0) {
                    this.vx += (dx / distance) * force;
                    this.vy += (dy / distance) * force;
                }
            }
        }

        function initParticles() {
            particles = [];
            for (let i = 0; i < 50; i++) {
                particles.push(new Particle());
            }
        }

        function animateParticles() {
            ctx.fillStyle = '#f5f0dc';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            for (let i = particles.length - 1; i >= 0; i--) {
                const particle = particles[i];
                particle.update();
                particle.show();

                if (particle.shouldRemove()) {
                    particles.splice(i, 1);
                }
            }

            requestAnimationFrame(animateParticles);
        }

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
        initParticles();
        animateParticles();

        document.getElementById('reset-particles').addEventListener('click', () => {
            initParticles();
        });

        document.getElementById('shockwave-button')?.addEventListener('click', () => {
            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;
            particles.forEach(particle => particle.applyShockwave(centerX, centerY));
        });
    }

    // Logika dla strony blogowej (blog.html) - bez zmian
    if (document.getElementById('blog-posts-container')) {
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

        const displayBlogPosts = (posts) => {
            const container = document.getElementById('blog-posts-container');
            container.innerHTML = '';
            const isDesktop = window.innerWidth > 768;

            if (isDesktop) {
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

        document.getElementById('sort').addEventListener('change', renderBlogPosts);
        document.getElementById('filter').addEventListener('input', renderBlogPosts);

        fetchBlogPosts();
        window.addEventListener('resize', renderBlogPosts);
    }

    // Logika dla strony nowości (news.html) - bez zmian
    if (document.getElementById('news-container')) {
        const newsContainer = document.getElementById('news-container');
        const loadingSpinner = document.getElementById('loading-spinner');
        console.log('newsContainer:', newsContainer);

        let allNews = [];
        let currentPage = 1;
        let itemsPerPage = 5;

        const fetchLatestNews = async () => {
            try {
                if (loadingSpinner) loadingSpinner.classList.remove('hidden');
                const url = 'https://corsproxy.io/?' + encodeURIComponent('https://www.mmobomb.com/api1/latestnews');
                const response = await fetch(url, {
                    method: 'GET',
                    headers: { 'Accept': 'application/json' }
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const data = await response.json();
                console.log('Fetched data:', data);
                allNews = data;
                console.log('Parsed news data:', allNews);
                renderNewsPage();
            } catch (error) {
                console.error('Error fetching latest news:', error);
                newsContainer.innerHTML = `<p>Nie udało się załadować informacji o nowościach: ${error.message}. Spróbuj ponownie później.</p>`;
            } finally {
                if (loadingSpinner) loadingSpinner.classList.add('hidden');
            }
        };

        const displayNews = (data) => {
            newsContainer.innerHTML = '';
            if (!data || data.length === 0) {
                newsContainer.innerHTML = '<p>Brak nowości do wyświetlenia.</p>';
                return;
            }
            data.forEach(news => {
                console.log('News item:', news);
                const newsItem = `
                    <div class="news-item note">
                        <h3>${news.title}</h3>
                        <p>${news.short_description}</p>
                        <a href="${news.article_url}" target="_blank">Read more</a>
                    </div>
                `;
                newsContainer.innerHTML += newsItem;
            });
            checkVisibility();
        };

        const renderNewsPage = () => {
            const startIndex = (currentPage - 1) * itemsPerPage;
            const endIndex = startIndex + itemsPerPage;
            const paginatedNews = allNews.slice(startIndex, endIndex);
            displayNews(paginatedNews);
            updatePaginationControls();
        };

        const updatePaginationControls = () => {
            const totalPages = Math.ceil(allNews.length / itemsPerPage);
            const paginationContainer = document.getElementById('pagination');
            paginationContainer.innerHTML = '';

            const itemsPerPageSelect = document.createElement('select');
            itemsPerPageSelect.id = 'items-per-page';
            [5, 10, 15, 20].forEach(num => {
                const option = document.createElement('option');
                option.value = num;
                option.textContent = `${num} na stronę`;
                if (num === itemsPerPage) option.selected = true;
                itemsPerPageSelect.appendChild(option);
            });
            itemsPerPageSelect.addEventListener('change', (e) => {
                itemsPerPage = parseInt(e.target.value);
                currentPage = 1;
                renderNewsPage();
            });
            paginationContainer.appendChild(itemsPerPageSelect);

            const prevButton = document.createElement('button');
            prevButton.textContent = 'Poprzednia';
            prevButton.disabled = currentPage === 1;
            prevButton.addEventListener('click', () => {
                if (currentPage > 1) {
                    currentPage--;
                    renderNewsPage();
                }
            });
            paginationContainer.appendChild(prevButton);

            const pageInfo = document.createElement('span');
            pageInfo.textContent = ` Strona ${currentPage} z ${totalPages} `;
            paginationContainer.appendChild(pageInfo);

            const nextButton = document.createElement('button');
            nextButton.textContent = 'Następna';
            nextButton.disabled = currentPage === totalPages;
            nextButton.addEventListener('click', () => {
                if (currentPage < totalPages) {
                    currentPage++;
                    renderNewsPage();
                }
            });
            paginationContainer.appendChild(nextButton);
        };

        fetchLatestNews();
    }

    // Logika dla Kącika Twórcy Gier (ktg.html) z Canvas API
    if (document.getElementById('vehicle-sim')) {
        const canvas = document.getElementById('vehicle-sim');
        const ctx = canvas.getContext('2d');
        let x = 0;
        const baseSpeed = 2; // Bazowa prędkość (stała)
        let simulationSpeed = 1; // Mnożnik prędkości symulacji

        // Funkcja ustawiająca rozmiar canvasu
        function resizeCanvas() {
            const container = canvas.parentElement;
            canvas.width = container.clientWidth;
            canvas.height = Math.min(container.clientWidth * 0.5, 200);
        }

        function drawVehicle() {
            ctx.fillStyle = '#f9f4e8';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#d4a017';
            ctx.fillRect(x, canvas.height / 2 - 15, 50, 30);
            x += baseSpeed * simulationSpeed;
            if (x > canvas.width) x = -50;
            requestAnimationFrame(drawVehicle);
        }

        // Ustawienie początkowego rozmiaru i nasłuchiwanie zmian
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
        drawVehicle();

        // Reset pozycji i prędkości
        document.getElementById('reset-sim').addEventListener('click', () => {
            x = 0; // Reset pozycji do początkowej
            simulationSpeed = 1; // Reset mnożnika prędkości do domyślnej wartości
            console.log('Reset: Position =', x, 'Speed =', simulationSpeed); // Debug
        });

        // Przyspieszenie symulacji
        document.getElementById('speed-up')?.addEventListener('click', () => {
            simulationSpeed = Math.min(simulationSpeed + 0.5, 3); // Max 3x
            console.log('Simulation Speed Increased:', simulationSpeed); // Debug
        });

        // Zwolnienie symulacji
        document.getElementById('slow-down')?.addEventListener('click', () => {
            simulationSpeed = Math.max(simulationSpeed - 0.5, 0.1); // Min 0.1x
            console.log('Simulation Speed Decreased:', simulationSpeed); // Debug
        });
    }

    // Generator pomysłów na gry - bez zmian
    if (document.getElementById('generate-idea')) {
        const gameIdeas = [
            "Gra wyścigowa w kosmosie z grawitacją planet",
            "RPG w świecie fantasy z dynamiczną pogodą",
            "Symulator projektowania poziomów w grach",
            "Platformówka z mechaniką zmiany czasu",
            "Strzelanka z proceduralnie generowanymi broniami",
            "Symulator przetrwania na opuszczonej stacji kosmicznej z zagadkami logicznymi",
            "Gra strategiczna o budowie imperium w świecie steampunkowym",
            "Przygodówka point-and-click w realiach cyberpunkowego miasta przyszłości",
            "Symulator wyścigów dronów z personalizacją maszyn",
            "Gra logiczna o manipulacji czasem w celu rozwiązania łamigłówek przestrzennych",
            "RPG w świecie mitologii nordyckiej z dynamicznymi wyborami moralnymi",
            "Symulator rolnictwa na obcej planecie z unikalnymi roślinami i stworzeniami",
            "Gra akcji o walce z gigantycznymi maszynami w postapokaliptycznym świecie",
            "Platformówka 2D z mechaniką zmiany grawitacji",
            "Symulator hakera próbującego złamać zabezpieczenia globalnej korporacji",
            "Gra muzyczna, w której rytm steruje akcjami bohatera w walce",
            "Strategia czasu rzeczywistego o kolonizacji dna oceanu",
            "Przygodowa gra eksploracyjna w świecie snów z surrealistycznymi krajobrazami",
            "Symulator projektanta mody w świecie fantasy z magią tkanin",
            "Gra survivalowa o przetrwaniu w dżungli pełnej prehistorycznych stworzeń",
            "Taktyczna gra turowa o dowodzeniu oddziałem rebeliantów w dystopii",
            "Symulator lotów balonem z misjami ratunkowymi w górach",
            "Gra logiczna o budowie maszyn Rube Goldberga do rozwiązywania problemów",
            "RPG w realiach średniowiecza z mechaniką handlu i dyplomacji",
            "Strzelanka kooperacyjna w kosmosie z losowo generowanymi planetami",
            "Gra edukacyjna o programowaniu robotów w fabryce przyszłości",
            "Symulator życia smoka w świecie fantasy z ewolucją umiejętności",
            "Platformówka z mechaniką malowania świata, które zmienia otoczenie",
            "Gra detektywistyczna w wiktoriańskim Londynie z nadprzyrodzonymi elementami",
            "Symulator wyścigów na hoverboardach w futurystycznym mieście",
            "Strategia ekonomiczna o zarządzaniu miastem unoszącym się na chmurach",
            "Gra akcji o ninja przemierzającym proceduralnie generowane poziomy",
            "Symulator eksploracji jaskiń z zagadkami fizycznymi i skarbami",
            "RPG w świecie, gdzie magia opiera się na matematyce i równaniach",
            "Gra multiplayer o budowie i obronie zamków w realiach średniowiecza"
        ];

        const generateIdea = () => {
            const idea = gameIdeas[Math.floor(Math.random() * gameIdeas.length)];
            document.getElementById('game-idea').textContent = idea;
        };

        document.getElementById('generate-idea').addEventListener('click', generateIdea);
        generateIdea();
    }

    // Logika dla strony projektów (projects.html) - bez zmian
    const fetchProjects = async () => {
        try {
            const response = await fetch('https://api.github.com/users/C-BULLKA/repos');
            const repos = await response.json();
            const gallery = document.getElementById('project-gallery');
            gallery.innerHTML = '';
            repos.slice(0, 3).forEach(repo => {
                const card = document.createElement('div');
                card.classList.add('project-card');
                card.innerHTML = `
                    <h3>Projekt: ${repo.name}</h3>
                    <p>${repo.description || 'Brak opisu'}</p>
                    <a href="${repo.html_url}" target="_blank">Zobacz na GitHub</a>
                `;
                gallery.appendChild(card);
            });
        } catch (error) {
            console.error('Błąd pobierania projektów:', error);
        }
    };

    if (document.getElementById('project-gallery')) fetchProjects();
});