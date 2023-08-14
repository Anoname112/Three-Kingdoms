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

// Construct famous officers array, with attack and defense stats
var famous = ['Cao Cao', 'Xiahou Yuan', 'Liu Bei', 'Guan Yu', 'Sun Ce', 'Zhou Yu', 'Lu Bu', 'Zhang Liao', 'Gongsun Zan', 'Zhao Yun', 'Ma Teng', 'Ma Chao'];
famous = famous.map((x) => [getOfficerIndexByName(x), x]);
famous = famous.map((x) => [
	x[0],
	x[1],
	calculateAttack(officers[x[0]].LDR, officers[x[0]].WAR).toFixed(1),
	calculateDefense(officers[x[0]].LDR, officers[x[0]].INT).toFixed(1),
	((calculateAttack(officers[x[0]].LDR, officers[x[0]].WAR) + calculateDefense(officers[x[0]].LDR, officers[x[0]].INT)) / 2).toFixed(1)
]);
for (var i = 0; i < famous.length; i++) {
	for (var j = 0; j < abilities.length; j++) {
        if (abilities[j].Officers.includes(famous[i][0])) {
			famous[i].push(abilities[j].Name);
			break;
		}
	}
}
famous.sort((a, b) => b[4] - a[4]);

// Construct forces diligence array, then sort them
forces.map((x, i) => [officers[x.Ruler].Name, getForceDiligence(i)]).sort((a, b) => b[1] - a[1]);

// Display all forces diligence
for (var i = 0; i < forces.length; i++) console.log(officers[forces[i].Ruler].Name + ', ' + getForceDiligence(i));

// Print getCities sort result (not for console)
for (var i = 0; i < distances.length; i++) console.log(cities[resultCities[i]].Name + ', ' + distances[i]);

// Measure code performance
const startTime = performance.now();

const endTime = performance.now();
const elapsedTime = endTime - startTime;
console.log(`Execution time: ${elapsedTime} milliseconds`);