(function () {
  const focusableSelector = [
    'a[href]:not([tabindex="-1"])',
    'button:not([disabled]):not([tabindex="-1"])',
    'input:not([disabled]):not([type="hidden"]):not([tabindex="-1"])',
    'select:not([disabled]):not([tabindex="-1"])',
    'textarea:not([disabled]):not([tabindex="-1"])',
    '[tabindex]:not([tabindex="-1"])',
  ].join(',');

  const style = document.createElement('style');
  style.textContent = `
    :focus-visible{outline:3px solid #21343B!important;outline-offset:3px!important}
    .bg-charcoal :focus-visible,.ba-lightbox :focus-visible{outline-color:#A8D4D4!important}
    .skip-link{position:absolute;left:1rem;top:-5rem;z-index:9999;background:#21343B;color:#fff;padding:.75rem 1rem;font-family:"DM Sans",system-ui,sans-serif;font-size:.875rem;font-weight:700}
    .skip-link:focus,.skip-link:focus-visible{top:1rem}
    .faq-button{display:flex;width:100%;align-items:center;justify-content:space-between;gap:1rem;text-align:left;cursor:pointer}
    .faq-button[aria-expanded="true"] [data-faq-icon]{transform:rotate(45deg)}
    .faq-panel[hidden]{display:none}
    [aria-current="page"]{text-decoration:underline;text-underline-offset:.35em}
    @media (prefers-reduced-motion: reduce){*{animation-duration:.001ms!important;animation-iteration-count:1!important;scroll-behavior:auto!important;transition-duration:.001ms!important}}
  `;
  document.head.appendChild(style);

  function ready(callback) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', callback, { once: true });
    } else {
      callback();
    }
  }

  function ensureSkipLink() {
    if (document.querySelector('.skip-link')) return;
    const main = document.getElementById('main-content');
    if (!main) return;
    const skip = document.createElement('a');
    skip.href = '#main-content';
    skip.className = 'skip-link';
    skip.textContent = 'Skip to main content';
    document.body.prepend(skip);
  }

  function pathFromHref(href) {
    try {
      const url = new URL(href, window.location.origin);
      return url.origin === window.location.origin ? url.pathname.replace(/\/$/, '') || '/' : '';
    } catch {
      return '';
    }
  }

  function markCurrentLinks() {
    const currentPath = window.location.pathname.replace(/\/$/, '') || '/';
    document.querySelectorAll('a[href]').forEach(link => {
      const linkPath = pathFromHref(link.getAttribute('href'));
      if (!linkPath || linkPath !== currentPath) return;
      link.setAttribute('aria-current', 'page');
    });
  }

  function enhanceMobileMenu() {
    const button = document.getElementById('menu-btn');
    const menu = document.getElementById('mobile-menu');
    if (!button || !menu) return;

    button.type = 'button';
    button.setAttribute('aria-controls', menu.id);
    if (!menu.hasAttribute('aria-label')) menu.setAttribute('aria-label', 'Mobile');

    const iconMenu = document.getElementById('icon-menu');
    const iconClose = document.getElementById('icon-close');
    const sync = () => {
      const isOpen = !menu.classList.contains('hidden');
      button.setAttribute('aria-expanded', String(isOpen));
      button.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
      menu.setAttribute('aria-hidden', String(!isOpen));
      if (iconMenu) iconMenu.classList.toggle('hidden', isOpen);
      if (iconClose) iconClose.classList.toggle('hidden', !isOpen);
    };
    const close = (restoreFocus) => {
      menu.classList.add('hidden');
      menu.classList.remove('flex');
      sync();
      if (restoreFocus) button.focus();
    };

    button.addEventListener('click', () => window.setTimeout(sync, 0));
    menu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => close(false)));
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && !menu.classList.contains('hidden')) close(true);
    });

    const observer = new MutationObserver(sync);
    observer.observe(menu, { attributes: true, attributeFilter: ['class'] });
    sync();
  }

  function enhanceFaqs() {
    let count = 0;
    document.querySelectorAll('details').forEach(details => {
      if (details.dataset.a11yEnhanced === 'true') return;
      const summary = details.querySelector(':scope > summary');
      if (!summary) return;
      count += 1;
      details.dataset.a11yEnhanced = 'true';

      const wrapper = document.createElement('div');
      wrapper.className = details.className;
      if (details.getAttribute('style')) wrapper.setAttribute('style', details.getAttribute('style'));
      wrapper.removeAttribute('open');

      const button = document.createElement('button');
      button.type = 'button';
      button.className = `${summary.className || ''} faq-button`.trim();
      if (summary.getAttribute('style')) button.setAttribute('style', summary.getAttribute('style'));
      button.innerHTML = summary.innerHTML;

      const icon = button.querySelector('span:last-child');
      if (icon) icon.setAttribute('data-faq-icon', '');

      const panel = document.createElement('div');
      panel.className = 'faq-panel';
      panel.id = details.id ? `${details.id}-panel` : `faq-panel-${count}`;
      Array.from(details.childNodes).forEach(node => {
        if (node !== summary) panel.appendChild(node);
      });

      const setOpen = open => {
        button.setAttribute('aria-expanded', String(open));
        panel.hidden = !open;
      };

      button.setAttribute('aria-controls', panel.id);
      button.dataset.a11yBound = 'true';
      button.addEventListener('click', () => setOpen(button.getAttribute('aria-expanded') !== 'true'));
      setOpen(details.hasAttribute('open'));

      wrapper.append(button, panel);
      details.replaceWith(wrapper);
    });

    document.querySelectorAll('.faq-button[aria-controls]').forEach(button => {
      if (button.dataset.a11yBound === 'true') return;
      const panel = document.getElementById(button.getAttribute('aria-controls'));
      if (!panel) return;
      button.dataset.a11yBound = 'true';
      button.addEventListener('click', () => {
        const open = button.getAttribute('aria-expanded') === 'true';
        button.setAttribute('aria-expanded', String(!open));
        panel.hidden = open;
      });
    });
  }

  function enhanceForms() {
    document.querySelectorAll('[id$="-phone-error"],#appointment-phone-error,#smileError').forEach(error => {
      error.setAttribute('role', 'alert');
      error.setAttribute('aria-live', 'assertive');
    });

    document.querySelectorAll('input[type="tel"][id]').forEach(input => {
      const error = document.getElementById(`${input.id}-error`);
      if (!error) return;
      input.setAttribute('aria-describedby', error.id);
      if (!input.hasAttribute('aria-invalid')) input.setAttribute('aria-invalid', 'false');
    });

    const smileError = document.getElementById('smileError');
    if (smileError) {
      smileError.tabIndex = -1;
      const focusError = () => {
        const visible = window.getComputedStyle(smileError).display !== 'none';
        if (visible && smileError.textContent.trim()) smileError.focus({ preventScroll: true });
      };
      new MutationObserver(focusError).observe(smileError, { childList: true, subtree: true, attributes: true, attributeFilter: ['style', 'class'] });
    }

    const smileLoading = document.getElementById('smileLoading');
    if (smileLoading) {
      smileLoading.setAttribute('role', 'status');
      smileLoading.setAttribute('aria-live', 'polite');
      smileLoading.setAttribute('aria-atomic', 'true');
    }

    document.querySelectorAll('input[name="website"][id]').forEach(input => {
      if (!input.hasAttribute('aria-label')) input.setAttribute('aria-label', 'Leave this field blank');
    });

    document.querySelectorAll('label:not([for]) > input[type="checkbox"][id]').forEach(input => {
      input.closest('label')?.setAttribute('for', input.id);
    });
  }

  function enhanceDialogs() {
    let activeDialog = null;
    let returnFocusTarget = null;

    const focusables = dialog => Array.from(dialog.querySelectorAll(focusableSelector))
      .filter(element => element.offsetParent !== null || element === document.activeElement);

    const visible = dialog => !dialog.hidden && dialog.getAttribute('aria-hidden') !== 'true' && window.getComputedStyle(dialog).display !== 'none';

    const openDialog = dialog => {
      activeDialog = dialog;
      if (!dialog.hasAttribute('tabindex')) dialog.tabIndex = -1;
      window.setTimeout(() => {
        const first = focusables(dialog)[0] || dialog;
        first.focus({ preventScroll: true });
      }, 0);
    };

    const closeDialog = dialog => {
      if (activeDialog === dialog) activeDialog = null;
      const target = dialog.__returnFocusTarget || returnFocusTarget;
      if (target && target.isConnected) target.focus({ preventScroll: true });
      dialog.__returnFocusTarget = null;
    };

    document.addEventListener('click', event => {
      const trigger = event.target.closest('.ba-pair-card,.ba-single-card');
      if (trigger) returnFocusTarget = trigger;
    }, true);
    document.addEventListener('keydown', event => {
      if ((event.key === 'Enter' || event.key === ' ') && event.target.closest('.ba-pair-card,.ba-single-card')) {
        returnFocusTarget = event.target.closest('.ba-pair-card,.ba-single-card');
      }
    }, true);

    document.querySelectorAll('[role="dialog"][aria-modal="true"]').forEach(dialog => {
      if (dialog.dataset.a11yDialog === 'true') return;
      dialog.dataset.a11yDialog = 'true';
      const observer = new MutationObserver(() => {
        if (visible(dialog)) {
          dialog.__returnFocusTarget = returnFocusTarget || document.activeElement;
          openDialog(dialog);
        } else {
          closeDialog(dialog);
        }
      });
      observer.observe(dialog, { attributes: true, attributeFilter: ['hidden', 'aria-hidden', 'class', 'style'] });
    });

    document.addEventListener('keydown', event => {
      if (!activeDialog || !visible(activeDialog)) return;
      if (event.key === 'Escape') {
        const closeButton = activeDialog.querySelector('[aria-label*="Close"],button');
        if (closeButton) closeButton.click();
        return;
      }
      if (event.key !== 'Tab') return;

      const items = focusables(activeDialog);
      if (!items.length) {
        event.preventDefault();
        activeDialog.focus();
        return;
      }
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    });
  }

  ready(() => {
    ensureSkipLink();
    markCurrentLinks();
    enhanceMobileMenu();
    enhanceFaqs();
    enhanceForms();
    enhanceDialogs();
  });
})();
