


/*HIDE EMPTY DAYS AND MONTHS*/
// Function to update container visibility
function updateDayOverlay() {
  const containers = document.querySelectorAll('.day-overlay');

  containers.forEach(container => {
    const childrenExceptFirst = Array.from(container.children).slice(1);

    if (childrenExceptFirst.length === 0) return;

    const allHidden = childrenExceptFirst.every(child => {
      return window.getComputedStyle(child).display === 'none';
    });

    container.style.display = allHidden ? 'none' : '';
  });
}

// Attach change listeners to all checkboxes
document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
  checkbox.addEventListener('change', updateDayOverlay);
});

// Wait until the browser has applied CSS to accurately detect visibility
window.addEventListener('load', () => {
  // Use requestAnimationFrame to ensure styles are applied
  requestAnimationFrame(updateDayOverlay);
});



// Function to update container visibility
function updateMonthOverlay() {
  const containers = document.querySelectorAll('.month-overlay');

  containers.forEach(container => {
    const childrenExceptFirst = Array.from(container.children).slice(1);

    if (childrenExceptFirst.length === 0) return;

    const allHidden = childrenExceptFirst.every(child => {
      return window.getComputedStyle(child).display === 'none';
    });

    container.style.display = allHidden ? 'none' : '';
  });
}

// Attach change listeners to all checkboxes
document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
  checkbox.addEventListener('change', updateMonthOverlay);
});

// Wait until the browser has applied CSS to accurately detect visibility
window.addEventListener('load', () => {
  // Use requestAnimationFrame to ensure styles are applied
  requestAnimationFrame(updateMonthOverlay);
});





/*lazy load*/
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





/*SEARCH */
function filterItems() {
  const input = document.getElementById("search").value.toLowerCase();
  const items = document.querySelectorAll(".entry-overlay");

  items.forEach(item => {
    const pText = item.querySelector("p")?.textContent.toLowerCase() || "";
    const h5Text = item.querySelector("h5")?.textContent.toLowerCase() || "";

    if (pText.includes(input) || h5Text.includes(input)) {
      item.style.display = "";
    } else {
      item.style.display = "none";
    }
  });
}










/*REMEMBER CHECKBOX AND RADIO STATES*/

// document.addEventListener("DOMContentLoaded", () => {
//   const inputs = document.querySelectorAll("input[type=checkbox], input[type=radio]");

//   // Load saved state
//   inputs.forEach(input => {
//     const saved = localStorage.getItem(input.name + "_" + input.value);

//     if (input.type === "checkbox" && saved === "true") {
//       input.checked = true;
//     }

//     if (input.type === "radio" && saved === "true") {
//       input.checked = true;
//     }
//   });

//   // Save state on change
//   inputs.forEach(input => {
//     input.addEventListener("change", () => {
//       if (input.type === "checkbox") {
//         localStorage.setItem(input.name + "_" + input.value, input.checked);
//       }

//       if (input.type === "radio") {
//         // Clear other radios in same group
//         document.querySelectorAll(`input[name="${input.name}"]`)
//           .forEach(radio => {
//             localStorage.setItem(radio.name + "_" + radio.value, false);
//           });

//         localStorage.setItem(input.name + "_" + input.value, true);
//       }
//     });
//   });
// });




// const colorThemes = document.querySelectorAll('[name="theme"]');

// // store theme
// const storeTheme = function (theme) {
//   localStorage.setItem("theme", theme);
// };

// // set theme when visitor returns
// const setTheme = function () {
//   const activeTheme = localStorage.getItem("theme");
//   colorThemes.forEach((themeOption) => {
//     if (themeOption.id === activeTheme) {
//       themeOption.checked = true;
//     }
//   });
//   // fallback for no :has() support
//   document.documentElement.className = activeTheme;
// };

// colorThemes.forEach((themeOption) => {
//   themeOption.addEventListener("click", () => {
//     storeTheme(themeOption.id);
//     // fallback for no :has() support
//     document.documentElement.className = themeOption.id;
//   });
// });

// document.onload = setTheme();


// document.querySelectorAll("input").forEach(input => {
//   input.addEventListener("change", () => {
//     if (input.type === "checkbox") {
//       localStorage.setItem(input.id, input.checked);
//     } else if (input.type === "radio") {
//       if (input.checked) {
//         localStorage.setItem(input.name, input.value);
//       }
//     } else {
//       localStorage.setItem(input.id, input.value);
//     }
//   });
// });

// document.querySelectorAll("input").forEach(input => {
//   if (input.type === "checkbox") {
//     input.checked = localStorage.getItem(input.id) === "true";
//   } else if (input.type === "radio") {
//     if (localStorage.getItem(input.name) === input.value) {
//       input.checked = true;
//     }
//   } else {
//     input.value = localStorage.getItem(input.id) || "";
//   }
// });


// document.querySelectorAll('.day-overlay').forEach(parent => {
//   const visibleElements = Array.from(parent.children)
//     .filter(el => getComputedStyle(el).display !== 'none');

//   if (visibleElements[1]) {
//     visibleElements[1].classList.add('second-visible');
//   }
// });





/*SAVE CHECKBOXES STATE*/
// Get all checkboxes
const checkboxes = document.querySelectorAll('input[type="checkbox"]');

// Load saved states on page load
window.addEventListener('DOMContentLoaded', () => {
  checkboxes.forEach(checkbox => {
    const saved = localStorage.getItem(checkbox.id);
    if (saved !== null) {
      checkbox.checked = saved === 'true';
    }
  });
});

// Save state when changed
checkboxes.forEach(checkbox => {
  checkbox.addEventListener('change', () => {
    localStorage.setItem(checkbox.id, checkbox.checked);
  });
});





// Get all radios
const radios = document.querySelectorAll('input[type="radio"]');

// Restore on load
window.addEventListener('DOMContentLoaded', () => {
  const groups = [...new Set([...radios].map(r => r.name))];

  groups.forEach(name => {
    const savedId = localStorage.getItem(name);
    if (savedId) {
      const radio = document.getElementById(savedId);
      if (radio) {
        radio.checked = true;
      }
    }
  });
});

// Save on change
radios.forEach(radio => {
  radio.addEventListener('change', () => {
    if (radio.checked) {
      localStorage.setItem(radio.name, radio.id);
    }
  });
});




/*ORDER*/
// Get all containers
const containers = document.querySelectorAll('.timeline, .month-overlay, .day-overlay');

// Store original order indices for restoring
containers.forEach(container => {
  Array.from(container.children).forEach((child, i) => {
    child.dataset.index = i;
    child.classList.add('visible'); // ensures starting visibility
  });
});

// Function to update order
function updateOrder(reverse, animate = true) {
  containers.forEach(container => {
    const children = Array.from(container.children);
    const first = children.shift();
    let rest = reverse
      ? children.reverse()
      : children.sort((a, b) => a.dataset.index - b.dataset.index);

    if (animate) {
      // Animate fade-out → reorder → fade-in
      container.classList.add('flipping');
      children.forEach(child => child.classList.remove('visible'));

      setTimeout(() => {
        container.innerHTML = '';
        container.appendChild(first);
        rest.forEach(el => container.appendChild(el));

        requestAnimationFrame(() => {
          container.classList.remove('flipping');
          Array.from(container.children).forEach(el => el.classList.add('visible'));
        });
      }, 1);
    } else {
      // No animation (used for initial page load)
      container.innerHTML = '';
      container.appendChild(first);
      rest.forEach(el => container.appendChild(el));
    }
  });
}

// Radio listeners
document.getElementById('oldestfirst').addEventListener('change', e => {
  if (e.target.checked) updateOrder(false);
});
document.getElementById('newestfirst').addEventListener('change', e => {
  if (e.target.checked) updateOrder(true);
});

// ✅ On page load: detect which radio is selected, apply order (no animation)
window.addEventListener('DOMContentLoaded', () => {
  const newestfirstChecked = document.getElementById('newestfirst').checked;
  updateOrder(newestfirstChecked, false); // no animation on first render
});
