(function () {
  var pre = document.querySelector(".preloader");
  if (!pre) return;
  if (sessionStorage.getItem("seenPreloader")) {
    pre.remove();
    return;
  }
  var text = pre.querySelector(".ptext");
  var words = [
    "hello",
    "bonjour",
    "hola",
    "नमस्ते",
    "Hii",
    "Konnichiwa",
    "ola",
    "ciao",
  ];
  words.forEach(function (w, i) {
    setTimeout(function () {
      text.textContent = w;
    }, i * 200);
  });
  setTimeout(
    function () {
      text.classList.add("hide");
      pre.classList.add("active");
      sessionStorage.setItem("seenPreloader", "1");
      setTimeout(function () {
        pre.remove();
      }, 1700);
    },
    words.length * 200 + 100,
  );
})();
