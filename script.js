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
    checkVisibility(); // Initial check

    // Logika dla "Tańca Cząsteczek" (lab.html) z Canvas API
    if (document.getElementById('particle-canvas')) {
        const canvas = document.getElementById('particle-canvas');
        const ctx = canvas.getContext('2d');
        let particles = [];
        let simulationSpeed = 1;

        function resizeCanvas() {
            const container = canvas.parentElement;
            if (container) {
                canvas.width = container.clientWidth;
                canvas.height = Math.min(container.clientWidth * 0.5, 300);
            }
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

                const hitLeft = this.x <= this.radius;
                const hitRight = this.x >= canvas.width - this.radius;
                const hitTop = this.y <= this.radius;
                const hitBottom = this.y >= canvas.height - this.radius;

                if ((hitLeft && hitTop) || (hitRight && hitTop) || (hitLeft && hitBottom) || (hitRight && hitBottom)) {
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
                
                if (distance === 0) return; 

                const forceMagnitude = (1 - Math.min(distance, maxDistance) / maxDistance) * 5; 

                if (forceMagnitude > 0) {
                    this.vx += (dx / distance) * forceMagnitude;
                    this.vy += (dy / distance) * forceMagnitude;
                }
            }
        }

        function initParticles() {
            particles = [];
            const numParticles = Math.floor(canvas.width * canvas.height / 5000); 
            for (let i = 0; i < Math.max(30, numParticles) ; i++) { 
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
        window.addEventListener('resize', () => {
            resizeCanvas();
            initParticles(); 
        });
        initParticles(); 
        animateParticles();

        const resetParticlesButton = document.getElementById('reset-particles');
        if (resetParticlesButton) {
            resetParticlesButton.addEventListener('click', () => {
                initParticles();
            });
        }


        const shockwaveButton = document.getElementById('shockwave-button');
        if (shockwaveButton) {
            shockwaveButton.addEventListener('click', () => {
                const centerX = canvas.width / 2;
                const centerY = canvas.height / 2;
                particles.forEach(particle => particle.applyShockwave(centerX, centerY));
            });
        }
    }

    // Logika dla strony blogowej (blog.html)
    if (document.getElementById('blog-posts-container')) {
        const blogPostsContainer = document.getElementById('blog-posts-container');
        
        const fetchBlogPosts = async () => {
            try {
                const response = await fetch('https://jsonplaceholder.typicode.com/posts');
                if (!response.ok) throw new Error(`Błąd HTTP! Status: ${response.status}`);
                allPosts = await response.json();
                renderBlogPosts();
            } catch (error) {
                console.error('Błąd pobierania wpisów:', error);
                if (blogPostsContainer) {
                    blogPostsContainer.innerHTML = `<p class="error-message">Nie udało się załadować wpisów: ${error.message}</p>`;
                }
            }
        };

        const displayBlogPosts = (postsToDisplay) => {
            if (!blogPostsContainer) return;
            blogPostsContainer.innerHTML = '';
            const isDesktop = window.innerWidth > 768;

            if (postsToDisplay.length === 0) {
                blogPostsContainer.innerHTML = '<p>Brak wpisów do wyświetlenia.</p>';
                return;
            }

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
                        ${postsToDisplay.map(post => `
                            <tr class="note">
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
                blogPostsContainer.appendChild(table);
            } else {
                postsToDisplay.forEach(post => {
                    const postElement = document.createElement('div');
                    postElement.classList.add('note', 'blog-post'); 
                    postElement.innerHTML = `
                        <h3>${post.title}</h3>
                        <p>${post.body}</p>
                        <div class="actions">
                            <button class="edit" onclick="editPost(${post.id})">Edytuj</button>
                            <button class="delete" onclick="deletePost(${post.id})">Usuń</button>
                        </div>
                    `;
                    blogPostsContainer.appendChild(postElement);
                });
            }
            checkVisibility(); 
        };

        const sortPosts = (postsToSort, sortValue) => {
            const [key, order] = sortValue.split('-');
            return [...postsToSort].sort((a, b) => {
                if (key === 'title') {
                    return order === 'asc' ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title);
                } else { 
                    return order === 'asc' ? a.id - b.id : b.id - a.id;
                }
            });
        };

        const renderBlogPosts = () => {
            const filterInput = document.getElementById('filter');
            const sortSelect = document.getElementById('sort');
            if (!filterInput || !sortSelect) return;

            const filterValue = filterInput.value.toLowerCase();
            const sortValue = sortSelect.value;
            let postsToRender = allPosts;

            if (filterValue) {
                postsToRender = postsToRender.filter(post =>
                    post.title.toLowerCase().includes(filterValue) ||
                    post.body.toLowerCase().includes(filterValue)
                );
            }
            postsToRender = sortPosts(postsToRender, sortValue);
            displayBlogPosts(postsToRender);
        };

        const addPostBtn = document.getElementById('add-post-btn');
        const addPostFormDiv = document.getElementById('add-post-form');
        const cancelAddBtn = document.getElementById('cancel-add');
        const postForm = document.querySelector('#add-post-form form');
        const formTitle = document.querySelector('#add-post-form h3');
        const titleInput = document.getElementById('title');
        const bodyInput = document.getElementById('body');


        if (addPostBtn && addPostFormDiv && formTitle && titleInput && bodyInput) {
            addPostBtn.addEventListener('click', () => {
                formTitle.textContent = 'Dodaj nowy wpis';
                titleInput.value = '';
                bodyInput.value = '';
                currentEditingPostId = null;
                addPostFormDiv.style.display = 'block';
            });
        }

        if (cancelAddBtn && addPostFormDiv) {
            cancelAddBtn.addEventListener('click', () => {
                addPostFormDiv.style.display = 'none';
            });
        }

        if (postForm && addPostFormDiv && titleInput && bodyInput) {
            postForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const title = titleInput.value;
                const body = bodyInput.value;
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
                        allPosts.unshift(newPost); 
                    }
                    renderBlogPosts();
                    addPostFormDiv.style.display = 'none';
                    titleInput.value = ''; 
                    bodyInput.value = '';  
                    currentEditingPostId = null;
                } catch (error) {
                    console.error('Błąd zapisu wpisu:', error);
                    alert(`Nie udało się zapisać wpisu: ${error.message}`);
                }
            });
        }

        window.editPost = (postId) => { 
            const post = allPosts.find(p => p.id === postId);
            if (post && titleInput && bodyInput && formTitle && addPostFormDiv) {
                titleInput.value = post.title;
                bodyInput.value = post.body;
                currentEditingPostId = postId;
                formTitle.textContent = 'Edytuj wpis';
                addPostFormDiv.style.display = 'block';
                addPostFormDiv.scrollIntoView({ behavior: 'smooth' });
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
                    alert(`Nie udało się usunąć wpisu: ${error.message}`);
                }
            }
        };
        
        const sortSelectBlog = document.getElementById('sort');
        const filterInputBlog = document.getElementById('filter');

        if (sortSelectBlog) sortSelectBlog.addEventListener('change', renderBlogPosts);
        if (filterInputBlog) filterInputBlog.addEventListener('input', renderBlogPosts);

        fetchBlogPosts();
        window.addEventListener('resize', renderBlogPosts); 
    }

    // Logika dla strony nowości (news.html)
    if (document.getElementById('news-container')) {
        const newsContainer = document.getElementById('news-container');
        const loadingSpinner = document.getElementById('loading-spinner');
        
        let allNewsItems = [];
        let currentNewsPage = 1;
        let newsItemsPerPage = 5;

        const getProxiedUrl = (targetUrl, proxyName = "AllOrigins") => {
            const proxies = {
                "AllOrigins": (url) => `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`,
                "CORSProxy.io": (url) => `https://corsproxy.io/?${encodeURIComponent(url)}`,
                "ThingProxy": (url) => `https://thingproxy.freeboard.io/fetch/${url}` 
            };
            
            const selectedProxyFunction = proxies[proxyName];
            if (!selectedProxyFunction) {
                console.error(`Proxy ${proxyName} not found.`);
                throw new Error(`Proxy ${proxyName} not defined.`);
            }

            console.log(`Using proxy: ${proxyName} for URL: ${targetUrl}`);
            return selectedProxyFunction(targetUrl);
        };
    
        const fetchLatestNews = async () => {
            if (loadingSpinner) loadingSpinner.classList.remove('hidden');
            
            // --- TESTOWANIE ThingProxy z JSONPlaceholder ---
            const dataSourceTest = {
                name: "JSONPlaceholderTest",
                url: "https://jsonplaceholder.typicode.com/todos/1", // Prosty, publiczny JSON
                needsProxy: true, 
                proxyToUse: "ThingProxy", 
                transformData: (data) => {
                    // JSONPlaceholder /todos/1 zwraca obiekt, nie tablicę.
                    // Dla celów testowych opakujemy go w tablicę, aby pasował do logiki wyświetlania.
                    // W prawdziwej aplikacji dostosowalibyśmy wyświetlanie.
                    if (data && typeof data === 'object' && !Array.isArray(data)) {
                        console.log("JSONPlaceholderTest data (single object):", data);
                        // Przekształć, aby pasowało do oczekiwanej struktury news
                        return [{
                            id: data.id,
                            title: data.title,
                            short_description: `Completed: ${data.completed}`,
                            thumbnail: '', // Brak thumbnaila
                            article_url: '' // Brak article_url
                        }];
                    }
                    console.error("JSONPlaceholderTest data is not a single object:", data);
                    return []; 
                }
            };

            const dataSourceFreeToGame = {
                name: "FreeToGame",
                url: "https://www.freetogame.com/api/latestnews", 
                needsProxy: true, 
                proxyToUse: "ThingProxy", 
                transformData: (data) => {
                    if (!Array.isArray(data)) {
                        console.error("FreeToGame data (via ThingProxy) is not an array:", data);
                        return []; 
                    }
                    return data.map(news => ({
                        id: news.id,
                        title: news.title,
                        short_description: news.short_description,
                        thumbnail: news.thumbnail, 
                        article_url: news.article_url 
                    }));
                }
            };

            const dataSourceMMOBomb = {
                name: "MMOBomb",
                url: "https://www.mmobomb.com/api1/latestnews",
                needsProxy: true,
                proxyToUse: "AllOrigins", // Spróbujmy AllOrigins dla MMOBomb, skoro ThingProxy zawiodło z FreeToGame
                transformData: (data) => {
                    if (!Array.isArray(data)) {
                        console.error("MMOBomb data (via AllOrigins) is not an array:", data);
                        return []; 
                    }
                    return data; 
                }
            };
            
            // --- WYBIERZ ŹRÓDŁO DANYCH DO TESTU ---
            let currentDataSource = dataSourceTest; // Testujemy ThingProxy
            // let currentDataSource = dataSourceMMOBomb; // Jeśli dataSourceTest zadziała, spróbuj tego
            // let currentDataSource = dataSourceFreeToGame; // Albo tego


            let fetchUrl = currentDataSource.url;
            if (currentDataSource.needsProxy) {
                try {
                    fetchUrl = getProxiedUrl(currentDataSource.url, currentDataSource.proxyToUse);
                } catch (e) {
                     console.error(e); 
                     if (newsContainer) newsContainer.innerHTML = `<p class="error-message">Błąd konfiguracji proxy: ${e.message}</p>`;
                     if (loadingSpinner) loadingSpinner.classList.add('hidden');
                     return;
                }
            }
            
            console.log(`Attempting to fetch news from: ${fetchUrl} (Source: ${currentDataSource.name} via ${currentDataSource.proxyToUse || 'direct'})`);

            try {
                const response = await fetch(fetchUrl);

                console.log(`${currentDataSource.name} response status:`, response.status);
                console.log(`${currentDataSource.name} response OK:`, response.ok);
                const responseHeaders = {};
                response.headers.forEach((value, name) => { responseHeaders[name] = value; });
                console.log(`${currentDataSource.name} response headers:`, responseHeaders);

                if (!response.ok) {
                    let errorText = "";
                    try {
                        errorText = await response.text();
                        console.error(`${currentDataSource.name} response error text (if !response.ok):`, errorText.substring(0, 500));
                    } catch (textError) {
                        console.error(`Could not read error text from non-ok ${currentDataSource.name} response:`, textError);
                    }
                    if (response.status === 0) { 
                         throw new Error(`Błąd sieciowy podczas próby połączenia z ${currentDataSource.name}.`);
                    }
                    if (response.status === 301 || response.status === 302) {
                        const locationHeader = response.headers.get('location');
                        throw new Error (`${currentDataSource.name} (przez ${currentDataSource.proxyToUse}) zwróciło przekierowanie (${response.status}) na: ${locationHeader || 'nieznany URL'}. To może być problem z proxy lub docelowym API.`);
                    }
                    throw new Error(`Błąd odpowiedzi od ${currentDataSource.name} (przez ${currentDataSource.proxyToUse}): Status ${response.status}. ${errorText.substring(0,150)}`);
                }

                const rawData = await response.text(); 
                console.log(`Raw data from ${currentDataSource.name} (via ${currentDataSource.proxyToUse}):`, rawData.substring(0, 500)); 

                let jsonData;
                try {
                    jsonData = JSON.parse(rawData);
                } catch (parseError) {
                    console.error(`Error parsing raw data from ${currentDataSource.name} as JSON:`, parseError);
                    console.error('Raw data that failed to parse:', rawData.substring(0,1000));
                    throw new Error(`Nie udało się przetworzyć danych JSON otrzymanych z ${currentDataSource.name}. Raw data: ${rawData.substring(0,200)}...`);
                }
                
                console.log(`Parsed JSON data from ${currentDataSource.name} (via ${currentDataSource.proxyToUse}):`, jsonData);
                
                let processedData;
                if (currentDataSource.needsProxy && currentDataSource.proxyToUse === "AllOrigins") {
                    if (jsonData && jsonData.status && jsonData.status.http_code && jsonData.status.http_code !== 200) {
                         let targetErrorContent = jsonData.contents || "Brak dodatkowych informacji o błędzie od API.";
                         throw new Error(`AllOrigins: Błąd z docelowego API (${jsonData.status.url}): Status ${jsonData.status.http_code}. Szczegóły: ${JSON.stringify(targetErrorContent).substring(0,100)}`);
                    }
                    if (jsonData && typeof jsonData.contents === 'string') {
                        try {
                            processedData = JSON.parse(jsonData.contents); 
                        } catch (parseError) {
                            console.error('AllOrigins: Failed to parse jsonData.contents. It might be HTML or invalid JSON.', jsonData.contents.substring(0,500));
                            throw new Error(`AllOrigins: Nie udało się przetworzyć treści z pola "contents". Otrzymano: ${jsonData.contents.substring(0,100)}...`);
                        }
                    } else {
                        throw new Error('AllOrigins: Nieprawidłowa struktura danych, oczekiwano pola "contents" jako string.');
                    }
                } else if (currentDataSource.needsProxy && (currentDataSource.proxyToUse === "ThingProxy" || currentDataSource.proxyToUse === "CORSProxy.io")) {
                    processedData = jsonData;
                } else if (!currentDataSource.needsProxy) {
                     processedData = jsonData;
                } else {
                    throw new Error(`Nieobsługiwana konfiguracja proxy: ${currentDataSource.proxyToUse}`);
                }
                
                allNewsItems = currentDataSource.transformData(processedData);

                if (!Array.isArray(allNewsItems)) {
                    console.error('Dane nowości po przetworzeniu nie są tablicą:', allNewsItems);
                    allNewsItems = []; 
                    throw new Error('Otrzymane i przetworzone dane nowości nie są w oczekiwanym formacie (tablica).');
                }
                console.log('Final transformed news data (allNewsItems):', allNewsItems);
                renderNewsPage();

            } catch (error) { 
                console.error(`General error in fetchLatestNews (Source: ${currentDataSource.name}, Proxy: ${currentDataSource.proxyToUse || 'none'}):`, error);
                if (newsContainer) {
                    newsContainer.innerHTML = `<p class="error-message">Nie udało się załadować informacji o nowościach z ${currentDataSource.name}: ${error.message}.</p>`;
                }
            } finally {
                if (loadingSpinner) loadingSpinner.classList.add('hidden');
            }
        };
    
        const displayNews = (dataToDisplay) => {
            if (!newsContainer) return; 
            newsContainer.innerHTML = '';
            if (!dataToDisplay || dataToDisplay.length === 0) {
                newsContainer.innerHTML = '<p>Brak nowości do wyświetlenia.</p>';
                return;
            }
            dataToDisplay.forEach(news => {
                const newsItemDiv = document.createElement('div');
                newsItemDiv.classList.add('news-item', 'note'); 
                
                const title = news.title || 'Brak tytułu';
                const description = news.short_description || 'Brak opisu.';
                const thumbnail = news.thumbnail ? `<img src="${news.thumbnail}" alt="Miniatura dla ${title}" class="news-thumbnail" loading="lazy">` : '';
                const articleLink = news.article_url ? `<a href="${news.article_url}" target="_blank" rel="noopener noreferrer">Czytaj więcej</a>` : '';


                newsItemDiv.innerHTML = `
                    ${thumbnail}
                    <div class="news-content">
                        <h3>${title}</h3>
                        <p>${description}</p>
                        ${articleLink}
                    </div>
                `;
                newsContainer.appendChild(newsItemDiv);
            });
            if (typeof checkVisibility === 'function') {
                 checkVisibility();
            }
        };
    
        const renderNewsPage = () => {
            if (!Array.isArray(allNewsItems)) { 
                console.error("Cannot render news: 'allNewsItems' is not an array.", allNewsItems);
                if (newsContainer) newsContainer.innerHTML = '<p class="error-message">Wystąpił błąd podczas przetwarzania danych nowości.</p>';
                return;
            }
            const startIndex = (currentNewsPage - 1) * newsItemsPerPage;
            const endIndex = startIndex + newsItemsPerPage;
            const paginatedNews = allNewsItems.slice(startIndex, endIndex);
            displayNews(paginatedNews);
            updatePaginationControls();
        };
    
        const updatePaginationControls = () => {
            const paginationContainer = document.getElementById('pagination');
            if (!paginationContainer) return; 
            if (!Array.isArray(allNewsItems) || allNewsItems.length === 0) { 
                 paginationContainer.innerHTML = ''; 
                 return;
            }

            const totalPages = Math.ceil(allNewsItems.length / newsItemsPerPage);
            paginationContainer.innerHTML = '';
    
            const itemsPerPageSelect = document.createElement('select');
            itemsPerPageSelect.id = 'items-per-page';
            itemsPerPageSelect.setAttribute('aria-label', 'Wybierz liczbę wiadomości na stronę');
            [5, 10, 15, 20].forEach(num => {
                const option = document.createElement('option');
                option.value = num;
                option.textContent = `${num} na stronę`;
                if (num === newsItemsPerPage) option.selected = true;
                itemsPerPageSelect.appendChild(option);
            });
            itemsPerPageSelect.addEventListener('change', (e) => {
                newsItemsPerPage = parseInt(e.target.value);
                currentNewsPage = 1;
                renderNewsPage();
            });
            paginationContainer.appendChild(itemsPerPageSelect);
    
            if (totalPages > 1) { 
                const prevButton = document.createElement('button');
                prevButton.textContent = 'Poprzednia';
                prevButton.disabled = currentNewsPage === 1;
                prevButton.addEventListener('click', () => {
                    if (currentNewsPage > 1) {
                        currentNewsPage--;
                        renderNewsPage();
                        if (newsContainer) newsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                });
                paginationContainer.appendChild(prevButton);
        
                const pageInfo = document.createElement('span');
                pageInfo.textContent = ` Strona ${currentNewsPage} z ${totalPages > 0 ? totalPages : 1} `;
                pageInfo.setAttribute('aria-live', 'polite');
                paginationContainer.appendChild(pageInfo);
        
                const nextButton = document.createElement('button');
                nextButton.textContent = 'Następna';
                nextButton.disabled = currentNewsPage === totalPages || totalPages === 0;
                nextButton.addEventListener('click', () => {
                    if (currentNewsPage < totalPages) {
                        currentNewsPage++;
                        renderNewsPage();
                        if (newsContainer) newsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                });
                paginationContainer.appendChild(nextButton);
            }
        };
    
        fetchLatestNews(); 
    }

    // Logika dla Kącika Twórcy Gier (ktg.html) z Canvas API
    if (document.getElementById('vehicle-sim')) {
        const canvas = document.getElementById('vehicle-sim');
        const ctx = canvas.getContext('2d');
        let x = 0;
        const baseSpeed = 2; 
        let currentSimulationSpeedMultiplier = 1; 

        function resizeVehicleCanvas() {
            const container = canvas.parentElement;
            if (container) {
                canvas.width = container.clientWidth;
                canvas.height = Math.min(container.clientWidth * 0.5, 200); 
            }
        }

        function drawVehicle() {
            ctx.fillStyle = '#f9f4e8'; 
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#d4a017'; 
            ctx.fillRect(x, canvas.height / 2 - 15, 50, 30); 
            x += baseSpeed * currentSimulationSpeedMultiplier;
            if (x > canvas.width) x = -50; 
            requestAnimationFrame(drawVehicle);
        }

        resizeVehicleCanvas();
        window.addEventListener('resize', resizeVehicleCanvas);
        drawVehicle();

        const resetSimButton = document.getElementById('reset-sim');
        if (resetSimButton) {
            resetSimButton.addEventListener('click', () => {
                x = 0;
                currentSimulationSpeedMultiplier = 1;
                console.log('Reset: Position =', x, 'Speed Multiplier =', currentSimulationSpeedMultiplier);
            });
        }

        const speedUpButton = document.getElementById('speed-up');
        if (speedUpButton) {
            speedUpButton.addEventListener('click', () => {
                currentSimulationSpeedMultiplier = Math.min(currentSimulationSpeedMultiplier + 0.5, 3); 
                console.log('Simulation Speed Multiplier Increased:', currentSimulationSpeedMultiplier);
            });
        }
        
        const slowDownButton = document.getElementById('slow-down');
        if (slowDownButton) {
            slowDownButton.addEventListener('click', () => {
                currentSimulationSpeedMultiplier = Math.max(currentSimulationSpeedMultiplier - 0.5, 0.1); 
                console.log('Simulation Speed Multiplier Decreased:', currentSimulationSpeedMultiplier);
            });
        }
    }

    // Generator pomysłów na gry
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

        const gameIdeaElement = document.getElementById('game-idea');
        const generateIdeaButton = document.getElementById('generate-idea');

        const generateIdea = () => {
            if (gameIdeaElement) {
                const idea = gameIdeas[Math.floor(Math.random() * gameIdeas.length)];
                gameIdeaElement.textContent = idea;
            }
        };

        if (generateIdeaButton) {
            generateIdeaButton.addEventListener('click', generateIdea);
        }
        generateIdea(); 
    }

    // Logika dla strony projektów (projects.html)
    const fetchProjects = async () => {
        const gallery = document.getElementById('project-gallery');
        if (!gallery) return;

        try {
            const response = await fetch('https://api.github.com/users/C-BULLKA/repos?sort=updated&per_page=3'); 
            if (!response.ok) {
                throw new Error(`Błąd HTTP! Status: ${response.status}`);
            }
            const repos = await response.json();
            gallery.innerHTML = ''; 

            if (repos.length === 0) {
                gallery.innerHTML = '<p>Brak publicznych projektów na GitHub lub nie udało się ich załadować.</p>';
                return;
            }

            repos.forEach(repo => {
                const card = document.createElement('div');
                card.classList.add('project-card', 'note'); 
                card.innerHTML = `
                    <h3>Projekt: ${repo.name}</h3>
                    <p>${repo.description || 'Brak opisu.'}</p>
                    <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer">Zobacz na GitHub</a>
                `;
                gallery.appendChild(card);
            });
            checkVisibility(); 
        } catch (error) {
            console.error('Błąd pobierania projektów:', error);
            gallery.innerHTML = `<p class="error-message">Nie udało się załadować projektów: ${error.message}</p>`;
        }
    };

    if (document.getElementById('project-gallery')) {
        fetchProjects();
    }
});