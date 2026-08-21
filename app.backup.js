/* =========================================
   NOMAD TRAVEL
   Budget Travel Planner
========================================= */


/* -----------------------------
   LOCAL TIME
----------------------------- */

function updateLocalTime() {

    const timeElement =
        document.getElementById("localTime");

    if (!timeElement) return;

    const now = new Date();

    const time = now.toLocaleTimeString(
        "en-IN",
        {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true
        }
    );

    timeElement.textContent = time;
}

updateLocalTime();

setInterval(updateLocalTime, 1000);


/* -----------------------------
   DARK / LIGHT MODE
----------------------------- */

const themeToggle =
    document.getElementById("themeToggle");

themeToggle.addEventListener("click", () => {

    document.body.classList.toggle("dark");

    const dark =
        document.body.classList.contains("dark");

    localStorage.setItem(
        "nomad-theme",
        dark ? "dark" : "light"
    );

});


/* Restore theme */

if (
    localStorage.getItem("nomad-theme")
    === "dark"
) {
    document.body.classList.add("dark");
}


/* -----------------------------
   TRIP MODAL
----------------------------- */

const modal =
    document.getElementById("tripModal");

const viewTrip =
    document.getElementById("viewTrip");

const closeModal =
    document.getElementById("closeModal");


viewTrip.addEventListener("click", () => {

    modal.classList.add("show");

});


closeModal.addEventListener("click", () => {

    modal.classList.remove("show");

});


modal.addEventListener("click", (event) => {

    if (event.target === modal) {

        modal.classList.remove("show");

    }

});


/* -----------------------------
   CREATE TRIP
----------------------------- */

const tripForm =
    document.getElementById("tripForm");

tripForm.addEventListener("submit", (event) => {

    event.preventDefault();

    const destination =
        document.getElementById("destination").value;

    const budget =
        document.getElementById("tripBudget").value;

    const travelers =
        document.getElementById("travelers").value;


    if (!destination || !budget) {
        return;
    }


    alert(
        `Trip created!\n\n` +
        `Destination: ${destination}\n` +
        `Budget: ₹${Number(budget).toLocaleString("en-IN")}\n` +
        `Travelers: ${travelers}`
    );


    tripForm.reset();

    modal.classList.remove("show");

});


/* -----------------------------
   MAP INTERACTION
----------------------------- */

const mapPins =
    document.querySelectorAll(".map-pin");

const locations = [
    "Chandigarh",
    "Manali",
    "Kasol"
];


mapPins.forEach((pin, index) => {

    pin.addEventListener("click", () => {

        const location =
            locations[index];

        alert(
            `${location}\n\n` +
            "Route location selected."
        );

    });

});


/* -----------------------------
   NAVIGATION
----------------------------- */

const navLinks =
    document.querySelectorAll(".nav-link");

navLinks.forEach(link => {

    link.addEventListener("click", (event) => {

        event.preventDefault();

        navLinks.forEach(item => {

            item.classList.remove("active");

        });

        link.classList.add("active");

    });

});


/* -----------------------------
   NOTIFICATION
----------------------------- */

const notificationBtn =
    document.getElementById("notificationBtn");

notificationBtn.addEventListener("click", () => {

    alert(
        "No new notifications.\n\n" +
        "Your next trip starts in 3 days."
    );

});


/* -----------------------------
   CARD BUTTONS
----------------------------- */

document
    .querySelectorAll(".small-button")
    .forEach(button => {

        button.addEventListener("click", () => {

            alert(
                "This section is ready to connect " +
                "to your full travel planner."
            );

        });

    });


/* -----------------------------
   KEYBOARD SHORTCUT
----------------------------- */

document.addEventListener("keydown", (event) => {

    if (event.key === "Escape") {

        modal.classList.remove("show");

    }

});
