Wstęp 

Strona “Kącik Twórcy Gier” to serwis opierający się na nowinkach ze świata gier mmo, oraz informacjach przydatnych dla osoby która chciałaby rozpocząć swoją przygodę z tworzeniem gier. Znajdują się tu informacje o moich pracach, takich jak symulacje, generator pomysłów dla gier czy interaktywne aplikacje, zbudowane z użyciem HTML, CSS, JavaScript i zewnętrznych API. 
 
 
 
Opis Struktury Serwisu 

Serwis składa się z sześciu głównych stron, z których każda pełni określoną funkcję. Wszystkie strony mają wspólną nawigację w postaci stałego nagłówka z menu (z opcją menu hamburgerowego na urządzeniach mobilnych) oraz stopkę z informacją o prawach autorskich ("© 2025 Kącik Twórcy Gier by Piotr Cebula"). Stylizacja i interaktywność są zarządzane przez zewnętrzne pliki styles.css i script.js. 

Strona Główna (index.html)  

Zawiera powitanie, krótki opis autora, informacje o doświadczeniu zawodowym (lub jego braku), listę umiejętności (HTML, CSS, JavaScript, React, Python, Java, Git) oraz dane kontaktowe (email: [email protected]). 

Struktura opiera się na sekcjach z tekstem w formie "notatek" z prostym, czytelnym układem. 

Projekty (projects.html)  

Prezentuje galerię maksymalnie 3 najnowszych projektów pobieranych z GitHub API. Każdy projekt wyświetlany jest w formie karty z tytułem, opisem (jeśli dostępny) i linkiem do repozytorium. 

Wykorzystuje responsywny układ z kartami projektowymi, dostosowujący się do szerokości ekranu. 

Laboratorium (lab.html)  

Służy do eksperymentów, np. "Taniec Cząsteczek" – symulacja cząstek z użyciem Canvas API, z opcjami resetu i eksplozji. Zawiera zapowiedź przyszłej mini-gry ("Kliknij, aby uniknąć przeszkód – wkrótce!"). 

Struktura opiera się na interaktywnych elementach z canvasem i przyciskami sterującymi. 

Kącik Twórcy Gier (ktg.html)  

Zawiera zapiski związane z tworzeniem gier, np. przykładowy kod C++ dla ruchu w grze wyścigowej, symulację ruchu pojazdu z Canvas API (z przyciskami: zwolnij, resetuj, przyspiesz) oraz generator pomysłów na gry (lista 32 unikalnych pomysłów). 

Oferuje interaktywne elementy i treści edukacyjne dla pasjonatów tworzenia gier. 

Nowości (news.html)  

Wyświetla wiadomości ze świata gier pobierane z API mmobomb.com (przez proxy allorigins.win). Oferuje paginację (5, 10, 15, 20 elementów na stronę) i spinner ładowania. 

Strona zawiera sekcję z linkami do pełnych artykułów w responsywnym układzie. 

Blog (blog.html)  

Funkcjonalny blog z możliwością dodawania, edytowania i usuwania wpisów za pomocą API JSONPlaceholder. Zawiera filtry (po tytule lub treści), sortowanie (tytuł A-Z, Z-A, ID rosnąco/malejąco) oraz responsywny układ (tabela na desktopie, karty na mobile). 

Umożliwia interakcję z użytkownikiem poprzez formularz i akcje CRUD. 

 

Opis Technologii Zastosowanych przy Tworzeniu Serwisu 

Serwis wykorzystuje nowoczesne technologie webowe i zewnętrzne API, co zapewnia jego funkcjonalność i estetykę. 

HTML5  

Użyto do budowy struktury stron z semantycznymi tagami (<header>, <nav>, <section>, <footer>), co poprawia dostępność i SEO. 

CSS3  

Stylizacja obejmuje niestandardowy font ('Patrick Hand' z Google Fonts), gradienty liniowe (np. w nagłówku i stopce), cienie i animacje (np. transform na hover, spinner z @keyframes). 

Responsywność osiągnięto dzięki media queries z punktami przełomowymi (480px, 768px, 1199px, 1366px). 

Efekty interaktywne, takie jak podnoszenie elementów na hover czy płynne przejścia z transition. 

JavaScript  

Obsługuje interaktywność, np. menu hamburgerowe, widoczność notatek podczas przewijania strony. 

Wykorzystuje Canvas API do symulacji ("Taniec Cząsteczek", ruch pojazdu). 

Pobiera dane z API (GitHub, JSONPlaceholder, mmobomb.com) za pomocą fetch i async/await. 

Implementuje operacje CRUD dla bloga (z potwierdzeniem usuwania) oraz paginację i filtry/sortowanie na stronach bloga i nowości. 

Zewnętrzne API  

GitHub API: Pobieranie danych o repozytoriach na stronie projektów. 

JSONPlaceholder: Symulacja backendu dla bloga (CRUD). 

mmobomb.com API: Wiadomości o grach na stronie nowości (przez proxy allorigins.win). 

Fonty  

'Patrick Hand' z Google Fonts nadaje serwisowi unikalny, ręcznie pisany styl. 

Narzędzia  

Git do kontroli wersji. 

Środowisko developerskie, np. VS Code, do tworzenia i edycji kodu. 

 

Testy 

Projekt został poddany różnym testom w celu zapewnienia jakości i funkcjonalności: 

Testy Responsywności  

Sprawdzono działanie na różnych rozdzielczościach: desktop (1366px+), tablet (769-1199px), mobile (<768px). Menu hamburger działa poprawnie na urządzeniach mobilnych, a karty projektowe dostosowują się do ekranu. 

Testy Interaktywności  

Symulacje Canvas ("Taniec Cząsteczek", ruch pojazdu) działają płynnie, a przyciski (reset, eksplozja, generowanie pomysłów) reagują na kliknięcia. Blog umożliwia dodawanie i usuwanie wpisów bez błędów. 

Testy API  

Pobieranie danych z GitHub, JSONPlaceholder i mmobomb.com działa stabilnie. Obsługa błędów (spinner ładowania, komunikaty) funkcjonuje prawidłowo. 

Testy Dostępności  

Użyto semantycznych tagów HTML, a kontrast kolorów jest wystarczający. 

Testy Przeglądarkowe  

Strona przetestowana w Opera, Edge, Chrome i Firefox – brak problemów, choć API mogą wymagać dodatkowego czasu do załadowania 

 
Podsumowanie 

"Kącik Twórcy Gier" to wszechstronny projekt, który łączy portfolio, blog, laboratorium eksperymentów i sekcję nowości w spójną całość. Wykorzystanie HTML5, CSS3, JavaScriptu oraz zewnętrznych API zapewnia dynamiczne i interaktywne doświadczenie użytkownika. 

 
