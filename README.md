# Dokumentacja Projektu: Kącik Twórcy Gier

## Wstęp

Strona **“Kącik Twórcy Gier”** to serwis internetowy skierowany do entuzjastów gier komputerowych, w szczególności tych z gatunku MMO, oraz osób aspirujących do roli twórców gier. Platforma agreguje najświeższe informacje ze świata gier, a także dostarcza zasobów i narzędzi przydatnych w procesie game developmentu. Użytkownicy znajdą tu prezentacje autorskich prac, w tym interaktywne symulacje, generator pomysłów na gry oraz inne aplikacje, które zostały zbudowane z wykorzystaniem nowoczesnych technologii webowych: HTML, CSS, JavaScript oraz zewnętrznych API.

## Opis Struktury Serwisu

Serwis został zaprojektowany jako modułowa platforma składająca się z sześciu głównych, tematycznych stron. Każda z nich pełni unikalną funkcję, jednocześnie zachowując spójność wizualną i nawigacyjną z resztą serwisu. Kluczowe elementy wspólne dla wszystkich podstron to:

*   **Nagłówek (Header):** Stały element na górze strony, zawierający logo oraz główne menu nawigacyjne. Na urządzeniach mobilnych menu transformuje się w tzw. "menu hamburgerowe" dla lepszej użyteczności.
*   **Stopka (Footer):** Umieszczona na dole każdej strony, zawiera informację o prawach autorskich: *“© 2025 Kącik Twórcy Gier by Piotr Cebula”*.

Zaawansowana stylizacja, responsywność oraz interaktywne funkcjonalności są zarządzane przez zewnętrzne pliki `styles.css` oraz `script.js`.

---

### 1. Strona Główna (`index.html`)

*   **Cel:** Powitanie użytkownika, prezentacja autora oraz ogólne wprowadzenie do tematyki serwisu.
*   **Zawartość:**
    *   Sekcja powitalna.
    *   Krótki opis autora i jego motywacji.
    *   Informacje o doświadczeniu zawodowym (lub jego braku, w przypadku projektów studenckich/hobbystycznych).
    *   Lista kluczowych umiejętności technicznych: `HTML`, `CSS`, `JavaScript`, `React`, `Python`, `Java`, `Git`.
    *   Dane kontaktowe: email ([email protected]).
*   **Struktura:** Treści prezentowane są w formie estetycznych "notatek" z przejrzystym i czytelnym układem, co ułatwia przyswajanie informacji.

---

### 2. Projekty (`projects.html`)

*   **Cel:** Prezentacja portfolio projektów autora.
*   **Zawartość:**
    *   Dynamicznie generowana galeria zawierająca maksymalnie trzy najnowsze projekty.
    *   Dane o projektach są pobierane w czasie rzeczywistym z **GitHub API**.
    *   Każdy projekt jest wyświetlany jako interaktywna karta, zawierająca:
        *   Tytuł projektu.
        *   Krótki opis (jeśli dostępny w repozytorium GitHub).
        *   Bezpośredni link do repozytorium na GitHub.
*   **Struktura:** Strona wykorzystuje responsywny układ siatki (grid) dla kart projektowych, który automatycznie dostosowuje się do różnych szerokości ekranu, zapewniając optymalne wyświetlanie na desktopach, tabletach i urządzeniach mobilnych.

---

### 3. Laboratorium (`lab.html`)

*   **Cel:** Przestrzeń do prezentacji eksperymentalnych aplikacji i interaktywnych symulacji.
*   **Zawartość:**
    *   **“Taniec Cząsteczek”:** Interaktywna symulacja fizyki cząstek stworzona przy użyciu **Canvas API**. Użytkownik ma możliwość:
        *   Resetowania symulacji do stanu początkowego.
        *   Wywołania efektu "eksplozji", wpływającego na ruch cząstek.
    *   Zapowiedź przyszłej mini-gry: *“Kliknij, aby uniknąć przeszkód – wkrótce!”*.
*   **Struktura:** Główny nacisk położony jest na interaktywne elementy `canvas` oraz przyciski kontrolujące symulacje, zachęcające użytkownika do eksploracji.

---

### 4. Kącik Twórcy Gier (`ktg.html`)

*   **Cel:** Dzielenie się wiedzą, narzędziami i inspiracjami związanymi z tworzeniem gier.
*   **Zawartość:**
    *   Przykładowe fragmenty kodu, np. implementacja ruchu postaci w grze wyścigowej w języku C++.
    *   Interaktywna symulacja ruchu pojazdu zrealizowana za pomocą **Canvas API**, wyposażona w przyciski sterujące:
        *   `Zwolnij`
        *   `Resetuj`
        *   `Przyspiesz`
    *   **Generator Pomysłów na Gry:** Narzędzie generujące losowe koncepcje gier z predefiniowanej listy 32 unikalnych pomysłów, mające na celu stymulowanie kreatywności.
*   **Struktura:** Strona łączy treści edukacyjne z interaktywnymi demonstracjami, skierowanymi do pasjonatów i początkujących twórców gier.

---

### 5. Nowości (`news.html`)

*   **Cel:** Dostarczanie najświeższych informacji i artykułów ze świata trendów, technologii oraz filmów.
*   **Zawartość:**
    *   Dynamicznie ładowana lista wiadomości o grach.
    *   Dane pobierane są z zewnętrznego API (np. `NewsAPI.org`, `GNews API`, wcześniej `mmobomb.com`) za pośrednictwem serwera proxy (np. `AllOrigins.win` lub własnego rozwiązania) w celu ominięcia ograniczeń CORS.
    *   Funkcjonalności:
        *   **Paginacja:** Umożliwia przeglądanie wiadomości w partiach (np. 5, 10, 15, 20 elementów na stronę).
        *   **Spinner ładowania:** Informuje użytkownika o procesie pobierania danych.
    *   Każda wiadomość zawiera link do pełnego artykułu na oryginalnej stronie źródłowej.
*   **Struktura:** Lista nowości prezentowana jest w responsywnym układzie, czytelnym na różnych urządzeniach.

---

### 6. Blog (`blog.html`)

*   **Cel:** Interaktywna platforma blogowa umożliwiająca zarządzanie treściami.
*   **Zawartość:**
    *   W pełni funkcjonalny blog z operacjami **CRUD** (Create, Read, Update, Delete) na wpisach.
    *   Interakcje z backendem są symulowane za pomocą API **JSONPlaceholder**.
    *   Funkcjonalności dla użytkownika:
        *   Dodawanie nowych wpisów poprzez formularz.
        *   Edycja istniejących wpisów.
        *   Usuwanie wpisów (z mechanizmem potwierdzenia operacji).
        *   **Filtrowanie wpisów:** Możliwość wyszukiwania po tytule lub treści.
        *   **Sortowanie wpisów:** Według tytułu (A-Z, Z-A) lub ID (rosnąco, malejąco).
*   **Struktura:**
    *   **Desktop:** Wpisy prezentowane są w formie tabelarycznej dla łatwiejszego przeglądania i zarządzania.
    *   **Mobile:** Układ zmienia się na bardziej kompaktowe karty, dostosowane do mniejszych ekranów.

## Opis Technologii Zastosowanych przy Tworzeniu Serwisu

Serwis został zbudowany z wykorzystaniem zbioru nowoczesnych technologii webowych oraz zewnętrznych usług API, co zapewnia jego dynamiczny charakter, interaktywność i estetyczny wygląd.

### 1. HTML5

*   Wykorzystano do tworzenia semantycznej struktury wszystkich podstron serwisu.
*   Zastosowano tagi takie jak `<header>`, `<nav>`, `<main>`, `<article>`, `<section>`, `<footer>` w celu poprawy dostępności i SEO.

### 2. CSS3

*   Odpowiada za pełną warstwę wizualną serwisu.
*   **Stylizacja:**
    *   Niestandardowy, charakterystyczny font **'Patrick Hand'** (importowany z Google Fonts), nadający stronie unikalny, "ręcznie pisany" styl.
    *   Wykorzystanie **gradientów liniowych** (np. w nagłówku, stopce, przyciskach) dla uzyskania głębi i nowoczesnego wyglądu.
    *   Subtelne **cienie** (`box-shadow`) dodające elementom trójwymiarowości.
*   **Responsywność (RWD):**
    *   Implementacja w pełni responsywnego designu przy użyciu **media queries**.
    *   Zdefiniowane punkty przełomowe (breakpoints): `480px`, `768px`, `1199px`, `1366px`, zapewniające optymalne wyświetlanie na szerokiej gamie urządzeń.
*   **Interaktywność i Animacje:**
    *   Płynne **przejścia** (`transition`) dla efektów hover na linkach, przyciskach i kartach.
    *   Animacje oparte na **`@keyframes`** (np. dla spinnera ładowania).
    *   Efekty wizualne przy interakcji, takie jak "podnoszenie się" elementów (`transform: translateY`) po najechaniu kursorem.

### 3. JavaScript (ES6+)

*   Główny język skryptowy odpowiedzialny za logikę i interaktywność serwisu.
*   **Manipulacja DOM:** Dynamiczne tworzenie i modyfikowanie elementów HTML.
*   **Obsługa Zdarzeń:** Reakcja na akcje użytkownika (kliknięcia, przewijanie, zmiany w formularzach).
    *   Implementacja **menu hamburgerowego** dla urządzeń mobilnych.
    *   Logika **widoczności notatek** (`Intersection Observer API` lub metoda oparta na pozycji scrolla) podczas przewijania strony.
*   **Canvas API:**
    *   Wykorzystane do tworzenia interaktywnych symulacji graficznych:
        *   “Taniec Cząsteczek” na stronie `lab.html`.
        *   Symulacja ruchu pojazdu na stronie `ktg.html`.
*   **Komunikacja z API:**
    *   Użycie natywnego `fetch` API oraz składni `async/await` do asynchronicznego pobierania danych z zewnętrznych serwerów.
    *   Obsługa odpowiedzi (w formacie JSON) i dynamiczne renderowanie danych na stronie.
*   **Funkcjonalności Aplikacji:**
    *   Implementacja pełnych operacji **CRUD** (Create, Read, Update, Delete) dla sekcji bloga, z potwierdzeniem operacji usuwania (`window.confirm`).
    *   Logika **paginacji**, **filtrowania** i **sortowania** danych na stronach nowości i bloga.
    *   Generator losowych pomysłów na gry.

### 4. Zewnętrzne API

*   **GitHub API:** (`https://api.github.com`)
    *   Służy do pobierania informacji o publicznych repozytoriach użytkownika (np. `C-BULLKA`) w celu dynamicznego wyświetlania projektów na stronie `projects.html`.
*   **JSONPlaceholder:** (`https://jsonplaceholder.typicode.com`)
    *   Wykorzystywane jako darmowe, fałszywe API REST do symulacji backendu dla funkcjonalności bloga (pobieranie, dodawanie, edycja, usuwanie postów).
*   **API Wiadomości:** (np. `NewsAPI.org`, `GNews.io`, wcześniej `MMOBomb.com`)
    *   Służy do pobierania najnowszych wiadomości ze świata filmów, technologii oraz trendów , które są wyświetlane na stronie `news.html`.
    *   Ze względu na ograniczenia CORS, żądania do tych API są często kierowane przez **serwer proxy** (np. publiczny `AllOrigins.win` lub preferowane własne rozwiązanie proxy).

### 5. Fonty

*   **Google Fonts:**
    *   Importowany font **'Patrick Hand'** w celu nadania stronie charakterystycznego, przyjaznego wyglądu.

### 6. Narzędzia Deweloperskie

*   **Git:** System kontroli wersji używany do zarządzania kodem źródłowym projektu.
*   **Edytor Kodu:** Prawdopodobnie Visual Studio Code (VS Code) lub podobne zintegrowane środowisko programistyczne (IDE) do pisania i edycji kodu.
*   **Przeglądarki Internetowe i Narzędzia Deweloperskie:** Do testowania, debugowania i inspekcji kodu (np. Chrome DevTools, Firefox Developer Tools).
*   **Lokalny Serwer Deweloperski:** (np. Live Server w VS Code) do uruchamiania strony lokalnie i unikania problemów z `origin: null` przy testowaniu funkcjonalności zależnych od API.

## Testy

Projekt został poddany serii testów mających na celu zapewnienie jego wysokiej jakości, poprawnego działania oraz dobrego doświadczenia użytkownika na różnych platformach i urządzeniach.

### 1. Testy Responsywności (RWD)

*   **Zakres:** Sprawdzono wyświetlanie i funkcjonalność serwisu na różnych szerokościach ekranu, symulujących popularne urządzenia.
*   **Scenariusze:**
    *   **Desktop:** Rozdzielczości powyżej `1366px`.
    *   **Tablet (orientacja pozioma/pionowa):** Rozdzielczości w zakresie `769px - 1199px`.
    *   **Mobile (smartfony):** Rozdzielczości poniżej `768px`.
*   **Wyniki:**
    *   Układ strony poprawnie adaptuje się do dostępnej przestrzeni.
    *   Menu nawigacyjne transformuje się w menu hamburgerowe na mniejszych ekranach i działa zgodnie z oczekiwaniami.
    *   Karty projektów, wpisy blogowe i inne elementy kontenerowe dynamicznie zmieniają swój układ (np. z wielokolumnowego na jednokolumnowy).
    *   Treści pozostają czytelne i dostępne na wszystkich testowanych rozdzielczościach.

### 2. Testy Interaktywności

*   **Zakres:** Weryfikacja działania wszystkich interaktywnych komponentów serwisu.
*   **Scenariusze:**
    *   **Symulacje Canvas:**
        *   “Taniec Cząsteczek”: Sprawdzono płynność animacji, reakcję na przyciski `Resetuj` i `Eksplozja`.
        *   Symulacja Ruchu Pojazdu: Testowano działanie przycisków `Zwolnij`, `Resetuj`, `Przyspiesz` i poprawność wizualizacji ruchu.
    *   **Generator Pomysłów:** Weryfikacja generowania różnych pomysłów po kliknięciu przycisku.
    *   **Blog (CRUD):**
        *   Dodawanie nowych wpisów: Sprawdzono poprawność działania formularza i pojawianie się nowego wpisu.
        *   Edycja wpisów: Weryfikacja możliwości modyfikacji istniejących treści.
        *   Usuwanie wpisów: Testowano mechanizm usuwania wraz z oknem potwierdzenia.
        *   Filtrowanie i sortowanie: Sprawdzono działanie filtrów tekstowych oraz opcji sortowania.
    *   **Nawigacja:** Testowano działanie linków w menu głównym i menu hamburgerowym.
    *   **Efekty hover:** Sprawdzono poprawność wizualnych efektów po najechaniu kursorem na interaktywne elementy.
*   **Wyniki:** Wszystkie testowane funkcje interaktywne działają płynnie i zgodnie z założeniami. Operacje na blogu są wykonywane bez błędów.

### 3. Testy Integracji z API

*   **Zakres:** Sprawdzenie poprawności komunikacji z zewnętrznymi API oraz obsługi odpowiedzi.
*   **Scenariusze:**
    *   **GitHub API (`projects.html`):** Weryfikacja pobierania i wyświetlania danych o repozytoriach.
    *   **JSONPlaceholder (`blog.html`):** Testowanie wszystkich operacji CRUD.
    *   **API Wiadomości (`news.html`):** Sprawdzenie pobierania newsów (przez proxy), działania paginacji i spinnera ładowania.
*   **Wyniki:**
    *   Pobieranie danych z API generalnie działa stabilnie, jednakże zależne jest od dostępności i niezawodności publicznych serwerów proxy (w przypadku API wymagających obejścia CORS).
    *   Mechanizmy obsługi błędów (np. spinner podczas ładowania, komunikaty o błędach w przypadku niepowodzenia pobrania danych) funkcjonują prawidłowo, informując użytkownika o stanie aplikacji.

### 4. Testy Dostępności (podstawowe)

*   **Zakres:** Ocena podstawowych aspektów dostępności serwisu.
*   **Scenariusze:**
    *   Użycie semantycznych tagów HTML (`<nav>`, `<article>`, `<main>` itp.).
    *   Kontrast kolorów (weryfikacja wizualna, czy tekst jest czytelny na tle).
    *   Nawigacja za pomocą klawiatury (podstawowe testy focusowania elementów).
*   **Wyniki:** Strona wykorzystuje semantyczne tagi. Kontrast kolorów wydaje się być wystarczający dla większości elementów. Nawigacja klawiaturą jest możliwa dla głównych elementów interaktywnych. Dalsze, bardziej szczegółowe testy dostępności (np. z użyciem czytników ekranu) mogłyby zidentyfikować obszary do poprawy.

### 5. Testy Przeglądarkowe (Cross-Browser Testing)

*   **Zakres:** Sprawdzenie kompatybilności i poprawnego wyświetlania serwisu w różnych popularnych przeglądarkach internetowych.
*   **Testowane Przeglądarki:**
    *   Google Chrome (najnowsza wersja)
    *   Mozilla Firefox (najnowsza wersja)
    *   Microsoft Edge (najnowsza wersja)
    *   Opera (najnowsza wersja)
*   **Wyniki:** Serwis generalnie wyświetla się i działa poprawnie we wszystkich testowanych przeglądarkach. Nie zaobserwowano znaczących problemów z układem ani funkcjonalnością. Należy jednak pamiętać, że problemy z ładowaniem danych z zewnętrznych API (szczególnie tych za proxy) mogą występować niezależnie od przeglądarki i są związane z dostępnością tych usług.

## Podsumowanie

Projekt **“Kącik Twórcy Gier”** stanowi kompleksową platformę internetową, która z powodzeniem integruje funkcje portfolio, bloga, interaktywnego laboratorium oraz agregatora nowości. Dzięki zastosowaniu nowoczesnych technologii webowych, takich jak HTML5, CSS3 i JavaScript (ES6+), oraz integracji z zewnętrznymi API, serwis oferuje użytkownikom dynamiczne, angażujące i wartościowe doświadczenie. Wyzwania związane z niezawodnością publicznych serwerów proxy podkreślają potencjalną potrzebę implementacji własnego rozwiązania backendowego dla zapewnienia długoterminowej stabilności niektórych funkcji.

---

## Autor

Autorem projektu **“Kącik Twórcy Gier”** jest **Piotr Cebula**.

---
