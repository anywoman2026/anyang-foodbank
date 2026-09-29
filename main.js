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
       SITE SETTINGS - JSONP
    ========================================== */

    function loadSiteSettings() {


      /*
       * Apps Script와 GitHub Pages 사이의
       * CORS 문제를 피하기 위해
       * JSONP 방식을 사용합니다.
       */


      const callbackName =
        "anyangFoodbankSiteSettingsCallback";


      /*
       * Apps Script가 실행할
       * 전역 callback 함수
       */

      window[callbackName] =
        function (result) {


          try {


            if (
              result &&
              result.success &&
              result.data
            ) {


              applySiteSettings(
                result.data
              );


            } else {


              console.error(
                "사이트 설정 데이터 오류:",
                result
              );


            }


          } finally {


            /*
             * 요청 완료 후 callback 정리
             */

            try {

              delete window[
                callbackName
              ];

            } catch (error) {

              window[
                callbackName
              ] = undefined;

            }


          }

        };



      /*
       * Apps Script API를
       * script 태그로 호출
       */

      const script =
        document.createElement(
          "script"
        );


      script.src =
        API_URL +
        "?action=siteSettings" +
        "&callback=" +
        callbackName +
        "&t=" +
        Date.now();


      script.async =
        true;



      /*
       * API 호출 자체가 실패했을 경우
       */

      script.onerror =
        function () {


          console.error(
            "사이트 설정 API를 불러오지 못했습니다."
          );


          if (
            script.parentNode
          ) {

            script.parentNode
              .removeChild(
                script
              );

          }

        };



      /*
       * 스크립트 로딩 완료 후
       * DOM에서 제거
       */

      script.onload =
        function () {


          if (
            script.parentNode
          ) {

            script.parentNode
              .removeChild(
                script
              );

          }

        };


      document.head.appendChild(
        script
      );

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


        setText(
          "mainMessage",
          settings["대표문구"]
        );

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
