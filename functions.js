function getElement (id) {
	return document.getElementById(id);
}

function updateCanvasSize () {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
}

function pause () {
	gState = 0;
	bgm.pause();
}

function resume () {
	gState = 1;
	bgm.play();
}

function playAudio (audio) {
	audio.currentTime = 0;
	audio.play();
}

function stopAudio (audio) {
	audio.pause();
	audio.currentTime = 0;
}

function newImg (path) {
	tempImg = new Image();
	tempImg.src = path;
	images.push(tempImg);
	return tempImg;
}

function drawImage (image, x, y, w, h) {
	w = (w == null) ? image.width : w;
	h = (h == null) ? image.height : h;
	ctx.drawImage(image, x, y, w, h);
}

function drawLifeBeing (image, position, rotation) {
	var centerX = position.X + image.width / 2;
	var centerY = position.Y + image.height / 2;
	
	ctx.save();
	ctx.translate(centerX, centerY);
	ctx.rotate(degreeToRadian(rotation));
	ctx.translate(-centerX, -centerY);
	drawImage(image, position.X, position.Y);
	ctx.restore();
}

function fillRect (x, y, w, h, s) {
	ctx.fillStyle = s == null ? "#000" : s;
	ctx.fillRect(x, y, w, h);
}

function drawLine (x1, y1, x2, y2, s) {
	ctx.strokeStyle = (s == null) ? "#000" : s;
	ctx.beginPath();
	ctx.moveTo(x1, y1);
	ctx.lineTo(x2, y2);
	ctx.closePath();
	ctx.stroke();
}

function drawRect (x, y, w, h, s) {
	ctx.strokeStyle = (s == null) ? "#000" : s;
	ctx.lineWidth = scaling;
	ctx.beginPath();
	ctx.strokeRect(x, y, w, h);
	ctx.closePath();
	ctx.stroke();
}

function drawMessage (msg, x, y, align) {
	ctx.textBaseline = 'middle';
	ctx.textAlign = (align == null) ? "start" : align;
	ctx.fillText(msg, x, y);
}

function floor (value, floor) {
	return Math.floor(value / floor) * floor;
}

function clamp (value, min, max) {
	return Math.max(Math.min(value, max), min);
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

function getCityIndexByName (cityName) {
	for (var i = 0; i < cities.length; i++) if (cities[i].Name == cityName) return i;
	return null;
}

function getCities (forceIndex, alliance, sort) {
	var resultCities = [];
	for (var i = 0; i < cities.length; i++) {
		if (alliance == 'force' && cities[i].Force == forceIndex) resultCities.push(i);
		else if (alliance == 'enemy' && cities[i].Force != forceIndex && cities[i].Force != '-') resultCities.push(i);
		else if (alliance == 'nonForce' && cities[i].Force != forceIndex) resultCities.push(i);
	}
	
	if (sort) {
		// Get enemy distances with the sort source
		var distances = [];
		for (var i = 0; i < resultCities.length; i++) {
			distances.push((getCityPosition(resultCities[i]).subtract(getCityPosition(sort[0]))).length());
		}
		
		if (sort[1] == 'near') {
			for (var i = 0; i < distances.length; i++) {
				for (var j = i + 1; j < distances.length; j++) {
					if (distances[i] > distances[j]) {
						var temp = resultCities[i];
						resultCities[i] = resultCities[j];
						resultCities[j] = temp;
						
						temp = distances[i];
						distances[i] = distances[j];
						distances[j] = temp;
					}
				}
			}
		}
	}
	
	return resultCities;
}

function getCityPosition (cityIndex) {
	var mapValue = cityIndex + cityIndexStart;
	var x = 0;
	var y = 0;
	for (var i = 0; i < map.length; i++) {
		for (var j = 0; j < map[i].length; j++) {
			if (mapValue == map[i][j]) return new Point(i, j);
		}
	}
	return new Point(0, 0);
}

function getCityUnitCount (cityIndex, includeEstablishTransfer) {
	var count = null;
	for (var i = 0; i < units.length; i++) if (units[i].City == cityIndex) count++;
	if (includeEstablishTransfer) {
		for (var i = 0; i < officers.length; i++) {
			if (officers[i].City == cityIndex && officers[i].Objective != '-' && officers[i].Objective[0] == 'Establish') count++;
		}
		for (var i = 0; i < units.length; i++) {
			if (units[i].Objective != '-' && units[i].Objective[0] == 'Transfer' && units[i].Objective[1] == cityIndex) count++;
		}
	}
	return count;
}

function getCityOfficers (cityIndex) {
	var cityOfficers = [];
	for (var i = 0; i < officers.length; i++) {
		if (officers[i].City == cityIndex) cityOfficers.push(i);
	}
	return cityOfficers;
}

function getCityUnits (cityIndex) {
	var cityUnits = [];
	for (var i = 0; i < units.length; i++) {
		if (units[i].City == cityIndex) cityUnits.push(i);
	}
	return cityUnits;
}

function getCityViableOfficers (cityIndex) {
	var viableOfficers = [];
	for (var i = 0; i < officers.length; i++) {
		if (officers[i].City == cityIndex && officers[i].Objective == '-') viableOfficers.push(i);
	}
	return viableOfficers;
}

function getCityViableUnits (cityIndex) {
	var viableUnits = [];
	for (var i = 0; i < units.length; i++) {
		if (units[i].City == cityIndex && units[i].Objective == '-') viableUnits.push(i);
	}
	return viableUnits;
}

function getCityStrength (cityIndex) {
	var viableUnits = getCityViableUnits(cityIndex);
	var strength = 0;
	for (var i = 0; i < viableUnits.length; i++) strength += units[viableUnits[i]].Strength;
	return strength;
}

function getForceViableOfficers (forceIndex) {
	var viableOfficers = [];
	for (var i = 0; i < officers.length; i++) {
		if (officers[i].Force == forceIndex && officers[i].Objective == '-') viableOfficers.push(i);
	}
	return viableOfficers;
}

function getForceViableUnits (forceIndex) {
	var viableUnits = [];
	for (var i = 0; i < units.length; i++) {
		if (units[i].Force == forceIndex && units[i].Objective == '-') viableUnits.push(i);
	}
	return viableUnits;
}

function getForceStrength (forceIndex) {
	var viableUnits = getForceViableUnits(forceIndex);
	var strength = 0;
	for (var i = 0; i < viableUnits.length; i++) strength += units[viableUnits[i]].Strength;
	return strength;
}

function getForceMarchableCities (forceIndex) {
	// Cities that have both available officers and available units
	var marchable = [];
	for (var i = 0; i < cities.length; i++) {
		if (cities[i].Force == forceIndex && getCityViableOfficers(i).length > 0 && getCityViableUnits(i).length > 0) marchable.push(i);
	}
	return marchable;
}

function getDeployedUnits (commander) {
	var deployedUnits = [];
	for (var i = 0; i < units.length; i++) {
		if (units[i].Objective != '-' && units[i].Objective[0] == 'March' && units[i].Objective[1] == commander) deployedUnits.push(i);
	}
	return deployedUnits;
}

function getDeployedStrength (commander) {
	var deployedUnits = getDeployedUnits(commander);
	var strength = 0;
	for (var i = 0; i < deployedUnits.length; i++) strength += units[deployedUnits[i]].Strength;
	return strength;
}

function getEnemyForces (forceIndex) {
	var enemyForces = [];
	for (var i = 0; i < forces.length; i++) {
		if (i != forceIndex) enemyForces.push(i);
	}
	return enemyForces;
}

function getOfficerIndexByName (officerName) {
	for (var i = 0; i < officers.length; i++) if (officers[i].Name == officerName) return i;
	return null;
}

function getStats (officerName) {
	for (var i = 0; i < officers.length; i++) {
		if (officers[i].Name == officerName) {
			return [officers[i].LDR, officers[i].WAR, officers[i].INT, officers[i].POL, officers[i].CHR];
		}
	}
	return [];
}

function getAssistedStats (officerIndex) {
	var stats = getStats(officers[officerIndex].Name);
	for (var i = 0; i < officers.length; i++) {
		if (officers[i].Objective[0] == 'Assist' && officers[i].Objective[1] == officerIndex) {
			stats[0] += assistPercentage / 100 * officers[i].LDR;
			stats[1] += assistPercentage / 100 * officers[i].WAR;
			stats[2] += assistPercentage / 100 * officers[i].INT;
		}
	}
	return stats;
}

function calculateStats (officerName) {
	for (var i = 0; i < officers.length; i++) {
		if (officers[i].Name == officerName) {
			return [calculateAttack(officers[i].LDR, officers[i].WAR), calculateDefense(officers[i].LDR, officers[i].INT)];
		}
	}
	return [];
}

function calculateAttack (LDR, WAR) {
	return (0.775 * LDR) + (0.225 * WAR);
}

function calculateDefense (LDR, INT) {
	return (0.925 * LDR) + (0.075 * INT);
}

function calculateDamage (morale, attack, defense, effectiveness) {
	var e = effectiveness ? effectiveness : 1.0;
	return (50 + (morale / 2) + (morale * attack / defense)) * e;
}

function forceDiligence (forceIndex) {
	var rulerStats = getStats(officers[forces[forceIndex].Ruler].Name);
	var totalInfluence = 0;
	for (var i = 0; i < influence.length; i++) {
		totalInfluence += rulerStats[i] * influence[i];
	}
	return totalInfluence;
}

function createCityTable (cityIndex) {
	var city = cities[cityIndex];
	var forceName = forces[city.Force] ? forces[city.Force].Name : '-'
	return `<table class="stats">
			<tr><th colspan="2">` + forceName + `</th><th>Farm</th><td>` + city.cFarm + `/` + city.Farm + `</td></tr>
			<tr><th>Gold</th><td>` + city.Gold + `</td><th>Trade</th><td>` + city.cTrade + `/` + city.Trade + `</td></tr>
			<tr><th>Food</th><td>` + city.Food + `</td><th>Tech</th><td>` + city.cTech + `/` + city.Tech + `</td></tr>
			<tr><th>Strength</th><td>` + getCityStrength(cityIndex) + `</td><th>Defense</th><td>` + city.cDefense + `/` + city.Defense + `</td></tr>
			<tr><th>Speciality</th><td>` + city.Speciality + `</td><th>Order</th><td>` + city.cOrder + `/100</td></tr>
		</table>`;
}

function createOfficersTable (officersIndex) {
	var officersHTML = '';
	for (var i = 0; i < officersIndex.length; i++) {
		var officer = officers[officersIndex[i]];
		var objective = officer.Objective == '-' ? '-' : officer.Objective[0];
		officersHTML += `<tr>
				<td>` + officer.Name + `</td>
				<td>` + officer.LDR + `</td>
				<td>` + officer.WAR + `</td>
				<td>` + officer.INT + `</td>
				<td>` + officer.POL + `</td>
				<td>` + officer.CHR + `</td>
				<td>` + objective + `</td>
				<td>` + officer.Progress + `</td>
			</tr>`;
	}
	return `<table class="stats">
		<tr>
			<th>Officers (` + officersIndex.length + `)</th>
			<th>LDR</th>
			<th>WAR</th>
			<th>INT</th>
			<th>POL</th>
			<th>CHR</th>
			<th>Objective</th>
			<th>Progress</th>
		</tr>` + officersHTML + `</table>`;
}

function createUnitsTable (unitsIndex) {
	var unitsHTML = '';
	for (var i = 0; i < unitsIndex.length; i++) {
		var unit = units[unitsIndex[i]];
		var objective = unit.Objective == '-' ? '-' : unit.Objective[0];
		var target = '-';
		switch (objective) {
			case 'Transfer':
				target = unit.Objective == '-' ? '-' : cities[unit.Objective[1]].Name;
				break;
			case 'March':
			case 'Recurit':
			case 'Drill':
				target = unit.Objective == '-' ? '-' : officers[unit.Objective[1]].Name;
				break;
		}
		unitsHTML += `<tr>
				<td>` + unitTypes[unit.Type].Name + `</td>
				<td>` + unit.Strength + `</td>
				<td>` + unit.Morale + `</td>
				<td>` + objective + `</td>
				<td>` + target + `</td>
				<td>` + unit.Progress + `</td>
			</tr>`;
	}
	return `<table class="stats">
		<tr>
			<th>Units (` + unitsIndex.length + `)</th>
			<th>Strength</th>
			<th>Morale</th>
			<th>Objective</th>
			<th>Target</th>
			<th>Progress</th>
		</tr>` + unitsHTML + `</table>`;
}

function createStatsTable (officerIndex) {
	var officer = officers[officerIndex];
	return `<table class="stats">
			<tr><th>LDR</th><th>WAR</th><th>INT</th><th>POL</th><th>CHR</th></tr>
			<tr>
				<td>` + officer.LDR + `</td>
				<td>` + officer.WAR + `</td>
				<td>` + officer.INT + `</td>
				<td>` + officer.POL + `</td>
				<td>` + officer.CHR + `</td>
			</tr>
		</table>`;
}

function calculatedStatsTable (elementId, LDR, WAR, INT) {
	getElement(elementId).innerHTML = `<table class="stats">
			<tr><th>LDR</th><th>WAR</th><th>INT</th><th>ATK</th><th>DEF</th></tr>
			<tr>
				<td>` + LDR.toFixed(1) + `</td>
				<td>` + WAR.toFixed(1) + `</td>
				<td>` + INT.toFixed(1) + `</td>
				<td>` + calculateAttack(LDR, WAR).toFixed(1) + `</td>
				<td>` + calculateDefense(LDR, INT).toFixed(1) + `</td>
			</tr>
		</table>`;
}

// Player card
function openPlayerCard () {
	var playerContent = getElement('playerContent');
	
	playerContent.innerHTML = `<div class="timeSpace allyColor">` +
			date + `&nbsp;
			<div class="forceSquare" style="background-color: ` + forces[playerForce].Color + `;"></div>&nbsp;` +
			cities[officers[player].City].Name + `
		</div>
		<div class="playerContent">
			<div class="playerPortrait"><img class="bigPortrait" src="portraits/` + officers[player].Name.split(' ').join('_') + `.jpg"></div>
			<div class="playerProfile">
				<div class="playerName allyColor">` + officers[player].Name + `</div>
				<b>` + forces[playerForce].Name + `</b>
				` + createStatsTable(player) + `
			</div>
		</div>`;
	
	playerCard.style.visibility = 'visible';
}

// Select card
function openSelectCard (clickedObjects) {
	var buttons = '';
	for (var i = 0; i < clickedObjects.length; i++) {
		if (clickedObjects[i][0] == cityCard) {
			var cityName = cities[clickedObjects[i][1]].Name;
			buttons += '<input type="button" value="' + cityName + '" onclick="openCityCard(' + clickedObjects[i][1] + ', true)">';
		}
		else if (clickedObjects[i][0] == deployedCard) {
			var commanderName = officers[clickedObjects[i][1]].Name;
			buttons += '<input type="button" value="' + commanderName + '" onclick="openDeployedCard(' + clickedObjects[i][1] + ', true)">';
		}
	}
	selectCard.innerHTML = `<div class="selectContent">` + buttons + `<input type="button" value="Cancel" onclick="closeCard(selectCard)"></div>`;
	
	selectCard.style.visibility = 'visible';
	if (mousePos.X + selectCard.clientWidth > mapSize) selectCard.style.left = (mousePos.X - selectCard.clientWidth) + 'px';
	else selectCard.style.left = mousePos.X + 'px';
	if (mousePos.Y + selectCard.clientHeight > mapSize) selectCard.style.top = (mousePos.Y - selectCard.clientHeight) + 'px';
	else selectCard.style.top = mousePos.Y + 'px';
}

function getLowestMarchCost (cityIndex) {
	var cost = strengthLimit * marchCost;
	var viableUnits = getCityViableUnits(cityIndex);
	for (var i = 0; i < viableUnits.length; i++) {
		var unit = units[viableUnits[i]];
		if (unit.City == cityIndex && unit.Strength * marchCost < cost) cost = unit.Strength * marchCost;
	}
	return cost;
}

function getLowestEstablishCost () {
	var cost = unitTypes[0].Cost;
	for (var i = 1; i < unitTypes.length; i++) if (unitTypes[i].Cost < cost) cost = unitTypes[i].Cost;
	return cost;
}

function getHighestEstablishCost () {
	var cost = unitTypes[0].Cost;
	for (var i = 1; i < unitTypes.length; i++) if (unitTypes[i].Cost > cost) cost = unitTypes[i].Cost;
	return cost;
}

function getLowestRecuritCost (cityIndex) {
	var cost = getHighestEstablishCost();
	var viableUnits = getCityViableUnits(cityIndex);
	for (var i = 0; i < viableUnits.length; i++) {
		var recuritCost = unitTypes[units[viableUnits[i]].Type].Cost * recuritMultiplier;
		if (recuritCost < cost) cost = recuritCost;
	}
	return cost;
}

function getTransferCities (cityIndex) {
	var forceCities = getCities(cities[cityIndex].Force, 'force', [cityIndex, 'near']);
	var transferCities = [];
	for (var i = 0; i < forceCities.length; i++) {
		if (forceCities[i] != cityIndex && getCityUnitCount(forceCities[i], true) < unitLimit) {
			transferCities.push(forceCities[i]);
		}
	}
	return transferCities;
}

// City card
function openCityCard (cityIndex, select) {
	if (select) closeCard(selectCard);
	openInfoCard('City', cityIndex);
	
	var city = cities[cityIndex];
	var backColor = 'enemyColor';
	
	hoverCard.style.visibility = 'hidden';
	
	var buttons = '';
	if (city.Force == playerForce) {
		backColor = 'allyColor';
		var viableOfficers = getCityViableOfficers(cityIndex);
		var viableUnits = getCityViableUnits(cityIndex);
		var unitCount = getCityUnitCount(cityIndex, true);
		
		var recuritable = false;
		var drillable = false;
		for (var i = 0; i < viableUnits.length; i++) {
			if (units[viableUnits[i]].Strength < strengthLimit) recuritable = true;
			if (units[viableUnits[i]].Morale < 100) drillable = true;
		}
		
		var marchDisabled = viableOfficers.length > 0 && viableUnits.length > 0 && city.Food >= getLowestMarchCost(cityIndex) ? '' : ' disabled';
		var farmDisabled = viableOfficers.length > 0 && city.cFarm < city.Farm && city.Gold >= devCost ? '' : ' disabled';
		var tradeDisabled = viableOfficers.length > 0 && city.cTrade < city.Trade && city.Gold >= devCost ? '' : ' disabled';
		var techDisabled = viableOfficers.length > 0 && city.cTech < city.Tech && city.Gold >= devCost ? '' : ' disabled';
		var defenseDisabled = viableOfficers.length > 0 && city.cDefense < city.Defense && city.Gold >= devCost ? '' : ' disabled';
		var orderDisabled = viableOfficers.length > 0 && city.cOrder < 100 && city.Gold >= devCost ? '' : ' disabled';
		var establishDisabled = viableOfficers.length > 0 && unitCount < unitLimit && city.Gold >= getLowestEstablishCost() ? '' : ' disabled';
		var recuritDisabled = viableOfficers.length > 0 && recuritable && city.Gold >= getLowestRecuritCost(cityIndex) ? '' : ' disabled';
		var drillDisabled = viableOfficers.length > 0 && drillable ? '' : ' disabled';
		var transferDisabled = viableUnits.length > 0 && getTransferCities(cityIndex).length > 0 ? '' : ' disabled';
		
		buttons += `<input type="button" value="March" onclick="openMarchCard(` + cityIndex + `)"` + marchDisabled + `>
			<div class="buttonsGroup">
				<div class="label">Development &#9654;</div>
				<div class="buttons">
					<input type="button" value="Farm" onclick="openDevCard(` + cityIndex + `, 'Farm')"` + farmDisabled + `>
					<input type="button" value="Trade" onclick="openDevCard(` + cityIndex + `, 'Trade')"` + tradeDisabled + `>
					<input type="button" value="Tech" onclick="openDevCard(` + cityIndex + `, 'Tech')"` + techDisabled + `>
					<input type="button" value="Defense" onclick="openDevCard(` + cityIndex + `, 'Defense')"` + defenseDisabled + `>
					<input type="button" value="Order" onclick="openDevCard(` + cityIndex + `, 'Order')"` + orderDisabled + `>
				</div>
			</div>
			<div class="buttonsGroup">
				<div class="label">Military &#9654;</div>
				<div class="buttons">
					<input type="button" value="Establish" onclick="openUnitCard(` + cityIndex + `, 'Establish')"` + establishDisabled + `>
					<input type="button" value="Recurit" onclick="openUnitCard(` + cityIndex + `, 'Recurit')"` + recuritDisabled + `>
					<input type="button" value="Drill" onclick="openUnitCard(` + cityIndex + `, 'Drill')"` + drillDisabled + `>
					<input type="button" value="Transfer" onclick="openUnitCard(` + cityIndex + `, 'Transfer')"` + transferDisabled + `>
				</div>
			</div>
			<input type="button" value="Cancel" onclick="closeCard(cityCard)">`;
	}
	else {
		if (city.Force == '-') backColor = 'neutralColor';
		var disabled = (getForceMarchableCities(playerForce).length > 0) ? '' : ' disabled';
		buttons += `<input type="button" value="March" onclick="openMarchCard(` + cityIndex + `)"` + disabled + `>
			<input type="button" value="Cancel" onclick="closeCard(cityCard)">`;
	}
	
	var string = `<div class="cityName ` + backColor + `">` + city.Name + `</div>
		<div class="cityContent">` + buttons + `</div>`;
	cityCard.innerHTML = string;
	
	cityCard.style.visibility = 'visible';
	if (mousePos.X + cityCard.clientWidth + buttonWidth > mapSize) cityCard.style.left = (mousePos.X - cityCard.clientWidth) + 'px';
	else cityCard.style.left = mousePos.X + 'px';
	if (mousePos.Y + cityCard.clientHeight > mapSize) cityCard.style.top = (mousePos.Y - cityCard.clientHeight) + 'px';
	else cityCard.style.top = mousePos.Y + 'px';
}

// March card
function march () {
	// Check target and source (should be player force)
	var source = getElement('source') ? getElement('source').value : '';
	var target = getElement('target') ? getElement('target').value : '';
	source = getCityIndexByName(source);
	target = getCityIndexByName(target);
	if (Number.isInteger(source) && Number.isInteger(target) && getCities(playerForce, 'force').includes(source)) {
		// Check commander
		var commander = getElement('commander') ? getElement('commander').value : '';
		commander = getOfficerIndexByName(commander);
		if (Number.isInteger(commander)) {
			// Check deploy units
			var deployUnits = [];
			for (var i = 0; i < units.length; i++) {
				if (getElement('unit' + i) && getElement('unit' + i).checked) deployUnits.push(i);
			}
			if (deployUnits.length > 0) {
				// Check assist officers
				var assistOfficers = [];
				for (var i = 0; i < officers.length; i++) {
					if (getElement('officer' + i) && getElement('officer' + i).checked) assistOfficers.push(i);
				}
				
				// Assign objectives
				var totalStrength = 0;
				initPathfinding();
				startPathfinding(officers[commander].Position, getCityPosition(target));
				officers[commander].Objective = ['March', target, finalPath];
				officers[commander].Progress = 0;
				for (var i = 0; i < deployUnits.length; i++) {
					units[deployUnits[i]].Objective = ['March', commander];
					units[deployUnits[i]].Progress = 0;
					totalStrength += units[deployUnits[i]].Strength;
				}
				for (var i = 0; i < assistOfficers.length; i++) {
					officers[assistOfficers[i]].Objective = ['Assist', commander];
					officers[assistOfficers[i]].Progress = 0;
				}
				
				// Apply cost
				cities[source].Food -= totalStrength * marchCost;
				
				closeCard(marchCard);
				openInfoCard('City', source);
				draw();
			}
		}
	}
}

// March card
function assistedStats () {
	getElement('assistedStats').innerHTML = '';
	
	var isAssisted = false;
	var commander = getElement('commander') ? getElement('commander').value : '';
	var stats = getStats(commander);
	if (stats.length > 0) {
		for (var i = 0; i < officers.length; i++) {
			var checkbox = getElement('officer' + i);
			if (checkbox && checkbox.checked) {
				stats[0] += assistPercentage / 100 * officers[i].LDR;
				stats[1] += assistPercentage / 100 * officers[i].WAR;
				stats[2] += assistPercentage / 100 * officers[i].INT;
				isAssisted = true;
			}
		}
	}
	if (isAssisted) {
		calculatedStatsTable('assistedStats', stats[0], stats[1], stats[2]);
	}
}

// March card
function commanderChanged (source) {
	getElement('relevantStats').innerHTML = '';
	if (getElement('assistDiv')) {
		getElement('assistDiv').innerHTML = '';
		getElement('assistDiv').style.visibility = 'hidden';
		getElement('assistedStats').innerHTML = '';
	}
	
	var commander = getElement('commander') ? getElement('commander').value : '';
	var stats = getStats(commander);
	if (stats.length > 0) {
		calculatedStatsTable('relevantStats', stats[0], stats[1], stats[2]);
		
		var viableOfficers = getCityViableOfficers(source);
		var assistHTML = '';
		for (var i = 0; i < viableOfficers.length; i++) {
			var officer = officers[viableOfficers[i]];
			if (officer.Name != commander) {
				assistHTML += `<label for="officer` + viableOfficers[i] + `" onclick="assistedStats()">
						<input type="checkbox" id="officer` + viableOfficers[i] + `">
						<span>` + officer.Name + ` | ` + officer.LDR + ` | ` + officer.WAR + ` | ` + officer.INT + `</span>
					</label>`;
			}
		}
		if (assistHTML.length > 0) {
			getElement('assistDiv').innerHTML = assistHTML;
			getElement('assistDiv').style.visibility = 'visible';
		}
		
	}
}

function createUnitDivInnerHTML (cityIndex) {
	var viableUnits = getCityViableUnits(cityIndex);
	var unitsHTML = '';
	for (var i = 0; i < viableUnits.length; i++) {
		var unit = units[viableUnits[i]];
		unitsHTML += `<label for="unit` + viableUnits[i] + `">
				<input type="checkbox" id="unit` + viableUnits[i] + `">
				<span>` + unitTypes[unit.Type].Name + ` | ` + unit.Strength + ` | ` + unit.Morale + `</span>
			</label>`;
	}
	return `Units: (type | strength | morale)<br /><div class="checkboxes">` + unitsHTML + `</div>`;
}

// March card
function sourceChanged () {
	getElement('officerListDiv').innerHTML = '';
	getElement('commanderDiv').innerHTML = '';
	getElement('relevantStats').innerHTML = '';
	getElement('unitsDiv').innerHTML = '';
	getElement('assistDiv').innerHTML = '';
	getElement('assistDiv').style.visibility = 'hidden';
	getElement('assistedStats').innerHTML = '';
	
	var source = getElement('source') ? getElement('source').value : '';
	source = getCityIndexByName(source);
	if (Number.isInteger(source)) {
		var viableOfficers = getCityViableOfficers(source);
		var officersHTML = '';
		for (var i = 0; i < viableOfficers.length; i++) {
			officersHTML += '<option value="' + officers[viableOfficers[i]].Name + '">'
		}
		
		getElement('officerListDiv').innerHTML = '<datalist id="officerList">' + officersHTML + '</datalist>';
		getElement('commanderDiv').innerHTML = 'Commander: <input type="text" id="commander" list="officerList" oninput="commanderChanged(' + source + ')">';
		getElement('unitsDiv').innerHTML = createUnitDivInnerHTML(source);
	}
}

// March card
function openMarchCard (cityIndex) {
	closeCard(cityCard);
	
	var city = cities[cityIndex];
	var source = null;
	var target = null;
	
	var officersHTML = '';
	var sourceTargetDiv = '';
	var commanderDiv = '';
	var unitsDiv = '';
	
	var string = '';
	if (city.Force == playerForce) {
		source = cityIndex;
		var targets = getCities(city.Force, 'nonForce', [source, 'near']);
		var targetsHTML = '';
		for (var i = 0; i < targets.length; i++) {
			targetsHTML += '<option value="' + cities[targets[i]].Name + '">'
		}
		
		var viableOfficers = getCityViableOfficers(source);
		for (var i = 0; i < viableOfficers.length; i++) {
			officersHTML += '<option value="' + officers[viableOfficers[i]].Name + '">'
		}
		officersHTML = '<div id="officerListDiv"><datalist id="officerList">' + officersHTML + '</datalist></div>';
		
		sourceTargetDiv = `<td>Source: <input type="text" id="source" value="` + cities[source].Name + `" readonly></td>
			<td>Target: <input type="text" id="target" list="targetList"></td>`;
		
		commanderDiv = `<div id="commanderDiv">
				Commander: <input type="text" id="commander" list="officerList" oninput="commanderChanged(` + source + `)">
			</div>`;
		
		unitsDiv = `<div id="unitsDiv">` + createUnitDivInnerHTML(source) + `</div>`;
		
		string = `<datalist id="targetList">` + targetsHTML + `</datalist>`;
	}
	else {
		target = cityIndex;
		var marchableCities = getForceMarchableCities(playerForce);
		var nearestCities = getCities(playerForce, 'force', [target, 'near']);
		var sourcesHTML = '';
		for (var i = 0; i < nearestCities.length; i++) {
			if (marchableCities.includes(nearestCities[i])) sourcesHTML += '<option value="' + cities[nearestCities[i]].Name + '">';
		}
		
		officersHTML = '<div id="officerListDiv"></div>';
		
		sourceTargetDiv = `<td>Source: <input type="text" id="source" list="sourceList" oninput="sourceChanged()"></td>
			<td>Target: <input type="text" id="target" value="` + cities[target].Name + `" readonly></td>`;
			
		commanderDiv = `<div id="commanderDiv"></div>`;
		
		unitsDiv = `<div id="unitsDiv"></div>`;
		
		string = `<datalist id="sourceList">` + sourcesHTML + `</datalist>`;
	}
	
	string = officersHTML + string + 
		`<div class="title allyColor">March</div>
		<div class="marchContent">
			<table>
				<tr>` + sourceTargetDiv + `</tr>
				<tr>
					<td>` + commanderDiv + `</td>
					<td><div id="relevantStats"></div></td>
				</tr>
				<tr>
					<td>` + unitsDiv + `</td>
				</tr>
				<tr>
					<td><div id="assistDiv" class="checkboxes"></div></td>
					<td><div id="assistedStats"></div></td>
				</tr>
				<tr>
					<td><input type="button" value="March" onclick="march()"> <input type="button" value="Cancel" onclick="closeCard(marchCard)"></td>
				</tr>
			</table>
		</div>`;
	
	marchCard.innerHTML = string;
	marchCard.style.visibility = 'visible';
}

// Dev card
function develop (cityIndex, objective) {
	if (Number.isInteger(cityIndex) && (objective == 'Farm' || objective == 'Trade' || objective == 'Tech' || objective == 'Defense' || objective == 'Order')) {
		// Check officers
		var devOfficers = [];
		for (var i = 0; i < officers.length; i++) {
			if (getElement('officer' + i) && getElement('officer' + i).checked) devOfficers.push(i);
		}
		
		if (devOfficers.length > 0) {
			// Assign objectives
			for (var i = 0; i < devOfficers.length; i++) {
				officers[devOfficers[i]].Objective = [objective, cityIndex];
				officers[devOfficers[i]].Progress = 0;
			}
			
			// Apply cost
			cities[cityIndex].Gold -= devOfficers.length * devCost;
			
			closeCard(devCard);
			openInfoCard('City', cityIndex);
			draw();
		}
	}
}

// Dev card
function openDevCard (cityIndex, objective) {
	closeCard(cityCard);
	
	var viableOfficers = getCityViableOfficers(cityIndex);
	if (viableOfficers.length > 0) {
		var city = cities[cityIndex];
		
		var objectiveHTML = '';
		switch (objective) {
			case 'Farm':
				objectiveHTML += 'Farm: <input type="text" value="' + city.cFarm + '/' + city.Farm + '" readonly>';
				break;
			case 'Trade':
				objectiveHTML += 'Trade: <input type="text" value="' + city.cTrade + '/' + city.Trade + '" readonly>';
				break;
			case 'Tech':
				objectiveHTML += 'Tech: <input type="text" value="' + city.cTech + '/' + city.Tech + '" readonly>';
				break;
			case 'Defense':
				objectiveHTML += 'Defense: <input type="text" value="' + city.cDefense + '/' + city.Defense + '" readonly>';
				break;
			case 'Order':
				objectiveHTML += 'Order: <input type="text" value="' + city.cOrder + '/100" readonly>';
				break;
			default:
				break;
		}
		
		var viableOfficers = getCityViableOfficers(cityIndex);
		// Sort
		for (var i = 0; i < viableOfficers.length; i++) {
			for (var j = i + 1; j < viableOfficers.length; j++) {
				if (((objective == 'Farm' || objective == 'Trade') && officers[viableOfficers[i]].POL < officers[viableOfficers[j]].POL) ||
					(objective == 'Tech' && officers[viableOfficers[i]].INT < officers[viableOfficers[j]].INT) ||
					(objective == 'Defense' && officers[viableOfficers[i]].WAR < officers[viableOfficers[j]].WAR) ||
					(objective == 'Order' && officers[viableOfficers[i]].LDR < officers[viableOfficers[j]].LDR)) {
					var temp = viableOfficers[i];
					viableOfficers[i] = viableOfficers[j];
					viableOfficers[j] = temp;
				}
			}
		}
		var officersHTML = '';
		for (var i = 0; i < viableOfficers.length; i++) {
			var officer = officers[viableOfficers[i]];
			officersHTML += `<label for="officer` + viableOfficers[i] + `">
					<input type="checkbox" id="officer` + viableOfficers[i] + `">
					<span>` + officer.Name + ` | `;
			switch (objective) {
				case 'Farm': officersHTML += officer.POL; break;
				case 'Trade': officersHTML += officer.POL; break;
				case 'Tech': officersHTML += officer.INT; break;
				case 'Defense': officersHTML += officer.WAR; break;
				case 'Order': officersHTML += officer.LDR; break;
				default: break;
			}
			officersHTML += `</span>
				</label>`;
		}
		
		devCard.innerHTML = `<div class="title allyColor">` + objective + `</div>
			<div class="devContent">
				<table>
					<tr>
						<td>City: <input type="text" value="` + city.Name + `" readonly></td>
						<td>` + objectiveHTML + `</td>
					</tr>
					<tr>
						<td><div id="officersDiv" class="checkboxes">` + officersHTML + `</div></td>
					</tr>
					<tr>
						<td>
							<input type="button" value="` + objective + `" onclick="develop(` + cityIndex + `, '` + objective + `')">
							<input type="button" value="Cancel" onclick="closeCard(devCard)">
						</td>
					</tr>
				</table>
			</div>`;
		
		devCard.style.visibility = 'visible';
		if (officersHTML.length > 0) getElement('officersDiv').style.visibility = 'visible';
	}
}

// Unit card
function military (cityIndex, objective) {
	if (objective == 'Transfer') {
		var target = getElement('target') ? parseInt(getElement('target').value) : '';
		var playerCities = getCities(playerForce, 'force');
		if (Number.isInteger(cityIndex) && Number.isInteger(target) && playerCities.includes(cityIndex) && playerCities.includes(target)) {
			// Check transfer units
			var transferUnits = [];
			for (var i = 0; i < units.length; i++) {
				if (getElement('unit' + i) && getElement('unit' + i).checked) transferUnits.push(i);
			}
			if (transferUnits.length > 0 && transferUnits.length + getCityUnitCount(target, true) <= unitLimit) {
				for (var i = 0; i < transferUnits.length; i++) {
					units[transferUnits[i]].Objective = ['Transfer', target];
					units[transferUnits[i]].Progress = 0;
				}
				
				closeCard(unitCard);
				openInfoCard('City', cityIndex);
				draw();
			}
		}
	}
	else {
		var officer = getElement('officer') ? getElement('officer').value : '';
		officer = getOfficerIndexByName(officer);
		if (officer != null) {
			if (getElement('unitType')) {
				var unitType = parseInt(getElement('unitType').value);
				officers[officer].Objective = [objective, unitType];
				officers[officer].Progress = 0;
			}
			else if (getElement('unit')) {
				var unit = parseInt(getElement('unit').value);
				officers[officer].Objective = [objective, unit];
				officers[officer].Progress = 0;
				units[unit].Objective = [objective, officer];
				units[unit].Progress = 0;
			}
			else return;
			
			closeCard(unitCard);
			openInfoCard('City', cityIndex);
			draw();
		}
	}
}

// Unit card
function officerChanged (cityIndex) {
	getElement('relevantStats').innerHTML = '';
	
	var officer = getElement('officer') ? getElement('officer').value : '';
	var index = getOfficerIndexByName(officer);
	if (index != null) {
		getElement('relevantStats').innerHTML = createStatsTable(index);	
	}
}

// Unit card
function openUnitCard (cityIndex, objective) {
	closeCard(cityCard);
	
	var city = cities[cityIndex];
	if (objective == 'Transfer') {
		var targets = getTransferCities(cityIndex);
		var targetsHTML = '<select id="target">';
		for (var i = 0; i < targets.length; i++) targetsHTML += '<option value="' + targets[i] + '">' + cities[targets[i]].Name + '</option>';
		targetsHTML += '</select>';
		
		unitCard.innerHTML = `<div class="title allyColor">` + objective + `</div>
			<div class="unitContent">
				<table>
					<tr>
						<td>Source: <input type="text" value="` + city.Name + `" readonly></td>
						<td>Target: ` + targetsHTML + `</td>
					</tr>
					<tr>
						<td><div id="unitsDiv">` + createUnitDivInnerHTML(cityIndex) + `</div></td>
						<td></td>
					</tr>
					<tr>
						<td>
							<input type="button" value="` + objective + `" onclick="military(` + cityIndex + `, '` + objective + `')">
							<input type="button" value="Cancel" onclick="closeCard(unitCard)">
						</td>
					</tr>
				</table>
			</div>`;
		
		unitCard.style.visibility = 'visible';
	}
	else {
		var viableOfficers = getCityViableOfficers(cityIndex);
		if (viableOfficers.length > 0) {
			var objectiveHTML = '';
			switch (objective) {
				case 'Establish':
					var options = '';
					for (var i = 0; i < unitTypes.length; i++) {
						options += '<option value="' + i + '">' + unitTypes[i].Name + '</option>';
					}
					objectiveHTML += 'Unit Type: <select id="unitType">' + options + '</select>';
					break;
				case 'Recurit':
					var options = '';
					var viableUnits = getCityViableUnits(cityIndex);
					for (var i = 0; i < viableUnits.length; i++) {
						var unit = units[viableUnits[i]];
						if (unit.Strength < strengthLimit) {
							options += '<option value="' + viableUnits[i] + '">' + unitTypes[unit.Type].Name + ' | ' + unit.Strength + ' | ' + unit.Morale + '</option>';
						}
					}
					objectiveHTML += 'Unit: <select id="unit">' + options + '</select>';
					break;
				case 'Drill':
					var options = '';
					var viableUnits = getCityViableUnits(cityIndex);
					for (var i = 0; i < viableUnits.length; i++) {
						var unit = units[viableUnits[i]];
						if (unit.Morale < 100) {
							options += '<option value="' + viableUnits[i] + '">' + unitTypes[unit.Type].Name + ' | ' + unit.Strength + ' | ' + unit.Morale + '</option>';
						}
					}
					objectiveHTML += 'Unit: <select id="unit">' + options + '</select>';
					break;
				default:
					break;
			}
			
			var viableOfficers = getCityViableOfficers(cityIndex);
			// Sort
			for (var i = 0; i < viableOfficers.length; i++) {
				for (var j = i + 1; j < viableOfficers.length; j++) {
					if (((objective == 'Establish' || objective == 'Recurit') && officers[viableOfficers[i]].CHR < officers[viableOfficers[j]].CHR) ||
						(objective == 'Drill' && officers[viableOfficers[i]].LDR < officers[viableOfficers[j]].LDR)) {
						var temp = viableOfficers[i];
						viableOfficers[i] = viableOfficers[j];
						viableOfficers[j] = temp;
					}
				}
			}
			var officersHTML = '<div id="officerListDiv"><datalist id="officerList">';
			for (var i = 0; i < viableOfficers.length; i++) officersHTML += '<option value="' + officers[viableOfficers[i]].Name + '">';
			officersHTML += '</datalist></div>';
			
			unitCard.innerHTML = officersHTML + `<div class="title allyColor">` + objective + `</div>
				<div class="unitContent">
					<table>
						<tr>
							<td>City: <input type="text" value="` + city.Name + `" readonly></td>
							<td>` + objectiveHTML + `</td>
						</tr>
						<tr>
							<td><div id="officersDiv">Officer: <input type="text" id="officer" list="officerList" oninput="officerChanged(` + cityIndex + `)"></div></td>
							<td><div id="relevantStats"></div></td>
						</tr>
						<tr>
							<td>
								<input type="button" value="` + objective + `" onclick="military(` + cityIndex + `, '` + objective + `')">
								<input type="button" value="Cancel" onclick="closeCard(unitCard)">
							</td>
						</tr>
					</table>
				</div>`;
			
			unitCard.style.visibility = 'visible';
			if (officersHTML.length > 0) getElement('officersDiv').style.visibility = 'visible';
		}
	}
}

// Deployed card
function dismissDeployed (commander) {
	closeCard(deployedCard);
	
	var progress = officers[commander].Progress;
	if (Number.isInteger(progress)) {
		officers[commander].Objective = progress ? 'Return' : '-';
		officers[commander].Progress = progress ? 0 : '-';
		for (var i = 0; i < units.length; i++) {
			if (units[i].Objective != '-' && units[i].Objective[1] == commander) {
				units[i].Objective = progress ? 'Return' : '-';
				units[i].Progress = progress ? 0 : '-';
			}
		}
		for (var i = 0; i < officers.length; i++) {
			if (officers[i].Objective != '-' && officers[i].Objective[1] == commander) {
				officers[i].Objective = progress ? 'Return' : '-';
				officers[i].Progress = progress ? 0 : '-';
			}
		}
		
		openInfoCard('City', officers[commander].City);
		draw();
	}
}

// Deployed card
function openDeployedCard (commander, select) {
	if (select) closeCard(selectCard);
	openInfoCard('Unit', commander);
	
	var backColor = (officers[commander].Force == playerForce) ? 'allyColor' : 'enemyColor';
	
	hoverCard.style.visibility = 'hidden';
	
	var buttons = `<input type="button" value="Dismiss" onclick="dismissDeployed(` + commander + `)">
		<input type="button" value="Cancel" onclick="closeCard(deployedCard)">`;
	deployedCard.innerHTML = `<div class="unitName ` + backColor + `">` + officers[commander].Name + ` Unit</div>
		<div class="selectContent">` + buttons + `</div>`;
	
	deployedCard.style.visibility = 'visible';
	if (mousePos.X + deployedCard.clientWidth > mapSize) deployedCard.style.left = (mousePos.X - deployedCard.clientWidth) + 'px';
	else deployedCard.style.left = mousePos.X + 'px';
	if (mousePos.Y + deployedCard.clientHeight > mapSize) deployedCard.style.top = (mousePos.Y - deployedCard.clientHeight) + 'px';
	else deployedCard.style.top = mousePos.Y + 'px';
}

// Info card
function openInfoCard (mode, index) {
	if (mode == 'City') {
		var backColor = 'enemyColor';
		if (cities[index].Force == '-') backColor = 'neutralColor';
		else if (cities[index].Force == playerForce) backColor = 'allyColor';
		
		var cityOfficers = getCityOfficers(index);
		var cityUnits = getCityUnits(index);
		
		infoCard.innerHTML = `<div class="cityName ` + backColor + `">` + cities[index].Name + `</div>
			<div class="cityContent">` +
				createCityTable(index) + `<br />` +
				createOfficersTable(cityOfficers) + `<br />` +
				createUnitsTable(cityUnits) + `
			</div>`;
	}
	else if (mode == 'Unit') {
		var backColor = 'enemyColor';
		if (officers[index].Force == playerForce) backColor = 'allyColor';
		
		// Deployed units
		var deployedUnits = getDeployedUnits(index);
		
		// Assist officers
		var assistOfficers = [];
		for (var i = 0; i < officers.length; i++) {
			if (officers[i].Objective != '-' && officers[i].Objective[0] == 'Assist' && officers[i].Objective[1] == index) assistOfficers.push(i);
		}
		
		infoCard.innerHTML = `<div class="unitName ` + backColor + `">` + officers[index].Name + ` Unit</div>
			<div class="deployedContent">
				<table class="stats">
					<tr><th colspan="2">` + forces[officers[index].Force].Name + `</th></tr>
					<tr><th>Strength</th><td style="text-align: center;">` + getDeployedStrength(index) + `</td></tr>
					<tr><th>Target</th><td style="text-align: center;">` + cities[officers[index].Objective[1]].Name + `</td></tr>
				</table><br />` +
				createUnitsTable(deployedUnits) + `<br />` +
				createOfficersTable([index].concat(assistOfficers)) + `<br />
				<b>Assisted Stats:</b>
				<div id="infoStats"></div>
			</div>`;
		
		var assisted = getAssistedStats(index);
		calculatedStatsTable('infoStats', assisted[0], assisted[1], assisted[2]);
	}
	
	infoCard.style.visibility = 'visible';
}

function closeCard (card) {
	card.style.visibility = 'hidden';
	card.innerHTML = '';
}
