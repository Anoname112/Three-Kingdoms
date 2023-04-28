function getElement (id) {
	return document.getElementById(id);
}

function isNumeric (value) {
	return /^\d+$/.test(value);
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

function getOfficerIndexByName (officerName) {
	for (var i = 0; i < officers.length; i++) if (officers[i].Name == officerName) return i;
	return null;
}

function getOfficers (forceIndex, alliance, sort) {
	var resultOfficers = [];
	for (var i = 0; i < officers.length; i++) {
		if (alliance == 'force' && officers[i].Force == forceIndex) resultOfficers.push(i);
		else if (alliance == 'nonForce' && officers[i].Force != forceIndex) resultOfficers.push(i);
	}
	if (sort) {
		
	}
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