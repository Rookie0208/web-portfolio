(() => {
    const section = document.querySelector(".work-showcase");
    if (!section) return;

    const items = [...section.querySelectorAll(".work-item")];
    const frame = section.querySelector(".work-preview-frame");
    const previewImage = section.querySelector(".work-preview-image");
    const previewNumber = section.querySelector(".work-preview-number");
    const captionNumber = section.querySelector(".preview-number");
    const previewTitle = section.querySelector(".preview-title");

    const hoverPreview = section.querySelector(".work-hover-preview");
    const hoverImage = hoverPreview?.querySelector("img");

    let hoveredItem = null;

    // Persistent animation state: do not reset these inside pointermove.
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let animationFrame = null;

    function setActive(item) {
        if (!item) return;

        items.forEach(project => {
            project.classList.toggle("is-active", project === item);
        });

        const number = item.dataset.number || "01";
        const index =
            item.querySelector(".work-item-index")?.textContent || "";
        const title = item.querySelector("h2")?.textContent || "";
        const image = item.dataset.image;

        if (previewNumber) previewNumber.textContent = number;
        if (captionNumber) captionNumber.textContent = index;
        if (previewTitle) previewTitle.textContent = title;

        if (image && previewImage) {
            if (previewImage.getAttribute("src") !== image) {
                previewImage.src = image;
            }
            previewImage.alt = `${title} project preview`;
        } else if (previewImage) {
            previewImage.alt = "";
        }
    }

    function movePreview(event) {
        if (!hoverPreview?.classList.contains("is-visible")) return;

        const offset = 22;
        const previewWidth = hoverPreview.offsetWidth;
        const previewHeight = hoverPreview.offsetHeight;

        // Keep the preview inside the viewport.
        const maxX = Math.max(
            0,
            window.innerWidth - previewWidth - 12
        );
        const maxY = Math.max(
            0,
            window.innerHeight - previewHeight - 12
        );

        // Flip to the other side near the viewport edges.
        let x = event.clientX + offset;
        let y = event.clientY + offset;

        if (x > maxX) x = event.clientX - previewWidth - offset;
        if (y > maxY) y = event.clientY - previewHeight - offset;

        targetX = Math.max(12, Math.min(x, maxX));
        targetY = Math.max(12, Math.min(y, maxY));

        if (animationFrame === null) {
            animationFrame = requestAnimationFrame(animatePreview);
        }
    }

    function animatePreview() {
        // Lower value = softer, floatier movement.
        const easing = 0.14;

        currentX += (targetX - currentX) * easing;
        currentY += (targetY - currentY) * easing;

        hoverPreview.style.left = `${currentX}px`;
        hoverPreview.style.top = `${currentY}px`;

        if (
            Math.abs(targetX - currentX) > 0.4 ||
            Math.abs(targetY - currentY) > 0.4
        ) {
            animationFrame = requestAnimationFrame(animatePreview);
        } else {
            currentX = targetX;
            currentY = targetY;

            hoverPreview.style.left = `${currentX}px`;
            hoverPreview.style.top = `${currentY}px`;

            animationFrame = null;
        }
    }

    items.forEach(item => {
        item.addEventListener("mouseenter", event => {
            hoveredItem = item;
            setActive(item);

            frame?.classList.add("is-placeholder");

            const image = item.dataset.image;

            if (image && hoverImage && hoverPreview) {
                hoverImage.src = image;
                hoverPreview.classList.add("is-visible");

                // Start close to the pointer to avoid flying in from (0, 0).
                currentX = event.clientX + 22;
                currentY = event.clientY + 22;
                targetX = currentX;
                targetY = currentY;

                hoverPreview.style.left = `${currentX}px`;
                hoverPreview.style.top = `${currentY}px`;

                movePreview(event);
            } else {
                hoverPreview?.classList.remove("is-visible");
            }
        });

        item.addEventListener("mouseleave", () => {
            hoveredItem = null;
            frame?.classList.remove("is-placeholder");
            hoverPreview?.classList.remove("is-visible");
        });

        item.addEventListener("focusin", () => setActive(item));
    });

    // Exactly one pointermove listener.
    section.addEventListener("pointermove", movePreview);

    const observer = new IntersectionObserver(entries => {
        if (hoveredItem) return;

        const visible = entries
            .filter(entry => entry.isIntersecting)
            .sort((a, b) =>
                Math.abs(a.boundingClientRect.top - innerHeight * 0.45) -
                Math.abs(b.boundingClientRect.top - innerHeight * 0.45)
            )[0];

        if (visible) setActive(visible.target);
    }, {
        rootMargin: "-20% 0px -45% 0px"
    });

    items.forEach(item => observer.observe(item));

    if (items.length) setActive(items[0]);
})();