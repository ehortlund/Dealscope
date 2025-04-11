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
        const dealsContainer = document.querySelector(containerSelector);
        if (dealsContainer) {
            dealsContainer.innerHTML = '';
            if (deals.length === 0) {
                dealsContainer.innerHTML = '<p>No deals found matching your search.</p>';
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
    },

    init: async function () {
        console.log("DealScope JavaScript is running!");
        this.handleMobileNav();
        this.handleFadeInAnimations('.fade-in');

        const openSearchInput = document.querySelector('.open-search-input');
        const openSearchContainer = document.querySelector('.open-search-container');
        const searchResultsDropdown = document.querySelector('.search-results-dropdown');
        const dealsContainer = document.querySelector('.deals-container');
        const body = document.querySelector('body');
        let allDeals = [];

        const overlaps = (rect1, rect2) => {
            return !(rect1.right < rect2.left ||
                     rect1.left > rect2.right ||
                     rect1.bottom < rect2.top ||
                     rect1.top > rect2.bottom);
        };

        const updateCardOpacity = () => {
            if (searchResultsDropdown.style.display === 'block' && dealsContainer) {
                const dropdownRect = searchResultsDropdown.getBoundingClientRect();
                const dealCards = dealsContainer.querySelectorAll('.deal-example-card');
                dealCards.forEach((card, index) => {
                    const cardRect = card.getBoundingClientRect();
                    // Ändra bara opaciteten om kortet överlappar och det är det första kortet
                    if (index === 0 && overlaps(dropdownRect, cardRect)) {
                        card.style.opacity = '0.1';
                    } else if (index === 0) {
                        card.style.opacity = '1'; // Återställ om det inte överlappar (kan hända vid justeringar)
                    } else {
                        card.style.opacity = '1'; // Låt andra kort vara opaka
                    }
                });
            } else if (dealsContainer) {
                const dealCards = dealsContainer.querySelectorAll('.deal-example-card');
                dealCards.forEach(card => {
                    card.style.opacity = '1'; // Återställ opaciteten när dropdown är stängd
                });
            }
        };

        const showDropdownSelectiveOpacity = () => {
            searchResultsDropdown.style.display = 'block';
            updateCardOpacity();
        };

        const hideDropdownSelectiveOpacity = () => {
            searchResultsDropdown.style.display = 'none';
            updateCardOpacity(); // Återställ opaciteten
        };

        console.log("Hämtar deals.json...");
        fetch("deals.json")
            .then((response) => {
                console.log("Response:", response);
                return response.json();
            })
            .then((data) => {
                console.log("Data:", data);
                allDeals = data;
                this.generateDealCards(data, ".deals-container");
                console.log("generateDealCards anropad");
                // Uppdatera opaciteten initialt om dropdown skulle vara synlig av någon anledning
                updateCardOpacity();
            })
            .catch((error) => {
                console.error("Fel vid hämtning av deals.json:", error);
            });

        if (openSearchInput && dealsContainer && searchResultsDropdown && openSearchContainer && body) {
            openSearchInput.addEventListener('focus', () => {
                if (openSearchInput.value.length >= 2 && allDeals.filter(deal =>
                    deal.title.toLowerCase().includes(openSearchInput.value.toLowerCase()) ||
                    deal.description.toLowerCase().includes(openSearchInput.value.toLowerCase())
                ).slice(0, 5).length > 0) {
                    showDropdownSelectiveOpacity();
                }
            });

            openSearchInput.addEventListener('blur', () => {
                setTimeout(() => {
                    if (!searchResultsDropdown.matches(':hover')) {
                        hideDropdownSelectiveOpacity();
                    }
                }, 150);
            });

            openSearchInput.addEventListener('input', (event) => {
                const searchTerm = event.target.value.toLowerCase();
                let filteredResults = [];

                if (searchTerm.length >= 2) {
                    filteredResults = allDeals.filter(deal =>
                        deal.title.toLowerCase().includes(searchTerm) ||
                        deal.description.toLowerCase().includes(searchTerm)
                    ).slice(0, 5);
                }

                searchResultsDropdown.innerHTML = '';
                if (filteredResults.length > 0) {
                    filteredResults.forEach(result => {
                        const resultLink = document.createElement('a');
                        resultLink.textContent = result.title;
                        resultLink.href = '#';
                        resultLink.addEventListener('click', (e) => {
                            e.preventDefault();
                            openSearchInput.value = result.title;
                            this.showDealDetails(result.title);
                            hideDropdownSelectiveOpacity();
                            openSearchContainer.style.borderBottomColor = '';
                            openSearchContainer.style.borderBottomLeftRadius = '32px';
                            openSearchContainer.style.borderBottomRightRadius = '32px';
                        });
                        searchResultsDropdown.appendChild(resultLink);
                    });
                    showDropdownSelectiveOpacity();
                    openSearchContainer.style.borderBottomColor = 'transparent';
                    openSearchContainer.style.borderBottomLeftRadius = '0';
                    openSearchContainer.style.borderBottomRightRadius = '0';
                } else {
                    hideDropdownSelectiveOpacity();
                    openSearchContainer.style.borderBottomColor = '';
                    openSearchContainer.style.borderBottomLeftRadius = '32px';
                    openSearchContainer.style.borderBottomRightRadius = '32px';
                }

                const overallFilter = allDeals.filter(deal =>
                    deal.title.toLowerCase().includes(searchTerm) ||
                    deal.description.toLowerCase().includes(searchTerm)
                );
                this.generateDealCards(overallFilter, dealsContainer);
            });

            document.addEventListener('click', (event) => {
                if (!openSearchInput.parentElement.contains(event.target)) {
                    hideDropdownSelectiveOpacity();
                    openSearchContainer.style.borderBottomColor = '';
                    openSearchContainer.style.borderBottomLeftRadius = '32px';
                    openSearchContainer.style.borderBottomRightRadius = '32px';
                }
            });
        }

        const dealDetailsContainer = document.querySelector(".deal-details-container");
        dealDetailsContainer.addEventListener("click", (event) => {
            if (event.target.classList.contains("back-button")) {
                const dealDetailsHeader = document.querySelector(".deal-details-header");
                const dealsContainer = document.querySelector(".deals-container");
                const dealSectionTitle = document.querySelector(".deal-section-title");

                dealDetailsHeader.style.display = "none";
                dealDetailsContainer.style.display = "none";
                dealsContainer.style.display = "block";
                updateCardOpacity(); // Återställ opaciteten när man går tillbaka

                if (dealSectionTitle) {
                    dealSectionTitle.style.display = "block";
                }
            }
        });
    },
};

dealScope.init();