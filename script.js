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
});