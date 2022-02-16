// ==UserScript==
// @name         RoadRayge - Arras Graphics Editor
// @namespace    https://github.com/Ray-Adams
// @version      1.2.4-alpha
// @description  Fully customizable theme and graphics editor for arras.io
// @author       Ray Adams & Road
// @match        *://arras.io/*
// @match        *://arras.netlify.app/*
// @homepageURL  https://github.com/Road6943/RoadRayge
// @supportURL   https://github.com/Road6943/RoadRayge/issues
// @run-at       document-end
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @grant        unsafeWindow
// @license      MIT
// ==/UserScript==

const arras = unsafeWindow.Arras();
const clone = JSON.parse(JSON.stringify(arras));
const settings = GM_getValue('settings', clone);
const backgroundImage = GM_getValue('backgroundImage');

// Set and apply an `Arras()` setting
const update = (prop, key, val) => {
	settings[prop][key] = val;
	GM_setValue('settings', settings);
	arras[prop][key] = val;
};

// Apply all `Arras()` settings
for (let prop in settings) {
	Object.entries(settings[prop]).forEach(([key, val]) => {
		arras[prop][key] = val;
	});
}

// Apply background image on start page
if (backgroundImage) {
	let style = `url(${backgroundImage}) center / cover no-repeat`;
	document.body.style.background = style;
}

/*
 *  Source: https://gist.github.com/Ray-Adams/8c9a5ae29284f71c5a325b16aff510fc
 *  Versatile hyperscript implementation
 */
const h = (query, attrs, ...children) => {
	let el, classes = [];

	query.split(/([#.])/).forEach((e, i, arr) => {
		if (i === 0) {
			el = document.createElement(e);
		} else if (e === '#') {
			el.id = arr[++i];
		} else if (e === '.') {
			classes.push(arr[++i]);
		}
	});
	if (classes.length) el.className = classes.join(' ');

	if (typeof attrs === 'string' || attrs instanceof Node) {
		children.unshift(attrs);
	} else if (typeof attrs === 'object') {
		Object.entries(attrs).forEach(([key, val]) => {
			if (key.startsWith('on')) {
				return el.addEventListener(key.slice(2), val.bind(el));
			}
			el.setAttribute(key, val);
		});
	}

	children.forEach(child => el.append(child));
	return el;
};

/************************************************************************

                                    CSS

 ************************************************************************/

GM_addStyle(`
	:root {
		--cog-svg: url('data:image/svg+xml,%3Csvg xmlns%3D"http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg" fill%3D"%23505050" viewBox%3D"0 0 16 16" width%3D"20" height%3D"20"%3E%3Cpath d%3D"M9.405 1.05c-.413-1.4-2.397-1.4-2.81 0l-.1.34a1.464 1.464 0 0 1-2.105.872l-.31-.17c-1.283-.698-2.686.705-1.987 1.987l.169.311c.446.82.023 1.841-.872 2.105l-.34.1c-1.4.413-1.4 2.397 0 2.81l.34.1a1.464 1.464 0 0 1 .872 2.105l-.17.31c-.698 1.283.705 2.686 1.987 1.987l.311-.169a1.464 1.464 0 0 1 2.105.872l.1.34c.413 1.4 2.397 1.4 2.81 0l.1-.34a1.464 1.464 0 0 1 2.105-.872l.31.17c1.283.698 2.686-.705 1.987-1.987l-.169-.311a1.464 1.464 0 0 1 .872-2.105l.34-.1c1.4-.413 1.4-2.397 0-2.81l-.34-.1a1.464 1.464 0 0 1-.872-2.105l.17-.31c.698-1.283-.705-2.686-1.987-1.987l-.311.169a1.464 1.464 0 0 1-2.105-.872l-.1-.34zM8 10.93a2.929 2.929 0 1 1 0-5.86 2.929 2.929 0 0 1 0 5.858z"%3E%3C%2Fpath%3E%3C%2Fsvg%3E');
		--gradient: linear-gradient(to bottom, #cbe0ff, #cfffff);
		--slider-active: #2196F3;
	}

	#r-btn--open {
		height: 30px;
		width: 30px;
		position: fixed;
		top: 10px;
		right: 10px;
		border: none;
		display: inline-block;
		opacity: 0.75;
		background: white var(--cog-svg) no-repeat center;
	}

	#r-btn--open::hover {
		background-color: #EDEDF0;
		opacity: 0.75;
	}

	.r-btn--close {
		position: absolute;
		top: -5px;
		right: 10px;
		font-size: 42px;
		margin-left: 25px;
		text-decoration: none;
	}

	.r-btn--close:hover {
		color: gray;
	}

	#r-container {
		display: block;
		height: 100%;
		width: 0;
		position: fixed;
		z-index: 99999;
		top: 0;
		right: 0;
		background: var(--gradient);
		overflow: hidden scroll;
		transition: 0.5s;
	}

	.r-heading--h1 {
		font-size: 32px;
		font-weight: bold;
		margin: 15px auto;
	}

	.r-heading--h2 {
		font-size: 20px;
		text-align: center;
		padding: 5px;
		margin: 10px auto 10px auto;
		border-radius: 5px;
		width: 85%;
		background-color: #2979df;
		color: white;
	}

	.r-setting {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin: 25px;
		height: 30px;
	}

	.r-input--text {
		width: 85%;
		font-size: 14px;
	}

	.r-input--number {
		width: 40%;
		height: 30px;
		font-size: 14px;
	}

	.r-input--checkbox {
		opacity: 0;
		width: 0;
		height: 0;
	}

	.r-label {
		font-size: 15px;
	}

	.r-switch {
		position: relative;
		display: inline-block;
		width: 45px;
		height: 25.5px;
	}

	.r-slider {
		position: absolute;
		cursor: pointer;
		inset: 0;
		background-color: #ccc;
		transition: .4s;
		border-radius: 34px;
	}

	.r-slider::before {
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

	.r-input--checkbox:checked + .r-slider {
		background-color: var(--slider-active);
	}

	.r-input--checkbox:focus + .r-slider {
		box-shadow: 0 0 1px var(--slider-active);
	}

	.r-input--checkbox:checked + .r-slider::before {
		transform: translateX(19.5px);
	}
`);

/************************************************************************

                               USER INTERFACE

 ************************************************************************/

// Dynamically create elements for each `Arras()` setting
const settingsFactory = (prop) =>
	Object.entries(settings[prop]).map(([key, val]) => {
		let input;

		const onInput = function () {
			if (!this.validity.valid) return;

			const newVal = this.type === 'checkbox' ? this.checked : Number(this.value);
			update(prop, key, newVal);
		};

		if (typeof val === 'boolean') {
			let checkbox;

			input = h('label.r-switch',
				checkbox = h(
					'input.r-input.r-input--checkbox',
					{ type: 'checkbox', oninput: onInput }
				),
				h('span.r-slider')
			);

			checkbox.checked = val;
		} else if (typeof val === 'number') {
			input = h('input.r-input.r-input--number', {
				type: 'number',
				step: '0.00001',
				oninput: onInput
			});

			input.value = val;
		}

		return h('div.r-setting',
			h('label.r-label', key),
			input
		);
	});

const settingsButton = h('button#r-btn--open', {
	onclick () {
		this.nextSibling.style.width = '350px';
	}
});

const closeButton = h('a.r-btn--close', {
	onclick () {
		this.parentNode.style.width = '0px';
	}
}, '×');

const backgroundImageInput = h('input.r-input.r-input--text', { 
	type: 'text',
	value: backgroundImage || '',
	oninput () {
		GM_setValue('backgroundImage', this.value);
		document.body.style.background = `url(${this.value}) center / cover no-repeat`;
	}
});

const container = h('div#r-container',
	closeButton,
	h('h1.r-heading--h1', 'RoadRayge Editor'),
	h('h2.r-heading--h2', 'Background Image'),
	h('div.r-setting',
		h('label.r-label', 'URL:'),
		backgroundImageInput
	),
	h('h2.r-heading--h2', 'Graphical'),
	...settingsFactory('graphical'),
	h('h2.r-heading--h2', 'GUI'),
	...settingsFactory('gui')
);

document.body.append(settingsButton, container);

/************************************************************************

                                  MODULES

 ************************************************************************/

// All code added below here will be wrapped in IIFE's or classes to allow for modularization and cleaner code separation

// Adds extra ways to close the container, such as with the esc key or by clicking outside the container
(function containerClosingIIFE() {
	// closeContainer is taken from an onclick event string in the code above
	const closeContainer = () => container.style.width = '0px';
	const isContainerOpen = () => (container.style.width !== '0px');

	// Close container when esc key pressed
	document.addEventListener('keydown', e => {
		if (e.key === 'Escape') closeContainer();
	});

	const gameAreaWrapper = document.querySelector('div.gameAreaWrapper');

	// Close container when click detected outside the window
	document.addEventListener('click', e => {
		if (isContainerOpen() && gameAreaWrapper.contains(e.target)) {
			closeContainer();
		}
	});
})();

// Prevents keyboard input in the container from interfering with the game's controls
// for example, typing 'e' in the container shouldn't toggle autofire and typing 'wasd' shouldn't move your tank
(function stopKeyboardPropagation() {
	document.querySelectorAll('.r-input').forEach(node => {
		node.addEventListener('keydown', e => {
			e.key !== 'Escape' && e.stopPropagation();
		});
	});
})();

// Settings button visual tweaks on game start (for visibility)
(function decreaseGearButtonVisibility() {
	const startButton = document.getElementById('startButton');
	const playerNameInput = document.getElementById('playerNameInput');

	const onGameStart = () => {
		settingsButton.style.backgroundColor = 'transparent';
		settingsButton.style.opacity = 0.25;
	};

	startButton.addEventListener('click', onGameStart);
	playerNameInput.addEventListener('keydown', e => {
		if (e.key === 'Enter') onGameStart();
	});
})();
