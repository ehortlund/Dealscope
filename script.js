const dealScope = {
    createDealCard: function (deal) {
        var cardTemplate =
            '<article class="deal-example-card" data-state="closed">' +
            '<h2 class="deal-section-heading">' +
            deal.title +
            '</h2>' +
            '<p class="deal-description">' +
            deal.description +
            '</p>' +
            '<ul class="deal-details">' +
            '<li>Category: ' + deal.category + '</li>' +
            '<li>Date: ' + deal.date + '</li>' +
            '</ul>' +
            '<button class="deal-link-button" data-link="' + deal.link + '">Read More</button>' +
            '</article>';
        return cardTemplate;
    },

    generateDealCards: function (deals, containerSelector) {
        const dealsContainer = document.querySelector(".deals-container");
        console.log("dealsContainer:", dealsContainer);
        if (dealsContainer) {
            deals.forEach((deal) => {
                const cardHTML = this.createDealCard(deal);
                dealsContainer.innerHTML += cardHTML;
            });

            dealsContainer.addEventListener("click", function (event) {
                console.log("Klickhändelse utlöst");
                const card = event.target.closest(".deal-example-card");
                console.log("Kort:", card);
                if (card) {
                    const state = card.getAttribute("data-state");
                    console.log("Tillstånd:", state);
                    if (state === "closed") {
                        card.setAttribute("data-state", "open");
                        console.log("Kort öppnat");
                    } else {
                        card.setAttribute("data-state", "closed");
                        console.log("Kort stängt");
                    }
                }

                if (event.target.classList.contains("deal-link-button")) {
                    event.preventDefault();

                    const dealCard = event.target.closest(".deal-example-card");
                    const dealTitle = dealCard.querySelector(".deal-section-heading").textContent;

                    fetch("deals.json")
                        .then((response) => response.json())
                        .then((data) => {
                            const deal = data.find((deal) => deal.title === dealTitle);
                            if (deal) {
                                // Generera header-information
                                const dealDetailsHeader = document.querySelector(".deal-details-header");
                                dealDetailsHeader.innerHTML = `
                                    <h2>${deal.title}</h2>
                                    <p>${deal.description}</p>
                                `;

                                // Generera detaljsidan
                                const dealDetailsContainer = document.querySelector(".deal-details-container");
                                dealDetailsContainer.innerHTML = dealScope.generateDealDetails(deal);

                                // Visa header och detaljsidan
                                dealDetailsHeader.style.display = "block";
                                dealDetailsContainer.style.display = "block";

                                // Dölj deal-listan
                                dealsContainer.style.display = "none";

                                // Dölj rubriken direkt med JavaScript
                                const dealSectionTitle = document.querySelector(".deal-section-title");
                                if (dealSectionTitle) {
                                    dealSectionTitle.style.display = "none";
                                }
                            }
                        });
                }
            });
        }
    },

    generateDealDetails: function (deal) {
        return `
            <div class="deal-details-content">
                <ul>
                    <li>Category: ${deal.category}</li>
                    <li>Date: ${deal.date}</li>
                </ul>
                <h3>Potential Subcontractors and Partners</h3>
                <ul>
                    ${deal.subcontractors.map(subcontractor => `<li>${subcontractor}</li>`).join("")}
                </ul>
                <button class="back-button">Go back</button>
            </div>
        `;
    },

    handleMobileNav: function () {
        const menuBtn = document.querySelector('.menu-btn');
        const mobileNav = document.querySelector('.mobile-nav');

        if (menuBtn && mobileNav) {
            menuBtn.addEventListener('click', () => {
                menuBtn.classList.toggle('active');
                mobileNav.classList.toggle('visible');
            });
        } else {
            console.error("Kunde inte hitta menyknappen eller mobilnavigeringen.");
        }
    },

    handleScrollRotation: function (elementId) {
        const element = document.getElementById(elementId);
        if (element) {
            window.addEventListener('scroll', () => {
                const scrollPosition = window.scrollY;
                const rotation = scrollPosition * 0.2;
                element.style.transform = `rotate(${rotation}deg)`;
            });
        } else {
            console.error(`Kunde inte hitta elementet med ID: ${elementId}.`);
        }
    },

    handleFadeInAnimations: function (selector) {
        document.addEventListener("DOMContentLoaded", () => {
            const fadeIns = document.querySelectorAll(selector);
            const observer = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('show');
                        observer.unobserve(entry.target);
                    }
                });
            });
            fadeIns.forEach(fadeIn => {
                observer.observe(fadeIn);
            });
        });
    },

    init: async function () {
        console.log("DealScope JavaScript is running!");
        this.handleMobileNav();
        this.handleFadeInAnimations('.fade-in');

        console.log("Hämtar deals.json...");
        fetch("deals.json")
            .then((response) => {
                console.log("Response:", response);
                return response.json();
            })
            .then((data) => {
                console.log("Data:", data);
                this.generateDealCards(data, ".deals-container");
                console.log("generateDealCards anropad");
            })
            .catch((error) => {
                console.error("Fel vid hämtning av deals.json:", error);
            });

        const dealDetailsContainer = document.querySelector(".deal-details-container");
        dealDetailsContainer.addEventListener("click", (event) => {
            if (event.target.classList.contains("back-button")) {
                document.querySelector(".deals-container").style.display = "block";
                document.querySelector(".deal-details-header").style.display = "none";
                dealDetailsContainer.style.display = "none";

                const dealSectionTitle = document.querySelector(".deal-section-title");
                if (dealSectionTitle) {
                    dealSectionTitle.style.display = "block";
                }
            }
        });
    },
};

dealScope.init();