
document.addEventListener('DOMContentLoaded', () => {
  // 1. Navigation Scroll Effect & Active Highlighting
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  const handleScroll = () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // ScrollSpy for Streamlined Navigation
    let currentSection = '';
    const scrollPos = window.scrollY + 180;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentSection = section.getAttribute('id');
      }
    });

    // Map sub-sections to their parent nav links if needed
    let activeNavId = currentSection;
    if (['qcodeai', 'alpha-ai', 'alphasoft'].includes(currentSection)) {
      activeNavId = 'work'; // Highlight 'Work' when viewing these flagship projects
    }

    navLinks.forEach(link => {
      link.classList.remove('active');
      const href = link.getAttribute('href');
      if (href === `#${activeNavId}` || href === `#${currentSection}`) {
        link.classList.add('active');
      }
    });
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // 2. Mobile Menu Drawer
  const menuToggleBtn = document.getElementById('menu-toggle-btn');
  const mobileNav = document.getElementById('mobile-nav');
  const mobileNavBackdrop = document.getElementById('mobile-nav-backdrop');
  const mobileCloseBtn = document.getElementById('mobile-close-btn');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  const openMobileNav = () => {
    if (mobileNav && mobileNavBackdrop) {
      mobileNav.classList.add('open');
      mobileNavBackdrop.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  };

  const closeMobileNav = () => {
    if (mobileNav && mobileNavBackdrop) {
      mobileNav.classList.remove('open');
      mobileNavBackdrop.classList.remove('open');
      document.body.style.overflow = '';
    }
  };

  if (menuToggleBtn) menuToggleBtn.addEventListener('click', openMobileNav);
  if (mobileCloseBtn) mobileCloseBtn.addEventListener('click', closeMobileNav);
  if (mobileNavBackdrop) mobileNavBackdrop.addEventListener('click', closeMobileNav);
  mobileNavLinks.forEach(link => link.addEventListener('click', closeMobileNav));

  // 3. Projects Filter Tabs
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card[data-category]');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const categories = card.getAttribute('data-category').split(' ');
        if (filter === 'all' || categories.includes(filter)) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 20);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(15px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 200);
        }
      });
    });
  });

  // 4. Video Modal (QCodeAI Demo) - Updated to https://youtu.be/Nr6aQLnXgzg
  const videoModal = document.getElementById('video-modal');
  const videoModalClose = document.getElementById('video-modal-close');
  const videoIframe = document.getElementById('video-modal-iframe');
  const youtubeVideoId = 'Nr6aQLnXgzg';

  const openModal = () => {
    if (videoModal && videoIframe) {
      videoIframe.src = `https://www.youtube-nocookie.com/embed/${youtubeVideoId}?autoplay=1&rel=0&modestbranding=1`;
      videoModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  };

  const closeModal = () => {
    if (videoModal && videoIframe) {
      videoIframe.src = '';
      videoModal.classList.remove('active');
      document.body.style.overflow = '';
    }
  };

  // Attach click listener to all video trigger buttons & overlays
  const videoTriggers = document.querySelectorAll('.trigger-qcode-video, #open-qcode-video, #open-qcode-video-overlay');
  videoTriggers.forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      openModal();
    });
    el.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openModal();
      }
    });
  });

  if (videoModalClose) videoModalClose.addEventListener('click', closeModal);
  if (videoModal) {
    videoModal.addEventListener('click', (e) => {
      if (e.target === videoModal) closeModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && videoModal && videoModal.classList.contains('active')) {
      closeModal();
    }
  });

  // 5. Toast Notification System
  const showToast = (message) => {
    let toast = document.getElementById('toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'toast';
      toast.className = 'toast';
      document.body.appendChild(toast);
    }
    toast.innerHTML = `<i class="fas fa-check-circle" style="color: var(--accent-emerald);"></i> <span>${message}</span>`;
    toast.classList.add('show');

    setTimeout(() => {
      toast.classList.remove('show');
    }, 3000);
  };

  // 6. Copy Email to Clipboard
  const copyEmailBtns = document.querySelectorAll('.copy-email-btn');
  copyEmailBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const email = 'mdabunafisniloy@gmail.com';
      navigator.clipboard.writeText(email).then(() => {
        showToast('Email address copied to clipboard!');
      }).catch(() => {
        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = email;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        showToast('Email address copied to clipboard!');
      });
    });
  });

  // 7. Interactive Contact Form (Mailto Generator)
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('sender-name').value.trim();
      const email = document.getElementById('sender-email').value.trim();
      const message = document.getElementById('sender-message').value.trim();

      if (!name || !email || !message) {
        alert('Please fill out all fields before sending.');
        return;
      }

      const subject = encodeURIComponent(`Discussion from ${name} via Portfolio`);
      const body = encodeURIComponent(`Hello Niloy,\n\n${message}\n\nFrom: ${name} (${email})`);
      const mailtoUrl = `mailto:mdabunafisniloy@gmail.com?subject=${subject}&body=${body}`;

      window.location.href = mailtoUrl;
      showToast('Opening your default email client...');
    });
  }
});
