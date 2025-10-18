// Enhanced Portfolio App Class
class PortfolioApp {
  constructor() {
    this.visibleProjects = 3;
    this.init();
  }

  init() {
    this.setupThemeToggle(); // Load theme first before other effects
    this.setupNavigation();
    this.setupScrollEffects();
    this.setupProjectsLogic();
    this.setupContactForm();
    this.setupMobileMenu();
    this.setupScrollAnimations();
    this.handleInitialLoad();
  }

  setupNavigation() {
    // Enhanced navigation with active state management
    const navLinks = document.querySelectorAll('.nav-list a');
    const sections = document.querySelectorAll('section, .about-container, .projects-container, .contact-section');
    
    // Smooth scrolling with navbar offset
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        const targetHref = link.getAttribute('href');
        
        // Only prevent default for anchor links
        if (targetHref && targetHref.startsWith('#')) {
          e.preventDefault();
          const targetElement = document.querySelector(targetHref);
          if (targetElement) {
            const navbarHeight = document.querySelector('.navbar').offsetHeight;
            const targetPosition = targetElement.offsetTop - navbarHeight - 20;
            
            window.scrollTo({
              top: targetPosition,
              behavior: 'smooth'
            });
            
            // Close mobile menu if open
            this.closeMobileMenu();
          }
        } else if (targetHref === '/' || targetHref === '') {
          // Handle home link
          e.preventDefault();
          window.scrollTo({
            top: 0,
            behavior: 'smooth'
          });
          this.closeMobileMenu();
        }
      });
    });

    // Update active navigation states on scroll
    window.addEventListener('scroll', () => {
      this.updateActiveNavigation();
    });
  }

  updateActiveNavigation() {
    const sections = [
      { id: '.top-container', href: '/' },
      { id: '#about', href: '#about' },
      { id: '#projects', href: '#projects' },
      { id: '#contact', href: '#contact' }
    ];
    const navLinks = document.querySelectorAll('.nav-list a');
    const scrollPosition = window.scrollY + 150;

    sections.forEach((section) => {
      const sectionElement = document.querySelector(section.id);
      if (sectionElement) {
        const sectionTop = sectionElement.offsetTop;
        const sectionBottom = sectionTop + sectionElement.offsetHeight;

        if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
          navLinks.forEach(link => link.parentElement.classList.remove('active'));
          const activeLink = document.querySelector(`a[href="${section.href}"]`);
          if (activeLink) {
            activeLink.parentElement.classList.add('active');
          }
        }
      }
    });
  }

  setupMobileMenu() {
    const menuToggle = document.getElementById('menu-toggle');
    const navList = document.querySelector('.nav-list');
    
    // Close menu when clicking on a link
    document.querySelectorAll('.nav-list a').forEach(link => {
      link.addEventListener('click', () => {
        this.closeMobileMenu();
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.navbar') && menuToggle && menuToggle.checked) {
        this.closeMobileMenu();
      }
    });
  }

  closeMobileMenu() {
    const menuToggle = document.getElementById('menu-toggle');
    if (menuToggle) {
      menuToggle.checked = false;
    }
  }

  setupScrollEffects() {
    const navbar = document.querySelector('.navbar');
    const scrollProgress = document.getElementById('scroll-progress');
    
    let ticking = false;
    
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          // Navbar scroll effect
          if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
          } else {
            navbar.classList.remove('scrolled');
          }
          
          // Scroll progress
          if (scrollProgress) {
            const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
            const progress = (window.pageYOffset / totalScroll) * 100;
            scrollProgress.style.width = `${Math.min(progress, 100)}%`;
          }
          
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  setupThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    
    if (!themeToggle) return;
    
    // Load saved theme immediately (before page renders)
    const savedTheme = localStorage.getItem('portfolio-theme');
    const isDarkMode = savedTheme === 'dark';
    
    // Apply theme immediately
    if (isDarkMode) {
      body.classList.add('dark-mode');
      themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    } else {
      body.classList.remove('dark-mode');
      themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    }
    
    // Theme toggle click handler
    themeToggle.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      body.classList.toggle('dark-mode');
      const isNowDark = body.classList.contains('dark-mode');
      
      // Update button icon with smooth transition
      themeToggle.innerHTML = isNowDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
      
      // Save preference to localStorage
      localStorage.setItem('portfolio-theme', isNowDark ? 'dark' : 'light');
      
      // Add rotation animation
      themeToggle.style.transition = 'transform 0.3s ease';
      themeToggle.style.transform = 'rotate(360deg) scale(1.2)';
      
      setTimeout(() => {
        themeToggle.style.transform = '';
      }, 300);
      
      // Log for debugging
      console.log('Theme toggled:', isNowDark ? 'dark' : 'light');
    });
  }

  handleInitialLoad() {
    // Initially show/hide projects
    const allProjects = document.querySelectorAll('.project-card');
    allProjects.forEach((project, index) => {
      if (index >= this.visibleProjects) {
        project.style.display = 'none';
      } else {
        project.classList.add('scroll-reveal');
      }
    });
    
    // Check if load more button should be hidden
    const loadMoreBtn = document.getElementById('load-more');
    if (loadMoreBtn && allProjects.length <= this.visibleProjects) {
      loadMoreBtn.style.display = 'none';
    }
    
    // Trigger initial scroll animations
    setTimeout(() => {
      this.updateScrollAnimations();
    }, 100);
  }

  setupProjectsLogic() {
    const loadMoreBtn = document.getElementById('load-more');
    
    if (loadMoreBtn) {
      loadMoreBtn.addEventListener('click', () => {
        const allProjects = document.querySelectorAll('.project-card');
        const hiddenProjects = Array.from(allProjects).slice(this.visibleProjects, this.visibleProjects + 3);
        
        // Show projects with staggered animation
        hiddenProjects.forEach((project, index) => {
          setTimeout(() => {
            project.style.display = 'block';
            project.classList.add('scroll-reveal', 'reveal');
            project.style.animationDelay = `${index * 0.1}s`;
          }, index * 100);
        });
        
        this.visibleProjects += 3;
        
        // Hide button if all projects are visible
        if (this.visibleProjects >= allProjects.length) {
          loadMoreBtn.style.display = 'none';
        }
        
        // Update button with loading animation
        const originalText = loadMoreBtn.innerHTML;
        loadMoreBtn.innerHTML = '<span>Loading...</span> <i class="fas fa-spinner fa-spin"></i>';
        loadMoreBtn.disabled = true;
        
        setTimeout(() => {
          if (this.visibleProjects < allProjects.length) {
            loadMoreBtn.innerHTML = originalText;
            loadMoreBtn.disabled = false;
          }
        }, 1000);
      });
    }

    // Add enhanced hover effects to project cards
    document.querySelectorAll('.project-card').forEach(card => {
      card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-15px) scale(1.02)';
        card.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
      });
      
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }

  setupContactForm() {
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
      contactForm.addEventListener('submit', (event) => {
        event.preventDefault();
        
        const status = document.getElementById('status');
        const submitBtn = document.getElementById('submit-btn');
        const originalBtnText = submitBtn.innerHTML;

        // Enhanced form validation
        const formData = new FormData(contactForm);
        const name = formData.get('name')?.trim();
        const email = formData.get('email')?.trim();
        const message = formData.get('message')?.trim();

        if (!name || !email || !message) {
          this.showFormStatus('Please fill in all fields.', 'error');
          this.shakeForm();
          return;
        }

        if (!this.isValidEmail(email)) {
          this.showFormStatus('Please enter a valid email address.', 'error');
          this.shakeForm();
          return;
        }

        // Show sending state
        this.showFormStatus('Sending message...', 'sending');
        submitBtn.innerHTML = '<span>Sending...</span> <i class="fas fa-spinner fa-spin"></i>';
        submitBtn.disabled = true;

        // Simulate form submission (replace with actual EmailJS or backend implementation)
        setTimeout(() => {
          this.showFormStatus('Message sent successfully! I\'ll get back to you soon.', 'sent');
          submitBtn.innerHTML = originalBtnText;
          submitBtn.disabled = false;
          contactForm.reset();
          
          // Remove validation classes
          contactForm.querySelectorAll('.error, .success').forEach(el => {
            el.classList.remove('error', 'success');
          });
          
          // Success animation
          submitBtn.style.transform = 'scale(1.05)';
          setTimeout(() => {
            submitBtn.style.transform = '';
          }, 200);
        }, 2000);
      });

      // Real-time form validation
      const inputs = contactForm.querySelectorAll('input, textarea');
      inputs.forEach(input => {
        input.addEventListener('blur', () => {
          this.validateField(input);
        });
        
        input.addEventListener('input', () => {
          if (input.classList.contains('error')) {
            this.validateField(input);
          }
        });
      });
    }
  }

  validateField(field) {
    const value = field.value.trim();
    const fieldName = field.name;
    
    field.classList.remove('error', 'success');
    
    if (!value) {
      field.classList.add('error');
      return false;
    }
    
    if (fieldName === 'email' && !this.isValidEmail(value)) {
      field.classList.add('error');
      return false;
    }
    
    field.classList.add('success');
    return true;
  }

  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  showFormStatus(message, type) {
    const status = document.getElementById('status');
    if (status) {
      status.textContent = message;
      status.className = `form-status ${type}`;
      status.style.display = 'block';
      
      if (type === 'sent' || type === 'error') {
        setTimeout(() => {
          status.style.display = 'none';
        }, 5000);
      }
    }
  }

  shakeForm() {
    const form = document.getElementById('contact-form');
    if (form) {
      form.classList.add('shake');
      setTimeout(() => {
        form.classList.remove('shake');
      }, 500);
    }
  }

  setupScrollAnimations() {
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          this.updateScrollAnimations();
          ticking = false;
        });
        ticking = true;
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Initial check
    this.updateScrollAnimations();
  }

  updateScrollAnimations() {
    const scrollElements = document.querySelectorAll('.scroll-reveal:not(.reveal)');
    
    scrollElements.forEach(el => {
      if (this.isElementInViewport(el)) {
        el.classList.add('reveal');
      }
    });
  }

  isElementInViewport(el, offset = 100) {
    const rect = el.getBoundingClientRect();
    return (
      rect.top <= (window.innerHeight || document.documentElement.clientHeight) - offset &&
      rect.bottom >= 0
    );
  }
}

// Apply theme IMMEDIATELY before DOM loads to prevent flash
(function() {
  const savedTheme = localStorage.getItem('portfolio-theme');
  if (savedTheme === 'dark') {
    document.documentElement.classList.add('dark-mode');
    document.body.classList.add('dark-mode');
  }
})();

// Initialize the enhanced portfolio app
document.addEventListener('DOMContentLoaded', () => {
  new PortfolioApp();
  
  // Initialize particles.js if available
  if (typeof particlesJS !== 'undefined' && document.getElementById('particles-js')) {
    particlesJS('particles-js', {
      particles: {
        number: {
          value: 80,
          density: {
            enable: true,
            value_area: 800
          }
        },
        color: {
          value: '#6366f1'
        },
        shape: {
          type: 'circle'
        },
        opacity: {
          value: 0.5,
          random: false
        },
        size: {
          value: 3,
          random: true
        },
        line_linked: {
          enable: true,
          distance: 150,
          color: '#6366f1',
          opacity: 0.4,
          width: 1
        },
        move: {
          enable: true,
          speed: 2,
          direction: 'none',
          random: false,
          straight: false,
          out_mode: 'out',
          bounce: false
        }
      },
      interactivity: {
        detect_on: 'canvas',
        events: {
          onhover: {
            enable: true,
            mode: 'repulse'
          },
          onclick: {
            enable: true,
            mode: 'push'
          },
          resize: true
        }
      },
      retina_detect: true
    });
    console.log('Particles.js loaded successfully');
  }
  
  // Remove loading class after everything is loaded
  setTimeout(() => {
    document.body.classList.remove('loading');
  }, 500);
});

// Enhanced performance monitoring
window.addEventListener('load', () => {
  // Add loaded class for any CSS animations that depend on it
  document.body.classList.add('loaded');
  
  // Performance logging
  if ('performance' in window && window.performance.getEntriesByType) {
    setTimeout(() => {
      const perfData = performance.getEntriesByType('navigation')[0];
      if (perfData) {
        console.log('Portfolio Performance:', {
          domContentLoaded: Math.round(perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart) + 'ms',
          loadComplete: Math.round(perfData.loadEventEnd - perfData.loadEventStart) + 'ms'
        });
      }
    }, 0);
  }
});

// Page visibility API for better performance
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    document.body.classList.add('paused');
  } else {
    document.body.classList.remove('paused');
  }
});

// Enhanced error handling
window.addEventListener('error', (event) => {
  console.error('Portfolio Error:', event.error);
});

// Intersection Observer for better scroll performance (backup method)
if ('IntersectionObserver' in window) {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe all scroll-reveal elements after DOM loads
  window.addEventListener('load', () => {
    document.querySelectorAll('.scroll-reveal').forEach(el => {
      observer.observe(el);
    });
  });
}
