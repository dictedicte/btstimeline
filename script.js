
/* ==================================================
   SHOW DATE HEADER ON SCROLL
================================================== */

const element = document.querySelector("header");
const showAfter = 3;

window.addEventListener("scroll", () => {
    if (window.scrollY > showAfter) {
        element.classList.add("show-after");
    } else {
        element.classList.remove("show-after");
    }
});


/* ==================================================
   LAZY LOAD
================================================== */

function observeElements(selector, observerName) {
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("loaded");
                obs.unobserve(entry.target);
            }
        });
    });

    document.querySelectorAll(selector).forEach(el => {
        observer.observe(el);
    });

    return observer;
}

const observer = observeElements(".icon");
const observer2 = observeElements(".link");
const observer3 = observeElements(".links");
const observer4 = observeElements(".entry-overlay");
const observer5 = observeElements(".date");
const observer6 = observeElements(".time");


/* ==================================================
   HOVER EFFECT / CLICK EFFECT
================================================== */

const items = document.querySelectorAll(".entry");

items.forEach(item => {

    item.addEventListener("click", function(e) {
        e.stopPropagation();

        items.forEach(i => {
            if (i !== this) {
                i.classList.remove("active", "clicked");
            }
        });

        this.classList.add("active", "clicked");
    });

    item.addEventListener("mouseenter", function() {

        if (!this.classList.contains("clicked")) {

            items.forEach(i => {
                if (!i.classList.contains("clicked")) {
                    i.classList.remove("active");
                }
            });

            this.classList.add("active");
        }

    });

    item.addEventListener("mouseleave", function() {

        if (!this.classList.contains("clicked")) {
            this.classList.remove("active");
        }

    });

});

document.addEventListener("click", () => {

    items.forEach(item => {
        item.classList.remove("active", "clicked");
    });

});


/* ==================================================
   MULTI SEARCH
================================================== */

const searchBar = document.querySelector(".searchbar");
const searchInputs = document.getElementById("searchInputs");
const addSearchButton = document.getElementById("addSearch");
const suggestionsBox = document.getElementById("suggestions");

const suggestions = document.querySelectorAll(".suggestion-data");

const searchStorageKey = "timelineSearch";

// The input currently being used for suggestions
let activeSearchInput = null;

// Input sizing limits
const minSearchWidth = 15;
const maxSearchWidth = 300;


/* --------------------------------------------------
   RESIZE INPUT TO FIT ITS TEXT
-------------------------------------------------- */

const searchCanvas = document.createElement("canvas");
const searchContext = searchCanvas.getContext("2d");

function resizeSearchInput(input) {

    const styles = getComputedStyle(input);

    searchContext.font = styles.font;

    const textWidth = searchContext.measureText(
        input.value || ""
    ).width;

    const padding =
        parseFloat(styles.paddingLeft) +
        parseFloat(styles.paddingRight);

    const borders =
        parseFloat(styles.borderLeftWidth) +
        parseFloat(styles.borderRightWidth);

    const width = Math.min(
        maxSearchWidth,
        Math.max(
            minSearchWidth,
            Math.ceil(textWidth + padding + borders + 4)
        )
    );

    input.style.width = width + "px";

}


/* --------------------------------------------------
   GET ALL SEARCH INPUTS
-------------------------------------------------- */

function getSearchInputs() {

    return [
        ...searchInputs.querySelectorAll(".search-input")
    ];

}


/* --------------------------------------------------
   SAVE SEARCHES
-------------------------------------------------- */

function saveSearches() {

    const searches = getSearchInputs().map(input => {
        return input.value;
    });

    sessionStorage.setItem(
        searchStorageKey,
        JSON.stringify(searches)
    );

}


/* --------------------------------------------------
   CREATE A SEARCH INPUT
-------------------------------------------------- */

function createSearchInput(value = "") {

    const searchGroup = document.createElement("div");
    searchGroup.className = "search-group";

    const input = document.createElement("input");

    input.type = "text";
    input.className = "search-input";
    // input.placeholder = "Search...";
    input.autocomplete = "off";
    input.value = value;

    const closeButton = document.createElement("button");

    closeButton.type = "button";
    closeButton.className = "close-search";
    closeButton.textContent = "×";
    closeButton.setAttribute("aria-label", "Remove search");

    // WHEN TYPING
    input.addEventListener("input", () => {

        resizeSearchInput(input);

        showSuggestions(input.value);

        filterItems();

        saveSearches();

    });

    // WHEN FOCUSING THE INPUT
    input.addEventListener("focus", () => {

        activeSearchInput = input;

        showSuggestions(input.value);

    });

    // REMOVE THIS SEARCH
    closeButton.addEventListener("click", () => {

        searchGroup.remove();

        if (activeSearchInput === input) {
            activeSearchInput = null;
        }

        suggestionsBox.style.display = "none";

        filterItems();

        saveSearches();

    });

    searchGroup.appendChild(input);
    searchGroup.appendChild(closeButton);

    searchInputs.appendChild(searchGroup);

    resizeSearchInput(input);

    return input;

}


/* --------------------------------------------------
   ADD SEARCH BUTTON
-------------------------------------------------- */

addSearchButton.addEventListener("click", () => {

    const input = createSearchInput();

    saveSearches();

    input.focus();

});


/* --------------------------------------------------
   FILTER TIMELINE ENTRIES
-------------------------------------------------- */

function filterItems() {

    const searches = getSearchInputs()
        .map(input => input.value.trim().toLowerCase())
        .filter(value => value !== "");

    const items = document.querySelectorAll(".entry-overlay");

    items.forEach(item => {

        // Search all p and h4 elements,
        // including elements with display:none
        const searchableText = [
            ...item.querySelectorAll("p, h4")
        ]
            .map(element => element.textContent.toLowerCase())
            .join(" ");

        // An entry must match at least one search.
        // No non-empty searches means show all entries.
        const matchesSearch =
            searches.length === 0 ||
            searches.some(search =>
                searchableText.includes(search)
            );

        item.style.display = matchesSearch ? "" : "none";

    });

    updateWrappers();

}


/* --------------------------------------------------
   SHOW SUGGESTIONS
-------------------------------------------------- */

function showSuggestions(filter = "") {

    suggestionsBox.innerHTML = "";

    suggestions.forEach(suggestion => {

        const text =
            suggestion.querySelector("span").textContent;

        if (
            filter === "" ||
            text.toLowerCase().includes(filter.toLowerCase())
        ) {

            const item = suggestion.cloneNode(true);

            item.classList.add("suggestion-item");

            item.addEventListener("click", () => {

                const input = activeSearchInput;

                if (!input || !input.isConnected) {
                    return;
                }

                input.value = text;

                resizeSearchInput(input);

                suggestionsBox.style.display = "none";

                filterItems();

                saveSearches();

                input.focus();

            });

            suggestionsBox.appendChild(item);

        }

    });

    suggestionsBox.style.display =
        suggestionsBox.children.length ? "block" : "none";

}


/* --------------------------------------------------
   TRACK ACTIVE SEARCH INPUT
-------------------------------------------------- */

searchInputs.addEventListener("focusin", event => {

    if (event.target.classList.contains("search-input")) {
        activeSearchInput = event.target;
    }

});


/* --------------------------------------------------
   CLICK OUTSIDE SEARCHBAR
-------------------------------------------------- */

document.addEventListener("click", event => {

    if (!searchBar.contains(event.target)) {
        suggestionsBox.style.display = "none";
    }

});


/* ==================================================
   FLIP ORDER
================================================== */

const timeline = document.querySelector(".timeline");

const dateGroups =
    document.querySelectorAll(".date-group");


/* --------------------------------------------------
   STORE ORIGINAL DATE ORDER
-------------------------------------------------- */

Array.from(timeline.children).forEach((child, i) => {
    child.dataset.index = i;
});


/* --------------------------------------------------
   STORE ORIGINAL TIME + ENTRY ORDER
-------------------------------------------------- */

dateGroups.forEach(dateGroup => {

    const timeGroups =
        dateGroup.querySelectorAll(":scope > .time-group");

    timeGroups.forEach((timeGroup, i) => {

        timeGroup.dataset.index = i;

        Array.from(
            timeGroup.querySelectorAll(":scope > .entry-overlay")
        ).forEach((entry, j) => {

            entry.dataset.index = j;

        });

    });

});


/* --------------------------------------------------
   UPDATE ORDER
-------------------------------------------------- */

function updateOrder(reverse, animate = true) {

    // ORDER DATE GROUPS

    const dateChildren = Array.from(timeline.children);

    const orderedDates = reverse
        ? [...dateChildren].reverse()
        : [...dateChildren].sort((a, b) =>
            Number(a.dataset.index) - Number(b.dataset.index)
        );


    // ORDER TIME GROUPS

    const orderedTimeGroups = new Map();

    dateGroups.forEach(dateGroup => {

        const timeGroups = Array.from(
            dateGroup.querySelectorAll(":scope > .time-group")
        );

        const specifiedTimeGroups = timeGroups.filter(
            timeGroup =>
                !timeGroup.classList.contains("time-unspecified")
        );

        const unspecifiedTimeGroup = timeGroups.find(
            timeGroup =>
                timeGroup.classList.contains("time-unspecified")
        );

        const orderedSpecifiedTimes = reverse
            ? [...specifiedTimeGroups].reverse()
            : [...specifiedTimeGroups].sort((a, b) =>
                Number(a.dataset.index) - Number(b.dataset.index)
            );

        if (unspecifiedTimeGroup) {
            orderedSpecifiedTimes.push(unspecifiedTimeGroup);
        }

        orderedTimeGroups.set(dateGroup, orderedSpecifiedTimes);

    });


    // ORDER ENTRIES

    const orderedEntries = new Map();

    dateGroups.forEach(dateGroup => {

        const timeGroups =
            dateGroup.querySelectorAll(":scope > .time-group");

        timeGroups.forEach(timeGroup => {

            const entries = Array.from(
                timeGroup.querySelectorAll(":scope > .entry-overlay")
            );

            const ordered =
                timeGroup.classList.contains("time-unspecified")
                    ? [...entries]
                    : reverse
                        ? [...entries].reverse()
                        : [...entries].sort((a, b) =>
                            Number(a.dataset.index) - Number(b.dataset.index)
                        );

            orderedEntries.set(timeGroup, ordered);

        });

    });


    // ANIMATION

    if (animate) {

        timeline.classList.add("flipping");

        dateGroups.forEach(dateGroup => {

            dateGroup.classList.add("flipping");

            dateGroup
                .querySelectorAll(":scope > .time-group")
                .forEach(timeGroup => {

                    timeGroup.classList.add("flipping");

                    timeGroup
                        .querySelectorAll(":scope > .entry-overlay")
                        .forEach(entry => {
                            entry.classList.remove("visible");
                        });

                });

        });

        setTimeout(() => {

            orderedDates.forEach(dateGroup => {
                timeline.appendChild(dateGroup);
            });

            orderedTimeGroups.forEach((timeGroups, dateGroup) => {

                timeGroups.forEach(timeGroup => {
                    dateGroup.appendChild(timeGroup);
                });

            });

            orderedEntries.forEach((entries, timeGroup) => {

                entries.forEach(entry => {
                    timeGroup.appendChild(entry);
                });

            });

            requestAnimationFrame(() => {

                timeline.classList.remove("flipping");

                dateGroups.forEach(dateGroup => {

                    dateGroup.classList.remove("flipping");

                    dateGroup
                        .querySelectorAll(":scope > .time-group")
                        .forEach(timeGroup => {

                            timeGroup.classList.remove("flipping");

                            timeGroup
                                .querySelectorAll(":scope > .entry-overlay")
                                .forEach(entry => {
                                    entry.classList.add("visible");
                                });

                        });

                });

            });

        }, 1);

    } else {

        orderedDates.forEach(dateGroup => {
            timeline.appendChild(dateGroup);
        });

        orderedTimeGroups.forEach((timeGroups, dateGroup) => {

            timeGroups.forEach(timeGroup => {
                dateGroup.appendChild(timeGroup);
            });

        });

        orderedEntries.forEach((entries, timeGroup) => {

            entries.forEach(entry => {
                timeGroup.appendChild(entry);
            });

        });

    }

}


/* --------------------------------------------------
   ORDER RADIO BUTTONS
-------------------------------------------------- */

document.getElementById("oldestfirst")
    .addEventListener("change", e => {

        if (e.target.checked) {
            updateOrder(false);
            saveRadioSettings();
        }

    });

document.getElementById("newestfirst")
    .addEventListener("change", e => {

        if (e.target.checked) {
            updateOrder(true);
            saveRadioSettings();
        }

    });


/* ==================================================
   FILTER
================================================== */

const filterCheckboxes = document.querySelectorAll(
    ".category-checkbox, " +
    ".filter-mediatype input[type='checkbox'], " +
    ".filter-duration input[type='checkbox']"
);

const storageKey = "timelineCheckboxStates";


/* --------------------------------------------------
   PARSE MEDIA DURATION
-------------------------------------------------- */

function parseDuration(text) {

    text = text.trim();

    if (!text.includes(":")) {
        return null;
    }

    const parts = text.split(":");

    if (parts.length !== 2 && parts.length !== 3) {
        return null;
    }

    const numbers = parts.map(Number);

    if (numbers.some(number => !Number.isFinite(number))) {
        return null;
    }

    let seconds;

    if (parts.length === 2) {

        const minutes = numbers[0];
        const secs = numbers[1];

        seconds = minutes * 60 + secs;

    } else {

        const hours = numbers[0];
        const minutes = numbers[1];
        const secs = numbers[2];

        seconds = hours * 3600 + minutes * 60 + secs;

    }

    return seconds;

}


/* --------------------------------------------------
   CHECK DURATION
-------------------------------------------------- */

function durationMatches(seconds, checkedDurations) {

    if (seconds === null) {
        return checkedDurations.includes("duration-unspecified");
    }

    if (
        checkedDurations.includes("duration-0-10") &&
        seconds <= 10 * 60
    ) {
        return true;
    }

    if (
        checkedDurations.includes("duration-10-30") &&
        seconds > 10 * 60 &&
        seconds <= 30 * 60
    ) {
        return true;
    }

    if (
        checkedDurations.includes("duration-30-60") &&
        seconds > 30 * 60 &&
        seconds <= 60 * 60
    ) {
        return true;
    }

    if (
        checkedDurations.includes("duration-60-plus") &&
        seconds > 60 * 60
    ) {
        return true;
    }

    return false;

}


/* --------------------------------------------------
   CHECK MEDIA DURATION
-------------------------------------------------- */

function mediaHasMatchingDuration(mediaElements, checkedDurations) {

    return [...mediaElements].some(mediaElement => {

        const seconds = parseDuration(mediaElement.textContent);

        return durationMatches(seconds, checkedDurations);

    });

}


/* --------------------------------------------------
   UPDATE VISIBILITY
-------------------------------------------------- */

function updateVisibility() {

    const checkedCategories = [
        ...document.querySelectorAll(".category-checkbox")
    ]
        .filter(checkbox => checkbox.checked)
        .map(checkbox => checkbox.id);

    const checkedMedia = [
        ...document.querySelectorAll(
            ".filter-mediatype input[type='checkbox']"
        )
    ]
        .filter(checkbox => checkbox.checked)
        .map(checkbox => checkbox.id);

    const checkedDurations = [
        ...document.querySelectorAll(
            ".filter-duration input[type='checkbox']"
        )
    ]
        .filter(checkbox => checkbox.checked)
        .map(checkbox => checkbox.id);


    document.querySelectorAll(".entry-overlay").forEach(item => {

        // CATEGORY FILTER

        const categoryMatch = checkedCategories.some(category =>
            item.classList.contains(category)
        );


        // FIND MEDIA

        const videoElements = item.querySelectorAll(".media-video");
        const imageElements = item.querySelectorAll(".media-image");
        const audioElements = item.querySelectorAll(".media-audio");

        const hasVideo = videoElements.length > 0;
        const hasImage = imageElements.length > 0;
        const hasAudio = audioElements.length > 0;

        const mediaNone = !hasVideo && !hasImage && !hasAudio;


        // DURATION

        const videoDurationMatch =
            hasVideo &&
            mediaHasMatchingDuration(videoElements, checkedDurations);

        const audioDurationMatch =
            hasAudio &&
            mediaHasMatchingDuration(audioElements, checkedDurations);


        // MEDIA FILTER

        const imageMatch =
            checkedMedia.includes("media-image") && hasImage;

        const videoMatch =
            checkedMedia.includes("media-video") && videoDurationMatch;

        const audioMatch =
            checkedMedia.includes("media-audio") && audioDurationMatch;

        const noneMatch =
            checkedMedia.includes("media-none") && mediaNone;

        const mediaMatch =
            imageMatch || videoMatch || audioMatch || noneMatch;


        // COMBINE CATEGORY + MEDIA FILTERS

        item.classList.toggle(
            "hidden",
            !(categoryMatch && mediaMatch)
        );

    });

    updateWrappers();

}


/* --------------------------------------------------
   SAVE CHECKBOX STATES
-------------------------------------------------- */

function saveCheckboxStates() {

    const states =
        JSON.parse(sessionStorage.getItem(storageKey)) || {};

    filterCheckboxes.forEach(checkbox => {
        states[checkbox.id] = checkbox.checked;
    });

    sessionStorage.setItem(storageKey, JSON.stringify(states));

}


/* --------------------------------------------------
   RESTORE CHECKBOX STATES
-------------------------------------------------- */

function restoreCheckboxStates() {

    const savedStates =
        JSON.parse(sessionStorage.getItem(storageKey));

    if (!savedStates) {
        return;
    }

    filterCheckboxes.forEach(checkbox => {

        if (savedStates[checkbox.id] !== undefined) {
            checkbox.checked = savedStates[checkbox.id];
        }

    });

}


/* --------------------------------------------------
   CHECKBOX CHANGE EVENTS
-------------------------------------------------- */

filterCheckboxes.forEach(checkbox => {

    checkbox.addEventListener("change", () => {

        updateVisibility();
        saveCheckboxStates();
        updateAllToggleButtons();

    });

});


/* ==================================================
   TOGGLE ALL FILTER BUTTONS
================================================== */

const toggleAllButtons = document.querySelectorAll(".toggle-all");


function getFilterGroupCheckboxes(group) {

    if (group === "categories") {
        return document.querySelectorAll(".category-checkbox");
    }

    if (group === "media") {
        return document.querySelectorAll(
            ".filter-mediatype input[type='checkbox']"
        );
    }

    if (group === "duration") {
        return document.querySelectorAll(
            ".filter-duration input[type='checkbox']"
        );
    }

    return [];

}


function updateToggleButton(button) {

    const group = button.dataset.filterGroup;

    const checkboxes = getFilterGroupCheckboxes(group);

    const allChecked = [...checkboxes].every(
        checkbox => checkbox.checked
    );

    button.textContent = allChecked
        ? "Deselect all"
        : "Select all";

}


function updateAllToggleButtons() {

    toggleAllButtons.forEach(button => {
        updateToggleButton(button);
    });

}


toggleAllButtons.forEach(button => {

    button.addEventListener("click", () => {

        const group = button.dataset.filterGroup;

        const checkboxes = getFilterGroupCheckboxes(group);

        const allChecked = [...checkboxes].every(
            checkbox => checkbox.checked
        );

        checkboxes.forEach(checkbox => {
            checkbox.checked = !allChecked;
        });

        updateToggleButton(button);

        updateVisibility();

        saveCheckboxStates();

        updateAllToggleButtons();

    });

});


/* ==================================================
   SETTINGS STORAGE
================================================== */

const sessionRadioSettings = [
    "order",
    "compactability"
];

const localRadioSettings = [
    "language",
    "theme",
    "time"
];


/* --------------------------------------------------
   SAVE RADIO SETTINGS
-------------------------------------------------- */

function saveRadioSettings() {

    sessionRadioSettings.forEach(name => {

        const selected = document.querySelector(
            `input[type="radio"][name="${name}"]:checked`
        );

        if (selected) {
            sessionStorage.setItem(
                `timeline-${name}`,
                selected.id
            );
        }

    });

    localRadioSettings.forEach(name => {

        const selected = document.querySelector(
            `input[type="radio"][name="${name}"]:checked`
        );

        if (selected) {
            localStorage.setItem(
                `timeline-${name}`,
                selected.id
            );
        }

    });

}


/* --------------------------------------------------
   RESTORE RADIO SETTINGS
-------------------------------------------------- */

function restoreRadioSettings() {

    sessionRadioSettings.forEach(name => {

        const savedId = sessionStorage.getItem(
            `timeline-${name}`
        );

        if (savedId) {

            const radio = document.getElementById(savedId);

            if (radio) {
                radio.checked = true;
            }

        }

    });

    localRadioSettings.forEach(name => {

        const savedId = localStorage.getItem(
            `timeline-${name}`
        );

        if (savedId) {

            const radio = document.getElementById(savedId);

            if (radio) {
                radio.checked = true;
            }

        }

    });

}


/* --------------------------------------------------
   RADIO CHANGE EVENTS
-------------------------------------------------- */

document.querySelectorAll(
    'input[type="radio"][name="order"], ' +
    'input[type="radio"][name="compactability"], ' +
    'input[type="radio"][name="language"], ' +
    'input[type="radio"][name="theme"], ' +
    'input[type="radio"][name="time"]'
).forEach(radio => {

    radio.addEventListener("change", () => {
        saveRadioSettings();
    });

});


/* ==================================================
   UPDATE WRAPPERS WITH EMPTY RESULTS
================================================== */

function updateWrappers() {

    const dateGroups = document.querySelectorAll(".date-group");

    dateGroups.forEach(dateGroup => {

        const timeGroups =
            dateGroup.querySelectorAll(":scope > .time-group");

        timeGroups.forEach(timeGroup => {

            const entries =
                timeGroup.querySelectorAll(":scope > .entry-overlay");

            const allHidden = [...entries].every(entry =>
                entry.style.display === "none" ||
                entry.classList.contains("hidden")
            );

            timeGroup.style.display = allHidden ? "none" : "";

        });

        const allTimeGroupsHidden = [...timeGroups].every(
            timeGroup => timeGroup.style.display === "none"
        );

        dateGroup.style.display =
            allTimeGroupsHidden ? "none" : "";

    });

    const allDateGroupsHidden = [...dateGroups].every(
        dateGroup => dateGroup.style.display === "none"
    );

    document.getElementById("empty-results").style.display =
        allDateGroupsHidden ? "" : "none";

}


/* ==================================================
   INITIAL PAGE SETUP
================================================== */

window.addEventListener("DOMContentLoaded", () => {

    // RESTORE SAVED RADIO SETTINGS

    restoreRadioSettings();


    // RESTORE SAVED CHECKBOX SETTINGS

    restoreCheckboxStates();


    // RESTORE SAVED SEARCHES

    const savedSearches =
        sessionStorage.getItem(searchStorageKey);

    if (savedSearches !== null) {

        let searches;

        try {

            searches = JSON.parse(savedSearches);

            // Support old saved single-search strings
            if (!Array.isArray(searches)) {
                searches = [savedSearches];
            }

        } catch (error) {

            searches = [savedSearches];

        }

        searchInputs.innerHTML = "";

        searches.forEach(search => {
            createSearchInput(search);
        });

    }


    // APPLY ORDER

    const newestfirst = document.getElementById("newestfirst");

    if (newestfirst.checked) {
        updateOrder(true, false);
    } else {
        updateOrder(false, false);
    }


    // APPLY SEARCH

    filterItems();


    // APPLY FILTERS

    updateVisibility();


    // UPDATE TOGGLE BUTTONS

    updateAllToggleButtons();

});