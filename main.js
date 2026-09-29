document.addEventListener("DOMContentLoaded", function () {

  const menuButton =
    document.getElementById("menuButton");

  const mobileNav =
    document.getElementById("mobileNav");


  if (!menuButton || !mobileNav) {
    return;
  }


  /*
   * 모바일 메뉴 열기 / 닫기
   */
  menuButton.addEventListener("click", function () {

    const isOpen =
      mobileNav.classList.toggle("active");

    menuButton.setAttribute(
      "aria-expanded",
      String(isOpen)
    );

    menuButton.setAttribute(
      "aria-label",
      isOpen ? "메뉴 닫기" : "메뉴 열기"
    );

    menuButton.classList.toggle(
      "active",
      isOpen
    );

  });


  /*
   * 모바일 메뉴에서 메뉴 선택 시 자동 닫기
   */
  const mobileLinks =
    mobileNav.querySelectorAll("a");


  mobileLinks.forEach(function (link) {

    link.addEventListener("click", function () {

      mobileNav.classList.remove("active");

      menuButton.classList.remove("active");

      menuButton.setAttribute(
        "aria-expanded",
        "false"
      );

      menuButton.setAttribute(
        "aria-label",
        "메뉴 열기"
      );

    });

  });


  /*
   * 화면이 PC 크기로 변경되면
   * 모바일 메뉴 상태 초기화
   */
  window.addEventListener("resize", function () {

    if (window.innerWidth > 950) {

      mobileNav.classList.remove("active");

      menuButton.classList.remove("active");

      menuButton.setAttribute(
        "aria-expanded",
        "false"
      );

    }

  });

});
