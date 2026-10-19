
var burger = document.getElementById("burger"),
  links = document.getElementById("links");

if (burger && links) {
  burger.onclick = function () {
    var o = links.classList.toggle("open");
    burger.setAttribute("aria-expanded", o);
  };
}

var clr = document.querySelector(".clr");

if (clr) {
  clr.style.color =
    "#" +
    Math.floor(Math.random() * 16777216)
      .toString(16)
      .padStart(6, "0");
}

// Dark mode
try {
  if (localStorage.getItem("dark") === "1") {
    document.body.classList.add("dark");
  }
} catch (x) {}

var logo = document.querySelector(".logo");

if (logo) {
  logo.addEventListener("click", function (e) {
    e.preventDefault();

    var d = document.body.classList.toggle("dark");

    try {
      localStorage.setItem("dark", d ? "1" : "0");
    } catch (x) {}
  });
}

// Reveal animations
var io = new IntersectionObserver(
  function (es) {
    es.forEach(function (e) {
      if (e.isIntersecting) {
        e.target.classList.add("in");
        io.unobserve(e.target);
      }
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll(".reveal").forEach(function (el) {
  io.observe(el);
});

// Smooth transitions between pages
document.addEventListener("DOMContentLoaded", () => {
    const body = document.body;

    // Fade the page in when it loads
    body.classList.add("page-entering");

    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            body.classList.remove("page-entering");
        });
    });

    // Fade out before navigating to another local page
    document.querySelectorAll("a[href]").forEach((link) => {
        link.addEventListener("click", (event) => {
            const href = link.getAttribute("href");

            if (
                !href ||
                href.startsWith("#") ||
                href.startsWith("mailto:") ||
                href.startsWith("tel:") ||
                link.target === "_blank" ||
                event.ctrlKey ||
                event.metaKey ||
                event.shiftKey ||
                event.altKey
            ) {
                return;
            }

            const destination = new URL(href, window.location.href);

            if (
                destination.origin !== window.location.origin ||
                destination.href === window.location.href
            ) {
                return;
            }

            event.preventDefault();
            body.classList.add("page-leaving");

            setTimeout(() => {
                window.location.href = destination.href;
            }, 300);
        });
    });
});

// Scroll-linked tagline animation
var s = document.getElementById("slide");

if (s) {
  var a = s.querySelector(".l1 span"),
    b = s.querySelector(".l2 span"),
    motion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ),
    tk = false;

  var upd = function () {
    tk = false;

    if (!a || !b) return;

    // Respect accessibility preferences.
    if (motion.matches) {
      a.style.transform = "none";
      b.style.transform = "none";
      return;
    }

    var r = s.getBoundingClientRect(),
      vh = window.innerHeight;

    // Progress from 0 to 1 as the section scrolls through view.
    var start = vh * 0.95,
      end = -r.height * 0.5,
      t = Math.min(
        1,
        Math.max(0, (start - r.top) / (start - end))
      );

    // Smooth ease-out movement.
    var eased = 1 - Math.pow(1 - t, 3);

    // Start off-screen and settle into position.
    var distance = Math.min(window.innerWidth * 0.3, 300),
      x = distance * (1 - eased);

    // Line 1 enters from the left.
    a.style.transform =
      "translate3d(" + -x + "px, 0, 0)";

    // Line 2 enters from the right.
    b.style.transform =
      "translate3d(" + x + "px, 0, 0)";
  };

  var requestUpdate = function () {
    if (!tk) {
      tk = true;
      window.requestAnimationFrame(upd);
    }
  };

  window.addEventListener("scroll", requestUpdate, {
    passive: true
  });

  window.addEventListener("resize", requestUpdate);

  if (motion.addEventListener) {
    motion.addEventListener("change", requestUpdate);
  } else if (motion.addListener) {
    motion.addListener(requestUpdate);
  }
  upd();
}

// Compact navigation when scrolling past the hero
(function () {
    var header = document.getElementById("site-nav");
    var hero = document.getElementById("hero");

    if (!header || !hero) return;

    var ticking = false;

    function updateNav() {
        ticking = false;

        // Switch when the hero is almost out of view
        var heroBottom = hero.getBoundingClientRect().bottom;

        header.classList.toggle("nav-compact", heroBottom <= 80);
    }

    function requestUpdate() {
        if (ticking) return;

        ticking = true;
        window.requestAnimationFrame(updateNav);
    }

    window.addEventListener("scroll", requestUpdate, {
        passive: true
    });

    window.addEventListener("resize", requestUpdate);

    updateNav();
})();