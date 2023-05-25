function getElement (id) {
	return document.getElementById(id);
}

function isNumeric (value) {
	return /^\d+$/.test(value);
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
	w = w == null ? image.width : w;
	h = h == null ? image.height : h;
	ctx.drawImage(image, x, y, w, h);
}

function fillRect (x, y, w, h, s) {
	ctx.fillStyle = s == null ? "#000" : s;
	ctx.fillRect(x, y, w, h);
}

function drawLine (p1, p2, s) {
	ctx.strokeStyle = (s == null) ? "#000" : s;
	ctx.lineWidth = 2;
	ctx.beginPath();
	ctx.moveTo(p1.X, p1.Y);
	ctx.lineTo(p2.X, p2.Y);
	ctx.closePath();
	ctx.stroke();
}

function drawRect (x, y, w, h, s) {
	ctx.strokeStyle = s == null ? "#000" : s;
	ctx.lineWidth = scaling;
	ctx.beginPath();
	ctx.strokeRect(x, y, w, h);
	ctx.closePath();
	ctx.stroke();
}

function drawMessage (msg, x, y, align) {
	ctx.textBaseline = 'middle';
	ctx.textAlign = align == null ? "start" : align;
	ctx.fillText(msg, x, y);
}

function drawGlowMessage (msg, x, y, align, style) {
	ctx.fillStyle = style == null ? fontLight : getTextColor(style);
	drawMessage (msg, x - outlineSize, y, align);
	drawMessage (msg, x + outlineSize, y, align);
	drawMessage (msg, x, y - outlineSize, align);
	drawMessage (msg, x, y + outlineSize, align);
	ctx.fillStyle = style == null ? fontDark : style;
	drawMessage (msg, x, y, align);
}

function floor (value, floor) {
	var floor = floor == null ? 1 : floor;
	return Math.floor(value / floor) * floor;
}

function clamp (value, min, max) {
	return Math.max(Math.min(value, max), min);
}

function hexToDecimal (decimal) {
	return parseInt(decimal, 16);
}

function getTextColor (color) {
	var r = hexToDecimal(color.slice(1, 3));
	var g = hexToDecimal(color.slice(3, 5));
	var b = hexToDecimal(color.slice(5));
	var lumosity = (r * 0.99 + g * 1.02 + b * 0.99) / 3;
	
	if (lumosity < 85) return fontLight;
	else return fontDark;
}

function giveAlpha (color, alpha) {
	var r = hexToDecimal(color.slice(1, 3));
	var g = hexToDecimal(color.slice(3, 5));
	var b = hexToDecimal(color.slice(5));
	
	return 'rgba(' + r + ', ' + g + ', ' + b + ', ' + (alpha ? alpha : roadAlpha) + ')';
}

function sortOfficers (officerIndexes, sort) {
	for (var i = 0; i < officerIndexes.length; i++) {
		for (var j = i + 1; j < officerIndexes.length; j++) {
			var swap = false;
			switch (sort) {
				case 'LDR': if (officers[officerIndexes[i]].LDR < officers[officerIndexes[j]].LDR) swap = true; break;
				case 'WAR': if (officers[officerIndexes[i]].WAR < officers[officerIndexes[j]].WAR) swap = true; break;
				case 'INT': if (officers[officerIndexes[i]].INT < officers[officerIndexes[j]].INT) swap = true; break;
				case 'POL': if (officers[officerIndexes[i]].POL < officers[officerIndexes[j]].POL) swap = true; break;
				case 'CHR': if (officers[officerIndexes[i]].CHR < officers[officerIndexes[j]].CHR) swap = true; break;
			}
			if (swap) {
				var temp = officerIndexes[i];
				officerIndexes[i] = officerIndexes[j];
				officerIndexes[j] = temp;
			}
		}
	}
	return officerIndexes;
}

function getCityIndexByName (cityName) {
	for (var i = 0; i < cities.length; i++) if (cities[i].Name == cityName) return i;
	return null;
}

function getCities (forceId, alliance, sort) {
	var resultCities = [];
	for (var i = 0; i < cities.length; i++) {
		if (alliance == 'force' && cities[i].Force == forceId) resultCities.push(i);
		else if (alliance == 'enemy' && cities[i].Force != forceId && cities[i].Force != '-') resultCities.push(i);
		else if (alliance == 'nonForce' && cities[i].Force != forceId) resultCities.push(i);
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

function getCityOfficers (cityIndex, sort) {
	var cityOfficers = [];
	for (var i = 0; i < officers.length; i++) {
		if (officers[i].City == cityIndex) cityOfficers.push(i);
	}
	
	if (sort) return sortOfficers(cityOfficers, sort);
	return cityOfficers;
}

function getCityUnits (cityIndex) {
	var cityUnits = [];
	for (var i = 0; i < units.length; i++) {
		if (units[i].City == cityIndex) cityUnits.push(i);
	}
	return cityUnits;
}

function getCityViableOfficers (cityIndex, sort) {
	var viableOfficers = [];
	for (var i = 0; i < officers.length; i++) {
		if (officers[i].City == cityIndex && officers[i].Objective == '-') viableOfficers.push(i);
	}
	
	if (sort) return sortOfficers(viableOfficers, sort);
	return viableOfficers;
}

function getCityNonViableOfficers (cityIndex, excludeReturn) {
	var nonViableOfficers = [];
	for (var i = 0; i < officers.length; i++) {
		if (officers[i].City == cityIndex && officers[i].Objective != '-' && (!excludeReturn || officers[i].Objective[0] != 'Return')) nonViableOfficers.push(i);
	}
	return nonViableOfficers;
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

function getCityLowestMarchCost (cityIndex) {
	var cost = strengthLimit * marchCost;
	var viableUnits = getCityViableUnits(cityIndex);
	for (var i = 0; i < viableUnits.length; i++) {
		var unit = units[viableUnits[i]];
		if (unit.City == cityIndex && unit.Strength * marchCost < cost) cost = unit.Strength * marchCost;
	}
	return cost;
}

function getCityLowestEstablishCost () {
	var cost = unitTypes[0].Cost;
	for (var i = 1; i < unitTypes.length; i++) if (unitTypes[i].Cost < cost) cost = unitTypes[i].Cost;
	return cost;
}

function getCityHighestEstablishCost () {
	var cost = unitTypes[0].Cost;
	for (var i = 1; i < unitTypes.length; i++) if (unitTypes[i].Cost > cost) cost = unitTypes[i].Cost;
	return cost;
}

function getCityLowestRecuritCost (cityIndex) {
	var cost = getCityHighestEstablishCost();
	var viableUnits = getCityViableUnits(cityIndex);
	for (var i = 0; i < viableUnits.length; i++) {
		var recuritCost = unitTypes[units[viableUnits[i]].Type].Cost * recuritCostMultiplier;
		if (recuritCost < cost) cost = recuritCost;
	}
	return cost;
}

function getCityHighestRecuritCost (cityIndex) {
	var cost = 0;
	var viableUnits = getCityViableUnits(cityIndex);
	for (var i = 0; i < viableUnits.length; i++) {
		var recuritCost = unitTypes[units[viableUnits[i]].Type].Cost * recuritCostMultiplier;
		if (recuritCost > cost) cost = recuritCost;
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

function getForceViableOfficers (forceId) {
	var viableOfficers = [];
	for (var i = 0; i < officers.length; i++) {
		if (officers[i].Force == forceId && officers[i].Objective == '-') viableOfficers.push(i);
	}
	return viableOfficers;
}

function getForceViableUnits (forceId) {
	var viableUnits = [];
	for (var i = 0; i < units.length; i++) {
		if (units[i].Force == forceId && units[i].Objective == '-') viableUnits.push(i);
	}
	return viableUnits;
}

function getForceStrength (forceId, includeNonViable) {
	var resultUnits = includeNonViable ? getUnits(forceId, 'force') : getForceViableUnits(forceId);
	var strength = 0;
	for (var i = 0; i < resultUnits.length; i++) strength += units[resultUnits[i]].Strength;
	return strength;
}

function getForceMarchableCities (forceId) {
	// Cities that have both available officers and available units
	var marchable = [];
	for (var i = 0; i < cities.length; i++) {
		if (cities[i].Force == forceId && getCityViableOfficers(i).length > 0 && getCityViableUnits(i).length > 0) marchable.push(i);
	}
	return marchable;
}

function getForceDiligence (forceIndex) {
	var rulerStats = getStats(forces[forceIndex].Ruler);
	var totalInfluence = 0;
	for (var i = 0; i < influence.length; i++) {
		totalInfluence += rulerStats[i] * influence[i];
	}
	return totalInfluence;
}

function getForceEnemies (forceIndex) {
	var enemyForces = [];
	for (var i = 0; i < forces.length; i++) {
		if (i != forceIndex) enemyForces.push(i);
	}
	return enemyForces;
}

function getNewForceId () {
	var forceIds = forces.map((x) => x.Id);
	var i = 0;
	while (true) {
		if (!forceIds.includes(i)) return i;
		i++;
	}
}

function getForceIndexById (forceId) {
	for (var i = 0; i < forces.length; i++) if (forces[i].Id == forceId) return i;
	return null;
}

function getNewUnitId () {
	var unitIds = units.map((x) => x.Id);
	var i = 0;
	while (true) {
		if (!unitIds.includes(i)) return i;
		i++;
	}
}

function getUnitIndexById (unitId) {
	for (var i = 0; i < units.length; i++) if (units[i].Id == unitId) return i;
	return null;
}

function getUnits (forceId, alliance) {
	var resultUnits = [];
	for (var i = 0; i < units.length; i++) {
		if (alliance == 'force' && units[i].Force == forceId) resultUnits.push(i);
		else if (alliance == 'nonForce' && units[i].Force != forceId) resultUnits.push(i);
	}
	return resultUnits;
}

function getDeployedUnits (commander) {
	var deployedUnits = [];
	for (var i = 0; i < units.length; i++) {
		if (units[i].Objective != '-' && units[i].Objective[0] == 'March' && units[i].Objective[1] == commander) deployedUnits.push(i);
	}
	return deployedUnits;
}

function getDeployedAssistOfficers (commander) {
	var assistOfficers = [];
	for (var i = 0; i < officers.length; i++) {
		if (officers[i].Objective != '-' && officers[i].Objective[0] == 'Assist' && officers[i].Objective[1] == commander) assistOfficers.push(i);
	}
	return assistOfficers;
}	

function getDeployedStrength (commander) {
	var deployedUnits = getDeployedUnits(commander);
	var strength = 0;
	for (var i = 0; i < deployedUnits.length; i++) strength += units[deployedUnits[i]].Strength;
	return strength;
}

function giveBattleBonus (unitIndexes) {
	for (var i = 0; i < unitIndexes.length; i++) {
		// Increase morale
		units[unitIndexes[i]].Morale += moraleBonus;
		if (units[unitIndexes[i]].Morale > moraleLimit) units[unitIndexes[i]].Morale = moraleLimit;
		// Reset cooldown
		units[unitIndexes[i]].Cooldown = 0;
	}
}

function getOfficerIndexByName (officerName) {
	for (var i = 0; i < officers.length; i++) if (officers[i].Name == officerName) return i;
	return null;
}

function getPortrait (officerName, size) {
	return '<img class="' + size + 'Portrait" src="portraits/' + officerName.split(' ').join('_') + '.jpg">';
}

function getOfficers (forceId, alliance, sort) {
	var resultOfficers = [];
	for (var i = 0; i < officers.length; i++) {
		if (alliance == 'force' && officers[i].Force == forceId) resultOfficers.push(i);
		else if (alliance == 'nonForce' && officers[i].Force != forceId) resultOfficers.push(i);
	}
	if (sort) return sortOfficers(resultOfficers, sort);
	return resultOfficers;
}

function isRuler (officerIndex) {
	for (var i = 0; i < forces.length; i++) if (forces[i].Ruler == officerIndex) return true;
	return false;
}

function getStats (officerIndex) {
	var officer = officers[officerIndex];
	if (officer) return [officer.LDR, officer.WAR, officer.INT, officer.POL, officer.CHR];
	return [];
}

function getStatsByName (officerName) {
	for (var i = 0; i < officers.length; i++) {
		if (officers[i].Name == officerName) {
			return [officers[i].LDR, officers[i].WAR, officers[i].INT, officers[i].POL, officers[i].CHR];
		}
	}
	return [];
}

function getAssistedStats (officerIndex) {
	var stats = getStats(officerIndex);
	for (var i = 0; i < officers.length; i++) {
		if (officers[i].Objective != '-' && officers[i].Objective[0] == 'Assist' && officers[i].Objective[1] == officerIndex) {
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

function applyAbilities (morale, allyAbilities, enemyAbilities) {
	for (var i = 0; i < allyAbilities.length; i++) morale += abilities[allyAbilities[i]].AllyEffect;
	for (var i = 0; i < enemyAbilities.length; i++) morale -= abilities[enemyAbilities[i]].EnemyEffect;
	return morale;
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

function assignDevObjective (officerIndex, objective, progress) {
	officers[officerIndex].Objective = objective;
	officers[officerIndex].Progress = progress == null ? 0 : progress;
	
	cities[objective[1]].Gold -= devCost;
}

function dismissObjective (officerIndex) {
	officers[officerIndex].Objective = '-';
	officers[officerIndex].Progress = '-';
}

function deployedCityCollision (officerIndex) {
	var nonForceCities = getCities(officers[officerIndex].Force, 'nonForce');
	for (var i = 0; i < nonForceCities.length; i++) {
		var cityPosition = getCityPosition(nonForceCities[i]);
		if (cityPosition.X == officers[officerIndex].Position.X && cityPosition.Y == officers[officerIndex].Position.Y) return nonForceCities[i];
	}
	return null;
}

function deployedUnitCollision (officerIndex) {
	for (var i = 0; i < officers.length; i++) {
		if (officers[i].Force != officers[officerIndex].Force && officers[i].Objective != '-' && officers[i].Objective[0] == 'March' &&
			officers[i].Position.X == officers[officerIndex].Position.X && officers[i].Position.Y == officers[officerIndex].Position.Y) return i;
	}
	return null;
}

function getNearestTarget (unitIndex, targetUnits) {
	var nearestDistance = (new Point(battleWidth, battleHeight)).length();
	var nearestTarget = null;
	for (var i = 0; i < targetUnits.length; i++) {
		var distance = units[targetUnits[i]].Vec.subtract(units[unitIndex].Vec).length();
		if (distance < nearestDistance) {
			nearestDistance = distance;
			nearestTarget = targetUnits[i];
		}
	}
	return nearestTarget;
}

function inBattle (officerIndex) {
	for (var i = 0; i < battles.length; i++) {
		for (var j = 0; j < 2; j++) {
			if (battles[i][j] == officerIndex) return true;
		}
	}
	return false;
}

function copyData () {
	navigator.clipboard.writeText(JSON.stringify(localStorage));
}

function saveData () {
	localStorage.setItem('scenario', JSON.stringify(scenario));
	localStorage.setItem('date', JSON.stringify(date));
	localStorage.setItem('player', JSON.stringify(player));
	localStorage.setItem('playerForce', JSON.stringify(playerForce));
	localStorage.setItem('cities', JSON.stringify(cities));
	localStorage.setItem('officers', JSON.stringify(officers));
	localStorage.setItem('units', JSON.stringify(units));
	copyData();
}

function loadDataFromStorage () {
	loadData(
		JSON.parse(localStorage.getItem('scenario')),
		JSON.parse(localStorage.getItem('date')),
		JSON.parse(localStorage.getItem('player')),
		JSON.parse(localStorage.getItem('playerForce')),
		JSON.parse(localStorage.getItem('cities')),
		JSON.parse(localStorage.getItem('officers')),
		JSON.parse(localStorage.getItem('units'))
	);
}

function loadData (_scenario, _date, _player, _playerForce, _cities, _officers, _units) {
	applyScenario(scenarios[_scenario].Name);
	
	date = _date;
	player = _player;
	playerForce = _playerForce;
	
	// Cities
	for (var i = 0; i < cities.length; i++) {
		cities[i].Force = _cities[i].Force;
		cities[i].Gold = _cities[i].Gold;
		cities[i].Food = _cities[i].Food;
		cities[i].cFarm = _cities[i].cFarm;
		cities[i].cTrade = _cities[i].cTrade;
		cities[i].cTech = _cities[i].cTech;
		cities[i].cDefense = _cities[i].cDefense;
		cities[i].cOrder = _cities[i].cOrder;
	}
	
	// Officers
	for (var i = 0; i < officers.length; i++) {
		officers[i].Force = _officers[i].Force;
		officers[i].City = _officers[i].City;
		officers[i].Position = new Point(_officers[i].Position.X, _officers[i].Position.Y);
		officers[i].Objective = _officers[i].Objective;
		if (officers[i].Objective != '-' && officers[i].Objective[0] == 'March') {
			for (var j = 0; j < officers[i].Objective[2].Points.length; j++) {
				officers[i].Objective[2].Points[j] = new Point(officers[i].Objective[2].Points[j].X, officers[i].Objective[2].Points[j].Y);
			}
		}
		officers[i].Progress = _officers[i].Progress;
		// Battle image
		if (Number.isInteger(officers[i].City)) battleImages[i] = newImg("portraits/" + officers[i].Name.split(' ').join('_') + ".jpg");
	}
	
	// Units
	units = _units;
	for (var i = 0; i < units.length; i++) units[i].Position = new Point(units[i].Position.X, units[i].Position.Y);
	
	startPoint = new Point.Zero();
	endPoint = new Point.Zero();
	mousePos = new Point.Zero();
	openPlayerCard();
	battles = [];
	gState = 1;
	playAudio(mainSound);
	draw();
}