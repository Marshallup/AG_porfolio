// БИБЛИОТЕКА ДЛЯ ДИНАМИЧЕСКОЙ ПОДГРУЗКИ КОНТЕНТА
//= components/swup.js

// АКТИВАЦИЯ СКРИПТОВ ПРИ ПЕРЕХОДЕ ПО СТРАНИЦАМ

// ВЗАИМОДЕЙСТВИЕ С ПРОЕКТАМИ ПО КЛИКУ
let body = document.body;
function init() {
  let pjctsWrap = document.querySelector(".projects__block");
  let pjctsElems = document.querySelectorAll(".projects__wrap");
  let buttonMore = document.querySelector("#buttonMore");
  let pjctsResized = false;
  let pjctsInitHeight;
  let pjctsResizeHeight = 0;
  let pageYnow = 0;

  $(document).ready(function () {
    pjctsWrap.addEventListener("click", function (e) {
      e.preventDefault();
      if (e.target.nodeName != "A" && e.target.nodeName != "IMG") return false;
      let linkSrc = false,
        link;
      e.target.nodeName == "IMG"
        ? (link = e.target.parentElement)
        : (link = e.target);

      link.getAttribute("href") == "#" ? (linkSrc = false) : (linkSrc = true);

      if (linkSrc) {
        window.open(link.href);
        window.focus();
      } else if (!linkSrc && link.dataset.src != undefined) {
        pageYnow = pageYOffset;
        if (document.querySelector(".logo__content")) {
          smothScroll(document.querySelector(".logo__content").offsetTop);
        } else {
          smothScroll(0);
        }

        buttonMore.classList.remove("transition-fade");
        buttonMore.classList.add("hide");

        addImg(link.dataset.src);

        setTimeout(function () {
          document
            .querySelector(".projects__present")
            .classList.add("projects__present-active");
        }, 100);

        document.querySelector(".ag__button-back").onclick = () => {
          closeImg(pageYnow);
        };
        document.querySelector(".cross").addEventListener("click", function () {
          closeImg(pageYnow);
        });
      }
    });
  });

  function setContentHeight() {
    switch (true) {
      case window.innerWidth > 991:
        pjctsResizeHeight =
          Math.ceil(pjctsElems.length / 3) *
          (pjctsElems[0].offsetHeight +
            parseInt(getComputedStyle(pjctsElems[0]).marginBottom));
        break;
      case window.innerWidth < 992 && window.innerWidth > 767:
        pjctsResizeHeight =
          Math.ceil(pjctsElems.length / 2) *
          (pjctsElems[0].offsetHeight +
            parseInt(getComputedStyle(pjctsElems[0]).marginBottom));
        break;
      case window.innerWidth < 768:
        pjctsResizeHeight =
          Math.ceil(pjctsElems.length / 1) *
          (pjctsElems[0].offsetHeight +
            parseInt(getComputedStyle(pjctsElems[0]).marginBottom));
        break;
    }
    !pjctsResized
      ? (pjctsInitHeight = parseInt(getComputedStyle(pjctsWrap).height))
      : false;
    pjctsWrap.style.height = pjctsResizeHeight + "px";
  }

  // ИЗМЕНЕНИЕ ТЕКСТА КНОПКИ
  buttonMore.onclick = () => {
    if (!pjctsResized) {
      setContentHeight();
      buttonMore.innerHTML = "Скрыть";
      pjctsResized = true;
    } else {
      pjctsWrap.style.height = pjctsInitHeight + "px";
      buttonMore.innerHTML = "Показать ещё";
      pjctsResized = false;
    }
  };

  // ИЗМЕНИНЕ ТЕКСТА КНОПКИ ПРИ ПЕРЕХОДЕ НА ДРУГУЮ СТРАНИЦУ
  buttonMore.textContent = "Показать ещё";

  // ИЗМЕНЕНИЕ КОНТЕЙНЕРА ПРИ РЕСАЙЗЕ
  window.addEventListener("resize", function () {
    pjctsResized ? setContentHeight() : false;
  });

  // ПЛАВНЫЙ СКРОЛЛ
  function smothScroll(coordY) {
    if (pageYOffset == coordY) {
      return false;
    }
    $("html,body").stop().animate({ scrollTop: coordY }, 1000);
  }
  // ДОБАВЛЕНИЕ ПРОЕКТА КАК ЗАГРУЗИТСЯ ОБЕРТКА
  function addImg(imgSrc) {
    document
      .querySelector(".website")
      .insertAdjacentHTML(
        "afterbegin",
        `<div class="projects__present-wrap"></div><div class="projects__present"><div class="cross cross-correct"><span></span></div><img class="loader__img" src="assets/img/icons/website/loading.gif" alt=""><button class="ag__button ag__button-back hvr-push none">Назад</button></div>`
      );

    let present = document.querySelector(".projects__present");
    let loader = document.querySelector(".loader__img");
    let cross = document.querySelector(".cross");

    if (document.querySelector(".logo__content")) {
      present.classList.add("present_logo-transparent");
      cross.classList.add("present_logo-cross");
    }

    let loadingImg = new Image();
    loadingImg.src = imgSrc;
    loadingImg.onload = () => {
      loader.classList.add("hide");
      loadingImg.classList.add("present_img");
      setTimeout(function () {
        present.removeChild(loader);
        present.classList.add("projects__present-loaded");
        present.insertAdjacentElement("afterbegin", loadingImg);
        cross.classList.remove("cross-correct");

        setTimeout(function () {
          loadingImg.classList.add("show");
          document.querySelector(".ag__button-back").classList.remove("none");
          setBody();
        }, getAnimCount(loadingImg));
      }, getAnimCount(loader));
    };
  }

  // ЗАКРЫТИЕ ПРОЕКТА
  function closeImg(pageYnow) {
    let section = document.querySelector(".website");
    let present = document.querySelector(".projects__present");
    let presentWrap = document.querySelector(".projects__present-wrap");
    present.classList.remove("projects__present-active");
    body.style.height = "auto";
    smothScroll(pageYnow);
    buttonMore.classList.remove("hide");
    setTimeout(function () {
      section.removeChild(present);
      section.removeChild(presentWrap);
      // body.style.height = "auto";
      // smothScroll(pageYnow);
    }, getAnimCount(present));
  }
  // УСТАНОВИТЬ ВЫСОТУ У БАДИ ДОКУМЕНТА
  function setBody() {
    let presentNow = document.querySelector(".projects__present");
    body.style.height =
      presentNow.offsetHeight +
      parseInt(getComputedStyle(presentNow).top) +
      50 +
      "px";
  }
  setColorOnLink();

  if (document.querySelector(".logo__content")) {
    document.querySelector(".website").classList.add("logo-page");
  } else {
    document.querySelector(".website").classList.remove("logo-page");
  }
}

init();

// ОПРЕДЕЛЕНИЕ ВРЕМЕНИ АНИМАЦИИ
function getAnimCount(elem) {
  let timer = getComputedStyle(elem).animationIterationCount;
  return (timer *= 1000);
}

function setColorOnLink() {
  let menu = document.querySelectorAll(".ag__menu_link");
  for (let i = 0; i < menu.length; i++) {
    menu[i].classList.remove("ag__menu_link-active");
  }
  if (
    window.location.pathname.substring(1) == "" ||
    window.location.pathname.substring(1) == "index.html"
  ) {
    menu[1].classList.add("ag__menu_link-active");
  } else {
    menu[0].classList.add("ag__menu_link-active");
  }
}

// МЕНЮ СОЦИАЛЬНЫХ СЕТЕЙ ДВИЖЕТСЯ ЗА ОКНОМ БРАУЗЕРА
let socNetwork = document.querySelector(".soc_networks");
let socNetworkTop = parseInt(getComputedStyle(socNetwork).top);

window.onscroll = () => {
  if (pageYOffset + 50 >= Math.ceil(socNetworkTop / 2)) {
    socNetwork.style.top =
      pageYOffset + Math.ceil(socNetwork.offsetWidth / 2) + 30 + "px";
  }
  if (pageYOffset <= 300) {
    socNetwork.style.top = socNetworkTop + "px";
  }
};

// ВЗАИМОДЕЙСТВИЕ С БУРГЕР-МЕНЮ И ССЫЛКАМИ МЕНЮ
burger.onclick = function () {
  this.classList.toggle("active");
  menu.classList.toggle("active");
  body.classList.toggle("no-scroll");
};

let linkInMenu = document.querySelectorAll(".ag__menu_link");
for (let i = 0; i < linkInMenu.length; i++) {
  linkInMenu[i].onclick = function () {
    burger.classList.remove("active");
    menu.classList.remove("active");
    body.classList.remove("no-scroll");
  };
}
