
const element = document.querySelector("header");
const showAfter = 3;

window.addEventListener("scroll", () => {
    if (window.scrollY > showAfter) {
        element.classList.add("show-after");
    } else {
        element.classList.remove("show-after");
    }
});




// const checkboxxes = document.querySelectorAll('input[type="checkbox"]');

// function updateItems() {
//     checkboxxes.forEach(checkbox => {
//         const matchingItems = document.querySelectorAll(`.${checkbox.id}`);

//         matchingItems.forEach(item => {
//             item.classList.toggle('visible', checkbox.checked);
//         });
//     });
// }

// // Initial state
// updateItems();

// // Update on change
// checkboxxes.forEach(checkbox => {
//     checkbox.addEventListener('change', updateItems);
// });



// const checkboxxes = document.querySelectorAll('input[type="checkbox"]');

// function updateItems() {
//     checkboxxes.forEach(checkbox => {
//         const matchingItems = document.querySelectorAll(`.${checkbox.id}`);

//         matchingItems.forEach(item => {
//             item.style.display = checkbox.checked ? 'flex' : 'none';
//         });
//     });

//       updateWrappers();
    
// }

// // Run on page load
// updateItems();

// // Run whenever a checkbox changes
// checkboxxes.forEach(checkbox => {
//     checkbox.addEventListener('change', updateItems);
    
// });



function checkAll() {
  const checkboxes = document.querySelectorAll('.filter input[type="checkbox"]');
  checkboxes.forEach(cb => cb.checked = true);
}



/*lazy load icon*/
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

/*lazy load link*/
const observer2 = new IntersectionObserver((entries, obs) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("loaded");
      obs.unobserve(entry.target);
    }
  });
});

document.querySelectorAll(".link").forEach(el => {
  observer.observe(el);
});

/*lazy load links*/
const observer3 = new IntersectionObserver((entries, obs) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("loaded");
      obs.unobserve(entry.target);
    }
  });
});

document.querySelectorAll(".links").forEach(el => {
  observer.observe(el);
});




/*lazy load entry*/
const observer4 = new IntersectionObserver((entries, obs) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("loaded");
      obs.unobserve(entry.target);
    }
  });
});

document.querySelectorAll(".entry-overlay").forEach(el => {
  observer.observe(el);
});


/*lazy load date*/
const observer5 = new IntersectionObserver((entries, obs) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("loaded");
      obs.unobserve(entry.target);
    }
  });
});

document.querySelectorAll(".date").forEach(el => {
  observer.observe(el);
});



const searchBar = document.getElementById('search');
const suggestionsBox = document.getElementById('suggestions');
const itemss = document.querySelectorAll('.entry');

// Get suggestions from HTML
const suggestions = document.querySelectorAll('.suggestion-data');


function filterItems() {
  const input = document.getElementById("search").value.toLowerCase();
  const itemsy = document.querySelectorAll(".entry-overlay");

  itemsy.forEach(item => {
    const pText = item.querySelector("p")?.textContent.toLowerCase() || "";
    const h5Text = item.querySelector("h5")?.textContent.toLowerCase() || "";

    if (pText.includes(input) || h5Text.includes(input)) {
      item.style.display = "";
    } else {
      item.style.display = "none";
    }
  });


  updateWrappers();

}


// SHOW SUGGESTIONS
function showSuggestions(filter = '') {

    suggestionsBox.innerHTML = '';

    suggestions.forEach(suggestion => {

        const text = suggestion.querySelector('span').textContent;

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

});



// WHEN CLICKING SEARCH BAR
searchBar.addEventListener('focus', () => {

    showSuggestions(searchBar.value);

});

// CLICK OUTSIDE
document.addEventListener('click', (e) => {

    if (!document.querySelector('.search-filter-order').contains(e.target)) {

        suggestionsBox.style.display = 'none';

    }

});



// document.getElementById('clearButton').addEventListener('click', () => {
//     searchBar.value = '';
//     suggestionsBox.style.display = 'none';

//     document.querySelectorAll('.entry-overlay').forEach(item => {
//         item.style.display = '';
//     });

//     updateWrappers();
// });

function resetFilter() {

    searchBar.value = '';

    document.querySelectorAll('.entry-overlay').forEach(item => {
        item.style.display = '';
    });

    updateWrappers();

}
// document.getElementById('clearButton').addEventListener('click', () => {

//     suggestionsBox.style.display = 'none';
//     resetFilter();

// });


// document.querySelectorAll('.filter li').addEventListener('click', () => {

//   updateWrappers();

// });




/*ORDER*/
// Get all containers
const containers = document.querySelectorAll('.timeline, .date-overlay');

// Store original order indices for restoring
containers.forEach(container => {
  Array.from(container.children).forEach((child, i) => {
    child.dataset.index = i;
    // child.classList.add('visible'); // ?? ensures starting visibility
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





  const checkboxes2 = document.querySelectorAll('.filter input');
  const labels2 = document.querySelectorAll('.solo-check');

  labels2.forEach(label => {
    label.addEventListener('click', () => {
      const targetId = label.dataset.for;
      const targetCheckbox = document.getElementById(targetId);

      // Uncheck all
      checkboxes2.forEach(cb => cb.checked = false);

      // Check only the clicked one
      targetCheckbox.checked = true;
    });
  });






document.querySelectorAll('.filter .box li').forEach(el => {
    el.addEventListener('click', () => {
          
      updateWrappers();
    });
});

// function updateWrappers() {
//     document.querySelectorAll('.date-overlay').forEach(wrapper => {
//         const items = wrapper.querySelectorAll('.entry-overlay');

//         const allHidden = [...items].every(item => {
//             return getComputedStyle(item).display === 'none';
//         });

//         wrapper.style.display = allHidden ? 'none' : '';
//     });

// }
function updateWrappers() {
    document.querySelectorAll('.date-overlay').forEach(wrapper => {
        const items = wrapper.querySelectorAll('.entry-overlay');

        const allHidden = [...items].every(item =>
          item.style.display === 'none'        
        );

        wrapper.style.display = allHidden ? 'none' : '';
    });

}



// function updateWrappers() {
//     document.querySelectorAll('.date-overlay').forEach(wrapper => {
//         const itemst = wrapper.querySelectorAll('.entry-overlay');

//         const allHidden = [...itemst].every(item =>
//     item.classList.contains('hidden')
//         );

//         wrapper.style.display = allHidden ? 'none' : '';
//     });
// }



//hover effect fit for mobile too
  const items = document.querySelectorAll('.entry');

// CLICK behavior (persistent)
items.forEach(item => {
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

// Click outside → reset everything
document.addEventListener('click', () => {
  items.forEach(item => {
    item.classList.remove('active', 'clicked');
  });
});







  document.querySelector(".filter-dropdown-btn").addEventListener("click", () => {
    document.querySelector(".filter-dropdown").classList.toggle("show");
  });







// function updateMessage() {
//     const items = document.querySelectorAll('.entry-overlay');

//     const allHidden = [...items].every(
//         item => getComputedStyle(item).display === 'none'
//     );

//     document
//         .getElementById('message')
//         .classList.toggle('hidden', !allHidden);
// }

// updateMessage();



  // document.querySelector(".select-year").addEventListener("click", () => {
  //   updateWrappers();
  // });
