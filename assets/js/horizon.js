(function () {
  'use strict';

  /** Replace ⭐️ N/10 with a colored badge in h2, h3, and li elements */
  function processScoreBadges() {
    var scoreRe = /⭐️\s*(\d+(?:\.\d+)?)\/10/;
    var targets = document.querySelectorAll('.main-content h2, .main-content h3, .main-content li');
    targets.forEach(function (el) {
      var m = el.innerHTML.match(scoreRe);
      if (!m) return;
      var score = parseFloat(m[1]);
      var tier;
      if (score >= 9) tier = 'high';
      else if (score >= 7) tier = 'good';
      else if (score >= 5) tier = 'mid';
      else tier = 'low';
      el.innerHTML = el.innerHTML.replace(
        scoreRe,
        '<span class="score-badge" data-tier="' + tier + '">' + m[1] + '</span>'
      );
    });
  }

  /** Add semantic classes to tag lines, source lines, and background paragraphs */
  function markSemanticElements() {
    var paragraphs = document.querySelectorAll('.main-content p');
    paragraphs.forEach(function (p) {
      var text = p.textContent.trim();

      // Tag line: starts with Tags or 标签 (bold prefix rendered by Markdown)
      if (/^(Tags|标签)\s*:/.test(text)) {
        p.classList.add('tag-line');
        return;
      }

      // Source line: pattern like "source · site · date"
      if (/^(rss|reddit|github|hackernews|hn|telegram)\s*·/i.test(text)) {
        p.classList.add('source-line');
        return;
      }
    });
  }

  /** Set up EN/中文/PT-BR language toggle as a page-level control */
  function setupLanguageToggle() {
    // Create toggle buttons
    var toggle = document.createElement('div');
    toggle.className = 'lang-toggle';

    var btnEn = document.createElement('button');
    btnEn.textContent = 'EN';
    btnEn.type = 'button';

    var btnPt = document.createElement('button');
    btnPt.textContent = 'PT-BR';
    btnPt.type = 'button';

    var btnZh = document.createElement('button');
    btnZh.textContent = '中文';
    btnZh.type = 'button';

    toggle.appendChild(btnEn);
    toggle.appendChild(btnPt);
    toggle.appendChild(btnZh);

    // Insert at top of body
    document.body.insertBefore(toggle, document.body.firstChild);

    // Read saved preference, default to pt_BR
    var saved = null;
    try { saved = localStorage.getItem('horizon-lang'); } catch (e) { /* noop */ }
    var currentLang = saved || 'pt_BR';

    function updateButtons(lang) {
      btnEn.classList.remove('active');
      btnPt.classList.remove('active');
      btnZh.classList.remove('active');
      if (lang === 'en') {
        btnEn.classList.add('active');
      } else if (lang === 'pt_BR') {
        btnPt.classList.add('active');
      } else {
        btnZh.classList.add('active');
      }
    }

    // Index page: toggle lang-section visibility
    var zhSection = document.getElementById('lang-zh');
    var ptSection = document.getElementById('lang-pt_BR');
    var enSection = document.getElementById('lang-en');

    function showSection(lang) {
      if (!zhSection || !enSection || !ptSection) return;
      enSection.classList.add('hidden');
      ptSection.classList.add('hidden');
      zhSection.classList.add('hidden');
      if (lang === 'en') {
        enSection.classList.remove('hidden');
      } else if (lang === 'pt_BR') {
        ptSection.classList.remove('hidden');
      } else {
        zhSection.classList.remove('hidden');
      }
    }

    // Article page: redirect to the other language version
    function switchArticleLang(lang) {
      var path = window.location.pathname;
      var target = null;
      var base = path.replace(/-(en|zh|pt_BR)(?:\.html)?$/, '').replace(/-(en|zh|pt_BR)\/$/, '');
      if (/-en(?:\.html)?$|-en\/$/.test(path)) {
        target = base + '-' + lang + (path.endsWith('.html') ? '.html' : '/');
      } else if (/-zh(?:\.html)?$|-zh\/$/.test(path)) {
        target = base + '-' + lang + (path.endsWith('.html') ? '.html' : '/');
      } else if (/-pt_BR(?:\.html)?$|-pt_BR\/$/.test(path)) {
        target = base + '-' + lang + (path.endsWith('.html') ? '.html' : '/');
      }
      if (target) window.location.href = target;
    }

    function setLang(lang) {
      currentLang = lang;
      updateButtons(lang);
      try { localStorage.setItem('horizon-lang', lang); } catch (e) { /* noop */ }
      if (zhSection && enSection && ptSection) {
        showSection(lang);
      } else {
        switchArticleLang(lang);
      }
    }

    btnEn.addEventListener('click', function () { setLang('en'); });
    btnPt.addEventListener('click', function () { setLang('pt_BR'); });
    btnZh.addEventListener('click', function () { setLang('zh'); });

    // Initialize
    updateButtons(currentLang);
    if (zhSection && enSection && ptSection) {
      showSection(currentLang);
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    processScoreBadges();
    markSemanticElements();
    setupLanguageToggle();
  });
})();
