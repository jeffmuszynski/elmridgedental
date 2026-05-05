(function () {
  const root = document.documentElement;
  const saved = JSON.parse(localStorage.getItem('elmAccessibility') || '{}');

  const style = document.createElement('style');
  style.textContent = `
    :focus-visible{outline:3px solid #2C3E3E!important;outline-offset:3px!important}
    .skip-link{position:absolute;left:1rem;top:-5rem;z-index:9999;background:#2C3E3E;color:#fff;padding:.75rem 1rem}
    .skip-link:focus{top:1rem}
    .a11y-toggle{position:fixed;right:1rem;bottom:1rem;z-index:9998;width:44px;height:44px;border-radius:999px;background:#2C3E3E;color:#fff;border:2px solid #fff;box-shadow:0 6px 20px rgba(0,0,0,.18);font:700 18px system-ui}
    .a11y-panel{position:fixed;right:1rem;bottom:4.5rem;z-index:9998;width:min(280px,calc(100vw - 2rem));background:#fff;border:1px solid #A8D4D4;box-shadow:0 14px 36px rgba(44,62,62,.18);padding:1rem}
    .a11y-panel[hidden]{display:none}
    .a11y-panel button{display:block;width:100%;margin:.4rem 0;padding:.65rem;border:1px solid #A8D4D4;background:#F5F0EB;color:#2C3E3E;text-align:left}
    .a11y-large-text body{font-size:112.5%}
    .a11y-highlight-links a{text-decoration:underline!important;text-decoration-thickness:2px!important}
    .a11y-high-contrast body{background:#fff!important;color:#111!important}
    .a11y-high-contrast a{color:#064f56!important}
    .a11y-reduce-motion *{animation:none!important;transition:none!important;scroll-behavior:auto!important}
    @media (prefers-reduced-motion: reduce){*{animation:none!important;transition:none!important;scroll-behavior:auto!important}}
  `;
  document.head.appendChild(style);

  const apply = () => {
    root.classList.toggle('a11y-large-text', !!saved.largeText);
    root.classList.toggle('a11y-high-contrast', !!saved.highContrast);
    root.classList.toggle('a11y-highlight-links', !!saved.highlightLinks);
    root.classList.toggle('a11y-reduce-motion', !!saved.reduceMotion);
    localStorage.setItem('elmAccessibility', JSON.stringify(saved));
  };

  if (!document.querySelector('.skip-link')) {
    const skip = document.createElement('a');
    skip.href = '#main-content';
    skip.className = 'skip-link';
    skip.textContent = 'Skip to main content';
    document.body.prepend(skip);
  }

  const button = document.createElement('button');
  button.className = 'a11y-toggle';
  button.type = 'button';
  button.setAttribute('aria-label', 'Open accessibility options');
  button.setAttribute('aria-expanded', 'false');
  button.textContent = 'A';

  const panel = document.createElement('div');
  panel.className = 'a11y-panel';
  panel.hidden = true;
  panel.innerHTML = `<p style="font-weight:700;margin:0 0 .5rem;color:#2C3E3E">Accessibility Options</p>
    <button type="button" data-a11y="largeText">Increase text size</button>
    <button type="button" data-a11y="highContrast">High contrast mode</button>
    <button type="button" data-a11y="highlightLinks">Highlight links</button>
    <button type="button" data-a11y="reduceMotion">Pause/reduce motion</button>`;

  button.addEventListener('click', () => {
    panel.hidden = !panel.hidden;
    button.setAttribute('aria-expanded', String(!panel.hidden));
  });
  panel.addEventListener('click', event => {
    const key = event.target && event.target.getAttribute('data-a11y');
    if (!key) return;
    saved[key] = !saved[key];
    apply();
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      panel.hidden = true;
      button.setAttribute('aria-expanded', 'false');
    }
  });

  document.body.append(button, panel);
  apply();
})();
