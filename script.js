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
                    const dealsFilterBar = document.querySelector(".deals-filter-bar"); // Hämta referensen till filterbaren
                    if (dealsFilterBar) dealsFilterBar.style.display = "none"; // Dölj filterbaren

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

    sortDeals: function (deals, sortBy) {
        let sortedDeals = [...deals]; // Skapa en kopia för att inte ändra originalet

        switch (sortBy) {
            case 'date-latest':
                sortedDeals.sort((a, b) => new Date(b.date) - new Date(a.date));
                break;
            case 'dealValue-highest':
                sortedDeals.sort((a, b) => {
                    const valueA = parseFloat(a.dealValue ? a.dealValue.replace(/[^0-9.-]+/g, '') : -Infinity);
                    const valueB = parseFloat(b.dealValue ? b.dealValue.replace(/[^0-9.-]+/g, '') : -Infinity);
                    return valueB - valueA;
                });
                break;
            case 'dealValue-lowest':
                sortedDeals.sort((a, b) => {
                    const valueA = parseFloat(a.dealValue ? a.dealValue.replace(/[^0-9.-]+/g, '') : Infinity);
                    const valueB = parseFloat(b.dealValue ? b.dealValue.replace(/[^0-9.-]+/g, '') : Infinity);
                    return valueA - valueB;
                });
                break;
            default:
                // Ingen sortering eller standard
                break;
        }
        return sortedDeals;
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
        let currentDeals = []; // För att hålla reda på de deals som visas (kan vara filtrerade)

        const categoryDropdown = document.querySelector('.category-dropdown');
        const categoryButton = document.querySelector('.category-button');
        const categoryDropdownContent = document.querySelector('.category-dropdown-content');
        const categoryButtonText = categoryButton ? categoryButton.firstChild : null;

        const sortByDropdown = document.querySelector('.sort-by-dropdown');
        const sortByButton = document.querySelector('.sort-by-button');
        const sortByDropdownContent = document.querySelector('.sort-by-dropdown-content');

        const overlaps = (rect1, rect2) => {
            return !(rect1.right < rect2.left ||
                     rect1.left > rect2.right ||
                     rect1.bottom < rect2.top ||
                     rect1.top > rect2.bottom);
        };

        const updateCardOpacity = (isDropdownVisible) => {
            if (isDropdownVisible && dealsContainer && (categoryDropdownContent.style.display === 'block' || sortByDropdownContent.style.display === 'block')) {
                const activeDropdownRect = categoryDropdownContent.style.display === 'block' ? categoryDropdownContent.getBoundingClientRect() : sortByDropdownContent.getBoundingClientRect();
                const dealCards = dealsContainer.querySelectorAll('.deal-example-card');
                dealCards.forEach((card, index) => {
                    const cardRect = card.getBoundingClientRect();
                    if (index === 0 && overlaps(activeDropdownRect, cardRect)) {
                        card.style.opacity = '0.1';
                    } else {
                        card.style.opacity = '1';
                    }
                });
            } else if (dealsContainer) {
                const dealCards = dealsContainer.querySelectorAll('.deal-example-card');
                dealCards.forEach(card => {
                    card.style.opacity = '1';
                });
            }
        };

        const showCategoryDropdown = () => {
            if (categoryDropdownContent && categoryButton) {
                categoryDropdownContent.style.display = 'block';
                categoryButton.style.borderBottomColor = 'transparent';
                categoryButton.style.borderBottomLeftRadius = '0';
                categoryButton.style.borderBottomRightRadius = '0';
                updateCardOpacity(true);
            }
        };

        const hideCategoryDropdown = () => {
            if (categoryDropdownContent && categoryButton) {
                categoryDropdownContent.style.display = 'none';
                categoryButton.style.borderBottomColor = '';
                categoryButton.style.borderBottomLeftRadius = '32px';
                categoryButton.style.borderBottomRightRadius = '32px';
                updateCardOpacity(false);
            }
        };

        const showSortByDropdown = () => {
            if (sortByDropdownContent && sortByButton) {
                sortByDropdownContent.style.display = 'block';
                sortByButton.style.borderBottomColor = 'transparent';
                sortByButton.style.borderBottomLeftRadius = '0';
                sortByButton.style.borderBottomRightRadius = '0';
                updateCardOpacity(true);
            }
        };

        const hideSortByDropdown = () => {
            if (sortByDropdownContent && sortByButton) {
                sortByDropdownContent.style.display = 'none';
                sortByButton.style.borderBottomColor = '';
                sortByButton.style.borderBottomLeftRadius = '32px';
                sortByButton.style.borderBottomRightRadius = '32px';
                updateCardOpacity(false);
            }
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
                currentDeals = [...allDeals]; // Initialt visas alla deals
                this.generateDealCards(currentDeals, ".deals-container"); // Använd currentDeals
                console.log("generateDealCards anropad");
                updateCardOpacity(false); // Säkerställ initial opacitet
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
                    searchResultsDropdown.style.display = 'block';
                    openSearchContainer.style.borderBottomColor = 'transparent';
                    openSearchContainer.style.borderBottomLeftRadius = '0';
                    openSearchContainer.style.borderBottomRightRadius = '0';
                    const dropdownRect = searchResultsDropdown.getBoundingClientRect();
                    const dealCards = dealsContainer.querySelectorAll('.deal-example-card');
                    dealCards.forEach((card, index) => {
                        const cardRect = card.getBoundingClientRect();
                        if (index === 0 && overlaps(dropdownRect, cardRect)) {
                            card.style.opacity = '0.1';
                        } else {
                            card.style.opacity = '1';
                        }
                    });
                }
            });

            openSearchInput.addEventListener('blur', () => {
                setTimeout(() => {
                    if (!searchResultsDropdown.matches(':hover')) {
                        searchResultsDropdown.style.display = 'none';
                        openSearchContainer.style.borderBottomColor = '';
                        openSearchContainer.style.borderBottomLeftRadius = '32px';
                        openSearchContainer.style.borderBottomRightRadius = '32px';
                        updateCardOpacity(categoryDropdownContent.style.display === 'block' || sortByDropdownContent.style.display === 'block');
                    }
                }, 150);
            });

            openSearchInput.addEventListener('input', (event) => {
                const searchTerm = event.target.value.toLowerCase();
                const filteredResults = allDeals.filter(deal =>
                    deal.title.toLowerCase().includes(searchTerm) ||
                    deal.description.toLowerCase().includes(searchTerm)
                ).slice(0, 5);

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
                            searchResultsDropdown.style.display = 'none';
                            openSearchContainer.style.borderBottomColor = '';
                            openSearchContainer.style.borderBottomLeftRadius = '32px';
                            openSearchContainer.style.borderBottomRightRadius = '32px';
                            updateCardOpacity(categoryDropdownContent.style.display === 'block' || sortByDropdownContent.style.display === 'block');
                        });
                        searchResultsDropdown.appendChild(resultLink);
                    });
                    searchResultsDropdown.style.display = 'block';
                    openSearchContainer.style.borderBottomColor = 'transparent';
                    openSearchContainer.style.borderBottomLeftRadius = '0';
                    openSearchContainer.style.borderBottomRightRadius = '0';
                    const dropdownRect = searchResultsDropdown.getBoundingClientRect();
                    const dealCards = dealsContainer.querySelectorAll('.deal-example-card');
                    dealCards.forEach((card, index) => {
                        const cardRect = card.getBoundingClientRect();
                        if (index === 0 && overlaps(dropdownRect, cardRect)) {
                            card.style.opacity = '0.1';
                        } else {
                            card.style.opacity = '1';
                        }
                    });
                } else {
                    searchResultsDropdown.style.display = 'none';
                    openSearchContainer.style.borderBottomColor = '';
                    openSearchContainer.style.borderBottomLeftRadius = '32px';
                    openSearchContainer.style.borderBottomRightRadius = '32px';
                    updateCardOpacity(categoryDropdownContent.style.display === 'block' || sortByDropdownContent.style.display === 'block');
                }

                const overallFilter = allDeals.filter(deal =>
                    deal.title.toLowerCase().includes(searchTerm) ||
                    deal.description.toLowerCase().includes(searchTerm)
                );
                currentDeals = overallFilter;
                this.generateDealCards(currentDeals, dealsContainer);
            });

            document.addEventListener('click', (event) => {
                if (!openSearchInput.parentElement.contains(event.target)) {
                    searchResultsDropdown.style.display = 'none';
                    openSearchContainer.style.borderBottomColor = '';
                    openSearchContainer.style.borderBottomLeftRadius = '32px';
                    openSearchContainer.style.borderBottomRightRadius = '32px';
                    updateCardOpacity(categoryDropdownContent.style.display === 'block' || sortByDropdownContent.style.display === 'block');
                }
                if (categoryDropdown && !categoryDropdown.contains(event.target)) {
                    hideCategoryDropdown();
                }
                if (sortByDropdown && !sortByDropdown.contains(event.target)) {
                    hideSortByDropdown();
                }
            });
        }

        if (categoryButton && categoryDropdownContent && categoryDropdown) {
            categoryButton.addEventListener('click', (event) => {
                event.stopPropagation();
                const isVisible = categoryDropdownContent.style.display === 'block';
                categoryDropdownContent.style.display = isVisible ? 'none' : 'block';
                categoryDropdown.classList.toggle('open', !isVisible);
                updateCardOpacity(!isVisible);
                if (sortByDropdownContent && sortByDropdownContent.style.display === 'block') {
                    hideSortByDropdown();
                }

                // Hantera den undre gränsen direkt i JavaScript
                if (isVisible) {
                    categoryButton.style.borderBottomColor = '';
                    categoryButton.style.borderBottomLeftRadius = '32px';
                    categoryButton.style.borderBottomRightRadius = '32px';
                } else {
                    categoryButton.style.borderBottomColor = 'transparent';
                    categoryButton.style.borderBottomLeftRadius = '0';
                    categoryButton.style.borderBottomRightRadius = '0';
                }
            });

            categoryDropdownContent.addEventListener('click', (event) => {
                if (event.target.tagName === 'A') {
                    event.preventDefault();
                    const selectedCategory = event.target.getAttribute('data-category');
                    if (categoryButtonText) {
                        categoryButtonText.textContent = event.target.textContent;
                    }
                    hideCategoryDropdown();
                    let filteredByCategory = selectedCategory === 'all' ? allDeals : allDeals.filter(deal => deal.category && deal.category.toLowerCase() === selectedCategory);
                    currentDeals = filteredByCategory;
                    this.generateDealCards(currentDeals, '.deals-container');

                    // Återställ gränsen när ett val görs och dropdown stängs (för säkerhets skull)
                    categoryButton.style.borderBottomColor = '';
                    categoryButton.style.borderBottomLeftRadius = '32px';
                    categoryButton.style.borderBottomRightRadius = '32px';
                }
            });
        }

        if (sortByButton && sortByDropdownContent && sortByDropdown) {
            sortByButton.addEventListener('click', (event) => {
                event.stopPropagation();
                const isVisible = sortByDropdownContent.style.display === 'block';
                sortByDropdownContent.style.display = isVisible ? 'none' : 'block';
                sortByDropdown.classList.toggle('open', !isVisible);
                updateCardOpacity(!isVisible);
                if (categoryDropdownContent && categoryDropdownContent.style.display === 'block') {
                    hideCategoryDropdown();
                }

                // Hantera den undre gränsen direkt i JavaScript
                if (isVisible) {
                    sortByButton.style.borderBottomColor = '';
                    sortByButton.style.borderBottomLeftRadius = '32px';
                    sortByButton.style.borderBottomRightRadius = '32px';
                } else {
                    sortByButton.style.borderBottomColor = 'transparent';
                    sortByButton.style.borderBottomLeftRadius = '0';
                    sortByButton.style.borderBottomRightRadius = '0';
                }
            });

            sortByDropdownContent.addEventListener('click', (event) => {
                if (event.target.tagName === 'A') {
                    event.preventDefault();
                    const sortByValue = event.target.getAttribute('data-sort');
                    hideSortByDropdown();
                    currentDeals = this.sortDeals(currentDeals, sortByValue);
                    this.generateDealCards(currentDeals, '.deals-container');

                    // Återställ gränsen när ett val görs och dropdown stängs (för säkerhets skull)
                    sortByButton.style.borderBottomColor = '';
                    sortByButton.style.borderBottomLeftRadius = '32px';
                    sortByButton.style.borderBottomRightRadius = '32px';
                }
            });
        }

        const dealDetailsContainer = document.querySelector(".deal-details-container");
        if (dealDetailsContainer) {
            dealDetailsContainer.addEventListener("click", (event) => {
                if (event.target.classList.contains("back-button")) {
                    const dealDetailsHeader = document.querySelector(".deal-details-header");
                    const dealsContainer = document.querySelector(".deals-container");
                    const dealSectionTitle = document.querySelector(".deal-section-title");
                    const dealsFilterBar = document.querySelector(".deals-filter-bar"); // Hämta referensen till filterbaren
                    if (dealsFilterBar) dealsFilterBar.style.display = "flex"; // Visa filterbaren igen (anpassa till din CSS om det inte är flex)

                    if (dealDetailsHeader) dealDetailsHeader.style.display = "none";
                    dealDetailsContainer.style.display = "none";
                    if (dealsContainer) dealsContainer.style.display = "block";
                    updateCardOpacity(false);

                    if (dealSectionTitle) {
                        dealSectionTitle.style.display = "block";
                    }
                }
            });
        }
    },
};

dealScope.init();