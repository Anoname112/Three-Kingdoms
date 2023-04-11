var canvas;
var ctx;
var hoverCard;

var intervalId;
var instant = false;
var mousePosition;

var date;
var forces = [];
var officers = [];
var units = [];

var unitTypes = [];
unitTypes.push(new UnitType('Spearmen', 'foot', 80, 100, 3, 1, ['bow', 1.2]));
unitTypes.push(new UnitType('Horsemen', 'horse', 100, 80, 5, 1, ['foot', 1.4]));
unitTypes.push(new UnitType('Archer', 'bow', 60, 70, 3, 3, ['horse', 1.3]));

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
	'194-03-01', [
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
		// type, force, position, morale, strength
		[0, 0, 8, 90, 8000],
		[0, 0, 8, 90, 8000],
		[0, 0, 8, 90, 8000],
		[1, 0, 8, 85, 8000],
		[2, 0, 8, 85, 8000],
		[0, 0, 9, 90, 8000],
		[1, 0, 9, 85, 8000],
		[1, 0, 9, 85, 8000],
		[2, 0, 9, 85, 8000]
		
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

var squareSize;
var buttonWidth;
var buttonHeight;

var startPoint = new Point(4, 10);
var endPoint = new Point(5, 10);
var paths;
var explored;
var openset;
var finalPath;

window.onload = function () {
	window.oncontextmenu = onContextMenu;
	window.onresize = onResize;
	window.onclick = onMouseClick;
	window.onmousemove = onMouseMove;
	
	canvas = getElement('myCanvas');
	ctx = canvas.getContext('2d');
	
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	
	hoverCard = document.createElement('div');
	hoverCard.classList.add('hoverCard');
	document.body.appendChild(hoverCard);
	
	// Prepare canvas
	var fill = window.innerHeight;
	if (window.innerWidth < window.innerHeight) fill = window.innerWidth;
	squareSize = fill / map.length;
	buttonWidth = 3.5 * squareSize;
	buttonHeight = 1.5 * squareSize;
	
	// Prepare officers
	for (var i = 0; i < baseOfficers.length; i++) {
		officers.push(new Officer(
			baseOfficers[i]['name'],
			'-',
			new Point(0, 0),
			baseOfficers[i]['ldr'],
			baseOfficers[i]['war'],
			baseOfficers[i]['int'],
			baseOfficers[i]['pol'],
			baseOfficers[i]['chr']
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
	
	reset();
}

function reset () {
	applyScenario('Warlords');
	
	paths = [];
	explored = [];
	openset = [];
	finalPath = null;
	mousePosition = new Point(0, 0);
	
	// Initiate start point and openset
	paths.push(new Path([startPoint]));
	explored.push(startPoint);
	var neighbours = getNeighbours(startPoint);
	for (var i = 0; i < neighbours.length; i++) {
		if (!isExplored(neighbours[i]) && !inOpenset(neighbours[i]) && map[neighbours[i].X][neighbours[i].Y] != 1) {
			openset.push(neighbours[i]);
		}
	}
	
	if (instant) {
		while (finalPath == null && paths.length > 0) expand();
		draw();
	}
	else intervalId  = setInterval(timerTick, timerInterval);
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
						officers[k].Position = scenarios[i].Officers[j][2];
					}
				}
			}
			
			// Units type, force, position, morale, strength
			for (var j = 0; j < scenarios[i].Units.length; j++) {
				units.push(new Unit(scenarios[i].Units[j][0], scenarios[i].Units[j][1], scenarios[i].Units[j][2], scenarios[i].Units[j][3], scenarios[i].Units[j][4], '-', '-'));
			}
		}
	}
}

function onContextMenu (e) {
	e.preventDefault();
}

function onResize (e) {
	//updateCanvasLocation();
}

function onMouseClick (e) {
	var eX = e.clientX;
	var eY = e.clientY;
	
	// Instant button
	var instantX = canvasPadding * 2 + mapWidth * squareSize;
	var instantY = canvasPadding;
	if (eX >= instantX && eX < instantX + buttonWidth && eY >= instantY && eY < instantY + buttonHeight) {
		instant = !instant;
		reset();
	}
	
	// End point
	if (eX >= canvasPadding && eX < canvasPadding + mapWidth * squareSize && eY >= canvasPadding && eY < canvasPadding + mapHeight * squareSize) {
		var indexX = parseInt((eX - canvasPadding) / squareSize);
		var indexY = parseInt((eY - canvasPadding) / squareSize);
		
		if (map[indexX][indexY] != 1 && !(startPoint.X == indexX && startPoint.Y == indexY)) {
			endPoint.X = indexX;
			endPoint.Y = indexY;
			reset();
		}
	}
}

function onMouseMove (e) {
	mousePosition = new Point(e.clientX, e.clientY);
}

function hexToDecimal (decimal) {
	return parseInt(decimal, 16);
}

function getTextColor (cityColor) {
	var r = hexToDecimal(cityColor.slice(1, 3));
	var g = hexToDecimal(cityColor.slice(3, 5));
	var b = hexToDecimal(cityColor.slice(5));
	var average = (r + g + b) / 3;
	
	if (average < 80) return fontLight;
	else return fontDark;
}

function draw () {
	// Invalidate
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	
	hoverCard.style.visibility = 'hidden';
	ctx.font = canvasFont;
	
	// Begin drawing
	ctx.beginPath();
	
	// Draw explored
	for (var i = 0; i < explored.length; i++) {
		var x = canvasPadding + explored[i].X * squareSize;
		var y = canvasPadding + explored[i].Y * squareSize;
		
		fillRect(x, y, squareSize, squareSize, exploredColor);
	}
	
	// Draw openset
	for (var i = 0; i < openset.length; i++) {
		var x = canvasPadding + openset[i].X * squareSize;
		var y = canvasPadding + openset[i].Y * squareSize;
		
		fillRect(x, y, squareSize, squareSize, opensetColor);
	}
	
	// Draw final path
	if (finalPath != null) {
		for (var i = 0; i < finalPath.Points.length; i++) {
			var x = canvasPadding + finalPath.Points[i].X * squareSize;
			var y = canvasPadding + finalPath.Points[i].Y * squareSize;
			
			fillRect(x, y, squareSize, squareSize, finalPathColor);
		}
	}
	
	for (var i = 0; i < map.length; i++) {
		for (var j = 0; j < map[i].length; j++) {
			var x = canvasPadding + i * squareSize;
			var y = canvasPadding + j * squareSize;
			
			ctx.rect(x, y, squareSize, squareSize);
			if (map[i][j] == 1) fillRect(x, y, squareSize, squareSize, wallColor);
		}
	}
	
	// Draw map
	var forceName = '-';
	var forceRulerName = '-';
	var cFarm, Farm, cTrade, Trade, cTech, Tech, cDefense, Defense, cOrder, Order = 0;
	var officerList = [];
	var unitList = [];
	for (var i = 0; i < map.length; i++) {
		for (var j = 0; j < map[i].length; j++) {
			var x = canvasPadding + i * squareSize;
			var y = canvasPadding + j * squareSize;
			
			if (startPoint.X ==  i && startPoint.Y == j) fillRect(x, y, squareSize, squareSize, startColor);
			else if (endPoint.X ==  i && endPoint.Y == j) fillRect(x, y, squareSize, squareSize, endColor);
			
			if (map[i][j] >= 40) {
				var index = map[i][j] - 40;
				var yPad = 160;
				if (cities[index].Force == '-') {
					yPad = 110;
					var emptyX = x + cityPadding;
					var emptyY = y + cityPadding;
					var emptySize = squareSize - (2 * cityPadding);
					fillRect(emptyX, emptyY, emptySize, emptySize, cityColor);
				}
				else {
					fillRect(x, y, squareSize, squareSize, forces[cities[index].Force].Color);
					ctx.fillStyle = getTextColor(forces[cities[index].Force].Color);
					ctx.fillText(forces[cities[index].Force].Name[0], x + squareSize / 4, y + lineHeight);
				}
				
				
				if (mousePosition.X >= x && mousePosition.X < x + squareSize && mousePosition.Y >= y && mousePosition.Y < y + squareSize) {
					// Hovering a city
					hoverCard.style.visibility = 'visible';
					hoverCard.style.top = 'auto';
					hoverCard.style.bottom = 'auto';
					var hoverX = mousePosition.X + 10;
					var hoverY = mousePosition.Y - 0;
					hoverCard.style.left = hoverX + 'px';
					if (hoverY + yPad > window.innerHeight) hoverCard.style.top = (hoverY - yPad) + 'px';
					else hoverCard.style.top = hoverY + 'px';
					var string = '<div class="cityName"><b>' + cities[index].Name + '</b></div><div class="cityInfo">';
					
					if (cities[index].Force != '-') {
						forceName = forces[cities[index].Force].Name;
						forceRulerName = officers[forces[cities[index].Force].Ruler].Name;
						string += '<img class="smallPortrait" src="portraits/' + forceRulerName.split(' ').join('_') + '.jpg"><br />';
						string += '<b>' + forceName + '</b><br />';
					}
					
					string += '<table class="cityStats"><tr><td>Farm:</td><td class="right">' + cities[index].cFarm + '/' + cities[index].Farm +
						'</td></tr><tr><td>Trade:</td><td class="right">' + cities[index].cTrade + '/' + cities[index].Trade +
						'</td></tr><tr><td>Tech:</td><td class="right">' + cities[index].cTech + '/' + cities[index].Tech +
						'</td></tr><tr><td>Defense:&nbsp;</td><td class="right">' + cities[index].cDefense + '/' + cities[index].Defense +
						'</td></tr><tr><td>Order:</td><td class="right">' + cities[index].cOrder + '/100</td></tr></div>';
					hoverCard.innerHTML = string;
					
					for (var k = 0; k < officers.length; k++) if (officers[k].Position == index) officerList.push(k);
					for (var k = 0; k < units.length; k++) if (units[k].Position == index) unitList.push(k);
				}
			}
		}
	}
	
	var x = canvasPadding * 2 + mapWidth * squareSize;
	var y = canvasPadding;	
	if (hoverCard.style.visibility == 'hidden') {
		// Draw instant button
		if (instant) fillRect(x, y, squareSize,squareSize, buttonColor);
		ctx.rect(x, y, buttonWidth, buttonHeight);
		ctx.fillStyle = fontDark;
		ctx.fillText('Instant', x + buttonPadding, y + buttonPadding + lineHeight);
		y += buttonHeight + squareSize;
		
		// Draw infos
		var infos = [
			[startColor, 'Start square'],
			[endColor, 'End square (click to change the end square)'],
			[wallColor, 'Wall'],
			[exploredColor, 'Explored squares'],
			[opensetColor, 'Unexplored neighbours'],
			[finalPathColor, 'Found shortest path']
		];
		for (var i = 0; i < infos.length; i++) {
			fillRect(x, y, squareSize, squareSize, infos[i][0]);
			ctx.fillText(infos[i][1], x + squareSize *  2, y + lineHeight);
			y += squareSize * 2;
		}
	}
	else {
		var pad = 110;
		var add = 30;
		ctx.fillStyle = fontDark;
		ctx.fillText('OFFICERS', x, y + lineHeight);
		ctx.fillText('LDR', x + pad, y + lineHeight);
		ctx.fillText('WAR', x + pad + add, y + lineHeight);
		ctx.fillText('INT', x + pad + add * 2, y + lineHeight);
		ctx.fillText('POL', x + pad + add * 3, y + lineHeight);
		ctx.fillText('CHR', x + pad + add * 4, y + lineHeight);
		y += squareSize;
		for (var i = 0; i < officerList.length; i++) {
			var officer = officers[officerList[i]];
			ctx.fillText('- ' + officer.Name, x, y + lineHeight);
			ctx.fillText(officer.LDR, x + pad, y + lineHeight);
			ctx.fillText(officer.WAR, x + pad + add, y + lineHeight);
			ctx.fillText(officer.INT, x + pad + add * 2, y + lineHeight);
			ctx.fillText(officer.POL, x + pad + add * 3, y + lineHeight);
			ctx.fillText(officer.CHR, x + pad + add * 4, y + lineHeight);
			y += squareSize;
		}
		
		x += 300; y = 0;
		ctx.fillText('UNITS', x, y + lineHeight);
		ctx.fillText('Strength', x + pad, y + lineHeight);
		ctx.fillText('Morale', x + pad * 2, y + lineHeight);
		y += squareSize;
		for (var i = 0; i < unitList.length; i++) {
			var unit = units[unitList[i]];
			ctx.fillText('- ' + unitTypes[unit.Type].Name, x, y + lineHeight);
			ctx.fillText(unit.Strength, x + pad, y + lineHeight);
			ctx.fillText(unit.Morale, x + pad * 2, y + lineHeight);
			y += squareSize;
		}
	}
	
	ctx.stroke();
}

function timerTick () {
	if (finalPath == null && paths.length > 0) expand();
	draw();
}
