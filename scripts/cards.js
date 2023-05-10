// Player card
function openPlayerCard () {
	var playerContent = getElement('playerContent');
	
	var dateArray = date.split('-').map((x) => parseInt(x));
	dateArray[2] += floor(mapAnimationStep * 10);
	var displayDate = dateArray.join('-');
	
	var forceIndex = getForceIndexById(playerForce);
	playerContent.innerHTML = `<div class="timeSpace allyColor">` +
			displayDate + `&nbsp;
			<div class="forceSquare" style="background-color: ` + forces[forceIndex].Color + `;"></div>&nbsp;` +
			cities[officers[player].City].Name + `
		</div>
		<div class="playerContent">
			<div class="playerPortrait"><img class="bigPortrait" src="portraits/` + officers[player].Name.split(' ').join('_') + `.jpg"></div>
			<div class="playerProfile">
				<div class="playerName allyColor">` + officers[player].Name + `</div>
				<b>` + forces[forceIndex].Name + `</b>
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
			buttons += '<input type="button" value="' + cityName + '" onclick="openCityCard(' + clickedObjects[i][1] + ', true); playAudio(clickSound);">';
		}
		else if (clickedObjects[i][0] == deployedCard) {
			var commanderName = officers[clickedObjects[i][1]].Name;
			buttons += '<input type="button" value="' + commanderName + '" onclick="openDeployedCard(' + clickedObjects[i][1] + ', true); playAudio(clickSound);">';
		}
	}
	selectCard.innerHTML = `<div class="selectContent">` + buttons + `<input type="button" value="Cancel" onclick="closeCard(selectCard); playAudio(clickSound);"></div>`;
	
	selectCard.style.visibility = 'visible';
	if (mousePos.X + selectCard.clientWidth > mapSize) selectCard.style.left = (mousePos.X - selectCard.clientWidth) + 'px';
	else selectCard.style.left = mousePos.X + 'px';
	if (mousePos.Y + selectCard.clientHeight > mapSize) selectCard.style.top = (mousePos.Y - selectCard.clientHeight) + 'px';
	else selectCard.style.top = mousePos.Y + 'px';
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
			if (units[viableUnits[i]].Morale < moraleLimit) drillable = true;
		}
		
		var marchDisabled = viableOfficers.length > 0 && viableUnits.length > 0 && city.Food >= getCityLowestMarchCost(cityIndex) ? '' : ' disabled';
		var farmDisabled = viableOfficers.length > 0 && city.cFarm < city.Farm && city.Gold >= devCost ? '' : ' disabled';
		var tradeDisabled = viableOfficers.length > 0 && city.cTrade < city.Trade && city.Gold >= devCost ? '' : ' disabled';
		var techDisabled = viableOfficers.length > 0 && city.cTech < city.Tech && city.Gold >= devCost ? '' : ' disabled';
		var defenseDisabled = viableOfficers.length > 0 && city.cDefense < city.Defense && city.Gold >= devCost ? '' : ' disabled';
		var orderDisabled = viableOfficers.length > 0 && city.cOrder < orderLimit && city.Gold >= devCost ? '' : ' disabled';
		var establishDisabled = viableOfficers.length > 0 && unitCount < unitLimit && city.Gold >= getCityLowestEstablishCost() ? '' : ' disabled';
		var recuritDisabled = viableOfficers.length > 0 && recuritable && city.Gold >= getCityLowestRecuritCost(cityIndex) ? '' : ' disabled';
		var drillDisabled = viableOfficers.length > 0 && drillable ? '' : ' disabled';
		var uTransferDisabled = viableUnits.length > 0 && getTransferCities(cityIndex).length > 0 ? '' : ' disabled';
		var employDisabled = viableOfficers.length > 0 && getOfficers(city.Force, 'nonForce').length > 0 ? '' : ' disabled';
		var dismissDisabled = getCityNonViableOfficers(cityIndex, true).length > 0 ? '' : ' disabled';
		var oTransferDisabled = viableOfficers.length > 0 && getCities(city.Force, 'force').length > 1 ? '' : ' disabled';
		
		buttons += `<input type="button" value="March" onclick="openMarchCard(` + cityIndex + `); playAudio(clickSound);"` + marchDisabled + `>
			<div class="buttonsGroup">
				<div class="label">Development &#9654;</div>
				<div class="buttons">
					<input type="button" value="Farm" onclick="openDevCard(` + cityIndex + `, 'Farm'); playAudio(clickSound);"` + farmDisabled + `>
					<input type="button" value="Trade" onclick="openDevCard(` + cityIndex + `, 'Trade'); playAudio(clickSound);"` + tradeDisabled + `>
					<input type="button" value="Tech" onclick="openDevCard(` + cityIndex + `, 'Tech'); playAudio(clickSound);"` + techDisabled + `>
					<input type="button" value="Defense" onclick="openDevCard(` + cityIndex + `, 'Defense'); playAudio(clickSound);"` + defenseDisabled + `>
					<input type="button" value="Order" onclick="openDevCard(` + cityIndex + `, 'Order'); playAudio(clickSound);"` + orderDisabled + `>
				</div>
			</div>
			<div class="buttonsGroup">
				<div class="label">Military &#9654;</div>
				<div class="buttons">
					<input type="button" value="Establish" onclick="openUnitCard(` + cityIndex + `, 'Establish'); playAudio(clickSound);"` + establishDisabled + `>
					<input type="button" value="Recurit" onclick="openUnitCard(` + cityIndex + `, 'Recurit'); playAudio(clickSound);"` + recuritDisabled + `>
					<input type="button" value="Drill" onclick="openUnitCard(` + cityIndex + `, 'Drill'); playAudio(clickSound);"` + drillDisabled + `>
					<input type="button" value="Transfer" onclick="openUnitCard(` + cityIndex + `, 'Transfer'); playAudio(clickSound);"` + uTransferDisabled + `>
				</div>
			</div>
			<div class="buttonsGroup">
				<div class="label">Personel &#9654;</div>
				<div class="buttons">
					<input type="button" value="Employ" onclick="openOfficerCard(` + cityIndex + `, 'Employ'); playAudio(clickSound);"` + employDisabled + `>
					<input type="button" value="Dismiss" onclick="openOfficerCard(` + cityIndex + `, 'Dismiss'); playAudio(clickSound);"` + dismissDisabled + `>
					<input type="button" value="Transfer" onclick="openOfficerCard(` + cityIndex + `, 'Transfer'); playAudio(clickSound);"` + oTransferDisabled + `>
				</div>
			</div>
			<input type="button" value="Cancel" onclick="closeCard(cityCard); playAudio(clickSound);">`;
	}
	else {
		if (city.Force == '-') backColor = 'neutralColor';
		var disabled = getForceMarchableCities(playerForce).length > 0 ? '' : ' disabled';
		buttons += `<input type="button" value="March" onclick="openMarchCard(` + cityIndex + `); playAudio(clickSound);"` + disabled + `>
			<input type="button" value="Cancel" onclick="closeCard(cityCard); playAudio(clickSound);">`;
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
function deploy (commander, target, deployUnits, assistOfficers) {
	initPathfinding();
	startPathfinding(officers[commander].Position, getCityPosition(target));
	officers[commander].Objective = ['March', target, finalPath];
	officers[commander].Progress = 0;
	for (var i = 0; i < deployUnits.length; i++) {
		units[deployUnits[i]].Objective = ['March', commander];
		units[deployUnits[i]].Progress = 0;
	}
	for (var i = 0; i < assistOfficers.length; i++) {
		officers[assistOfficers[i]].Objective = ['Assist', commander];
		officers[assistOfficers[i]].Progress = 0;
	}
}

// March card
function march () {
	var source = getElement('source') ? getElement('source').value : '';
	var target = getElement('target') ? getElement('target').value : '';
	source = getCityIndexByName(source);
	target = getCityIndexByName(target);
	if (Number.isInteger(source) && Number.isInteger(target) && getCities(playerForce, 'force').includes(source)) {
		var commander = getElement('commander') ? getElement('commander').value : '';
		commander = getOfficerIndexByName(commander);
		if (Number.isInteger(commander)) {
			var totalCost = 0;
			var deployUnits = [];
			for (var i = 0; i < units.length; i++) {
				if (getElement('unit' + i) && getElement('unit' + i).checked) {
					totalCost += units[i].Strength * marchCost;
					deployUnits.push(i);
				}
			}
			if (deployUnits.length > 0 && cities[source].Food >= totalCost) {
				var assistOfficers = [];
				for (var i = 0; i < officers.length; i++) {
					if (getElement('officer' + i) && getElement('officer' + i).checked) assistOfficers.push(i);
				}
				
				deploy(commander, target, deployUnits, assistOfficers);
				cities[source].Food -= totalCost;
				
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
	var stats = getStatsByName(commander);
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
	var stats = getStatsByName(commander);
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

// March & Unit card
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
					<td>
						<input type="button" value="March" onclick="march(); playAudio(confirmSound);">
						<input type="button" value="Cancel" onclick="closeCard(marchCard); playAudio(clickSound);">
					</td>
				</tr>
			</table>
		</div>`;
	
	marchCard.innerHTML = string;
	marchCard.style.visibility = 'visible';
	if (city.Force == playerForce) getElement('target').focus();
	else getElement('source').focus();
}

// Dev card
function develop (cityIndex, objective) {
	if (Number.isInteger(cityIndex) && (objective == 'Farm' || objective == 'Trade' || objective == 'Tech' || objective == 'Defense' || objective == 'Order')) {
		var devOfficers = [];
		for (var i = 0; i < officers.length; i++) {
			if (getElement('officer' + i) && getElement('officer' + i).checked) devOfficers.push(i);
		}
		
		var totalCost = devOfficers.length * devCost;
		if (devOfficers.length > 0 && cities[cityIndex].Gold >= totalCost) {
			for (var i = 0; i < devOfficers.length; i++) {
				officers[devOfficers[i]].Objective = [objective, cityIndex];
				officers[devOfficers[i]].Progress = 0;
			}
			
			cities[cityIndex].Gold -= totalCost;
			
			closeCard(devCard);
			openInfoCard('City', cityIndex);
			draw();
		}
	}
}

// Dev card
function openDevCard (cityIndex, objective) {
	closeCard(cityCard);
	
	var sort = objective == 'Farm' || objective == 'Trade' ? 'POL' : (objective == 'Tech' ? 'INT' : (objective == 'Defense' ? 'WAR' : (objective == 'Order' ? 'LDR' : null)));
	var viableOfficers = getCityViableOfficers(cityIndex, sort);
	if (viableOfficers.length > 0) {
		var city = cities[cityIndex];
		
		var objectiveHTML = '';
		switch (objective) {
			case 'Farm': objectiveHTML += 'Farm: <input type="text" value="' + city.cFarm + '/' + city.Farm + '" readonly>'; break;
			case 'Trade': objectiveHTML += 'Trade: <input type="text" value="' + city.cTrade + '/' + city.Trade + '" readonly>'; break;
			case 'Tech': objectiveHTML += 'Tech: <input type="text" value="' + city.cTech + '/' + city.Tech + '" readonly>'; break;
			case 'Defense': objectiveHTML += 'Defense: <input type="text" value="' + city.cDefense + '/' + city.Defense + '" readonly>'; break;
			case 'Order': objectiveHTML += 'Order: <input type="text" value="' + city.cOrder + '/' + orderLimit + '" readonly>'; break;
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
							<input type="button" value="` + objective + `" onclick="develop(` + cityIndex + `, '` + objective + `'); playAudio(confirmSound);">
							<input type="button" value="Cancel" onclick="closeCard(devCard); playAudio(clickSound);">
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
		var target = getElement('target') && isNumeric(getElement('target').value) ? parseInt(getElement('target').value) : '';
		var forceCities = getCities(cities[cityIndex].Force, 'force');
		if (Number.isInteger(cityIndex) && Number.isInteger(target) && forceCities.includes(cityIndex) && forceCities.includes(target)) {
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
				// Establish
				var unitTypeIndex = parseInt(getElement('unitType').value);
				
				var cost = unitTypes[unitTypeIndex].Cost;
				if (cities[cityIndex].Gold >= cost) {
					officers[officer].Objective = [objective, unitTypeIndex];
					officers[officer].Progress = 0;
					
					cities[cityIndex].Gold -= cost;
					
					closeCard(unitCard);
					openInfoCard('City', cityIndex);
					draw();
				}
			}
			else if (getElement('unit')) {
				// Recurit or Drill
				var unitIndex = parseInt(getElement('unit').value);
				
				var cost = objective == 'Recurit' ? unitTypes[units[unitIndex].Type].Cost * recuritCostMultiplier : 0;
				if (cities[cityIndex].Gold >= cost) {
					officers[officer].Objective = [objective, units[unitIndex].Id];
					officers[officer].Progress = 0;
					units[unitIndex].Objective = [objective, officer];
					units[unitIndex].Progress = 0;
					
					cities[cityIndex].Gold -= cost;
					
					closeCard(unitCard);
					openInfoCard('City', cityIndex);
					draw();
				}
			}
		}
	}
}

// Unit & Officer card
function officerChanged (inputId) {
	getElement('relevantStats').innerHTML = '';
	
	var inputId = inputId ? inputId : 'officer';
	var officer = getElement(inputId) ? getElement(inputId).value : '';
	var officerIndex = getOfficerIndexByName(officer);
	if (officerIndex != null) getElement('relevantStats').innerHTML = createStatsTable(officerIndex);	
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
							<input type="button" value="` + objective + `" onclick="military(` + cityIndex + `, '` + objective + `'); playAudio(confirmSound);">
							<input type="button" value="Cancel" onclick="closeCard(unitCard); playAudio(clickSound);">
						</td>
					</tr>
				</table>
			</div>`;
		
		unitCard.style.visibility = 'visible';
		getElement('target').focus();
	}
	else {
		var viableOfficers = getCityViableOfficers(cityIndex, objective == 'Drill' ? 'LDR' : 'CHR');
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
						if (unit.Morale < moraleLimit) {
							options += '<option value="' + viableUnits[i] + '">' + unitTypes[unit.Type].Name + ' | ' + unit.Strength + ' | ' + unit.Morale + '</option>';
						}
					}
					objectiveHTML += 'Unit: <select id="unit">' + options + '</select>';
					break;
				default:
					break;
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
							<td><div id="officersDiv">Officer: <input type="text" id="officer" list="officerList" oninput="officerChanged()"></div></td>
							<td><div id="relevantStats"></div></td>
						</tr>
						<tr>
							<td>
								<input type="button" value="` + objective + `" onclick="military(` + cityIndex + `, '` + objective + `'); playAudio(confirmSound);">
								<input type="button" value="Cancel" onclick="closeCard(unitCard); playAudio(clickSound);">
							</td>
						</tr>
					</table>
				</div>`;
			
			unitCard.style.visibility = 'visible';
			if (officersHTML.length > 0) getElement('officersDiv').style.visibility = 'visible';
			if (objective == 'Establish') getElement('unitType').focus();
			else getElement('unit').focus();
		}
	}
}

// Officer card
function personel (cityIndex, objective) {
	var choosenOfficers = [];
	for (var i = 0; i < officers.length; i++) {
		if (getElement('officer' + i) && getElement('officer' + i).checked) choosenOfficers.push(i);
	}
	if (choosenOfficers.length > 0) {
		if (objective == 'Employ') {
			var target = getElement('target') ? getElement('target').value : '';
			target = getOfficerIndexByName(target);
			if (Number.isInteger(target)) {
				for (var i = 0; i < choosenOfficers.length; i++) {
					officers[choosenOfficers[i]].Objective = [objective, target];
					officers[choosenOfficers[i]].Progress = 0;
				}
				
				closeCard(officerCard);
				openInfoCard('City', cityIndex);
				draw();
			}
		}
		else if (objective == 'Dismiss') {
			for (var i = 0; i < choosenOfficers.length; i++) {
				var officer = officers[choosenOfficers[i]];
				if (officer.Objective[0] == 'March') dismissDeployed(choosenOfficers[i], true);
				else if (officer.Objective[0] == 'Assist' || officer.Objective[0] == 'Employ') {
					officer.Objective = officer.Progress > 0 ? ['Return', cityIndex] : '-';
					officer.Progress = officer.Progress > 0 ? 0 : '-';
				}
				else {
					if (officer.Objective[0] == 'Recurit' || officer.Objective[0] == 'Drill') {
						var unitIndex = getUnitIndexById(officer.Objective[1]);
						units[unitIndex].Objective = '-';
						units[unitIndex].Progress = '-';
					}
					officer.Objective = '-';
					officer.Progress = '-';
				}
			}
			
			closeCard(officerCard);
			openInfoCard('City', cityIndex);
			draw();
		}
		else if (objective == 'Transfer') {
			var target = getElement('target') ? parseInt(getElement('target').value) : '';
			if (Number.isInteger(target)) {
				for (var i = 0; i < choosenOfficers.length; i++) {
					officers[choosenOfficers[i]].Objective = [objective, target];
					officers[choosenOfficers[i]].Progress = 0;
				}
				
				closeCard(officerCard);
				openInfoCard('City', cityIndex);
				draw();
			}
		}
	}
}

// Officer card
function openOfficerCard (cityIndex, objective) {
	closeCard(cityCard);
	
	var firstRowHTML = '';
	var secondRowHTML = '';
	var officersHTML = '';
	if (objective == 'Employ') {
		var targetOfficers = getOfficers(cities[cityIndex].Force, 'nonForce');
		var targetOfficerList = '<datalist id="officerList"';
		for (var i = 0; i < targetOfficers.length; i++) {
			if (officers[targetOfficers[i]].City != '-' && !isRuler(targetOfficers[i])) targetOfficerList += '<option value="' + officers[targetOfficers[i]].Name + '">';
		}
		targetOfficerList += '</datalist>';
		
		var viableOfficers = getCityViableOfficers(cityIndex, 'CHR');
		if (viableOfficers.length > 0) {
			for (var i = 0; i < viableOfficers.length; i++) {
				var officer = officers[viableOfficers[i]];
				officersHTML += `<label for="officer` + viableOfficers[i] + `">
						<input type="checkbox" id="officer` + viableOfficers[i] + `">
						<span>` + officer.Name + ` | ` + officer.CHR + `</span>
					</label>`;
			}
			
			firstRowHTML = `<tr>
					<td>` + targetOfficerList + `Employ: <input type="text" id="target" list="officerList" oninput="officerChanged('target')"></td>
					<td><div id="relevantStats"></div></td>
				</tr>`;
			secondRowHTML = `<tr><td colspan="2"><div id="officersDiv" class="checkboxes">` + officersHTML + `</div></td></tr>`;
		}
	}
	else if (objective == 'Dismiss') {
		var nonViableOfficers = getCityNonViableOfficers(cityIndex, true);
		
		if (nonViableOfficers.length > 0) {
			for (var i = 0; i < nonViableOfficers.length; i++) {
				var officer = officers[nonViableOfficers[i]];
				if (officer.Objective[0] != 'Return') {
					officersHTML += `<label for="officer` + nonViableOfficers[i] + `">
							<input type="checkbox" id="officer` + nonViableOfficers[i] + `">
							<span>` + officer.Name + ` | ` + officer.Objective[0] + `</span>
						</label>`;
				}
			}
			
			firstRowHTML = `<tr><td>City: <input type="text" value="` + cities[cityIndex].Name + `" readonly></td></tr>`;
			secondRowHTML = `<tr><td><div id="officersDiv" class="checkboxes">` + officersHTML + `</div></td></tr>`;
		}
	}
	else if (objective == 'Transfer') {
		var targets = getCities(cities[cityIndex].Force, 'force', [cityIndex, 'near']);
		var viableOfficers = getCityViableOfficers(cityIndex);
		if (viableOfficers.length > 0 && targets.length > 0) {
			var targetsHTML = '<select id="target">';
			for (var i = 0; i < targets.length; i++) {
				if (targets[i] != cityIndex) targetsHTML += '<option value="' + targets[i] + '">' + cities[targets[i]].Name + '</option>'
			}
			targetsHTML += '</select>';
			
			for (var i = 0; i < viableOfficers.length; i++) {
				var officer = officers[viableOfficers[i]];
				officersHTML += `<label for="officer` + viableOfficers[i] + `">
						<input type="checkbox" id="officer` + viableOfficers[i] + `">
						<span>` + officer.Name + ` | ` + officer.LDR + ` | ` + officer.WAR + ` | ` + officer.INT + ` | ` + officer.POL + ` | ` + officer.CHR + `</span>
					</label>`;
			}
			
			firstRowHTML = `<tr>
					<td>Source: <input type="text" value="` + cities[cityIndex].Name + `" readonly></td>
					<td>Target: ` + targetsHTML + `</td>
				</tr>`;
			secondRowHTML = `<tr><td colspan="2"><div id="officersDiv" class="checkboxes">` + officersHTML + `</div></td></tr>`;
		}
	}
	
	if (firstRowHTML.length > 0 && secondRowHTML.length > 0) {
		officerCard.innerHTML = `<div class="title allyColor">` + objective + `</div>
			<div class="officerContent">
				<table>` +
					firstRowHTML +
					secondRowHTML +
					`<tr>
						<td>
							<input type="button" value="` + objective + `" onclick="personel(` + cityIndex + `, '` + objective + `'); playAudio(confirmSound);">
							<input type="button" value="Cancel" onclick="closeCard(officerCard); playAudio(clickSound);">
						</td>
					</tr>
				</table>
			</div>`;
		
		officerCard.style.visibility = 'visible';
		if (officersHTML.length > 0) getElement('officersDiv').style.visibility = 'visible';
		if (getElement('target')) getElement('target').focus();
	}
}

// Deployed card
function dismissDeployed (commander, redraw) {
	closeCard(deployedCard);
	
	var cityIndex = officers[commander].City;
	var progress = officers[commander].Progress;
	if (Number.isInteger(progress)) {
		officers[commander].Objective = progress > 0 ? ['Return', cityIndex] : '-';
		officers[commander].Progress = progress > 0 ? 0 : '-';
		for (var i = 0; i < units.length; i++) {
			if (units[i].Objective != '-' && units[i].Objective[0] == 'March'  && units[i].Objective[1] == commander) {
				units[i].Objective = progress > 0 ? ['Return', cityIndex] : '-';
				units[i].Progress = progress > 0 ? 0 : '-';
				units[i].Vec = null;
			}
		}
		for (var i = 0; i < officers.length; i++) {
			if (officers[i].Objective != '-' && officers[i].Objective[0] == 'Assist' && officers[i].Objective[1] == commander) {
				officers[i].Objective = progress > 0 ? ['Return', cityIndex] : '-';
				officers[i].Progress = progress > 0 ? 0 : '-';
			}
		}
		
		if (redraw) {
			openInfoCard('City', officers[commander].City);
			draw();
		}
	}
}

// Deployed card
function openDeployedCard (commander, select) {
	if (select) closeCard(selectCard);
	openInfoCard('Unit', commander);
	
	var backColor = officers[commander].Force == playerForce ? 'allyColor' : 'enemyColor';
	
	hoverCard.style.visibility = 'hidden';
	
	var buttons = `<input type="button" value="Dismiss" onclick="dismissDeployed(` + commander + `, true); playAudio(confirmSound);">
		<input type="button" value="Cancel" onclick="closeCard(deployedCard); playAudio(clickSound);">`;
	deployedCard.innerHTML = `<div class="unitName ` + backColor + `">` + officers[commander].Name + ` Unit</div>
		<div class="selectContent">` + buttons + `</div>`;
	
	deployedCard.style.visibility = 'visible';
	if (mousePos.X + deployedCard.clientWidth > mapSize) deployedCard.style.left = (mousePos.X - deployedCard.clientWidth) + 'px';
	else deployedCard.style.left = mousePos.X + 'px';
	if (mousePos.Y + deployedCard.clientHeight > mapSize) deployedCard.style.top = (mousePos.Y - deployedCard.clientHeight) + 'px';
	else deployedCard.style.top = mousePos.Y + 'px';
}

// Info card
function createCityTable (cityIndex) {
	var city = cities[cityIndex];
	var forceIndex = getForceIndexById(city.Force);
	var forceName = forces[forceIndex] ? forces[forceIndex].Name : '-'
	return `<table class="stats">
			<tr><th colspan="2">` + forceName + `</th><th>Farm</th><td>` + city.cFarm + `/` + city.Farm + `</td></tr>
			<tr><th>Gold</th><td>` + city.Gold + `</td><th>Trade</th><td>` + city.cTrade + `/` + city.Trade + `</td></tr>
			<tr><th>Food</th><td>` + city.Food + `</td><th>Tech</th><td>` + city.cTech + `/` + city.Tech + `</td></tr>
			<tr><th>Strength</th><td>` + getCityStrength(cityIndex) + `</td><th>Defense</th><td>` + city.cDefense + `/` + city.Defense + `</td></tr>
			<tr><th>Speciality</th><td>` + city.Speciality + `</td><th>Order</th><td>` + city.cOrder + `/` + orderLimit + `</td></tr>
		</table>`;
}

// Info card
function createOfficersTable (officersIndex, cityIndex) {
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
	if (cityIndex) {
		return `<table class="stats">
		<tr>
			<th onclick="openInfoCard('City', ` + cityIndex + `)">Officers (` + officersIndex.length + `)</th>
			<th class="sortable" onclick="openInfoCard('City', ` + cityIndex + `, 'LDR')"><span>LDR</span></th>
			<th class="sortable" onclick="openInfoCard('City', ` + cityIndex + `, 'WAR')"><span>WAR</span></th>
			<th class="sortable" onclick="openInfoCard('City', ` + cityIndex + `, 'INT')"><span>INT</span></th>
			<th class="sortable" onclick="openInfoCard('City', ` + cityIndex + `, 'POL')"><span>POL</span></th>
			<th class="sortable" onclick="openInfoCard('City', ` + cityIndex + `, 'CHR')"><span>CHR</span></th>
			<th>Objective</th>
			<th>Progress</th>
		</tr>` + officersHTML + `</table>`;
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

// Info card
function createUnitsTable (unitsIndex) {
	var unitsHTML = '';
	for (var i = 0; i < unitsIndex.length; i++) {
		var unit = units[unitsIndex[i]];
		var objective = unit.Objective == '-' ? '-' : unit.Objective[0];
		var name = '-';
		switch (objective) {
			case 'March':
			case 'Recurit':
			case 'Drill':
				name = officers[unit.Objective[1]].Name;
				break;
			case 'Transfer':
				name = cities[unit.Objective[1]].Name;
				break;
		}
		unitsHTML += `<tr>
				<td>` + unitTypes[unit.Type].Name + `</td>
				<td>` + unit.Strength + `</td>
				<td>` + unit.Morale + `</td>
				<td>` + objective + `</td>
				<td>` + name + `</td>
				<td>` + unit.Progress + `</td>
			</tr>`;
	}
	return `<table class="stats">
		<tr>
			<th>Units (` + unitsIndex.length + `)</th>
			<th>Strength</th>
			<th>Morale</th>
			<th>Objective</th>
			<th>Name</th>
			<th>Progress</th>
		</tr>` + unitsHTML + `</table>`;
}

// Info card
function openInfoCard (mode, index, sort) {
	if (mode == 'City') {
		var backColor = 'enemyColor';
		if (cities[index].Force == '-') backColor = 'neutralColor';
		else if (cities[index].Force == playerForce) backColor = 'allyColor';
		
		var cityOfficers = sort ? getCityOfficers(index, sort) : getCityOfficers(index);
		var cityUnits = getCityUnits(index);
		
		infoCard.innerHTML = `<div class="cityName ` + backColor + `">` + cities[index].Name + `</div>
			<div class="cityContent">` +
				createCityTable(index) + `<br />` +
				createOfficersTable(cityOfficers, index) + `<br />` +
				createUnitsTable(cityUnits) + `
			</div>`;
	}
	else if (mode == 'Unit') {
		var backColor = 'enemyColor';
		if (officers[index].Force == playerForce) backColor = 'allyColor';
		
		var deployedUnits = getDeployedUnits(index);
		var assistOfficers = getDeployedAssistOfficers(index);
		
		infoCard.innerHTML = `<div class="unitName ` + backColor + `">` + officers[index].Name + ` Unit</div>
			<div class="deployedContent">
				<table class="stats">
					<tr><th colspan="2">` + forces[getForceIndexById(officers[index].Force)].Name + `</th></tr>
					<tr><th>Strength</th><td style="text-align: center;">` + getDeployedStrength(index) + `</td></tr>
					<tr><th>Target</th><td style="text-align: center;">` + cities[officers[index].Objective[1]].Name + `</td></tr>
				</table><br />` +
				createUnitsTable(deployedUnits) + `<br />` +
				createOfficersTable([index].concat(assistOfficers)) + `<br />
				<b>Assisted Stats:</b>
				<div id="infoStats"></div>
			</div>`;
		
		var assistedStats = getAssistedStats(index);
		calculatedStatsTable('infoStats', assistedStats[0], assistedStats[1], assistedStats[2]);
	}
	
	infoCard.style.visibility = 'visible';
}

// Import card
function importData () {
	var data = getElement('importTextarea') ? getElement('importTextarea').value : '';
	
	if (data.length == 0) return;
	
	var json = JSON.parse(data);
	if (json && json['player']) {
		loadData(
			JSON.parse(json['date']),
			JSON.parse(storage['player']),
			JSON.parse(storage['playerForce']),
			JSON.parse(storage['forces']),
			JSON.parse(storage['cities']),
			JSON.parse(storage['officers']),
			JSON.parse(storage['units'])
		);
		
		closeCard(importCard);
		return;
	}
	
	alert("Error: Invalid import data.");
}

// Import card
function openImportCard () {
	importCard.innerHTML = `<div class="title allyColor">Import</div>
		<div class="importContent">
			<table>
				<tr><td><textarea id="importTextarea" cols="40" rows="10"></textarea><br /></td></tr>
				<tr>
					<td>
						<input type="button" id="importButton" onclick="importData()" value="Import">
						<input type="button" id="importCancel" onclick="closeCard(importCard)" value="Cancel">
					</td>
				</tr>
			</table>
		</div>`;
	
	importCard.style.visibility = 'visible';
	getElement('importTextarea').focus();
}

function closeCard (card, dontEmpty) {
	card.style.visibility = 'hidden';
	if (!dontEmpty) card.innerHTML = '';
}