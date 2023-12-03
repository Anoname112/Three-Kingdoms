// Disband a unit
function disbandUnit (unitId) {
    for (var i = 0; i < units.length; i++) {
        if (units[i].Id == unitId) {
            units.splice(i, 1);
            break;
        }
    }
}

// Distribute food evenly to each force's cities. This also works for cities[i].Gold
var total = 0;
var force = officers[getOfficerIndexByName('Cao Cao')].Force;
var cityCount = getCities(force, 'force', false).length;
for (var i = 0; i < cities.length; i++) if (cities[i].Force == force) total += cities[i].Food;
var avg = parseInt(total / cityCount);
var remains = total - (avg * cityCount);
for (var i = 0; i < cities.length; i++) if (cities[i].Force == force) cities[i].Food = avg + (remains-- > 0 ? 1 : 0);

// Give certain force's units maximum Strength and Morale
for (var i = 0; i < units.length; i++) {
	if (units[i].Force == officers[getOfficerIndexByName('Yuan Shao')].Force) {
		units[i].Strength = strengthLimit;
		units[i].Morale = moraleLimit;
	}
}

// Give enemies units maximum Strength and Morale
for (var i = 0; i < units.length; i++) {
	if (units[i].Force != playerForce) {
		units[i].Strength = strengthLimit;
		units[i].Morale = moraleLimit;
	}
}

// Give player's units maximum Strength and Morale
for (var i = 0; i < units.length; i++) {
	if (units[i].Force == playerForce) {
		units[i].Strength = strengthLimit;
		units[i].Morale = moraleLimit;
	}
}

// Get average stats of officers
var avg = {'LDR': 0, 'WAR': 0, 'INT': 0, 'POL': 0, 'CHR': 0};
for (var i = 0; i < officers.length; i++) {
	avg.LDR += officers[i].LDR;
	avg.WAR += officers[i].WAR;
	avg.INT += officers[i].INT;
	avg.POL += officers[i].POL;
	avg.CHR += officers[i].CHR;
}
for (var key in avg) avg[key] = (avg[key] / officers.length).toFixed(2);
avg;

// Get top 30 officers
var total = baseOfficers.map((x) => [x['name'], x['total']]).sort((a, b) => b[1] - a[1]);
total.slice(0, 30);

// Construct array of cities with speciality
var special = [];
for (var i = 0; i < cities.length; i++) {
	if (cities[i].Speciality != '-') special.push([cities[i].Name, unitTypes[cities[i].Speciality].Name]);
}
special;

// Play as someone else
player = getOfficerIndexByName('Shi Xie');
playerForce = officers[player].Force;
openPlayerCard();

// Construct famous officers array, with battle stats and ability (delete is optional)
var famous = ['Cao Cao', 'Xiahou Yuan', 'Liu Bei', 'Guan Yu', 'Sun Ce', 'Zhou Yu', 'Lu Bu', 'Zhang Liao', 'Gongsun Zan', 'Zhao Yun', 'Ma Teng', 'Ma Chao'];
famous = famous.map((x) => [getOfficerIndexByName(x), x]);
famous = famous.map(function (x) {
	return {
		'Index': x[0],
		'Name': x[1],
		'Atk': calculateAttack(officers[x[0]].LDR, officers[x[0]].WAR).toFixed(1),
		'Def': calculateDefense(officers[x[0]].LDR, officers[x[0]].INT).toFixed(1),
		'Avg': ((calculateAttack(officers[x[0]].LDR, officers[x[0]].WAR) + calculateDefense(officers[x[0]].LDR, officers[x[0]].INT)) / 2).toFixed(1)
	};
});
for (var i = 0; i < famous.length; i++) {
	for (var j = 0; j < abilities.length; j++) {
		if (abilities[j].Officers.includes(famous[i]['Index'])) {
			famous[i]['Ability'] = abilities[j].Name;
			break;
		}
	}
	delete famous[i]['Index'];
}
famous.sort((a, b) => b['Avg'] - a['Avg']);

// Construct forces diligence array, then sort them
forces.map((x, i) => [officers[x.Ruler].Name, getForceDiligence(i)]).sort((a, b) => b[1] - a[1]);

// Display all forces diligence
for (var i = 0; i < forces.length; i++) console.log(officers[forces[i].Ruler].Name + ', ' + getForceDiligence(i));

// Print getCities sort result (not for console)
for (var i = 0; i < distances.length; i++) console.log(cities[resultCities[i]].Name + ', ' + distances[i]);

// Download a file
const content = 'Your file content';
const link = document.createElement("a");
const file = new Blob([content], { type: 'text/plain' });
link.href = URL.createObjectURL(file);
link.download = "file_name.txt";
link.click();

// Measure code performance
const startTime = performance.now();

const endTime = performance.now();
const elapsedTime = endTime - startTime;
console.log(`Execution time: ${elapsedTime} milliseconds`);
