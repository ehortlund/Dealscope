const dealScope = {
    init: async function () {
        console.log("DealScope JavaScript is running!");
        this.handleMobileNav();
        this.handleFadeInAnimations('.fade-in');

        // Hämtar och renderar deals
        console.log("Hämtar deals.json...");
        try {
            const response = await fetch('deals.json');
            const deals = await response.json();
            console.log("Data:", deals);
            this.generateDealCards(deals, ".deals-container");
            console.log("generateDealCards anropad");
        } catch (error) {
            console.error("Fel vid hämtning av deals.json:", error);
        }

        // Back-button-händelse
        const dealDetailsContainer = document.querySelector(".deal-details-container");
        if (dealDetailsContainer) {
            dealDetailsContainer.addEventListener("click", (event) => {
                if (event.target.classList.contains("back-button")) {
                    const dealDetailsHeader = document.querySelector(".deal-details-header");
                    const dealsContainer = document.querySelector(".deals-container");
                    const dealSectionTitle = document.querySelector(".deal-section-title");

                    if (dealDetailsHeader) dealDetailsHeader.style.display = "none";
                    dealDetailsContainer.style.display = "none";
                    if (dealsContainer) dealsContainer.style.display = "block";
                    if (dealSectionTitle) dealSectionTitle.style.display = "block";
                }
            });
        }
    },

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
            (deal.dealValue ? '<li>Deal Value: ' + deal.dealValue + '</li>' : '') +
            '</ul>' +
            '<button class="deal-link-button" data-link="' + deal.link + '">Read More</button>' +
            '</article>';
        return cardTemplate;
    },

    generateDealCards: function (deals, containerSelector) {
        const dealsContainer = document.querySelector(containerSelector);
        if (dealsContainer) {
            dealsContainer.innerHTML = '';
            if (deals.length === 0) {
                dealsContainer.innerHTML = '<p class="no-deals-message">No deals found matching your search :(</p>';
                return;
            }
            deals.forEach(deal => {
                const cardHTML = this.createDealCard(deal);
                dealsContainer.innerHTML += cardHTML;
            });
            this.addDealCardEventListeners(dealsContainer);
        }
    },

    addDealCardEventListeners: function (dealsContainer) {
        dealsContainer.addEventListener("click", (event) => {
            const card = event.target.closest(".deal-example-card");
            if (card) {
                const state = card.getAttribute("data-state");
                card.setAttribute("data-state", state === "closed" ? "open" : "closed");
            }

            if (event.target.classList.contains("deal-link-button")) {
                event.preventDefault();
                const dealCard = event.target.closest(".deal-example-card");
                const dealTitle = dealCard.querySelector(".deal-section-heading").textContent;
                this.showDealDetails(dealTitle);
            }
        });
    },

    showDealDetails: function (dealTitle) {
        fetch("deals.json")
            .then(response => response.json())
            .then(data => {
                const deal = data.find(d => d.title === dealTitle);
                if (deal) {
                    const dealDetailsHeader = document.querySelector(".deal-details-header");
                    const dealDetailsContainer = document.querySelector(".deal-details-container");
                    const dealsContainer = document.querySelector(".deals-container");
                    const dealSectionTitle = document.querySelector(".deal-section-title");

                    dealDetailsHeader.innerHTML = `<h2>${deal.title}</h2><p>${deal.description}</p>`;
                    dealDetailsContainer.innerHTML = this.generateDealDetails(deal);
                    dealDetailsHeader.style.display = "block";
                    dealDetailsContainer.style.display = "block";
                    dealsContainer.style.display = "none";
                    if (dealSectionTitle) dealSectionTitle.style.display = "none";
                }
            });
    },

    generateDealDetails: function (deal) {
        return `
            <div class="deal-details-content">
                <h3>Deal Overview</h3>
                <ul class="deal-overview-list">
                    <li>Deal Value: <span>${deal.dealValue || 'N/A'}</span></li>
                    <li>Industry: <span>${deal.industry || 'N/A'}</span></li>
                    <li>Date: <span>${deal.date}</span></li>
                    <li>Impact: <span>${deal.impact || 'N/A'}</span></li>
                </ul>

                <h3>Major Contractors and Partners</h3>
                <ul class="major-contractors-list">
                    <li>Buyer: <span>${deal.buyer || 'N/A'}</span></li>
                    <li>Seller: <span>${deal.seller || 'N/A'}</span></li>
                </ul>

                <h3>Potential Subcontractors and Partners</h3>
                <ul class="potential-subcontractors-list">
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
    }
};

dealScope.init();