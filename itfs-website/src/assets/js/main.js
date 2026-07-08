(function () {
  'use strict';

  /**
   * Verhindert, dass der Browser beim Neuladen automatisch
   * wieder zu einer alten Scrollposition oder zu #leistungen springt.
   */
  function initScrollRestoration() {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    if (window.location.hash) {
      window.history.replaceState(
        null,
        document.title,
        window.location.pathname + window.location.search
      );

      window.scrollTo(0, 0);
    }
  }

  /**
   * Interne Ankerlinks sauber scrollen,
   * ohne dauerhaft #leistungen in die URL zu schreiben.
   */
  function initSmoothAnchors() {
    var links = document.querySelectorAll('a[href^="#"]');

    links.forEach(function (link) {
      link.addEventListener('click', function (event) {
        var href = link.getAttribute('href');

        if (!href || href === '#') return;

        var target = document.querySelector(href);

        if (!target) return;

        event.preventDefault();

        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });

        if (window.history && window.history.replaceState) {
          window.history.replaceState(
            null,
            document.title,
            window.location.pathname + window.location.search
          );
        }
      });
    });
  }

  /**
   * Mobile Navigation
   */
  function initNavigation() {
    var navToggle = document.getElementById('nav-toggle');
    var siteNav = document.getElementById('site-nav');

    if (!navToggle || !siteNav) return;

    function closeNav() {
      navToggle.setAttribute('aria-expanded', 'false');
      siteNav.classList.remove('is-open');
    }

    function openNav() {
      navToggle.setAttribute('aria-expanded', 'true');
      siteNav.classList.add('is-open');
    }

    navToggle.addEventListener('click', function () {
      var isOpen = navToggle.getAttribute('aria-expanded') === 'true';

      if (isOpen) {
        closeNav();
      } else {
        openNav();
      }
    });

    siteNav.addEventListener('click', function (event) {
      var target = event.target;

      if (target && target.closest && target.closest('.site-nav__link')) {
        closeNav();
      }
    });

    document.addEventListener('keydown', function (event) {
      if (
        event.key === 'Escape' &&
        navToggle.getAttribute('aria-expanded') === 'true'
      ) {
        closeNav();
        navToggle.focus();
      }
    });
  }

  /**
   * Hero Typewriter
   */
  function initHeroTypewriter() {
    var typewriterElement = document.getElementById('typewriter');

    if (!typewriterElement) return;

    var phrases;
    var customPhrases = typewriterElement.getAttribute('data-phrases');

    if (customPhrases) {
      phrases = customPhrases
        .split('|')
        .map(function (phrase) { return phrase.trim(); })
        .filter(function (phrase) { return phrase.length > 0; });
    } else {
      phrases = [
        'die läuft.',
        'die mitwächst.',
        'für dich.'
      ];
    }

    if (phrases.length === 0) return;

    var prefersReducedMotion =
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      typewriterElement.textContent = phrases[0];
      return;
    }

    var phraseIndex = 0;
    var charIndex = phrases[0].length;
    var isDeleting = true;

    var typingSpeed = 100;
    var deletingSpeed = 70;
    var pauseAfterTyping = 2500;
    var pauseAfterDeleting = 500;
    var initialDelay = 1000;

    function typeLoop() {
      var currentPhrase = phrases[phraseIndex];

      if (isDeleting) {
        charIndex = charIndex - 1;
      } else {
        charIndex = charIndex + 1;
      }

      typewriterElement.textContent = currentPhrase.substring(0, charIndex);

      var delay = isDeleting ? deletingSpeed : typingSpeed;

      if (!isDeleting && charIndex === currentPhrase.length) {
        delay = pauseAfterTyping;
        isDeleting = true;
      }

      if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        delay = pauseAfterDeleting;
      }

      window.setTimeout(typeLoop, delay);
    }

    window.setTimeout(typeLoop, initialDelay);
  }

  /**
   * Kontaktformular per Mailto
   */
  function initContactForm() {
    var form = document.getElementById('contact-form');

    if (!form) return;

    form.addEventListener('submit', function (event) {
      event.preventDefault();

      var nameInput = document.getElementById('contact-name');
      var emailInput = document.getElementById('contact-email');
      var subjectInput = document.getElementById('contact-subject');
      var messageInput = document.getElementById('contact-message');
      var privacyInput = document.getElementById('contact-privacy');

      if (
        !nameInput ||
        !emailInput ||
        !subjectInput ||
        !messageInput ||
        !privacyInput
      ) {
        return;
      }

      var name = nameInput.value.trim();
      var email = emailInput.value.trim();
      var subject = subjectInput.value.trim();
      var message = messageInput.value.trim();
      var privacyAccepted = privacyInput.checked;

      if (!name || !email || !subject || !message || !privacyAccepted) {
        form.reportValidity();
        return;
      }

      var mailSubject = 'Kontaktanfrage: ' + subject;

      var mailBody =
        'Name: ' + name + '\n' +
        'E-Mail: ' + email + '\n\n' +
        'Nachricht:\n' +
        message + '\n\n' +
        '---\n' +
        'Gesendet über das Kontaktformular von florian-spengler.de';

      var mailtoUrl =
        'mailto:kontakt@florian-spengler.de' +
        '?subject=' + encodeURIComponent(mailSubject) +
        '&body=' + encodeURIComponent(mailBody);

      window.location.href = mailtoUrl;
    });
  }

  /**
   * Copyright-Jahr automatisch setzen
   */
  function initCopyrightYear() {
    var yearEl = document.getElementById('copyright-year');

    if (yearEl) {
      yearEl.textContent = String(new Date().getFullYear());
    }
  }

  /**
   * Init
   */
  function init() {
    initScrollRestoration();
    initSmoothAnchors();
    initNavigation();
    initHeroTypewriter();
    initContactForm();
    initCopyrightYear();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();