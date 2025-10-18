class TypeWriter {
  constructor(txtElement, words, wait = 3000) {
    this.txtElement = txtElement;
    this.words = words;
    this.txt = '';
    this.wordIndex = 0;
    this.wait = parseInt(wait, 10);
    this.type();
    this.isDeleting = false;
  }

  type() {
    // Current index of word
    const current = this.wordIndex % this.words.length;
    // Get full text of current word
    const fullTxt = this.words[current];

    // Check if deleting
    if(this.isDeleting) {
      // Remove char
      this.txt = fullTxt.substring(0, this.txt.length - 1);
    } else {
      // Add char
      this.txt = fullTxt.substring(0, this.txt.length + 1);
    }

    // Insert txt into element
    this.txtElement.innerHTML = `<span class="txt">${this.txt}</span><span class="cursor">|</span>`;

    // Initial Type Speed
    let typeSpeed = 100;

    if(this.isDeleting) {
      typeSpeed /= 2;
    }

    // If word is complete
    if(!this.isDeleting && this.txt === fullTxt) {
      // Make pause at end
      typeSpeed = this.wait;
      // Set delete to true
      this.isDeleting = true;
    } else if(this.isDeleting && this.txt === '') {
      this.isDeleting = false;
      // Move to next word
      this.wordIndex++;
      // Pause before start typing
      typeSpeed = 500;
    }

    setTimeout(() => this.type(), typeSpeed);
  }
}

// Init On DOM Load
document.addEventListener('DOMContentLoaded', init);

// Init App
function init() {
  const txtElement = document.querySelector('.typing-text');
  if (txtElement) {
    const words = JSON.parse(txtElement.getAttribute('data-words'));
    const wait = txtElement.getAttribute('data-wait');
    // Init TypeWriter
    new TypeWriter(txtElement, words, wait);
  }
}

// Progress indicator
window.addEventListener('scroll', () => {
  const scrollIndicator = document.getElementById('scroll-progress');
  if (scrollIndicator) {
    const totalScroll = document.body.scrollHeight - window.innerHeight;
    const progress = (window.pageYOffset / totalScroll) * 100;
    scrollIndicator.style.width = `${progress}%`;
  }
});

// Animate on scroll for all elements with scroll-reveal class
const scrollRevealElements = document.querySelectorAll('.scroll-reveal');
const elementInView = (el, scrollOffset = 150) => {
  const elementTop = el.getBoundingClientRect().top;
  return (
    elementTop <=
    ((window.innerHeight || document.documentElement.clientHeight) - scrollOffset)
  );
};

const handleScrollAnimation = () => {
  scrollRevealElements.forEach((el) => {
    if (elementInView(el, 150)) {
      el.classList.add('reveal');
    }
  });
};

// Initialize particles.js
document.addEventListener("DOMContentLoaded", function() {
  if (document.getElementById('particles-js')) {
    particlesJS.load('particles-js', 'particles.json');
  }
});

// Add floating animation to project cards on hover
const projectCards = document.querySelectorAll('.project-card');
projectCards.forEach(card => {
  card.addEventListener('mouseenter', () => {
    card.classList.add('floating');
  });

  card.addEventListener('mouseleave', () => {
    card.classList.remove('floating');
  });
});

// Initialize scroll animations
window.addEventListener('scroll', handleScrollAnimation);
window.addEventListener('load', handleScrollAnimation);
