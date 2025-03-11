// Globala variabler och funktioner (för att undvika konflikter)
const dealScope = {
    // Funktion för att skapa deal-kort (Deals-sidan)
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
        '<a href="' +
        deal.link +
        '" class="deal-link">Read More</a>' +
        '</article>';
      return cardTemplate;
    },
  
    // Funktion för att generera deal-kort (Deals-sidan)
    generateDealCards: function (deals, containerSelector) {
      const dealsContainer = document.querySelector(".deals-container");
      console.log("dealsContainer:", dealsContainer);
      if (dealsContainer) {
        deals.forEach((deal) => {
          const cardHTML = this.createDealCard(deal);
          dealsContainer.innerHTML += cardHTML;
        });
  
        // Händelselyssnare för att hantera klick på kort (Deals-sidan)
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
        });
      }
    },
  
    // Funktion för att hantera mobilnavigering (global)
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
  
    // Funktion för att hantera scrollrotation (global)
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
  
    // Funktion för att hantera fade-in animationer (global)
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
  
    // Initialiseringsfunktion (global)
    init: function () {
      console.log("DealScope JavaScript is running!");
      this.handleMobileNav();
      this.handleFadeInAnimations('.fade-in');
  
      // Data och generering för Deals-sidan
      const dealsData = [
        {
          title: "Sweden-Brazil Defense Deal",
          description: "Sweden’s Saab AB has signed a major agreement with Brazil to provide JAS Gripen fighter jets and military transport planes.",
          link: "#",
          category: "Defense",
          date: "2024-03-08",
        },
        {
          title: "Wallstreet AI Investments",
          description: "Wall Street firms are collectively investing trillions in AI-related infrastructure such as data centers, energy grids, and communication networks.",
          link: "#",
          category: "Finance",
          date: "2024-03-09",
        },
        // Lägg till fler deals här
      ];
      this.generateDealCards(dealsData, ".deals-container");
    },
  };
  
  // Kör initialiseringsfunktionen
  dealScope.init();