function Officer (name, force, city, position, leadership, war, intelligence, politic, charisma, objective, progress) {
	this.Name = name;
	this.Force = force;
	this.City = city;
	this.Position = position;
	this.LDR = leadership;
	this.WAR = war;
	this.INT = intelligence;
	this.POL = politic;
	this.CHR = charisma;
	this.Objective = objective;
	this.Progress = progress;
}

function Ability (name, desc, cooldown, allyEffect, enemyEffect, officers) {
	this.Name = name;
	this.Desc = desc;
	this.Cooldown = cooldown;
	this.AllyEffect = allyEffect;
	this.EnemyEffect = enemyEffect;
	this.Officers = officers;
}

function Item (name, type, decs, value, stats, abilities, owner) {
	this.Name = name;
	this.Type = type;
	this.Desc = desc;
	this.Value = value;
	this.Stats = stats;
	this.Abilities = abilities;
	this.Owner = owner;
}

function Scenario (name, date, forces, officers, units, playables) {
	this.Name = name;
	this.Date = date;
	this.Forces = forces;
	this.Officers = officers;
	this.Units = units;
	this.Playables = playables;
}

function Force (id, name, ruler, color) {
	this.Id = id;
	this.Name = name;
	this.Ruler = ruler;
	this.Color = color;
}

function City (name, force, gold, food, farm, trade, tech, defense, cfarm, ctrade, ctech, cdefense, corder, speciality) {
	this.Name = name;
	this.Force = force;
	this.Gold = gold;
	this.Food = food;
	this.Farm = farm;
	this.Trade = trade;
	this.Tech = tech;
	this.Defense = defense;
	this.cFarm = cfarm;
	this.cTrade = ctrade;
	this.cTech = ctech;
	this.cDefense = cdefense;
	this.cOrder = corder;
	this.Speciality = speciality;
}

function Unit (id, type, force, city, position, morale, strength, objective, progress, vec, target, cooldown) {
	this.Id = id;
	this.Type = type;
	this.Force = force;
	this.City = city;
	this.Position = position;
	this.Morale = morale; 
	this.Strength = strength;
	this.Objective = objective;
	this.Progress = progress;
	this.Vec = vec;
	this.Target = target;
	this.Cooldown = cooldown;
}

function UnitType (name, type, speed, range, effectiveness, cost, icon) {
	this.Name = name;
	this.Type = type;
	this.Speed = speed;
	this.Range = range;
	// [Spearmen, Horsemen, Archer]
	this.Effectiveness = effectiveness;
	this.Cost = cost;
	this.Icon = icon;
}

function Path (points) {
	this.Points = points;
	this.Cost = function () {
		return this.Points.length - 1;
	}
	this.Tail = function () {
		return this.Points[this.Points.length - 1];
	}
}

function Point (x, y) {
	this.X = x;
	this.Y = y;
}

Point.prototype.length = function () {
	return Math.sqrt(this.X * this.X + this.Y * this.Y);
}

Point.prototype.normalize = function () {
	var length = this.length();
	return new Point(this.X / length, this.Y / length);
}

Point.prototype.add = function (point) {
	return new Point(this.X + point.X, this.Y + point.Y);
}

Point.prototype.subtract = function (point) {
	return new Point(this.X - point.X, this.Y - point.Y);
}

Point.prototype.scale = function (scale) {
	return new Point(this.X * scale, this.Y * scale);
}

Point.Zero = function () {
	return new Point(0, 0);
}