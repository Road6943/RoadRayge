// ==UserScript==
// @name         RoadRayge - Arras Graphics Editor
// @namespace    https://github.com/Ray-Adams
// @version      1.3.0-alpha
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
// @grant        GM_xmlhttpRequest
// @grant        GM_getResourceText
// @grant        GM_addStyle
// @grant        GM_setClipboard
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

	.r-btn--standard {
		text-align: center;
		padding: 5px;
		margin: 10px auto 10px auto;
		border-radius: 5px;
		border-width: 0px;
		background-color: var(--slider-active);
		color: white;
		width: 75%;
	}

	/* Darken on hover */
	.r-btn--standard:hover {
		filter: brightness(85%);
	}

	#delete-theme-btn {
		background-color: #FE5605; /* red */
	}

	#theme-import-input {
		border-color: var(--slider-active);
	}

	#gallery-container {
		/* center stuff inside container */
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	/* move items closer together within container */
	#gallery-container * {
		margin: 10px;
	}

	/* make the svg text more visible and reflective of its in-game look */
	svg text {
		font-family: Ubuntu, sans-serif;
		font-size: 25px;
		font-weight: bold;
		stroke-width: 2;
		letter-spacing: -1.5px;
	}

	.gallery-divider {
		width: 90%;
		border: 1px solid var(--slider-active);
		border-radius: 5%;
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

	.r-input--color {
		width: 10%;
		padding: 1px;
	}

	.r-description {
		color: gray;
		font-style: italic;
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
const settingsFactory = (prop, settingsObj=settings) =>
	Object.entries(settingsObj[prop]).map(([key, val]) => {
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
	h('div#graphical-container',
		...settingsFactory('graphical')
	),
	h('h2.r-heading--h2', 'GUI'),
	h('div#gui-container',
		...settingsFactory('gui')
	),

	//themeColor stuff, empty at first b/c themeColor doesn't exist until game starts
	h('h2.r-heading--h2', 'Colors'),
	h('div#colors-container', 
		h('center.r-label', 'You must be in-game to use this!')
	),
	h('h2.r-heading--h2', 'Misc.'),
	h('div#misc-container', 
		h('center.r-label', 'You must be in-game to use this!')
	),
	h('h2.r-heading--h2', 'Gallery'),
	h('div#gallery-container',
		h('center.r-label', 'You must be in-game to use this!')
	)
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
function stopKeyboardPropagation() {
	document.querySelectorAll('.r-input').forEach(node => {
		node.addEventListener('keydown', e => {
			e.key !== 'Escape' && e.stopPropagation();
		});
	});
}


// Settings button visual tweaks on game start (for visibility)
(function decreaseGearButtonVisibility() {
	const startButton = document.getElementById('startButton');
	const playerNameInput = document.getElementById('optName'); // id used to be playerNameInput

	const onGameStart = () => {
		settingsButton.style.backgroundColor = 'transparent';
		settingsButton.style.opacity = 0.25;
	};

	startButton.addEventListener('click', onGameStart);
	playerNameInput.addEventListener('keydown', e => {
		if (e.key === 'Enter') onGameStart();
	});
})();


/*
** THEME COLOR STUFF WILL MOSTLY BE BELOW HERE ===========================================
*/

// allows access to certain variables at init time because functions are hoisted above var's
function HOISTED(){};

// these have to be var to avoid 'cannot access before initialization' error
var themeDetailsStorageKey = "RR_themeDetails";
var themeColorStorageKey = "RR_themeColor";
var savedThemesStorageKey = "RR_savedThemes";

// used to ensure user holds down btn for 3 seconds before the functionality actually happens
// to prevent accidental stray clicks
const buttonClickStartTime = {
	deleteTheme: Infinity,
	saveCurrentTheme: Infinity,
}

// colorNames is an array of the names of the colors in the array at Arras().themeColor.table, in the same order
// must be var to avoid 'cannot access before initialization' error
// need a hoisted version as otherwise the editor will not build on game start 
// 		(since functions are hoisted above var-variables so var's are undefined when very first func runs)
HOISTED.colorNames = ["teal","lgreen","orange","yellow","lavender","pink","vlgrey","lgrey","guiwhite","black","blue","green","red","gold","purple","magenta","grey","dgrey","white","guiblack"]
var colorNames = HOISTED.colorNames;

// quickly allows conversion between a colorName and its index in the colorNames array
const colorNameToIndex = {};
for (let i = 0; i < colorNames.length; i++) {
	const colorName = colorNames[i];
	colorNameToIndex[ colorName ] = i;
}

// colorNames and colorDescriptions CANNOT be combined because the order for colorNames is a bad description order (you shouldn't put magenta far apart from blue/green/red, etc...)
const colorDescriptions = [
	/* "Utility" stuff, not sure how to describe these */
	/* Borders -- at top since the border size selector is right above the color selectors */
	["Borders, Text Outlines, Health Bar Background"
		, "black"],
	["Map Background"
		, "white"],
	["Map Border, Grid"
		, "guiblack"],
	["Text Color"
		, "guiwhite"],
	
	/* Teams */
	["Your tank in FFA, Left team in 2TDM, Top left team in 4TDM" 
		, "blue"],
	["Enemy tanks in FFA, Bottom left team in 4TDM"
		, "red"],
	["Right team in 2TDM, Top right team in 4TDM, Score Bar"
		, "green"],
	["Bottom right team in 4TDM"
		, "magenta"],
	
	/* Shapes */
	["Rocks, Barrels, Bar Backgrounds"
		, "grey"],
	["Squares, Level Bar"
		, "gold"],
	["Triangles"
		, "orange"],
	["Pentagons, Pentagon Nest Background"
		, "purple"],
	["Crashers"
		, "pink"],
	["Eggs, Minimap Background, Invulnerability Flash"
		, "vlgrey"],

	/* Bars under tanks/shapes/bosses/etc... */
	["Main Health Bar, Rare Polygons"
		, "lgreen"],
	["Shield/Regen Bar, Rare Polygons"
		, "teal"],

	/* Extras */
	["Arena Closers, Neutral Dominators"
		, "yellow"],
	["Rogue Palisades"
		, "dgrey"],
	["Unused"
		, "lavender"],
	["Unused"
		, "lgrey"],
];

// used in case it's users first time using tiger, which means they have no saved themes yet
// see default theme authors at this link: https://discord.com/channels/372930441826533386/379175293149118465/398373439133712384
// must be var to avoid 'cannot access before initialization' error
var defaultSavedThemes = [
	{"themeDetails":{"name":"Light Colors","author":"Neph"},"config":{"graphical":{"screenshotMode":false,"borderChunk":6,"barChunk":5,"compensationScale":1.114,"lowGraphics":false,"alphaAnimations":true,"inversedRender":true,"miterStars":true,"miter":false,"fontSizeOffset":0,"shieldbars":false,"renderGrid":true,"darkBorders":false,"neon":false,"coloredNest":false},"gui":{"enabled":true,"alcoveSize":200,"spacing":20},"themeColor":{"table":["#7adbbc","#b9e87e","#e7896d","#fdf380","#b58efd","#ef99c3","#e8ebf7","#aa9f9e","#ffffff","#484848","#3ca4cb","#8abc3f","#e03e41","#efc74b","#8d6adf","#cc669c","#a7a7af","#726f6f","#dbdbdb","#000000"],"border":0.5}}}
	,
	{"themeDetails":{"name":"Dark Colors","author":"Neph"},"config":{"graphical":{"screenshotMode":false,"borderChunk":6,"barChunk":5,"compensationScale":1.114,"lowGraphics":false,"alphaAnimations":true,"inversedRender":true,"miterStars":true,"miter":false,"fontSizeOffset":0,"shieldbars":false,"renderGrid":true,"darkBorders":false,"neon":false,"coloredNest":false},"gui":{"enabled":true,"alcoveSize":200,"spacing":20},"themeColor":{"table":["#8975b7","#1ba01f","#c46748","#b2b224","#7d56c5","#b24fae","#1e1e1e","#3c3a3a","#000000","#e5e5e5","#379fc6","#30b53b","#ff6c6e","#ffc665","#9673e8","#c8679b","#635f5f","#73747a","#11110f","#ffffff"],"border":0.5}}}
	,
	{"themeDetails":{"name":"Natural","author":"Neph"},"config":{"graphical":{"screenshotMode":false,"borderChunk":6,"barChunk":5,"compensationScale":1.114,"lowGraphics":false,"alphaAnimations":true,"inversedRender":true,"miterStars":true,"miter":false,"fontSizeOffset":0,"shieldbars":false,"renderGrid":true,"darkBorders":false,"neon":false,"coloredNest":false},"gui":{"enabled":true,"alcoveSize":200,"spacing":20},"themeColor":{"table":["#76c1bb","#aad35d","#e09545","#ffd993","#939fff","#d87fb2","#c4b6b6","#7f7f7f","#ffffff","#373834","#4f93b5","#00b659","#e14f65","#e5bf42","#8053a0","#b67caa","#998f8f","#494954","#a5b2a5","#000000"],"border":0.5}}}
	,
	{"themeDetails":{"name":"Classic","author":"Neph"},"config":{"graphical":{"screenshotMode":false,"borderChunk":6,"barChunk":5,"compensationScale":1.114,"lowGraphics":false,"alphaAnimations":true,"inversedRender":true,"miterStars":true,"miter":false,"fontSizeOffset":0,"shieldbars":false,"renderGrid":true,"darkBorders":false,"neon":false,"coloredNest":false},"gui":{"enabled":true,"alcoveSize":200,"spacing":20},"themeColor":{"table":["#8efffb","#85e37d","#fc7676","#ffeb8e","#b58eff","#f177dd","#cdcdcd","#999999","#ffffff","#525252","#00b0e1","#00e06c","#f04f54","#ffe46b","#768cfc","#be7ff5","#999999","#545454","#c0c0c0","#000000"],"border":0.5}}}
	,
	/* https://discord.com/channels/372930441826533386/380128318076223489/398339465166192641 */
	{"themeDetails":{"name":"Forest","author":"Sterlon"},"config":{"graphical":{"screenshotMode":false,"borderChunk":6,"barChunk":5,"compensationScale":1.114,"lowGraphics":false,"alphaAnimations":true,"inversedRender":true,"miterStars":true,"miter":false,"fontSizeOffset":0,"shieldbars":false,"renderGrid":true,"darkBorders":false,"neon":false,"coloredNest":false},"gui":{"enabled":true,"alcoveSize":200,"spacing":20},"themeColor":{"table":["#884aa5","#8c9b3e","#d16a80","#97596d","#499855","#60294f","#ddc6b8","#7e949e","#ffffe8","#665750","#807bb6","#a1be55","#e5b05b","#ff4747","#bac674","#ba78d1","#998866","#529758","#7da060","#000000"],"border":0.5}}}
	,
	/* https://discord.com/channels/372930441826533386/380128318076223489/398358280784838656 */
	{"themeDetails":{"name":"Midnight","author":"uoiea"},"config":{"graphical":{"screenshotMode":false,"borderChunk":6,"barChunk":5,"compensationScale":1.114,"lowGraphics":false,"alphaAnimations":true,"inversedRender":true,"miterStars":true,"miter":false,"fontSizeOffset":0,"shieldbars":false,"renderGrid":true,"darkBorders":false,"neon":false,"coloredNest":false},"gui":{"enabled":true,"alcoveSize":200,"spacing":20},"themeColor":{"table":["#2b9098","#4baa5d","#345678","#cdc684","#89778e","#a85c90","#cccccc","#a7b2b7","#bac6ff","#091f28","#123455","#098765","#000013","#566381","#743784","#b29098","#555555","#649eb7","#444444","#000000"],"border":0.5}}}
	,
	/* https://discord.com/channels/372930441826533386/380128318076223489/398368953921175553 */
	{"themeDetails":{"name":"Snow","author":"Deolveopoler"},"config":{"graphical":{"screenshotMode":false,"borderChunk":6,"barChunk":5,"compensationScale":1.114,"lowGraphics":false,"alphaAnimations":true,"inversedRender":true,"miterStars":true,"miter":false,"fontSizeOffset":0,"shieldbars":false,"renderGrid":true,"darkBorders":false,"neon":false,"coloredNest":false},"gui":{"enabled":true,"alcoveSize":200,"spacing":20},"themeColor":{"table":["#89bfba","#b5d17d","#e5e0e0","#b5bbe5","#939fff","#646de5","#b2b2b2","#7f7f7f","#ffffff","#383835","#aeaeff","#aeffae","#ffaeae","#ffffff","#c3c3d8","#ffb5ff","#cccccc","#a0a0b2","#f2f2f2","#000000"],"border":0.5}}}
	,
	/* https://discord.com/channels/372930441826533386/380128318076223489/398633942661595147 */
	{"themeDetails":{"name":"Coral Reef","author":"Celesteα"},"config":{"graphical":{"screenshotMode":false,"borderChunk":6,"barChunk":5,"compensationScale":1.114,"lowGraphics":false,"alphaAnimations":true,"inversedRender":true,"miterStars":true,"miter":false,"fontSizeOffset":0,"shieldbars":false,"renderGrid":true,"darkBorders":false,"neon":false,"coloredNest":false},"gui":{"enabled":true,"alcoveSize":200,"spacing":20},"themeColor":{"table":["#76eec6","#41aa78","#ff7f50","#ffd250","#dc3388","#fa8072","#8b8886","#bfc1c2","#ffffff","#12466b","#4200ae","#0d6338","#dc4333","#fea904","#7b4bab","#5c246e","#656884","#d4d7d9","#3283bc","#000000"],"border":0.5}}}
	,
	/* https://discord.com/channels/372930441826533386/380128318076223489/398638773392375819 */
	{"themeDetails":{"name":"Badlands","author":"Incognious"},"config":{"graphical":{"screenshotMode":false,"borderChunk":6,"barChunk":5,"compensationScale":1.114,"lowGraphics":false,"alphaAnimations":true,"inversedRender":true,"miterStars":true,"miter":false,"fontSizeOffset":0,"shieldbars":false,"renderGrid":true,"darkBorders":false,"neon":false,"coloredNest":false},"gui":{"enabled":true,"alcoveSize":200,"spacing":20},"themeColor":{"table":["#f9cb9c","#f1c232","#38761d","#e69138","#b7b7b7","#78866b","#6aa84f","#b7b7b7","#a4c2f4","#000000","#0c5a9e","#6e8922","#5b0000","#783f04","#591c77","#20124d","#2f1c16","#999999","#543517","#ffffff"],"border":0.5}}}
	,
	/* https://discord.com/channels/372930441826533386/380128318076223489/398631247879995414 */
	{"themeDetails":{"name":"Bleach","author":"definitelynot."},"config":{"graphical":{"screenshotMode":false,"borderChunk":6,"barChunk":5,"compensationScale":1.114,"lowGraphics":false,"alphaAnimations":true,"inversedRender":true,"miterStars":true,"miter":false,"fontSizeOffset":0,"shieldbars":false,"renderGrid":true,"darkBorders":false,"neon":false,"coloredNest":false},"gui":{"enabled":true,"alcoveSize":200,"spacing":20},"themeColor":{"table":["#00ffff","#00ff00","#ff3200","#ffec00","#ff24a7","#ff3cbd","#fff186","#918181","#f1f1f1","#5f5f5f","#0025ff","#00ff00","#ff0000","#fffa23","#3100ff","#d4d3d3","#838383","#4c4c4c","#fffefe","#000000"],"border":0.5}}}
	,
	/* https://discord.com/channels/372930441826533386/380128318076223489/398626876249210881 */
	{"themeDetails":{"name":"Space","author":"Call"},"config":{"graphical":{"screenshotMode":false,"borderChunk":6,"barChunk":5,"compensationScale":1.114,"lowGraphics":false,"alphaAnimations":true,"inversedRender":true,"miterStars":true,"miter":false,"fontSizeOffset":0,"shieldbars":false,"renderGrid":true,"darkBorders":false,"neon":false,"coloredNest":false},"gui":{"enabled":true,"alcoveSize":200,"spacing":20},"themeColor":{"table":["#4788f3","#af1010","#ff0000","#82f850","#ffffff","#57006c","#ffffff","#272727","#000000","#7f7f7f","#0e1b92","#0aeb80","#c2b90a","#3e7e8c","#285911","#a9707e","#6f6a68","#2d0738","#000000","#ffffff"],"border":0.5}}}
	,
	/* https://discord.com/channels/372930441826533386/380128318076223489/398635479022567435 */
	{"themeDetails":{"name":"Nebula","author":"Deleted User"},"config":{"graphical":{"screenshotMode":false,"borderChunk":6,"barChunk":5,"compensationScale":1.114,"lowGraphics":false,"alphaAnimations":true,"inversedRender":true,"miterStars":true,"miter":false,"fontSizeOffset":0,"shieldbars":false,"renderGrid":true,"darkBorders":false,"neon":false,"coloredNest":false},"gui":{"enabled":true,"alcoveSize":200,"spacing":20},"themeColor":{"table":["#38b06e","#22882e","#d28e7f","#d5d879","#e084eb","#df3e3e","#f0f2cc","#7d7d7d","#c2c5ef","#161616","#9274e6","#89f470","#e08e5d","#ecdc58","#58cbec","#ea58ec","#7e5713","#303030","#555555","#ffffff"],"border":0.5}}}
	,
	{"themeDetails":{"name":"Pumpkin Skeleton","author":"Road"},"config":{"graphical":{"screenshotMode":false,"borderChunk":6,"barChunk":5,"compensationScale":1.114,"lowGraphics":false,"alphaAnimations":true,"inversedRender":true,"miterStars":true,"miter":false,"fontSizeOffset":0,"shieldbars":false,"renderGrid":true,"darkBorders":false,"neon":false,"coloredNest":false},"gui":{"enabled":true,"alcoveSize":200,"spacing":20},"themeColor":{"table":["#721970","#ff6347","#1b713a","#fdf380","#941100","#194417","#1b713a","#aa9f9e","#fed8b1","#484848","#3ca4cb","#76eec6","#f04f54","#1b713a","#1b713a","#cc669c","#ffffff","#726f6f","#ff9b58","#000000"],"border":"3.3"}}} /* Its supposed to be in quotes (Pumpkin Skeleton border) */
	,
	{"themeDetails":{"name":"Solarized Dark","author":"Road"},"config":{"graphical":{"screenshotMode":false,"borderChunk":6,"barChunk":5,"compensationScale":1.114,"lowGraphics":false,"alphaAnimations":true,"inversedRender":true,"miterStars":true,"miter":false,"fontSizeOffset":0,"shieldbars":false,"renderGrid":true,"darkBorders":false,"neon":false,"coloredNest":false},"gui":{"enabled":true,"alcoveSize":200,"spacing":20},"themeColor":{"table":["#b58900","#2aa198","#cb4b16","#657b83","#eee8d5","#d33682","#e0e2e4","#073642","#ffffff","#000000","#268bd2","#869600","#dc322f","#b58900","#678cb1","#a082bd","#839496","#073642","#002b36","#000000"],"border":0.5}}}
	,
	{"themeDetails":{"name":"Desert","author":"Road"},"config":{"graphical":{"screenshotMode":false,"borderChunk":6,"barChunk":5,"compensationScale":1.114,"lowGraphics":false,"alphaAnimations":true,"inversedRender":true,"miterStars":true,"miter":false,"fontSizeOffset":0,"shieldbars":false,"renderGrid":true,"darkBorders":false,"neon":false,"coloredNest":false},"gui":{"enabled":true,"alcoveSize":200,"spacing":20},"themeColor":{"table":["#783b31","#f5deb3","#e17d70","#dfab79","#b9a9bb","#c1938e","#a88e80","#ccb78e","#ffffff","#555555","#007ba7","#2e8b57","#e44d2e","#ddcf70","#5b968f","#856088","#989b9d","#9e8171","#ceb385","#000000"],"border":0.5}}}
	,
	{"themeDetails":{"name":"Eggplant","author":"Road"},"config":{"graphical":{"screenshotMode":false,"borderChunk":6,"barChunk":5,"compensationScale":1.114,"lowGraphics":false,"alphaAnimations":true,"inversedRender":true,"miterStars":true,"miter":false,"fontSizeOffset":0,"shieldbars":false,"renderGrid":true,"darkBorders":false,"neon":false,"coloredNest":false},"gui":{"enabled":true,"alcoveSize":200,"spacing":20},"themeColor":{"table":["#e96ba8","#78d4b6","#d6100f","#a39e9b","#e7e9db","#e96ba8","#8d8687","#2b1a29","#ffffff","#2b1a29","#06b6ef","#48b685","#ef6155","#f99b15","#815ba4","#fec418","#b9b6b0","#40113f","#50374d","#000000"],"border":0.5}}}
	,
	{"themeDetails":{"name":"Gruvbox","author":"Road"},"config":{"graphical":{"screenshotMode":false,"borderChunk":6,"barChunk":5,"compensationScale":1.114,"lowGraphics":false,"alphaAnimations":true,"inversedRender":true,"miterStars":true,"miter":false,"fontSizeOffset":0,"shieldbars":false,"renderGrid":true,"darkBorders":false,"neon":false,"coloredNest":false},"gui":{"enabled":true,"alcoveSize":200,"spacing":20},"themeColor":{"table":["#83a598","#8ec07c","#d65d0e","#d79920","#d3869b","#d3869b","#bdae93","#aa9f9e","#ebddd2","#000000","#458588","#98971a","#cc241d","#d79920","#417b58","#b16186","#928374","#000000","#282828","#000000"],"border":"0.6"}}}
	,
	{"themeDetails":{"name":"Depths","author":"Skrialik"},"config":{"graphical":{"screenshotMode":false,"borderChunk":6,"barChunk":5,"compensationScale":1.114,"lowGraphics":false,"alphaAnimations":true,"inversedRender":true,"miterStars":true,"miter":false,"fontSizeOffset":0,"shieldbars":false,"renderGrid":true,"darkBorders":false,"neon":false,"coloredNest":false},"gui":{"enabled":true,"alcoveSize":200,"spacing":20},"themeColor":{"table":["#fec700","#b51a00","#ffdbd8","#573400","#b58efd","#cde9b5","#cbf1ff","#aa9f9e","#ffffff","#000000","#002e7a","#375719","#000000","#fff2d5","#f4a4c0","#561029","#c1c1c1","#7a7a7a","#434343","#ffffff"],"border":0.7019607843137254}}}
	,

	// Theme contest winners below, except Solarized Dark and Eggplant which were already included

	{"themeDetails":{"name":"Retro","author":"Damocles"},"config":{"graphical":{"screenshotMode":false,"borderChunk":6,"compensationScale":1.114,"lowGraphics":false,"alphaAnimations":true,"inversedRender":true,"miterStars":true,"miter":false,"fontSizeOffset":0,"shieldbars":false,"renderGrid":true,"renderNames":true,"censorNames":false,"darkBorders":false,"neon":false,"alternateBorder":false,"coloredNest":false},"gui":{"enabled":true,"scale":1,"alcoveSize":200,"spacing":20,"leaderboard":true,"barChunk":5},"themeColor":{"table":["#ffff62","#06bf3b","#318e95","#937d00","#eee8d5","#e72c76","#c8d8e7","#073642","#ffffff","#000000","#2c3eb9","#efb209","#b91234","#82dfe4","#1e616a","#8b124c","#839496","#76b68b","#081e20","#000000"],"border":0.7529411764705882}}}
	,
	{"themeDetails":{"name":"Pastel","author":"Damocles"},"config":{"graphical":{"screenshotMode":false,"borderChunk":6,"compensationScale":1.114,"lowGraphics":false,"alphaAnimations":true,"inversedRender":true,"miterStars":true,"miter":false,"fontSizeOffset":0,"shieldbars":false,"renderGrid":true,"renderNames":true,"censorNames":false,"darkBorders":false,"neon":false,"alternateBorder":false,"coloredNest":false},"gui":{"enabled":true,"scale":1,"alcoveSize":200,"spacing":20,"leaderboard":true,"barChunk":5},"themeColor":{"table":["#ffff98","#8affb2","#d8b384","#ffeb76","#eee8d5","#ff8dbd","#f3f0d7","#073642","#ffffb5","#675240","#397697","#3ff7a1","#f65f64","#d2b869","#81654a","#a75299","#c1c1c1","#8da996","#f5dba7","#000000"],"border":0.7529411764705882}}}
	,
	{"themeDetails":{"name":"Discord","author":"Damocles"},"config":{"graphical":{"screenshotMode":false,"borderChunk":6,"compensationScale":1.114,"lowGraphics":false,"alphaAnimations":true,"inversedRender":true,"miterStars":true,"miter":false,"fontSizeOffset":0,"shieldbars":false,"renderGrid":true,"renderNames":true,"censorNames":false,"darkBorders":false,"neon":false,"alternateBorder":false,"coloredNest":false},"gui":{"enabled":true,"scale":1,"alcoveSize":200,"spacing":20,"leaderboard":true,"barChunk":5},"themeColor":{"table":["#d53f3f","#29b399","#ff2828","#ffeb8e","#b58eff","#ff68ff","#cdcdcd","#999999","#e0e0e0","#000000","#7289da","#43b581","#f04747","#ffe800","#5c79ff","#faa419","#999999","#545454","#1e2124","#36393e"],"border":0.7529411764705882}}}
	,
	{"themeDetails":{"name":"WR Sheet Theme","author":"alettera"},"config":{"graphical":{"screenshotMode":false,"borderChunk":6,"compensationScale":1.114,"lowGraphics":false,"alphaAnimations":true,"inversedRender":true,"miterStars":true,"miter":false,"fontSizeOffset":0,"shieldbars":false,"renderGrid":true,"renderNames":true,"censorNames":false,"darkBorders":false,"neon":false,"alternateBorder":false,"coloredNest":false},"gui":{"enabled":true,"scale":1,"alcoveSize":200,"spacing":20,"leaderboard":true,"barChunk":5},"themeColor":{"table":["#fd9827","#689168","#bb8e75","#f5deba","#9e8171","#b35757","#eae0c9","#aa9f9e","#ffffff","#795548","#6bb2bf","#68c56c","#b86358","#d8bc67","#6e78aa","#846187","#868788","#726f6f","#cbb690","#000000"],"border":0.2980392156862745}}}
	,
	{"themeDetails":{"name":"Descent","author":"Rog456"},"config":{"graphical":{"screenshotMode":false,"borderChunk":6,"compensationScale":1.114,"lowGraphics":false,"alphaAnimations":true,"inversedRender":true,"miterStars":true,"miter":false,"fontSizeOffset":0,"shieldbars":false,"renderGrid":true,"renderNames":true,"censorNames":false,"darkBorders":false,"neon":false,"alternateBorder":false,"coloredNest":false},"gui":{"enabled":true,"scale":1,"alcoveSize":200,"spacing":20,"leaderboard":true,"barChunk":5},"themeColor":{"table":["#95cecf","#ffa5ff","#bc8989","#ffffb2","#000000","#bd91c4","#7f7360","#000000","#ffffff","#000000","#ababab","#a69768","#545454","#fde7a5","#878777","#85a686","#c4bb9d","#2e2e32","#3b3b37","#000000"],"border":0}}}
	,
];


// pass in a colorName string
function updateColor(colorName, newVal) {
	// Arras() obj is the universal source of truth for themeColor

	let colorIndex = colorNameToIndex[colorName];
	// update game
	Arras().themeColor.table[colorIndex] = newVal;

	// update storage
	GM_setValue(themeColorStorageKey, JSON.stringify( Arras().themeColor ))
}

function updateBorder(newVal) {
	// Arras() obj is the universal source of truth for themeColor

	// update game
	Arras().themeColor.border = Number(newVal);

	// update storage
	GM_setValue(themeColorStorageKey, JSON.stringify( Arras().themeColor ))
}

function updateThemeDetails(prop, newVal) {
	// storage's themeDetailsStorageKey is the universal source of truth for themeDetais
	const currentThemeDetails = JSON.parse(GM_getValue(themeDetailsStorageKey));
	currentThemeDetails[prop] = newVal;
	// update storage
	GM_setValue(themeDetailsStorageKey, JSON.stringify(currentThemeDetails))
}


function addThemeToGallery(
	arrasObj = unsafeWindow.Arras(), 
	themeDetails = JSON.parse(GM_getValue(themeDetailsStorageKey))
) {
	if (!themeDetails.name) {
		themeDetails.name = "Enter Theme Name";
	}
	if (!themeDetails.author) {
		themeDetails.author = "Enter Theme Author";
	}

	const config = JSON.parse(JSON.stringify(arrasObj));
	// universal source of truth for gallery is storage's savedThemesStorageKey
	const savedThemes = JSON.parse(GM_getValue(savedThemesStorageKey));
	
	// modify savedThemes, add to start of array so it shows up on top
	savedThemes.unshift({themeDetails, config});
	
	// rerender gallery elements
	buildGallerySection(savedThemes);
	// resave to storage
	GM_setValue(savedThemesStorageKey, JSON.stringify(savedThemes));
}

function deleteThemeFromGallery(themeIndexInSavedThemes) {
	// universal source of truth for gallery is storage's savedThemesStorageKey
	const savedThemes = JSON.parse(GM_getValue(savedThemesStorageKey));
	
	// modify savedThemes
	savedThemes.splice(themeIndexInSavedThemes, 1);
	
	// rerender gallery elements
	buildGallerySection(savedThemes);
	// resave to storage
	GM_setValue(savedThemesStorageKey, JSON.stringify(savedThemes));
}


// import an external javascript file
// to import CSS, use `@resource {varToDumpCSSIn} {urlOfExternalStyleSheet}`
// then, `GM_addStyle(GM_getResouceText(varToDumpCSSIn))`
function importJS(url) {
	// you need to select "allow always for this domain" in the tampermonkey popup
	GM_xmlhttpRequest({
		method: "GET",
		url: url,
		onload(event)  {
			let scriptTag = document.createElement('script');
			scriptTag.innerText = event.responseText;
			document.head.appendChild(scriptTag);
		}
	});
}


function appendElementsToContainer(containerSelector="", elements=[], clearContainerContents) {
	// use a document fragment to append all elements at once to avoid extra re-rendering
	const fragment = new DocumentFragment();
	for (const element of elements) {
		fragment.appendChild(element);
	}

	const container = document.querySelector(containerSelector);
	if (clearContainerContents) {
		container.innerHTML = "";
	}
	container.appendChild(fragment);
}

function temporarilyChangeText(elementSelector, newText, durationInMs=3*1000) {
	const element = document.querySelector(elementSelector);
	const oldText = element.innerText;
	element.innerText = newText;
	setTimeout(() => {
		element.innerText = oldText;
	}, durationInMs);
}


function buildMiscSection(themeColorObj, themeDetailsObj) {
	// border label and input
	const borderElements = h('div.r-setting',
		h('label.r-label', 'border'),
		h('input.r-input.r-input--number', {
			type: 'number',
			step: 'any',
			value: themeColorObj.border,
			oninput () {
				updateBorder(this.value)
			}
		})
	);

	// theme name and author
	const themeDetailsElements = [
		h('div.r-setting', 
			h('label.r-label', 'Theme Name'),
			h('input.r-input.r-input--text', {
				type: 'text',
				value: themeDetailsObj.name,
				oninput () {
					updateThemeDetails('name', this.value)
				}
			})
		),
		h('div.r-setting', 
			h('label.r-label', 'Theme Author'),
			h('input.r-input.r-input--text', {
				type: 'text',
				value: themeDetailsObj.author,
				oninput () {
					updateThemeDetails('author', this.value)
				}
			})
		)
	];

	const exportThemeElements = [
		h('div.r-setting', 
			h('div.r-btn--standard#export-tiger_json-btn', {
				onclick () {
					exportTheme('TIGER_JSON');
				}
			}, 'Export Tiger Theme')
		),
		h(`div.r-setting.r-description`, 
			"Best Option. Includes everything. Only works with RoadRayge and Tiger (Theme In-Game Editor)."
		),

		h('div.r-setting', 
			h('div.r-btn--standard#export-bc-btn', {
				onclick () {
					exportTheme('backwardsCompatible');
				}
			}, 'Export Backwards-Compatible Theme')
		),
		h(`div.r-setting.r-description`, 
			"Can be used with Arras.io's custom theme input. Only has colors & border. DOES NOT INCLUDE ANY GRAPHICAL OR GUI PROPERTIES."
		)
	];

	const importThemeElements = [
		h('div.r-setting', 
			h('label.r-label', "Import Theme"),
			h('input.r-input.r-input--text#theme-import-input', {
				type: 'text',
				value: '',
				placeholder: 'Paste a theme here to import',
				oninput () {
					importTheme(this.value);
				}
			})
		),
		h(`div.r-setting.r-description`, 
			"All theme types can be imported")
	];

	const saveCurrentThemeElements = h('div.r-setting', 
		h('div.r-btn--standard#save-to-gallery-btn', {
			onmousedown () {
				buttonClickStartTime.saveCurrentTheme = performance.now();
			},
			onmouseup () {
				// perforance.now uses milliseconds, so we divide by 1000 to convert to seconds
				const timeButtonWasHeldFor = (performance.now() - buttonClickStartTime.saveCurrentTheme) / 1000;
				if (timeButtonWasHeldFor >= 3) {
					addThemeToGallery()
					temporarilyChangeText('#save-to-gallery-btn', 'Saved To Gallery!')
				}
			}
		}, 'Hold For 3s To Save Current Theme To Gallery')
	);

	
	appendElementsToContainer(
		"#misc-container", 
		[
			borderElements, 
			...themeDetailsElements, 
			saveCurrentThemeElements,
			...importThemeElements, 
			...exportThemeElements, 
		], 
		true
	);
}


// Build the section that contains the color pickers, color descriptions, border input, theme details
// using the passed-in themeColorObj and themeDetailsObj
function buildColorsSection(themeColorObj) {
	// colors labels, descriptions, and pickers
	const colorsElements = [];
	for (const [description, colorName] of colorDescriptions) {
		colorsElements.push(
			h(`div.r-setting#${colorName}-container`, 
				h(`label.r-label#${colorName}-label`, colorName),
				h(`input.r-input.r-input--color#${colorName}-picker`, {
					type: 'color',
					value: themeColorObj.table[colorNameToIndex[colorName]],
					oninput () {
						updateColor(colorName, this.value)
					}
				})
			),
			h(`div.r-setting.r-description#${colorName}-description`, 
				colorName + " is used for " + description)
		)
	}

	appendElementsToContainer(
		"#colors-container", 
		colorsElements, 
		true
	);
}


// similar to h(), but for building svg instead of html
// proper svg: https://stackoverflow.com/questions/59697767/text-not-showing-up-in-svg-element
function s(tagName, attrs={}, textContent=null) {
	const element = document.createElementNS("http://www.w3.org/2000/svg", tagName);
	for (let attr in attrs) {
		element.setAttribute(attr, attrs[attr]);
	}

	// text nodes need to be treated slightly differently
	if (textContent) {
		element.appendChild(
			document.createTextNode(textContent)
		)
	}

	return element;
}

function buildGallerySection(savedThemesArr) {
	const galleryElements = [];
	for (let idx = 0; idx < savedThemesArr.length; idx++) {
		const savedTheme = savedThemesArr[idx];
		let tcTable = savedTheme.config.themeColor.table;
		let getHex = (colorName) => tcTable[ colorNameToIndex[colorName] ];
		const sharedBarrelAttrs = { rx:5, ry:5, width:35, height:20, "stroke-width":3 };
		const sharedTankBodyAttrs = { r:20, "stroke-width":3 };

		galleryElements.push(
			h('center.r-label', 
				savedTheme.themeDetails.name
				+ ' by: ' + savedTheme.themeDetails.author
			),
			h('div.r-btn--standard#delete-theme-btn', {
				theme_index: idx,
				onmousedown () {
					buttonClickStartTime.deleteTheme = performance.now();
				},
				onmouseup (event) {
					// perforance.now uses milliseconds, so we divide by 1000 to convert to seconds
					const timeButtonWasHeldFor = (performance.now() - buttonClickStartTime.deleteTheme) / 1000;
					if (timeButtonWasHeldFor >= 3) {
						deleteThemeFromGallery( event.target.getAttribute('theme_index') )
					}
				}
			}, 'Hold For 3s To Delete Theme')
		);

		// build the theme preview
		const svg = s('svg', {
			width: '87%',
			height: '185px',
			className: 'preview',
			style: `
				background-color: ${ getHex('white') };
				stroke: ${ getHex('black') };
				stroke-width: 3;
				border-radius: 5%;
				border: 3px solid ${ getHex('black') };
			`,
		});
		// s doesn't work like h, so add functions separately
		svg.addEventListener("click", () => {
			applyTheme(savedTheme);
		});

		svg.append(
			// blue tank
			s('rect', {
				className: 'barrelsAndRocks',
				x:50, y:40, ...sharedBarrelAttrs,
				fill: getHex('grey')
			}),
			s('circle', {
				className: 'blueTeam',
				cx:50, cy:50, ...sharedTankBodyAttrs,
				fill: getHex('blue')
			}),

			// green tank
			s('rect', {
				className: 'barrelsAndRocks',
				x:215, y:40, ...sharedBarrelAttrs,
				fill: getHex('grey')
			}),
			s('circle', {
				className: 'greenTeam',
				cx:250, cy:50, ...sharedTankBodyAttrs,
				fill: getHex('green')
			}),

			// magenta tank
			s('rect', {
				className: 'barrelsAndRocks',
				x:215, y:140, ...sharedBarrelAttrs,
				fill: getHex('grey')
			}),
			s('circle', {
				className: 'magentaTeam',
				cx:250, cy:150, ...sharedTankBodyAttrs,
				fill: getHex('magenta')
			}),

			// red tank
			s('rect', {
				className: 'barrelsAndRocks',
				x:50, y:140, ...sharedBarrelAttrs,
				fill: getHex('grey')
			}),
			s('circle', {
				className: 'redTeam',
				cx:50, cy:150, ...sharedTankBodyAttrs,
				fill: getHex('red')
			}),

			s('polygon', {
				className: 'triangle',
				points: "65.5,100  100,80  100,120",
				fill: getHex('orange')
			}),
			s('polygon', {
				className: "square",
				points: "230.5,85 230.5,115 200.5,115 200.5,85",
				fill: getHex('gold')
			}),
			s('polygon', {
				className: "pentagon",
				points: "138,113  130.6,90.2  150,76.1  169.4,90.2  162,113",
				fill: getHex('purple')
			}),
			s('polygon', {
				className: "rock barrelsAndRocks",
				points: "142.1,53.7  131.15,42.75  131.15,27.25  142.1,16.3  157.6,16.1  168.55,27.25  168.55,42.75  157.6,53.7",
				fill: getHex('grey')
			}),
			s('polygon', {
				className: "crasher",
				points: "150,130 140,147.32 160,147.32",
				fill: getHex('pink')
			}),

			s('text', {
				className: "gameText",
				x:87.5, y:180,
				fill: getHex('guiwhite')
			}, 'Click To Use')
		);

		galleryElements.push(
			svg,
			h('hr.gallery-divider')
		);	

	}

	appendElementsToContainer(
		"#gallery-container",
		galleryElements,
		true
	);
}

// This function is the first one to be called after Ray's stuff runs
// 	All of my stuff launches from here
// Arras().themeColor is undefined when the player has not yet started playing the game
// thus, only create its html elements after Arras().themeColor is not undefined
var initThemeColorStuff = function() {
	// set an interval to check if themeColor exists every 1 sec, and only
	// create the theme stuff once it does and then clear the interval away
	const checkIfThemeColorExistsInterval = setInterval(() => {
		// return early is themeColor doesn't exist yet
		if ((typeof unsafeWindow.Arras().themeColor) == "undefined") {
			return;
		}

		realInitThemeColorStuff();
		clearInterval(checkIfThemeColorExistsInterval);
	}, 1*1000)

	// get a value from storage, or add it to storage if it doesn't already exist
	function getFromOrInitInStorage(storageKey, defaultVal) {
		let toReturn = JSON.parse(GM_getValue(storageKey, "null"));
		if (toReturn === null) {
			toReturn = defaultVal;
			GM_setValue(storageKey, JSON.stringify(toReturn));
		}
		return toReturn;
	}

	function realInitThemeColorStuff() {
		const themeColor = getFromOrInitInStorage(themeColorStorageKey, Arras().themeColor);
		const themeDetails = getFromOrInitInStorage(themeDetailsStorageKey, {name: '', author: ''});
		const savedThemesArr = getFromOrInitInStorage(savedThemesStorageKey, defaultSavedThemes);

		// apply the saved theme, and build the ui in the process
		applyTheme({themeDetails, config: {...settings, themeColor}});
		buildGallerySection(savedThemesArr);
	}
}


// export a theme as either a 'tiger' theme (using json format) or 'arras' theme (json format, only contains themeColor changes)
function exportTheme(
	type, 
	arrasObj = unsafeWindow.Arras(), 
	themeDetailsObj = JSON.parse(GM_getValue(themeDetailsStorageKey))
) {
	var themeToExport = {};

	// 'tiger' themes are purposefully incompatible with 'arras' themes because we don't want people who are not familiar with tiger
	// to become confused why a theme they got/found from someone else doesn't seem to work properly 
	// (as the default arras custom theme input would only change colors and border, not any of the other graphical/gui properties)
	// tiger themes look like this:
	// TIGER_JSON{/* valid JSON */}
	// this way it'll be easy in the future if we want to add in extra theme types like TIGER_BASE64/* valid base64 */ or TIGER_XML</* valid XML */>
	if (type === 'TIGER_JSON') {
		themeToExport = {
			themeDetails: themeDetailsObj,
			config: arrasObj,
		};

		themeToExport = 'TIGER_JSON' + JSON.stringify(themeToExport);
		temporarilyChangeText("#export-tiger_json-btn", "Copied To Clipboard!");
	}
	else if (type === 'backwardsCompatible') {
		themeToExport = {
			name: themeDetailsObj.name,
			author: themeDetailsObj.author,
			content: {},
		};

		for (let colorName of colorNames) {
			let tcTable = arrasObj.themeColor.table;
			let colorIndex = colorNameToIndex[colorName];
			themeToExport.content[colorName] = tcTable[colorIndex];
		}

		themeToExport = JSON.stringify(themeToExport);
		temporarilyChangeText("#export-bc-btn", "Copied To Clipboard!");
	}
	else {
		console.log('unsupported export theme type');
		return;
	}

	// copy to clipboard
	GM_setClipboard(themeToExport);

	console.log('Exported the following theme:');
	console.log(themeToExport);
}

// takes in a themeObj, and changes the games visual properties using it
// themeObj is basically the same format as Arras()
// be careful not to simply assign this.config to a new object, 
// because that will remove it being a reference to the actual game's Arras() object
// similarly, you can only directly change the atomic properties + arrays (not objects)
function applyTheme(themeObj) {
	// this function will create a new identical theme to remove reference to original theme object
	// this prevents future theme modifications from screwing with the original theme
	var newTheme = JSON.parse( JSON.stringify(themeObj) );

	// theme details
	for (let [key,val] of Object.entries(newTheme.themeDetails)) {
		updateThemeDetails(key, val)
	}

	const { config } = newTheme;
	
	// apply settings to game's Arras() obj
	for (let prop in config) {
		if (prop === "themeColor") {
			updateBorder(config.themeColor.border);
			// colors
			let tcTable = config.themeColor.table;
			for (let i = 0; i < tcTable.length; i++) {
				updateColor(HOISTED.colorNames[i], tcTable[i]);
			}

		// graphical, gui
		} else { 
			for (let [key,val] of Object.entries(config[prop])) {
				update(prop, key, val);
			}
		}
	}

	// change controls in RoadRayge by re-rendering ui
	appendElementsToContainer(
		"#graphical-container", 
		settingsFactory("graphical", unsafeWindow.Arras()),
		true
	);
	appendElementsToContainer(
		"#gui-container",
		settingsFactory("gui", unsafeWindow.Arras()),
		true
	);
	buildMiscSection(
		unsafeWindow.Arras().themeColor, 
		JSON.parse(GM_getValue(themeDetailsStorageKey))
	);
	buildColorsSection(unsafeWindow.Arras().themeColor);

	// run this only after themeColor stuff is made 
	// or else it won't affect themeColor stuff
	stopKeyboardPropagation();
}


// supports both types of arras themes as well as the new TIGER_JSON theme type
// this function only converts an imported theme string into a js object mirroring this.config/the game's Arras() object
// but importTheme calls a different function (applyTheme) that will take in a theme obj and change the game's visual properties
function importTheme(themeToImport) {
	themeToImport = themeToImport.trim();

	if (themeToImport === '') {
		console.log('no theme provided for import')
		return;
	}

	// Tiger themes start with TIGER, and then _<datatype>, e.g. TIGER_JSON{valid json here}
	if (themeToImport.startsWith('TIGER')) {
		if (themeToImport.startsWith('TIGER_JSON')) {
			// remove TIGER_JSON from start of string
			themeToImport = themeToImport.substring( 'TIGER_JSON'.length );
			themeToImport = JSON.parse(themeToImport);
		}
		else {
			console.log('invalid tiger theme format')
		}
	}
	// standard arras theme, either base64 or normal JSON
	// use functions provided by CX to handle these
	else {
		themeToImport = parseArrasTheme(themeToImport);

		var newTheme = {
			themeDetails: {
				name: themeToImport.name,
				author: themeToImport.author,
			},
			config: {
				themeColor: {
					border: themeToImport.content.border,
					table: [],
				},
			},
		}

		// add colors
		for (var colorName of colorNames) {
			var importedColorNameValue = themeToImport.content[colorName];
			(newTheme.config.themeColor.table).push( importedColorNameValue );
		}

		// put the correctly formatted js object back into the themeToImport variable
		// to match the other branches of the if statement
		themeToImport = newTheme;
	}

	/* At this point, themeToImport should contain a js object mirroring the structure of this.config */
	console.log('Imported Theme has been parsed as:');
	console.log(themeToImport)

	// clear the import theme textarea
	document.querySelector("#theme-import-input").value = "";

	// use the js object to change the game's colors
	applyTheme(themeToImport);
}

// Thank you to CX for providing this:
// converts standard arras themes (BOTH base64 and JSON) into a JSON object,
// in the same format as the standard arras JSON themes { name: "", author: "", content: {} }
function parseArrasTheme(string){
	// Compact Base64 Theme Format
	// - stored as a regular base64 string without trailing equal signs
	// name + \0 + author + \0 + border byte + (RGB colors)*

	try {
	let stripped = string.replace(/\s+/g, '')
	if (stripped.length % 4 == 2)
		stripped += '=='
	else if (stripped.length % 4 == 3)
		stripped += '='
	let data = atob(stripped)

	let name = 'Unknown Theme', author = ''
	let index = data.indexOf('\x00')
	if (index === -1) return null
	name = data.slice(0, index) || name
	data = data.slice(index + 1)
	index = data.indexOf('\x00')
	if (index === -1) return null
	author = data.slice(0, index) || author
	data = data.slice(index + 1)
	let border = data.charCodeAt(0) / 0xff
	data = data.slice(1)
	let paletteSize = Math.floor(data.length / 3)
	if (paletteSize < 2) return null
	let colorArray = []
	for (let i = 0; i < paletteSize; i++) {
		let red = data.charCodeAt(i * 3)
		let green = data.charCodeAt(i * 3 + 1)
		let blue = data.charCodeAt(i * 3 + 2)
		let color = (red << 16) | (green << 8) | blue
		colorArray.push('#' + color.toString(16).padStart(6, '0'))
	}
	let content = {
		teal:     colorArray[0],
		lgreen:   colorArray[1],
		orange:   colorArray[2],
		yellow:   colorArray[3],
		lavender: colorArray[4],
		pink:     colorArray[5],
		vlgrey:   colorArray[6],
		lgrey:    colorArray[7],
		guiwhite: colorArray[8],
		black:    colorArray[9],

		blue:     colorArray[10],
		green:    colorArray[11],
		red:      colorArray[12],
		gold:     colorArray[13],
		purple:   colorArray[14],
		magenta:  colorArray[15],
		grey:     colorArray[16],
		dgrey:    colorArray[17],
		white:    colorArray[18],
		guiblack: colorArray[19],

		paletteSize,
		border,
	}
	return { name, author, content }
	} catch (e) {}
	try {
	let output = JSON.parse(string)
	if (typeof output !== 'object')
		return null
	let { name = 'Unknown Theme', author = '', content } = output

	for (let colorHex of [
		content.teal,
		content.lgreen,
		content.orange,
		content.yellow,
		content.lavender,
		content.pink,
		content.vlgrey,
		content.lgrey,
		content.guiwhite,
		content.black,

		content.blue,
		content.green,
		content.red,
		content.gold,
		content.purple,
		content.magenta,
		content.grey,
		content.dgrey,
		content.white,
		content.guiblack,
	]) {
		if (!/^#[0-9a-fA-F]{6}$/.test(colorHex))
		return null
	}

	return {
		isJSON: true,
		name: (typeof name === 'string' && name) || 'Unknown Theme',
		author: (typeof author === 'string' && author) || '',
		content,
	}
	} catch (e) {}

	return null
} 



// ThemeColor Stuff Launches From Here
initThemeColorStuff();
