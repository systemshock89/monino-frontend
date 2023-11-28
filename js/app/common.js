"use strict";

const isMobile = document.body.classList.contains('is-mobile');

// Lazyload
// with use_native
const lazyLoadInstance = new LazyLoad({
    elements_selector: ".lazy",
    use_native: true,
});

// without use_native (false)
const lazyLoadInstance2 = new LazyLoad({
    elements_selector: ".section_bg, .img-container-bg, .title-wrapper__img-bg"
});
// /Lazyload

document.addEventListener("DOMContentLoaded", function(event) {

    // Mmenu
    const menu = new Mmenu( "#mmenu", {
        // theme: "dark",
        slidingSubmenus: false, // открывать подменю снизу / в виде скользящих меню
        navbar: false, // убрать сверху название меню
        navbars: [
            {
                position: "top",
                content: Array.from(document.querySelector("#mmenu-top-buttons").children)
            },
            // {
            //     "position": "top",
            //     "type": "tabs",
            //     "content": Array.from(document.querySelector("#mmenu-tabs").children)
            // },
            {
                use: (document.querySelector(".socials_mobile") ? true : false),
                position: "bottom",
                content: (document.querySelector(".socials_mobile") ? Array.from(document.querySelector(".socials_mobile").children) : null)
            },
        ],
        // "counters": true, // кол-во подразделов
        // setSelected: {
        //     hover: true // чтобы пункт меню был активным при наведении мышью (например, для десктопа).
        // },
    }, {
        classNames: {
            selected: (document.querySelector("body.item") ? "active": "selected"),
        },
        offCanvas: {
            page: {
                selector: ".page"
            }
        },
        language: "ru",
    });

    // tags
    const tags = function (tagsBlocks){
        tagsBlocks.forEach(tagsBlock => {
            const tags = tagsBlock.querySelectorAll('.tags__item:not(.tags__item_all)'); // выберем все элементы, кроме кнопки "показать еще"
            const buttonShowAll = tagsBlock.querySelector('.tags__item_all');
            const tagLastKey = tags.length - 1; // индекс последнего эл-та в массиве

            if(tags.length){
                tagsInit(tags, buttonShowAll);

                // если первый и последний тег находятся на разных высотах
                if(tags[0].offsetTop !== tags[tagLastKey].offsetTop){
                    // то покажем кнопку "показать еще"
                    buttonShowAll.classList.add('tags__item_show');

                    for (let i = tagLastKey; i >= 0; i--) {
                        const minOffset = tags[0].offsetTop; // отступ у первого элемента
                        const buttonShowAllOffset = buttonShowAll.offsetTop; // отступ у кнопки

                        if( (buttonShowAllOffset !== minOffset && window.outerWidth > 768) // десктопы: все элементы на одной строчке
                            || (buttonShowAllOffset - minOffset > (40 + 10 + 40 + 10) && window.outerWidth <= 768) // мобильник: возможны три строки
                        ){
                            tags[i].classList.add('tags__item_hide');
                        }
                    }
                }

                setTimeout(function () {
                    tagsBlock.classList.add(`tags__wrapper_visible`);
                }, 100);

                // клик
                buttonShowAll.addEventListener('click', (event) => {
                    event.preventDefault();
                    tagsInit(tags, buttonShowAll);
                });
            }
        });

        function tagsInit(tags, buttonShowAll){
            // вначале покажем все элементы
            tags.forEach(tag => tag.classList.remove('tags__item_hide'));
            // и скроем кнопку
            buttonShowAll.classList.remove('tags__item_show');
        }
    }
    const tagsBlocks = document.querySelectorAll('.tags__wrapper');
    if(tagsBlocks.length){
        tags(tagsBlocks);
        addEventListener("resize", resizeThrottler, false);
        let resizeTimeout;
        function resizeThrottler() {
            // ignore resize events as long as an tags execution is in the queue
            if ( !resizeTimeout ) {
                resizeTimeout = setTimeout(function() {
                    resizeTimeout = null;
                    tags(tagsBlocks);

                    // The tags will execute at a rate of 15fps
                }, 66);
            }
        }
    }

    // product__tooltip btn click
    const tooltips = document.querySelectorAll('.product__tooltip');
    if(tooltips.length){
        tooltips.forEach(tooltip => {
            document.addEventListener( 'click', (event) => {
                const withinBoundaries = event.composedPath().includes(tooltip);

                tooltip.querySelector('.product__tooltip-text').classList.add('product__tooltip-text_show');

                if ( ! withinBoundaries ) {
                    tooltip.querySelector('.product__tooltip-text').classList.remove('product__tooltip-text_show');
                }
            })
        });
    }

    // product__price-name btn click
    const priceNames = document.querySelectorAll('.product__price-name');
    const priceProduct = document.querySelector('.product__price');
    if(priceNames.length){
        priceNames.forEach(priceName => {
            priceName.addEventListener('click', (event) => {
                event.preventDefault();

                priceNames.forEach(item => {item.classList.remove('product__price-name_active')})
                priceName.classList.add('product__price-name_active');
                priceProduct.textContent = priceName.dataset.price;
            });
        });
    }

    // header__top-button visible
    // const headerTopButton = function () {
    //     if(document.querySelector('.header__desktop-top') && !isMobile){
    //         showHeaderBtn();
    //         headerTopBg();
    //         document.addEventListener("scroll", () => {
    //             showHeaderBtn();
    //             headerTopBg();
    //         });
    //         function showHeaderBtn(){
    //             const headerTopBtn = document.querySelector('.header__top-button');
    //             const headerBtn = document.querySelector('.header__button');
    //             const headerTopHeight = document.querySelector('.header__desktop-top').clientHeight;
    //             if(headerBtn.getBoundingClientRect().top - headerTopHeight <= 0){
    //                 headerTopBtn.classList.add('header__top-button_active');
    //             } else {
    //                 headerTopBtn.classList.remove('header__top-button_active');
    //             }
    //         }
    //
    //         function headerTopBg(){
    //             if(window.scrollY == 0){
    //                 document.querySelector('.header__desktop-top').classList.add('header__desktop-top_bg-transparent');
    //             } else {
    //                 document.querySelector('.header__desktop-top').classList.remove('header__desktop-top_bg-transparent');
    //             }
    //         }
    //     }
    // }
    // headerTopButton();

    /* menu-top priorityPlusNav*/
    // https://github.com/jayfreestone/priority-plus
    const priorityPlusNav = function (blockName){
        try {
            const priorityPlusMenu = priorityPlus(document.querySelector(`.${blockName}_list`), {
                classNames: {
                    'toggle-btn': [`${blockName}__link ${blockName}__link_more p-plus__toggle-btn`],
                    'overflow-nav': [`${blockName}__submenu ${blockName}__submenu_level1 ${blockName}__submenu_more`],
                },
                innerToggleTemplate: 'Еще...',
            });

            priorityPlusMenu.on('itemsChanged', priorityPlusMenuClasses);
            priorityPlusMenu.on('toggleClicked', priorityPlusMenuClasses);
            priorityPlusMenuVisible();

            function priorityPlusMenuClasses(){
                // add classes on submenu
                document.querySelectorAll(`.${blockName}__submenu_more li`).forEach((li) => {
                    li.classList.remove(`${blockName}_item`);
                    li.classList.add(`${blockName}__submenu-item`);``

                    const link = li.querySelector('a');
                    if(link){
                        link.classList.remove(`${blockName}__link`);
                        link.classList.add(`${blockName}__submenu-link`);
                    }
                });

                // add classes on menu
                document.querySelectorAll(`.${blockName}_list > .${blockName}__submenu-item`).forEach((li) => {
                    li.classList.remove(`${blockName}__submenu-item`);
                    li.classList.add(`${blockName}_item`);

                    const link = li.querySelector('a');
                    if(link){
                        link.classList.remove(`${blockName}__submenu-link`);
                        link.classList.add(`${blockName}__link`);
                    }
                });
            }

            function priorityPlusMenuVisible(){
                setTimeout(function () {
                    if(blockName === 'menu-header'){
                        document.querySelector(`.header__desktop-top`).classList.add(`header__desktop-top_visible`);

                    }
                    if(blockName === 'menu-top'){
                        document.querySelector(`.${blockName}`).classList.add(`${blockName}_visible`);
                    }
                }, 100);
            }
        } catch (err) {
            console.log(err);
        }
    }
    priorityPlusNav('menu-top');
    priorityPlusNav('menu-header');

    const menuToggle = function (){
        // submenu-toggle
        document.querySelectorAll('.menu-top .submenu-toggle, .menu-header .submenu-toggle').forEach(submenuToggle => {
            submenuToggle.addEventListener('click', (event) => {
                event.preventDefault(); // при клике на ссылку никуда не переходим
            });

            submenuToggle.addEventListener('keydown', (event) => {
                if(event.which === 13) {
                    event.preventDefault();
                    event.target.nextElementSibling.slideToggle(200); // при нажатии на enter разворачиваем подразделы
                }
            });
        });
    }
    menuToggle();

    // const verticalMenu = function (){
    //     /* vertical-menu btn scroll submenu */
    //     document.querySelectorAll('.vertical-menu__item-btn').forEach((btn) => {
    //         btn.addEventListener('click', (e) => {
    //             e.preventDefault();
    //             const menuLi = e.target.closest('.vertical-menu__item');
    //             const subMenu = menuLi.querySelector('.vertical-menu__submenu');
    //             subMenu.slideToggle(200, function(){
    //                 /*
    //                 Состояния пункта меню:
    //                 - Если у пункта меню есть оба класса "selected" и "active" - то находимся в разделе, имеющем подразделы
    //                 - Если у пункта меню один класс "active" - мы находимся в дочернем разделе,
    //                 родитель которого имеет подразделы
    //                  */
    //                 if(menuLi.classList.contains('vertical-menu__item_active')){
    //                     btn.classList.toggle('vertical-menu__item-btn_hide');
    //                     // подставлять класс submenu-btn-hide,
    //                     // при котором стрелка свернута
    //                 } else {
    //                     btn.classList.toggle('vertical-menu__item-btn_show');
    //                     // если мы не находимся в разделе или подразделе этого пункта
    //                     // меню, то подставлять класс submenu-btn-show, при котором стрелка развернута
    //                 }
    //             });
    //         });
    //     });
    //
    //     // slide submenu on click
    //     document.querySelectorAll('.vertical-menu .submenu-toggle').forEach(submenuToggle => {
    //         submenuToggle.addEventListener('click', (e) => {
    //             e.preventDefault();
    //             const itemWrap = e.target.closest('.vertical-menu__item-wrap');
    //             itemWrap.querySelector('.vertical-menu__item-btn').click();
    //         });
    //     });
    // }
    // verticalMenu();

    // const mobileButtons = function (){
    //     // mobile container slideToggle
    //     document.querySelectorAll('.header__mobile-button').forEach(btn => {
    //         btn.addEventListener('click', (event) => {
    //             // если кнопка раскрывает какое-либо меню
    //             if (btn.dataset.buttonName) {
    //                 event.preventDefault();
    //                 btn.classList.toggle('active');
    //
    //                 document.querySelectorAll('.header__mobile-button-container').forEach(container => {
    //                     if (btn.dataset.buttonName === container.dataset.buttonName) {
    //                         container.slideToggle(200);
    //                     }
    //                 });
    //             }
    //         });
    //     });
    //
    //     // focus on search
    //     const searchBtn = document.querySelector('.header__mobile-button[data-button-name="search"]');
    //     searchBtn.addEventListener('click', (e) => {
    //         const searchInput = document.querySelector('.header__mobile-button-container[data-button-name="search"] input[type="search"]');
    //         if(searchBtn.classList.contains('active')){
    //             searchInput.focus();
    //         } else {
    //             searchInput.blur();
    //         }
    //     });
    // }
    // mobileButtons();


    // sections-sub-popup item click
    const sectionsSubPopup = function (){
        const items = document.querySelectorAll('.sections-sub-popup__item');
        items.forEach(item => item.addEventListener('click', (e) => {
            const itemTextContainer = e.currentTarget.querySelector('.sections-sub-popup__text-container');

            if (itemTextContainer) {
                // клик на мобильном - показывает подразделы
                if (window.innerWidth > 575 && window.innerWidth <= 991) {
                    itemTextContainer.classList.add('sections-sub-popup__text-container_active');
                }

                // на маленьком экране при клике - сразу переход в раздел без показа подразделов
                if (window.innerWidth <= 575) {
                    document.location.href = itemTextContainer.querySelector('.sections-sub-popup__title').getAttribute('href');
                }
            }
        }));
    }
    sectionsSubPopup();


    /* slider */
    const slider = function (){
        const sliders = document.querySelectorAll('.slider');

        sliders.forEach(slider => {
            const selector = '.' + slider.classList.value.trim().replace(/\s+/g, '.');
            const swiper = new Swiper(selector + ' .swiper', {
                loop: slider.querySelectorAll(' .swiper-slide').length > 1 ? true : false,
                preloadImages: false,
                lazy: true,
                autoplay: {
                    delay: 9000,
                    pauseOnMouseEnter: true,
                    disableOnInteraction: false
                },
                pagination: {
                    el: selector + ' .swiper-pagination-custom2',
                    bulletClass: 'swiper-pagination-bullet-custom',
                    bulletActiveClass: 'swiper-pagination-bullet-active-custom',
                    horizontalClass: 'swiper-pagination-horizontal-custom',
                    bulletElement: 'button',
                    clickable: true,
                },
                navigation: {
                    nextEl: selector + ' .swiper-button-next-custom',
                    prevEl: selector + ' .swiper-button-prev-custom',
                },
                a11y: {
                    prevSlideMessage: 'Предыдущий слайд',
                    nextSlideMessage: 'Следующий слайд',
                    firstSlideMessage: 'Это первый слайд',
                    lastSlideMessage: 'Это последний слайд',
                    paginationBulletMessage: 'К слайду №{{index}}'
                },
            });
        });
    }
    slider();

    /* slider-bg */
    const sliderBg = function (){
        const sliders = document.querySelectorAll('.slider-bg');

        sliders.forEach(slider => {
            const selector = '.' + slider.classList.value.trim().replace(/\s+/g, '.');
            const swiper = new Swiper(selector + ' .swiper', {
                loop: slider.querySelectorAll(' .swiper-slide').length > 1 ? true : false,
                preloadImages: false,
                lazy: true,
                autoplay: {
                    delay: 9000,
                    pauseOnMouseEnter: true,
                    disableOnInteraction: false
                },
                pagination: {
                    el: selector + ' .swiper-pagination-custom2',
                    bulletClass: 'swiper-pagination-bullet-custom',
                    bulletActiveClass: 'swiper-pagination-bullet-active-custom',
                    horizontalClass: 'swiper-pagination-horizontal-custom',
                    bulletElement: 'button',
                    clickable: true,
                },
                navigation: {
                    nextEl: selector + ' .swiper-button-next-custom',
                    prevEl: selector + ' .swiper-button-prev-custom',
                },
                a11y: {
                    prevSlideMessage: 'Предыдущий слайд',
                    nextSlideMessage: 'Следующий слайд',
                    firstSlideMessage: 'Это первый слайд',
                    lastSlideMessage: 'Это последний слайд',
                    paginationBulletMessage: 'К слайду №{{index}}'
                },
            });
        });
    }
    sliderBg();

    /* slider-bg-fw */
    const sliderBgFw = function (){
        const sliders = document.querySelectorAll('.slider-bg-fw');

        sliders.forEach(slider => {
            const selector = '.' + slider.classList.value.trim().replace(/\s+/g, '.');
            const swiper = new Swiper(selector + ' .swiper', {
                loop: slider.querySelectorAll(' .swiper-slide').length > 1 ? true : false,
                preloadImages: false,
                lazy: true,
                autoplay: {
                    delay: 9000,
                    pauseOnMouseEnter: true,
                    disableOnInteraction: false
                },
                pagination: {
                    el: selector + ' .swiper-pagination-custom2',
                    bulletClass: 'swiper-pagination-bullet-custom',
                    bulletActiveClass: 'swiper-pagination-bullet-active-custom',
                    horizontalClass: 'swiper-pagination-horizontal-custom',
                    bulletElement: 'button',
                    clickable: true,
                },
                navigation: {
                    nextEl: selector + ' .swiper-button-next-custom',
                    prevEl: selector + ' .swiper-button-prev-custom',
                },
                a11y: {
                    prevSlideMessage: 'Предыдущий слайд',
                    nextSlideMessage: 'Следующий слайд',
                    firstSlideMessage: 'Это первый слайд',
                    lastSlideMessage: 'Это последний слайд',
                    paginationBulletMessage: 'К слайду №{{index}}'
                },
            });
        });
    }
    sliderBgFw();

    /* slider-thumbs */
    const sliderThumbs = function (){
        const sliders = document.querySelectorAll('.slider-thumbs');

        sliders.forEach(slider => {
            const selector = '.' + slider.classList.value.trim().replace(/\s+/g, '.');

            let swiperThumbs;
            if(document.querySelector(selector + ' .slider-thumbs__carousel .swiper') !== null  ){
                swiperThumbs = new Swiper(selector + ' .slider-thumbs__carousel .swiper', {
                    preloadImages: false,
                    lazy: true,
                    spaceBetween: 10,
                    slidesPerView: 4,
                    watchSlidesProgress: true,
                    // centerInsufficientSlides: true,
                    direction: 'vertical'
                });
            }

            const swiperMain = new Swiper(selector + ' .slider-thumbs__main .swiper', {
                preloadImages: false,
                lazy: true,
                rewind: true,
                spaceBetween: 10,
                autoplay: {
                    delay: 9000,
                    pauseOnMouseEnter: true,
                    disableOnInteraction: false
                },
                navigation: {
                    nextEl: selector + ' .swiper-button-next-custom',
                    prevEl: selector + ' .swiper-button-prev-custom',
                },
                a11y: {
                    prevSlideMessage: 'Предыдущий слайд',
                    nextSlideMessage: 'Следующий слайд',
                    firstSlideMessage: 'Это первый слайд',
                    lastSlideMessage: 'Это последний слайд',
                    paginationBulletMessage: 'К слайду №{{index}}'
                },
                thumbs: {
                    swiper: (swiperThumbs ? swiperThumbs : null),
                }
            });

        });
    }
    sliderThumbs();

    /* fancybox */
    Fancybox.defaults.l10n = {
        CLOSE: "Закрыть",
        NEXT: "Следующий",
        PREV: "Предыдущий",
        MODAL: "Вы можете закрыть окно нажатием ESC",
        ERROR: "Ошибка, попробуйте повторить попытку",
        IMAGE_ERROR: "Изображение не найдено",
        ELEMENT_NOT_FOUND: "HTML элемент не найден",
        AJAX_NOT_FOUND: "Ошибка загрузки AJAX: Не найдено",
        AJAX_FORBIDDEN: "Ошибка загрузки AJAX: Запрещено",
        IFRAME_ERROR: "Ошибка при загрузке фрейма",
        TOGGLE_ZOOM: "Приблизить",
        TOGGLE_THUMBS: "Миниатюры",
        TOGGLE_SLIDESHOW: "Слайдшоу",
        TOGGLE_FULLSCREEN: "Полноэкранный режим",
        DOWNLOAD: "Загрузить",
        ITERATEZOOM: "Изменить масштаб"
    };
    Fancybox.bind("[data-fancybox]");
    /* fancybox */

    // tabs
    const tabs = function () {
        const tabsLinks = document.querySelector('.tabs__links');

        if(tabsLinks){
            tabsLinks.addEventListener('click', function(e) {
                e.preventDefault();

                if (e.target.classList.contains('tabs__link')) {
                    const tabsLink = e.target,
                        tabs__contents = tabsLink.closest('.tabs').querySelectorAll('.tabs__content'),
                        itemPosition = [...tabsLink.parentNode.children].indexOf(tabsLink);

                    tabs__contents.forEach((tabsContent, index) => {
                        tabsContent.classList.toggle('tabs__content_active', index === itemPosition);
                    });

                    tabsLink.classList.toggle('tabs__link_active', true);
                    [...tabsLink.parentNode.children].filter(child => child !== tabsLink).forEach(sibling => sibling.classList.remove('tabs__link_active'));
                }
            }); 
        }

        // open tab on url id
        const urlTabIdIndex = window.location.href.indexOf('#');
        if (urlTabIdIndex !== -1) {
            const tabId = window.location.href.substring(urlTabIdIndex + 1);
            openTab(tabId);
        }

        function openTab(tabName) {
            const tabsLinks = document.querySelectorAll('.tabs__link');
            const tabsContents = document.querySelectorAll('.tabs__content');

            tabsLinks.forEach(tabsLink => {
                if (tabsLink.getAttribute('id') === tabName) {
                    tabsLink.classList.add('tabs__link_active');
                } else {
                    tabsLink.classList.remove('tabs__link_active');
                }
            });

            tabsContents.forEach((tabsContent, index) => {
                if (index === Array.from(tabsLinks).findIndex(tabsLink => tabsLink.getAttribute('id') === tabName)) {
                    tabsContent.classList.add('tabs__content_active');
                } else {
                    tabsContent.classList.remove('tabs__content_active');
                }
            });
        }

        // open tab on link
        const linksTabs = document.querySelector('.product__links-tab');
        if(linksTabs) {
            linksTabs.addEventListener('click', function(e) {
                if (e.target.classList.contains('product__links-tab__item')) {
                    e.preventDefault();
                    const tabName = e.target.getAttribute('href').replace('#', '');
                    openTab(tabName);
                }
            });
        }
    }
    tabs();

    /* scrollTop button */
    const scrollTop = function () {
        const scrollBtn = document.createElement("button");
        scrollBtn.innerHTML = '<svg><use xlink:href="img/sprite.svg#chevron-up"></use></svg>';
        scrollBtn.classList.add("scrollTopBtn");
        scrollBtn.setAttribute("title", "Наверх");
        document.body.appendChild(scrollBtn);
        const scrollBtnDisplay = function () {
            window.scrollY > 0
                ? scrollBtn.classList.add("show")
                : scrollBtn.classList.remove("show");
        };
        window.addEventListener("scroll", scrollBtnDisplay);

        const scrollWindow = function () {
            if (window.scrollY != 0) {
                setTimeout(function () {
                    window.scrollTo(0, window.scrollY - 50);
                    scrollWindow();
                }, 10);

                // window.scrollTo({top: 0, behavior: 'smooth'}); // chrome bug
            }
        };
        scrollBtn.addEventListener("click", scrollWindow);
    };
    scrollTop();

    /* cookie-warning */
    const cookieWarning = function () {
        if( !Cookies.get('cookieWarning') ){
            const cookieWarningDiv = document.createElement("div");
            cookieWarningDiv.innerHTML = '<div>На сайте используются файлы cookies, а также системы Яндекс.Метрика и Google Analytics. Продолжая использовать сайт вы даете согласие на работу с этими данными. <a href="/soglasie/" target="_blank">Подробнее</a></div>\n' +
                '<button class="button cookie-warning__btn">Хорошо</button>';
            cookieWarningDiv.classList.add("cookie-warning");
            document.body.appendChild(cookieWarningDiv);

            document.querySelector('.cookie-warning__btn').addEventListener('click', (e) => {
                e.preventDefault();
                document.querySelector('.cookie-warning').style.display = 'none';

                try {
                    Cookies.set('cookieWarning', 'true', { expires: 365 });
                } catch (err) {
                    console.log(err);
                }
            });
        }
    };
    cookieWarning();

    // accordion
    const accordion = function () {
        const accordionItems = document.querySelectorAll('.accordion__header');
        accordionItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();

                const accordionItem = item.closest('.accordion__item');
                accordionItem.classList.toggle('accordion__item_selected');
                accordionItem.querySelector('.accordion__body').slideToggle();
                if(accordionItem.classList.contains('accordion__item_selected')){
                    item.querySelector('.accordion__header-svg use').setAttribute("xlink:href", "img/sprite.svg#minus");
                } else {
                    item.querySelector('.accordion__header-svg use').setAttribute("xlink:href", "img/sprite.svg#plus");
                }
            });
        });
    }
    accordion();

    function tableArrows(tableResponsiveSelector = '.table-responsive') {
        document.querySelectorAll(tableResponsiveSelector).forEach(tableResponsive => {
            const tableOverflow = tableResponsive.querySelector('.overflow');
            const table = tableOverflow.querySelector('table');
            let tableResponsiveArrowRightFlag = false;

            tableResponsive.insertAdjacentHTML('afterbegin', `
            <button class="table-responsive__arrow table-responsive__arrow_left" aria-label="Прокрутить влево">
                <svg><use xlink:href="img/sprite.svg#arrow-left"></use></svg>
            </button>
            <button class="table-responsive__arrow table-responsive__arrow_right" aria-label="Прокрутить вправо">
                <svg><use xlink:href="img/sprite.svg#arrow-left"></use></svg>
            </button>
        `);

            // если таблица не помещается в контентную область, то активировать флаг
            if (table.offsetWidth > tableOverflow.offsetWidth) {
                tableResponsiveArrowRightFlag = true;
            }

            window.addEventListener('resize', () => {
                if (table.offsetWidth > tableOverflow.offsetWidth) {
                    tableResponsiveArrowRightFlag = true;
                }
            });

            // если таблица не помещается в контентную область, показывать стрелку справа
            if (tableResponsiveArrowRightFlag) {
                tableResponsive.classList.add('table-responsive__arrow_right-on');
            }

            tableOverflow.addEventListener('scroll', () => {
                // показать стрелку слева
                if (tableOverflow.scrollLeft > 0) {
                    tableResponsive.classList.add('table-responsive__arrow_left-on');
                } else {
                    tableResponsive.classList.remove('table-responsive__arrow_left-on');
                }

                // показать стрелку справа
                if (tableResponsiveArrowRightFlag && (tableOverflow.scrollLeft + tableResponsive.offsetWidth) < table.offsetWidth) {
                    tableResponsive.classList.add('table-responsive__arrow_right-on');
                } else {
                    tableResponsive.classList.remove('table-responsive__arrow_right-on');
                }
            });

            let leftPos = tableOverflow.scrollLeft;

            //клик на кнопки влево и вправо - гориз.скролл
            tableResponsive.querySelector('.table-responsive__arrow_left').addEventListener('click', () => {
                leftPos = tableOverflow.scrollLeft;
                tableOverflow.scrollTo({ left: leftPos - 100, behavior: 'smooth' });
            });

            tableResponsive.querySelector('.table-responsive__arrow_right').addEventListener('click', () => {
                leftPos = tableOverflow.scrollLeft;
                tableOverflow.scrollTo({ left: leftPos + 100, behavior: 'smooth' });
            });
        });
    }
    tableArrows();

    // priceBlock slideToggle
    const priceBlock = function (){
        const priceBlockButtons = document.querySelectorAll('.price-block__button');
        priceBlockButtons.forEach(btn => btn.addEventListener('click', (e) => {
            const priceBlock = e.currentTarget.closest('.price-block');
            e.preventDefault();
            e.currentTarget.classList.toggle('price-block__button_active');
            priceBlock.querySelector('.price-block__container').slideToggle(400, function () {
                priceBlock.classList.toggle("price-block__opened");
            });
        }));
    }
    priceBlock();

    // catalog images on hover
    const catalogPhoto = function () {
        const imagesBlocks = document.querySelectorAll('.catalog-photo');
        imagesBlocks.forEach((imagesBlock) => {
            imagesBlock.addEventListener('mouseover', (e) => {
                const target = e.target;
                if (target.classList.contains('catalog-photo__item')) {
                    const images = target.parentNode.querySelectorAll('.catalog-photo__item');
                    images.forEach((img) => {
                        img.classList.remove('catalog-photo__item_selected');
                    });
                    target.classList.add('catalog-photo__item_selected');
                    const parent = target.parentNode.parentNode;
                    parent.querySelector('img').src = target.dataset.dopSrc;
                }
            });
        });
    }
    catalogPhoto();


    /* hidden link for seo */
    const hiddenLink = function () {
        document.querySelectorAll('.hidden-link').forEach(hiddenLink => {
            const link = document.createElement('a');
            link.href = hiddenLink.dataset.link;
            link.target = '_blank';
            link.innerHTML = hiddenLink.innerHTML;
            hiddenLink.replaceWith(link);
        });
    }
    hiddenLink();


    // landing
    const landing = function (){
        if(document.body.classList.contains('landing')){

            // click on menuItems on Mmenu
            const apiMenu = menu.API;
            const menuItems = document.querySelectorAll('.mm-listitem__text');
            menuItems.forEach(item => {
                item.addEventListener('click', () => {
                    apiMenu.close();
                });
            });

            // Mmenu.options.onClick.close = true;

            function highlightMenuItems() {
                const scrollPosition = window.scrollY;
                const sections = document.querySelectorAll('.section');

                for (let i = 0; i < sections.length; i++) {
                    const section = sections[i];
                    // Получаем позицию начала и конца блока section
                    const sectionStart = section.offsetTop ;
                    const sectionEnd = sectionStart + section.offsetHeight;
                    const offsetSection = parseInt(getComputedStyle(section).scrollMarginTop);

                    // Если текущая позиция скролла находится в пределах блока section,
                    // выделяем пункты li в соответствующем меню
                    // if (scrollPosition >= sectionStart && scrollPosition < sectionEnd) {
                    if (scrollPosition >= sectionStart - offsetSection - 1 && scrollPosition < sectionEnd) { // учтем offset, а также вычтем 1 для того чтобы отсечь десятые
                        let menuId;

                        if(section.hasAttribute('id')){
                            menuId = section.getAttribute('id');
                        } else if(section.parentElement.querySelector('.tpl-anchor')) {
                            section.parentElement.querySelector('.tpl-anchor').getAttribute('id');
                        }

                        if(menuId){
                            const menu = document.querySelector(`.menu-top__link[href="#${menuId}"]`);
                            const menuItems = menu.closest('.menu-top_list').querySelectorAll('.menu-top_item');

                            for (let j = 0; j < menuItems.length; j++) {
                                menuItems[j].classList.remove('menu-top_item_selected');
                            }
                            menu.parentElement.classList.add('menu-top_item_selected');

                            const menuMobile = document.querySelector(`.mm-menu [href="#${menuId}"]`);
                            const menuMobileItems = menuMobile.closest('ul').querySelectorAll('li');

                            for (let j = 0; j < menuMobileItems.length; j++) {
                                menuMobileItems[j].classList.remove('mm-listitem--selected');
                            }
                            menuMobile.parentElement.classList.add('mm-listitem--selected');
                        }

                    }
                }
            }
            window.addEventListener('scroll', highlightMenuItems);
        }
    }
    landing();

    // anchor
    const anchor = function (){
        document.querySelectorAll('a[href^="#"]:not([href="#"], [href^="#mm"], [id^="tab"])').forEach(anchor => {
            // не трогать ссылки с href="#", mmenu, внутри .nc6-toolbar (режим редактирования), ссылки с id начинающийся с tab
            if(!anchor.closest('.nc6-toolbar')){
                anchor.addEventListener('click', (e) => {
                    const anchorHref = anchor.getAttribute('href');

                    e.preventDefault();

                    document.querySelector(anchorHref).scrollIntoView({
                        behavior: 'smooth'
                    });

                    history.pushState(null,null,window.location.pathname + window.location.search + anchorHref);
                });
            }
        });
    }
    anchor();

    // search variants
    const searchVariants = function (){
        let ident_search = 0;
        const searchForms = document.querySelectorAll('.search-block__form .form-control');
        searchForms.forEach(form => {
            form.addEventListener("input", function() {
                ident_search = this.parentElement.id;
                if (this.value.length > 3) {
                    fetch("/ajax/search/search.php", {
                        method: "POST",
                        body: JSON.stringify({gosearch: this.value}),
                        headers: {"Content-type": "application/json; charset=UTF-8"}
                    })
                        .then(response => response.text())
                        .then(response => {
                            const searchWrapper = document.querySelector(`#${ident_search}`).closest(".search-block");
                            searchWrapper.querySelector(".search-block__variants").innerHTML = response;
                            searchWrapper.querySelectorAll(".search-block__option").forEach(option => {
                                option.addEventListener("click", function(e) {
                                    const textInput = searchWrapper.querySelector(`#${ident_search} .form-control`);
                                    textInput.value = this.textContent;
                                    searchWrapper.querySelector(`#${ident_search}`).submit();
                                });
                            });
                            searchWrapper.querySelector(".search-block__variants").style.display = "block";
                        })
                        .catch(error => console.error(error));
                } else {
                    document.querySelector(`#${ident_search}`).closest(".search-block").querySelector(".search-block__variants").innerHTML = '';
                    document.querySelector(`#${ident_search}`).closest(".search-block").querySelector(".search-block__variants").style.display = "none";
                }
            });
        });
    }
    searchVariants();

});


// add link to copied text
const copyListener = (event) => {
    const range = window.getSelection().getRangeAt(0),
        rangeContents = range.cloneContents(),
        pageLink = `Подробнее: ${document.location.href}`,
        helper = document.createElement("div");

    if (range.toString().split(' ').length < 10) {
        return;
    }

    helper.appendChild(rangeContents);
    event.clipboardData.setData("text/plain", `${helper.innerText}\n${pageLink}`);
    event.clipboardData.setData("text/html", `${helper.innerHTML}<br>${pageLink}`);
    event.preventDefault();
};
document.addEventListener("copy", copyListener);

// preloader
function showLoader() {
    document.querySelector('#preloader').classList.add('active');
}
function hideLoader() {
    document.querySelector('#preloader').classList.remove('active');
}

// get Ya.Metrika id (for reachGoal)
let yaC;
window.onload = function () {
    if (typeof Ya !== 'undefined') {
        if (Ya.Metrika2) {
            yaC = Ya.Metrika2.counters()[0].id;
        } else {
            yaC = Ya.Metrika.counters()[0].id;
        }
    }
}

// Yandex map lazyload
const observerMapApi = function (initMap, mapDivSelector){
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.intersectionRatio > 0) {
                ymaps.ready(initMap);
                observer.unobserve(entry.target);
            }
        });
    });
    observer.observe(document.querySelector(mapDivSelector));
}

const observerMap = function(observeSelector, mapSrc, mapDivSelector){
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.intersectionRatio > 0) {
                const script = document.createElement("script");
                script.src = mapSrc;
                entry.target.querySelector(mapDivSelector).appendChild(script);
                observer.unobserve(entry.target);
            }
        });
    });
    observer.observe(document.querySelector(observeSelector));
}

/* sliderSectionCarousel */
const sliderSectionCarousel = function (sliderClassId, col, col_sm, col_md, col_lg, col_xl, spaceBetween_val){
    const selector = '.section_slider-carousel.' + sliderClassId;
    const swiperWrapper = document.querySelector(selector + ' :where(.grid, .grid-flex)');

    // swiperWrapper.classList.remove('grid', 'grid-flex', 'mb', 'pagination-ajax-wrapper');
    swiperWrapper.className = '';

    swiperWrapper.classList.add('swiper-wrapper');
    for (const child of swiperWrapper.children) {
        child.classList.add('swiper-slide');
    }

    const nav =
        '<button class="swiper-button-prev-custom">' +
        '<svg><use xlink:href="img/sprite.svg#arrow-slider"></use></svg>' +
        '</button>' +
        '<button class="swiper-button-next-custom">' +
        '<svg><use xlink:href="img/sprite.svg#arrow-slider"></use></svg>' +
        '</button>' +
        '<div class="swiper-pagination-custom2"></div>';

    const swiperWrapperNew = '<div class="swiper-container mb"><div class="swiper">' + swiperWrapper.outerHTML + '</div>' + nav + '</div>';
    swiperWrapper.outerHTML = swiperWrapperNew;

    const swiper = new Swiper(selector + ' .swiper', {
        rewind: true,
        slidesPerView: col,
        slidesPerGroup: col,
        spaceBetween: 15,
        centerInsufficientSlides: true,
        breakpoints: {
            576: {
                slidesPerView: col_sm,
                slidesPerGroup: col_sm,
                spaceBetween: 15
            },
            768: {
                slidesPerView: col_md,
                slidesPerGroup: col_md,
                spaceBetween: spaceBetween_val,
            },
            992: {
                slidesPerView: col_lg,
                slidesPerGroup: col_lg,
                spaceBetween: spaceBetween_val,
            },
            1360: {
                slidesPerView: col_xl,
                slidesPerGroup: col_xl,
                spaceBetween: spaceBetween_val,
            }
        },
        preloadImages: false,
        lazy: true,
        autoplay: {
            delay: 9000,
            pauseOnMouseEnter: true,
        },
        navigation: {
            nextEl: selector + ' .swiper-button-next-custom',
            prevEl: selector + ' .swiper-button-prev-custom',
        },
        pagination: {
            el: selector + ' .swiper-pagination-custom2',
            bulletClass: 'swiper-pagination-bullet-custom',
            bulletActiveClass: 'swiper-pagination-bullet-active-custom',
            horizontalClass: 'swiper-pagination-horizontal-custom',
            bulletElement: 'button',
            clickable: true,
        },
        a11y: {
            prevSlideMessage: 'Предыдущий слайд',
            nextSlideMessage: 'Следующий слайд',
            firstSlideMessage: 'Это первый слайд',
            lastSlideMessage: 'Это последний слайд',
            paginationBulletMessage: 'К слайду №{{index}}'
        },
    });
}