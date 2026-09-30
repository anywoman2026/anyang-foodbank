/*************************************************
 * 안양 푸드뱅크 홈페이지
 * main.js
 *************************************************/


document.addEventListener(
  "DOMContentLoaded",
  function () {


    const API_URL =
      "https://script.google.com/macros/s/AKfycbwr8tVLYkViqAFVErtxGb-Kl1f9t6RkhUgeZl9yo8ajAIhkxG7C-5zo9xybl3QG_mn_pA/exec";


    const FALLBACK_IMAGE =
      "main-banner.png";


    let siteSettings = {};

    let heroItems = [];

    let currentHeroIndex = 0;

    let heroTimer = null;



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

        }
      );


      mobileNav
        .querySelectorAll("a")
        .forEach(
          function (link) {


            link.addEventListener(
              "click",
              function () {


                mobileNav
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


            menuButton.setAttribute(
              "aria-expanded",
              "false"
            );

          }

        }
      );

    }



    /* ==========================================
       JSONP
    ========================================== */

    function requestJsonp(
      action,
      callback
    ) {


      const callbackName =
        "anyangFoodbank_" +
        action +
        "_" +
        Date.now() +
        "_" +
        Math.floor(
          Math.random() * 100000
        );


      const script =
        document.createElement(
          "script"
        );


      let finished =
        false;


      const timeout =
        window.setTimeout(
          function () {


            if (finished) {

              return;

            }


            finished =
              true;


            cleanup();


            console.error(
              action +
              " API 응답 시간이 초과되었습니다."
            );


            callback(
              null
            );


          },
          10000
        );



      function cleanup() {


        window.clearTimeout(
          timeout
        );


        try {

          delete window[
            callbackName
          ];

        } catch (error) {

          window[
            callbackName
          ] = undefined;

        }


        if (
          script.parentNode
        ) {

          script
            .parentNode
            .removeChild(
              script
            );

        }

      }



      window[
        callbackName
      ] =
        function (result) {


          if (finished) {

            return;

          }


          finished =
            true;


          cleanup();


          callback(
            result
          );

        };



      script.onerror =
        function () {


          if (finished) {

            return;

          }


          finished =
            true;


          cleanup();


          console.error(
            action +
            " API 호출에 실패했습니다."
          );


          callback(
            null
          );

        };



      script.src =
        API_URL +
        "?action=" +
        encodeURIComponent(
          action
        ) +
        "&callback=" +
        encodeURIComponent(
          callbackName
        ) +
        "&t=" +
        Date.now();


      script.async =
        true;


      document.head
        .appendChild(
          script
        );

    }



    /* ==========================================
       SITE SETTINGS
    ========================================== */

    function loadSiteSettings() {


      requestJsonp(
        "siteSettings",
        function (result) {


          if (
            !result ||
            !result.success ||
            !result.data
          ) {

            return;

          }


          siteSettings =
            result.data;


          applySiteSettings(
            siteSettings
          );

        }
      );

    }



    function applySiteSettings(
      settings
    ) {


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


      if (
        settings["대표문구"]
      ) {


        setText(
          "mainMessage",
          settings["대표문구"]
        );

      }


      if (
        settings["주소"]
      ) {


        setText(
          "siteAddress",
          settings["주소"]
        );

      }


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


          phone.href =
            "tel:" +
            settings["전화번호"]
              .replace(
                /[^0-9+]/g,
                ""
              );

        }

      }


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


      const hoursRow =
        document.getElementById(
          "hoursRow"
        );


      if (
        settings["운영시간"]
      ) {


        setText(
          "siteHours",
          settings["운영시간"]
        );


      } else if (
        hoursRow
      ) {


        hoursRow.style.display =
          "none";

      }

    }



    /* ==========================================
       HERO BANNERS
    ========================================== */

    function loadBanners() {


      requestJsonp(
        "banners",
        function (result) {


          if (
            !result ||
            !result.success ||
            !Array.isArray(
              result.data
            ) ||
            result.data.length === 0
          ) {


            setupFallbackHero();

            return;

          }


          heroItems =
            result.data;


          renderHeroSlides(
            heroItems
          );

        }
      );

    }



    function renderHeroSlides(
      items
    ) {


      const container =
        document.getElementById(
          "heroSlides"
        );


      if (!container) {

        return;

      }


      container.innerHTML =
        "";


      items.forEach(
        function (
          item,
          index
        ) {


          const slide =
            document.createElement(
              "article"
            );


          slide.className =
            "hero-slide" +
            (
              index === 0
                ? " active"
                : ""
            );


          const image =
            document.createElement(
              "img"
            );


          image.className =
            "hero-slide-image";


          image.src =
            item.imageUrl ||
            FALLBACK_IMAGE;


          image.alt =
            item.title ||
            "안양 푸드뱅크 활동사진";


          image.loading =
            index === 0
              ? "eager"
              : "lazy";


          image.onerror =
            function () {


              if (
                image.src.indexOf(
                  FALLBACK_IMAGE
                ) === -1
              ) {

                image.src =
                  FALLBACK_IMAGE;

              }

            };



          const overlay =
            document.createElement(
              "div"
            );


          overlay.className =
            "hero-overlay";



          const content =
            document.createElement(
              "div"
            );


          content.className =
            "hero-content";



          const eyebrow =
            document.createElement(
              "p"
            );


          eyebrow.className =
            "hero-eyebrow";


          eyebrow.textContent =
            "ANYANG FOOD BANK";



          const heading =
            document.createElement(
              "h1"
            );


          heading.textContent =
            siteSettings["대표문구"] ||
            "당신의 작은 나눔이 따뜻한 안양을 만듭니다.";



          const description =
            document.createElement(
              "p"
            );


          description.className =
            "hero-text";


          description.textContent =
            "식품기부로 따뜻한 안양을 만들어주세요.";



          const buttons =
            document.createElement(
              "div"
            );


          buttons.className =
            "hero-buttons";


          buttons.innerHTML =
            '<a href="#donation" class="button button-primary">기부 안내</a>' +
            '<a href="#guide" class="button hero-outline">이용 안내</a>';



          const activityInfo =
            document.createElement(
              "div"
            );


          activityInfo.className =
            "hero-activity-title";


          const titleText =
            document.createElement(
              "span"
            );


          titleText.textContent =
            item.title ||
            "";


          activityInfo.appendChild(
            titleText
          );


          if (
            item.activityDate
          ) {


            const date =
              document.createElement(
                "span"
              );


            date.className =
              "hero-activity-date";


            date.textContent =
              item.activityDate;


            activityInfo.appendChild(
              date
            );

          }



          content.appendChild(
            eyebrow
          );


          content.appendChild(
            heading
          );


          content.appendChild(
            description
          );


          content.appendChild(
            buttons
          );


          if (
            item.title
          ) {

            content.appendChild(
              activityInfo
            );

          }


          slide.appendChild(
            image
          );


          slide.appendChild(
            overlay
          );


          slide.appendChild(
            content
          );


          container.appendChild(
            slide
          );

        }
      );


      currentHeroIndex =
        0;


      createHeroDots(
        items.length
      );


      updateHeroControls();


      startHeroAutoPlay();

    }



    function setupFallbackHero() {


      heroItems =
        [
          {
            title: "",
            activityDate: "",
            imageUrl:
              FALLBACK_IMAGE
          }
        ];


      createHeroDots(
        1
      );


      updateHeroControls();

    }



    function createHeroDots(
      count
    ) {


      const dots =
        document.getElementById(
          "heroDots"
        );


      if (!dots) {

        return;

      }


      dots.innerHTML =
        "";


      if (
        count <= 1
      ) {

        dots.style.display =
          "none";

        return;

      }


      dots.style.display =
        "flex";


      for (
        let i = 0;
        i < count;
        i++
      ) {


        const dot =
          document.createElement(
            "button"
          );


        dot.type =
          "button";


        dot.className =
          "hero-dot" +
          (
            i === 0
              ? " active"
              : ""
          );


        dot.setAttribute(
          "aria-label",
          (i + 1) +
          "번째 배너 보기"
        );


        dot.addEventListener(
          "click",
          function () {


            showHeroSlide(
              i
            );


            restartHeroAutoPlay();

          }
        );


        dots.appendChild(
          dot
        );

      }

    }



    function showHeroSlide(
      index
    ) {


      const slides =
        document.querySelectorAll(
          ".hero-slide"
        );


      const dots =
        document.querySelectorAll(
          ".hero-dot"
        );


      if (
        slides.length === 0
      ) {

        return;

      }


      if (
        index < 0
      ) {

        index =
          slides.length - 1;

      }


      if (
        index >= slides.length
      ) {

        index =
          0;

      }


      slides.forEach(
        function (
          slide,
          slideIndex
        ) {


          slide.classList.toggle(
            "active",
            slideIndex === index
          );

        }
      );


      dots.forEach(
        function (
          dot,
          dotIndex
        ) {


          dot.classList.toggle(
            "active",
            dotIndex === index
          );

        }
      );


      currentHeroIndex =
        index;

    }



    function updateHeroControls() {


      const previous =
        document.getElementById(
          "heroPrev"
        );


      const next =
        document.getElementById(
          "heroNext"
        );


      const multiple =
        heroItems.length > 1;


      if (previous) {

        previous.style.display =
          multiple
            ? ""
            : "none";

      }


      if (next) {

        next.style.display =
          multiple
            ? ""
            : "none";

      }

    }



    function startHeroAutoPlay() {


      stopHeroAutoPlay();


      if (
        heroItems.length <= 1
      ) {

        return;

      }


      if (
        window.matchMedia(
          "(prefers-reduced-motion: reduce)"
        ).matches
      ) {

        return;

      }


      heroTimer =
        window.setInterval(
          function () {


            showHeroSlide(
              currentHeroIndex + 1
            );

          },
          5000
        );

    }



    function stopHeroAutoPlay() {


      if (
        heroTimer
      ) {


        window.clearInterval(
          heroTimer
        );


        heroTimer =
          null;

      }

    }



    function restartHeroAutoPlay() {


      stopHeroAutoPlay();

      startHeroAutoPlay();

    }



    const heroPrev =
      document.getElementById(
        "heroPrev"
      );


    const heroNext =
      document.getElementById(
        "heroNext"
      );


    if (heroPrev) {


      heroPrev.addEventListener(
        "click",
        function () {


          showHeroSlide(
            currentHeroIndex - 1
          );


          restartHeroAutoPlay();

        }
      );

    }


    if (heroNext) {


      heroNext.addEventListener(
        "click",
        function () {


          showHeroSlide(
            currentHeroIndex + 1
          );


          restartHeroAutoPlay();

        }
      );

    }



    const heroSlider =
      document.getElementById(
        "heroSlider"
      );


    if (heroSlider) {


      heroSlider.addEventListener(
        "mouseenter",
        stopHeroAutoPlay
      );


      heroSlider.addEventListener(
        "mouseleave",
        startHeroAutoPlay
      );


      let touchStartX =
        0;


      heroSlider.addEventListener(
        "touchstart",
        function (event) {


          touchStartX =
            event.changedTouches[0]
              .screenX;

        },
        {
          passive: true
        }
      );


      heroSlider.addEventListener(
        "touchend",
        function (event) {


          const touchEndX =
            event.changedTouches[0]
              .screenX;


          const difference =
            touchStartX -
            touchEndX;


          if (
            Math.abs(
              difference
            ) < 50
          ) {

            return;

          }


          if (
            difference > 0
          ) {


            showHeroSlide(
              currentHeroIndex + 1
            );


          } else {


            showHeroSlide(
              currentHeroIndex - 1
            );

          }


          restartHeroAutoPlay();

        },
        {
          passive: true
        }
      );

    }



    /* ==========================================
       NOTICES
    ========================================== */

    function loadNotices() {


      requestJsonp(
        "notices",
        function (result) {


          const container =
            document.getElementById(
              "noticeList"
            );


          if (!container) {

            return;

          }


          if (
            !result ||
            !result.success ||
            !Array.isArray(
              result.data
            ) ||
            result.data.length === 0
          ) {


            container.innerHTML =
              '<div class="news-empty">등록된 공지사항이 없습니다.</div>';


            return;

          }


          container.innerHTML =
            "";


          result.data
            .slice(
              0,
              3
            )
            .forEach(
              function (notice) {


                const item =
                  document.createElement(
                    notice.attachmentUrl
                      ? "a"
                      : "div"
                  );


                item.className =
                  "notice-item";


                if (
                  notice.attachmentUrl
                ) {


                  item.href =
                    notice.attachmentUrl;


                  item.target =
                    "_blank";


                  item.rel =
                    "noopener noreferrer";

                }



                const date =
                  document.createElement(
                    "span"
                  );


                date.className =
                  "notice-date";


                date.textContent =
                  notice.date ||
                  "";



                const title =
                  document.createElement(
                    "strong"
                  );


                title.className =
                  "notice-title";


                title.textContent =
                  notice.title ||
                  "";



                item.appendChild(
                  date
                );


                item.appendChild(
                  title
                );



                if (
                  notice.content
                ) {


                  const content =
                    document.createElement(
                      "p"
                    );


                  content.className =
                    "notice-content";


                  content.textContent =
                    notice.content;


                  item.appendChild(
                    content
                  );

                }


                container.appendChild(
                  item
                );

              }
            );

        }
      );

    }



    /* ==========================================
       ACTIVITIES
    ========================================== */

    function loadActivities() {


      requestJsonp(
        "activities",
        function (result) {


          const container =
            document.getElementById(
              "activityList"
            );


          if (!container) {

            return;

          }


          if (
            !result ||
            !result.success ||
            !Array.isArray(
              result.data
            ) ||
            result.data.length === 0
          ) {


            container.innerHTML =
              '<div class="news-empty">등록된 활동소식이 없습니다.</div>';


            return;

          }


          container.innerHTML =
            "";


          result.data
            .slice(
              0,
              3
            )
            .forEach(
              function (activity) {


                const card =
                  document.createElement(
                    "article"
                  );


                card.className =
                  "activity-card";



                const imageWrap =
                  document.createElement(
                    "div"
                  );


                imageWrap.className =
                  "activity-image-wrap";



                const image =
                  document.createElement(
                    "img"
                  );


                image.className =
                  "activity-image";


                image.src =
                  activity.imageUrl ||
                  FALLBACK_IMAGE;


                image.alt =
                  activity.title ||
                  "안양 푸드뱅크 활동사진";


                image.loading =
                  "lazy";


                image.onerror =
                  function () {


                    if (
                      image.src.indexOf(
                        FALLBACK_IMAGE
                      ) === -1
                    ) {

                      image.src =
                        FALLBACK_IMAGE;

                    }

                  };


                imageWrap.appendChild(
                  image
                );



                const body =
                  document.createElement(
                    "div"
                  );


                body.className =
                  "activity-body";



                const date =
                  document.createElement(
                    "span"
                  );


                date.className =
                  "activity-date";


                date.textContent =
                  activity.activityDate ||
                  "";



                const title =
                  document.createElement(
                    "h4"
                  );


                title.className =
                  "activity-title";


                title.textContent =
                  activity.title ||
                  "";



                body.appendChild(
                  date
                );


                body.appendChild(
                  title
                );


                card.appendChild(
                  imageWrap
                );


                card.appendChild(
                  body
                );


                container.appendChild(
                  card
                );

              }
            );

        }
      );

    }



    /* ==========================================
       HELPER
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

    loadBanners();

    loadNotices();

    loadActivities();


  }
);
