// ==UserScript==
// @name         RoadRayge - Arras Graphics Editor
// @namespace    https://github.com/Ray-Adams
// @version      1.4.3-alpha
// @description  Fully customizable theme and graphics editor for arras.io
// @author       Ray Adams & Road
// @match        *://arras.io/*
// @match        *://arras.netlify.app/*
// @homepageURL  https://github.com/Road6943/RoadRayge
// @supportURL   https://github.com/Road6943/RoadRayge/issues
// @run-at       document-end
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM_addStyle
// @grant        GM.setClipboard
// @license      MIT
// ==/UserScript==

async function main() {
	const arras = Arras();
	const clone = JSON.parse(JSON.stringify(arras));
	const settings = await GM.getValue('settings', clone);
	const backgroundImage = await GM.getValue('backgroundImage');

	// Adding cursor customization similar to bg image stuff
	const cursorStyleStorageKey = 'RR_cursor';
	const getCursorStyle = async () => (await GM.getValue(cursorStyleStorageKey, 'auto'));

	// Set and apply an `Arras()` setting
	const update = async (prop, key, val) => {
		settings[prop][key] = val;
		await GM.setValue('settings', settings);
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
	// Apply cursor style on start page
	await applyCursorStyle(); 
	// Since textarea's don't load with a default value, set it here
	let cursorStyleTextareaValueInterval = setInterval(async () => {
		let cursorStyleTextarea = document.querySelector('#cursor-import-textarea');
		if (cursorStyleTextarea) {
			cursorStyleTextarea.value = await getCursorStyle();
			clearInterval(cursorStyleTextareaValueInterval);
		}
	}, 1*1000);

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

		/* like #cursor-import-textarea */
		textarea {
			border-color: var(--slider-active);
			width: 85%;
			font-size: 14px;
			border-radius: 5px;
			margin-left: 10px;
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

		#filter-themes-description {
			margin: 25px;
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

			const onInput = async function () {
				if (!this.validity.valid) return;

				const newVal = this.type === 'checkbox' ? this.checked : Number(this.value);
				await update(prop, key, newVal);
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
		async onclick () {
			this.nextSibling.style.width = '350px';
			await applyCursorStyle();
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
		async oninput () {
			await GM.setValue('backgroundImage', this.value);
			document.body.style.background = `url(${this.value}) center / cover no-repeat`;
		}
	});

	// Applies the given cursorStyle to all the necessary elements
	async function applyCursorStyle(cursorStyle) {
		// can't do this in default parameter value
		if (!cursorStyle) {
			cursorStyle = await getCursorStyle();
		}
		
		/* handle cursor.cc html inputs */
		// remove everything before "url"
		let startIndex = cursorStyle.indexOf("url");
		// if not present, start at very beginning
		if (startIndex === -1) {
			startIndex = 0;
		}
		// remove the last ; and everything after it
		let endIndex = cursorStyle.lastIndexOf(";");
		if (endIndex === -1) {
			endIndex = cursorStyle.length;
		}
		cursorStyle = cursorStyle.substring(startIndex, endIndex); 

		// given an element, checks if it exists and applys cursor style if so
		const acsHelper = elem => { if (elem) {elem.style.cursor = cursorStyle;} }
		
		// roadrayge container
		acsHelper(document.querySelector('#r-container'))
		// roadrayge labels
		document.querySelectorAll('.r-label').forEach(acsHelper);
		// if on arras landing page, modify cursor for these elements
		acsHelper(document.querySelector('.startMenu')); // the central start menu
		acsHelper(document.querySelector('.menuTabs')); // small bar above start menu
		// landing page background + in-game everything
		acsHelper(document.querySelector('iframe#game')?.contentDocument.body);
	}

	// Has to be a textarea since some cursor style lengths exceed the max text input length
	const cursorStyleInput = h('textarea.r-input.r-input--text#cursor-import-textarea', {
		type: 'text',
		list: 'cursorStyleList',
		placeholder: 'Enter a cursor style like crosshair',
		value: (await getCursorStyle()),
		async oninput () {
			await GM.setValue(cursorStyleStorageKey, this.value);
			await applyCursorStyle(this.value);
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
		h('h2.r-heading--h2', 'Cursor'),
		h('div.r-setting',
			h('label.r-label', 'Cursor Style'),
			cursorStyleInput
		),
		h(`a.r-setting.r-description`, {
			href: "https://github.com/Road6943/RoadRayge/blob/main/notes/cursor-info.md",
			target: "_blank", // opens in new tab
			rel: "noopener noreferrer",
		},
			"Click To Learn More!"
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

	// Close container when you click outside of it
	(function addCloseContainerEventHandlers() {
		function addEventHandlers(element) {
			const container = document.querySelector('#r-container');

			// closeContainer is taken from an onclick event string in the code above
			const closeContainer = () => {container.style.width = '0px'};
			const isContainerOpen = () => (container.style.width !== '0px');

			// Close container when click detected outside the window
			element.addEventListener('click', e => {
				if (isContainerOpen() && !container.contains(e.target)) {
					closeContainer();
				}
			});
		}

		const gameScreen = document.querySelector('#game')?.contentDocument;	
		if (gameScreen) {
			addEventHandlers(gameScreen);
		}
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
	var filterQueryStorageKey = "RR_filterQuery";

	// used to ensure user holds down btn for 3 seconds before the functionality actually happens
	// to prevent accidental stray clicks
	const buttonClickStartTime = {
		deleteTheme: Infinity,
		saveCurrentTheme: Infinity,
		swapColors: Infinity,
	}

	// colorNames is an array of the names of the colors in the array at Arras().themeColor.table, in the same order
	// must be var to avoid 'cannot access before initialization' error
	// need a hoisted version as otherwise the editor will not build on game start 
	// 		(since functions are hoisted above var-variables so var's are undefined when very first func runs)
	HOISTED.colorNames = ["teal","lgreen","orange","yellow","lavender","pink","vlgrey","lgrey","guiwhite","black","blue","green","red","gold","purple","magenta","grey","dgrey","white","guiblack"];
	var colorNames = HOISTED.colorNames;

	// first+last letter of color name
	const colorAbbreviations = {
		tl: "teal",
		ln: "lgreen",
		oe: "orange",
		yw: "yellow",
		lr: "lavender",
		pk: "pink",
		vy: "vlgrey",
		ly: "lgrey",
		ge: "guiwhite",
		bk: "black",
		be: "blue",
		gn: "green",
		rd: "red",
		gd: "gold",
		pe: "purple",
		ma: "magenta",
		gy: "grey",
		dy: "dgrey",
		we: "white",
		gk: "guiblack",
	};

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
		{"themeDetails":{"name":"Bocchi The Rock","author":"Road"},"config":{"graphical":{"darkBorders":true,"neon":false,"coloredNest":false,"renderGrid":true,"shieldbars":false,"miter":false,"renderNames":true,"renderScores":false,"renderHealth":true,"reducedInfo":false,"censorNames":false,"alphaAnimations":true,"borderChunk":6,"alternateBorder":false},"gui":{"enabled":true,"scale":1,"alcoveSize":200,"spacing":20,"leaderboard":true,"barChunk":5},"themeColor":{"table":["#ffffff","#53caea","#53caea","#b0ccc1","#f2e5f9","#b0ccc1","#b0ccc1","#242858","#ffffff","#853e63","#345a97","#f8e35d","#e74932","#bb7f36","#6b354d","#fcc2cb","#839496","#b0ccc1","#000000","#ffd6d6"],"border":0.5}}}
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

		// New default themes curated by Mr.Hacker YT, added on 15 Sep 2023
		{"themeDetails":{"name":"Chernobyl Coral Reef","author":"gonials"},"config":{"graphical":{"darkBorders":true,"neon":false,"coloredNest":false,"renderGrid":false,"shieldbars":true,"miter":true,"renderNames":true,"renderScores":true,"renderHealth":true,"reducedInfo":false,"censorNames":false,"alphaAnimations":true,"borderChunk":4,"alternateBorder":false,"screenshotMode":false,"compensationScale":1.114,"lowGraphics":false,"inversedRender":true,"miterStars":true,"fontSizeOffset":0,"quadraticStars":false,"barChunk":5},"gui":{"enabled":true,"scale":1,"alcoveSize":200,"spacing":20,"leaderboard":true,"barChunk":5},"themeColor":{"table":["#b36464","#5be0a9","#4c7175","#d3d3d3","#d3d3d3","#d3d3d3","#2d5139","#d3d3d3","#ffffff","#010c5f","#ad0048","#34a15e","#a541a8","#766b7e","#427550","#9b7935","#88969f","#d3d3d3","#435564","#d3d3d3"],"border":0.5}}},

		{"themeDetails":{"name":"Test!","author":"wig wig"},"config":{"graphical":{"darkBorders":true,"neon":false,"coloredNest":true,"renderGrid":false,"shieldbars":false,"miter":true,"renderNames":true,"renderScores":true,"renderHealth":true,"reducedInfo":false,"censorNames":false,"alphaAnimations":true,"borderChunk":6,"alternateBorder":false,"screenshotMode":false,"compensationScale":1.114,"lowGraphics":false,"inversedRender":true,"miterStars":true,"quadraticStars":false,"fontSizeOffset":0,"barChunk":5},"gui":{"enabled":true,"scale":1,"alcoveSize":200,"spacing":20,"leaderboard":true,"barChunk":-5},"themeColor":{"table":["#a15f48","#ffffff","#ae8c7e","#009aff","#b58efd","#ff0e70","#64697b","#aa9f9e","#ffffff","#000000","#c84040","#78848b","#bb7139","#a95b5e","#5c4646","#333134","#613c3c","#666f67","#5c2c2c","#000000"],"border":0}}},

		{"themeDetails":{"name":"Maelstrom","author":"Mr.Hacker"},"config":{"graphical":{"darkBorders":true,"neon":false,"coloredNest":false,"renderGrid":false,"shieldbars":false,"miter":true,"renderNames":true,"renderScores":true,"renderHealth":true,"reducedInfo":false,"censorNames":false,"alphaAnimations":true,"borderChunk":4.4,"alternateBorder":false,"screenshotMode":false,"compensationScale":1.114,"lowGraphics":false,"inversedRender":true,"miterStars":true,"fontSizeOffset":0,"barChunk":5,"quadraticStars":false},"gui":{"enabled":true,"scale":1,"alcoveSize":200,"spacing":20,"leaderboard":true,"barChunk":5},"themeColor":{"table":["#ffffc6","#e3baff","#716377","#f1e34a","#9b9b9b","#56638a","#c9c9c9","#aa9f9e","#ffffff","#484848","#b5b5b5","#c56fc7","#a5c043","#59686d","#2a2a2c","#4bbdb2","#000000","#409566","#181f1e","#000000"],"border":0.5}}},

		{"themeDetails":{"name":"Gyro","author":"Mr.Hacker"},"config":{"graphical":{"darkBorders":false,"neon":false,"coloredNest":false,"renderGrid":false,"shieldbars":false,"miter":true,"renderNames":true,"renderScores":true,"renderHealth":true,"reducedInfo":false,"censorNames":false,"alphaAnimations":true,"borderChunk":4.8,"alternateBorder":false,"screenshotMode":false,"compensationScale":1.114,"lowGraphics":false,"inversedRender":true,"miterStars":true,"fontSizeOffset":0,"quadraticStars":false,"barChunk":5},"gui":{"enabled":true,"scale":1,"alcoveSize":200,"spacing":20,"leaderboard":true,"barChunk":5},"themeColor":{"table":["#75988d","#b3a15a","#9c717d","#ebe59d","#b58efd","#777777","#a0a6bf","#aa9f9e","#ffffff","#494949","#8d4356","#317152","#3f72b0","#94799a","#687e90","#57d2df","#9eb5b6","#636363","#a7b8b8","#000000"],"border":0.8}}},

		{"themeDetails":{"name":"Blood Hunt","author":"Mr.Hacker"},"config":{"graphical":{"darkBorders":false,"neon":false,"coloredNest":false,"renderGrid":false,"shieldbars":false,"miter":true,"renderNames":true,"renderScores":true,"renderHealth":true,"reducedInfo":false,"censorNames":false,"alphaAnimations":true,"borderChunk":6,"alternateBorder":false,"screenshotMode":false,"barChunk":5,"compensationScale":1.114,"lowGraphics":false,"inversedRender":true,"miterStars":true,"fontSizeOffset":0,"quadraticStars":false},"gui":{"enabled":true,"scale":1,"alcoveSize":200,"spacing":20,"leaderboard":true,"barChunk":5},"themeColor":{"table":["#600000","#ff0000","#161616","#ff0000","#b58efd","#600000","#565656","#aa9f9e","#e8e8e8","#0d0c0c","#6b0000","#444444","#111111","#600000","#353535","#2d0000","#2d2d2d","#303030","#301111","#000000"],"border":0.55}}},

		{"themeDetails":{"name":"Ultraviolet","author":"Mr.Hacker"},"config":{"graphical":{"darkBorders":true,"neon":false,"coloredNest":false,"renderGrid":false,"shieldbars":false,"miter":true,"renderNames":true,"renderScores":true,"renderHealth":true,"reducedInfo":false,"censorNames":false,"alphaAnimations":true,"borderChunk":4.5,"alternateBorder":true,"screenshotMode":false,"barChunk":5,"compensationScale":1.114,"lowGraphics":false,"inversedRender":true,"miterStars":true,"fontSizeOffset":0,"quadraticStars":false},"gui":{"enabled":true,"scale":1,"alcoveSize":200,"spacing":20,"leaderboard":true,"barChunk":5},"themeColor":{"table":["#18010a","#c0baf7","#170202","#040001","#b58efd","#302497","#050505","#aa9f9e","#e5e5e5","#333333","#150122","#39b2bb","#b73a24","#02041c","#001213","#9b4ca2","#100217","#3e4450","#100217","#430051"],"border":1}}},

		{"themeDetails":{"name":"Minerals","author":"SKR"},"config":{"graphical":{"screenshotMode":false,"borderChunk":6,"compensationScale":1.114,"lowGraphics":false,"alphaAnimations":true,"inversedRender":true,"miterStars":false,"miter":true,"fontSizeOffset":0,"shieldbars":false,"renderGrid":false,"renderNames":true,"censorNames":false,"darkBorders":true,"neon":false,"alternateBorder":false,"coloredNest":true},"gui":{"enabled":true,"scale":1,"alcoveSize":200,"spacing":20,"leaderboard":true,"barChunk":5},"themeColor":{"table":["#d1d5d5","#afb8ff","#fc7676","#848484","#7259a5","#81737f","#b2c59a","#0e0000","#ffffff","#000000","#170a51","#000000","#874949","#636363","#654242","#be7ff5","#828282","#545454","#818077","#000000"],"border":0.5}}},

		{"themeDetails":{"name":"Headmarch","author":"Slade Zypher"},"config":{"graphical":{"darkBorders":true,"neon":false,"coloredNest":false,"renderGrid":false,"shieldbars":false,"miter":true,"renderNames":true,"renderScores":true,"renderHealth":true,"reducedInfo":false,"censorNames":false,"alphaAnimations":true,"borderChunk":6,"alternateBorder":false,"screenshotMode":false,"compensationScale":1.114,"lowGraphics":false,"inversedRender":true,"miterStars":true,"fontSizeOffset":0,"quadraticStars":false},"gui":{"enabled":true,"scale":1,"alcoveSize":200,"spacing":20,"leaderboard":true,"barChunk":5},"themeColor":{"table":["#ffec2e","#ffffff","#bababa","#009aff","#b58efd","#ffffff","#e8ebf7","#aa9f9e","#ffffff","#000000","#618e87","#4e4275","#346192","#7a7a7a","#191919","#c9c9c9","#515151","#726f6f","#252525","#060606"],"border":0}}},

		{"themeDetails":{"name":"USA","author":"Slade Zypher"},"config":{"graphical":{"darkBorders":false,"neon":false,"coloredNest":false,"renderGrid":false,"shieldbars":false,"miter":true,"renderNames":true,"renderScores":true,"renderHealth":true,"reducedInfo":false,"censorNames":false,"alphaAnimations":true,"borderChunk":6,"alternateBorder":false,"screenshotMode":false,"compensationScale":1.114,"lowGraphics":false,"inversedRender":true,"miterStars":false,"fontSizeOffset":0,"quadraticStars":false},"gui":{"enabled":true,"scale":1,"alcoveSize":200,"spacing":20,"leaderboard":true,"barChunk":5},"themeColor":{"table":["#befcf9","#90adcf","#a1c7b6","#ffeb8e","#b58eff","#56350a","#ffffff","#999999","#ffffff","#000000","#b31942","#ffffff","#43426b","#fdedad","#e0bfb8","#aa7d52","#969292","#545454","#a0978b","#000000"],"border":0.75}}},

		{"themeDetails":{"name":"The Himalayas","author":"Slade Zypher"},"config":{"graphical":{"darkBorders":true,"neon":false,"coloredNest":false,"renderGrid":false,"shieldbars":false,"miter":true,"miterStars":true,"quadraticStars":false,"renderNames":true,"renderScores":true,"renderHealth":true,"reducedInfo":false,"censorNames":false,"lowGraphics":false,"alphaAnimations":true,"borderChunk":6,"compensationScale":1.114,"inversedRender":true,"fontSizeOffset":0,"alternateBorder":false},"gui":{"enabled":true,"scale":1,"alcoveSize":200,"spacing":20,"leaderboard":true,"barChunk":7},"themeColor":{"table":["#ff0000","#ffffff","#687fba","#ffd993","#939fff","#50ffed","#a5b2a5","#7f7f7f","#ffffff","#373834","#cccccc","#ad2e43","#e19f3b","#6b92ff","#78aeb4","#a0b775","#998f8f","#494954","#6a6b70","#000000"],"border":0.5}}}, 

		{"themeDetails":{"name":"baba is theme (autumn)","author":"Alas"},"config":{"graphical":{"darkBorders":true,"neon":false,"coloredNest":false,"renderGrid":false,"shieldbars":false,"miter":true,"renderNames":true,"renderScores":true,"renderHealth":true,"reducedInfo":false,"censorNames":false,"alphaAnimations":true,"borderChunk":6,"alternateBorder":false,"screenshotMode":false,"compensationScale":1.11,"lowGraphics":false,"inversedRender":true,"miterStars":true,"fontSizeOffset":-1,"quadraticStars":false,"barChunk":5},"gui":{"enabled":true,"scale":1,"alcoveSize":200,"spacing":20,"leaderboard":true,"barChunk":4},"themeColor":{"table":["#74693e","#b0a740","#ae4f37","#efcb46","#b58efd","#b36179","#c3c3c3","#aa9f9e","#fdfaec","#242424","#fdfaec","#6bc7b8","#ca6b53","#efcb46","#4ab08c","#a96aa5","#7d674a","#89725d","#392d24","#376d55"],"border":0}}},

		{"themeDetails":{"name":"Underneath","author":"Quad"},"config":{"graphical":{"darkBorders":true,"neon":false,"coloredNest":false,"renderGrid":false,"shieldbars":false,"miter":true,"renderNames":true,"renderScores":true,"renderHealth":true,"reducedInfo":false,"censorNames":false,"alphaAnimations":true,"borderChunk":6,"alternateBorder":false,"screenshotMode":false,"compensationScale":1.114,"lowGraphics":false,"inversedRender":true,"miterStars":true,"fontSizeOffset":0,"quadraticStars":false,"barChunk":5},"gui":{"enabled":true,"scale":1,"alcoveSize":200,"spacing":20,"leaderboard":true,"barChunk":5},"themeColor":{"table":["#000000","#ffff00","#7a0000","#ffffff","#b58eff","#93007d","#494949","#999999","#ffffff","#000000","#212121","#0c3b21","#cccccc","#846c00","#000e56","#3b165e","#727272","#007f61","#565656","#000000"],"border":0.5}}},

		{"themeDetails":{"name":"Deepsea","author":"-1℃"},"config":{"graphical":{"darkBorders":false,"neon":true,"coloredNest":false,"renderGrid":false,"shieldbars":false,"miter":true,"renderNames":true,"renderScores":true,"renderHealth":true,"reducedInfo":false,"censorNames":false,"alphaAnimations":true,"borderChunk":6,"alternateBorder":false,"screenshotMode":false,"barChunk":5,"compensationScale":1.114,"lowGraphics":false,"inversedRender":true,"miterStars":true,"fontSizeOffset":0,"quadraticStars":false},"gui":{"enabled":true,"scale":1,"alcoveSize":200,"spacing":20,"leaderboard":true,"barChunk":5},"themeColor":{"table":["#6366b4","#60a86c","#9491a0","#000000","#000000","#d639d9","#9491a0","#000000","#ffffff","#000000","#492573","#365d51","#ad1416","#9491a0","#ffffff","#891a57","#696986","#000000","#1c1a22","#ffffff"],"border":0.7}}},

		{"themeDetails":{"name":"Vitamin Water","author":"Marcus"},"config":{"graphical":{"darkBorders":true,"neon":false,"coloredNest":false,"renderGrid":false,"shieldbars":false,"miter":true,"renderNames":true,"renderScores":true,"renderHealth":true,"reducedInfo":false,"censorNames":false,"alphaAnimations":true,"borderChunk":6,"alternateBorder":false,"miterStars":true,"quadraticStars":false,"lowGraphics":false,"compensationScale":1.114,"inversedRender":true,"fontSizeOffset":0,"screenshotMode":false,"barChunk":5},"gui":{"enabled":true,"scale":1,"alcoveSize":200,"spacing":20,"leaderboard":true,"barChunk":5},"themeColor":{"table":["#d6d19e","#47948b","#8763d3","#492352","#c495ff","#ea99c1","#a4bbff","#aa9f9e","#ffffff","#030317","#2b3968","#ba3f72","#b06444","#7c8c5d","#904a6b","#6b5151","#c3b6b6","#7f5151","#57555c","#000000"],"border":0.5}}},

		{"themeDetails":{"name":"blackbird","author":"Marcus"},"config":{"graphical":{"darkBorders":false,"neon":true,"coloredNest":false,"renderGrid":false,"shieldbars":false,"miter":true,"renderNames":true,"renderScores":true,"renderHealth":true,"reducedInfo":false,"censorNames":false,"alphaAnimations":true,"borderChunk":6,"alternateBorder":false,"screenshotMode":false,"barChunk":5,"compensationScale":1.114,"lowGraphics":false,"inversedRender":true,"miterStars":true,"fontSizeOffset":0,"quadraticStars":false},"gui":{"enabled":true,"scale":1,"alcoveSize":200,"spacing":20,"leaderboard":true,"barChunk":5},"themeColor":{"table":["#00ffff","#ffff65","#673ca3","#ff00d4","#b200ff","#ff5dba","#9ec4ff","#aa9f9e","#ffffff","#000000","#0095ff","#ffffff","#ff020c","#a3ffff","#e1baff","#c9ff00","#8080df","#726f6f","#0f0f19","#000000"],"border":0.5}}},

		{"themeDetails":{"name":"Kaz.","author":":Ö:"},"config":{"graphical":{"darkBorders":false,"neon":false,"coloredNest":false,"renderGrid":false,"shieldbars":true,"miter":true,"renderNames":true,"renderScores":true,"renderHealth":true,"reducedInfo":false,"censorNames":false,"alphaAnimations":true,"borderChunk":6,"alternateBorder":false},"gui":{"enabled":true,"scale":1,"alcoveSize":200,"spacing":20,"leaderboard":true,"barChunk":5},"themeColor":{"table":["#ffffff","#963030","#ff8300","#d79920","#d3869b","#ff00e7","#b5b5b5","#aa9f9e","#ebddd2","#000000","#00ffff","#1fff00","#000000","#ffff07","#56ffd7","#ff00ff","#5f0f79","#000000","#282828","#000000"],"border":0.5}}},

		{"themeDetails":{"name":"V Dark","author":"Imagine"},"config":{"graphical":{"darkBorders":false,"neon":true,"coloredNest":false,"renderGrid":false,"shieldbars":false,"miter":false,"renderNames":true,"renderScores":true,"renderHealth":true,"reducedInfo":false,"censorNames":false,"alphaAnimations":true,"borderChunk":5,"alternateBorder":false},"gui":{"enabled":true,"scale":1,"alcoveSize":200,"spacing":20,"leaderboard":true,"barChunk":5},"themeColor":{"table":["#984292","#d8a6d5","#33935e","#cdc684","#89778e","#a3c39c","#cfdcd1","#a7b2b7","#dddddd","#000000","#ae78b4","#d0bf99","#9bb5ce","#99e5b7","#637c6e","#e9b69f","#9e9e9e","#686868","#000000","#d3d3d3"],"border":0.5}}},
	];


	// pass in a colorName string
	async function updateColor(colorName, newVal) {
		// Arras() obj is the universal source of truth for themeColor

		let colorIndex = colorNameToIndex[colorName];
		// update game
		Arras().themeColor.table[colorIndex] = newVal;

		// update storage
		await GM.setValue(themeColorStorageKey, JSON.stringify( Arras().themeColor ))
	}

	async function updateBorder(newVal) {
		// Arras() obj is the universal source of truth for themeColor

		// update game
		Arras().themeColor.border = Number(newVal);

		// update storage
		await GM.setValue(themeColorStorageKey, JSON.stringify( Arras().themeColor ))
	}

	async function updateThemeDetails(prop, newVal) {
		// storage's themeDetailsStorageKey is the universal source of truth for themeDetais
		const currentThemeDetails = JSON.parse(await GM.getValue(themeDetailsStorageKey));
		currentThemeDetails[prop] = newVal;
		// update storage
		await GM.setValue(themeDetailsStorageKey, JSON.stringify(currentThemeDetails))
	}

	async function updateThemeTags(themeIndexInSavedThemes, newTags) {
		// universal source of truth for gallery is storage's savedThemesStorageKey
		const savedThemes = JSON.parse(await GM.getValue(savedThemesStorageKey));

		// modify savedThemes
		savedThemes[themeIndexInSavedThemes].themeDetails.tags = newTags;

		// resave to storage
		await GM.setValue(savedThemesStorageKey, JSON.stringify(savedThemes));
	}

	// when index="", return prefix without the index
	function getThemeIndexClass(index="") {
		return `theme-index-${index}`;
	}

	async function updateFilterQuery(newFilterQuery) {
		await GM.setValue(filterQueryStorageKey, newFilterQuery);
		const filteredThemesIndexesArr = await HOISTED.filterHelper.filterSavedThemes(newFilterQuery);
		const filteredThemesIndexesSet = new Set(filteredThemesIndexesArr);
		
		// Don't rerender entire gallery section with buildGallerySection because then this workflow breaks:
		// - filter something
		// - add tag to theme
		// - undo filter
		// - tag shows up for wrong theme
		// - this also breaks delete (wrong theme deleted)

		// Instead, hide non-matching themes
		// first, get all elements with the theme_index property and reset their display values
		document.querySelectorAll(`[theme_index]`).forEach(elem => {
			// The r-setting needs display flex, the rest are display block
			elem.style.display =  elem.classList.contains('displayflex') ? 'flex' : 'block';
		})
		// next, loop over savedThemes and hide any at non-matching indexes
		const savedThemes = JSON.parse(await GM.getValue(savedThemesStorageKey));
		for (let i = 0; i < savedThemes.length; i++) {
			// skip themes that should be shown
			if (filteredThemesIndexesSet.has(i)) continue;

			// hide all other themes
			document.querySelectorAll(`[theme_index="${i}"]`).forEach(elem => {
				elem.style.display = 'none';
			})
		}
	}


	async function addThemeToGallery(
		arrasObj = Arras(), 
		themeDetails
	) {
		// can't put async in default param value
		if (!themeDetails) {
			themeDetails = JSON.parse(await GM.getValue(themeDetailsStorageKey));
		}

		if (!themeDetails.name) {
			themeDetails.name = "Enter Theme Name";
		}
		if (!themeDetails.author) {
			themeDetails.author = "Enter Theme Author";
		}

		const config = JSON.parse(JSON.stringify(arrasObj));
		// universal source of truth for gallery is storage's savedThemesStorageKey
		const savedThemes = JSON.parse(await GM.getValue(savedThemesStorageKey));
		
		// modify savedThemes, add to start of array so it shows up on top
		savedThemes.unshift({themeDetails, config});
		
		// rerender gallery elements
		await buildGallerySection(savedThemes);
		// resave to storage
		await GM.setValue(savedThemesStorageKey, JSON.stringify(savedThemes));
	}

	async function deleteThemeFromGallery(themeIndexInSavedThemes) {
		// universal source of truth for gallery is storage's savedThemesStorageKey
		const savedThemes = JSON.parse(await GM.getValue(savedThemesStorageKey));
		
		// modify savedThemes
		savedThemes.splice(themeIndexInSavedThemes, 1);
		
		// rerender gallery elements
		await buildGallerySection(savedThemes);
		// resave to storage
		await GM.setValue(savedThemesStorageKey, JSON.stringify(savedThemes));
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

	class FilterHelper {
		// Search String = "a,b|c,d"
		// AND Query = "a,b" / "c,d"
		// AND Query Segment =  a/b/c/d
		
		// To add new operator, add it in constructor and getMatchFunc, and rest should be fine
		constructor() {
			this.orSeparator = "|"; // a|b = a || b
			this.andSeparator = ","; // a,b == a && b

			// operators
			this.equalsOperator = "=="; // name==c means (name === c)
			this.containsOperator = "~~" // name~~c means (c in name)
			this.operators = [
				this.equalsOperator,
				this.containsOperator,
			];

			// Add reverse operators, like for == (equals) add !== (not-equals)
			this.reverseOperatorPrefix = "!"; // turns an operator into the reverse operator
			for (const operator of [...this.operators]) {
				this.operators.push( this.reverseOperatorPrefix + operator );
			}
		}

		// return a (needle,haystack) => bool func
		getMatchFunc(operator="") {
			// default match is a "does include"
			const defaultMatchFunction = (needle, haystack) => haystack.includes(needle);
			if (!operator) return defaultMatchFunction;

			const operatorToFunc = {
				[this.equalsOperator]: (needle, haystack) => haystack === needle,
				[this.containsOperator]: (needle, haystack) => haystack.includes(needle),
			}

			if (operatorToFunc.hasOwnProperty(operator)) {
				return operatorToFunc[operator];
			}
			// for negated operators, return a matchFunc thats the opposite of the un-negated operator
			if (operator.startsWith(this.reverseOperatorPrefix)) {
				const oppositeOperator = operator.slice(this.reverseOperatorPrefix.length);
				if (operatorToFunc.hasOwnProperty(oppositeOperator)) {
					return (needle, haystack) => {
						const oppositeMatchFunc = operatorToFunc[oppositeOperator];
						return !oppositeMatchFunc(needle, haystack);
					}
				}
				// if un-negated operator doesn't have a match function, proceed to default case
			}

			return defaultMatchFunction;
		}

		// returns array of integers, each of which is the index in savedThemes of a filteredTheme
		// "a,author==b|name=/=c,d;e" is parsed as (a && (author === b)) || ((name != c) && d) || e
		async filterSavedThemes(searchString) {
			// universal source of truth for gallery is storage's savedThemesStorageKey
			const savedThemes = JSON.parse(await GM.getValue(savedThemesStorageKey));
			if (!savedThemes) {
				return [];
			}

			// blank search or means return all saved themes
			if (searchString.trim() === "") {
				return savedThemes.map((_, idx) => idx);
			}

			// searchString is a string that can be split into multiple AND queries
			// The whole searchString operates as an OR query
			const filteredThemesIndexes = [];
			for (let i = 0; i < savedThemes.length; i++) {
				const savedTheme = savedThemes[i];
				// Check OR logic after AND logic
				const andQueries = searchString.split(this.orSeparator);
				for (let andQuery of andQueries) {
					andQuery = this.formatString(andQuery);
					if (!andQuery) continue;

					// if any AND query is true, then entire searchString is true
					// if so, then add it to the filteredThemes and move to next theme
					if (this.doesEntireAndQueryMatchTheme(andQuery, savedTheme)) {
						filteredThemesIndexes.push(i);
						break;
					}
				}
			}

			return filteredThemesIndexes;
		}

		formatString(query) {
			return query.trim().toLowerCase();
		}

		// If og searchString was "a,b|c,d|e" then a,b / c,d / e would all be an andQuery
		// isMatchFunc is (needle,haystack) => bool
		doesEntireAndQueryMatchTheme(andQuery, theme) {
			const andQuerySegments = andQuery.split(this.andSeparator);
			for (let andQuerySegment of andQuerySegments) {
				// format and query
				andQuerySegment = this.formatString(andQuerySegment);
				if (!andQuerySegment) continue;

				// check if current and query is a match
				// if any AND query segment is false, then its parent AND query is false
				const [trueQuery, themeDetailsKeysToCheck, isMatchFunc] = this.parseAndQuerySegment(andQuerySegment, theme);
				if (!this.doesAndQuerySegmentMatchTheme(trueQuery, theme, themeDetailsKeysToCheck,isMatchFunc)) {
					return false;
				}
			}
			// if all AND query segments are true, return true
			return true;
		}

		// If og searchString was "a,b|c,d|e" then a b c d e would all be an andQuerySegment
		// isMatchFunc is (needle,haystack) => bool
		doesAndQuerySegmentMatchTheme(andQuerySegment, theme, themeDetailsKeysToCheck, isMatchFunc) {		
			for (const key of themeDetailsKeysToCheck) {
				const themeDetailsVal = this.formatString(theme.themeDetails[key]);
				if (isMatchFunc(andQuerySegment, themeDetailsVal)) {
					return true;
				}
			}
			return false;
		}

		// returns [trueQuery, themeDetailsKeysToCheck, isMatchFunc]
		// trueQuery is the query without any operators/themeDetails keys at the start
		//      author==road turns into trueQuery=road, themeDetailsKeysToCheck=[author], isMatchFunc=getMatchFunc(==)
		// isMatchFunc is (needle,haystack)=>bool
		// a lot of the advanced logic can go here
		parseAndQuerySegment(andQuerySegment, theme) {
			// This only works properly if themeDetails keys are all lowercase, so use snake_case not camelCase
			const allThemeDetailsKeys = Object.keys(theme.themeDetails);

			for (const operator of this.operators) {
				const returnArr = this.parseAndQuerySegmentHelper(andQuerySegment, operator, allThemeDetailsKeys);
				if (returnArr !== null) {
					return returnArr;
				}
				// if returnArr was null then the operator wasn't present
				// continue to next operator
			}
			// if no operators matched, do a normal "does contain" match
			// no arg to getMatchFunc gives default matchFunc
			return [andQuerySegment, allThemeDetailsKeys, this.getMatchFunc()];
		}

		parseAndQuerySegmentHelper(andQuerySegment, operator, allThemeDetailsKeys) {		
			if (andQuerySegment.includes(operator)) {
				// if user provides valid key to filter on (name/author/tags)
				// then only filter for that key
				const [filterOnKey, trueQuery] = andQuerySegment.split(operator).map(x => x.trim());
				if (allThemeDetailsKeys.includes(filterOnKey)) {
					return [trueQuery, [filterOnKey], this.getMatchFunc(operator)] ;
				}
				// if filterOnKey is invalid, continue and treat querySegment like a normal search
			}

			// if operator doesn't properly exist in segment, return null
			return null;
		}
	}
	HOISTED.filterHelper = new FilterHelper();


	function buildMiscSection(themeColorObj, themeDetailsObj) {
		// border label and input
		const borderElements = h('div.r-setting',
			h('label.r-label', 'border'),
			h('input.r-input.r-input--number', {
				type: 'number',
				step: 'any',
				value: themeColorObj.border,
				async oninput () {
					await updateBorder(this.value)
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
					async oninput () {
						await updateThemeDetails('name', this.value);
					}
				})
			),
			h('div.r-setting', 
				h('label.r-label', 'Theme Author'),
				h('input.r-input.r-input--text', {
					type: 'text',
					value: themeDetailsObj.author,
					async oninput () {
						await updateThemeDetails('author', this.value);
					}
				})
			)
		];

		const exportThemeElements = [
			h('div.r-setting', 
				h('div.r-btn--standard#export-tiger_json-btn', {
					async onclick () {
						await exportTheme('TIGER_JSON');
					}
				}, 'Export Tiger Theme')
			),
			h(`div.r-setting.r-description`, 
				"Best Option. Includes everything. Only works with RoadRayge and Tiger (Theme In-Game Editor)."
			),

			h('div.r-setting', 
				h('div.r-btn--standard#export-bc-btn', {
					async onclick () {
						await exportTheme('backwardsCompatible');
					}
				}, 'Export Backwards-Compatible Theme')
			),
			h(`div.r-setting.r-description`, 
				"Can be used with Arras.io's custom theme input. Only has colors & border. DOES NOT INCLUDE ANY GRAPHICAL OR GUI PROPERTIES."
			),

			h('div.r-setting', 
				h('div.r-btn--standard#export-all-btn', {
					async onclick () {
						await exportTheme('all');
					}
				}, 'Export All Saved Themes')
			),
			h(`div.r-setting.r-description`, 
				"Your friends can import this into their RoadRayge client!"
			),
		];

		const importThemeElements = [
			h('div.r-setting', 
				h('label.r-label', "Import Theme"),
				h('input.r-input.r-input--text#theme-import-input', {
					type: 'text',
					value: '',
					placeholder: 'Paste a theme here to import',
					async oninput () {
						await importTheme(this.value);
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
				async onmouseup () {
					// perforance.now uses milliseconds, so we divide by 1000 to convert to seconds
					const timeButtonWasHeldFor = (performance.now() - buttonClickStartTime.saveCurrentTheme) / 1000;
					if (timeButtonWasHeldFor >= 3) {
						await addThemeToGallery();
						temporarilyChangeText('#save-to-gallery-btn', 'Saved To Gallery!')
					}
				}
			}, 'Hold For 3s To Save Current Theme To Gallery')
		);

		const swapColorsElements = [
			h('br'),
			h('div.r-setting',
				h('label.r-label', "Swap Colors"),
				h('input.r-input.r-input--text#swap-colors-input', { 
					type: 'text',
					value: '',
					placeholder: 'Enter swaps'
				}),
			),
			h('div.r-btn--standard#swap-colors-btn', {
				onmousedown () {
					buttonClickStartTime.swapColors = performance.now();
				},
				onmouseup () {
					// perforance.now uses milliseconds, so we divide by 1000 to convert to seconds
					const timeButtonWasHeldFor = (performance.now() - buttonClickStartTime.swapColors) / 1000;
					if (timeButtonWasHeldFor >= 3) {
						swapColors();
						temporarilyChangeText('#swap-colors-btn', 'Swapped!')
					}
				}
			}, 'Hold For 3s To Swap'),
			h(`div.r-setting.r-description`, 
				"Use this format: red/blue pink/gold red/grey "
				+ "Also try 1st & last letter: rd/be pk/gd rd/gy"
			),
		];

		
		appendElementsToContainer(
			"#misc-container", 
			[ 
				borderElements, 
				...themeDetailsElements, 
				saveCurrentThemeElements,
				...importThemeElements, 
				...exportThemeElements, 
				...swapColorsElements,
			], 
			true
		);
	}

	function swapColors() {
		const oldThemeColors = [...Arras().themeColor.table]; // copy themeColor array
		const newThemeColors = [...oldThemeColors];

		const swapColorsStr = document.querySelector("#swap-colors-input").value;
		const swaps = swapColorsStr.trim().split(/\s+/); // split on whitespace
		
		for (const swap of swaps) {
			// skip to next pair if there's not exactly 2 colors in current pair
			// the pair should look like "red/blue"
			let colorsToSwap = swap.split("/");
			if (colorsToSwap.length !== 2) { 
				continue;
			}

			// format colors a bit
			colorsToSwap = colorsToSwap.map(color => {
				// replace abbreviation with full name
				if (color in colorAbbreviations) {
					color = colorAbbreviations[color];
				}
				return color.trim();
			})

			const [firstColor, secondColor] = colorsToSwap;
			
			// skip to next pair if either color in current pair is invalid
			if (!(firstColor in colorNameToIndex) || !(secondColor in colorNameToIndex)) { 
				continue;
			}

			// do the actual color swapping
			const firstColorIndex = colorNameToIndex[firstColor];
			const secondColorIndex = colorNameToIndex[secondColor];
			newThemeColors[firstColorIndex] = oldThemeColors[secondColorIndex];
			newThemeColors[secondColorIndex] = oldThemeColors[firstColorIndex];
			Arras().themeColor.table = newThemeColors;
		}

		buildColorsSection(Arras().themeColor);
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
						async oninput () {
							await updateColor(colorName, this.value);
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

	async function buildGallerySection(savedThemesArr, options={}) {
		const galleryElements = [];

		// Add link to themes discord
		galleryElements.push(
			// Themes Discord Link
			h(`a.r-setting.r-description`, {
				href: "https://discord.gg/DH2DP8JPhP",
				target: "_blank", // opens in new tab
				rel: "noopener noreferrer",
			},
				"View More Themes"
			)
		);

		galleryElements.push(
			// Filter Themes
			h('div.r-setting', 
				h('label.r-label', 'Filter Themes:'),
				h('input.r-input.r-input--text#filter-themes-input', {
					type: 'text',
					placeholder: 'Enter search query',
					value: (await GM.getValue(filterQueryStorageKey)) || "",
					async oninput () {
						await updateFilterQuery(this.value);
					},
					// for when page is reloaded
					async onclick () {
						await updateFilterQuery(this.value);
					}
				})
			),

			// Filter themes description
			h(`a.r-setting.r-description#filter-themes-description`, {
				href: "https://github.com/Road6943/RoadRayge/blob/main/notes/filter-info.md",
				target: "_blank", // opens in new tab
				rel: "noopener noreferrer",
			},
				'Click outside textbox to search. Click me to see advanced filtering options.'
			),

			h('hr.gallery-divider')
		)

		for (let idx = 0; idx < savedThemesArr.length; idx++) {
			const savedTheme = savedThemesArr[idx];
			let tcTable = savedTheme.config.themeColor.table;
			let getHex = (colorName) => tcTable[ colorNameToIndex[colorName] ];
			const sharedBarrelAttrs = { rx:5, ry:5, width:35, height:20, "stroke-width":3 };
			const sharedTankBodyAttrs = { r:20, "stroke-width":3 };

			galleryElements.push(
				// Theme Label (Name, Author)
				h(`center.r-label`, { theme_index: idx },  
					savedTheme.themeDetails.name
					+ ' by: ' + savedTheme.themeDetails.author
				),

				// Delete Theme Button
				h(`div.r-btn--standard.${getThemeIndexClass(idx)}#delete-theme-btn`, {
					theme_index: idx,
					onmousedown () {
						buttonClickStartTime.deleteTheme = performance.now();
					},
					async onmouseup (event) {
						// perforance.now uses milliseconds, so we divide by 1000 to convert to seconds
						const timeButtonWasHeldFor = (performance.now() - buttonClickStartTime.deleteTheme) / 1000;
						if (timeButtonWasHeldFor >= 3) {
							await deleteThemeFromGallery( event.target.getAttribute('theme_index') )
						}
					}
				}, 'Hold For 3s To Delete Theme'),

				// Theme Tags
				h(`div.r-setting.displayflex`, { theme_index: idx },
					h('label.r-label', 'Tags:'),
					h('input.r-input.r-input--text', {
						theme_index: idx,
						type: 'text',
						placeholder: 'Separate,With,Comma',
						value: savedTheme.themeDetails?.tags || '',
						async oninput (event) {
							await updateThemeTags(
								event.target.getAttribute('theme_index'), 
								event.target.value
							);
						}
					})
				),
			);

			// build the theme preview
			// NOTE: you must put class/id as a property not as a .class or #id after
			//		svg/rect/... because the s() func isn't that complex
			const svg = s(`svg`, {
				theme_index: idx,
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
			svg.addEventListener("click", async () => {
				await applyTheme(savedTheme);
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
				h(`hr.gallery-divider`, { theme_index: idx })
			);

		}

		appendElementsToContainer(
			"#gallery-container",
			galleryElements,
			true
		);

		stopKeyboardPropagation();
	}

	// This function is the first one to be called after Ray's stuff runs
	// 	All of my stuff launches from here
	// Arras().themeColor is undefined when the player has not yet started playing the game
	// thus, only create its html elements after Arras().themeColor is not undefined
	var initThemeColorStuff = async function() {
		// set an interval to check if themeColor exists every 1 sec, and only
		// create the theme stuff once it does and then clear the interval away
		const checkIfThemeColorExistsInterval = setInterval(async () => {
			// return early is themeColor doesn't exist yet
			if ((typeof Arras().themeColor) == "undefined") {
				return;
			}

			await realInitThemeColorStuff();

			clearInterval(checkIfThemeColorExistsInterval);
		}, 1*1000)

		// get a value from storage, or add it to storage if it doesn't already exist
		async function getFromOrInitInStorage(storageKey, defaultVal) {
			let toReturn = JSON.parse(await GM.getValue(storageKey, "null"));
			if (toReturn === null) {
				toReturn = defaultVal;
				await GM.setValue(storageKey, JSON.stringify(toReturn));
			}
			return toReturn;
		}

		async function realInitThemeColorStuff() {
			const themeColor = await getFromOrInitInStorage(themeColorStorageKey, Arras().themeColor);
			const themeDetails = await getFromOrInitInStorage(themeDetailsStorageKey, {name: '', author: ''});
			const savedThemesArr = await getFromOrInitInStorage(savedThemesStorageKey, defaultSavedThemes);

			// apply the saved theme, and build the ui in the process
			await applyTheme({themeDetails, config: {...settings, themeColor}});
			await buildGallerySection(savedThemesArr);
		}
	}


	// export a theme as either a 'tiger' theme (using json format) or 'arras' theme (json format, only contains themeColor changes)
	async function exportTheme(
		type, 
		arrasObj = Arras(), 
		themeDetailsObj
	) {
		// can't put await in default param value
		if (!themeDetailsObj) {
			themeDetailsObj = JSON.parse(await GM.getValue(themeDetailsStorageKey));
		}

		var themeToExport = {};
		var copiedToClipboardMsg = 'Copied To Clipboard!';

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
			temporarilyChangeText("#export-tiger_json-btn", copiedToClipboardMsg);
		}
		else if (type === 'backwardsCompatible') {
			themeToExport = {
				name: themeDetailsObj.name,
				author: themeDetailsObj.author,
				content: {
					paletteSize: 10,
					border: arrasObj.themeColor.border,
				},
			};

			for (let colorName of colorNames) {
				let tcTable = arrasObj.themeColor.table;
				let colorIndex = colorNameToIndex[colorName];
				themeToExport.content[colorName] = tcTable[colorIndex];
			}

			themeToExport = JSON.stringify(themeToExport);
			temporarilyChangeText("#export-bc-btn", copiedToClipboardMsg);
		}
		else if (type === 'all') {
			themeToExport = 'TIGER_LIST' + ((await GM.getValue(savedThemesStorageKey)) || '[]');
			temporarilyChangeText("#export-all-btn", copiedToClipboardMsg);
		}
		else {
			console.log('Unsupported export theme type: ' + type.toString());
			return;
		}

		// copy to clipboard
		if (GM.setClipboard) {
			await GM.setClipboard(themeToExport);
		} else {
			await navigator?.clipboard?.writeText(themeToExport);
		}

		console.log('Exported the following theme:');
		console.log(themeToExport);
	}

	// takes in a themeObj, and changes the games visual properties using it
	// themeObj is basically the same format as Arras()
	// be careful not to simply assign this.config to a new object, 
	// because that will remove it being a reference to the actual game's Arras() object
	// similarly, you can only directly change the atomic properties + arrays (not objects)
	async function applyTheme(themeObj) {
		// this function will create a new identical theme to remove reference to original theme object
		// this prevents future theme modifications from screwing with the original theme
		var newTheme = JSON.parse( JSON.stringify(themeObj) );

		// theme details
		for (let [key,val] of Object.entries(newTheme.themeDetails)) {
			await updateThemeDetails(key, val);
		}

		const { config } = newTheme;
		
		// apply settings to game's Arras() obj
		for (let prop in config) {
			if (prop === "themeColor") {
				await updateBorder(config.themeColor.border);
				// colors
				let tcTable = config.themeColor.table;
				for (let i = 0; i < tcTable.length; i++) {
					await updateColor(HOISTED.colorNames[i], tcTable[i]);
				}

			// graphical, gui
			} else { 
				for (let [key,val] of Object.entries(config[prop])) {
					await update(prop, key, val);
				}
			}
		}

		// change controls in RoadRayge by re-rendering ui
		appendElementsToContainer(
			"#graphical-container", 
			settingsFactory("graphical", Arras()),
			true
		);
		appendElementsToContainer(
			"#gui-container",
			settingsFactory("gui", Arras()),
			true
		);
		buildMiscSection(
			Arras().themeColor, 
			JSON.parse(await GM.getValue(themeDetailsStorageKey))
		);
		buildColorsSection(Arras().themeColor);

		// run this only after themeColor stuff is made 
		// or else it won't affect themeColor stuff
		stopKeyboardPropagation();
	}


	// supports both types of arras themes as well as the new TIGER_JSON theme type + the new TIGER_LIST multiple-themes format
	// this function only converts an imported theme string into a js object mirroring this.config/the game's Arras() object
	// but importTheme calls a different function (applyTheme) that will take in a theme obj and change the game's visual properties
	async function importTheme(themeToImport) {
		try {
			shouldApplyTheme = true;
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
				// tiger list is a json array of multiple theme objects
				else if (themeToImport.startsWith('TIGER_LIST')) {
					// parse TIGER_LIST[themeObj's] string into themeObj array
					var themesToImportArr = themeToImport.substring( 'TIGER_LIST'.length );
					themesToImportArr = JSON.parse(themesToImportArr);
					console.log('Multiple themes imported!');
					console.log(themesToImportArr);

					// apply the first imported theme if possible
					if (themesToImportArr.length > 0) {
						themeToImport = themesToImportArr[0];
					}
					
					// Add imported themes to savedThemes and rerender gallery
					var currentSavedThemes = JSON.parse(await GM.getValue(savedThemesStorageKey) || '[]');
					var newSavedThemes = [...themesToImportArr, ...currentSavedThemes];
					await GM.setValue(savedThemesStorageKey, JSON.stringify(newSavedThemes));
					await buildGallerySection(newSavedThemes);
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

			// clear the import theme input
			document.querySelector("#theme-import-input").value = "";

			// use the js object to change the game's colors
			if (shouldApplyTheme) {
				await applyTheme(themeToImport);
			}

		} catch (error) {
			console.error('theme importing failed');
			console.error(error);
		}
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
	await initThemeColorStuff();
}

main();
