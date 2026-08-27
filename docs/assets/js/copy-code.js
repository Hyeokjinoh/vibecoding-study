/* 코드 블록 복사 버튼.
 * 실습 자료라 명령어를 손으로 옮겨 적다 오타 내는 일이 잦다.
 * 그래서 화면에서 바로 집어 갈 수 있게 한다.
 *
 * 두 가지만 조심했다.
 *   1. mermaid 블록은 코드가 아니라 그림이므로 버튼을 붙이지 않는다.
 *   2. 클립보드 API 가 막힌 환경(비 HTTPS, 구형 브라우저)에서도 동작하도록
 *      execCommand 경로를 남겨 둔다.
 */
(function () {
  "use strict";

  var ICON_COPY =
    '<svg viewBox="0 0 16 16" width="13" height="13" aria-hidden="true">' +
    '<path fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"' +
    ' d="M5.5 5.5h7v7h-7z"/>' +
    '<path fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"' +
    ' d="M10.5 3.5h-7v7"/></svg>';

  var ICON_DONE =
    '<svg viewBox="0 0 16 16" width="13" height="13" aria-hidden="true">' +
    '<path fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"' +
    ' stroke-linejoin="round" d="M3 8.5l3.2 3.2L13 5"/></svg>';

  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text);
    }
    // 폴백: 화면 밖 textarea 를 만들어 실행 명령으로 복사한다
    return new Promise(function (resolve, reject) {
      var ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.top = "-1000px";
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand("copy") ? resolve() : reject(new Error("execCommand 실패"));
      } catch (e) {
        reject(e);
      } finally {
        document.body.removeChild(ta);
      }
    });
  }

  function setState(btn, state) {
    if (state === "done") {
      btn.innerHTML = ICON_DONE + '<span class="copy-btn__label">복사됨</span>';
      btn.classList.add("is-done");
    } else if (state === "fail") {
      btn.innerHTML = ICON_COPY + '<span class="copy-btn__label">실패</span>';
      btn.classList.add("is-fail");
    } else {
      btn.innerHTML = ICON_COPY + '<span class="copy-btn__label">복사</span>';
      btn.classList.remove("is-done", "is-fail");
    }
  }

  function attach(block) {
    // 그림에는 붙이지 않는다
    if (block.querySelector("code.language-mermaid")) return;
    if (block.querySelector(".copy-btn")) return;

    var pre = block.querySelector("pre.highlight") || block.querySelector("pre");
    if (!pre) return;

    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "copy-btn";
    btn.setAttribute("aria-label", "코드 복사");
    btn.setAttribute("title", "클립보드로 복사");
    setState(btn, "idle");

    var timer = null;
    btn.addEventListener("click", function () {
      var text = pre.innerText.replace(/\n+$/, "");
      copyText(text).then(
        function () { setState(btn, "done"); },
        function () { setState(btn, "fail"); }
      );
      clearTimeout(timer);
      timer = setTimeout(function () { setState(btn, "idle"); }, 1800);
    });

    block.appendChild(btn);
  }

  function init() {
    var blocks = document.querySelectorAll(
      ".main-content div.highlighter-rouge, .main-content figure.highlight"
    );
    Array.prototype.forEach.call(blocks, attach);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
