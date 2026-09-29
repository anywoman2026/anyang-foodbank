/*************************************************
 * 안양 푸드뱅크 홈페이지
 * main.js
 *************************************************/


document.addEventListener(
  "DOMContentLoaded",
  function () {


    /* ==========================================
       APPS SCRIPT API
    ========================================== */

    const API_URL =
      "https://script.google.com/macros/s/AKfycbwr8tVLYkViqAFVErtxGb-Kl1f9t6RkhUgeZl9yo8ajAIhkxG7C-5zo9xybl3QG_mn_pA/exec";


    /* ==========================================
       MOBILE MENU
    ========================================== */

    const menuButton =
      document.getElementById(
        "menuButton"
      );


    const mobileNav =
      document.getElementById(
        "mobileNav"
      );


    if (
      menuButton &&
      mobileNav
    ) {


      menuButton.addEventListener(
        "click",
        function () {


          const isOpen =
            mobileNav
              .classList
              .toggle("active");


          menuButton.setAttribute(
            "aria-expanded",
            String(isOpen)
          );


          menuButton.setAttribute(
            "aria-label",
            isOpen
              ? "메뉴 닫기"
              : "메뉴 열기"
          );


          menuButton
            .classList
            .toggle(
              "active",
              isOpen
            );


        }
      );



      const mobileLinks =
        mobileNav
          .querySelectorAll("a");


      mobileLinks.forEach(
        function (link) {


          link.addEventListener(
            "click",
            function () {


              mobileNav
                .classList
                .remove("active");


              menuButton
                .classList
                .remove("active");


              menuButton.setAttribute(
                "aria-expanded",
                "false"
              );


              menuButton.setAttribute(
                "aria-label",
                "메뉴 열기"
              );


            }
          );


        }
      );



      window.addEventListener(
        "resize",
        function () {


          if (
            window.innerWidth > 950
          ) {


            mobileNav
              .classList
              .remove("active");


            menuButton
              .classList
              .remove("active");


            menuButton.setAttribute(
              "aria-expanded",
              "false"
            );


          }


        }
      );


    }



    /* ==========================================
       SITE SETTINGS
    ========================================== */

    async function loadSiteSettings() {


      try {


        const requestUrl =
          API_URL +
          "?action=siteSettings";


        const response =
          await fetch(
            requestUrl,
            {
              method: "GET",
              cache: "no-store"
            }
          );


        if (!response.ok) {

          throw new Error(
            "사이트 정보를 불러오지 못했습니다."
          );

        }


        const result =
          await response.json();


        if (
          !result.success ||
          !result.data
        ) {

          throw new Error(
            result.message ||
            "사이트 설정 데이터가 없습니다."
          );

        }


        applySiteSettings(
          result.data
        );


      } catch (error) {


        console.error(
          "사이트설정 로딩 오류:",
          error
        );


        /*
         * API 오류가 발생해도
         * HTML에 입력되어 있는 기본정보를
         * 그대로 보여줍니다.
         */


      }


    }



    /* ==========================================
       SETTINGS APPLY
    ========================================== */

    function applySiteSettings(
      settings
    ) {


      /* 기관명 */

      if (
        settings["기관명"]
      ) {


        setText(
          "organizationName",
          settings["기관명"]
        );


        setText(
          "footerOrganizationName",
          settings["기관명"]
        );


        document.title =
          settings["기관명"];


      }



      /* 대표문구 */

      if (
        settings["대표문구"]
      ) {


        const mainMessage =
          document.getElementById(
            "mainMessage"
          );


        if (mainMessage) {

          mainMessage.textContent =
            settings["대표문구"];

        }


      }



      /* 주소 */

      if (
        settings["주소"]
      ) {


        setText(
          "siteAddress",
          settings["주소"]
        );


      }



      /* 전화번호 */

      if (
        settings["전화번호"]
      ) {


        const phone =
          document.getElementById(
            "sitePhone"
          );


        if (phone) {


          phone.textContent =
            settings["전화번호"];


          const cleanPhone =
            settings["전화번호"]
              .replace(
                /[^0-9+]/g,
                ""
              );


          phone.href =
            "tel:" +
            cleanPhone;


        }


      }



      /* 이메일 */

      if (
        settings["이메일"]
      ) {


        const email =
          document.getElementById(
            "siteEmail"
          );


        if (email) {


          email.textContent =
            settings["이메일"];


          email.href =
            "mailto:" +
            settings["이메일"];


        }


      }



      /* 운영시간 */

      if (
        settings["운영시간"]
      ) {


        setText(
          "siteHours",
          settings["운영시간"]
        );


      } else {


        const hoursRow =
          document.getElementById(
            "hoursRow"
          );


        if (hoursRow) {

          hoursRow.style.display =
            "none";

        }


      }


    }



    /* ==========================================
       TEXT HELPER
    ========================================== */

    function setText(
      elementId,
      value
    ) {


      const element =
        document.getElementById(
          elementId
        );


      if (element) {

        element.textContent =
          value;

      }


    }



    /* ==========================================
       START
    ========================================== */

    loadSiteSettings();


  }
);
