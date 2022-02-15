// STYLES SHOULD ONLY BE IN `STYLE.CSS`
// v1.2.1-alpha

const arras = unsafeWindow.Arras();
const clone = JSON.parse(JSON.stringify(arras));
const settings = GM_getValue('settings', clone);
const backgroundImage = GM_getValue('backgroundImage');

// Set and apply Arras() setting
const update = (prop, key, val) => {
	settings[prop][key] = val;
	GM_setValue('settings', settings);
	arras[prop][key] = val;
};

// Apply all Arras() settings
Object.keys(settings).forEach((prop) => {
	for (let [key, val] of Object.entries(settings[prop])) {
		arras[prop][key] = val;
	}
});

// Apply background image on start menu
if (backgroundImage) {
	let style = `url(${backgroundImage}) center / cover no-repeat`;
	document.body.style.background = style;
}

/*
 *  Source: https://gist.github.com/Ray-Adams/8c9a5ae29284f71c5a325b16aff510fc
 *  Simple hyperscript implementation
 */
const h = (tag, attrs, ...children) => {
	const el = document.createElement(tag);

	if (typeof attrs === 'string' || attrs instanceof Node) {
		children.unshift(attrs);
	} else {
		for (let attr in attrs) el.setAttribute(attr, attrs[attr]);
	}

	children.forEach(child => el.append(child));
	return el;
};

// Dynamically create elements for each Arras() setting
const settingsFactory = (prop) =>
	Object.entries(settings[prop]).map(([key, val]) => {
		let input;

		const watchInput = (node, isCheckbox = true) => {
			node.addEventListener('input', () => {
				if (!node.validity.valid) return;

				const newVal = isCheckbox ? node.checked : Number(node.value);
				update(prop, key, newVal);
			});
		};

		if (typeof val === 'boolean') {
			let checkbox;

			input = h('label', { class: 'gc-switch' },
				checkbox = h('input', {
					type: 'checkbox',
					class: 'gc-checkbox gc-input',
				}),
				h('span', { class: 'gc-slider' })
			);

			checkbox.checked = val;
			watchInput(checkbox);
		} else if (typeof val === 'number') {
			input = h('input', {
				type: 'number',
				step: '0.00001',
				class: 'gc-input',
			});

			input.value = val;
			watchInput(input, false);
		}

		return h('div', { class: 'gc-setting' },
			h('label', { class: 'gc-label' }, key),
			input
		);
	});

const settingsButton = h('button', { id: 'gc-settings-button' });
settingsButton.addEventListener('click', () => {
	document.querySelector('.gc-settings-menu.gc-container').style.width = '350px';
});

const closeButton = h('a', { class: 'gc-settings-menu gc-close' }, '×');
closeButton.addEventListener('click', () => {
	document.querySelector('.gc-settings-menu.gc-container').style.width = '0px';
});

const backgroundImageInput = h('input', { 
	type: 'text',
	class: 'gc-input',
	value: backgroundImage || ''
});
backgroundImageInput.addEventListener('input', () => {
	GM_setValue('backgroundImage', backgroundImageInput.value);
	document.body.style.background = `url(${backgroundImageInput.value}) center / cover no-repeat`;
});

const settingsMenu = h('div', { class: 'gc-settings-menu gc-container' },
	closeButton,
	h('h1', { class: 'gc-title' }, 'Graphics Client'),
	h('h2', { class: 'gc-title' }, 'Background Image'),
	h('div', { class: 'gc-setting' },
		h('label', { class: 'gc-label' }, 'URL:'),
		backgroundImageInput
	),
	h('h2', { class: 'gc-title' }, 'Graphical'),
	...settingsFactory('graphical'),
	h('h2', { class: 'gc-title' }, 'GUI'),
	...settingsFactory('gui')
);

document.head.append(styles);
document.body.append(settingsButton, settingsMenu);

/************************************************************************

                                  MODULES

 ************************************************************************/

// All code added below here will be wrapped in IIFE's or classes to allow for modularization and cleaner code separation

// Adds extra ways to close the container, such as with the esc key or by clicking outside the container
(function containerClosingIIFE() {
	// Relates to the stuff that we'd want to hide when the 'x' button is clicked
	// The container is essentially the visual parts of RoadRayge minus the gear/x button
	const containerCssSelector = '.gc-settings-menu.gc-container';
	const containerElement = document.querySelector(containerCssSelector);

	// closeContainer is taken from an onclick event string in the code above
	const closeContainer = () => containerElement.style.width = '0px';
	const isContainerOpen = () => (containerElement.style.width !== '0px');

	// Close container when esc key pressed
	document.addEventListener('keydown', e => {
		if (e.key === 'Escape') {
			closeContainer();
		}
	});

	// Close container when click detected outside the window
	document.addEventListener('click', e => {
		const gameAreaWrapper = document.querySelector('div.gameAreaWrapper');
		if (isContainerOpen() && gameAreaWrapper.contains(e.target)) {
			closeContainer();
		}
	});
})();

// Prevents keyboard input in the container from interfering with the game's controls
// for example, typing 'e' in the container shouldn't toggle autofire and typing 'wasd' shouldn't move your tank
(function stopKeyboardPropagation() {
	document.querySelectorAll('.gc-input').forEach((currentNode) => {
		currentNode.addEventListener('keydown', e => {
			e.stopPropagation();
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
