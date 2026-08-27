/* 자가 점검 체크박스를 실제로 동작하게 만든다.
 *
 * 마크다운의 `- [ ]` 는 disabled 상태로 렌더링된다. 그런데 이 자료의 자가 점검은
 * "다음 장으로 넘어가도 되는지" 스스로 판단하는 장치라서, 눌러서 표시할 수 있어야
 * 제 역할을 한다. disabled 를 풀고 진도를 브라우저에 남긴다.
 *
 * 저장은 localStorage 에만 한다. 서버로 아무것도 보내지 않는다.
 * 사생활 보호 모드나 사이트 데이터 차단 설정에서는 접근 자체가 예외를 던지므로
 * 읽기와 쓰기를 모두 try/catch 로 감싼다. 저장이 안 되더라도 체크는 되어야 한다.
 */
(function () {
  "use strict";

  var PREFIX = "vibecoding-study:self-check:";

  function keyFor(index) {
    return PREFIX + window.location.pathname + ":" + index;
  }

  function readFlag(index) {
    try {
      return window.localStorage.getItem(keyFor(index)) === "1";
    } catch (e) {
      return false;
    }
  }

  function writeFlag(index, checked) {
    try {
      if (checked) window.localStorage.setItem(keyFor(index), "1");
      else window.localStorage.removeItem(keyFor(index));
    } catch (e) {
      /* 저장에 실패해도 체크 자체는 동작해야 한다 */
    }
  }

  function findSelfCheckHeading() {
    var headings = document.querySelectorAll(".main-content h2");
    for (var i = 0; i < headings.length; i++) {
      if (headings[i].textContent.indexOf("자가 점검") !== -1) return headings[i];
    }
    return null;
  }

  function buildMeter(heading) {
    var meter = document.createElement("div");
    meter.className = "selfcheck-progress";
    meter.innerHTML =
      '<div class="selfcheck-progress__bar"><span></span></div>' +
      '<div class="selfcheck-progress__text"></div>';
    heading.parentNode.insertBefore(meter, heading.nextSibling);
    return meter;
  }

  function init() {
    var boxes = Array.prototype.slice.call(
      document.querySelectorAll(
        ".main-content input.task-list-item-checkbox, " +
          '.main-content li > input[type="checkbox"]'
      )
    );
    if (!boxes.length) return;

    var heading = findSelfCheckHeading();
    var meter = heading ? buildMeter(heading) : null;
    var fill = meter && meter.querySelector(".selfcheck-progress__bar span");
    var text = meter && meter.querySelector(".selfcheck-progress__text");

    function updateProgress() {
      if (!meter) return;
      var done = 0;
      for (var i = 0; i < boxes.length; i++) if (boxes[i].checked) done++;
      var pct = boxes.length ? Math.round((done / boxes.length) * 100) : 0;
      fill.style.width = pct + "%";
      meter.classList.toggle("is-complete", done === boxes.length);
      text.textContent =
        done === boxes.length
          ? "전부 확인했습니다. 다음 장으로 넘어가세요."
          : done + " / " + boxes.length + " 확인";
    }

    boxes.forEach(function (box, i) {
      box.disabled = false;
      box.removeAttribute("disabled");
      box.checked = readFlag(i);

      var li = box.closest("li");
      if (li) {
        li.classList.toggle("is-checked", box.checked);
        // 글자를 눌러도 체크되게 한다. 17px 짜리 네모만 노리게 두면 불편하다
        li.addEventListener("click", function (ev) {
          if (ev.target === box) return;
          if (ev.target.closest && ev.target.closest("a, code, pre")) return;
          box.checked = !box.checked;
          box.dispatchEvent(new Event("change", { bubbles: true }));
        });
      }

      box.addEventListener("change", function () {
        writeFlag(i, box.checked);
        if (li) li.classList.toggle("is-checked", box.checked);
        updateProgress();
      });
    });

    updateProgress();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
