"use strict";

/* =========================================
   NOMAD TRAVEL — APP
========================================= */

const STORAGE_KEY = "nomad-travel-v2";

const defaultState = {
    theme: "light",

    trip: {
        destination: "Himachal Pradesh",
        route: "Chandigarh → Manali → Kasol",
        budget: 28500,
        travelers: 2,
        duration: 7,
        start: "24 Aug"
    },

    expenses: [
        { id: makeId(), name: "Stay", amount: 8200 },
        { id: makeId(), name: "Transport", amount: 5600 },
        { id: makeId(), name: "Food", amount: 3120 },
        { id: makeId(), name: "Activities", amount: 1500 }
    ],

    itinerary: [
        {
            time: "08:00",
            title: "Breakfast",
            location: "Johnson's Café"
        },
        {
            time: "10:30",
            title: "Solang Valley",
            location: "Mountain day trip"
        },
        {
            time: "14:00",
            title: "Lunch",
            location: "Local café"
        },
        {
            time: "17:30",
            title: "Old Manali",
            location: "Walk & explore"
        },
        {
            time: "20:00",
            title: "Dinner",
            location: "Local restaurant"
        }
    ]
};

let state = loadState();

let toastTimer;


/* =========================================
   HELPERS
========================================= */

function $(selector) {
    return document.querySelector(selector);
}

function $$(selector) {
    return document.querySelectorAll(selector);
}

function makeId() {
    return Date.now().toString(36) +
        Math.random().toString(36).slice(2);
}

function escapeHTML(value) {
    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

function money(value) {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0
    }).format(Number(value) || 0);
}


/* =========================================
   STORAGE
========================================= */

function loadState() {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);

        if (!saved) {
            return JSON.parse(
                JSON.stringify(defaultState)
            );
        }

        const data = JSON.parse(saved);

        return {
            ...JSON.parse(
                JSON.stringify(defaultState)
            ),
            ...data,
            trip: {
                ...defaultState.trip,
                ...(data.trip || {})
            },
            expenses: Array.isArray(data.expenses)
                ? data.expenses
                : []
        };

    } catch {
        return JSON.parse(
            JSON.stringify(defaultState)
        );
    }
}

function saveState() {
    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(state)
    );
}


/* =========================================
   INITIALIZE
========================================= */

document.addEventListener("DOMContentLoaded", () => {

    applyTheme();

    renderTrip();

    renderExpenses();

    renderItinerary();

    updateClock();

    setupNavigation();

    setupButtons();

    setupForms();

    setupModals();

    setupMap();

    setupMemories();

    setupMobileMenu();

    setupKeyboard();

    handleRoute();

    window.addEventListener(
        "hashchange",
        handleRoute
    );

    setInterval(
        updateClock,
        30000
    );
});


/* =========================================
   ROUTING
========================================= */

const routes = {
    dashboard: {
        title: "Dashboard",
        text: "Your travel overview."
    },

    trips: {
        title: "My Trips",
        text: "Manage your journeys and travel budgets."
    },

    itinerary: {
        title: "Itinerary",
        text: "Plan every day of your journey."
    },

    explore: {
        title: "Explore",
        text: "Discover new destinations."
    },

    memories: {
        title: "Memories",
        text: "Keep your favourite travel moments."
    }
};


function setupNavigation() {

    document
        .querySelectorAll(".nav-item")
        .forEach(link => {

            link.addEventListener(
                "click",
                () => {

                    const route =
                        link.dataset.view;

                    if (route) {
                        location.hash = route;
                    }

                }
            );

        });
}


function handleRoute() {

    let route =
        location.hash
            .replace("#", "")
            .trim();

    if (!routes[route]) {
        route = "dashboard";
    }

    $$(".nav-item").forEach(button => {

        button.classList.toggle(
            "active",
            button.dataset.view === route
        );

    });


    const dashboard =
        $("#dashboardView");

    const generic =
        $("#genericView");


    if (route === "dashboard") {

        dashboard.style.display = "block";

        generic.classList.remove("active");

    } else {

        dashboard.style.display = "none";

        generic.classList.add("active");

        $("#genericTitle").textContent =
            routes[route].title;

        $("#genericText").textContent =
            routes[route].text;

        updateGenericButton(route);
    }

    closeMobileMenu();
}


function updateGenericButton(route) {

    const button =
        $("#genericAction");

    if (!button) return;

    const labels = {
        trips: "Create new trip →",
        itinerary: "Plan itinerary →",
        explore: "Explore destinations →",
        memories: "Add memory →"
    };

    button.innerHTML =
        labels[route] || "Continue →";
}


/* =========================================
   TRIP
========================================= */

function renderTrip() {

    const destination =
        $("#heroDestination");

    const route =
        $("#heroRoute");

    const budget =
        $("#budgetTotal");


    if (destination) {

        const words =
            state.trip.destination
                .trim()
                .split(/\s+/);

        const middle =
            Math.ceil(words.length / 2);

        destination.innerHTML = `
            ${escapeHTML(
                words.slice(0, middle).join(" ")
            )}
            <br>
            ${escapeHTML(
                words.slice(middle).join(" ")
            )}
        `;
    }


    if (route) {
        route.textContent =
            state.trip.route;
    }


    if (budget) {
        budget.textContent =
            money(state.trip.budget);
    }
}


/* =========================================
   EXPENSES
========================================= */

function totalSpent() {

    return state.expenses.reduce(
        (total, expense) =>
            total + Number(expense.amount),
        0
    );
}


function renderExpenses() {

    const list =
        $("#expenseList");

    if (!list) return;


    const spent =
        totalSpent();

    const budget =
        Number(state.trip.budget);

    const percentage =
        budget > 0
            ? Math.min(
                100,
                Math.round(
                    spent / budget * 100
                )
            )
            : 0;


    $("#budgetSpent").textContent =
        money(spent);

    $("#budgetPercentage").textContent =
        `${percentage}%`;

    $("#budgetProgress").style.width =
        `${percentage}%`;


    if (!state.expenses.length) {

        list.innerHTML = `
            <div class="expense-row">
                <span>No expenses yet</span>
                <strong>₹0</strong>
            </div>
        `;

        return;
    }


    list.innerHTML =
        state.expenses.map(expense => `
            <div class="expense-row">

                <span>
                    ${escapeHTML(expense.name)}
                </span>

                <strong>
                    ${money(expense.amount)}

                    <button
                        type="button"
                        class="remove-expense"
                        data-id="${expense.id}"
                    >
                        Remove
                    </button>
                </strong>

            </div>
        `).join("");


    $$(".remove-expense").forEach(button => {

        button.addEventListener(
            "click",
            () => {

                state.expenses =
                    state.expenses.filter(
                        expense =>
                            expense.id !==
                            button.dataset.id
                    );

                saveState();

                renderExpenses();

                toast("Expense removed");

            }
        );

    });
}


/* =========================================
   ITINERARY
========================================= */

function renderItinerary() {

    const timeline =
        $("#timeline");

    if (!timeline) return;


    timeline.innerHTML =
        state.itinerary.map(item => `
            <div class="timeline-item">

                <div class="timeline-time">
                    ${escapeHTML(item.time)}
                </div>

                <div class="timeline-dot"></div>

                <div>
                    <strong>
                        ${escapeHTML(item.title)}
                    </strong>

                    <span>
                        ${escapeHTML(item.location)}
                    </span>
                </div>

            </div>
        `).join("");
}


/* =========================================
   BUTTONS
========================================= */

function setupButtons() {

    $("#viewTripBtn")?.addEventListener(
        "click",
        () => {
            location.hash = "itinerary";
        }
    );


    $("#viewAllItinerary")?.addEventListener(
        "click",
        () => {
            location.hash = "itinerary";
        }
    );


    $("#viewMemories")?.addEventListener(
        "click",
        () => {
            location.hash = "memories";
        }
    );


    $("#addExpenseBtn")?.addEventListener(
        "click",
        () => {
            openModal("expenseModal");
            setTimeout(
                () => $("#expenseName")?.focus(),
                100
            );
        }
    );


    $("#expandMapBtn")?.addEventListener(
        "click",
        () => {
            toast("Route map is ready to explore.");
        }
    );


    $("#notificationBtn")?.addEventListener(
        "click",
        () => {
            toast("You're all caught up.");
        }
    );


    $("#profileBtn")?.addEventListener(
        "click",
        () => {
            toast("Profile menu opened.");
        }
    );


    $("#mobileProfileBtn")?.addEventListener(
        "click",
        () => {
            toast("Profile menu opened.");
        }
    );


    $("#settingsBtn")?.addEventListener(
        "click",
        () => {
            toast("Settings opened.");
        }
    );


    $("#themeBtn")?.addEventListener(
        "click",
        toggleTheme
    );


    $("#tipBtn")?.addEventListener(
        "click",
        () => {
            toast(
                "Booking early can reduce accommodation costs."
            );
        }
    );


    $("#genericAction")?.addEventListener(
        "click",
        () => {

            const route =
                location.hash
                    .replace("#", "");

            if (route === "trips") {

                openModal("tripModal");

            } else if (route === "itinerary") {

                toast(
                    "Itinerary planner opened."
                );

            } else if (route === "explore") {

                toast(
                    "Destination explorer opened."
                );

            } else if (route === "memories") {

                toast(
                    "Memory uploader opened."
                );

            }

        }
    );
}


/* =========================================
   FORMS
========================================= */

function setupForms() {

    $("#expenseForm")?.addEventListener(
        "submit",
        event => {

            event.preventDefault();

            const name =
                $("#expenseName").value.trim();

            const amount =
                Number(
                    $("#expenseAmount").value
                );

            if (!name) {
                toast("Enter an expense name.");
                return;
            }

            if (
                !Number.isFinite(amount) ||
                amount <= 0
            ) {
                toast("Enter a valid amount.");
                return;
            }


            state.expenses.push({
                id: makeId(),
                name,
                amount
            });


            saveState();

            renderExpenses();

            event.target.reset();

            closeModal("expenseModal");

            toast(
                `${name} added to your budget.`
            );
        }
    );


    $("#tripForm")?.addEventListener(
        "submit",
        event => {

            event.preventDefault();

            const destination =
                $("#destinationInput")
                    .value.trim();

            const budget =
                Number(
                    $("#tripBudgetInput").value
                );

            const travelers =
                Number(
                    $("#travelerInput").value
                );


            if (!destination) {
                toast("Enter a destination.");
                return;
            }

            if (
                !Number.isFinite(budget) ||
                budget <= 0
            ) {
                toast("Enter a valid budget.");
                return;
            }

            if (
                !Number.isInteger(travelers) ||
                travelers < 1
            ) {
                toast("Enter valid travelers.");
                return;
            }


            state.trip = {
                ...state.trip,
                destination,
                budget,
                travelers
            };


            saveState();

            renderTrip();

            renderExpenses();

            event.target.reset();

            closeModal("tripModal");

            location.hash = "dashboard";

            toast(
                `${destination} trip created.`
            );
        }
    );
}


/* =========================================
   MODALS
========================================= */

function setupModals() {

    $$("[data-close-modal]")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const modal =
                        button.closest(".modal");

                    closeModal(modal.id);

                }
            );

        });


    $$(".modal").forEach(modal => {

        modal.addEventListener(
            "click",
            event => {

                if (
                    event.target === modal
                ) {
                    closeModal(modal.id);
                }

            }
        );

    });
}


function openModal(id) {

    const modal =
        document.getElementById(id);

    if (!modal) return;

    modal.classList.add("show");

    modal.setAttribute(
        "aria-hidden",
        "false"
    );

    document.body.style.overflow =
        "hidden";
}


function closeModal(id) {

    const modal =
        document.getElementById(id);

    if (!modal) return;

    modal.classList.remove("show");

    modal.setAttribute(
        "aria-hidden",
        "true"
    );

    document.body.style.overflow = "";
}


/* =========================================
   MOBILE MENU
========================================= */


function setupMobileMenu() {

    const menuButton =
        document.getElementById("mobileMenuBtn");

    const closeButton =
        document.getElementById("mobileCloseBtn");

    const sidebar =
        document.getElementById("sidebar");

    const overlay =
        document.getElementById("mobileOverlay");


    if (!menuButton || !sidebar || !overlay) {
        console.warn("Mobile navigation elements missing.");
        return;
    }


    function openMenu() {

        sidebar.classList.add("open");

        overlay.classList.add("show");

        menuButton.setAttribute(
            "aria-expanded",
            "true"
        );

        document.body.style.overflow =
            "hidden";
    }


    function closeMenu() {

        sidebar.classList.remove("open");

        overlay.classList.remove("show");

        menuButton.setAttribute(
            "aria-expanded",
            "false"
        );

        document.body.style.overflow =
            "";
    }


    menuButton.addEventListener(
        "click",
        openMenu
    );


    closeButton?.addEventListener(
        "click",
        closeMenu
    );


    overlay.addEventListener(
        "click",
        closeMenu
    );


    document.querySelectorAll(
        ".sidebar-nav .nav-item"
    ).forEach(link => {

        link.addEventListener(
            "click",
            closeMenu
        );

    });


    window.addEventListener(
        "resize",
        () => {

            if (window.innerWidth > 768) {
                closeMenu();
            }

        }
    );
}

/* =========================================
   MAP
========================================= */

function setupMap() {

    $$(".map-pin").forEach(pin => {

        pin.addEventListener(
            "click",
            () => {

                toast(
                    `${pin.dataset.location} selected`
                );

            }
        );

    });
}


/* =========================================
   MEMORIES
========================================= */

function setupMemories() {

    $$(".memory").forEach(memory => {

        memory.addEventListener(
            "click",
            () => {

                toast(
                    `${memory.dataset.memory} selected`
                );

            }
        );

    });
}


/* =========================================
   THEME
========================================= */

function applyTheme() {

    document.body.classList.toggle(
        "dark",
        state.theme === "dark"
    );

    const icon =
        $("#themeIcon");

    if (icon) {
        icon.textContent =
            state.theme === "dark"
                ? "☾"
                : "☼";
    }
}


function toggleTheme() {

    state.theme =
        state.theme === "dark"
            ? "light"
            : "dark";

    saveState();

    applyTheme();

    toast(
        state.theme === "dark"
            ? "Dark mode enabled"
            : "Light mode enabled"
    );
}


/* =========================================
   CLOCK
========================================= */

function updateClock() {

    const element =
        $("#localTime");

    if (!element) return;

    element.textContent =
        new Intl.DateTimeFormat(
            "en-IN",
            {
                timeZone: "Asia/Kolkata",
                hour: "2-digit",
                minute: "2-digit",
                hour12: true
            }
        ).format(new Date());
}


/* =========================================
   TOAST
========================================= */

function toast(message) {

    const element =
        $("#toast");

    const text =
        $("#toastMessage");

    if (!element || !text) return;

    clearTimeout(toastTimer);

    text.textContent =
        message;

    element.classList.add("show");

    toastTimer =
        setTimeout(() => {

            element.classList.remove(
                "show"
            );

        }, 2600);
}


/* =========================================
   KEYBOARD
========================================= */

function setupKeyboard() {

    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Escape"
            ) {

                $$(".modal.show")
                    .forEach(modal => {
                        closeModal(modal.id);
                    });

                closeMobileMenu();
            }

        }
    );
}
