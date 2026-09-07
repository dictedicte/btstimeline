// ---SHOW DATE HEADER ON SCROLL---

const element = document.querySelector("header");
const showAfter = 3;

window.addEventListener("scroll", () => {
    if (window.scrollY > showAfter) {
        element.classList.add("show-after");
    } else {
        element.classList.remove("show-after");
    }
});


// ---LAZY LOAD ICON---

const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("loaded");
            obs.unobserve(entry.target);
        }
    });
});

document.querySelectorAll(".icon").forEach(el => {
    observer.observe(el);
});


// ---LAZY LOAD LINK---

const observer2 = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("loaded");
            obs.unobserve(entry.target);
        }
    });
});

document.querySelectorAll(".link").forEach(el => {
    observer2.observe(el);
});


// ---LAZY LOAD LINKS---

const observer3 = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("loaded");
            obs.unobserve(entry.target);
        }
    });
});

document.querySelectorAll(".links").forEach(el => {
    observer3.observe(el);
});


// ---LAZY LOAD ENTRY---

const observer4 = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("loaded");
            obs.unobserve(entry.target);
        }
    });
});

document.querySelectorAll(".entry-overlay").forEach(el => {
    observer4.observe(el);
});


// ---LAZY LOAD DATE---

const observer5 = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("loaded");
            obs.unobserve(entry.target);
        }
    });
});

document.querySelectorAll(".date").forEach(el => {
    observer5.observe(el);
});


// ---LAZY LOAD TIME---

const observer6 = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("loaded");
            obs.unobserve(entry.target);
        }
    });
});

document.querySelectorAll(".time").forEach(el => {
    observer6.observe(el);
});


// ==================================================
// HOVER EFFECT FIT MOBILE TOO
// ==================================================

const items = document.querySelectorAll('.entry');

items.forEach(item => {

    // CLICK behavior (persistent)
    item.addEventListener('click', function(e) {
        e.stopPropagation();

        // Remove active + clicked from others
        items.forEach(i => {
            if (i !== this) {
                i.classList.remove('active', 'clicked');
            }
        });

        // Mark this as clicked
        this.classList.add('active', 'clicked');
    });


    // HOVER IN (temporary)
    item.addEventListener('mouseenter', function() {

        // Only apply hover if it's not already clicked
        if (!this.classList.contains('clicked')) {

            items.forEach(i => {
                if (!i.classList.contains('clicked')) {
                    i.classList.remove('active');
                }
            });

            this.classList.add('active');
        }
    });


    // HOVER OUT (remove if not clicked)
    item.addEventListener('mouseleave', function() {

        if (!this.classList.contains('clicked')) {
            this.classList.remove('active');
        }

    });

});


// CLICK OUTSIDE → RESET EVERYTHING

document.addEventListener('click', () => {

    items.forEach(item => {
        item.classList.remove('active', 'clicked');
    });

});


// ==================================================
// SEARCHBAR
// ==================================================

const searchBar = document.getElementById('search');
const suggestionsBox = document.getElementById('suggestions');
const clearSearch = document.getElementById('clearSearch');

// Get suggestions from HTML
const suggestions = document.querySelectorAll('.suggestion-data');

// Search storage key
const searchStorageKey = 'timelineSearch';


function filterItems() {

    const input = searchBar.value.toLowerCase();
    const itemsy = document.querySelectorAll(".entry-overlay");

    itemsy.forEach(item => {

        // Search ALL p and h4 elements,
        // including elements with display:none
        const searchableText = [...item.querySelectorAll("p, h4")]
            .map(element => element.textContent.toLowerCase())
            .join(" ");

        item.style.display =
            searchableText.includes(input) ? "" : "none";
    });

    updateWrappers();
}


function updateClearButton() {

    clearSearch.style.display =
        searchBar.value ? 'block' : 'none';
}


// CLEAR SEARCH

clearSearch.addEventListener('click', () => {

    searchBar.value = '';

    suggestionsBox.style.display = 'none';

    filterItems();
    updateClearButton();

    // Save empty search
    sessionStorage.setItem(
        searchStorageKey,
        ''
    );

    searchBar.focus();

});


// SHOW SUGGESTIONS

function showSuggestions(filter = '') {

    suggestionsBox.innerHTML = '';

    suggestions.forEach(suggestion => {

        const text =
            suggestion.querySelector('span').textContent;

        if (
            filter === '' ||
            text.toLowerCase().includes(filter.toLowerCase())
        ) {

            // Clone the HTML suggestion
            const item = suggestion.cloneNode(true);

            item.classList.add('suggestion-item');

            item.addEventListener('click', () => {

                searchBar.value = text;
                suggestionsBox.style.display = 'none';

                filterItems();
                updateClearButton();

                // Save selected suggestion as search
                sessionStorage.setItem(
                    searchStorageKey,
                    searchBar.value
                );

            });

            suggestionsBox.appendChild(item);
        }
    });


    suggestionsBox.style.display =
        suggestionsBox.children.length ? 'block' : 'none';
}


// WHEN TYPING

searchBar.addEventListener('input', () => {

    showSuggestions(searchBar.value);
    filterItems();
    updateClearButton();

    // Save search text
    sessionStorage.setItem(
        searchStorageKey,
        searchBar.value
    );

});


// WHEN CLICKING SEARCH BAR

searchBar.addEventListener('focus', () => {

    showSuggestions(searchBar.value);

});


// CLICK OUTSIDE

document.addEventListener('click', (e) => {

    if (!document.querySelector('.searchbar').contains(e.target)) {
        suggestionsBox.style.display = 'none';
    }

});


updateClearButton();


// ==================================================
// FLIP ORDER
// ==================================================

const timeline = document.querySelector('.timeline');

const dateGroups =
    document.querySelectorAll('.date-group');


// --------------------------------------------------
// STORE ORIGINAL DATE ORDER
// --------------------------------------------------

Array.from(timeline.children).forEach((child, i) => {

    child.dataset.index = i;

});


// --------------------------------------------------
// STORE ORIGINAL TIME + ENTRY ORDER
// --------------------------------------------------

dateGroups.forEach(dateGroup => {

    const timeGroups =
        dateGroup.querySelectorAll(
            ':scope > .time-group'
        );

    timeGroups.forEach((timeGroup, i) => {

        timeGroup.dataset.index = i;


        // Store original entry order
        Array.from(
            timeGroup.querySelectorAll(
                ':scope > .entry-overlay'
            )
        ).forEach((entry, j) => {

            entry.dataset.index = j;

        });

    });

});


// --------------------------------------------------
// FUNCTION TO UPDATE ORDER
// --------------------------------------------------

function updateOrder(reverse, animate = true) {

    // ==================================================
    // ORDER DATE GROUPS
    // ==================================================

    const dateChildren =
        Array.from(timeline.children);

    const orderedDates = reverse
        ? [...dateChildren].reverse()
        : [...dateChildren].sort((a, b) =>
            Number(a.dataset.index) -
            Number(b.dataset.index)
        );


    // ==================================================
    // ORDER TIME GROUPS
    // ==================================================

    const orderedTimeGroups = new Map();

    dateGroups.forEach(dateGroup => {

        const timeGroups =
            Array.from(
                dateGroup.querySelectorAll(
                    ':scope > .time-group'
                )
            );

        // Separate the unspecified-time group
        const specifiedTimeGroups =
            timeGroups.filter(
                timeGroup =>
                    !timeGroup.classList.contains(
                        'time-unspecified'
                    )
            );

        const unspecifiedTimeGroup =
            timeGroups.find(
                timeGroup =>
                    timeGroup.classList.contains(
                        'time-unspecified'
                    )
            );

        // Reverse/sort only specified times
        const orderedSpecifiedTimes = reverse
            ? [...specifiedTimeGroups].reverse()
            : [...specifiedTimeGroups].sort((a, b) =>
                Number(a.dataset.index) -
                Number(b.dataset.index)
            );

        // Always put unspecified time last
        if (unspecifiedTimeGroup) {
            orderedSpecifiedTimes.push(
                unspecifiedTimeGroup
            );
        }

        orderedTimeGroups.set(
            dateGroup,
            orderedSpecifiedTimes
        );

    });


    // ==================================================
    // ORDER ENTRIES
    // ==================================================

    const orderedEntries = new Map();

    dateGroups.forEach(dateGroup => {

        const timeGroups =
            dateGroup.querySelectorAll(
                ':scope > .time-group'
            );

        timeGroups.forEach(timeGroup => {

            const entries =
                Array.from(
                    timeGroup.querySelectorAll(
                        ':scope > .entry-overlay'
                    )
                );

            // Keep unspecified-time entries in their
            // original order.
            const ordered =
                timeGroup.classList.contains(
                    'time-unspecified'
                )
                    ? [...entries]
                    : reverse
                        ? [...entries].reverse()
                        : [...entries].sort((a, b) =>
                            Number(a.dataset.index) -
                            Number(b.dataset.index)
                        );

            orderedEntries.set(
                timeGroup,
                ordered
            );

        });

    });


    // ==================================================
    // ANIMATION
    // ==================================================

    if (animate) {

        timeline.classList.add('flipping');

        dateGroups.forEach(dateGroup => {

            dateGroup.classList.add('flipping');

            dateGroup
                .querySelectorAll(
                    ':scope > .time-group'
                )
                .forEach(timeGroup => {

                    timeGroup.classList.add('flipping');

                    timeGroup
                        .querySelectorAll(
                            ':scope > .entry-overlay'
                        )
                        .forEach(entry => {

                            entry.classList.remove('visible');

                        });

                });

        });


        setTimeout(() => {

            // Reorder date groups
            orderedDates.forEach(dateGroup => {
                timeline.appendChild(dateGroup);
            });


            // Reorder time groups
            orderedTimeGroups.forEach(
                (timeGroups, dateGroup) => {

                    timeGroups.forEach(timeGroup => {
                        dateGroup.appendChild(timeGroup);
                    });

                }
            );


            // Reorder entries
            orderedEntries.forEach(
                (entries, timeGroup) => {

                    entries.forEach(entry => {
                        timeGroup.appendChild(entry);
                    });

                }
            );


            requestAnimationFrame(() => {

                timeline.classList.remove('flipping');

                dateGroups.forEach(dateGroup => {

                    dateGroup.classList.remove('flipping');

                    dateGroup
                        .querySelectorAll(
                            ':scope > .time-group'
                        )
                        .forEach(timeGroup => {

                            timeGroup.classList.remove('flipping');

                            timeGroup
                                .querySelectorAll(
                                    ':scope > .entry-overlay'
                                )
                                .forEach(entry => {

                                    entry.classList.add('visible');

                                });

                        });

                });

            });

        }, 1);


    } else {

        // Reorder date groups
        orderedDates.forEach(dateGroup => {
            timeline.appendChild(dateGroup);
        });


        // Reorder time groups
        orderedTimeGroups.forEach(
            (timeGroups, dateGroup) => {

                timeGroups.forEach(timeGroup => {
                    dateGroup.appendChild(timeGroup);
                });

            }
        );


        // Reorder entries
        orderedEntries.forEach(
            (entries, timeGroup) => {

                entries.forEach(entry => {
                    timeGroup.appendChild(entry);
                });

            }
        );

    }

}


// --------------------------------------------------
// ORDER RADIO BUTTONS
// --------------------------------------------------

document.getElementById('oldestfirst')
    .addEventListener('change', e => {

        if (e.target.checked) {

            updateOrder(false);
            saveRadioSettings();

        }

    });


document.getElementById('newestfirst')
    .addEventListener('change', e => {

        if (e.target.checked) {

            updateOrder(true);
            saveRadioSettings();

        }

    });


// ==================================================
// FILTER
// ==================================================

const filterCheckboxes = document.querySelectorAll(
    '.category-checkbox, ' +
    '.filter-mediatype input[type="checkbox"], ' +
    '.filter-duration input[type="checkbox"]'
);

const storageKey = 'timelineCheckboxStates';


// --------------------------------------------------
// PARSE MEDIA DURATION
// --------------------------------------------------

function parseDuration(text) {

    text = text.trim();

    // Must contain :
    // This prevents counters such as "3"
    // from being interpreted as durations.

    if (!text.includes(':')) {
        return null;
    }

    const parts = text.split(':');

    // Only allow MM:SS or HH:MM:SS

    if (parts.length !== 2 && parts.length !== 3) {
        return null;
    }

    const numbers = parts.map(Number);

    // Make sure every part is actually a number

    if (numbers.some(number => !Number.isFinite(number))) {
        return null;
    }

    let seconds;

    // MM:SS

    if (parts.length === 2) {

        const minutes = numbers[0];
        const secs = numbers[1];

        seconds =
            minutes * 60 +
            secs;

    }

    // HH:MM:SS

    else {

        const hours = numbers[0];
        const minutes = numbers[1];
        const secs = numbers[2];

        seconds =
            hours * 3600 +
            minutes * 60 +
            secs;

    }

    return seconds;

}


// --------------------------------------------------
// CHECK WHETHER A DURATION MATCHES
// --------------------------------------------------

function durationMatches(seconds, checkedDurations) {

    // ----------------------------------------------
    // UNSPECIFIED
    // ----------------------------------------------

    if (seconds === null) {

        return checkedDurations.includes(
            'duration-unspecified'
        );

    }


    // ----------------------------------------------
    // 0-10 MINUTES
    // ----------------------------------------------

    if (
        checkedDurations.includes('duration-0-10') &&
        seconds <= 10 * 60
    ) {

        return true;

    }


    // ----------------------------------------------
    // 10-30 MINUTES
    // ----------------------------------------------

    if (
        checkedDurations.includes('duration-10-30') &&
        seconds > 10 * 60 &&
        seconds <= 30 * 60
    ) {

        return true;

    }


    // ----------------------------------------------
    // 30-60 MINUTES
    // ----------------------------------------------

    if (
        checkedDurations.includes('duration-30-60') &&
        seconds > 30 * 60 &&
        seconds <= 60 * 60
    ) {

        return true;

    }


    // ----------------------------------------------
    // MORE THAN 60 MINUTES
    // ----------------------------------------------

    if (
        checkedDurations.includes('duration-60-plus') &&
        seconds > 60 * 60
    ) {

        return true;

    }


    return false;

}


// --------------------------------------------------
// CHECK WHETHER VIDEO/AUDIO HAS MATCHING DURATION
// --------------------------------------------------

function mediaHasMatchingDuration(
    mediaElements,
    checkedDurations
) {

    return [...mediaElements].some(mediaElement => {

        const seconds =
            parseDuration(
                mediaElement.textContent
            );

        return durationMatches(
            seconds,
            checkedDurations
        );

    });

}


// --------------------------------------------------
// UPDATE VISIBILITY
// --------------------------------------------------

function updateVisibility() {

    // ----------------------------------------------
    // GET CHECKED CATEGORY CHECKBOXES
    // ----------------------------------------------

    const checkedCategories =
        [...document.querySelectorAll(
            '.category-checkbox'
        )]
            .filter(checkbox => checkbox.checked)
            .map(checkbox => checkbox.id);


    // ----------------------------------------------
    // GET CHECKED MEDIA CHECKBOXES
    // ----------------------------------------------

    const checkedMedia =
        [...document.querySelectorAll(
            '.filter-mediatype input[type="checkbox"]'
        )]
            .filter(checkbox => checkbox.checked)
            .map(checkbox => checkbox.id);


    // ----------------------------------------------
    // GET CHECKED DURATION CHECKBOXES
    // ----------------------------------------------

    const checkedDurations =
        [...document.querySelectorAll(
            '.filter-duration input[type="checkbox"]'
        )]
            .filter(checkbox => checkbox.checked)
            .map(checkbox => checkbox.id);


    // ----------------------------------------------
    // CHECK EVERY ITEM
    // ----------------------------------------------

    document.querySelectorAll(
        '.entry-overlay'
    ).forEach(item => {

        // CATEGORY FILTER
        const categoryMatch =
            checkedCategories.some(category =>
                item.classList.contains(category)
            );


        // FIND MEDIA
        const videoElements =
            item.querySelectorAll('.media-video');

        const imageElements =
            item.querySelectorAll('.media-image');

        const audioElements =
            item.querySelectorAll('.media-audio');


        const hasVideo =
            videoElements.length > 0;

        const hasImage =
            imageElements.length > 0;

        const hasAudio =
            audioElements.length > 0;


        // NO MEDIA
        const mediaNone =
            !hasVideo &&
            !hasImage &&
            !hasAudio;


        // DURATION MATCHES
        const videoDurationMatch =
            hasVideo &&
            mediaHasMatchingDuration(
                videoElements,
                checkedDurations
            );

        const audioDurationMatch =
            hasAudio &&
            mediaHasMatchingDuration(
                audioElements,
                checkedDurations
            );


        // MEDIA FILTER
        /*
            Images are NOT affected by duration.

            Videos/audio DO need a matching duration.

            No-media is also not affected by duration.
        */

        const imageMatch =
            checkedMedia.includes('media-image') &&
            hasImage;

        const videoMatch =
            checkedMedia.includes('media-video') &&
            videoDurationMatch;

        const audioMatch =
            checkedMedia.includes('media-audio') &&
            audioDurationMatch;

        const noneMatch =
            checkedMedia.includes('media-none') &&
            mediaNone;


        const mediaMatch =
            imageMatch ||
            videoMatch ||
            audioMatch ||
            noneMatch;


        // MUST PASS CATEGORY + MEDIA FILTERS
        item.classList.toggle(
            'hidden',
            !(categoryMatch && mediaMatch)
        );

    });


    updateWrappers();

}


// --------------------------------------------------
// SAVE CHECKBOX STATES
// --------------------------------------------------

function saveCheckboxStates() {

    // Get states already saved by other pages
    const states =
        JSON.parse(
            sessionStorage.getItem(storageKey)
        ) || {};


    // Only update checkboxes that exist
    // on the current page
    filterCheckboxes.forEach(checkbox => {

        states[checkbox.id] =
            checkbox.checked;

    });


    sessionStorage.setItem(
        storageKey,
        JSON.stringify(states)
    );

}


// --------------------------------------------------
// RESTORE CHECKBOX STATES
// --------------------------------------------------

function restoreCheckboxStates() {

    const savedStates =
        JSON.parse(
            sessionStorage.getItem(storageKey)
        );

    if (!savedStates) {
        return;
    }


    filterCheckboxes.forEach(checkbox => {

        if (
            savedStates[checkbox.id] !== undefined
        ) {

            checkbox.checked =
                savedStates[checkbox.id];

        }

    });

}


// --------------------------------------------------
// CHECKBOX CHANGE EVENTS
// --------------------------------------------------

filterCheckboxes.forEach(checkbox => {

    checkbox.addEventListener('change', () => {

        updateVisibility();
        saveCheckboxStates();

        updateAllToggleButtons();

    });

});


// ==================================================
// TOGGLE ALL FILTER BUTTONS
// ==================================================

const toggleAllButtons =
    document.querySelectorAll('.toggle-all');


// --------------------------------------------------
// GET CHECKBOXES FOR A FILTER GROUP
// --------------------------------------------------

function getFilterGroupCheckboxes(group) {

    if (group === 'categories') {

        return document.querySelectorAll(
            '.category-checkbox'
        );

    }


    if (group === 'media') {

        return document.querySelectorAll(
            '.filter-mediatype input[type="checkbox"]'
        );

    }


    if (group === 'duration') {

        return document.querySelectorAll(
            '.filter-duration input[type="checkbox"]'
        );

    }


    return [];

}


// --------------------------------------------------
// UPDATE ONE TOGGLE BUTTON
// --------------------------------------------------

function updateToggleButton(button) {

    const group =
        button.dataset.filterGroup;

    const checkboxes =
        getFilterGroupCheckboxes(group);


    const allChecked =
        [...checkboxes].every(
            checkbox => checkbox.checked
        );


    button.textContent =
        allChecked
            ? 'Deselect all'
            : 'Select all';

}


// --------------------------------------------------
// UPDATE ALL TOGGLE BUTTONS
// --------------------------------------------------

function updateAllToggleButtons() {

    toggleAllButtons.forEach(button => {

        updateToggleButton(button);

    });

}


// --------------------------------------------------
// TOGGLE ALL CLICK EVENTS
// --------------------------------------------------

toggleAllButtons.forEach(button => {

    button.addEventListener('click', () => {

        const group =
            button.dataset.filterGroup;

        const checkboxes =
            getFilterGroupCheckboxes(group);


        const allChecked =
            [...checkboxes].every(
                checkbox => checkbox.checked
            );


        checkboxes.forEach(checkbox => {

            checkbox.checked =
                !allChecked;

        });


        updateToggleButton(button);

        updateVisibility();

        saveCheckboxStates();

        updateAllToggleButtons();

    });

});


// ==================================================
// SETTINGS STORAGE
// ==================================================

/*
    SESSION:
    - ORDER
    - COMPACTABILITY

    LOCAL:
    - LANGUAGE
    - THEME
    - TIME
*/


const sessionRadioSettings = [
    'order',
    'compactability'
];


const localRadioSettings = [
    'language',
    'theme',
    'time'
];


// --------------------------------------------------
// SAVE RADIO SETTINGS
// --------------------------------------------------

function saveRadioSettings() {

    // SESSION SETTINGS

    sessionRadioSettings.forEach(name => {

        const selected =
            document.querySelector(
                `input[type="radio"][name="${name}"]:checked`
            );


        if (selected) {

            sessionStorage.setItem(
                `timeline-${name}`,
                selected.id
            );

        }

    });


    // LOCAL SETTINGS

    localRadioSettings.forEach(name => {

        const selected =
            document.querySelector(
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


// --------------------------------------------------
// RESTORE RADIO SETTINGS
// --------------------------------------------------

function restoreRadioSettings() {

    // SESSION SETTINGS

    sessionRadioSettings.forEach(name => {

        const savedId =
            sessionStorage.getItem(
                `timeline-${name}`
            );


        if (savedId) {

            const radio =
                document.getElementById(savedId);


            if (radio) {
                radio.checked = true;
            }

        }

    });


    // LOCAL SETTINGS

    localRadioSettings.forEach(name => {

        const savedId =
            localStorage.getItem(
                `timeline-${name}`
            );


        if (savedId) {

            const radio =
                document.getElementById(savedId);


            if (radio) {
                radio.checked = true;
            }

        }

    });

}


// --------------------------------------------------
// RADIO CHANGE EVENTS
// --------------------------------------------------

document.querySelectorAll(
    'input[type="radio"][name="order"], ' +
    'input[type="radio"][name="compactability"], ' +
    'input[type="radio"][name="language"], ' +
    'input[type="radio"][name="theme"], ' +
    'input[type="radio"][name="time"]'
).forEach(radio => {

    radio.addEventListener('change', () => {

        saveRadioSettings();

    });

});


// ==================================================
// UPDATE WRAPPERS WITH "EMPTY RESULTS"
// ==================================================

function updateWrappers() {

    const dateGroups =
        document.querySelectorAll('.date-group');


    dateGroups.forEach(dateGroup => {

        const timeGroups =
            dateGroup.querySelectorAll(
                ':scope > .time-group'
            );


        timeGroups.forEach(timeGroup => {

            const entries =
                timeGroup.querySelectorAll(
                    ':scope > .entry-overlay'
                );


            const allHidden =
                [...entries].every(entry =>
                    entry.style.display === 'none' ||
                    entry.classList.contains('hidden')
                );


            timeGroup.style.display =
                allHidden ? 'none' : '';

        });


        const allTimeGroupsHidden =
            [...timeGroups].every(
                timeGroup =>
                    timeGroup.style.display === 'none'
            );


        dateGroup.style.display =
            allTimeGroupsHidden ? 'none' : '';

    });


    const allDateGroupsHidden =
        [...dateGroups].every(
            dateGroup =>
                dateGroup.style.display === 'none'
        );


    document.getElementById(
        'empty-results'
    ).style.display =
        allDateGroupsHidden ? '' : 'none';

}


// ==================================================
// INITIAL PAGE SETUP
// ==================================================

window.addEventListener('DOMContentLoaded', () => {

    // RESTORE SAVED RADIO SETTINGS
    restoreRadioSettings();


    // RESTORE SAVED CHECKBOX SETTINGS
    restoreCheckboxStates();


    // RESTORE SAVED SEARCH
    const savedSearch =
        sessionStorage.getItem(
            searchStorageKey
        );


    if (savedSearch !== null) {

        searchBar.value =
            savedSearch;

    }


    // APPLY ORDER
    const newestfirst =
        document.getElementById(
            'newestfirst'
        );


    if (newestfirst.checked) {

        updateOrder(true, false);

    } else {

        updateOrder(false, false);

    }


    // APPLY SEARCH
    if (searchBar.value) {

        filterItems();

    }


    // APPLY FILTERS
    updateVisibility();


    // UPDATE ALL TOGGLE BUTTONS
    updateAllToggleButtons();

});