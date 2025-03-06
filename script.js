// När sidan laddas, visa ett meddelande i konsolen
console.log("JavaScript is working!");

// Välj hamburgarikonen och mobilnavigeringen
const menuBtn = document.querySelector('.menu-btn');
const mobileNav = document.querySelector('.mobile-nav');

// Lägg till klickhändelse på hamburgarikonen
menuBtn.addEventListener('click', () => {
    menuBtn.classList.toggle('active'); // Växla ikon mellan hamburgare och kryss
    mobileNav.classList.toggle('visible'); // Visa eller dölj mobilmenyn
});






// Hämta SVG-elementet
const circle = document.getElementById('trustedCircle');

// Lyssna på scrollhändelsen
window.addEventListener('scroll', () => {
    // Hämta scrollpositionen
    const scrollPosition = window.scrollY;

    // Bestäm rotationsvinkeln baserat på scrollposition
    const rotation = scrollPosition * 0.2; // Justera faktorn för snabbare eller långsammare rotation

    // Använd transform för att rotera SVG:en
    circle.style.transform = `rotate(${rotation}deg)`;
});


document.addEventListener("DOMContentLoaded", () => {
    const fadeIns = document.querySelectorAll('.fade-in');

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show'); // Lägg till 'show' när elementet är synligt
                observer.unobserve(entry.target); // Sluta observera efter att animationen triggas
            }
        });
    });

    fadeIns.forEach(fadeIn => {
        observer.observe(fadeIn); // Observera varje element med klassen 'fade-in'
    });
});


// Funktion för att skapa deal-kort
function createDealCard(deal) {
    var cardTemplate =
      '<article class="deal-example-card">' +
      '<h2 class="deal-section-heading">' +
      deal.title +
      '</h2>' +
      '<p>' +
      deal.description +
      '</p>' +
      '<a href="' +
      deal.link +
      '" class="deal-link">Read More</a>' +
      '</article>';
    return cardTemplate;
  }
