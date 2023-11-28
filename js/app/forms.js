"use strict";

document.addEventListener("DOMContentLoaded", function() {
    try {
        Fancybox.bind("[data-fancybox]:where(.button, .button2, .footer__form)", {
            dragToClose: getComputedStyle(document.querySelector('.header__mobile')).display === 'flex' ? false : true, // bug: click to button misses on mobile
            on: {
                reveal: (fancybox, slide) => {
                    const formId = slide.el.querySelector('form').getAttribute('id');
                    initSubmitForm(formId);

                    if(slide.contentEl.classList.contains('modal_cost')){
                        formFieldProductButton(fancybox, slide);
                    }
                }
            }
        });
    } catch (err) {
        console.log(err);
    }
});

function initSubmitForm(formId) {

    const form = document.forms[formId];
    const extKey = form.dataset.extKey;
    const formButton = form.querySelector(`.form__button`);
    const formFieldPersonal = form.querySelector(`.form__field_personal`);
    let formFieldPersonalCheckbox;
    if(formFieldPersonal){
        formFieldPersonalCheckbox = formFieldPersonal.querySelector(`.checkbox__input`);
    }

    // submit
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        let not_empty_exist = 0;
        let not_valid_exist = 0;
        let valid_agree = false;

        if (formFieldPersonal) {
            if (formFieldPersonalCheckbox.checked) {
                valid_agree = true;
            } else {
                formFieldPersonal.classList.add("form__field_error");
            }
        } else {
            valid_agree = true;
        }

        form.querySelectorAll('.valid_req').forEach(field => {
            if (field.value === '' || field.value === '0') {
                field.closest('.form__field').classList.add('form__field_error');
                not_empty_exist = 1;
            }
        });

        form.querySelectorAll('.form__field_fio .valid_req').forEach(field => {
            if (field.value && !isValidFio(field.value)) {
                field.closest('.form__field').classList.add('form__field_error');
                not_empty_exist = 1;
            }
        });

        form.querySelectorAll('.valid_mail').forEach(field => {
            if (field.value && !isValidEmailAddress(field.value)) {
                field.closest('.form__field').classList.add('form__field_error');
                not_valid_exist = 1;
            }
        });

        form.querySelectorAll('.valid_phone').forEach(field => {
            if (field.value && !isValidTel(field.value)) {
                field.closest('.form__field').classList.add('form__field_error');
                not_valid_exist = 1;
            }
        });

        if (!not_empty_exist && !not_valid_exist && valid_agree) {
            formButton.disabled = true;
            showLoader();

            let text_send = "Ваша заявка отправлена!";
            const data_text_send = formButton.dataset.text_send;

            if (data_text_send != "") {
                text_send = data_text_send;
            }

            const type_send = formButton.dataset.type_send;
            let yam = formButton.dataset.yam;
            const id_target_ym = form.querySelector(".id_target_ym");

            if (id_target_ym) {
                if (id_target_ym && id_target_ym.value != "") {
                    yam = id_target_ym.value;
                }
            }

            const open_in_popap = formButton.dataset.open_in_popap;

            form.querySelector(`.form_sp_sec`).value = 'f2d2g54j5y2f5';

            if (type_send == "ajax") {
                const formData = new FormData(form);
                const serializeArray = [];
                for (const [name, value] of formData.entries()) {
                    serializeArray.push({name, value});
                }

                let file_exist = 0;

                // функционала добавления файла ajax нет
                // const fileInputs = document.querySelectorAll(`.form-control_file_${form_id}`);
                // if (fileInputs.length) {
                //     const maxUploadSize = fileInputs[0].dataset.ufs;
                //
                //     Array.from(fileInputs[0].files).forEach((file) => {
                //         if (file.size <= maxUploadSize) {
                //             formData.append("files[]", file);
                //             file_exist = 1;
                //         }
                //     });
                //
                //     formData.append("dataForm", form);
                // }

                // jquery
                // if ($('.form-control_file' + form_id).length) {
                //     const maxUploadSize = $('.form-control_file' + form_id).data('ufs');
                //
                //     $.each($('.form-control_file' + form_id)[0].files, function (i, file) {
                //         if (file.size <= maxUploadSize) {
                //             formData.append('files[]', file);
                //             file_exist = 1;
                //         }
                //     });
                //
                //     formData.append('dataForm', $("#form_" + form_id));
                // }

                fetch(`/form_fmc/api/add.php?ext_key=${extKey}`, {
                    method: 'POST',
                    cache: 'no-cache',
                    body: JSON.stringify({
                        send_ajax: 1,
                        file_exist: file_exist,
                        data: serializeArray,
                    }),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                    .then(response => response.text())
                    .then(res => {
                        /* Ecommerce - Покупка (для формы "заказ в 1 клик") */
                        if (yam == 'ZAKAZ1CLICK') {
                            window.dataLayer = window.dataLayer || [];

                            let product_item = document.querySelector('.modal_order');
                            const product_urlParams = new URLSearchParams(document.querySelector('.seo-btn-tovar-inner').dataset.src),
                                product_id = product_urlParams.get('ext_var[tovarid]'),
                                product_name = product_item.querySelector('.form__field_name div').textContent;
                            let product_price;

                            if(product_item.querySelector('.form__field_price .nowrap')){
                                product_price = parseInt(product_item.querySelector('.form__field_price .nowrap').textContent.replace(/[^0-9]/gi, ''), 10);
                            } else {
                                product_price = 0;
                            }

                            dataLayer.push({
                                "ecommerce": {
                                    "currencyCode": "RUB",
                                    "purchase": {
                                        "actionField": {
                                            "id": res
                                        },
                                        "products": [
                                            {
                                                "id": product_id,
                                                "name": product_name,
                                                "price": product_price,
                                                //"brand": "",
                                                //"category": "",
                                                //"variant": ""
                                                "quantity": 1
                                            },
                                        ]
                                    }
                                }
                            });
                        }
                        /* /Ecommerce - Покупка (для формы "заказ в 1 клик") */

                        if (res > 0) {
                            clearFormData(formId);
                            closeFormPopap(yam, text_send, formId, open_in_popap);

                            // функционала добавления файла ajax нет
                            // if (formData.get('files[]')) {
                            //     fetch(`/form_fmc/api/add.php?id=${res}&ext_key=${form_id}`, {
                            //         method: 'POST',
                            //         body: formData,
                            //     })
                            //         .then(response => response.text())
                            //         .then(data => {
                            //             closeFormPopap(yam, text_send, form_id, open_in_popap);
                            //         })
                            //         .catch(error => console.error(error));
                            //
                            //     // jquery
                            //     // $.ajax({
                            //     //     url: "/form_fmc/api/add.php?id=" + res + "&ext_key=" + form_id,
                            //     //     data: formData,
                            //     //     cache: false,
                            //     //     contentType: false,
                            //     //     processData: false,
                            //     //     type: 'POST',
                            //     //     success: function (data) {
                            //     //         closeFormPopap(yam, text_send, form_id, open_in_popap);
                            //     //     }
                            //     // });
                            // } else {
                            //     closeFormPopap(yam, text_send, form_id, open_in_popap);
                            // }
                        } else {
                            hideLoader();
                            if (res == 'long') {
                                alert('Вы слишком быстро вводите данные формы! Сработала защита от спама. Попробуйте еще раз.');
                                formButton.disabled = false;
                                form.reset();
                            } else if (res == 0) {
                                alert('Сработала защита от взлома!');
                                formButton.disabled = false;
                                form.reset();
                            }
                        }
                    })
                    .catch(error => {
                        console.error('Error:', error);
                    });
            }

            if (type_send == "reboot") {
                clearFormData(formId);
                goYaM(yam);
                // fancybox_success_message(text_send);
                formSendRedirect();
                setTimeout(function () {
                    form.submit();
                }, 1000);
            }

        }
    });

    if (form.querySelector(`.form_fmc_nf_time`).dataset.emb == "1") {
        const time = Math.floor(Date.now() / 1000);
        form.querySelector(`.form_fmc_nf_time`).value = time;
    }

    if (form.querySelector(`.form_fmc_page_from`).dataset.emb == "1") {
        form.querySelector(`.form_fmc_page_from`).value = window.location.href;
    }

    // for Inputmask plugin
    // $(".mask_enter_exist").each(function(){
    //     var mmask = $(this).data('mask');
    //     try {
    //         Inputmask({"mask": mmask, "positionCaretOnClick": "ignore"}).mask($(this));
    //     } catch (err) {
    //         console.log(err);
    //     }
    // });

    phoneInput('input[type=tel]');

    // remove error-class on focus in form-controls
    form.querySelectorAll(".form-control, .checkbox__input, .radio__input").forEach((formControl) => {
        formControl.addEventListener("focus", () => {
            const formFieldError = formControl.closest('.form__field_error')
            if(formFieldError){
                formFieldError.classList.remove("form__field_error");
            }
        });
    });

    // remove error-class on click in form-controls
    form.querySelectorAll(".form__field").forEach((formField) => {
        formField.addEventListener("click", () => {
            formField.classList.remove("form__field_error");
        });
    });

    // remove error-class on check form__field_personal
    if(formFieldPersonal){
        formFieldPersonalCheckbox.addEventListener("click", () => {
            if (formFieldPersonalCheckbox.checked) {
                formFieldPersonal.classList.remove("form__field_error");

            }
        });
    }

    // функционала добавления файла ajax нет (jquery)
    // $("#id_form_add_file" + form_id).change(function () {
    //     const tt = $(this).data('tt');
    //     const maxUploadSize = $(this).data('ufs');
    //
    //     if ($('.form-control_file' + form_id).length) {
    //         showLoader();
    //
    //         let upload = true;
    //         const formData = new FormData();
    //
    //         $.each($('.form-control_file' + form_id)[0].files, function (i, file) {
    //             if (file.size <= maxUploadSize) {
    //                 formData.append('files[]', file);
    //             } else {
    //                 upload = false;
    //             }
    //         });
    //
    //         if (upload) {
    //             let ajax_file = "";
    //             if (tt == "file") {
    //                 ajax_file = "file_validation";
    //             }
    //             if (tt == "fileimg") {
    //                 ajax_file = "fileimg_validation";
    //             }
    //
    //             $.ajax({
    //                 url: "/form_fmc/api/" + ajax_file + ".php",
    //                 data: formData,
    //                 cache: false,
    //                 contentType: false,
    //                 processData: false,
    //                 type: 'POST',
    //                 success: function (data) {
    //                     hideLoader();
    //                     if (data == "novalid") {
    //                         alert("Недопустимое расширение файла!");
    //                     }
    //                 }
    //             });
    //         } else {
    //             hideLoader();
    //             alert("Превышен максимальный (5M) размер файла!");
    //         }
    //     }
    // });

    setupFormHandlers(formId);
    loadFormData(formId);
}

function closeFormPopap(yam, text_send, formId, open_in_popap) {
    const form = document.forms[formId];

    goYaM(yam);
    // fancybox_success_message(text_send);
    formSendRedirect();

    form.querySelectorAll(".form__field_error").forEach(field => field.classList.remove("form__field_error"));
    form.reset();

    setTimeout(function () {
        Fancybox.close();
        form.querySelector(`.form__button`).disabled = false;
    }, 1000);
}

function goYaM(id) {
    if (typeof (yaC) != "undefined" && id) {
        ym(yaC, 'reachGoal', id);

        // пользовательское событие GTM с id, который берется из названия цели яндекс метрики
        if (typeof dataLayer !== 'undefined') {
            dataLayer.push({'event': id});
        }
    }

    // пользовательское событие GTM с id=formsend
    if (typeof dataLayer !== 'undefined') {
        dataLayer.push({'event': 'formsend'});
    }
}

function isValidEmailAddress(emailAddress) {
    const pattern = /^[\S]+@[a-z0-9-]+\.[a-z]{2,}$/i;
    return pattern.test(emailAddress);
}

function isValidFio(fio){
    const pattern = /^[a-zа-яё]+$/i; // только буквы
    return pattern.test(fio);
}

function isValidTel(tel) {
    const pattern = /^(\+7|8)\s\(\d{3}\)\s\d{3}-\d{2}-\d{2}|\+\d+$/i; // тел вида +7 (___) ___-__-__ либо +***** (любое кол-во цифр начинающееся на плюс)
    return pattern.test(tel);
}

function fancybox_success_message(text_send) {
    hideLoader();

    new Fancybox(
        [{
            src: '<div class="modal modal_success">' +
                '<div class="form__title">Спасибо!</div>' +
                '<div class="modal__text">' + text_send + '</div>' +
                '<button class="button form__button" data-fancybox-close >Ok</button>' +
                '</div>',
            type: "html"
        }],
        {
            autoFocus: false
        }
    );
}

function formSendRedirect(){
    hideLoader();
    window.location.href = window.location.origin + '/formSend/';
}

// Функция сохранения данных формы в localStorage
// todo список чекбоксов и радио тоже сохранять
function saveFormData(formName) {
    const formData = {};
    const form = document.forms[formName];

    for (let i = 0; i < form.elements.length; i++) {
        const element = form.elements[i];
        if (element.name) {
            if(element.type === 'checkbox' || element.type === 'radio'){
                formData[element.name] = String(element.checked);
            } else {
                formData[element.name] = element.value;
            }
        }
    }

    localStorage.setItem(formName, JSON.stringify(formData));
}

// Функция очистки данных формы из localStorage
function clearFormData(formName) {
    localStorage.removeItem(formName);
}

// Функция подстановки данных из localStorage в форму
function loadFormData(formName) {
    const formData = JSON.parse(localStorage.getItem(formName));

    if (formData) {
        const form = document.forms[formName];

        for (let i = 0; i < form.elements.length; i++) {
            const element = form.elements[i];

            if (element.name && formData[element.name]) {
                if(element.type === 'checkbox' || element.type === 'radio'){
                    element.checked = (formData[element.name] === 'true');
                } else {
                    element.value = formData[element.name];
                }
            }
        }
    }
}

// Функция, которая запускает функцию saveFormData при взаимодействии с элементами формы
function setupFormHandlers(formName) {
    const form = document.forms[formName];

    for (let i = 0; i < form.elements.length; i++) {
        const element = form.elements[i];
        if ( (element.tagName === 'INPUT' && element.type !== 'checkbox' && element.type !== 'radio' && element.type !== 'hidden') || element.tagName === 'TEXTAREA') {
            element.addEventListener('keyup', function() {
                saveFormData(formName);
            });
        }

        if (element.tagName === 'SELECT') {
            element.addEventListener('change', function() {
                saveFormData(formName);
            });
        }

        if (element.type === 'checkbox' || element.type === 'radio') {
            element.addEventListener('click', function() {
                saveFormData(formName);
            });
        }
    }
}

let iclon = 1;
function formFieldProductButton(fancybox, slide) {
    document.querySelector('.form__field_product-button').addEventListener('click', (event) => {
        event.preventDefault();

        const formFieldProduct = document.querySelector('.form__field-wrapper_product');
        const cloneFormFieldProduct = formFieldProduct.cloneNode(true);
        cloneFormFieldProduct.querySelector('.form-control_select').setAttribute('id', '104_' + iclon);
        cloneFormFieldProduct.querySelector('.form-control_select').setAttribute('name', 'field_104_' + iclon);
        cloneFormFieldProduct.querySelector('.form__field_size input[type=text]').setAttribute('name', 'field_109_' + iclon);
        cloneFormFieldProduct.querySelector('.form__field_size input[type=text]').setAttribute('id', '109_' + iclon);

        const formFieldProductLast = document.querySelector('.form__field-wrapper_product:nth-last-child(2)');
        formFieldProductLast.after(cloneFormFieldProduct);

        iclon++;
    });
}