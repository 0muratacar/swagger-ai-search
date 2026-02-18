(function () {
  'use strict';

  function waitForSwaggerUI(callback, maxAttempts) {
    var attempts = 0;
    var max = maxAttempts || 50;
    var interval = setInterval(function () {
      var wrapper = document.querySelector('.swagger-ui .information-container');
      if (wrapper) {
        clearInterval(interval);
        callback(wrapper);
      }
      attempts++;
      if (attempts >= max) {
        clearInterval(interval);
      }
    }, 200);
  }

  function injectSearchBar(wrapper) {
    var container = document.createElement('div');
    container.id = 'ai-search-container';
    container.innerHTML =
      '<style>' +
      '#ai-search-container {' +
      '  margin: 16px auto 24px auto;' +
      '  max-width: 880px;' +
      '  padding: 20px 24px;' +
      '  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);' +
      '  border-radius: 12px;' +
      '  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);' +
      '  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;' +
      '}' +
      '#ai-search-container .search-title {' +
      '  color: #fff;' +
      '  font-size: 15px;' +
      '  font-weight: 600;' +
      '  margin-bottom: 12px;' +
      '  display: flex;' +
      '  align-items: center;' +
      '  gap: 8px;' +
      '}' +
      '#ai-search-container .search-row {' +
      '  display: flex;' +
      '  gap: 10px;' +
      '}' +
      '#ai-search-container .search-input {' +
      '  flex: 1;' +
      '  padding: 10px 16px;' +
      '  border: 2px solid rgba(255,255,255,0.3);' +
      '  border-radius: 8px;' +
      '  font-size: 14px;' +
      '  background: rgba(255,255,255,0.95);' +
      '  color: #333;' +
      '  outline: none;' +
      '  transition: border-color 0.2s;' +
      '}' +
      '#ai-search-container .search-input:focus {' +
      '  border-color: rgba(255,255,255,0.8);' +
      '}' +
      '#ai-search-container .search-input::placeholder {' +
      '  color: #999;' +
      '}' +
      '#ai-search-container .search-btn {' +
      '  padding: 10px 24px;' +
      '  background: rgba(255,255,255,0.2);' +
      '  color: #fff;' +
      '  border: 2px solid rgba(255,255,255,0.4);' +
      '  border-radius: 8px;' +
      '  font-size: 14px;' +
      '  font-weight: 600;' +
      '  cursor: pointer;' +
      '  transition: all 0.2s;' +
      '  white-space: nowrap;' +
      '}' +
      '#ai-search-container .search-btn:hover {' +
      '  background: rgba(255,255,255,0.35);' +
      '}' +
      '#ai-search-container .search-btn:disabled {' +
      '  opacity: 0.6;' +
      '  cursor: not-allowed;' +
      '}' +
      '#ai-search-results {' +
      '  margin-top: 16px;' +
      '}' +
      '#ai-search-results .answer-text {' +
      '  color: rgba(255,255,255,0.95);' +
      '  font-size: 13px;' +
      '  line-height: 1.5;' +
      '  margin-bottom: 12px;' +
      '  padding: 10px 14px;' +
      '  background: rgba(255,255,255,0.1);' +
      '  border-radius: 8px;' +
      '}' +
      '#ai-search-results .result-card {' +
      '  background: rgba(255,255,255,0.95);' +
      '  border-radius: 8px;' +
      '  padding: 12px 16px;' +
      '  margin-bottom: 8px;' +
      '  cursor: pointer;' +
      '  transition: transform 0.15s, box-shadow 0.15s;' +
      '  display: flex;' +
      '  align-items: flex-start;' +
      '  gap: 12px;' +
      '}' +
      '#ai-search-results .result-card:hover {' +
      '  transform: translateY(-1px);' +
      '  box-shadow: 0 4px 12px rgba(0,0,0,0.15);' +
      '}' +
      '#ai-search-results .method-badge {' +
      '  font-size: 11px;' +
      '  font-weight: 700;' +
      '  padding: 4px 8px;' +
      '  border-radius: 4px;' +
      '  color: #fff;' +
      '  min-width: 52px;' +
      '  text-align: center;' +
      '  flex-shrink: 0;' +
      '  margin-top: 2px;' +
      '}' +
      '#ai-search-results .method-GET { background: #61affe; }' +
      '#ai-search-results .method-POST { background: #49cc90; }' +
      '#ai-search-results .method-PUT { background: #fca130; }' +
      '#ai-search-results .method-PATCH { background: #50e3c2; }' +
      '#ai-search-results .method-DELETE { background: #f93e3e; }' +
      '#ai-search-results .result-info { flex: 1; }' +
      '#ai-search-results .result-path {' +
      '  font-family: monospace;' +
      '  font-size: 13px;' +
      '  font-weight: 600;' +
      '  color: #333;' +
      '  margin-bottom: 4px;' +
      '}' +
      '#ai-search-results .result-tag {' +
      '  font-size: 11px;' +
      '  color: #888;' +
      '  margin-bottom: 4px;' +
      '}' +
      '#ai-search-results .result-reason {' +
      '  font-size: 12px;' +
      '  color: #666;' +
      '  line-height: 1.4;' +
      '}' +
      '#ai-search-results .error-text {' +
      '  color: #ffcdd2;' +
      '  font-size: 13px;' +
      '  padding: 10px 14px;' +
      '  background: rgba(255,0,0,0.15);' +
      '  border-radius: 8px;' +
      '}' +
      '#ai-search-results .loading {' +
      '  color: rgba(255,255,255,0.9);' +
      '  font-size: 13px;' +
      '  text-align: center;' +
      '  padding: 16px;' +
      '}' +
      '#ai-search-results .loading .dots::after {' +
      '  content: "";' +
      '  animation: dots 1.5s steps(4, end) infinite;' +
      '}' +
      '@keyframes dots {' +
      '  0% { content: ""; }' +
      '  25% { content: "."; }' +
      '  50% { content: ".."; }' +
      '  75% { content: "..."; }' +
      '}' +
      '</style>' +
      '<div class="search-title">' +
      '  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>' +
      '  __TITLE__' +
      '</div>' +
      '<div class="search-row">' +
      '  <input class="search-input" type="text" placeholder="__PLACEHOLDER__" />' +
      '  <button class="search-btn">__BUTTON__</button>' +
      '</div>' +
      '<div id="ai-search-results"></div>';

    wrapper.parentNode.insertBefore(container, wrapper.nextSibling);

    var input = container.querySelector('.search-input');
    var btn = container.querySelector('.search-btn');
    var resultsDiv = container.querySelector('#ai-search-results');

    function doSearch() {
      var query = input.value.trim();
      if (!query) return;

      btn.disabled = true;
      btn.textContent = '__SEARCHING__';
      resultsDiv.innerHTML = '<div class="loading">__THINKING__<span class="dots"></span></div>';

      fetch('__SEARCH_ENDPOINT__', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: query }),
      })
        .then(function (res) {
          if (!res.ok) throw new Error('HTTP ' + res.status);
          return res.json();
        })
        .then(function (data) {
          renderResults(data);
        })
        .catch(function (err) {
          resultsDiv.innerHTML = '<div class="error-text">__ERROR__' + err.message + '</div>';
        })
        .finally(function () {
          btn.disabled = false;
          btn.textContent = '__BUTTON__';
        });
    }

    btn.addEventListener('click', doSearch);
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') doSearch();
    });

    function renderResults(data) {
      var html = '';

      if (data.answer) {
        html += '<div class="answer-text">' + escapeHtml(data.answer) + '</div>';
      }

      var results = data.results || data.data?.results || [];
      if (results.length === 0) {
        html += '<div class="answer-text">__NO_RESULTS__</div>';
      }

      for (var i = 0; i < results.length; i++) {
        var r = results[i];
        html +=
          '<div class="result-card" data-method="' + escapeAttr(r.method) + '" data-path="' + escapeAttr(r.path) + '" data-tag="' + escapeAttr(r.tag) + '">' +
          '  <span class="method-badge method-' + escapeAttr(r.method) + '">' + escapeHtml(r.method) + '</span>' +
          '  <div class="result-info">' +
          '    <div class="result-path">' + escapeHtml(r.path) + '</div>' +
          '    <div class="result-tag">' + escapeHtml(r.tag) + (r.summary ? ' — ' + escapeHtml(r.summary) : '') + '</div>' +
          '    <div class="result-reason">' + escapeHtml(r.reason) + '</div>' +
          '  </div>' +
          '</div>';
      }

      resultsDiv.innerHTML = html;

      var cards = resultsDiv.querySelectorAll('.result-card');
      for (var j = 0; j < cards.length; j++) {
        cards[j].addEventListener('click', function () {
          scrollToEndpoint(this.getAttribute('data-path'), this.getAttribute('data-method'), this.getAttribute('data-tag'));
        });
      }
    }

    function scrollToEndpoint(path, method, tag) {
      var opBlock = document.querySelector(
        '.opblock-' + method.toLowerCase() + '[id*="' + path.replace(/[{}]/g, '_').replace(/\//g, '_') + '"]'
      );

      if (!opBlock) {
        var allOps = document.querySelectorAll('.opblock');
        for (var i = 0; i < allOps.length; i++) {
          var pathEl = allOps[i].querySelector('.opblock-summary-path, .opblock-summary-path__deprecated');
          var methodEl = allOps[i].querySelector('.opblock-summary-method');
          if (pathEl && methodEl) {
            var pText = pathEl.textContent.trim().replace(/\u200B/g, '');
            var mText = methodEl.textContent.trim().toUpperCase();
            if (pText === path && mText === method.toUpperCase()) {
              opBlock = allOps[i];
              break;
            }
          }
        }
      }

      if (!opBlock) {
        var tagSections = document.querySelectorAll('.opblock-tag-section');
        for (var t = 0; t < tagSections.length; t++) {
          var tagHeader = tagSections[t].querySelector('.opblock-tag');
          if (tagHeader) {
            var tagText = tagHeader.getAttribute('data-tag') || tagHeader.textContent.trim();
            if (tagText.indexOf(tag) !== -1) {
              var isCollapsed = tagSections[t].querySelector('.opblock') === null ||
                tagSections[t].classList.contains('is-open') === false;
              if (isCollapsed) {
                tagHeader.click();
              }
              setTimeout(function () { scrollToEndpoint(path, method, tag); }, 300);
              return;
            }
          }
        }
      }

      if (opBlock) {
        opBlock.scrollIntoView({ behavior: 'smooth', block: 'center' });
        opBlock.style.transition = 'box-shadow 0.3s';
        opBlock.style.boxShadow = '0 0 0 3px #667eea, 0 0 20px rgba(102, 126, 234, 0.4)';
        setTimeout(function () {
          opBlock.style.boxShadow = '';
        }, 2000);
      }
    }

    function escapeHtml(str) {
      if (!str) return '';
      return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
    }

    function escapeAttr(str) {
      return escapeHtml(str);
    }
  }

  waitForSwaggerUI(injectSearchBar);
})();
