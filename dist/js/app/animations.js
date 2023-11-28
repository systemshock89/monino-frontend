"use strict";

animateElements({
    container: 'features-circles-anim',
    element: 'features-circles__item',
    classAnimEnd: 'bounceInRight'
});

animateElements({
    container: 'text-block_two-columns-anim',
    element: 'text-container:nth-child(1)',
    classAnimEnd: 'bounceInLeft'
});

animateElements({
    container: 'text-block_two-columns-anim',
    element: 'text-container:nth-child(2)',
    classAnimEnd: 'bounceInRight'
});

animateElements({
    container: 'features-anim',
    element: 'features__item',
    classAnimEnd: 'fadeIn'
});

function animateElements({container, element, classAnimStart, classAnimEnd, threshold = 0.25, once = false}){
    /**
     * container - класс контейнера, на который ставится наблюдатель
     * element - класс анимируемого эл-та (добавить ему visibility: hidden)
     * classAnimStart - класс начальной точки анимации (при keyframes он не нужен)
     * classAnimEnd - класс конечной точки анимации
     * threshold - допустимый процент пересечения контейнера, когда начнется анимация
     * (на мобильниках начинаем анимацию сразу же: threshold = 0)
     * once - проиграть анимацию только 1 раз
     */
    if(window.outerWidth <= 768){
        threshold = 0;
    }

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            const elements = entry.target.querySelectorAll('.' + container + ' .' + element);
            elements.forEach(el => {
                if(classAnimStart){
                    el.classList.add(classAnimStart);
                }

                setTimeout(() =>{
                    if(once){
                        if(entry.isIntersecting){
                            el.classList.add(classAnimEnd);
                        }
                    } else {
                        el.classList.toggle(classAnimEnd, entry.isIntersecting);
                    }
                }, 100);
            });
        });
    }, {
        threshold: threshold
    });

    const observeContainers = document.querySelectorAll('.' + container);
    observeContainers.forEach(el => observer.observe(el));
}