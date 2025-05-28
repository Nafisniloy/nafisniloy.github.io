// Enhanced Portfolio App Class
class PortfolioApp {
  constructor() {
    this.visibleProjects = 3;
    this.init();
  }

  init() {
    this.setupNavigation();
    this.setupScrollEffects();
    this.setupThemeToggle();
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
        e.preventDefault();
        const targetId = link.getAttribute('href');
        
        if (targetId.startsWith('#')) {
          const targetElement = document.querySelector(targetId);
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
        }
      });
    });

    // Update active navigation states on scroll
    window.addEventListener('scroll', () => {
      this.updateActiveNavigation();
    });
  }

  updateActiveNavigation() {
    const sections = ['#top', '#about', '#projects', '#contact'];
    const navLinks = document.querySelectorAll('.nav-list a');
    const scrollPosition = window.scrollY + 100;

    sections.forEach((sectionId, index) => {
      const section = document.querySelector(sectionId === '#top' ? '.top-container' : sectionId);
      if (section) {
        const sectionTop = section.offsetTop;
        const sectionBottom = sectionTop + section.offsetHeight;

        if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
          navLinks.forEach(link => link.parentElement.classList.remove('active'));
          const activeLink = document.querySelector(`a[href="${sectionId === '#top' ? '/' : sectionId}"]`);
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
      if (!e.target.closest('.navbar') && menuToggle.checked) {
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
            const totalScroll = document.body.scrollHeight - window.innerHeight;
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
    
    // Load saved theme
    const savedTheme = localStorage.getItem('portfolio-theme');
    if (savedTheme === 'dark') {
      body.classList.add('dark-mode');
      if (themeToggle) {
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
      }
    }
    
    if (themeToggle) {
      themeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        const isDark = body.classList.contains('dark-mode');
        
        // Update button icon
        themeToggle.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
        
        // Save preference
        localStorage.setItem('portfolio-theme', isDark ? 'dark' : 'light');
        
        // Add transition effect
        themeToggle.style.transform = 'rotate(360deg) scale(1.2)';
        setTimeout(() => {
          themeToggle.style.transform = '';
        }, 300);
      });
    }
  }

  handleInitialLoad() {
    // Initially show projects
    const allProjects = document.querySelectorAll('.project-card');
    allProjects.forEach((project, index) => {
      if (index >= this.visibleProjects) {
        project.style.display = 'none';
      } else {
        project.classList.add('scroll-reveal');
      }
    });
    
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
        loadMoreBtn.innerHTML = '<span>Loading...</span> <i class="fas fa-spinner fa-spin"></i>';
        setTimeout(() => {
          if (this.visibleProjects < allProjects.length) {
            loadMoreBtn.innerHTML = 'Load More Projects <i class="fas fa-angle-down"></i>';
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

        // Simulate form submission (replace with actual implementation)
        setTimeout(() => {
          this.showFormStatus('Message sent successfully! I\'ll get back to you soon.', 'success');
          submitBtn.innerHTML = originalBtnText;
          submitBtn.disabled = false;
          contactForm.reset();
          
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
      
      if (type === 'success' || type === 'error') {
        setTimeout(() => {
          status.style.display = 'none';
        }, 5000);
      }
    }
  }

  shakeForm() {
    const form = document.getElementById('contact-form');
    if (form) {
      form.style.animation = 'shake 0.5s ease-in-out';
      setTimeout(() => {
        form.style.animation = '';
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

// Initialize the enhanced portfolio app
document.addEventListener('DOMContentLoaded', () => {
  new PortfolioApp();
  
  // Initialize particles.js if available
  if (typeof particlesJS !== 'undefined' && document.getElementById('particles-js')) {
    particlesJS.load('particles-js', 'particles.json', () => {
      console.log('Particles.js loaded successfully');
    });
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
  if ('performance' in window) {
    setTimeout(() => {
      const perfData = performance.getEntriesByType('navigation')[0];
      console.log('Portfolio Performance:', {
        domContentLoaded: Math.round(perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart),
        loadComplete: Math.round(perfData.loadEventEnd - perfData.loadEventStart)
      });
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

// Intersection Observer for better scroll performance
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

  // Observe all scroll-reveal elements
  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.scroll-reveal').forEach(el => {
      observer.observe(el);
    });
  });
}

