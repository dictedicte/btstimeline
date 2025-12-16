/********************
 * CONFIG
 ********************/
const SHEET_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vTS6wfn1OoHNUypQssK_Rxb6H-hFn6sCySRCRUxfQknwlfLnjchcL-8SNFTBpGPjv_CAthaNavJCVTs/pub?gid=1105312639&single=true&output=csv";

const CARD_HEIGHT = 60;
const BUFFER = 5;

/********************
 * ELEMENTS
 ********************/
const viewport = document.getElementById("viewport");
const spacer = document.getElementById("spacer");
const items = document.getElementById("items");
const searchInput = document.getElementById("search");

/********************
 * DATA
 ********************/
let data = [];
let filtered = [];

/********************
 * LOAD GOOGLE SHEET
 ********************/
async function loadData() {
  const res = await fetch(SHEET_URL);
  const text = await res.text();

  const rows = text.trim().split("\n").map(r => r.split(","));
  const [, ...body] = rows; // skip header row

  data = body.map(row => ({
    year: row[0] || "",
    month: row[1] || "",
    day: row[2] || "",
    time: row[4] || "",
    description: row[6] || "",
    title: row[7]?.trim() || "",
    searchText: (row[6] + " " + row[7]).toLowerCase()
  }));

  filtered = data;
  updateSpacer();
  render();
}

/********************
 * VIRTUALIZATION
 ********************/
function updateSpacer() {
  spacer.style.height = filtered.length * CARD_HEIGHT + "px";
}

function render() {
  const scrollTop = viewport.scrollTop;

  const start = Math.max(
    0,
    Math.floor(scrollTop / CARD_HEIGHT) - BUFFER
  );

  const end = Math.min(
    filtered.length,
    start +
      Math.ceil(viewport.clientHeight / CARD_HEIGHT) +
      BUFFER * 2
  );

  items.style.transform = `translateY(${start * CARD_HEIGHT}px)`;
  items.innerHTML = "";

  for (let i = start; i < end; i++) {
    items.appendChild(createCard(filtered[i]));
  }
}

function createCard(item) {
  const li = document.createElement("li");
  li.className = "card";
  li.innerHTML = `
    <article>
        <time datetime="20${item.year}-${item.month}-${item.day} ${item.time}">${item.time ? `${item.time}` : ""}</time>
        <h5>${item.description}</h5>
        ${item.title ? `<p>${item.title}</p>` : ""}
    </article>
  `;
  return li;
}

/********************
 * SEARCH (DEBOUNCED)
 ********************/
let timer;
searchInput.addEventListener("input", e => {
  clearTimeout(timer);
  timer = setTimeout(() => {
    const q = e.target.value.toLowerCase().trim();

    filtered = q
      ? data.filter(d => d.searchText.includes(q))
      : data;

    viewport.scrollTop = 0;
    updateSpacer();
    render();
  }, 150);
});

/********************
 * EVENTS
 ********************/
viewport.addEventListener("scroll", render);

/********************
 * INIT
 ********************/
loadData();
