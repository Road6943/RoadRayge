// ==UserScript==
// @name         Arras Graphics Client
// @namespace    https://github.com/Ray-Adams
// @version      2.0.1
// @description  Fully customizable visual enhancements for arras.io
// @author       Ray Adams
// @match        *://arras.io/*
// @match        *://arras.netlify.app/*
// @run-at       document-end
// @grant        none
// ==/UserScript==

(() => {

    'use strict';

    const _Arras = Arras(), _localStorage = localStorage;

    /* Initialize localStorage settings (if they're not already present) */
    _localStorage.gcSettings = _localStorage.gcSettings || JSON.stringify(_Arras)

    let parsedGcSettings = JSON.parse(_localStorage.gcSettings);

    /* Apply localStorage settings */
    Object.keys(parsedGcSettings).forEach(prop => {

        for (let [key, value] of Object.entries(parsedGcSettings[prop])) {

            _Arras[prop][key] = value;

        };

    });

    if (_localStorage.gcBackgroundImage) document.body.style.background = `url(${_localStorage.gcBackgroundImage}) center / cover no-repeat`;

    /*
     * Source: https://gist.github.com/aharl/84fb1bfa937a688dd7203258591c2ca5
     * Dynamically creates element(s)
     */
    const elementFactory = (type, attributes, ...children) => {

        const element = document.createElement(type);

        for (let key in attributes) {
            element.setAttribute(key, attributes[key]);
        };

        children.flat().forEach(child => {
            if (typeof child === "string") {
                element.appendChild(document.createTextNode(child));
            } else {
                element.appendChild(child);
            }
        });

        return element;

    };

    /* CSS styles for UI */
    const styles = elementFactory('style', {}, `
        body {
            background-size: cover;
        }

        #gc-settings-button {
            height: 30px;
            width: 30px;
            position: fixed;
            top: 10px;
            right: 10px;
            border: none;
            display: inline-block;
            opacity: 0.75;
            background: white;
            background-image: url('data:image/svg+xml,%3Csvg xmlns%3D"http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg" fill%3D"%23505050" viewBox%3D"0 0 16 16" width%3D"20" height%3D"20"%3E%3Cpath d%3D"M9.405 1.05c-.413-1.4-2.397-1.4-2.81 0l-.1.34a1.464 1.464 0 0 1-2.105.872l-.31-.17c-1.283-.698-2.686.705-1.987 1.987l.169.311c.446.82.023 1.841-.872 2.105l-.34.1c-1.4.413-1.4 2.397 0 2.81l.34.1a1.464 1.464 0 0 1 .872 2.105l-.17.31c-.698 1.283.705 2.686 1.987 1.987l.311-.169a1.464 1.464 0 0 1 2.105.872l.1.34c.413 1.4 2.397 1.4 2.81 0l.1-.34a1.464 1.464 0 0 1 2.105-.872l.31.17c1.283.698 2.686-.705 1.987-1.987l-.169-.311a1.464 1.464 0 0 1 .872-2.105l.34-.1c1.4-.413 1.4-2.397 0-2.81l-.34-.1a1.464 1.464 0 0 1-.872-2.105l.17-.31c.698-1.283-.705-2.686-1.987-1.987l-.311.169a1.464 1.464 0 0 1-2.105-.872l-.1-.34zM8 10.93a2.929 2.929 0 1 1 0-5.86 2.929 2.929 0 0 1 0 5.858z"%3E%3C%2Fpath%3E%3C%2Fsvg%3E');
            background-repeat: no-repeat;
            background-position: center;
        }

        #gc-settings-button:hover {
            background-color: #EDEDF0 !important;
            opacity: 0.75 !important;
        }

        .gc-settings-menu.gc-container,
        .gc-settings-menu.close {
            display: block;
            height: 100%;
            width: 0;
            position: fixed;
            z-index: 99999;
            top: 0;
            right: 0;
            background: linear-gradient(to bottom, #cbe0ff, #cfffff);
            overflow-x: hidden;
            overflow-y: scroll;
            transition: 0.5s;
        }

        .gc-settings-menu.gc-close {
            position: absolute;
            top: -5px;
            right: 10px;
            font-size: 42px;
            margin-left: 25px;
            text-decoration: none;
        }

        .gc-settings-menu.gc-close:hover {
            color: gray;
        }

        h1.gc-title {
            font-size: 36px;
            font-weight: bold;
            margin-top: 15px;
            margin-bottom: 15px;
        }

        h2.gc-title {
            font-size: 20px;
            text-align: center;
            padding: 5px;
            margin: 10px auto 10px auto;
            border-radius: 5px;
            width: 85%;
            background-color: #2979df;
            color: white;
        }

        div.gc-setting {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin: 25px;
        }

        div.gc-setting > input[type="text"] {
            width: 85%;
            height: 30px;
            font-size: 14px;
        }

        div.gc-setting > input[type="number"] {
            width: 40%;
            height: 30px;
            font-size: 14px;
        }

        div.gc-setting > .gc-label {
            font-size: 15px;
        }

        .gc-switch {
            position: relative;
            display: inline-block;
            width: 45px;
            height: 25.5px;
          }

          .gc-switch input.gc-checkbox {
            opacity: 0;
            width: 0;
            height: 0;
          }

          .gc-slider {
            position: absolute;
            cursor: pointer;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: #ccc;
            transition: .4s;
            border-radius: 34px;
          }

          .gc-slider:before {
            position: absolute;
            content: "";
            height: 19.5px;
            width: 19.5px;
            left: 3px;
            bottom: 3px;
            background-color: white;
            transition: .4s;
            border-radius: 50%;
          }

          input.gc-checkbox:checked + .gc-slider {
            background-color: #2196F3;
          }

          input.gc-checkbox:focus + .gc-slider {
            box-shadow: 0 0 1px #2196F3;
          }

          input.gc-checkbox:checked + .gc-slider:before {
            transform: translateX(19.5px);
          }
    `);

    /* Dynamically create elements for each graphical or GUI setting */
    const gcSettingsFactory = (prop) => {

        let elementArray = [];

        for (let [key, value] of Object.entries(parsedGcSettings[prop])) {

            if (typeof value === 'boolean') {

                const settingsDiv = elementFactory(
                    'div',
                    {
                        class: 'gc-setting'
                    },
                    elementFactory(
                        'label',
                        {
                            class: 'gc-label'
                        },
                        key
                    ),
                    elementFactory(
                        'label',
                        {
                            class: 'gc-switch'
                        },
                        elementFactory(
                            'input',
                            {
                                type: 'checkbox',
                                class: 'gc-checkbox gc-input',
                                id: `gc-boolean-${key}`
                            }
                        ),
                        elementFactory(
                            'span',
                            {
                                class: 'gc-slider'
                            }
                        )
                    )
                );

                settingsDiv.lastChild.firstChild.checked = value;

                elementArray.push(settingsDiv);

            } else if (typeof value === 'number') {

                const settingsDiv = elementFactory(
                    'div',
                    {
                        class: 'gc-setting'
                    },
                    elementFactory(
                        'label',
                        {
                            class: 'gc-label'
                        },
                        key
                    ),
                    elementFactory(
                        'input',
                        {
                            type: 'number',
                            step: '0.00001',
                            class: 'gc-input',
                            id: `gc-number-${key}`
                        }
                    )
                );

                settingsDiv.lastChild.value = value;

                elementArray.push(settingsDiv);

            }

        };

        return elementArray;

    }

    const settingsButton = elementFactory(
        'button',
        {
            id: 'gc-settings-button',
            onclick: 'document.querySelector(".gc-settings-menu.gc-container").style.width = "350px"'
        }
    );

    const settingsMenu = elementFactory(
        'div',
        {
            class: 'gc-settings-menu gc-container'
        },
        elementFactory(
            'a',
            {
                class: 'gc-settings-menu gc-close',
                href: 'javascript:void(0)',
                onclick: 'document.querySelector(".gc-settings-menu.gc-container").style.width = "0px"'
            },
            '×'
        ),
        elementFactory(
            'h1',
            {
                class: 'gc-title'
            },
            'Graphics Client'
        ),
        elementFactory(
            'h2',
            {
                class: 'gc-title'
            },
            'Background Image'
        ),
        elementFactory(
            'div',
            {
                class: 'gc-setting'
            },
            elementFactory(
                'label',
                {
                    class: 'gc-label'
                },
                'URL:'
            ),
            elementFactory(
                'input',
                {
                    type: 'text',
                    class: 'gc-input',
                    value: _localStorage.gcBackgroundImage || ''
                }
            )
        ),
        elementFactory(
            'h2',
            {
                class: 'gc-title'
            },
            'Graphical'
        ),
        gcSettingsFactory('graphical'),
        elementFactory(
            'h2',
            {
                class: 'gc-title'
            },
            'GUI'
        ),
        gcSettingsFactory('gui')
    );

    document.head.append(styles);
    document.body.append(settingsButton);
    document.body.append(settingsMenu);


    /* Decrease visbility of settings button on game start */
    const observer = new MutationObserver((mutationList) => {
        for (let mutationRecord of mutationList) {
            if (mutationRecord.removedNodes) {
                for (let removedNode of mutationRecord.removedNodes) {
                    if (removedNode.id === 'startMenuWrapper') {
                        observer.disconnect();

                        settingsButton.style.backgroundColor = 'transparent',
                        settingsButton.style.opacity = 0.25;
                    }
                }
            }
        }
    });

    observer.observe(document.querySelector('.mainWrapper'), {
        childList: true,
        subtree: true
    });

    /* Listen for input and update localStorage/Arras object */
    const addInputListener = (node, prop, key, type) => {

        if (type === 'number') {

            node.addEventListener('input', () => {
                if (node.validity.valid) {
                    parsedGcSettings[prop][key] = +node['value'];
                    _localStorage.gcSettings = JSON.stringify(parsedGcSettings);
                    _Arras[prop][key] = +node['value'];
                };
            });

        } else if (type === 'boolean') {

            node.addEventListener('input', () => {
                if (node.validity.valid) {
                    parsedGcSettings[prop][key] = node['checked'];
                    _localStorage.gcSettings = JSON.stringify(parsedGcSettings);
                    _Arras[prop][key] = node['checked'];
                };
            });

        };

    }

    document.querySelectorAll('.gc-input').forEach((currentNode, index) => {

        const nodeData = currentNode.id.split('-');
        const type = nodeData[1];
        const key = nodeData[2];

        if (index === 0) {
            currentNode.addEventListener('keyup', () => {

                if (currentNode.validity.valid) {

                    _localStorage.gcBackgroundImage = currentNode.value;
                    document.body.style.background = `url(${_localStorage.gcBackgroundImage}) center / cover no-repeat`;

                };

            });
        } else if (index >= 1 && index <= 17) {

            addInputListener(currentNode, 'graphical', key, type);

        } else if (index > 17) {

            addInputListener(currentNode, 'gui', key, type);

        };

    });

    console.info('%c Graphics Client Activated','background:linear-gradient(to right,#1fa2ff,#12d8fa,#a6ffcb);color:#fff;display:block;text-shadow:0 1px 0 rgba(0,0,0,.3);text-align:center;font-weight:bold;padding:20px;font-size:24px');

})()
