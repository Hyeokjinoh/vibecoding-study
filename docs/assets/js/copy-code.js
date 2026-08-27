/* 코드 블록 복사 버튼 (아이콘 전용).
 *
 * 실습 자료라 명령어를 손으로 옮겨 적다 오타 내는 일이 잦다.
 * 화면에서 바로 집어 갈 수 있게 한다.
 *
 * 신경 쓴 것:
 *   1. mermaid 블록은 그림이므로 버튼을 붙이지 않는다.
 *   2. 클립보드 API 는 HTTPS 에서만 동작한다. 로컬 Jekyll(http://localhost:4000)
 *      로 띄우면 막히므로 execCommand 경로를 반드시 남긴다.
 *   3. 복사할 텍스트는 pre 가 아니라 code 에서 가져온다.
 *      pre 에는 나중에 다른 요소가 끼어들 수 있다.
 *   4. 결과를 아이콘과 말풍선으로 보여 준다. 조용히 실패하는 것이 제일 나쁘다.
 */
(function () {
  "use strict";

  var SVG_NS = "http://www.w3.org/2000/svg";

  function svg(paths, opts) {
    var el = document.createElementNS(SVG_NS, "svg");
    el.setAttribute("viewBox", "0 0 16 16");
    el.setAttribute("width", "15");
    el.setAttribute("height", "15");
    el.setAttribute("aria-hidden", "true");
    el.setAttribute("fill", "none");
    el.setAttribute("stroke", "currentColor");
    el.setAttribute("stroke-width", (opts && opts.w) || "1.4");
    el.setAttribute("stroke-linecap", "round");
    el.setAttribute("stroke-linejoin", "round");
    paths.forEach(function (d) {
      var p = document.createElementNS(SVG_NS, "path");
      p.setAttribute("d", d);
      el.appendChild(p);
    });
    return el;
  }

  function iconCopy() {
    // 문서 두 장이 겹친 모양
    return svg(["M6 6h7v7.5a.5.5 0 0 1-.5.5H6z", "M10.5 3.5H3.5v7"]);
  }
  function iconDone() {
    return svg(["M3 8.4l3.3 3.3L13 5"], { w: "2" });
  }
  function iconFail() {
    return svg(["M4.5 4.5l7 7", "M11.5 4.5l-7 7"], { w: "1.8" });
  }

  function legacyCopy(text) {
    var ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.top = "0";
    ta.style.left = "-9999px";
    document.body.appendChild(ta);
    var sel = document.getSelection();
    var saved = sel && sel.rangeCount > 0 ? sel.getRangeAt(0) : null;
    ta.select();
    ta.setSelectionRange(0, ta.value.length);
    var ok = false;
    try {
      ok = document.execCommand("copy");
    } catch (e) {
      ok = false;
    }
    document.body.removeChild(ta);
    if (saved && sel) {
      sel.removeAllRanges();
      sel.addRange(saved);
    }
    return ok;
  }

  function copyText(text) {
    // 최신 경로를 먼저 시도하고, 실패하면 조용히 구형 경로로 내려간다
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text).catch(function () {
        if (legacyCopy(text)) return;
        throw new Error("클립보드 접근 실패");
      });
    }
    return legacyCopy(text)
      ? Promise.resolve()
      : Promise.reject(new Error("클립보드 접근 실패"));
  }

  function render(btn, state) {
    while (btn.firstChild) btn.removeChild(btn.firstChild);
    btn.classList.remove("is-done", "is-fail");

    // 화면에 글자를 두지 않는다. 아이콘이 바뀌는 것으로 결과를 알린다.
    // 설명이 필요한 사람에게는 브라우저 기본 툴팁과 aria-label 이 간다.
    if (state === "done") {
      btn.appendChild(iconDone());
      btn.classList.add("is-done");
      btn.title = "복사했습니다";
      btn.setAttribute("aria-label", "복사했습니다");
    } else if (state === "fail") {
      btn.appendChild(iconFail());
      btn.classList.add("is-fail");
      btn.title = "복사하지 못했습니다";
      btn.setAttribute("aria-label", "복사하지 못했습니다");
    } else {
      btn.appendChild(iconCopy());
      btn.title = "복사";
      btn.setAttribute("aria-label", "코드 복사");
    }
  }

  function attach(block) {
    if (block.querySelector("code.language-mermaid")) return; // 그림에는 붙이지 않는다
    if (block.querySelector(".copy-btn")) return;

    var code = block.querySelector("pre code") || block.querySelector("pre");
    if (!code) return;

    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "copy-btn";
    render(btn, "idle");

    var timer = null;
    btn.addEventListener("click", function (ev) {
      ev.preventDefault();
      ev.stopPropagation();

      var text = (code.innerText || code.textContent || "").replace(/\s+$/, "");
      if (!text) {
        render(btn, "fail");
        return;
      }

      copyText(text).then(
        function () { render(btn, "done"); },
        function () { render(btn, "fail"); }
      );

      clearTimeout(timer);
      timer = setTimeout(function () { render(btn, "idle"); }, 1800);
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
