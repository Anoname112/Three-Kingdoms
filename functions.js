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

function getEnemyForces (forceIndex) {
	var enemyForces = [];
	for (var i = 0; i < forces.length; i++) {
		if (i != forceIndex) enemyForces.push(i);
	}
	return enemyForces;
}

function getEnemyCities (forceIndex) {
	var enemyCities = [];
	for (var i = 0; i < cities.length; i++) {
		if (cities[i].Force != forceIndex && cities[i].Force != '-') enemyCities.push(i);
	}
	return enemyCities;
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
		target = getEnemyCities();
		
		var string = `<div class="title allyColor">March</div>
			<div><input type="button" value="Cancel" onclick="closeMarchCard()"></div>`;
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