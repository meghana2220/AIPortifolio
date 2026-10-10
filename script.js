/**
 * Meghana Agarwal — Personal Portfolio Interactions
 * Clean, lightweight, dependency-free vanilla JavaScript
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // =========================================================================
  // 1. SELECTORS & CACHED ELEMENTS
  // =========================================================================
  const navbar = document.querySelector('.navbar');
  const navToggle = document.getElementById('nav-toggle');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');
  const backToTopBtn = document.getElementById('back-to-top');
  const toastContainer = document.getElementById('toast-container');
  const contactForm = document.querySelector('.contact-form');
  const formFeedback = document.getElementById('form-feedback');
  const interactiveCards = document.querySelectorAll('.project-card, .profile-card, .service-card');
  const copyableItems = document.querySelectorAll('.contact-item[data-copy]');
  const placeholderLinks = document.querySelectorAll('a[href="#contact"][class*="project-action-link"]');

  // =========================================================================
  // 2. TOAST NOTIFICATION SYSTEM
  // =========================================================================
  /**
   * Displays a temporary notification toast message.
   * @param {string} message - Message text
   * @param {string} type - 'success' | 'info' | 'warning'
   * @param {number} duration - Time in milliseconds before disappearing
   */
  function showToast(message, type = 'info', duration = 3500) {
    if (!toastContainer) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.setAttribute('role', 'alert');

    // Choose appropriate icon
    let iconSvg = '';
    if (type === 'success') {
      iconSvg = `
        <svg class="toast-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>`;
    } else if (type === 'warning') {
      iconSvg = `
        <svg class="toast-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>`;
    } else {
      iconSvg = `
        <svg class="toast-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="16" x2="12" y2="12"></line>
          <line x1="12" y1="8" x2="12.01" y2="8"></line>
        </svg>`;
    }

    toast.innerHTML = `
      ${iconSvg}
      <span class="toast-text">${message}</span>
      <button class="toast-close" aria-label="Close notification">&times;</button>
    `;

    toastContainer.appendChild(toast);

    // Trigger entrance animation
    requestAnimationFrame(() => {
      toast.classList.add('toast-visible');
    });

    const closeBtn = toast.querySelector('.toast-close');
    const dismiss = () => {
      toast.classList.remove('toast-visible');
      toast.classList.add('toast-hiding');
      setTimeout(() => {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
      }, 300);
    };

    if (closeBtn) closeBtn.addEventListener('click', dismiss);
    setTimeout(dismiss, duration);
  }

  // =========================================================================
  // 3. NAVBAR SCROLL EFFECT & ELEVATION
  // =========================================================================
  function handleNavbarScroll() {
    if (!navbar) return;
    const scrollY = window.pageYOffset || document.documentElement.scrollTop;
    if (scrollY > 25) {
      navbar.classList.add('navbar-scrolled');
    } else {
      navbar.classList.remove('navbar-scrolled');
    }
  }

  window.addEventListener('scroll', handleNavbarScroll, { passive: true });
  handleNavbarScroll(); // Initial check

  // =========================================================================
  // 4. SCROLLSPY (ACTIVE NAVIGATION HIGHLIGHT)
  // =========================================================================
  if ('IntersectionObserver' in window && sections.length > 0) {
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -65% 0px',
      threshold: 0
    };

    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const currentId = entry.target.getAttribute('id');
          navLinks.forEach((link) => {
            const href = link.getAttribute('href');
            if (href === `#${currentId}`) {
              link.classList.add('active');
            } else {
              link.classList.remove('active');
            }
          });
        }
      });
    }, observerOptions);

    sections.forEach((section) => sectionObserver.observe(section));
  }

  // =========================================================================
  // 5. MOBILE NAV AUTO-CLOSE & OUTSIDE CLICK
  // =========================================================================
  if (navToggle) {
    // Close mobile menu when clicking any nav link
    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        if (navToggle.checked) {
          navToggle.checked = false;
        }
      });
    });

    // Close mobile menu when pressing Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navToggle.checked) {
        navToggle.checked = false;
      }
    });

    // Close when clicking outside of navbar
    document.addEventListener('click', (e) => {
      if (navToggle.checked && !navbar.contains(e.target)) {
        navToggle.checked = false;
      }
    });
  }

  // =========================================================================
  // 6. BACK TO TOP BUTTON
  // =========================================================================
  if (backToTopBtn) {
    function toggleBackToTop() {
      const scrollY = window.pageYOffset || document.documentElement.scrollTop;
      if (scrollY > 350) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }

    window.addEventListener('scroll', toggleBackToTop, { passive: true });
    toggleBackToTop();

    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // =========================================================================
  // 7. SCROLL REVEAL ANIMATIONS (INTERSECTION OBSERVER)
  // =========================================================================
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!prefersReducedMotion && 'IntersectionObserver' in window) {
    const revealElements = document.querySelectorAll(
      '.section-header, .skill-card, .experience-card, .education-card, .project-card, .service-card, .contact-details-card, .contact-form-card, .about-narrative, .about-card-wrapper'
    );

    // Apply reveal base class
    revealElements.forEach((el, index) => {
      el.classList.add('reveal-item');
      
      // Add staggered delay for grid siblings
      const parentGrid = el.closest('.skills-grid, .education-grid, .projects-grid, .what-i-do-grid');
      if (parentGrid) {
        const siblings = Array.from(parentGrid.children);
        const itemIndex = siblings.indexOf(el);
        if (itemIndex > 0) {
          el.style.transitionDelay = `${(itemIndex % 4) * 0.1}s`;
        }
      }
    });

    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      rootMargin: '0px 0px -60px 0px',
      threshold: 0.1
    });

    revealElements.forEach((el) => revealObserver.observe(el));
  }

  // =========================================================================
  // 8. INTERACTIVE 3D CARD TILT EFFECT (DESKTOP)
  // =========================================================================
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  if (!isTouchDevice && !prefersReducedMotion) {
    interactiveCards.forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -4.5;
        const rotateY = ((x - centerX) / centerX) * 4.5;

        card.style.transform = `perspective(800px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-6px)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }

  // =========================================================================
  // 9. COPY TO CLIPBOARD FOR CONTACT INFO
  // =========================================================================
  copyableItems.forEach((item) => {
    item.addEventListener('click', async () => {
      const textToCopy = item.getAttribute('data-copy');
      const label = item.querySelector('.item-label')?.textContent || 'Content';

      if (!textToCopy || textToCopy.startsWith('[Add')) {
        showToast(`Placeholder: configure ${label.toLowerCase()} in index.html`, 'info');
        return;
      }

      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(textToCopy);
          showToast(`${label} copied to clipboard!`, 'success');
        } else {
          // Fallback
          const tempInput = document.createElement('input');
          tempInput.value = textToCopy;
          document.body.appendChild(tempInput);
          tempInput.select();
          document.execCommand('copy');
          document.body.removeChild(tempInput);
          showToast(`${label} copied to clipboard!`, 'success');
        }

        // Visual flash indicator on item
        item.classList.add('copy-success');
        setTimeout(() => item.classList.remove('copy-success'), 1200);
      } catch (err) {
        showToast(`Could not copy: ${textToCopy}`, 'warning');
      }
    });
  });

  // =========================================================================
  // 10. PLACEHOLDER ACTION LINK FEEDBACK
  // =========================================================================
  placeholderLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      const isGitHub = link.classList.contains('project-github-link');
      const projectTitle = link.closest('.project-card')?.querySelector('.project-title')?.textContent || 'Project';

      if (isGitHub) {
        showToast(`GitHub repository for "${projectTitle}" (placeholder link)`, 'info');
      } else {
        showToast(`Details for "${projectTitle}" (placeholder link)`, 'info');
      }
    });
  });

  // Resume PDF click handler
  const resumeBtn = document.querySelector('a[href="Meghana_Agarwal_Resume.pdf"]');
  if (resumeBtn) {
    resumeBtn.addEventListener('click', () => {
      showToast('Opening Meghana_Agarwal_Resume.pdf in a new tab...', 'info', 2500);
    });
  }

  // =========================================================================
  // 11. CONTACT FORM SUBMISSION & CLIENT-SIDE VALIDATION
  // =========================================================================
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const fullnameInput = document.getElementById('fullname');
      const emailInput = document.getElementById('email');
      const subjectInput = document.getElementById('subject');
      const messageInput = document.getElementById('message');
      const submitBtn = contactForm.querySelector('.btn-submit');

      // Basic client-side validation
      if (!fullnameInput.value.trim() || !emailInput.value.trim() || !subjectInput.value.trim() || !messageInput.value.trim()) {
        showToast('Please fill out all required fields.', 'warning');
        return;
      }

      // Email format check
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(emailInput.value.trim())) {
        showToast('Please enter a valid email address.', 'warning');
        emailInput.focus();
        return;
      }

      // Simulate sending state
      const originalBtnHtml = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.classList.add('btn-loading');
      submitBtn.innerHTML = `
        <span class="spinner" aria-hidden="true"></span>
        <span>Sending Message...</span>
      `;

      setTimeout(() => {
        // Reset submit button
        submitBtn.disabled = false;
        submitBtn.classList.remove('btn-loading');
        submitBtn.innerHTML = originalBtnHtml;

        // Show feedback message
        if (formFeedback) {
          formFeedback.style.display = 'flex';
          formFeedback.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }

        showToast('Thank you! Your message has been sent successfully.', 'success', 4500);

        // Reset form
        contactForm.reset();

        // Hide inline feedback after 6 seconds
        setTimeout(() => {
          if (formFeedback) {
            formFeedback.style.display = 'none';
          }
        }, 6000);
      }, 900);
    });
  }
});
