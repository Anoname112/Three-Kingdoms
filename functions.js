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

function getCityPosition (cityIndex) {
	var mapValue = cityIndex + 40;
	var x = 0;
	var y = 0;
	for (var i = 0; i < map.length; i++) {
		for (var j = 0; j < map[i].length; j++) {
			if (mapValue == map[i][j]) return new Point(i, j);
		}
	}
	return new Point(0, 0);
}

function getCityUnitCount (cityIndex) {
	var count = null;
	for (var i = 0; i < units.length; i++) if (units[i].City == cityIndex) count++;
	return count;
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

function closeMenu () {
	menuCard.style.visibility = 'hidden';
	menuCard.innerHTML = '';
}

function createStatsTable (elementId, LDR, WAR, INT) {
	getElement(elementId).innerHTML = `<table class="stats">
			<tr><th>LDR</th><th>WAR</th><th>INT</th><th>ATK</th><th>DEF</th></tr>
			<tr>
				<td>` + LDR.toFixed(1) + `</td>
				<td>` + WAR.toFixed(1) + `</td>
				<td>` + INT.toFixed(1) + `</td>
				<td>` + calculateAttack(LDR, WAR).toFixed(1) + `</td>
				<td>` + calculateDefense(LDR, INT).toFixed(1) + `</td></tr>
		</table>`;
}

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
		createStatsTable('assistedStats', stats[0], stats[1], stats[2]);
	}
}

function commanderChanged (source) {
	getElement('relevantStats').innerHTML = '';
	getElement('assistDiv').innerHTML = '';
	getElement('assistDiv').style.visibility = 'hidden';
	getElement('assistedStats').innerHTML = '';
	
	var commander = getElement('commander') ? getElement('commander').value : '';
	var stats = getStats(commander);
	if (stats.length > 0) {
		createStatsTable('relevantStats', stats[0], stats[1], stats[2]);
		
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
	if (source != null) {
		var viableOfficers = getCityViableOfficers(source);
		var officersHTML = '';
		for (var i = 0; i < viableOfficers.length; i++) {
			officersHTML += '<option value="' + officers[viableOfficers[i]].Name + '">'
		}
		
		var viableUnits = getCityViableUnits(source);
		var unitsHTML = '';
		for (var i = 0; i < viableUnits.length; i++) {
			var unit = units[viableUnits[i]];
			unitsHTML += `<label for="unit` + viableUnits[i] + `">
					<input type="checkbox" id="unit` + viableUnits[i] + `">
					<span>` + unitTypes[unit.Type].Name + ` | ` + unit.Strength + ` | ` + unit.Morale + `</span>
				</label>`;
		}
		
		getElement('officerListDiv').innerHTML = '<datalist id="officerList">' + officersHTML + '</datalist>';
		getElement('commanderDiv').innerHTML = 'Commander: <input type="text" id="commander" list="officerList" oninput="commanderChanged(' + source + ')">';
		getElement('unitsDiv').innerHTML = `Units: (type | strength | morale)<br />
			<div class="checkboxes">` + unitsHTML + `</div>`;
	}
}

function openMarchCard (cityIndex) {
	closeMenu();
	
	var city = cities[cityIndex];
	var source = null;
	var target = null;
	var fromHTML = '';
	var targetHTML = '';
	marchCard.style.visibility = 'visible';
	if (city.Force == playerForce) {
		source = cityIndex;
		targets = getCities(city.Force, 'nonForce', [source, 'near']);
		var targetsHTML = '';
		for (var i = 0; i < targets.length; i++) {
			targetsHTML += '<option value="' + cities[targets[i]].Name + '">'
		}
		
		var viableOfficers = getCityViableOfficers(source);
		var officersHTML = '';
		for (var i = 0; i < viableOfficers.length; i++) {
			officersHTML += '<option value="' + officers[viableOfficers[i]].Name + '">'
		}
		
		var viableUnits = getCityViableUnits(source);
		var unitsHTML = '';
		for (var i = 0; i < viableUnits.length; i++) {
			var unit = units[viableUnits[i]];
			unitsHTML += `<label for="unit` + viableUnits[i] + `">
					<input type="checkbox" id="unit` + viableUnits[i] + `">
					<span>` + unitTypes[unit.Type].Name + ` | ` + unit.Strength + ` | ` + unit.Morale + `</span>
				</label>`;
		}
		
		var string = `<div id="officerListDiv"><datalist id="officerList">` + officersHTML + `</datalist></div><datalist id="targetList">` + targetsHTML + `</datalist>
			<div class="title allyColor">March</div>
			<div class="marchContent">
				<table>
					<tr>
						<td>Source: <input type="text" id="source" value="` + cities[source].Name + `" readonly></td>
						<td>Target: <input type="text" id="target" list="targetList"></td>
					</tr>
					<tr>
						<td>
							<div id="commanderDiv">
								Commander: <input type="text" id="commander" list="officerList" oninput="commanderChanged(` + source + `)">
							</div>
						</td>
						<td><div id="relevantStats"></div></td>
					</tr>
					<tr>
						<td>
							<div id="unitsDiv">
								Units: (type | strength | morale)<br />
								<div class="checkboxes">` + unitsHTML + `</div>
							</div>
						</td>
					</tr>
					<tr>
						<td><div id="assistDiv" class="checkboxes"></div></td>
						<td><div id="assistedStats"></div></td>
					</tr>
					<tr>
						<td><input type="button" value="March" onclick="march()"> <input type="button" value="Cancel" onclick="closeMarchCard()"></td>
						<td></td>
					</tr>
				</table>
			</div>`;
		marchCard.innerHTML = string;
	}
	else {
		target = cityIndex;
		sources = getCities(playerForce, 'force', [target, 'near']);
		var sourcesHTML = '';
		for (var i = 0; i < sources.length; i++) {
			sourcesHTML += '<option value="' + cities[sources[i]].Name + '">'
		}
		
		var string = `<div id="officerListDiv"></div><datalist id="sourceList">` + sourcesHTML + `</datalist>
			<div class="title allyColor">March</div>
			<div class="marchContent">
				<table>
					<tr>
						<td>Source: <input type="text" id="source" list="sourceList" oninput="sourceChanged()"></td>
						<td>Target: <input type="text" id="target" value="` + cities[target].Name + `" readonly></td>
					</tr>
					<tr>
						<td>
							<div id="commanderDiv"></div>
						</td>
						<td><div id="relevantStats"></div></td>
					</tr>
					<tr>
						<td>
							<div id="unitsDiv"></div>
						</td>
					</tr>
					<tr>
						<td><div id="assistDiv" class="checkboxes"></div></td>
						<td><div id="assistedStats"></div></td>
					</tr>
					<tr>
						<td><input type="button" value="March" onclick="march()"> <input type="button" value="Cancel" onclick="closeMarchCard()"></td>
						<td></td>
					</tr>
				</table>
			</div>`;
		marchCard.innerHTML = string;
	}
}

function closeMarchCard () {
	marchCard.style.visibility = 'hidden';
	marchCard.innerHTML = '';
}

function march () {
	// check source (should be player force), target valid name
	// check commander valid name
	// check have units and valid units
	// check valid assist
	
	// assign objectives
	
	closeMarchCard();
}

function openDevCard (cityIndex, objective) {
	closeMenu();
	
	var viableOfficers = getCityViableOfficers(cityIndex);
	if (viableOfficers.length > 0) {
		
	}
}

function openUnitCard (cityIndex, objective) {
	closeMenu();
	
	var viableOfficers = getCityViableOfficers(cityIndex);
	if (viableOfficers.length > 0) {
		
	}
}