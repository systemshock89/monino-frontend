"use strict";

document.addEventListener("DOMContentLoaded", function() {
    widgetPhone();

    try {
        Fancybox.bind("[data-fancybox].widget-phone", { // включать значок при закрытии попапа
            dragToClose: getComputedStyle(document.querySelector('.header__mobile')).display === 'flex' ? false : true, // bug: click to button misses on mobile
            on: {
                reveal: (fancybox, slide) => {
                    const formId = slide.el.querySelector('form').getAttribute('id');
                    initSubmitForm(formId);
                },
                close: () => {
                    document.querySelector('.widget-phone').classList.add('widget-phone__active');
                },
            },
        });
    } catch (err) {
        console.log(err);
    }

});

function widgetPhone(){
    const popupTimer = 45000, // таймер, по истечении которого автоматически вызовется попап
        widgetTimer = 4000, // таймер, по истечении которого появится виджет
        cookieTimer = 1; // таймер действия куки (в сутках)

    let widgetPopupOpenFlag = false; // определяет, был ли открыт попап хотя бы 1 раз

    document.querySelector('.widgets-right').insertAdjacentHTML('afterbegin', `
    <div class="widget-phone-wrap">
        <button data-fancybox data-type="ajax" class="widget-phone" data-src="forms/modal-widget-phone.html" title="Обратный звонок">
            <span class="widget__circles"><svg><use xlink:href="img/sprite.svg#phone"></use></svg></span>
        </button>
    </div>
    `);

    const widgetPhone = document.querySelector('.widget-phone');

    //показываем виджет через 5 сек после загрузки страницы
    setTimeout(function(){
        widgetPhone.classList.add('widget-phone__active');
    },widgetTimer);

    //клик по виджету
    widgetPhone.addEventListener('click', () => {
        clickWidgetPhonePopup(widgetPhone); //вызываем функцию
    });

    // Если попап еще ни разу не был открыт (нет куки widget_phone_popup_show)
    try {
        if( !Cookies.get('widget_phone_popup_show') ){
            setTimeout(function(){
                // И если попап не открывали вручную и в данный момент не открыто никакого другого попапа
                if (!widgetPopupOpenFlag && !document.documentElement.classList.contains('with-fancybox') ){
                    // то смотри функцию
                    clickWidgetPhonePopup(widgetPhone, 1);
                }
            },popupTimer);
        }
    } catch (err) {
        console.log(err);
    }

    //ф-я при вызове попапа виджета
    function clickWidgetPhonePopup(widgetPhone, no_click_to_btn){
        widgetPopupOpenFlag = true;

        // То открываем этот попап (спустя 45 сек нахождения на странице)
        // (опять же, если нет куки widget_phone_popup_show)
        // Проверяем куку для того, чтобы попап не открывался на каждой странице сайта, если было открыто несколько вкладок.
        try {
            if( !Cookies.get('widget_phone_popup_show') ){
                if(no_click_to_btn){ // если попап вызывается автоматически, а не кликом по кнопке, то скриптом кликаем по кнопке
                    widgetPhone.click(); //вызываем попап
                }
            }
        } catch (err) {
            console.log(err);
        }
        widgetPhone.classList.remove('widget-phone__active');

        // и ставим куку на сутки, показывающую, что попап был открыт
        try {
            Cookies.set('widget_phone_popup_show', 'true', { expires: cookieTimer });
        } catch (err) {
            console.log(err);
        }

    }
}