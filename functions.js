function getElement (id) {
	return document.getElementById(id);
}

function updateCanvasLocation () {
	canvas.style.left = (window.innerWidth - canvas.width) / 2;
	canvas.style.top = (window.innerHeight - canvas.height) / 2;
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

function getCityViableOfficers (cityIndex) {
	var viableOfficers = [];
	for (var i = 0; i < officers.length; i++) {
		if (officers[i].City == cityIndex && officers[i].Objective == '-') viableOfficers.push(i);
	}
	return viableOfficers;
}

function getForceViableOfficers (forceIndex) {
	var viableOfficers = [];
	for (var i = 0; i < officers.length; i++) {
		if (officers[i].Force == forceIndex && officers[i].Objective == '-') viableOfficers.push(i);
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

function getEnemyForces (forceIndex) {
	var enemyForces = [];
	for (var i = 0; i < forces.length; i++) {
		if (i != forceIndex) enemyForces.push(i);
	}
	return enemyForces;
}

function getCities (forceIndex, alliance, sort) {
	var resultCities = [];
	for (var i = 0; i < cities.length; i++) {
		if (alliance == 'enemy' && cities[i].Force != forceIndex && cities[i].Force != '-') resultCities.push(i);
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

function commanderChanged () {
	getElement('relevantStats').innerHTML = '';
	getElement('assistDiv').innerHTML = '';
	
	var commander = getElement('commander') ? getElement('commander').value : '';
	var stats = getStats(commander);
	if (stats.length > 0) {
		var LDR = stats[0];
		var WAR = stats[1];
		var INT = stats[2];
		getElement('relevantStats').innerHTML = `<table class="stats">
				<tr><th>LDR</th><th>WAR</th><th>INT</th><th>Attack</th><th>Defense</th></tr>
				<tr>
					<td>` + LDR + `</td>
					<td>` + WAR + `</td>
					<td>` + INT + `</td>
					<td>` + calculateAttack(LDR, WAR).toFixed(2) + `</td>
					<td>` + calculateDefense(LDR, INT).toFixed(2) + `</td></tr>
			</table>`;
		getElement('assistDiv').innerHTML = '';
	}
}

function openMarchCard (cityIndex) {
	closeMenu();
	
	var city = cities[cityIndex];
	var source = null;
	var target = null;
	var viableOfficers = [];
	var viableUnits = [];
	var fromHTML = '';
	var targetHTML = '';
	marchCard.style.visibility = 'visible';
	if (city.Force == playerForce) {
		source = cityIndex;
		targets = getCities(city.Force, 'nonForce', [cityIndex, 'near']);
		var targetsHTML = '';
		for (var i = 0; i < targets.length; i++) {
			targetsHTML += '<option value="' + cities[targets[i]].Name + '">'
		}
		
		viableOfficers = getCityViableOfficers(cityIndex);
		var officersHTML = '';
		for (var i = 0; i < viableOfficers.length; i++) {
			officersHTML += '<option value="' + officers[viableOfficers[i]].Name + '">'
		}
		
		viableUnits = getCityViableUnits(cityIndex);
		var unitsHTML = '';
		for (var i = 0; i < viableUnits.length; i++) {
			var unit = units[viableUnits[i]];
			unitsHTML += `<label for="` + viableUnits[i] + `">
					<input type="checkbox" id="` + viableUnits[i] + `">
					<span>` + unitTypes[unit.Type].Name + ` | ` + unit.Strength + ` | ` + unit.Morale + `</span>
				</label>`;
		}
		
		var string = `<datalist id="targetList">` + targetsHTML + `</datalist><datalist id="officerList">` + officersHTML + `</datalist>
			<div class="title allyColor">March</div>
			<div class="marchContent">
				<table>
					<tr>
						<td>Source: <input type="text" id="source" value="` + cities[source].Name + `" readonly></td>
						<td>Target: <input type="text" id="target" list="targetList"></td>
					</tr>
					<tr>
						<td>Commander: <input type="text" id="commander" list="officerList" onkeyup="commanderChanged()" oninput="commanderChanged()"></td>
						<td><div id="relevantStats"></div></td>
					</tr>
					<tr>
						<td>
							Units: (type | strength | morale)<br />
							<div class="checkboxes">` + unitsHTML + `</div>
						</td>
					</tr>
					<tr>
						<td><div id="assistDiv"></div></td>
					</tr>
					<tr>
						<td><input type="button" value="March" onclick=""> <input type="button" value="Cancel" onclick="closeMarchCard()"></td>
						<td></td>
					</tr>
				</table>
			</div>`;
		marchCard.innerHTML = string;
	}
	else {
		target = cityIndex;
		
		// find possible sources
	}
}

function closeMarchCard () {
	marchCard.style.visibility = 'hidden';
	marchCard.innerHTML = '';
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