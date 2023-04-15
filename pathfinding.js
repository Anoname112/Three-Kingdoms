var instant = true;
var startPoint;
var endPoint;
var paths;
var explored;
var openset;
var finalPath;

function initPathfinding () {
	startPoint = new Point (0, 0);
	endPoint = new Point (0, 0);
	paths = [];
	explored = [];
	openset = [];
	finalPath = null;
}

function startPathfinding (start, end) {
	startPoint = start;
	endPoint = end;
	
	// Initiate start point and openset
	paths.push(new Path([startPoint]));
	explored.push(startPoint);
	var neighbours = getNeighbours(startPoint);
	for (var i = 0; i < neighbours.length; i++) {
		if (!isExplored(neighbours[i]) && !inOpenset(neighbours[i]) && map[neighbours[i].X][neighbours[i].Y] != 1) {
			openset.push(neighbours[i]);
		}
	}
	
	pathfinding();
}

function pathfinding () {
	if (instant) {
		while (finalPath == null && paths.length > 0) expand();
	}
	else expand();
}

function getNeighbours (point) {
	var neighbours = [];
	
	var top = new Point(point.X, point.Y - 1);
	var bottom = new Point(point.X, point.Y + 1);
	var left = new Point(point.X -  1,  point.Y);
	var right = new Point(point.X +  1, point.Y);
	
	if (top.Y >= 0) neighbours.push(top);
	if (bottom.Y < mapHeight) neighbours.push(bottom);
	if (left.X >= 0) neighbours.push(left);
	if (right.X < mapWidth) neighbours.push(right);
	
	return neighbours;
}

function isExplored (point) {
	var found = false;
	for (var i = 0; i < explored.length; i++) {
		if (point.X == explored[i].X && point.Y == explored[i].Y) found = true;
	}
	return found; 
}

function inOpenset (point) {
	var found = false;
	for (var i = 0; i < openset.length; i++) {
		if (point.X == openset[i].X && point.Y == openset[i].Y) found = true;
	}
	return found; 
}

function removeFromOpenset (point) {
	var newopenset = [];
	for (var i = 0; i < openset.length; i++) {
		if (!(point.X == openset[i].X && point.Y == openset[i].Y)) newopenset.push(openset[i]);
	}
	openset = newopenset;
}

function clonePath (path) {
	var points = [];
	for (var i = 0; i < path.Points.length; i++) {
		var x = path.Points[i].X;
		var y = path.Points[i].Y;
		points.push(new Point(x, y));
	}
	return new Path(points);
}

function removePath (index) {
	var newpaths = [];
	for (var i = 0; i < paths.length; i++) {
		if (i != index) newpaths.push(paths[i]);
	}
	paths = newpaths;
}

function getDistance (start, end) {
	var distanceX = end.X - start.X;
	var distanceY = end.Y - start.Y;
	return Math.sqrt((distanceX * distanceX)) + Math.sqrt((distanceY * distanceY));
}

function expand () {
	// Choose a path and openset with lowest cost to expand
	var lowestCost = 90001;
	var chosenOpenset = null;
	var chosenPathIndex = null;
	for (var i = 0; i < paths.length; i++) {
		var tailNeighbours = getNeighbours(paths[i].Tail());
		
		// Get openset neighbour with lowest total cost to end point
		var cost = paths[i].Cost();
		for (var j = 0; j < tailNeighbours.length; j++) {
			var distance = getDistance(tailNeighbours[j], endPoint);
			var totalCost = cost + distance;
			if (inOpenset(tailNeighbours[j]) && totalCost <= lowestCost) {
				// With <= instead of < meaning the program will favor the most recent added path 
				lowestCost = totalCost;
				chosenPathIndex = i;
				chosenOpenset = tailNeighbours[j];
			}
		}
	}
	
	// Explore the openset
	if (chosenPathIndex != null) {
		var newPath = clonePath(paths[chosenPathIndex]);
		newPath.Points.push(chosenOpenset);
		paths.push(newPath);
		explored.push(chosenOpenset);
		removeFromOpenset(chosenOpenset);
		if (chosenOpenset.X == endPoint.X && chosenOpenset.Y == endPoint.Y) {
			finalPath = newPath;
			/*
			if (intervalId != null) {
				clearInterval(intervalId);
				intervalId = null;
			}
			*/
		}
		else {
			var neighbours = getNeighbours(chosenOpenset);
			for (var i = 0; i < neighbours.length; i++) {
				if (!isExplored(neighbours[i]) && !inOpenset(neighbours[i]) && map[neighbours[i].X][neighbours[i].Y] != 1) {
					openset.push(neighbours[i]);
				}
			}
		}
	}
	
	// Remove path no openset neighbour
	var i = 0;
	while (i < paths.length) {
		var tailNeighbours = getNeighbours(paths[i].Tail());
		
		var foundOpensetNeighbour = false;
		for (var j = 0; j < tailNeighbours.length; j++) {
			if (inOpenset(tailNeighbours[j])) {
				foundOpensetNeighbour = true;
			}
		}
		
		if (foundOpensetNeighbour) i++;
		else removePath(i);
	}
}