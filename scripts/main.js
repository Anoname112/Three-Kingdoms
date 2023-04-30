var canvas;
var ctx;
var playerCard;
var hoverCard;
var selectCard;
var cityCard;
var marchCard;
var devCard;
var unitCard;
var officerCard;
var deployedCard;
var infoCard;

var gState;		// 0: Pick scenario, 1: Playing, 2: Win, 3: Lose
var battle;
var battleImage;
var mousePos;
var startTimestamp;
var mapAnimationStep;
var squareSize;
var mapSize;
var buttonHeight;
var battleX;
var battleY;
var battleWidth;
var battleHeight;
var infoX;
var infoY;
var infoXHalf;
var infoYHalf;

var date;
var player;
var playerForce;
var forces = [];
var officers = [];
var units = [];

var unitTypes = [];
unitTypes.push(new UnitType('Spearmen', 'foot', 90, 90, 16, 55, [1.0, 1.0, 1.1], 1200));
unitTypes.push(new UnitType('Horsemen', 'horse', 100, 80, 24, 55, [1.1, 1.0, 1.2], 1400));
unitTypes.push(new UnitType('Archer', 'bow', 70, 80, 16, 165, [0.9, 1.1, 1.0], 1000));

/*
1. February 184: Revolt Awakens Heroric Ambitions
2. September 189: Dark Clouds over the Capital
3. March 194: Thunder Rolls from the Central Plains
4. June 200: Two Powers Collide at Guan Du
5. May 207: A Dragon Rises as Chi Bi Burns
6. July 217: Tremors of War Shake Han Zhong
7. April 227: A Struggle between Old Enemies
8. August 253: The Lonely Legacy of the Dead
9. January 250: Heroes Across Time
*/
var scenarios = [];
scenarios.push(new Scenario(
	'Warlords',
	'194-3-1', [
		// Forces
		// name, ruler, color, cities
		['Cao Cao Forces', 15, '#0000FF', [8, 9]],			// 0	
		['Liu Bei Forces', 247, '#00FF00', [10]],			// 1
		['Sun Ce Forces', 382, '#FF0000', [45]],			// 2
		['Lu Bu Forces', 277, '#666666', [7]],				// 3
		['Tao Qian Forces', 415, '#AAFFAA', [11]],			// 4
		['Yuan Shu Forces', 552, '#F516ED', [12, 13]],		// 5
		['Kong Rong Forces', 217, '#AAFFAA', [18]],			// 6
		['Yuan Shao Forces', 551, '#FFFF00', [15, 19, 20]],	// 7
		['Gongsun Zan Forces', 124, '#E33A10', [21, 22]],	// 8
		['Gongsun Du Forces', 117, '#925DF5', [23]],		// 9
		['Zhang Yang Forces', 596, '#3B1604', [17]],		// 10
		['Ma Teng Forces', 303, '#572A03', [0, 1]],			// 11
		['Liu Yong Forces', 269, '#130A45', [44]],			// 12
		['Yan Baihu Forces', 510, '#7A4B1C', [43]],			// 13
		['Wang Lang Forces', 434, '#CCCCCC', [46]],			// 14
		['Shi Xie Forces', 364, '#7A283E', [49]],			// 15
		['Liu Biao Forces', 248, '#2BC8F0', [34, 35, 37]],	// 16
		['Zhang Lu Forces', 580, '#5BF55B', [24]],			// 17
		['Liu Zhang Forces', 272, '#0D0D47', [26, 27, 28]]	// 18
	], [
		// Officers
		// force, name, position
		[0, 'Cao Cao', 8],
		[0, 'Xun Yu', 8],
		[0, 'Guo Jia', 8],		// joined 196
		[0, 'Xiahou Dun', 8],
		[0, 'Xiahou Yuan', 8],
		[0, 'Dian Wei', 8],
		[0, 'Cao Ang', 8],
		[0, 'Cao Ren', 9],
		[0, 'Cao Hong', 9],
		[1, 'Liu Bei', 10],
		[1, 'Guan Yu', 10],
		[1, 'Zhang Fei', 10],
		[2, 'Sun Ce', 45],
		[2, 'Zhou Yu', 45],
		[2, 'Huang Gai', 45],
		[3, 'Lu Bu', 7],
		[3, 'Zhang Liao', 7],
		[3, 'Chen Gong', 7],
		[4, 'Tao Qian', 11],
		[5, 'Yuan Shu', 12],
		[6, 'Kong Rong', 18],
		[7, 'Yuan Shao', 15],
		[7, 'Yuan Shang', 15],
		[7, 'Yuan Tan', 19],
		[7, 'Yuan Xi', 20],
		[8, 'Gongsun Zan', 22],
		[8, 'Zhao Yun', 21],
		[9, 'Gongsun Du', 23],
		[10, 'Zhang Yang', 17],
		[11, 'Ma Teng', 0],
		[11, 'Ma Chao', 0],
		[11, 'Han Sui', 1],
		[12, 'Liu Yong', 44],
		[13, 'Yan Baihu', 43],
		[14, 'Wang Lang', 46],
		[15, 'Shi Xie', 49],
		[16, 'Liu Biao', 35],
		[16, 'Cai Mao', 34],
		[16, 'Huang Zu', 37],
		[17, 'Zhang Lu', 24],
		[18, 'Liu Zhang', 26],
		[18, 'Fa Zheng', 28]
	], [
		// Units
		// type, city, position, morale, strength
		[0, 8, getCityPosition(8), 90, 7000],
		[0, 8, getCityPosition(8), 90, 7000],
		[1, 8, getCityPosition(8), 85, 7000],
		[2, 8, getCityPosition(8), 85, 6500],
		[0, 9, getCityPosition(9), 90, 7000],
		[1, 9, getCityPosition(9), 85, 7000],
		[2, 9, getCityPosition(9), 85, 6500],
		[0, 10, getCityPosition(10), 60, 6000],
		[2, 10, getCityPosition(10), 50, 5500],
		[0, 45, getCityPosition(45), 45, 5000],
		[2, 45, getCityPosition(45), 55, 6000],
		[2, 45, getCityPosition(45), 55, 6000],
		[1, 7, getCityPosition(7), 55, 6000],
		[1, 7, getCityPosition(7), 55, 6000],
		[2, 7, getCityPosition(7), 45, 5000]
	], [
		// Playables
		15, 247, 382, 277
	]
));

var cities = [];
cities[0] = new City('Xi Liang', '-', 5000, 100000, 2400, 2400, 2800, 4000, 400, 400, 600, 2800, 80, '-');
cities[1] = new City('Wu Wei', '-', 5000, 100000, 2400, 2400, 2800, 4000, 400, 400, 600, 2800, 80, '-');
cities[2] = new City('Tian Shui', '-', 5000, 100000, 2400, 2400, 2800, 4000, 400, 400, 600, 2800, 80, '-');
cities[3] = new City('An Ding', '-', 5000, 100000, 2400, 2400, 2800, 4000, 400, 400, 600, 2800, 80, '-');
cities[4] = new City('Chang An', '-', 5000, 100000, 2400, 2400, 2800, 4000, 400, 400, 600, 2800, 80, '-');
cities[5] = new City('Luo Yang', '-', 5000, 100000, 2400, 2400, 2800, 4000, 400, 400, 600, 2800, 80, '-');
cities[6] = new City('He Nei', '-', 5000, 100000, 2400, 2400, 2800, 4000, 400, 400, 600, 2800, 80, '-');
cities[7] = new City('Pu Yang', '-', 5000, 100000, 2400, 2400, 2800, 4000, 400, 400, 600, 2800, 80, '-');
cities[8] = new City('Chen Liu', '-', 5000, 100000, 2400, 2400, 2800, 4000, 400, 400, 600, 2800, 80, '-');
cities[9] = new City('Xu Chang', '-', 5000, 100000, 2400, 2400, 2800, 4000, 400, 400, 600, 2800, 80, '-');
cities[10] = new City('Xiao Pei', '-', 5000, 100000, 2400, 2400, 2800, 4000, 400, 400, 600, 2800, 80, '-');
cities[11] = new City('Xia Pi', '-', 5000, 100000, 2400, 2400, 2800, 4000, 400, 400, 600, 2800, 80, '-');
cities[12] = new City('Shou Chun', '-', 5000, 100000, 2400, 2400, 2800, 4000, 400, 400, 600, 2800, 80, '-');
cities[13] = new City('Lu Jiang', '-', 5000, 100000, 2400, 2400, 2800, 4000, 400, 400, 600, 2800, 80, '-');
cities[14] = new City('Ru Nan', '-', 5000, 100000, 2400, 2400, 2800, 4000, 400, 400, 600, 2800, 80, '-');
cities[15] = new City('Ye', '-', 5000, 100000, 2400, 2400, 2800, 4000, 400, 400, 600, 2800, 80, '-');
cities[16] = new City('Shang Dang', '-', 5000, 100000, 2400, 2400, 2800, 4000, 400, 400, 600, 2800, 80, '-');
cities[17] = new City('Jin Yang', '-', 5000, 100000, 2400, 2400, 2800, 4000, 400, 400, 600, 2800, 80, '-');
cities[18] = new City('Bei Hai', '-', 5000, 100000, 2400, 2400, 2800, 4000, 400, 400, 600, 2800, 80, '-');
cities[19] = new City('Nan Pi', '-', 5000, 100000, 2400, 2400, 2800, 4000, 400, 400, 600, 2800, 80, '-');
cities[20] = new City('Ping Yuan', '-', 5000, 100000, 2400, 2400, 2800, 4000, 400, 400, 600, 2800, 80, '-');
cities[21] = new City('Ji', '-', 5000, 100000, 2400, 2400, 2800, 4000, 400, 400, 600, 2800, 80, '-');
cities[22] = new City('Bei Ping', '-', 5000, 100000, 2400, 2400, 2800, 4000, 400, 400, 600, 2800, 80, '-');
cities[23] = new City('Xiang Ping', '-', 5000, 100000, 2400, 2400, 2800, 4000, 400, 400, 600, 2800, 80, '-');
cities[24] = new City('Han Zhong', '-', 5000, 100000, 2400, 2400, 2800, 4000, 400, 400, 600, 2800, 80, '-');
cities[25] = new City('Wu Du', '-', 5000, 100000, 2400, 2400, 2800, 4000, 400, 400, 600, 2800, 80, '-');
cities[26] = new City('Cheng Du', '-', 5000, 100000, 2400, 2400, 2800, 4000, 400, 400, 600, 2800, 80, '-');
cities[27] = new City('Zi Tong', '-', 5000, 100000, 2400, 2400, 2800, 4000, 400, 400, 600, 2800, 80, '-');
cities[28] = new City('Jiang Zhou', '-', 5000, 100000, 2400, 2400, 2800, 4000, 400, 400, 600, 2800, 80, '-');
cities[29] = new City('Yong An', '-', 5000, 100000, 2400, 2400, 2800, 4000, 400, 400, 600, 2800, 80, '-');
cities[30] = new City('Jian Ning', '-', 5000, 100000, 2400, 2400, 2800, 4000, 400, 400, 600, 2800, 80, '-');
cities[31] = new City('Yun Nan', '-', 5000, 100000, 2400, 2400, 2800, 4000, 400, 400, 600, 2800, 80, '-');
cities[32] = new City('Yong Chang', '-', 5000, 100000, 2400, 2400, 2800, 4000, 400, 400, 600, 2800, 80, '-');
cities[33] = new City('Wan', '-', 5000, 100000, 2400, 2400, 2800, 4000, 400, 400, 600, 2800, 80, '-');
cities[34] = new City('Xin Ye', '-', 5000, 100000, 2400, 2400, 2800, 4000, 400, 400, 600, 2800, 80, '-');
cities[35] = new City('Xiang Yang', '-', 5000, 100000, 2400, 2400, 2800, 4000, 400, 400, 600, 2800, 80, '-');
cities[36] = new City('Shang Yong', '-', 5000, 100000, 2400, 2400, 2800, 4000, 400, 400, 600, 2800, 80, '-');
cities[37] = new City('Jiang Ling', '-', 5000, 100000, 2400, 2400, 2800, 4000, 400, 400, 600, 2800, 80, '-');
cities[38] = new City('Jiang Xia', '-', 5000, 100000, 2400, 2400, 2800, 4000, 400, 400, 600, 2800, 80, '-');
cities[39] = new City('Wu Ling', '-', 5000, 100000, 2400, 2400, 2800, 4000, 400, 400, 600, 2800, 80, '-');
cities[40] = new City('Chang Sha', '-', 5000, 100000, 2400, 2400, 2800, 4000, 400, 400, 600, 2800, 80, '-');
cities[41] = new City('Ling Ling', '-', 5000, 100000, 2400, 2400, 2800, 4000, 400, 400, 600, 2800, 80, '-');
cities[42] = new City('Gui Yang', '-', 5000, 100000, 2400, 2400, 2800, 4000, 400, 400, 600, 2800, 80, '-');
cities[43] = new City('Wu', '-', 5000, 100000, 2400, 2400, 2800, 4000, 400, 400, 600, 2800, 80, '-');
cities[44] = new City('Jian Ye', '-', 5000, 100000, 2400, 2400, 2800, 4000, 400, 400, 600, 2800, 80, '-');
cities[45] = new City('Chai Sang', '-', 5000, 100000, 2400, 2400, 2800, 4000, 400, 400, 600, 2800, 80, '-');
cities[46] = new City('Hui Ji', '-', 5000, 100000, 2400, 2400, 2800, 4000, 400, 400, 600, 2800, 80, '-');
cities[47] = new City('Jian An', '-', 5000, 100000, 2400, 2400, 2800, 4000, 400, 400, 600, 2800, 80, '-');
cities[48] = new City('Nan Hai', '-', 5000, 100000, 2400, 2400, 2800, 4000, 400, 400, 600, 2800, 80, '-');
cities[49] = new City('Jiao Zhi', '-', 5000, 100000, 2400, 2400, 2800, 4000, 400, 400, 600, 2800, 80, '-');

var abilities = [];		// 4: morale, 5: strength, 
abilities[0] = new Ability('True Leader', '', 0, [[4, 30]], [[4, 30]]);
abilities[1] = new Ability('Benevolence', '', 10, [[5, 800]], []);
abilities[3] = new Ability('Tiger', '', 0, [[4, 50]], []);
abilities[3] = new Ability('Conqueror', '', 0, [], [[4, 50]]);
// Demolisher

window.onload = function () {
	window.oncontextmenu = onContextMenu;
	//window.onresize = onResize;
	
	// Prepare canvas
	const ratio = window.devicePixelRatio;
	canvas = getElement('myCanvas');
	canvas.onclick = onMouseClick;
	canvas.onmousemove = onMouseMove;
	canvas.width = window.innerWidth * ratio;
	canvas.height = window.innerHeight * ratio;
	canvas.style.width = window.innerWidth + "px";
    canvas.style.height = window.innerHeight + "px";
    canvas.getContext("2d").scale(ratio, ratio);
	ctx = canvas.getContext('2d');
	
	// Define cards
	playerCard = document.createElement('div');
	playerCard.classList.add('playerCard');
	document.body.appendChild(playerCard);
	
	hoverCard = document.createElement('div');
	hoverCard.classList.add('hoverCard');
	document.body.appendChild(hoverCard);
	
	selectCard = document.createElement('div');
	selectCard.classList.add('selectCard');
	document.body.appendChild(selectCard);
	
	cityCard = document.createElement('div');
	cityCard.classList.add('cityCard');
	document.body.appendChild(cityCard);
	
	marchCard = document.createElement('div');
	marchCard.classList.add('marchCard');
	document.body.appendChild(marchCard);
	
	devCard = document.createElement('div');
	devCard.classList.add('devCard');
	document.body.appendChild(devCard);
	
	unitCard = document.createElement('div');
	unitCard.classList.add('unitCard');
	document.body.appendChild(unitCard);
	
	officerCard = document.createElement('div');
	officerCard.classList.add('officerCard');
	document.body.appendChild(officerCard);
	
	deployedCard = document.createElement('div');
	deployedCard.classList.add('deployedCard');
	document.body.appendChild(deployedCard);
	
	infoCard = document.createElement('div');
	infoCard.classList.add('infoCard');
	document.body.appendChild(infoCard);
	
	// Init sizes
	mapSize = window.innerHeight;
	if (window.innerWidth < window.innerHeight) mapSize = window.innerWidth;
	squareSize = mapSize / map.length;
	buttonHeight = squareSize + buttonPad * 2;
	infoX = isPortrait ? canvasPad : canvasPad * 2 + mapSize;
	infoY = isPortrait ? canvasPad * 2 + mapSize : canvasPad;
	
	infoXHalf = infoX + (window.innerWidth - infoX) / 2;
	infoYHalf = infoY + (window.innerHeight - infoY) / 2;
	
	marchCard.style.left = devCard.style.left = unitCard.style.left = officerCard.style.left = (canvasPad + cardMargin) + 'px';
	marchCard.style.top = devCard.style.top = unitCard.style.top = officerCard.style.top = (canvasPad + cardMargin) + 'px';
	marchCard.style.width = devCard.style.width = unitCard.style.width = officerCard.style.width = (mapSize - (canvasPad + cardMargin) * 2) + 'px';
	marchCard.style.height = devCard.style.height = unitCard.style.height = officerCard.style.height = (mapSize - (canvasPad + cardMargin) * 2) + 'px';
	
	playerCard.style.left = (infoX + cardMargin) + 'px';
	playerCard.style.top = (infoY + cardMargin) + 'px';
	playerCard.style.width = (window.innerWidth - infoX - (cardMargin * 2)) + 'px';
	playerCard.style.height = ((window.innerHeight - infoY) / 4 - (cardMargin * 2)) + 'px';
	
	battleX = infoX;
	battleY = infoY + playerCard.clientHeight + cardMargin * 2;
	battleWidth = window.innerWidth - battleX;
	battleHeight = window.innerHeight - battleY;
	infoCard.style.left = (infoX + cardMargin) + 'px';
	infoCard.style.top = (infoY + playerCard.clientHeight + cardMargin * 2) + 'px';
	infoCard.style.width = (window.innerWidth - infoX - (cardMargin * 2)) + 'px';
	infoCard.style.height = (window.innerHeight - infoY - playerCard.clientHeight - (cardMargin * 3)) + 'px';
	
	playSvg = getElement("playSvg");
	playSvg.onclick = playClick;
	playSvg.style.position = "absolute";
	playSvg.style.top = playSvgPad;
	playSvg.style.right = playSvgPad;
	playSvg.style.width = playerCard.clientHeight - playSvgPad * 2;
	playSvg.style.height = playerCard.clientHeight - playSvgPad * 2;
	
	playerCard.innerHTML = '<div id="playerContent"></div>';
	playerCard.appendChild(playSvg);
	
	// Prepare officers
	for (var i = 0; i < baseOfficers.length; i++) {
		officers.push(new Officer(
			baseOfficers[i]['name'],
			'-',
			'-',
			new Point.Zero(),
			parseInt(baseOfficers[i]['ldr']),
			parseInt(baseOfficers[i]['war']),
			parseInt(baseOfficers[i]['int']),
			parseInt(baseOfficers[i]['pol']),
			parseInt(baseOfficers[i]['chr']),
			'-',
			'-'
		));
	}
	
	//invert map
	for (var i = 0; i < map.length; i++) {
		for (var j = i + 1; j < map.length; j++) {
			var temp = map[i][j];
			map[i][j] = map[j][i];
			map[j][i] = temp;
		}
	}
	
	mousePos = new Point.Zero();
	startTimestamp = mapAnimationStep = gState = 0;
	battle = null;
	battleImage = [];
	/*
	// Play Warlord scenario as Cao Cao right of the bat
	init('Warlords', 15);
	*/
	draw();
}

function init (scenario, officerIndex) {
	applyScenario(scenario);
	
	startPoint = new Point.Zero();
	endPoint = new Point.Zero();
	mousePos = new Point.Zero();
	
	player = officerIndex;
	playerForce = officers[player].Force;
	openPlayerCard();
	
	battle = null;
	gState = 1;
}

function applyScenario (name) {
	for (var i = 0; i < scenarios.length; i++) {
		if (scenarios[i].Name == name) {
			forces = [];
			units = [];
			date = scenarios[i].Date;
			// Forces & Cities
			for (var j = 0; j < scenarios[i].Forces.length; j++) {
				forces.push(new Force(scenarios[i].Forces[j][0], scenarios[i].Forces[j][1], scenarios[i].Forces[j][2]));
				for (var k = 0; k < scenarios[i].Forces[j][3].length; k++) {
					cities[scenarios[i].Forces[j][3][k]].Force = forces.length - 1;
				}
			}
			
			// Officers
			for (var j = 0; j < scenarios[i].Officers.length; j++) {
				var officerName = scenarios[i].Officers[j][1];
				for (var k = 0; k < officers.length; k++) {
					if (officers[k].Name == officerName) {
						officers[k].Force = scenarios[i].Officers[j][0];
						officers[k].City = scenarios[i].Officers[j][2];
						officers[k].Position = getCityPosition(scenarios[i].Officers[j][2]);
					}
				}
			}
			
			// Units
			for (var j = 0; j < scenarios[i].Units.length; j++) {
				units.push(new Unit(scenarios[i].Units[j][0], cities[scenarios[i].Units[j][1]].Force, scenarios[i].Units[j][1], scenarios[i].Units[j][2], scenarios[i].Units[j][3], scenarios[i].Units[j][4], '-', '-', null, null, 0));
			}
		}
	}
}

function onContextMenu (e) {
	e.preventDefault();
}

function onResize (e) {
	updateCanvasSize();
}

function onMouseClick (e) {
	var eX = e.clientX;
	var eY = e.clientY;
	mousePos = new Point(eX, eY);
	
	//infoCard.style.visibility = 'hidden';
	
	if (gState == 0 && startTimestamp == 0) {
		var line = 0;
		for (var i = 0; i < scenarios.length; i++) {
			var x = canvasPad + buttonMargin;
			for (var j = 0; j < scenarios[i].Playables.length; j++) {
				var y = canvasPad + (line * buttonHeight) + (++line * buttonMargin);
				if (eX >= x && eX < x + scenarioWidth && eY >= y && eY < y + buttonHeight) {
					init(scenarios[i].Name, scenarios[i].Playables[j]);
					draw();
				}
			}
		}
	}
	else if (gState == 1 && startTimestamp == 0) {
		if (eX >= canvasPad && eX < canvasPad + mapSize && eY >= canvasPad && eY < canvasPad + mapSize) {
			var indexX = parseInt((eX - canvasPad) / squareSize);
			var indexY = parseInt((eY - canvasPad) / squareSize);
			
			var clickedObjects = [];
			// Clicked city
			if (map[indexX][indexY] >= cityIndexStart) {
				var index = map[indexX][indexY] - cityIndexStart;
				clickedObjects.push([cityCard, index]);
			}
			// Clicked units
			for (var i = 0; i < officers.length; i++) {
				if (officers[i].Objective[0] == 'March' && officers[i].Force == playerForce) {
					var x = canvasPad + officers[i].Position.X * squareSize + unitPad;
					var y = canvasPad + officers[i].Position.Y * squareSize + unitPad;
					var w = squareSize - unitPad * 2;
					var h = squareSize - unitPad * 2;
					if (eX >= x && eX < x + w && eY >= y && eY < y + h) {
						clickedObjects.push([deployedCard, i]);
					}
				}
			}
			
			if (clickedObjects.length > 0) {
				if (clickedObjects.length == 1) {
					if (clickedObjects[0][0] == cityCard) openCityCard(clickedObjects[0][1]);
					else if (clickedObjects[0][0] == deployedCard) openDeployedCard(clickedObjects[0][1]);
				}
				else openSelectCard(clickedObjects);
			}
		}
	}
	else if (battle) {
		var deployed0 = getDeployedUnits(battle[0]);
		var deployed1 = getDeployedUnits(battle[1]);
		if (deployed0.length == 0 || deployed1.length == 0) {
			if (deployed0.length == 0) dismissDeployed(battle[0]);
			if (deployed1.length == 0) dismissDeployed(battle[1]);
			battle = null;
			startTimestamp = 0;
			openInfoCard('City', officers[player].City);
			draw();
			return;
		}
		
		battle[2] = !battle[2];
	}
}

function onMouseMove (e) {
	var eX = e.clientX;
	var eY = e.clientY;
	mousePos = new Point(eX, eY);
	
	hoverCard.style.visibility = 'hidden';
	//infoCard.style.visibility = 'hidden';
	
	if (gState == 0) {
		draw();
	}
	else if (gState == 1) {
		if (eX >= canvasPad && eX < canvasPad + mapSize && eY >= canvasPad && eY < canvasPad + mapSize) {
			var indexX = parseInt((eX - canvasPad) / squareSize);
			var indexY = parseInt((eY - canvasPad) / squareSize);
			
			// Hovering a unit
			for (var i = 0; i < officers.length; i++) {
				if (officers[i].Objective[0] == 'March') {
					var x = canvasPad + officers[i].Position.X * squareSize + unitPad;
					var y = canvasPad + officers[i].Position.Y * squareSize + unitPad;
					var w = squareSize - unitPad * 2;
					var h = squareSize - unitPad * 2;
					if (eX >= x && eX < x + w && eY >= y && eY < y + h) {
						var backColor = 'enemyColor';
						if (officers[i].Force == playerForce) backColor = 'allyColor';
						
						hoverCard.style.visibility = 'visible';
						var hoverX = eX + hoverMarginX;
						var hoverY = eY + hoverMarginY;
						if (hoverX + hoverCard.clientWidth > mapSize) hoverCard.style.left = (hoverX - hoverCard.clientWidth - hoverMarginX * 2) + 'px';
						else hoverCard.style.left = hoverX + 'px';
						if (hoverY + hoverCard.clientHeight > mapSize) hoverCard.style.top = (hoverY - hoverCard.clientHeight - hoverMarginY * 2) + 'px';
						else hoverCard.style.top = hoverY + 'px';
						
						var string = `<div class="unitName ` + backColor + `">` + officers[i].Name + ` Unit</div>
							<div class="unitInfo">
								<img class="smallPortrait" src="portraits/` + officers[i].Name.split(' ').join('_') + `.jpg"><br />
								<table class="stats">
									<tr><th colspan="2">` + forces[officers[i].Force].Name + `</th></tr>
									<tr><th>Strength</th><td style="text-align: center;">` + getDeployedStrength(i) + `</td></tr>
									<tr><th>Target</th><td style="text-align: center;">` + cities[officers[i].Objective[1]].Name + `</td></tr>
								</table>
							</div>`;
						hoverCard.innerHTML = string;
						
						openInfoCard('Unit', i);
						draw();
						return;
					}
				}
			}
			
			// Hovering a city
			if (map[indexX][indexY] >= cityIndexStart) {
				var index = map[indexX][indexY] - cityIndexStart;
				var backColor = 'enemyColor';
				if (cities[index].Force == '-') backColor = 'neutralColor';
				else if (cities[index].Force == playerForce) backColor = 'allyColor';
				
				hoverCard.style.visibility = 'visible';
				var hoverX = eX + hoverMarginX;
				var hoverY = eY + hoverMarginY;
				if (hoverX + hoverCard.clientWidth > mapSize) hoverCard.style.left = (hoverX - hoverCard.clientWidth - hoverMarginX * 2) + 'px';
				else hoverCard.style.left = hoverX + 'px';
				if (hoverY + hoverCard.clientHeight > mapSize) hoverCard.style.top = (hoverY - hoverCard.clientHeight - hoverMarginY * 2) + 'px';
				else hoverCard.style.top = hoverY + 'px';
				
				var string = '<div class="cityName ' + backColor + '">' + cities[index].Name + '</div><div class="cityInfo">';
				if (cities[index].Force == '-') string += '<table class="cityStats">';
				else {
					var forceRulerName = officers[forces[cities[index].Force].Ruler].Name;
					string += '<img class="smallPortrait" src="portraits/' + forceRulerName.split(' ').join('_') + '.jpg"><br />';
					string += '<table class="cityStats"><tr><th colspan="2">' + forces[cities[index].Force].Name + '</th></tr>';
				}
				string += `<tr><th>Gold</th><td>` + cities[index].Gold + `</td></tr>
						<tr><th>Food</th><td>` + cities[index].Food + `</td></tr>
						<tr><th>Strength</th><td>` + getCityStrength(index) + `</td></tr>
						<tr><th>Defense</th><td>` + cities[index].cDefense + `/` + cities[index].Defense + `</td></tr>
						<tr><th>Order</th><td>` + cities[index].cOrder + `/` + moraleLimit + `</td></tr>
					</div>`;
				hoverCard.innerHTML = string;
				
				openInfoCard('City', index);
				draw();
			}
		}
	}
}

function animateUnits (unitIndexs, elapsed) {
	var elapsedSecond = elapsed / 1000;
	for (var i = 0; i < unitIndexs.length; i++) {
		var unit = units[unitIndexs[i]];
		var targetIndex = unit.Target;
		if (Number.isInteger(targetIndex)) {
			var unitType = unitTypes[unit.Type];
			var subtract = units[targetIndex].Vec.subtract(unit.Vec);
			var distance = subtract.length();
			if (distance <= unitType.Range) {
				// Attack target
				unit.Cooldown -= 1 * elapsedSecond;
				if (unit.Cooldown <= 0) {
					var assistedStats = getAssistedStats(unit.Objective[1]);
					var attack = calculateAttack(assistedStats[0], assistedStats[1]);
					var defense = calculateDefense(assistedStats[0], assistedStats[2]);
					units[targetIndex].Strength -= floor(calculateDamage(unit.Morale, attack, defense, unitType.Effectiveness[units[targetIndex].Type]));
					if (units[targetIndex].Strength <= 0) units[targetIndex].Strength = 0;					
					
					unit.Cooldown = unitCooldown;
				}
			}
			else {
				// Walk to target
				var normalized = subtract.normalize();
				unit.Vec = unit.Vec.add(normalized.scale(unitType.Speed * elapsedSecond));
			}
		}
	}
}

function animateBattle (timestamp) {
	if (battle) {
		var currentTimestamp = Date.now();
		var elapsed = currentTimestamp - startTimestamp;
		startTimestamp = currentTimestamp;
		
		if (battle[2]) {
			var attUnits = getDeployedUnits(battle[0]);
			var defUnits = getDeployedUnits(battle[1]);
			// Find Target
			for (var i = 0; i < attUnits.length; i++) if (units[attUnits[i]].Target == null) units[attUnits[i]].Target = getNearestTarget(attUnits[i], defUnits);
			for (var i = 0; i < defUnits.length; i++) if (units[defUnits[i]].Target == null) units[defUnits[i]].Target = getNearestTarget(defUnits[i], attUnits);
			
			animateUnits(attUnits, elapsed);
			animateUnits(defUnits, elapsed);
			
			// Remove defeated units
			for (var i = 0; i < units.length; i++) {
				for (var j = 0; j < units.length; j++) if (units[j].Target == i) units[j].Target = null;
				if (units[i].Strength <= 0) units.splice(i, 1);
			}
		}
		
		draw();
		
		requestAnimationFrame(animateBattle);
	}
}

function initBattle (attCommander, defCommander) {
	battle = [attCommander, defCommander, false];
	battleImage[attCommander] = newImg("portraits/" + officers[attCommander].Name.split(' ').join('_') + ".jpg");
	battleImage[defCommander] = newImg("portraits/" + officers[defCommander].Name.split(' ').join('_') + ".jpg");
	var attUnits = getDeployedUnits(attCommander);
	var defUnits = getDeployedUnits(defCommander);
	
	var attBackRow = [];
	var defBackRow = [];
	for (var i = 0; i < attUnits.length; i++) if (unitTypes[units[attUnits[i]].Type].Name == 'Archer') attBackRow.push(attUnits[i]);
	for (var i = 0; i < defUnits.length; i++) if (unitTypes[units[defUnits[i]].Type].Name == 'Archer') defBackRow.push(defUnits[i]);
	
	var backCount = 0;
	var frontCount = 0;
	for (var i = 0; i < attUnits.length; i++) {
		if (attBackRow.includes(attUnits[i])) {
			units[attUnits[i]].Vec = new Point(
				battleX + unitSize / 2,
				battleY + (battleHeight - unitSize * attBackRow.length) / 2 + (backCount++ * unitSize) + unitSize / 2
			);
		}
		else {
			units[attUnits[i]].Vec = new Point(
				battleX + unitSize + unitSize / 2,
				battleY + (battleHeight - unitSize * (attUnits.length - attBackRow.length)) / 2 + (frontCount++ * unitSize) + unitSize / 2
			);
		}
	}
	
	backCount = 0;
	frontCount = 0;
	for (var i = 0; i < defUnits.length; i++) {
		if (defBackRow.includes(defUnits[i])) {
			units[defUnits[i]].Vec = new Point(
				battleX + battleWidth - unitSize / 2,
				battleY + (battleHeight - unitSize * defBackRow.length) / 2 + (backCount++ * unitSize) + unitSize / 2
			);
		}
		else {
			units[defUnits[i]].Vec = new Point(
				battleX + battleWidth - unitSize - unitSize / 2,
				battleY + (battleHeight - unitSize * (defUnits.length - defBackRow.length)) / 2 + (frontCount++ * unitSize) + unitSize / 2
			);
		}
	}
}

function animateMap (timestamp) {
	mapAnimationStep = (Date.now() - startTimestamp) / animationTime;
	if (mapAnimationStep < 1) {
		draw();
		openPlayerCard();
		requestAnimationFrame(animateMap);
	}
	else {
		startTimestamp = mapAnimationStep = 0;
		// Development and military progress
		var redirected = [];
		for (var i = 0; i < officers.length; i++) {
			if (officers[i].Objective != '-' && !redirected.includes(i)) {
				var objective = officers[i].Objective[0];
				var index = officers[i].Objective[1];
				officers[i].Progress += 10;
				if (officers[i].Progress >= objectiveLength[objective]) {
					switch (objective) {
						case 'Farm':
							cities[index].cFarm += floor(officers[i].POL * devMultiplier);
							if (cities[index].cFarm > cities[index].Farm) cities[index].cFarm = cities[index].Farm;
							cities[index].cOrder -= orderDistrubtion;
							if (cities[index].cOrder < 0) cities[index].cOrder = 0;
							dismissObjective(i);
							break;
						case 'Trade':
							cities[index].cTrade += floor(officers[i].POL * devMultiplier);
							if (cities[index].cTrade > cities[index].Trade) cities[index].cTrade = cities[index].Trade;
							cities[index].cOrder -= orderDistrubtion;
							if (cities[index].cOrder < 0) cities[index].cOrder = 0;
							dismissObjective(i);
							break;
						case 'Tech':
							cities[index].cTech += floor(officers[i].INT * devMultiplier);
							if (cities[index].cTech > cities[index].Tech) cities[index].cTech = cities[index].Tech;
							cities[index].cOrder -= orderDistrubtion;
							if (cities[index].cOrder < 0) cities[index].cOrder = 0;
							dismissObjective(i);
							break;
						case 'Defense':
							cities[index].cDefense += floor(officers[i].WAR * devMultiplier);
							if (cities[index].cDefense > cities[index].Defense) cities[index].cDefense = cities[index].Defense;
							cities[index].cOrder -= orderDistrubtion;
							if (cities[index].cOrder < 0) cities[index].cOrder = 0;
							dismissObjective(i);
							break;
						case 'Order':
							cities[index].cOrder += floor(officers[i].LDR * devMultiplier);
							if (cities[index].cOrder > orderLimit) cities[index].cOrder = orderLimit;
							dismissObjective(i);
							break;
						case 'Establish':
							units.push(new Unit(index, officers[i].Force, officers[i].City, officers[i].Position, establishMorale, floor(officers[i].CHR * recuritMultiplier), '-', '-', null, null, 0));
							dismissObjective(i);
							break;
						case 'Recurit':
							units[index].Strength += floor(officers[i].CHR * recuritMultiplier);
							if (units[index].Strength > strengthLimit) units[index].Strength = strengthLimit;
							units[index].Objective = '-';
							units[index].Progress = '-';
							dismissObjective(i);
							break;
						case 'Drill':
							units[index].Morale += floor(officers[i].LDR * drillMultiplier);
							if (units[index].Morale > moraleLimit) units[index].Morale = moraleLimit;
							units[index].Objective = '-';
							units[index].Progress = '-';
							dismissObjective(i);
							break;
						case 'Employ':
							if (Math.random() * officers[i].CHR > Math.random() * getForceDiligence(officers[index].Force)) {
								if (officers[index].Objective != '-') {
									if (officers[index].Objective[0] == 'March') dismissDeployed(index);
									else if (officers[index].Objective[0] == 'Recurit' || officers[index].Objective[0] == 'Drill') {
										units[officers[index].Objective[1]].Objective = '-';
										units[officers[index].Objective[1]].Progress = '-';
									}
								}
								officers[index].Force = officers[i].Force;
								officers[index].City = officers[i].City;
								officers[index].Objective = ['Return', officers[i].City];
								officers[index].Progress = 0;
								redirected.push(index);
								for (var j = 0; j < officers.length; j++) {
									if (officers[j].Objective != '-' && officers[j].Objective[0] == 'Employ' && officers[j].Objective[1] == index) {
										officers[j].Objective = ['Return', officers[j].City];
										officers[j].Progress = 0;
										redirected.push(j);
									}
								}
							}
							officers[i].Objective = ['Return', officers[i].City];
							officers[i].Progress = 0;
							break;
						case 'Transfer':
							officers[i].City = index;
							officers[i].Position = getCityPosition(index);
							dismissObjective(i);
							break;
						case 'Return':
							officers[i].Position = getCityPosition(index);
							dismissObjective(i);
							break;
					}
				}
			}
		}
		for (var i = 0; i < units.length; i++) {
			if (units[i].Objective != '-') {
				var objective = units[i].Objective[0];
				var index = units[i].Objective[1];
				units[i].Progress += 10;
				if (units[i].Progress >= objectiveLength[objective]) {
					switch (objective) {
						case 'Transfer':
							units[i].City = index;
							units[i].Position = getCityPosition(index);
							units[i].Objective = '-';
							units[i].Progress = '-';
							break;
						case 'Return':
							units[i].Position = getCityPosition(index);
							units[i].Objective = '-';
							units[i].Progress = '-';
							break;
					}
				}
			}
		}
		// Revolts
		for (var i = 0; i < cities.length; i++) {
			if (cities[i].cOrder <= orderLimit / 2 && Math.random() * 100 > cities[i].cOrder) {
				cities[i].cFarm -= revoltImpact + floor(Math.random() * 20 - 5);
				if (cities[i].cFarm < 0) cities[i].cFarm = 0;
				cities[i].cTrade -= revoltImpact + floor(Math.random() * 20 - 5);
				if (cities[i].cTrade < 0) cities[i].cTrade = 0;
				cities[i].cTech -= revoltImpact + floor(Math.random() * 20 - 5);
				if (cities[i].cTech < 0) cities[i].cTech = 0;
				cities[i].cDefense -= revoltImpact + floor(Math.random() * 20 - 5);
				if (cities[i].cDefense < 0) cities[i].cDefense = 0;
			}
		}
		
		// Increase date
		var dateArray = date.split('-').map((x) => parseInt(x));
		dateArray[2] += 10;
		if (dateArray[2] > 30) {
			dateArray[2] = 1;
			dateArray[1] += 1;
			// Trade income and farm harvest
			for (var i = 0; i < cities.length; i++) {
				cities[i].Gold += cities[i].Trade * incomeMultiplier;
				cities[i].Food += cities[i].cFarm * harvestMultiplier;
			}
			
			if (dateArray[1] > 12) {
				dateArray[1] = 1;
				dateArray[0] += 1;
			}
		}
		date = dateArray.join('-');
		openPlayerCard();
		
		// Update positions
		for (var i = 0; i < officers.length; i++) {
			if (officers[i].Objective != '-' && officers[i].Objective[0] == 'March' && (!battle || !battle.includes(i))) {
				var cityCollision = deployedCityCollision(i);
				if (officers[i].Objective[2].Points[1]) {
					var newPos = officers[i].Objective[2].Points[1]
					if (!Number.isInteger(cityCollision)) officers[i].Position = newPos;
					officers[i].Progress += 10;
					for (var j = 0; j < units.length; j++) {
						if (units[j].Objective != '-' && units[j].Objective[0] == 'March' && units[j].Objective[1] == i) {
							if (!Number.isInteger(cityCollision)) units[j].Position = newPos;
							units[j].Progress += 10;
						}
					}
					for (var j = 0; j < officers.length; j++) {
						if (officers[j].Objective != '-' && officers[j].Objective[0] == 'Assist' && officers[j].Objective[1] == i) {
							if (!Number.isInteger(cityCollision)) officers[j].Position = newPos;
							officers[j].Progress += 10;
						}
					}
					officers[i].Objective[2].Points.shift();
				}
				
				// City threatened, attack back
				cityCollision = deployedCityCollision(i);
				if (Number.isInteger(cityCollision)) {
					var viableOfficers = getCityViableOfficers(cityCollision, 'LDR');
					var viableUnits = getCityViableUnits(cityCollision);
					if (viableOfficers.length > 0 && viableUnits.length > 0) {
						var commander = viableOfficers[0];
						var totalCost = 0;
						for (var j = 0; j < viableUnits.length; j++) totalCost += units[viableUnits[j]].Strength * marchCost;
						if (cities[cityCollision].Food >= totalCost) {
							deploy(commander, officers[i].City, viableUnits, []);
							cities[cityCollision].Food -= totalCost;
						}
					}
				}
				
				// Unit collisions
				var unitCollision = deployedUnitCollision(i);
				if (Number.isInteger(unitCollision)) {
					initBattle(i, unitCollision);
					
					startTimestamp = Date.now();
					requestAnimationFrame(animateBattle);
				}
				else if (Number.isInteger(cityCollision)) {
					// Deployed vs City collisions
					cities[cityCollision].cDefense -= floor(getDeployedStrength(i) * demolishMultiplier);
					if (cities[cityCollision].cDefense <= 0) {
						// City taken
						// Dismiss and return all officers to nearest city
					}
				}
			}
		}
		
		openInfoCard('City', officers[player].City);
		
		// Save changes to localStorage
	}
}

function playClick (e) {
	if (startTimestamp > 0) return;
	
	for (var i = 0; i < forces.length; i++) {
		if (i != playerForce) {
			var diligence = getForceDiligence(i);
			// Enemies march
			var marchableCities = getForceMarchableCities(i);
			for (var j = 0; j < marchableCities.length; j++) {
				var source = marchableCities[j];
				var targetCities = getCities(i, 'enemy', [source, 'near']);
				var targetLookup = enemyTargetLookup > targetCities.length ? targetCities.length : enemyTargetLookup;
				for (var k = 0; k < targetLookup; k++) {
					var target = targetCities[k];
					if (getCityStrength(source) * enemyAggresion > getCityStrength(target) && Math.random() * 100 < diligence * enemyAggresion) {
						var viableOfficers = getCityViableOfficers(source, 'LDR');
						var viableUnits = getCityViableUnits(source);
						if (viableOfficers.length > 0 && viableUnits.length > 0) {
							var commander = viableOfficers[0];
							var totalCost = 0;
							for (var l = 0; l < viableUnits.length; l++) totalCost += units[viableUnits[l]].Strength * marchCost;
							if (cities[source].Food >= totalCost) {
								deploy(commander, target, viableUnits, []);
								cities[source].Food -= totalCost;
							}
						}
					}
				}
			}
			
			// Enemies development and military
			var enemyCities = getCities(i, 'force');
			for (var j = 0; j < enemyCities.length; j++) {
				var city = cities[enemyCities[j]];
				var viableOfficers = getCityViableOfficers(enemyCities[j]);
				if (viableOfficers.length > 0) {
					var viableUnits = getCityViableUnits(enemyCities[j]);
					var unitCount = getCityUnitCount(enemyCities[j], true);
					
					var recuritable = false;
					var drillable = false;
					for (var k = 0; k < viableUnits.length; k++) {
						if (units[viableUnits[k]].Strength < strengthLimit) recuritable = true;
						if (units[viableUnits[k]].Morale < moraleLimit) drillable = true;
					}
					
					for (var k = 0; k < viableOfficers.length; k++) {
						if (Math.random() * 100 < diligence) {
							switch (parseInt(Math.random() * (viableUnits.length > 0 ? 10 : 7))) {
								case 0:
									if (city.cFarm < city.Farm && city.Gold >= devCost) assignDevObjective(viableOfficers[k], ['Farm', enemyCities[j]]);
									break;
								case 1:
									if (city.cTrade < city.Trade && city.Gold >= devCost) assignDevObjective(viableOfficers[k], ['Trade', enemyCities[j]]);
									break;
								case 2:
									if (city.cTech < city.Tech && city.Gold >= devCost) assignDevObjective(viableOfficers[k], ['Tech', enemyCities[j]]);
									break;
								case 3:
									if (city.cDefense < city.Defense && city.Gold >= devCost) assignDevObjective(viableOfficers[k], ['Defense', enemyCities[j]]);
									break;
								case 4: case 5:
									if (city.cOrder < orderLimit && city.Gold >= devCost) assignDevObjective(viableOfficers[k], ['Order', enemyCities[j]]);
									break;
								case 6:
									if (unitCount < unitLimit && city.Gold >= getCityHighestEstablishCost()) {
										var unitTypeIndex = parseInt(Math.random() * unitTypes.length);
										officers[viableOfficers[k]].Objective = ['Establish', unitTypeIndex];
										officers[viableOfficers[k]].Progress = 0;
										
										city.Gold -= unitTypes[unitTypeIndex].Cost;
									}
									break;
								case 7:
									if (recuritable && city.Gold >= getCityHighestRecuritCost(enemyCities[j])) {
										for (var l = 0; l < viableUnits.length; l++) {
											if (units[viableUnits[l]].Strength < strengthLimit && units[viableUnits[l]].Objective == '-') {
												officers[viableOfficers[k]].Objective = ['Recurit', viableUnits[l]];
												officers[viableOfficers[k]].Progress = 0;
												units[viableUnits[l]].Objective = ['Recurit', viableOfficers[k]];
												units[viableUnits[l]].Progress = 0;
												
												city.Gold -= unitTypes[units[viableUnits[l]].Type].Cost * recuritCostMultiplier;
												break;
											}
										}
									}
									break;
								case 8: case 9:
									if (drillable) {
										for (var l = 0; l < viableUnits.length; l++) {
											if (units[viableUnits[l]].Morale < moraleLimit && units[viableUnits[l]].Objective == '-') {
												officers[viableOfficers[k]].Objective = ['Drill', viableUnits[l]];
												officers[viableOfficers[k]].Progress = 0;
												units[viableUnits[l]].Objective = ['Drill', viableOfficers[k]];
												units[viableUnits[l]].Progress = 0;
												break;
											}
										}
									}
									break;
							}
						}
					}
				}
			}
		}
	}
	
	// Animate
	startTimestamp = Date.now();
	requestAnimationFrame(animateMap);
}

function draw () {
	// Invalidate
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	
	ctx.font = canvasFont;
	
	// Begin drawing
	ctx.beginPath();
	
	if (gState == 0) {
		var line = 0;
		for (var i = 0; i < scenarios.length; i++) {
			var x = canvasPad + buttonMargin;
			for (var j = 0; j < scenarios[i].Playables.length; j++) {
				var y = canvasPad + (line * buttonHeight) + (++line * buttonMargin);
				var w = scenarioWidth;
				var h = buttonHeight;
				if (mousePos.X >= x && mousePos.X < x + w && mousePos.Y >= y && mousePos.Y < y + h) fillRect(x, y, w, h, finalPathColor);
				drawRect(x, y, w, h, fontDark);
				ctx.fillStyle = fontDark;
				drawMessage(
					'[' + scenarios[i].Date + '] ' + scenarios[i].Name + ': ' + officers[scenarios[i].Playables[j]].Name,
					x + buttonPad,
					y + buttonHeight / 2
				);
			}
		}
	}
	else if (gState == 1) {
		var x = canvasPad;
		var y = canvasPad;
		// Draw background map
		drawImage(mapImage, x, y, map.length * squareSize, map.length * squareSize);
		// Draw roads
		ctx.globalAlpha = roadAlpha;
		for (var i = 0; i < map.length; i++) {
			for (var j = 0; j < map[i].length; j++) {
				var x = canvasPad + i * squareSize;
				var y = canvasPad + j * squareSize;
				
				if (map[i][j] != 1) {
					drawRect(x, y, squareSize, squareSize, cityColor);
					fillRect(x, y, squareSize, squareSize, roadColor);
				}
			}
		}
		ctx.globalAlpha = 1.0;
		
		// Draw cities
		for (var i = 0; i < map.length; i++) {
			for (var j = 0; j < map[i].length; j++) {
				var x = canvasPad + i * squareSize;
				var y = canvasPad + j * squareSize;
				
				if (map[i][j] >= cityIndexStart) {
					var index = map[i][j] - cityIndexStart;
					if (cities[index].Force == '-') {
						var emptyX = x + cityPad;
						var emptyY = y + cityPad;
						var emptySize = squareSize - (2 * cityPad);
						fillRect(emptyX, emptyY, emptySize, emptySize, cityColor);
					}
					else {
						fillRect(x, y, squareSize, squareSize, forces[cities[index].Force].Color);
						ctx.fillStyle = getTextColor(forces[cities[index].Force].Color);
						drawMessage(forces[cities[index].Force].Name[0], x + squareSize / 2, y + squareSize / 2, 'center');
					}
				}
			}
		}
		
		// Draw deployed units
		for (var i = 0; i < officers.length; i++) {
			if (officers[i].Objective[0] == 'March') {
				var x = canvasPad + officers[i].Position.X * squareSize + unitPad;
				var y = canvasPad + officers[i].Position.Y * squareSize + unitPad;
				var w = squareSize - unitPad * 2;
				var h = squareSize - unitPad * 2;
				if (mousePos.X >= x && mousePos.X < x + w && mousePos.Y >= y && mousePos.Y < y + h) {
					var path = officers[i].Objective[2];
					for (var j = 1; j < path.Points.length; j++) {
						var pathX = canvasPad + path.Points[j].X * squareSize + unitPad;
						var pathY = canvasPad + path.Points[j].Y * squareSize + unitPad;
						fillRect(pathX, pathY, w, h, finalPathColor);
					}
				}
				if (officers[i].Objective[2].Points[1]) {
					var diff = officers[i].Position.subtract(officers[i].Objective[2].Points[1]);
					x -= diff.X * squareSize * mapAnimationStep;
					y -= diff.Y * squareSize * mapAnimationStep;
				}
				drawImage(unitImage, x, y, w, h);
			}
		}
		
		// Draw battle scene
		if (battle) {
			closeCard(infoCard);
			drawImage(scene1Image, battleX, battleY, battleWidth, battleHeight);
			
			for (var i = 0; i < units.length; i++) {
				if (units[i].Vec) {
					var pad = unitSize / 6;
					var x = units[i].Vec.X - unitSize / 2 + pad;
					var y = units[i].Vec.Y - unitSize / 2 + pad;
					var size = unitSize - pad * 2;
					
					ctx.fillStyle = cityColor;
					ctx.beginPath();
					ctx.arc(units[i].Vec.X, units[i].Vec.Y, unitSize / 2 - pad + 2 , 0, Math.PI * 2);
					ctx.closePath();
					ctx.fill();
					
					ctx.save();
					ctx.beginPath();
					ctx.arc(units[i].Vec.X, units[i].Vec.Y, unitSize / 2 - pad, 0, Math.PI * 2);
					ctx.clip();
					drawImage(battleImage[units[i].Objective[1]], x, y, size, size);
					ctx.restore();
				}
			}
			
			for (var i = 0; i < units.length; i++) {
				if (units[i].Vec) {
					var icon = units[i].Type == 0 ? '⛨' : (units[i].Type == 1 ? '♞' : '➶');
					drawGlowMessage(icon + units[i].Strength, units[i].Vec.X, units[i].Vec.Y + unitSize / 2, 'center', forces[units[i].Force].Color);
				}
			}
		}
	}
	
	ctx.stroke();
}
