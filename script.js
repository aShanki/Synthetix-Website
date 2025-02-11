// Cursor gradient effect
const cursor = document.getElementById('cursor-gradient');
const heroSection = document.querySelector('.hero');
let cursorVisible = false;

// Update cursor gradient position
document.addEventListener('mousemove', (e) => {
    // Get hero section boundaries
    const heroRect = heroSection.getBoundingClientRect();
    
    // Check if mouse is inside hero section
    if (e.clientY >= heroRect.top && 
        e.clientY <= heroRect.bottom && 
        e.clientX >= heroRect.left && 
        e.clientX <= heroRect.right) {
        
        cursor.style.opacity = '1';
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
        cursorVisible = true;
    } else if (cursorVisible) {
        cursor.style.opacity = '0';
        cursorVisible = false;
    }
});

// Hide cursor gradient when mouse leaves window
document.addEventListener('mouseleave', () => {
    cursor.style.opacity = '0';
    cursorVisible = false;
});

// Navbar scroll effect
const navbar = document.querySelector('.navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
});

// Currency and Billing Period Switching
document.addEventListener('DOMContentLoaded', () => {
    const currencyBtns = document.querySelectorAll('.currency-selector a');
    const billingBtns = document.querySelectorAll('.billing-period a');

    currencyBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            document.querySelector('.currency-selector .active').classList.remove('active');
            btn.parentElement.classList.add('active');
            currentCurrency = btn.dataset.currency;
            updatePrices();
        });
    });

    billingBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            document.querySelector('.billing-period .active').classList.remove('active');
            btn.parentElement.classList.add('active');
            currentPeriod = btn.dataset.period;
            updatePrices();
        });
    });

    // Initialize prices on load
    updatePrices();
});

let currentCurrency = 'usd';
let currentPeriod = 'monthly';

// Currency conversion rates (example rates, update with real rates)
const exchangeRates = {
    usd: 1,
    php: 58.25,
    inr: 86.21
};

function updatePrices() {
    const symbol = document.querySelector(`[data-currency="${currentCurrency}"]`).dataset.symbol;
    const rate = exchangeRates[currentCurrency];
    const period = currentPeriod;

    // Show/hide GCash warning
    let gcashWarning = document.querySelector('.gcash-warning');
    if (currentCurrency === 'php') {
        if (!gcashWarning) {
            const warning = document.createElement('div');
            warning.className = 'gcash-warning';
            warning.innerHTML = `
                <div class="warning-content">
                    <p>To pay using GCash, please open a ticket in our 
                    <a href="https://discord.gg/s4MZumySeP" target="_blank">Discord server</a></p>
                </div>
            `;
            // Append the warning after the currency-billing-options
            document.querySelector('.currency-billing-options').insertAdjacentElement('afterend', warning);
            gcashWarning = warning; // Update the reference
        }
        gcashWarning.style.display = 'block';
    } else if (gcashWarning) {
        gcashWarning.style.display = 'none';
    }

    // Update prices
    document.querySelectorAll('.plan-block').forEach(plan => {
        const priceElement = plan.querySelector('.promo-price');
        let price;
        if (period === 'monthly') {
            price = parseFloat(priceElement.getAttribute('data-monthly-price'));
        } else {
            price = parseFloat(priceElement.getAttribute('data-quarterly-price'));
        }
        const convertedPrice = (price * rate).toFixed(2);
        priceElement.textContent = `${symbol}${convertedPrice} / ${period.charAt(0).toUpperCase() + period.slice(1)}`;
    });
}

// Update price data attributes on load
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.plan-block').forEach(plan => {
        const priceElement = plan.querySelector('.promo-price');
        const usdPrice = parseFloat(priceElement.getAttribute('data-monthly-price'));
        priceElement.setAttribute('data-usd-price', usdPrice);
    });
});

// Category Switching
document.addEventListener('DOMContentLoaded', () => {
    const categoryBtns = document.querySelectorAll('.category-btn');
    const showMoreBtn = document.querySelector('.show-more-btn');
    const showLessBtn = document.querySelector('.show-less-btn');

    // Initial setup: Hide all grids except the active one and hide plans beyond the first 4
    document.querySelectorAll('.plans-grid').forEach(grid => {
        const isActive = grid.dataset.activeCategory === 'budget'; // budget is initially active
        grid.style.display = isActive ? 'grid' : 'none';
        
        if (isActive) {
            const plans = grid.querySelectorAll('.plan-block');

            // Hide plans beyond the first 4
            plans.forEach((plan, index) => {
                if (index >= 4) {
                    plan.classList.add('hidden');
                } else {
                    plan.classList.remove('hidden');
                }
            });
        }
    });

    function updateRegionWarning(category) {
        let regionWarning = document.querySelector('.region-warning');
        if (category === 'performance') {
            if (!regionWarning) {
                const warning = document.createElement('div');
                warning.className = 'region-warning';
                warning.innerHTML = `
                    <div class="warning-content">
                        <p>Performance Plans are only available for North America.</p>
                    </div>
                `;
                document.querySelector('.currency-billing-options').insertAdjacentElement('afterend', warning);
                regionWarning = warning;
            }
            regionWarning.style.display = 'block';
        } else if (regionWarning) {
            regionWarning.style.display = 'none';
        }
    }

    // Initial setup: Hide all grids except the active one and hide plans beyond the first 4
    document.querySelectorAll('.plans-grid').forEach(grid => {
        const isActive = grid.dataset.activeCategory === 'budget'; // budget is initially active
        grid.style.display = isActive ? 'grid' : 'none';
        
        const plans = grid.querySelectorAll('.plan-block');
        plans.forEach((plan, index) => {
            if (index >= 4) {
                plan.classList.add('hidden');
            }
        });
    });

    categoryBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active button
            document.querySelector('.category-btn.active').classList.remove('active');
            btn.classList.add('active');

            // Show selected category's grid and hide others
            const selectedCategory = btn.dataset.category;
            document.querySelectorAll('.plans-grid').forEach(grid => {
                const isSelectedCategory = grid.dataset.activeCategory === selectedCategory;
                grid.style.display = isSelectedCategory ? 'grid' : 'none';
                
                if (isSelectedCategory) {
                    // Reset plan visibility for the selected category
                    const plans = grid.querySelectorAll('.plan-block');
                    plans.forEach((plan, index) => {
                        plan.classList.toggle('hidden', index >= 4);
                    });
                }
            });

            // Update region warning
            updateRegionWarning(selectedCategory);

            // Reset show more/less buttons
            showMoreBtn.style.display = 'block';
            showLessBtn.style.display = 'none';
            
            // Update show more button visibility
            updateShowMoreButtonVisibility();
        });
    });

    // Initial warning check
    updateRegionWarning('budget');

    // Initial button visibility check
    updateShowMoreButtonVisibility();
});

// Show More/Less Plans
function togglePlans(showMore) {
    const activeCategory = document.querySelector('.category-btn.active').dataset.category;
    const plansGrid = document.querySelector(`.plans-grid[data-active-category="${activeCategory}"]`);
    const plans = plansGrid.querySelectorAll('.plan-block');

    // Only proceed if there are more than 4 plans
    if (plans.length > 4) {
        plans.forEach((plan, index) => {
            if (index >= 4) {
                plan.classList.toggle('hidden', !showMore);
            }
        });

        document.querySelector('.show-more-btn').style.display = showMore ? 'none' : 'block';
        document.querySelector('.show-less-btn').style.display = showMore ? 'block' : 'none';
    }
}

// Add event listeners for the show more/less buttons
document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('.show-more-btn').addEventListener('click', () => {
        togglePlans(true);
    });

    document.querySelector('.show-less-btn').addEventListener('click', () => {
        togglePlans(false);
    });
});

// Read More functionality
document.querySelectorAll('.read-more-btn').forEach(button => {
    button.addEventListener('click', function() {
        const moreText = this.previousElementSibling.querySelector('.more-text');
        if (moreText.style.display === 'none' || !moreText.style.display) {
            moreText.style.display = 'inline';
            this.textContent = 'Read Less';
        } else {
            moreText.style.display = 'none';
            this.textContent = 'Read More';
        }
    });
});

// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', () => {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    const navLinksItems = document.querySelectorAll('.nav-links a');

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            mobileMenuBtn.innerHTML = navLinks.classList.contains('active') ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
        });
    }

    // Close menu when clicking a link
    navLinksItems.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            if (mobileMenuBtn) {
                mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
            }
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navLinks.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
            navLinks.classList.remove('active');
            if (mobileMenuBtn) {
                mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
            }
        }
    });
});

// Prevent zoom on double tap for mobile devices
document.addEventListener('gesturestart', function(e) {
    e.preventDefault();
});

// Add more JavaScript for price updates and plan toggling

document.getElementById('show-more-btn').addEventListener('click', function() {
    const hiddenPlans = document.querySelectorAll('.plans-grid .plan-block.hidden');
    hiddenPlans.forEach(plan => {
        plan.classList.remove('hidden');
    });
    
    // Update button to "Show Less" if needed
    this.textContent = 'Show Less';
    this.id = 'show-less-btn';
});

// Ensure "Show Less" functionality maintains order
document.getElementById('show-less-btn').addEventListener('click', function() {
    const allPlans = document.querySelectorAll('.plans-grid .plan-block');
    allPlans.forEach((plan, index) => {
        if (index >= 4) { // Assuming 4 plans are shown by default
            plan.classList.add('hidden');
        }
    });
    
    // Update button to "Show More" if needed
    this.textContent = 'Show More';
    this.id = 'show-more-btn';
});

document.addEventListener('DOMContentLoaded', () => {
    // ...existing code for cursor gradient, navbar scroll effect, currency switching...

    // Category Switching
    const categoryBtns = document.querySelectorAll('.category-btn');
    const showMoreBtn = document.querySelector('.show-more-btn');
    const showLessBtn = document.querySelector('.show-less-btn');

    // Initial setup: Display only the active category and hide plans beyond the first 4
    document.querySelectorAll('.plans-grid').forEach(grid => {
        const isActive = grid.dataset.activeCategory === 'budget'; // 'budget' is initially active
        grid.style.display = isActive ? 'grid' : 'none';

        if (isActive) {
            const plans = grid.querySelectorAll('.plan-block');

            // Hide plans beyond the first 4
            plans.forEach((plan, index) => {
                plan.classList.toggle('hidden', index >= 4);
            });
        }
    });

    function updateRegionWarning(category) {
        let regionWarning = document.querySelector('.region-warning');
        if (category === 'performance') {
            if (!regionWarning) {
                const warning = document.createElement('div');
                warning.className = 'region-warning';
                warning.innerHTML = `
                    <div class="warning-content">
                        <p>Performance Plans are only available for North America.</p>
                    </div>
                `;
                document.querySelector('.currency-billing-options').insertAdjacentElement('afterend', warning);
                regionWarning = warning;
            }
            regionWarning.style.display = 'block';
        } else if (regionWarning) {
            regionWarning.style.display = 'none';
        }
    }

    categoryBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active button
            document.querySelector('.category-btn.active').classList.remove('active');
            btn.classList.add('active');

            // Show selected category's grid and hide others
            const selectedCategory = btn.dataset.category;
            document.querySelectorAll('.plans-grid').forEach(grid => {
                const isSelectedCategory = grid.dataset.activeCategory === selectedCategory;
                grid.style.display = isSelectedCategory ? 'grid' : 'none';

                if (isSelectedCategory) {
                    // Reset plan visibility for the selected category
                    const plans = grid.querySelectorAll('.plan-block');
                    plans.forEach((plan, index) => {
                        plan.classList.toggle('hidden', index >= 4);
                    });
                }
            });

            // Update region warning
            updateRegionWarning(selectedCategory);

            // Reset show more/less buttons
            updateShowMoreButtonVisibility();
        });
    });

    // Show More/Less Plans
    showMoreBtn.addEventListener('click', () => {
        togglePlans(true);
    });

    showLessBtn.addEventListener('click', () => {
        togglePlans(false);
    });

    function togglePlans(showMore) {
        const activeCategory = document.querySelector('.category-btn.active').dataset.category;
        const plansGrid = document.querySelector(`.plans-grid[data-active-category="${activeCategory}"]`);
        const plans = plansGrid.querySelectorAll('.plan-block');

        plans.forEach((plan, index) => {
            if (index >= 4) {
                plan.classList.toggle('hidden', !showMore);
            }
        });

        // Update button visibility
        showMoreBtn.style.display = showMore ? 'none' : 'block';
        showLessBtn.style.display = showMore ? 'block' : 'none';
    }

    function updateShowMoreButtonVisibility() {
        const activeCategory = document.querySelector('.category-btn.active').dataset.category;
        const plansGrid = document.querySelector(`.plans-grid[data-active-category="${activeCategory}"]`);
        const plans = plansGrid.querySelectorAll('.plan-block');

        if (plans.length <= 4) {
            // Hide both buttons if there are 4 or fewer plans
            showMoreBtn.style.display = 'none';
            showLessBtn.style.display = 'none';
        } else {
            // Show "Show More" button, hide "Show Less" button
            showMoreBtn.style.display = 'block';
            showLessBtn.style.display = 'none';
        }
    }

    // Initial warning and button visibility check
    updateRegionWarning('budget');
    updateShowMoreButtonVisibility();

    // ...existing code for mobile menu toggle, read more functionality, etc...
});

// Out of Stock Servers Toggle
document.addEventListener('DOMContentLoaded', () => {
    const showOutOfStockBtn = document.querySelector('.show-out-of-stock');
    const hideOutOfStockBtn = document.querySelector('.hide-out-of-stock');
    const outOfStockServers = document.querySelector('.out-of-stock-servers');

    if (showOutOfStockBtn && hideOutOfStockBtn && outOfStockServers) {
        showOutOfStockBtn.addEventListener('click', () => {
            outOfStockServers.style.display = 'flex';
            outOfStockServers.style.flexDirection = 'column';
            outOfStockServers.style.gap = '20px';
            showOutOfStockBtn.style.display = 'none';
            hideOutOfStockBtn.style.display = 'inline-block';
            console.log('Showing out of stock servers'); // Debug log
        });

        hideOutOfStockBtn.addEventListener('click', () => {
            outOfStockServers.style.display = 'none';
            showOutOfStockBtn.style.display = 'inline-block';
            hideOutOfStockBtn.style.display = 'none';
            console.log('Hiding out of stock servers'); // Debug log
        });
    }
});

// Remove any redundant event listeners or conflicting code
// ...rest of the existing code...
