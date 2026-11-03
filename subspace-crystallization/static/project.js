//* ======================== Crystallization Widget ===================== */
// d_out per matrix, test accuracy and the Nanda et al. losses, from Table 5
// (29 grokked transformer seeds, each aligned at its own onset t_g).
// Sizes are each matrix's maximum rank (Table 30).
(function () {
  var root = document.getElementById("crystal-widget");
  if (!root) return;

  var steps = [-3000, -2000, -1000, -500, 0, 1000, 3000];
  var mats = [
    { name: "E", size: 97, d: [27.3, 26.0, 23.0, 19.9, 17.2, 12.0, 8.6] },
    { name: "in", size: 128, d: [28.0, 25.7, 21.0, 18.3, 15.9, 13.9, 13.8] },
    { name: "out", size: 128, d: [46.9, 40.2, 26.6, 16.7, 11.0, 9.2, 9.0] },
    { name: "U", size: 98, d: [52.6, 46.6, 33.4, 24.2, 14.0, 9.1, 8.9] }
  ];
  var acc = [15.7, 26.2, 57.7, 82.4, 96.9, 99.9, 100.0];
  var restricted = [2.09, 1.37, 0.64, 0.26, 0.12, 0.03, 0.12];
  var excluded = [4.8, 8.1, 14.7, 16.6, 16.2, 14.0, 18.4];
  var palette = ["#2f4f7a", "#3f6596", "#5a80b0", "#7c9cc6"];

  var grids = root.querySelector(".cw-grids");
  var range = root.querySelector("input[type=range]");
  var playBtn = root.querySelector(".cw-play");
  var cells = [];
  var counts = [];

  mats.forEach(function (m) {
    var wrap = document.createElement("div");
    wrap.className = "cw-mat";
    wrap.innerHTML =
      '<div class="cw-label"><span><i>W</i><sub>' + m.name + "</sub></span>" +
      '<span class="count"><b></b> <span class="raw"></span></span></div>';
    var box = document.createElement("div");
    box.className = "cw-cells";
    var list = [];
    for (var k = 0; k < m.size; k++) {
      var c = document.createElement("span");
      box.appendChild(c);
      list.push(c);
    }
    wrap.appendChild(box);
    grids.appendChild(wrap);
    cells.push(list);
    counts.push({ pct: wrap.querySelector(".count b"), raw: wrap.querySelector(".count .raw") });
  });

  function fmt(s) {
    if (s === 0) return "0";
    var sign = s > 0 ? "+" : "−";
    return sign + Math.abs(s).toLocaleString("en-US");
  }

  function render(i) {
    mats.forEach(function (m, j) {
      var n = Math.round(m.d[i]);
      counts[j].pct.textContent = ((100 * m.d[i]) / m.size).toFixed(1) + "%";
      counts[j].raw.textContent = "(" + m.d[i].toFixed(1) + "/" + m.size + ")";
      cells[j].forEach(function (c, k) {
        if (k < n) {
          // Leading singular directions are darkest.
          var t = k / Math.max(n - 1, 1);
          c.style.backgroundColor = palette[Math.min(Math.floor(t * palette.length), palette.length - 1)];
          c.className = "on";
        } else {
          c.style.backgroundColor = "";
          c.className = "";
        }
      });
    });
    root.querySelector(".cw-step").textContent = fmt(steps[i]);
    root.querySelector(".m-acc").textContent = acc[i].toFixed(1) + "%";
    root.querySelector(".m-res").textContent = restricted[i].toFixed(2);
    root.querySelector(".m-exc").textContent = excluded[i].toFixed(1);
    root.querySelector(".b-acc").style.width = acc[i] + "%";
    root.querySelector(".b-res").style.width = (restricted[i] / 2.09) * 100 + "%";
    root.querySelector(".b-exc").style.width = (excluded[i] / 18.4) * 100 + "%";
  }

  var timer = null;
  function stop() {
    clearInterval(timer);
    timer = null;
    playBtn.innerHTML = 'Play <i class="fa-solid fa-play"></i>';
  }
  playBtn.addEventListener("click", function () {
    if (timer) return stop();
    if (+range.value === steps.length - 1) range.value = 0;
    render(+range.value);
    playBtn.innerHTML = 'Pause <i class="fa-solid fa-pause"></i>';
    timer = setInterval(function () {
      var next = +range.value + 1;
      if (next >= steps.length) return stop();
      range.value = next;
      render(next);
    }, 1100);
  });
  range.addEventListener("input", function () {
    if (timer) stop();
    render(+range.value);
  });

  render(0);
})();
