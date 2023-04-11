function Point (x, y) {
	this.X = x;
	this.Y = y;
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

function Officer (name, force, position, leadership, war, intelligence, politic, charisma) {
	this.Name = name;
	this.Force = force;
	this.Position = position;
	this.LDR = leadership;
	this.WAR = war;
	this.INT = intelligence;
	this.POL = politic;
	this.CHR = charisma;
}

function Scenario (name, date, forces, officers, units) {
	this.Name = name;
	this.Date = date;
	this.Forces = forces;
	this.Officers = officers;
	this.Units = units;
}

function Force (name, ruler, color) {
	this.Name = name;
	this.Ruler = ruler;
	this.Color = color;
}

function City (name, force, money, food, farm, trade, tech, defense, cfarm, ctrade, ctech, cdefense, corder, speciality) {
	this.Name = name;
	this.Force = force;
	this.Money = money;
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

function Unit (type, force, position, morale, strength, objective, officer) {
	this.Type = type;
	this.Force = force;
	this.Position = position;
	this.Morale = morale; 
	this.Strength = strength;
	this.Objective = objective;
	this.Officer = officer;
}

function UnitType (name, type, attack, defense, speed, range, effective) {
	this.Name = name;
	this.Type = type;
	this.Attack = attack;
	this.Defense = defense;
	this.Speed = speed;
	this.Range = range;
	this.Effective = effective;
}