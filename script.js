











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


  updateWrappers();
}








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






// document.querySelectorAll('.day-overlay').forEach(wrapper => {
//     const items = wrapper.querySelectorAll('.entry-overlay');

//     const allHidden = [...items].every(item => {
//         return getComputedStyle(item).display === 'none';
//     });

//     if (allHidden) {
//         wrapper.style.display = 'none';
//     }
// });



document.querySelectorAll('.filter .box li').forEach(el => {
    el.addEventListener('click', () => {
          
      updateWrappers();
    });
});

function updateWrappers() {
    document.querySelectorAll('.day-overlay').forEach(wrapper => {
        const items = wrapper.querySelectorAll('.entry-overlay');

        const allHidden = [...items].every(item => {
            return getComputedStyle(item).display === 'none';
        });

        wrapper.style.display = allHidden ? 'none' : '';
    });
    
    document.querySelectorAll('.month-overlay').forEach(wrapper => {
        const items = wrapper.querySelectorAll('.day-overlay');

        const allHidden = [...items].every(item => {
            return getComputedStyle(item).display === 'none';
        });

        wrapper.style.display = allHidden ? 'none' : '';
    });
}


// function updateWrappers() {
//     document.querySelectorAll('.day-overlay').forEach(wrapper => {
//         const items = wrapper.querySelectorAll('.entry-overlay');

//         const allHidden = [...items].every(item =>
//             item.classList.contains('hidden')
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






//   //filter with js
// const checkboxess = document.querySelectorAll('input[type="checkbox"]');

// function filterrItems() {
//     checkboxess.forEach(checkbox => {
//         const items = document.querySelectorAll(`.${checkbox.id}`);

//         items.forEach(item => {
//             if (checkbox.checked) {
//                 item.classList.remove('hidden');
//             } else {
//                 item.classList.add('hidden');
//             }
//         });
//     });
// }

// // Run when checkboxes change
// checkboxess.forEach(checkbox => {
//     checkbox.addEventListener('change', filterrItems);
// });

// // Run once on page load
// filterrItems();


