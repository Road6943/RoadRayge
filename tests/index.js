// v1.1.2-alpha

'use strict';

const arras = window.Arras();
localStorage.gcSettings = localStorage.gcSettings || JSON.stringify(arras);
let parsedGcSettings = JSON.parse(localStorage.gcSettings);

// Apply localStorage settings
Object.keys(parsedGcSettings).forEach(prop => {
	for (let [key, value] of Object.entries(parsedGcSettings[prop])) {
		arras[prop][key] = value;
	}
});

if (localStorage.gcBackgroundImage) {
	document.body.style.background = `url(${localStorage.gcBackgroundImage}) center / cover no-repeat`;
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

// Dynamically create elements for each graphical or GUI setting
const gcSettingsFactory = (prop) => {
	let elementArray = [];

	for (let [key, value] of Object.entries(parsedGcSettings[prop])) {
		if (typeof value === 'boolean') {
			const settingsDiv = h(
				'div',
				{
					class: 'gc-setting'
				},
				h(
					'label',
					{
						class: 'gc-label'
					},
					key
				),
				h(
					'label',
					{
						class: 'gc-switch'
					},
					h(
						'input',
						{
							type: 'checkbox',
							class: 'gc-checkbox gc-input',
							id: `gc-boolean-${key}`
						}
					),
					h(
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
			const settingsDiv = h(
				'div',
				{
					class: 'gc-setting'
				},
				h(
					'label',
					{
						class: 'gc-label'
					},
					key
				),
				h(
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
	}

	return elementArray;
};

const settingsButton = h(
	'button',
	{
		id: 'gc-settings-button',
		onclick: 'document.querySelector(".gc-settings-menu.gc-container").style.width = "350px"'
	}
);

const settingsMenu = h(
	'div',
	{
		class: 'gc-settings-menu gc-container'
	},
	h(
		'a',
		{
			class: 'gc-settings-menu gc-close',
			href: 'javascript:void(0)',
			onclick: 'document.querySelector(".gc-settings-menu.gc-container").style.width = "0px"'
		},
		'×'
	),
	h(
		'h1',
		{
			class: 'gc-title'
		},
		'Graphics Client'
	),
	h(
		'h2',
		{
			class: 'gc-title'
		},
		'Background Image'
	),
	h(
		'div',
		{
			class: 'gc-setting'
		},
		h(
			'label',
			{
				class: 'gc-label'
			},
			'URL:'
		),
		h(
			'input',
			{
				type: 'text',
				class: 'gc-input',
				value: localStorage.gcBackgroundImage || ''
			}
		)
	),
	h(
		'h2',
		{
			class: 'gc-title'
		},
		'Graphical'
	),
	...gcSettingsFactory('graphical'),
	h(
		'h2',
		{
			class: 'gc-title'
		},
		'GUI'
	),
	...gcSettingsFactory('gui')
);

document.body.append(settingsButton);
document.body.append(settingsMenu);

// Listen for input and update localStorage & Arras object
const addInputListener = (node, prop, key, type) => {
	if (type === 'number') {
		node.addEventListener('input', () => {
			if (node.validity.valid) {
				parsedGcSettings[prop][key] = Number(node['value']);
				localStorage.gcSettings = JSON.stringify(parsedGcSettings);
				arras[prop][key] = Number(node['value']);
			}
		});
	} else if (type === 'boolean') {
		node.addEventListener('input', () => {
			if (node.validity.valid) {
				parsedGcSettings[prop][key] = node['checked'];
				localStorage.gcSettings = JSON.stringify(parsedGcSettings);
				arras[prop][key] = node['checked'];
			}
		});
	}
};

/* 
 *  Custom inputs are ones that aren't provided by the Arras()
 *  object, and are included by this script's authors.
 *  Currently, there is just 1 - Custom Background Image.
 */
const numCustomInputs = 1;
const numGraphicalInputs = Object.keys(arras.graphical).length;
const numGuiInputs = Object.keys(arras.gui).length;

// Last indices for their respective sections
const graphicalEndIndex = numGraphicalInputs + numCustomInputs - 1;
const guiEndIndex = numGuiInputs + graphicalEndIndex;

document.querySelectorAll('.gc-input').forEach((currentNode, index) => {
	const nodeData = currentNode.id.split('-');
	const type = nodeData[1];
	const key = nodeData[2];

	// First input is background image
	if (index === 0) {
		currentNode.addEventListener('keyup', () => {
			if (currentNode.validity.valid) {
				localStorage.gcBackgroundImage = currentNode.value;
				document.body.style.background = `url(${localStorage.gcBackgroundImage}) center / cover no-repeat`;
			}
		});

	// Graphical Inputs
	} else if (index <= graphicalEndIndex) {
		addInputListener(currentNode, 'graphical', key, type);

	// GUI Inputs
	} else if (index <= guiEndIndex) {
		addInputListener(currentNode, 'gui', key, type);
	}
});

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
