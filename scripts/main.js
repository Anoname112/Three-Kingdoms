var canvas;
var ctx;
var playerCard;
var hoverCard;
var selectCard;
var cityCard;
var marchCard;
var devCard;
var unitCard;
var officerCard;
var deployedCard;
var infoCard;
var importCard;
var hidden;
var clickSound;
var confirmSound;
var mainSound;
var battleSound;
var playSvg;

// 0: Picking scenario, 1: Playing
var gState;
var copyString;
var downloadString;
var battles;
var battleImages;
var damages;
var mousePos;
var infoIconHover;
var elapsed;
var then;
var startTimestamp;
var mapAnimationStep;
var squareSize;
var squareHalf;
var mapSize;
var buttonHeight;
var battleX;
var battleY;
var battleWidth;
var battleHeight;
var attX;
var defX;
var forceY;
var statsY;
var strengthY;
var infoX;
var infoY;
var infoXHalf;
var infoYHalf;

var scenario;
var date;
var player;
var playerForce;
var forces = [];
var officers = [];
var units = [];

var unitTypes = [];
// Name, Type, Speed, Range, Effectiveness, Cost, Icon
unitTypes.push(new UnitType('Spearmen', 'foot', 16, 50, [1.0, 1.0, 1.1], 1200, '⛨'));
unitTypes.push(new UnitType('Horsemen', 'horse', 24, 50, [1.1, 1.0, 1.25], 1400, '♞'));
unitTypes.push(new UnitType('Archer', 'bow', 16, 155, [0.9, 1.05, 1.0], 1000, '➶'));
unitTypes.push(new UnitType('Sentinel', 'foot', 16, 50, [2.0, 2.0, 2.2], 2400, '⛨'));
unitTypes.push(new UnitType('Tiger', 'horse', 24, 50, [2.2, 2.0, 2.5], 2800, '♞'));
unitTypes.push(new UnitType('Marksmen', 'bow', 16, 155, [1.8, 2.1, 2.0], 2000, '➶'));

/*
1. February 184: Revolt Awakens Heroric Ambitions
2. September 189: Dark Clouds over the Capital
3. March 194: Thunder Rolls from the Central Plains
4. June 200: Two Powers Collide at Guan Du
5. May 207: A Dragon Rises as Chi Bi Burns
6. July 217: Tremors of War Shake Han Zhong
7. April 227: A Struggle between Old Enemies
8. August 253: The Lonely Legacy of the Dead
9. January 250: Heroes Across Time
*/
var scenarios = [];
scenarios.push(new Scenario(
	'Warlords',
	'194-3-1', [
		// Forces
		// Name, Ruler, Color, Cities
		['Cao Cao Forces', 15, '#0000FF', [8, 9]],          // 0	
		['Liu Bei Forces', 247, '#00FF00', [10]],           // 1
		['Sun Ce Forces', 382, '#FF0000', [45]],            // 2
		['Lu Bu Forces', 277, '#545454', [7]],              // 3
		['Tao Qian Forces', 415, '#AAFFAA', [11]],          // 4
		['Yuan Shu Forces', 552, '#F516ED', [12, 13]],      // 5
		['Kong Rong Forces', 217, '#AAFFAA', [18]],         // 6
		['Yuan Shao Forces', 551, '#FFFF00', [15, 19, 20]], // 7
		['Gongsun Zan Forces', 124, '#E33A10', [21, 22]],   // 8
		['Gongsun Du Forces', 117, '#925DF5', [23]],        // 9
		['Zhang Yang Forces', 596, '#3B1604', [17]],        // 10
		['Ma Teng Forces', 303, '#572A03', [0, 1]],         // 11
		['Liu Yong Forces', 269, '#130A45', [44]],          // 12
		['Yan Baihu Forces', 510, '#7A4B1C', [43]],         // 13
		['Wang Lang Forces', 434, '#CCCCCC', [46]],         // 14
		['Shi Xie Forces', 364, '#7A283E', [49]],           // 15
		['Liu Biao Forces', 248, '#2BC8F0', [34, 35, 37]],  // 16
		['Zhang Lu Forces', 580, '#5BF55B', [24]],          // 17
		['Liu Zhang Forces', 272, '#0D0D47', [26, 27, 28]]  // 18
	], [
		// Officers
		// Force, Name, City
		[0, 'Cao Cao', 8],
		[0, 'Cao Ang', 8],
		[0, 'Cheng Yu', 8],
		[0, 'Guo Jia', 8],
		[0, 'Liu Ye', 8],
		[0, 'Sima Lang', 8],
		[0, 'Mao Jie', 8],
		[0, 'Man Chong', 8],
		[0, 'Dian Wei', 8],
		[0, 'Xu Zhu', 8],
		[0, 'Li Dian', 8],
		[0, 'Xiahou Dun', 8],
		[0, 'Xiahou Yuan', 8],
		
		[0, 'Cao Ren', 9],
		[0, 'Cao Chun', 9],
		[0, 'Cao Hong', 9],
		[0, 'Cao Xiu', 9],
		[0, 'Yu Jin', 9],
		[0, 'Yue Jin', 9],
		[0, 'Xun Yu', 9],
		[0, 'Zhong Yao', 9],
		[0, 'Zhang Miao', 9],
		[0, 'Xi Zhicai', 9],
		
		[1, 'Liu Bei', 10],
		[1, 'Guan Yu', 10],
		[1, 'Zhang Fei', 10],
		[1, 'Jian Yong', 10],
		[1, 'Mi Zhu', 10],
		[1, 'Mi Fang', 10],
		
		[2, 'Sun Ce', 45],
		[2, 'Zhou Yu', 45],
		[2, 'Lu Meng', 45],
		[2, 'Huang Gai', 45],
		[2, 'Cheng Pu', 45],
		[2, 'Han Dang', 45],
		[2, 'Zhou Tai', 45],
		[2, 'Jiang Qin', 45],
		[2, 'Zhang Zhao', 45],
		[2, 'Zhang Hong', 45],
		
		[3, 'Lu Bu', 7],
		[3, 'Zhang Liao', 7],
		[3, 'Chen Gong', 7],
		[3, 'Zang Ba', 7],
		[3, 'Hao Meng', 7],
		[3, 'Cao Xing', 7],
		[3, 'Wei Xu', 7],
		[3, 'Song Xian', 7],
		[3, 'Gao Shun', 7],
		[3, 'Hou Cheng', 7],
		
		[4, 'Tao Qian', 11],
		[4, 'Chen Deng', 11],
		[4, 'Chen Gui', 11],
		[4, 'Zhang Kai', 11],
		[4, 'Cao Bao', 11],
		
		[5, 'Yuan Shu', 12],
		[5, 'Yuan Yin', 12],
		[5, 'Yuan Yao', 12],
		[5, 'Ji Ling', 12],
		[5, 'Qiao Rui', 12],
		[5, 'Li Feng', 12],
		[5, 'Liang Gang', 12],
		[5, 'Yan Xiang', 12],
		[5, 'Yang Hong', 12],
		
		[5, 'Han Hao', 13],
		[5, 'Han Yin', 13],
		[5, 'Chen Ji', 13],
		[5, 'Lei Bo', 13],
		[5, 'Zhang Xun', 13],
		[5, 'Chen Lan', 13],
		
		[6, 'Kong Rong', 18],
		[6, 'Wang Xiu', 18],
		
		[7, 'Yuan Shao', 15],
		[7, 'Yuan Shang', 15],
		[7, 'Shen Pei', 15],
		[7, 'Guo Tu', 15],
		[7, 'Ju Shou', 15],
		[7, 'Xu You', 15],
		[7, 'Tian Feng', 15],
		[7, 'Zhang He', 15],
		[7, 'Qu Yi', 15],
		[7, 'Yan Liang', 15],
		[7, 'Wen Chou', 15],
		
		[7, 'Yuan Tan', 19],
		[7, 'Xin Pi', 19],
		[7, 'Xin Ping', 19],
		[7, 'Gao Rou', 19],
		[7, 'Gao Lan', 19],
		[7, 'Gao Gan', 19],
		
		[7, 'Yuan Xi', 20],
		[7, 'Tian Chou', 20],
		[7, 'Feng Ji', 20],
		[7, 'Chen Lin', 20],
		[7, 'Chen Zhen', 20],
		[7, 'Chunyu Qiong', 20],
		
		[8, 'Gongsun Zan', 22],
		[8, 'Zhao Yun', 22],
		[8, 'Gongsun Fan', 22],
		[8, 'Gongsun Xu', 22],
		[8, 'Guan Jing', 22],
		
		[8, 'Tian Kai', 21],
		[8, 'Tian Yu', 21],
		[8, 'Shan Jing', 21],
		[8, 'Wang Men', 21],
		
		[9, 'Gongsun Du', 23],
		[9, 'Gongsun Gong', 23],
		[9, 'Gongsun Kang', 23],
		
		[10, 'Zhang Yang', 17],
		[10, 'Sui Gu', 17],
		
		[11, 'Ma Teng', 0],
		[11, 'Ma Dai', 0],
		[11, 'Ma Chao', 0],
		[11, 'Ma Tie', 0],
		[11, 'Ma Xiu', 0],
		[11, 'Pang De', 0],
		
		[11, 'Han Sui', 1],
		[11, 'Cheng Gongying', 1],
		[11, 'Cheng Yi', 1],
		[11, 'Cheng Yin', 1],
		[11, 'Liang Xing', 1],
		[11, 'Ma Wan', 1],
		
		[12, 'Liu Yong', 44],
		[12, 'Taishi Ci', 44],
		
		[13, 'Yan Baihu', 43],
		[13, 'Yan Yu', 43],
		
		[14, 'Wang Lang', 46],
		[14, 'He Qi', 46],
		
		[15, 'Shi Xie', 49],
		[15, 'Shi Yi', 49],
		[15, 'Shi Hui', 49],
		[15, 'Shi Kuang', 49],
		[15, 'Shi Zhi', 49],
		
		[16, 'Liu Biao', 35],
		[16, 'Liu Qi', 35],
		[16, 'Liu Pan', 35],
		[16, 'Kuai Liang', 35],
		[16, 'Kuai Yue', 35],
		[16, 'Huang Zhong', 35],
		[16, 'Yi Ji', 35],
		[16, 'Wu Ju', 35],
		
		[16, 'Cai Mao', 34],
		[16, 'Cai He', 34],
		[16, 'Cai Zhong', 34],
		
		[16, 'Huang Zu', 37],
		[16, 'Han Song', 37],
		[16, 'Su Fei', 37],
		
		[17, 'Zhang Lu', 24],
		[17, 'Zhang Wei', 24],
		[17, 'Yan Pu', 24],
		[17, 'Yang Ang', 24],
		[17, 'Yang Bo', 24],
		[17, 'Yang Ren', 24],
		[17, 'Yang Song', 24],
		
		[18, 'Liu Zhang', 26],
		[18, 'Liu Yan', 26],
		[18, 'Liu Kui', 26],
		[18, 'Huang Quan', 26],
		[18, 'Wu Yi', 26],
		[18, 'Wu Ban', 26],
		[18, 'Zhang Ren', 26],
		[18, 'Zhang Song', 26],
		
		[18, 'Pang Xi', 27],
		[18, 'Gao Pei', 27],
		[18, 'Yang Huai', 27],
		
		[18, 'Yan Yan', 28],
		[18, 'Dong He', 28],
		[18, 'Wu Lan', 28]
	], [
		// Units
		// Type, City, Position, Morale, Strength
		// Chen Liu
		[0, 8, getCityPosition(8), 90, 7000],
		[0, 8, getCityPosition(8), 90, 7000],
		[1, 8, getCityPosition(8), 85, 7000],
		[2, 8, getCityPosition(8), 85, 6500],
		// Xu Chang
		[0, 9, getCityPosition(9), 90, 7000],
		[1, 9, getCityPosition(9), 85, 7000],
		[2, 9, getCityPosition(9), 85, 6500],
		// Xiao Pei
		[0, 10, getCityPosition(10), 60, 6000],
		[2, 10, getCityPosition(10), 55, 5500],
		// Xia Pi
		[0, 11, getCityPosition(11), 50, 5500],
		[0, 11, getCityPosition(11), 50, 5500],
		[0, 11, getCityPosition(11), 50, 5500],
		// Pu Yang
		[1, 7, getCityPosition(7), 55, 6000],
		[1, 7, getCityPosition(7), 55, 6000],
		[2, 7, getCityPosition(7), 50, 5000],
		// Shou Chun
		[0, 12, getCityPosition(12), 50, 7000],
		[0, 12, getCityPosition(12), 50, 7000],
		[2, 12, getCityPosition(12), 45, 6000],
		// Lu Jiang
		[0, 13, getCityPosition(13), 50, 7000],
		[0, 13, getCityPosition(13), 50, 6500],
		// Ye
		[1, 15, getCityPosition(15), 55, 9500],
		[1, 15, getCityPosition(15), 55, 9500],
		[1, 15, getCityPosition(15), 55, 9500],
		// Nan Pi
		[0, 19, getCityPosition(19), 50, 6500],
		[1, 19, getCityPosition(19), 55, 8500],
		// Ping Yuan
		[0, 20, getCityPosition(20), 50, 6500],
		[1, 20, getCityPosition(20), 55, 8500],
		// Bei Hai
		[0, 18, getCityPosition(18), 50, 7000],
		// Jin Yang
		[1, 17, getCityPosition(17), 50, 7000],
		// Bei Ping
		[0, 22, getCityPosition(22), 50, 6000],
		[1, 22, getCityPosition(22), 55, 8000],
		[2, 22, getCityPosition(22), 50, 5000],
		// Ji
		[0, 21, getCityPosition(21), 50, 6000],
		[1, 21, getCityPosition(21), 55, 8000],
		// Xiang Ping
		[0, 23, getCityPosition(23), 50, 7000],
		// Xi Liang
		[1, 0, getCityPosition(0), 55, 8000],
		[1, 0, getCityPosition(0), 55, 8000],
		// Wu Wei
		[1, 1, getCityPosition(1), 55, 8000],
		[2, 1, getCityPosition(1), 55, 6000],
		// Han Zhong
		[0, 24, getCityPosition(24), 50, 6000],
		[0, 24, getCityPosition(24), 50, 6000],
		[2, 24, getCityPosition(24), 45, 6000],
		// Cheng Du
		[0, 26, getCityPosition(26), 50, 5000],
		[0, 26, getCityPosition(26), 50, 5500],
		[2, 26, getCityPosition(26), 45, 5500],
		// Zi Tong
		[0, 27, getCityPosition(27), 50, 5500],
		[2, 27, getCityPosition(27), 45, 5000],
		// Jiang Zhou
		[0, 28, getCityPosition(28), 50, 5500],
		[2, 28, getCityPosition(28), 45, 5000],
		// Xiang Yang
		[0, 35, getCityPosition(35), 50, 5500],
		[0, 35, getCityPosition(35), 50, 5500],
		[2, 35, getCityPosition(35), 45, 5000],
		// Xin Ye
		[0, 34, getCityPosition(34), 50, 5500],
		[0, 34, getCityPosition(34), 50, 5500],
		// Jiang Ling 
		[0, 37, getCityPosition(37), 50, 5500],
		[2, 37, getCityPosition(37), 45, 5000],
		// Chai Sang
		[0, 45, getCityPosition(45), 50, 5000],
		[2, 45, getCityPosition(45), 55, 6000],
		[2, 45, getCityPosition(45), 55, 6000],
		// Jian Ye
		[1, 44, getCityPosition(44), 50, 7000],
		// Wu
		[1, 43, getCityPosition(43), 50, 7000],
		// Hui Ji
		[2, 46, getCityPosition(46), 45, 6500],
		// Jiao Zhi
		[0, 49, getCityPosition(49), 50, 5500],
		[1, 49, getCityPosition(49), 50, 5500],
		[2, 49, getCityPosition(49), 45, 5500]
	], [
		// Playables
		15, 247, 382, 277
	]
));

var cities = [];
// Name, Force, Gold, Food, Farm, Trade, Tech, Defense, cFarm, cTrade, cTech, cDefense, cOrder, Speciality
cities[0] = new City('Xi Liang', '-', 8000, 65000, 3200, 3200, 2800, 4000, 420, 400, 600, 2800, 80, '4');
cities[1] = new City('Wu Wei', '-', 7800, 63000, 3200, 3200, 2800, 4000, 410, 390, 600, 2800, 80, '-');
cities[2] = new City('Tian Shui', '-', 5000, 30000, 3200, 3200, 2800, 4000, 200, 200, 600, 2800, 80, '-');
cities[3] = new City('An Ding', '-', 5000, 30000, 3200, 3200, 2800, 4000, 200, 200, 600, 2800, 80, '-');
cities[4] = new City('Chang An', '-', 5000, 30000, 3200, 3200, 2800, 4000, 200, 200, 600, 2800, 80, '-');
cities[5] = new City('Luo Yang', '-', 5000, 30000, 3200, 3200, 2800, 4000, 200, 200, 600, 2800, 80, '-');
cities[6] = new City('He Nei', '-', 5000, 30000, 3200, 3200, 2800, 4000, 200, 200, 600, 2800, 80, '-');
cities[7] = new City('Pu Yang', '-', 13000, 85000, 3200, 3200, 2800, 4000, 540, 560, 600, 2800, 80, '-');
cities[8] = new City('Chen Liu', '-', 24000, 110000, 3200, 3200, 2800, 4000, 600, 620, 600, 2800, 80, '3');
cities[9] = new City('Xu Chang', '-', 23000, 102000, 3200, 3200, 2800, 4000, 590, 610, 600, 2800, 80, '3');
cities[10] = new City('Xiao Pei', '-', 6500, 42000, 3200, 3200, 2800, 4000, 340, 360, 600, 2800, 80, '-');
cities[11] = new City('Xia Pi', '-', 14000, 86000, 3200, 3200, 2800, 4000, 580, 600, 600, 2800, 80, '-');
cities[12] = new City('Shou Chun', '-', 13000, 89000, 3200, 3200, 2800, 4000, 560, 570, 600, 2800, 80, '-');
cities[13] = new City('Lu Jiang', '-', 11500, 86000, 3200, 3200, 2800, 4000, 490, 500, 600, 2800, 80, '-');
cities[14] = new City('Ru Nan', '-', 5000, 30000, 3200, 3200, 2800, 4000, 200, 200, 600, 2800, 80, '-');
cities[15] = new City('Ye', '-', 25000, 120000, 3200, 3200, 2800, 4000, 610, 620, 600, 2800, 80, '-');
cities[16] = new City('Shang Dang', '-', 5000, 30000, 3200, 3200, 2800, 4000, 200, 200, 600, 2800, 80, '-');
cities[17] = new City('Jin Yang', '-', 7000, 45000, 3200, 3200, 2800, 4000, 380, 390, 600, 2800, 80, '-');
cities[18] = new City('Bei Hai', '-', 7000, 45000, 3200, 3200, 2800, 4000, 380, 390, 600, 2800, 80, '-');
cities[19] = new City('Ping Yuan', '-', 8000, 63000, 3200, 3200, 2800, 4000, 450, 460, 600, 2800, 80, '-');
cities[20] = new City('Nan Pi', '-', 12000, 66000, 3200, 3200, 2800, 4000, 500, 520, 600, 2800, 80, '-');
cities[21] = new City('Ji', '-', 11000, 61000, 3200, 3200, 2800, 4000, 490, 490, 600, 2800, 80, '-');
cities[22] = new City('Bei Ping', '-', 14000, 64000, 3200, 3200, 2800, 4000, 520, 530, 600, 2800, 80, '4');
cities[23] = new City('Xiang Ping', '-', 7000, 45000, 3200, 3200, 2800, 4000, 380, 390, 600, 2800, 80, '-');
cities[24] = new City('Han Zhong', '-', 14000, 65000, 3200, 3200, 2800, 4000, 530, 540, 600, 2800, 80, '-');
cities[25] = new City('Wu Du', '-', 5000, 30000, 3200, 3200, 2800, 4000, 200, 200, 600, 2800, 80, '-');
cities[26] = new City('Cheng Du', '-', 15000, 89000, 3200, 3200, 2800, 4000, 590, 610, 600, 2800, 80, '5');
cities[27] = new City('Zi Tong', '-', 9000, 68000, 3200, 3200, 2800, 4000, 440, 450, 600, 2800, 80, '-');
cities[28] = new City('Jiang Zhou', '-', 7500, 61000, 3200, 3200, 2800, 4000, 420, 420, 600, 2800, 80, '-');
cities[29] = new City('Yong An', '-', 5000, 30000, 3200, 3200, 2800, 4000, 200, 200, 600, 2800, 80, '-');
cities[30] = new City('Jian Ning', '-', 5000, 30000, 3200, 3200, 2800, 4000, 200, 200, 600, 2800, 80, '-');
cities[31] = new City('Yun Nan', '-', 5000, 30000, 3200, 3200, 2800, 4000, 200, 200, 600, 2800, 80, '-');
cities[32] = new City('Yong Chang', '-', 5000, 30000, 3200, 3200, 2800, 4000, 200, 200, 600, 2800, 80, '-');
cities[33] = new City('Wan', '-', 5000, 30000, 3200, 3200, 2800, 4000, 200, 200, 600, 2800, 80, '-');
cities[34] = new City('Xin Ye', '-', 8000, 60000, 3200, 3200, 2800, 4000, 415, 425, 600, 2800, 80, '-');
cities[35] = new City('Xiang Yang', '-', 15000, 90000, 3200, 3200, 2800, 4000, 580, 620, 600, 2800, 80, '-');
cities[36] = new City('Shang Yong', '-', 5000, 30000, 3200, 3200, 2800, 4000, 200, 200, 600, 2800, 80, '-');
cities[37] = new City('Jiang Ling', '-', 9000, 62000, 3200, 3200, 2800, 4000, 450, 460, 600, 2800, 80, '-');
cities[38] = new City('Jiang Xia', '-', 5000, 30000, 3200, 3200, 2800, 4000, 200, 200, 600, 2800, 80, '-');
cities[39] = new City('Wu Ling', '-', 5000, 30000, 3200, 3200, 2800, 4000, 200, 200, 600, 2800, 80, '-');
cities[40] = new City('Chang Sha', '-', 5000, 30000, 3200, 3200, 2800, 4000, 200, 200, 600, 2800, 80, '-');
cities[41] = new City('Ling Ling', '-', 5000, 30000, 3200, 3200, 2800, 4000, 200, 200, 600, 2800, 80, '-');
cities[42] = new City('Gui Yang', '-', 5000, 30000, 3200, 3200, 2800, 4000, 200, 200, 600, 2800, 80, '-');
cities[43] = new City('Wu', '-', 7000, 45000, 3200, 3200, 2800, 4000, 380, 390, 600, 2800, 80, '-');
cities[44] = new City('Jian Ye', '-', 7000, 45000, 3200, 3200, 2800, 4000, 380, 390, 600, 2800, 80, '-');
cities[45] = new City('Chai Sang', '-', 8500, 70000, 3200, 3200, 2800, 4000, 420, 430, 600, 2800, 80, '5');
cities[46] = new City('Hui Ji', '-', 7000, 45000, 3200, 3200, 2800, 4000, 380, 390, 600, 2800, 80, '-');
cities[47] = new City('Jian An', '-', 5000, 30000, 3200, 3200, 2800, 4000, 200, 200, 600, 2800, 80, '-');
cities[48] = new City('Nan Hai', '-', 5000, 30000, 3200, 3200, 2800, 4000, 200, 200, 600, 2800, 80, '-');
cities[49] = new City('Jiao Zhi', '-', 12000, 70000, 3200, 3200, 2800, 4000, 500, 510, 600, 2800, 80, '-');

var abilities = [];
// Name, Desc, Cooldown, AllyEffect, EnemyEffect, Officers
abilities[0] = new Ability('True Leader', '', 0, 15, 15, [15]);
abilities[1] = new Ability('Benevolence', '', 0, 10, 10, [247]);
abilities[2] = new Ability('Tiger', '', 0, 20, 0, [389]);
abilities[3] = new Ability('Conqueror', '', 0, 0, 20, [382]);

window.onload = function () {
	window.oncontextmenu = onContextMenu;
	
	// Prepare canvas
	const ratio = window.devicePixelRatio;
	canvas = getElement('myCanvas');
	canvas.ondragover = onDragOver;
	canvas.ondrop = onDrop;
	canvas.onclick = onMouseClick;
	canvas.onmousemove = onMouseMove;
	canvas.width = window.innerWidth * ratio;
	canvas.height = window.innerHeight * ratio;
	canvas.style.width = window.innerWidth + 'px';
	canvas.style.height = window.innerHeight + 'px';
	canvas.getContext('2d').scale(ratio, ratio);
	ctx = canvas.getContext('2d');
	
	// Define cards
	playerCard = document.createElement('div');
	playerCard.classList.add('playerCard');
	document.body.appendChild(playerCard);
	
	hoverCard = document.createElement('div');
	hoverCard.classList.add('hoverCard');
	document.body.appendChild(hoverCard);
	
	selectCard = document.createElement('div');
	selectCard.classList.add('selectCard');
	document.body.appendChild(selectCard);
	
	cityCard = document.createElement('div');
	cityCard.classList.add('cityCard');
	document.body.appendChild(cityCard);
	
	marchCard = document.createElement('div');
	marchCard.classList.add('marchCard');
	document.body.appendChild(marchCard);
	
	devCard = document.createElement('div');
	devCard.classList.add('devCard');
	document.body.appendChild(devCard);
	
	unitCard = document.createElement('div');
	unitCard.classList.add('unitCard');
	document.body.appendChild(unitCard);
	
	officerCard = document.createElement('div');
	officerCard.classList.add('officerCard');
	document.body.appendChild(officerCard);
	
	deployedCard = document.createElement('div');
	deployedCard.classList.add('deployedCard');
	document.body.appendChild(deployedCard);
	
	infoCard = document.createElement('div');
	infoCard.classList.add('infoCard');
	document.body.appendChild(infoCard);
	
	importCard = document.createElement('div');
	importCard.classList.add('importCard');
	document.body.appendChild(importCard);
	
	hidden = document.createElement('div');
	hidden.style.visibility = 'hidden';
	hidden.innerHTML += `<audio id="clickSound"><source src="bgm/click.mp3" /></audio>
		<audio id="confirmSound"><source src="bgm/confirm.mp3" /></audio>
		<audio id="mainSound"><source src="bgm/main` + floor(Math.random() * 4) + `.mp3" /></audio>
		<audio id="battleSound"><source src="bgm/battle.mp3" /></audio>`;
	document.body.appendChild(hidden);
	// Prepare audio
	clickSound = getElement('clickSound');
	confirmSound = getElement('confirmSound');
	mainSound = getElement('mainSound');
	mainSound.addEventListener('ended', function () {
		this.currentTime = 0;
		this.play();
	}, false);
	battleSound = getElement('battleSound');
	battleSound.addEventListener('ended', function () {
		this.currentTime = 0;
		this.play();
	}, false);
	clickSound.style.visibility = confirmSound.style.visibility = mainSound.style.visibility = battleSound.style.visibility = 'hidden';
	
	// Init sizes
	mapSize = window.innerHeight;
	if (window.innerWidth < window.innerHeight) mapSize = window.innerWidth;
	squareSize = mapSize / map.length;
	squareHalf = squareSize / 2;
	buttonHeight = squareSize + buttonPad * 2;
	infoX = isPortrait ? canvasPad : canvasPad * 2 + mapSize;
	infoY = isPortrait ? canvasPad * 2 + mapSize : canvasPad;
	
	infoXHalf = infoX + (window.innerWidth - infoX) / 2;
	infoYHalf = infoY + (window.innerHeight - infoY) / 2;
	
	marchCard.style.left = devCard.style.left = unitCard.style.left = officerCard.style.left = importCard.style.left = (canvasPad + cardMargin) + 'px';
	marchCard.style.top = devCard.style.top = unitCard.style.top = officerCard.style.top = importCard.style.top = (canvasPad + cardMargin) + 'px';
	marchCard.style.width = devCard.style.width = unitCard.style.width = officerCard.style.width = importCard.style.width = (mapSize - (canvasPad + cardMargin) * 2) + 'px';
	marchCard.style.height = devCard.style.height = unitCard.style.height = officerCard.style.height = importCard.style.height = (mapSize - (canvasPad + cardMargin) * 2) + 'px';
	
	playerCard.style.left = (infoX + cardMargin) + 'px';
	playerCard.style.top = (infoY + cardMargin) + 'px';
	playerCard.style.width = (window.innerWidth - infoX - (cardMargin * 2)) + 'px';
	playerCard.style.height = ((window.innerHeight - infoY) / 4 - (cardMargin * 2)) + 'px';
	playerCard.innerHTML = `<div id="playerContent"></div>
		<svg xmlns="http://www.w3.org/2000/svg" id="playSvg" fill="currentColor" viewBox="0 0 16 16">
			<path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/><path d="M6.271 5.055a.5.5 0 0 1 .52.038l3.5 2.5a.5.5 0 0 1 0 .814l-3.5 2.5A.5.5 0 0 1 6 10.5v-5a.5.5 0 0 1 .271-.445z"/>
		</svg>`;
	
	battleX = infoX;
	battleY = infoY;
	//battleY = infoY + playerCard.clientHeight + cardMargin * 2;
	battleWidth = window.innerWidth - battleX;
	battleHeight = window.innerHeight - battleY;
	attX = battleX + battleWidth * 0.25;
	defX = battleX + battleWidth * 0.75;
	forceY = battleY + unitSize * 0.15;
	statsY = battleY + unitSize * 0.5;
	strengthY = battleY + unitSize * 0.85;
	
	infoCard.style.left = (infoX + cardMargin) + 'px';
	infoCard.style.top = (infoY + playerCard.clientHeight + cardMargin * 2) + 'px';
	infoCard.style.width = (window.innerWidth - infoX - (cardMargin * 2)) + 'px';
	infoCard.style.height = (window.innerHeight - infoY - playerCard.clientHeight - (cardMargin * 3)) + 'px';
	
	playSvg = getElement('playSvg');
	playSvg.onclick = playClick;
	playSvg.style.position = 'absolute';
	playSvg.style.top = playSvgPad;
	playSvg.style.right = playSvgPad;
	playSvg.style.width = playerCard.clientHeight - playSvgPad * 2;
	playSvg.style.height = playerCard.clientHeight - playSvgPad * 2;
	
	// Prepare officers
	for (var i = 0; i < baseOfficers.length; i++) {
		officers.push(new Officer(
			baseOfficers[i]['name'],
			'-',
			'-',
			new Point.Zero(),
			baseOfficers[i]['ldr'],
			baseOfficers[i]['war'],
			baseOfficers[i]['int'],
			baseOfficers[i]['pol'],
			baseOfficers[i]['chr'],
			'-',
			'-'
		));
	}
	
	//invert map
	for (var i = 0; i < map.length; i++) {
		for (var j = i + 1; j < map.length; j++) {
			var temp = map[i][j];
			map[i][j] = map[j][i];
			map[j][i] = temp;
		}
	}
	
	mousePos = new Point.Zero();
	infoIconHover = false;
	then = startTimestamp = mapAnimationStep = gState = 0;
	copyString = 'COPY DATA';
	downloadString = 'DOWNLOAD DATA';
	battles = [];
	battleImages = [];
	damages = [];
	/*
	// Play Warlord scenario as Cao Cao right of the bat
	init('Warlords', 15);
	*/
	draw();
}

function init (scenario, officerIndex) {
	applyScenario(scenario);
	
	startPoint = new Point.Zero();
	endPoint = new Point.Zero();
	mousePos = new Point.Zero();
	
	player = officerIndex;
	playerForce = officers[player].Force;
	openPlayerCard();
	
	battles = [];
	gState = 1;
	playAudio(mainSound);
}

function applyScenario (name) {
	for (var i = 0; i < scenarios.length; i++) {
		if (scenarios[i].Name == name) {
			forces = [];
			units = [];
			scenario = i;
			date = scenarios[i].Date;
			// Forces & Cities
			for (var j = 0; j < scenarios[i].Forces.length; j++) {
				forces.push(new Force(j, scenarios[i].Forces[j][0], scenarios[i].Forces[j][1], scenarios[i].Forces[j][2]));
				for (var k = 0; k < scenarios[i].Forces[j][3].length; k++) {
					cities[scenarios[i].Forces[j][3][k]].Force = forces.length - 1;
				}
			}
			
			// Officers
			for (var j = 0; j < scenarios[i].Officers.length; j++) {
				var officerName = scenarios[i].Officers[j][1];
				for (var k = 0; k < officers.length; k++) {
					if (officers[k].Name == officerName) {
						officers[k].Force = scenarios[i].Officers[j][0];
						officers[k].City = scenarios[i].Officers[j][2];
						officers[k].Position = getCityPosition(scenarios[i].Officers[j][2]);
						
						battleImages[k] = newImg("portraits/" + officers[k].Name.split(' ').join('_') + ".jpg");
					}
				}
			}
			
			// Units
			for (var j = 0; j < scenarios[i].Units.length; j++) {
				units.push(new Unit(j, scenarios[i].Units[j][0], cities[scenarios[i].Units[j][1]].Force, scenarios[i].Units[j][1], scenarios[i].Units[j][2], scenarios[i].Units[j][3], scenarios[i].Units[j][4], '-', '-', null, null, 0));
			}
		}
	}
}

function onContextMenu (e) {
	e.preventDefault();
}

function onDragOver (e) {
	e.preventDefault();
}

function onDrop (e) {
	e.preventDefault();
	if (gState == 0 && startTimestamp == 0) importFile(e.dataTransfer.files[0]);
}

function onMouseMove (e) {
	var eX = e.clientX;
	var eY = e.clientY;
	mousePos = new Point(eX, eY);
	
	hoverCard.style.visibility = 'hidden';
	//infoCard.style.visibility = 'hidden';
	
	if (gState == 0) {
		draw();
	}
	else if (gState == 1) {
		// Hovering info icon
		if (eX >= canvasPad + squareSize && eX < canvasPad + squareSize * 2 && eY >= canvasPad + squareSize && eY < canvasPad + squareSize * 2) {
			openInfoCard('Global', playerForce);
			return;
		}
		
		// Hovering a unit
		for (var i = 0; i < officers.length; i++) {
			if (officers[i].Objective[0] == 'March') {
				var x = canvasPad + officers[i].Position.X * squareSize + unitPad;
				var y = canvasPad + officers[i].Position.Y * squareSize + unitPad;
				var w = squareSize - unitPad * 2;
				var h = squareSize - unitPad * 2;
				if (eX >= x && eX < x + w && eY >= y && eY < y + h) {
					var backColor = 'enemyColor';
					if (officers[i].Force == playerForce) backColor = 'allyColor';
					
					hoverCard.innerHTML = `<div class="unitName ` + backColor + `">` + officers[i].Name + ` Unit</div>
						<div class="unitInfo">` +
							getPortrait(officers[i].Name, 'small') + `<br />
							<table class="stats">
								<tr><th colspan="2">` + forces[getForceIndexById(officers[i].Force)].Name + `</th></tr>
								<tr><th>Strength</th><td class="center">` + getDeployedStrength(i) + `</td></tr>
								<tr><th>Target</th><td class="center">` + cities[officers[i].Objective[1]].Name + `</td></tr>
							</table>
						</div>`;
					
					hoverCard.style.visibility = 'visible';
					var hoverX = eX + hoverMarginX;
					var hoverY = eY + hoverMarginY;
					if (hoverX + hoverCard.clientWidth > mapSize) hoverCard.style.left = (hoverX - hoverCard.clientWidth - hoverMarginX * 2) + 'px';
					else hoverCard.style.left = hoverX + 'px';
					if (hoverY + hoverCard.clientHeight > mapSize) hoverCard.style.top = (hoverY - hoverCard.clientHeight - hoverMarginY * 2) + 'px';
					else hoverCard.style.top = hoverY + 'px';
					
					openInfoCard('Unit', i);
					draw();
					return;
				}
			}
		}
		
		// Hovering a city
		var indexX = parseInt((eX - canvasPad) / squareSize);
		var indexY = parseInt((eY - canvasPad) / squareSize);
		if (eX >= canvasPad && eX < canvasPad + mapSize && eY >= canvasPad && eY < canvasPad + mapSize && map[indexX][indexY] >= cityIndexStart) {
			var index = map[indexX][indexY] - cityIndexStart;
			var backColor = 'enemyColor';
			if (cities[index].Force == '-') backColor = 'neutralColor';
			else if (cities[index].Force == playerForce) backColor = 'allyColor';
			
			var string = '<div class="cityName ' + backColor + '">' + cities[index].Name + '</div><div class="cityInfo">';
			if (cities[index].Force == '-') string += '<table class="cityStats">';
			else {
				var forceIndex = getForceIndexById(cities[index].Force);
				var forceRulerName = officers[forces[forceIndex].Ruler].Name;
				string += getPortrait(forceRulerName, 'small') + '<br /><table class="cityStats"><tr><th colspan="2">' + forces[forceIndex].Name + '</th></tr>';
			}
			string += `<tr><th>Gold</th><td>` + cities[index].Gold + `</td></tr>
					<tr><th>Food</th><td>` + cities[index].Food + `</td></tr>
					<tr><th>Strength</th><td>` + getCityStrength(index) + `</td></tr>
					<tr><th>Defense</th><td>` + cities[index].cDefense + `/` + cities[index].Defense + `</td></tr>
					<tr><th>Order</th><td>` + cities[index].cOrder + `/` + moraleLimit + `</td></tr>
				</div>`;
			hoverCard.innerHTML = string;
			
			hoverCard.style.visibility = 'visible';
			var hoverX = eX + hoverMarginX;
			var hoverY = eY + hoverMarginY;
			if (hoverX + hoverCard.clientWidth > mapSize) hoverCard.style.left = (hoverX - hoverCard.clientWidth - hoverMarginX * 2) + 'px';
			else hoverCard.style.left = hoverX + 'px';
			if (hoverY + hoverCard.clientHeight > mapSize) hoverCard.style.top = (hoverY - hoverCard.clientHeight - hoverMarginY * 2) + 'px';
			else hoverCard.style.top = hoverY + 'px';
			
			openInfoCard('City', index);
			draw();
		}
		
		// Hovering a battle unit
		if (battles.length > 0) {
			for (var i = 0; i < units.length; i++) {
				if (units[i].Vec && (battles[0]['Commander0'] == units[i].Objective[1] || battles[0]['Commander1'] == units[i].Objective[1])) {
					var distance = units[i].Vec.subtract(mousePos).length();
					if (distance < portraitRadius) {
						var resAbilities = battles[0]['Commander0'] == units[i].Objective[1] ? battles[0]['Abilities0'] : battles[0]['Abilities1'];
						var string = resAbilities.length > 0 ? '<tr><th colspan="2">Abilities</th></tr>' : '';
						for (var j = 0; j < resAbilities.length; j++) {
							string += '<tr><td colspan="2" class="center">' + abilities[resAbilities[j]].Name + '</td></tr>';
						}
						hoverCard.innerHTML = `<div class="unitInfo">
								<table class="stats">
									<tr><th colspan="2">` + officers[units[i].Objective[1]].Name + ` Unit</th></tr>
									<tr>
										<th>Morale</th>
										<td>` + units[i].Morale + `</td>
									</tr>
									` + string + `
								</table>
							</div>`;
						
						hoverCard.style.visibility = 'visible';
						var hoverX = eX + hoverMarginX;
						var hoverY = eY + hoverMarginY;
						if (hoverX + hoverCard.clientWidth > window.innerWidth - hoverMarginX) hoverCard.style.left = (hoverX - hoverCard.clientWidth - hoverMarginX * 2) + 'px';
						else hoverCard.style.left = hoverX + 'px';
						if (hoverY + hoverCard.clientHeight > window.innerHeight - hoverMarginY) hoverCard.style.top = (hoverY - hoverCard.clientHeight - hoverMarginY * 2) + 'px';
						else hoverCard.style.top = hoverY + 'px';
					}
				}
			}
		}
	}
}

function onMouseClick (e) {
	var eX = e.clientX;
	var eY = e.clientY;
	mousePos = new Point(eX, eY);
	
	//infoCard.style.visibility = 'hidden';
	
	if (gState == 0 && startTimestamp == 0) {
		var line = 0;
		var x = canvasPad + buttonMargin;
		for (var i = 0; i < scenarios.length; i++) {
			for (var j = 0; j < scenarios[i].Playables.length; j++) {
				var y = canvasPad + (line * buttonHeight) + (++line * buttonMargin);
				if (eX >= x && eX < x + scenarioWidth && eY >= y && eY < y + buttonHeight) {
					init(scenarios[i].Name, scenarios[i].Playables[j]);
					draw();
					playAudio(confirmSound);
				}
			}
		}
		
		// Import data
		var y = canvasPad + (line * buttonHeight) + (++line * buttonMargin);
		if (eX >= x && eX < x + scenarioWidth && eY >= y && eY < y + buttonHeight) openImportCard();
		
		// Copy data
		y = canvasPad + (line * buttonHeight) + (++line * buttonMargin);
		if (eX >= x && eX < x + scenarioWidth && eY >= y && eY < y + buttonHeight) {
			copyData();
			copyString = 'DATA COPIED';
			draw();
		}
		
		if (localStorage['player']) {
			// Download data
			y = canvasPad + (line * buttonHeight) + (++line * buttonMargin);
			if (eX >= x && eX < x + scenarioWidth && eY >= y && eY < y + buttonHeight) {
				downloadData();
				downloadString = 'DATA DOWNLOADED';
				draw();
			}
			
			// Load data
			y = canvasPad + (line * buttonHeight) + (++line * buttonMargin);
			if (eX >= x && eX < x + scenarioWidth && eY >= y && eY < y + buttonHeight) {
				loadDataFromStorage();
				playAudio(confirmSound);
			}
		}
	}
	else if (gState == 1 && startTimestamp == 0) {
		if (eX >= canvasPad && eX < canvasPad + mapSize && eY >= canvasPad && eY < canvasPad + mapSize) {
			var indexX = parseInt((eX - canvasPad) / squareSize);
			var indexY = parseInt((eY - canvasPad) / squareSize);
			
			// Clicked info icon
			if (indexX == infoIconX && indexY == infoIconY) {
				infoIconHover = !infoIconHover;
				draw();
				return;
			}
			
			var clickedObjects = [];
			// Clicked city
			if (map[indexX][indexY] >= cityIndexStart) {
				var index = map[indexX][indexY] - cityIndexStart;
				clickedObjects.push({
					'Card' : cityCard,
					'Index' : index
				});
			}
			// Clicked units
			for (var i = 0; i < officers.length; i++) {
				if (officers[i].Objective[0] == 'March' && officers[i].Force == playerForce) {
					var x = canvasPad + officers[i].Position.X * squareSize + unitPad;
					var y = canvasPad + officers[i].Position.Y * squareSize + unitPad;
					var w = squareSize - unitPad * 2;
					var h = squareSize - unitPad * 2;
					if (eX >= x && eX < x + w && eY >= y && eY < y + h) {
						clickedObjects.push({
							'Card' : deployedCard,
							'Index' : i
						});
					}
				}
			}
			
			if (clickedObjects.length > 0) {
				if (clickedObjects.length == 1) {
					if (clickedObjects[0]['Card'] == cityCard) openCityCard(clickedObjects[0]['Index']);
					else if (clickedObjects[0]['Card'] == deployedCard) openDeployedCard(clickedObjects[0]['Index']);
				}
				else openSelectCard(clickedObjects);
				playAudio(clickSound);
			}
		}
	}
	else if (battles.length > 0) {
		var deployed0 = getDeployedUnits(battles[0]['Commander0']);
		var deployed1 = getDeployedUnits(battles[0]['Commander1']);
		// If battle ended, init another battle if there are any
		if (deployed0.length == 0 || deployed1.length == 0) {
			if (deployed0.length == 0) {
				giveBattleBonus(deployed1);
				dismissDeployed(battles[0]['Commander0']);
			}
			if (deployed1.length == 0) {
				giveBattleBonus(deployed0);
				dismissDeployed(battles[0]['Commander1']);
			}
			battles.shift();
			if (battles.length > 0) initBattle();
			else {
				startTimestamp = 0;
				openPlayerCard();
				openInfoCard('City', officers[player].City);
				draw(true);
				saveData();
				stopAudio(battleSound);
				playAudio(mainSound);
			}
			return;
		}
		
		// If battle is not paused
		if (battles[0]['Resumed']) {
			// Focus a target
			var playerDeployed = null;
			var enemyDeployed = null;
			if (playerForce == officers[battles[0]['Commander0']].Force) {
				playerDeployed = deployed0;
				enemyDeployed = deployed1;
			}
			else if (playerForce == officers[battles[0]['Commander1']].Force) {
				playerDeployed = deployed1;
				enemyDeployed = deployed0;
			}
			if (playerDeployed != null && enemyDeployed != null) {
				for (var i = 0; i < enemyDeployed.length; i++) {
					var distance = units[enemyDeployed[i]].Vec.subtract(mousePos).length();
					if (distance < portraitRadius) {
						for (var j = 0; j < playerDeployed.length; j++) units[playerDeployed[j]].Target = units[enemyDeployed[i]].Id;
						return;
					}
				}
			}
			
			// Pause battle
			battles[0]['Resumed'] = false;
		}
		else {
			// Resume battle
			battles[0]['Resumed'] = true;
		}
	}
}

function animateUnits (unitIndexes, elapsedTimestamp, allyAbilities, enemyAbilities) {
	var elapsedSecond = elapsedTimestamp / battleSeconds;
	for (var i = 0; i < unitIndexes.length; i++) {
		var unit = units[unitIndexes[i]];
		var targetIndex = getUnitIndexById(unit.Target);
		if (Number.isInteger(targetIndex)) {
			var unitType = unitTypes[unit.Type];
			var subtract = units[targetIndex].Vec.subtract(unit.Vec);
			var distance = subtract.length();
			if (distance <= unitType.Range) {
				// Attack target
				unit.Cooldown -= elapsedSecond;
				if (unit.Cooldown <= 0) {
					var assistedStats0 = getAssistedStats(unit.Objective[1]);
					var assistedStats1 = getAssistedStats(units[targetIndex].Objective[1]);
					var damage = floor(calculateDamage(
						applyAbilities(unit.Morale, allyAbilities, enemyAbilities),
						calculateAttack(assistedStats0[0], assistedStats0[1]),
						calculateDefense(assistedStats1[0], assistedStats1[2]),
						unitType.Effectiveness[units[targetIndex].Type % 3]
					));
					units[targetIndex].Strength -= damage;
					if (units[targetIndex].Strength <= 0) units[targetIndex].Strength = 0;			
					damages[units[targetIndex].Id] = {
						'Damage' : damage,
						'Timestamp' : startTimestamp
					};
					
					unit.Cooldown = unitCooldown;
				}
			}
			else {
				// Move closer to target
				var normalized = subtract.normalize();
				unit.Vec = unit.Vec.add(normalized.scale(unitType.Speed * elapsedSecond));
			}
		}
	}
}

function animateBattle (timestamp) {
	if (battles.length > 0) {
		// Calculate elapsed time
		var currentTimestamp = performance.now();
		var elapsedTimestamp = currentTimestamp - startTimestamp;
		startTimestamp = currentTimestamp;
		
		// Animate when battle is not paused
		if (battles[0]['Resumed']) {
			var attUnits = getDeployedUnits(battles[0]['Commander0']);
			var defUnits = getDeployedUnits(battles[0]['Commander1']);
			// Find Target
			if (defUnits.length > 0) {
				for (var i = 0; i < attUnits.length; i++) {
					if (units[attUnits[i]].Target == null) units[attUnits[i]].Target = units[getNearestTarget(attUnits[i], defUnits)].Id;
				}
			}
			if (attUnits.length > 0) {
				for (var i = 0; i < defUnits.length; i++) {
					if (units[defUnits[i]].Target == null) units[defUnits[i]].Target = units[getNearestTarget(defUnits[i], attUnits)].Id;
				}
			}
			
			animateUnits(attUnits, elapsedTimestamp, battles[0]['Abilities0'], battles[0]['Abilities1']);
			animateUnits(defUnits, elapsedTimestamp, battles[0]['Abilities1'], battles[0]['Abilities0']);
			
			// Remove defeated units
			for (var i = 0; i < units.length; i++) {
				if (units[i].Strength <= 0) {
					// Unlock all targeting enemies
					for (var j = 0; j < units.length; j++) if (units[j].Target == units[i].Id) units[j].Target = null;
					if (damages[units[i].Id]) damages[units[i].Id] = null;
					units.splice(i, 1);
				}
			}
			
			// Remove elapsed damage info
			for (var i = 0; i < damages.length; i++) if (damages[i] && startTimestamp - damages[i]['Timestamp'] > battleSeconds) damages[i] = null;
		}
		
		draw();
		requestAnimationFrame(animateBattle);
	}
}

function initBattle () {
	var attCommander = battles[0]['Commander0'];
	var defCommander = battles[0]['Commander1'];
	var attUnits = getDeployedUnits(attCommander);
	var defUnits = getDeployedUnits(defCommander);
	
	// Assign back row position based on unit type
	var attBackRow = [];
	var defBackRow = [];
	for (var i = 0; i < attUnits.length; i++) if (unitTypes[units[attUnits[i]].Type].Type == 'bow') attBackRow.push(attUnits[i]);
	for (var i = 0; i < defUnits.length; i++) if (unitTypes[units[defUnits[i]].Type].Type == 'bow') defBackRow.push(defUnits[i]);
	
	// Attacking units battle position or vector
	var backCount = 0;
	var frontCount = 0;
	for (var i = 0; i < attUnits.length; i++) {
		if (attBackRow.includes(attUnits[i])) {
			units[attUnits[i]].Vec = new Point(
				battleX + unitHalfSize,
				battleY + (battleHeight - unitSize * attBackRow.length) / 2 + (backCount++ * unitSize) + unitHalfSize
			);
		}
		else {
			units[attUnits[i]].Vec = new Point(
				battleX + unitSize + unitHalfSize,
				battleY + (battleHeight - unitSize * (attUnits.length - attBackRow.length)) / 2 + (frontCount++ * unitSize) + unitHalfSize
			);
		}
	}
	
	// Defending units battle position or vector
	backCount = 0;
	frontCount = 0;
	for (var i = 0; i < defUnits.length; i++) {
		if (defBackRow.includes(defUnits[i])) {
			units[defUnits[i]].Vec = new Point(
				battleX + battleWidth - unitHalfSize,
				battleY + (battleHeight - unitSize * defBackRow.length) / 2 + (backCount++ * unitSize) + unitHalfSize
			);
		}
		else {
			units[defUnits[i]].Vec = new Point(
				battleX + battleWidth - unitSize - unitHalfSize,
				battleY + (battleHeight - unitSize * (defUnits.length - defBackRow.length)) / 2 + (frontCount++ * unitSize) + unitHalfSize
			);
		}
	}
	
	// Start battle animation
	startTimestamp = performance.now();
	requestAnimationFrame(animateBattle);
}

function animateMap (timestamp) {
	mapAnimationStep = (performance.now() - startTimestamp) / animationTime;
	if (mapAnimationStep < 1) {
		// Continue map animation
		draw();
		openPlayerCard();
		requestAnimationFrame(animateMap);
	}
	else {
		startTimestamp = mapAnimationStep = 0;
		// Development progress
		var redirected = [];
		for (var i = 0; i < officers.length; i++) {
			if (officers[i].Objective != '-' && !redirected.includes(i)) {
				var objective = officers[i].Objective[0];
				var index = officers[i].Objective[1];
				officers[i].Progress += 10;
				if (officers[i].Progress >= objectiveLength[objective]) {
					switch (objective) {
						case 'Farm':
							cities[index].cFarm += floor(officers[i].POL * devMultiplier);
							if (cities[index].cFarm > cities[index].Farm) cities[index].cFarm = cities[index].Farm;
							cities[index].cOrder -= orderDistrubtion;
							if (cities[index].cOrder < 0) cities[index].cOrder = 0;
							dismissOfficer(i);
							break;
						case 'Trade':
							cities[index].cTrade += floor(officers[i].POL * devMultiplier);
							if (cities[index].cTrade > cities[index].Trade) cities[index].cTrade = cities[index].Trade;
							cities[index].cOrder -= orderDistrubtion;
							if (cities[index].cOrder < 0) cities[index].cOrder = 0;
							dismissOfficer(i);
							break;
						case 'Tech':
							cities[index].cTech += floor(officers[i].INT * devMultiplier);
							if (cities[index].cTech > cities[index].Tech) cities[index].cTech = cities[index].Tech;
							cities[index].cOrder -= orderDistrubtion;
							if (cities[index].cOrder < 0) cities[index].cOrder = 0;
							dismissOfficer(i);
							break;
						case 'Defense':
							cities[index].cDefense += floor(officers[i].WAR * devMultiplier);
							if (cities[index].cDefense > cities[index].Defense) cities[index].cDefense = cities[index].Defense;
							cities[index].cOrder -= orderDistrubtion;
							if (cities[index].cOrder < 0) cities[index].cOrder = 0;
							dismissOfficer(i);
							break;
						case 'Order':
							cities[index].cOrder += floor(officers[i].LDR * devMultiplier);
							if (cities[index].cOrder > orderLimit) cities[index].cOrder = orderLimit;
							dismissOfficer(i);
							break;
						case 'Establish':
							units.push(new Unit(getNewUnitId(), index, officers[i].Force, officers[i].City, officers[i].Position, establishMorale, floor(officers[i].CHR * recruitMultiplier), '-', '-', null, null, 0));
							dismissOfficer(i);
							break;
						case 'Recruit':
							index = getUnitIndexById(index);
							units[index].Strength += floor(officers[i].CHR * recruitMultiplier);
							if (units[index].Strength > strengthLimit) units[index].Strength = strengthLimit;
							dismissUnit(index);
							dismissOfficer(i);
							break;
						case 'Drill':
							index = getUnitIndexById(index);
							units[index].Morale += floor(officers[i].LDR * drillMultiplier);
							if (units[index].Morale > moraleLimit) units[index].Morale = moraleLimit;
							dismissUnit(index);
							dismissOfficer(i);
							break;
						case 'Employ':
							if (Math.random() * officers[i].CHR > Math.random() * getForceDiligence(getForceIndexById(officers[index].Force))) {
								if (officers[index].Objective != '-') {
									if (officers[index].Objective[0] == 'March') dismissDeployed(index);
									else if (officers[index].Objective[0] == 'Recruit' || officers[index].Objective[0] == 'Drill') {
										var unitIndex = getUnitIndexById(officers[index].Objective[1]);
										dismissUnit(unitIndex);
									}
								}
								officers[index].Force = officers[i].Force;
								officers[index].City = officers[i].City;
								officers[index].Objective = ['Return', officers[i].City];
								officers[index].Progress = 0;
								redirected.push(index);
								// Dismiss all employer
								for (var j = 0; j < officers.length; j++) {
									if (officers[j].Objective != '-' && officers[j].Objective[0] == 'Employ' && officers[j].Objective[1] == index) {
										officers[j].Objective = ['Return', officers[j].City];
										officers[j].Progress = 0;
										redirected.push(j);
									}
								}
							}
							officers[i].Objective = ['Return', officers[i].City];
							officers[i].Progress = 0;
							break;
						case 'Transfer':
							officers[i].City = index;
							officers[i].Position = getCityPosition(index);
							dismissOfficer(i);
							break;
						case 'Return':
							officers[i].Position = getCityPosition(index);
							dismissOfficer(i);
							break;
					}
				}
			}
		}
		// Military progress
		for (var i = 0; i < units.length; i++) {
			if (units[i].Objective != '-') {
				var objective = units[i].Objective[0];
				var index = units[i].Objective[1];
				units[i].Progress += 10;
				if (units[i].Progress >= objectiveLength[objective]) {
					switch (objective) {
						case 'Transfer':
							units[i].City = index;
							units[i].Position = getCityPosition(index);
							dismissUnit(i);
							break;
						case 'Return':
							units[i].Position = getCityPosition(index);
							dismissUnit(i);
							break;
					}
				}
			}
		}
		// Revolts
		for (var i = 0; i < cities.length; i++) {
			if (cities[i].cOrder <= orderLimit / 2 && Math.random() * orderLimit / 2 > cities[i].cOrder) {
				cities[i].cFarm -= revoltImpact + floor(Math.random() * 20 - 5);
				if (cities[i].cFarm < devMinimum) cities[i].cFarm = devMinimum;
				cities[i].cTrade -= revoltImpact + floor(Math.random() * 20 - 5);
				if (cities[i].cTrade < devMinimum) cities[i].cTrade = devMinimum;
				cities[i].cTech -= revoltImpact + floor(Math.random() * 20 - 5);
				if (cities[i].cTech < devMinimum) cities[i].cTech = devMinimum;
				cities[i].cDefense -= revoltImpact + floor(Math.random() * 20 - 5);
				if (cities[i].cDefense < devMinimum) cities[i].cDefense = devMinimum;
			}
		}
		
		// Increase date
		var dateArray = date.split('-').map((x) => parseInt(x));
		dateArray[2] += 10;
		if (dateArray[2] > 30) {
			dateArray[2] = 1;
			dateArray[1] += 1;
			// Trade income and farm harvest
			for (var i = 0; i < cities.length; i++) {
				if (cities[i].Force != '-') {
					cities[i].Gold += cities[i].cTrade * incomeMultiplier;
					if (cities[i].Gold > maxGold) cities[i].Gold = maxGold;
					cities[i].Food += cities[i].cFarm * harvestMultiplier;
					if (cities[i].Food > maxFood) cities[i].Food = maxFood;
				}
			}
			
			if (dateArray[1] > 12) {
				dateArray[1] = 1;
				dateArray[0] += 1;
			}
		}
		date = dateArray.join('-');
		openPlayerCard();
		
		// Update positions of commander and units
		for (var i = 0; i < officers.length; i++) {
			if (officers[i].Objective != '-' && officers[i].Objective[0] == 'March' && (battles.length == 0 || !inBattle(i))) {
				var cityCollision = deployedCityCollision(i);
				if (officers[i].Objective[2].Points[1]) {
					var newPos = officers[i].Objective[2].Points[1];
					if (!Number.isInteger(cityCollision)) officers[i].Position = newPos;
					officers[i].Progress += 10;
					for (var j = 0; j < units.length; j++) {
						if (units[j].Objective != '-' && units[j].Objective[0] == 'March' && units[j].Objective[1] == i) {
							if (!Number.isInteger(cityCollision)) units[j].Position = newPos;
							units[j].Progress += 10;
						}
					}
					for (var j = 0; j < officers.length; j++) {
						if (officers[j].Objective != '-' && officers[j].Objective[0] == 'Assist' && officers[j].Objective[1] == i) {
							if (!Number.isInteger(cityCollision)) officers[j].Position = newPos;
							officers[j].Progress += 10;
						}
					}
					if (!Number.isInteger(cityCollision)) officers[i].Objective[2].Points.shift();
				}
				
				// City threatened, attack back
				cityCollision = deployedCityCollision(i);
				if (Number.isInteger(cityCollision)) {
					var viableOfficers = getCityViableOfficers(cityCollision, 'LDR');
					var viableUnits = getCityViableUnits(cityCollision);
					if (viableOfficers.length > 0 && viableUnits.length > 0) {
						var commander = viableOfficers[0];
						var totalCost = 0;
						for (var j = 0; j < viableUnits.length; j++) totalCost += units[viableUnits[j]].Strength * marchCost;
						if (cities[cityCollision].Food >= totalCost) {
							deploy(commander, officers[i].City, viableUnits, []);
							cities[cityCollision].Food -= totalCost;
						}
					}
				}
				
				// Unit collisions
				var unitCollision = deployedUnitCollision(i);
				if (Number.isInteger(unitCollision)) {
					var attStats = getAssistedStats(i);
					var defStats = getAssistedStats(unitCollision);
					// Get abilities
					var attOfficers = getDeployedAssistOfficers(i).concat(i);
					var attAbilities = getAbilities(attOfficers);
					var defOfficers = getDeployedAssistOfficers(unitCollision).concat(unitCollision);
					var defAbilities = getAbilities(defOfficers);
					
					battles.push({
						'Commander0' : i,
						'Commander1' : unitCollision,
						'Resumed' : false,
						'Stats0' : {
							'ATK' : calculateAttack(attStats[0], attStats[1]).toFixed(1),
							'DEF' : calculateDefense(attStats[0], attStats[2]).toFixed(1)
						},
						'Stats1' : {
							'ATK' : calculateAttack(defStats[0], defStats[1]).toFixed(1),
							'DEF' : calculateDefense(defStats[0], defStats[2]).toFixed(1)
						},
						'Abilities0' : attAbilities,
						'Abilities1' : defAbilities
					});
				}
				else if (Number.isInteger(cityCollision)) {
					// Deployed vs City collisions
					cities[cityCollision].cOrder -= orderDistrubtion;
					if (cities[cityCollision].cOrder < 0) cities[cityCollision].cOrder = 0;
					cities[cityCollision].cDefense -= demolishFixed + floor(getDeployedStrength(i) * demolishMultiplier);
					if (cities[cityCollision].cDefense <= 0) {
						// City captured
						var nearestCities = getCities(cities[cityCollision].Force, 'force', [cityCollision, 'near']);
						for (var j = 0; j < officers.length; j++) {
							if (officers[j].City == cityCollision) {
								if (nearestCities.length > 1) {
									// Return all officers to nearest city
									if (officers[j].Objective != '-') {
										if (officers[j].Objective[0] == 'March') dismissDeployed(j);
										else if (officers[j].Objective[0] == 'Recruit' || officers[j].Objective[0] == 'Drill') {
											var unitIndex = getUnitIndexById(officers[j].Objective[1]);
											dismissUnit(unitIndex);
										}
									}
									officers[j].City = nearestCities[1];
									officers[j].Objective = ['Return', nearestCities[1]];
									officers[j].Progress = 0;
								}
								else {
									// Auto employ officers of captured city
									if (officers[j].Objective != '-') {
										if (officers[j].Objective[0] == 'March') dismissDeployed(j);
										else if (officers[j].Objective[0] == 'Recruit' || officers[j].Objective[0] == 'Drill') {
											var unitIndex = getUnitIndexById(officers[j].Objective[1]);
											dismissUnit(unitIndex);
										}
									}
									officers[j].Force = officers[i].Force;
									officers[j].City = officers[i].City;
									officers[j].Objective = ['Return', officers[i].City];
									officers[j].Progress = 0;
								}
							}
						}
						// Dismiss units of captured city
						for (var j = 0; j < units.length; j++) {
							if (units[j].City == cityCollision) {
								units[j].Force = officers[i].Force;
								if (units[j].Objective != '-' && units[j].Objective[0] != 'Return') dismissUnit(j);
							}
						}
						
						cities[cityCollision].Force = officers[i].Force;
						cities[cityCollision].cDefense = captureDefense;
						// Dismiss all deployed from the same force with i that target the captured city
						for (var j = 0; j < officers.length; j++) {
							if (officers[j].Force == officers[i].Force && officers[j].Objective != '-' && officers[j].Objective[0] == 'March' && officers[j].Objective[1] == cityCollision) dismissDeployed(j);
						}
					}
				}
			}
		}
		
		// Init battle if there are battles, or end turn
		if (battles.length > 0) {
			initBattle();
			stopAudio(mainSound);
			playAudio(battleSound);
		}
		else {
			openInfoCard('City', officers[player].City);
			draw();
			saveData();
		}
	}
}

function playClick (e) {
	if (startTimestamp > 0) return;
	
	for (var i = 0; i < forces.length; i++) {
		if (i != getForceIndexById(playerForce)) {
			var forceId = forces[i].Id;
			var diligence = getForceDiligence(i);
			// Enemies march
			var marchableCities = getForceMarchableCities(forceId);
			for (var j = 0; j < marchableCities.length; j++) {
				var source = marchableCities[j];
				var targetCities = getCities(forceId, 'enemy', [source, 'near']);
				var targetLookup = enemyTargetLookup > targetCities.length ? targetCities.length : enemyTargetLookup;
				for (var k = 0; k < targetLookup; k++) {
					var target = targetCities[k];
					if (getCityStrength(source) * enemyAggresion > getCityStrength(target) && Math.random() * 100 < diligence * enemyAggresion) {
						var viableOfficers = getCityViableOfficers(source, 'LDR');
						var viableUnits = getCityViableUnits(source);
						if (viableOfficers.length > 0 && viableUnits.length > 0) {
							var commander = viableOfficers[0];
							var totalCost = 0;
							for (var l = 0; l < viableUnits.length; l++) totalCost += units[viableUnits[l]].Strength * marchCost;
							if (cities[source].Food >= totalCost) {
								deploy(commander, target, viableUnits, []);
								cities[source].Food -= totalCost;
							}
						}
					}
				}
			}
			
			// Enemies development and military
			var enemyCities = getCities(forceId, 'force');
			for (var j = 0; j < enemyCities.length; j++) {
				var city = cities[enemyCities[j]];
				var viableOfficers = getCityViableOfficers(enemyCities[j]);
				if (viableOfficers.length > 0) {
					var viableUnits = getCityViableUnits(enemyCities[j]);
					var unitCount = getCityUnitCount(enemyCities[j], true);
					
					var recruitable = false;
					var drillable = false;
					for (var k = 0; k < viableUnits.length; k++) {
						if (units[viableUnits[k]].Strength < strengthLimit) recruitable = true;
						if (units[viableUnits[k]].Morale < moraleLimit) drillable = true;
					}
					
					for (var k = 0; k < viableOfficers.length; k++) {
						if (Math.random() * 100 < diligence) {
							switch (parseInt(Math.random() * (viableUnits.length > 0 ? 11 : 8))) {
								case 0:
									if (city.cFarm < city.Farm && city.Gold >= devCost) assignDevObjective('Farm', viableOfficers[k], enemyCities[j]);
									break;
								case 1:
									if (city.cTrade < city.Trade && city.Gold >= devCost) assignDevObjective('Trade', viableOfficers[k], enemyCities[j]);
									break;
								case 2:
									if (city.cTech < city.Tech && city.Gold >= devCost) assignDevObjective('Tech', viableOfficers[k], enemyCities[j]);
									break;
								case 3:
									if (city.cDefense < city.Defense && city.Gold >= devCost) assignDevObjective('Defense', viableOfficers[k], enemyCities[j]);
									break;
								case 4: case 5:
									if (city.cOrder < orderLimit && city.Gold >= devCost) assignDevObjective('Order', viableOfficers[k], enemyCities[j]);
									break;
								case 6:
									if (unitCount < unitLimit && city.Gold >= getCityHighestEstablishCost(enemyCities[j])) {
										var cityUnitTypes = getCityUnitTypes(enemyCities[j]);
										var unitTypeIndex = cityUnitTypes[parseInt(Math.random() * cityUnitTypes.length)];
										officers[viableOfficers[k]].Objective = ['Establish', unitTypeIndex];
										officers[viableOfficers[k]].Progress = 0;
										
										city.Gold -= unitTypes[unitTypeIndex].Cost;
									}
									break;
								case 7:
									// Get force's cities and sort ascending by officer count
									var citiesOfficerCount = getCities(officers[viableOfficers[k]].Force, 'force').map((x) => [x, getCityOfficers(x).length]).sort(function (a, b) {
										if (a[1] == b[1]) return 0;
										else return (a[1] < b[1]) ? -1 : 1;
									});
									// Transfer if the city officer count minus the lowest officer count is bigger than 1
									if (getCityOfficers(officers[viableOfficers[k]].City).length - citiesOfficerCount[0][1] > 1) {
										officers[viableOfficers[k]].Objective = ['Transfer', citiesOfficerCount[0][0]];
										officers[viableOfficers[k]].Progress = 0;
									}
									break;
								case 8:
									if (recruitable && city.Gold >= getCityHighestRecruitCost(enemyCities[j])) {
										for (var l = 0; l < viableUnits.length; l++) {
											if (units[viableUnits[l]].Strength < strengthLimit && units[viableUnits[l]].Objective == '-') {
												assignOfficerUnit('Recruit', viableOfficers[k], viableUnits[l]);
												
												city.Gold -= unitTypes[units[viableUnits[l]].Type].Cost * recruitCostMultiplier;
												break;
											}
										}
									}
									break;
								case 9: case 10:
									if (drillable) {
										for (var l = 0; l < viableUnits.length; l++) {
											if (units[viableUnits[l]].Morale < moraleLimit && units[viableUnits[l]].Objective == '-') {
												assignOfficerUnit('Drill', viableOfficers[k], viableUnits[l]);
												break;
											}
										}
									}
									break;
							}
						}
					}
				}
			}
		}
	}
	
	// Start map animation
	startTimestamp = performance.now();
	requestAnimationFrame(animateMap);
}

function draw (force) {
	var now = performance.now();
	elapsed = now - then;
	if (elapsed > fpsInterval || force) {
		then = now;
		
		// Invalidate
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		
		ctx.font = canvasFont;
		
		// Begin drawing
		ctx.beginPath();
		
		if (gState == 0) {
			var line = 0;
			// Scenarios
			var x = canvasPad + buttonMargin;
			var w = scenarioWidth;
			var h = buttonHeight;
			for (var i = 0; i < scenarios.length; i++) {
				for (var j = 0; j < scenarios[i].Playables.length; j++) {
					var y = canvasPad + (line * buttonHeight) + (++line * buttonMargin);
					if (mousePos.X >= x && mousePos.X < x + w && mousePos.Y >= y && mousePos.Y < y + h) fillRect(x, y, w, h, buttonColor);
					drawRect(x, y, w, h, fontDark);
					ctx.fillStyle = fontDark;
					drawMessage(
						'[' + scenarios[i].Date + '] ' + scenarios[i].Name + ': ' + officers[scenarios[i].Playables[j]].Name,
						x + buttonPad,
						y + buttonHeight / 2 + 1
					);
				}
			}
			
			// Import data
			var y = canvasPad + (line * buttonHeight) + (++line * buttonMargin);
			fillRect(x, y, w, h, highlightColor);
			if (mousePos.X >= x && mousePos.X < x + w && mousePos.Y >= y && mousePos.Y < y + h) fillRect(x, y, w, h, buttonColor);
			drawRect(x, y, w, h, fontDark);
			ctx.fillStyle = fontDark;
			drawMessage('IMPORT DATA', x + buttonPad, y + buttonHeight / 2 + 1);
			
			// Copy data
			y = canvasPad + (line * buttonHeight) + (++line * buttonMargin);
			fillRect(x, y, w, h, highlightColor);
			if (mousePos.X >= x && mousePos.X < x + w && mousePos.Y >= y && mousePos.Y < y + h) fillRect(x, y, w, h, buttonColor);
			drawRect(x, y, w, h, fontDark);
			ctx.fillStyle = fontDark;
			drawMessage(copyString, x + buttonPad, y + buttonHeight / 2 + 1);
			
			if (localStorage['player']) {
				// Download data
				y = canvasPad + (line * buttonHeight) + (++line * buttonMargin);
				fillRect(x, y, w, h, highlightColor);
				if (mousePos.X >= x && mousePos.X < x + w && mousePos.Y >= y && mousePos.Y < y + h) fillRect(x, y, w, h, buttonColor);
				drawRect(x, y, w, h, fontDark);
				ctx.fillStyle = fontDark;
				drawMessage(downloadString, x + buttonPad, y + buttonHeight / 2 + 1);
				
				// Load data
				y = canvasPad + (line * buttonHeight) + (++line * buttonMargin);
				fillRect(x, y, w, h, highlightColor);
				if (mousePos.X >= x && mousePos.X < x + w && mousePos.Y >= y && mousePos.Y < y + h) fillRect(x, y, w, h, buttonColor);
				drawRect(x, y, w, h, fontDark);
				ctx.fillStyle = fontDark;
				drawMessage('LOAD DATA', x + buttonPad, y + buttonHeight / 2 + 1);
			}
		}
		else if (gState == 1) {
			var x = canvasPad;
			var y = canvasPad;
			// Draw background map
			drawImage(mapImage, x, y, mapSize, mapSize);
			// Draw roads
			ctx.globalAlpha = roadAlpha;
			for (var i = 0; i < map.length; i++) {
				for (var j = 0; j < map[i].length; j++) {
					x = canvasPad + i * squareSize;
					y = canvasPad + j * squareSize;
					
					if (map[i][j] != 1) {
						drawRect(x, y, squareSize, squareSize, cityColor);
						fillRect(x, y, squareSize, squareSize, roadColor);
					}
				}
			}
			ctx.globalAlpha = 1.0;
			
			// Draw cities
			for (var i = 0; i < map.length; i++) {
				for (var j = 0; j < map[i].length; j++) {
					x = canvasPad + i * squareSize;
					y = canvasPad + j * squareSize;
					
					if (map[i][j] >= cityIndexStart) {
						var index = map[i][j] - cityIndexStart;
						if (cities[index].Force == '-') {
							var emptyX = x + cityPad;
							var emptyY = y + cityPad;
							var emptySize = squareSize - (2 * cityPad);
							fillRect(emptyX, emptyY, emptySize, emptySize, cityColor);
						}
						else {
							var forceIndex = getForceIndexById(cities[index].Force);
							fillRect(x, y, squareSize, squareSize, forces[forceIndex].Color);
							if (infoIconHover) {
								ctx.fillStyle = fontDark;
								drawMessage(getCityViableOfficers(index).length + '/' + getCityOfficers(index).length, x + squareHalf, y + squareSize * 1.37, 'center');
							}
							ctx.fillStyle = getTextColor(forces[forceIndex].Color);
							drawMessage(forces[forceIndex].Name[0], x + squareHalf, y + squareHalf + 1, 'center');
						}
					}
				}
			}
			
			// Draw deployed units
			var w = squareSize - unitPad * 2;
			var h = squareSize - unitPad * 2;
			var dotSize = w / 3;
			for (var i = 0; i < officers.length; i++) {
				if (officers[i].Objective[0] == 'March') {
					x = canvasPad + officers[i].Position.X * squareSize + unitPad;
					y = canvasPad + officers[i].Position.Y * squareSize + unitPad;
					if (mousePos.X >= x && mousePos.X < x + w && mousePos.Y >= y && mousePos.Y < y + h) {
						var path = officers[i].Objective[2];
						for (var j = 1; j < path.Points.length; j++) {
							var pathX = canvasPad + path.Points[j].X * squareSize + unitPad;
							var pathY = canvasPad + path.Points[j].Y * squareSize + unitPad;
							fillRect(pathX, pathY, w, h, giveAlpha(forces[getForceIndexById(officers[i].Force)].Color));
						}
					}
					if (officers[i].Objective[2].Points[1]) {
						var diff = officers[i].Position.subtract(officers[i].Objective[2].Points[1]);
						x -= diff.X * squareSize * mapAnimationStep;
						y -= diff.Y * squareSize * mapAnimationStep;
					}
					drawImage(unitImage, x, y, w, h);
					// Dot indicator
					fillRect(x + dotSize, y - dotSize, dotSize, dotSize, forces[getForceIndexById(officers[i].Force)].Color);
					
					// Battle indicator on map
					if (battles.length > 0 && (i == battles[0]['Commander0'] || i == battles[0]['Commander1'])) drawImage(downImage, x, y - h, w, h);
				}
			}
			
			// Draw info icon
			drawImage(infoImage, canvasPad + (squareSize * infoIconX), canvasPad + (squareSize * infoIconY), squareSize, squareSize);
			
			// Draw battle scene
			if (battles.length > 0) {
				closeCard(playerCard, true);
				closeCard(infoCard);
				drawImage(sceneImage, battleX, battleY, battleWidth, battleHeight);
				
				// Draw unit portrait
				for (var i = 0; i < units.length; i++) {
					if (units[i].Vec && (units[i].Objective[1] == battles[0]['Commander0'] || units[i].Objective[1] == battles[0]['Commander1'])) {
						x = units[i].Vec.X - portraitRadius - portraitPad / 2;
						y = units[i].Vec.Y - portraitRadius;
						// Draw portrait border
						ctx.fillStyle = cityColor;
						ctx.beginPath();
						ctx.arc(units[i].Vec.X, units[i].Vec.Y, portraitRadius + 2 , 0, Math.PI * 2);
						ctx.closePath();
						ctx.fill();
						// Draw portrait
						ctx.save();
						ctx.beginPath();
						ctx.arc(units[i].Vec.X, units[i].Vec.Y, portraitRadius, 0, Math.PI * 2);
						ctx.clip();
						drawImage(battleImages[units[i].Objective[1]], x, y, portraitSize + portraitPad, portraitSize + portraitPad);
						ctx.restore();
					}
				}
				
				// Draw unit icon, strength, morale and damage info
				for (var i = 0; i < units.length; i++) {
					if (units[i].Vec && (units[i].Objective[1] == battles[0]['Commander0'] || units[i].Objective[1] == battles[0]['Commander1'])) {
						// Draw damage
						if (damages[units[i].Id] && startTimestamp - damages[units[i].Id]['Timestamp'] < battleSeconds) {
							ctx.font = 'bold ' + floor(canvasFontSize * (1 - (startTimestamp - damages[units[i].Id]['Timestamp']) / battleSeconds)) + 'px ' + canvasFontFamily;
							drawGlowMessage('-' + damages[units[i].Id]['Damage'], units[i].Vec.X, units[i].Vec.Y + damagePad, 'center', damageColor);
							ctx.font = canvasFont;
						}
						// Draw icon and strength
						drawGlowMessage(unitTypes[units[i].Type].Icon + units[i].Strength, units[i].Vec.X, units[i].Vec.Y + unitHalfSize, 'center', forces[getForceIndexById(units[i].Force)].Color);
						
						// Draw morale bar
						var startPoint = units[i].Vec.add(new Point(-moraleBarSize / 2, unitSize * 0.65));
						drawLine(startPoint, startPoint.add(new Point(moraleBarSize, 0)));
						drawLine(startPoint, startPoint.add(new Point(moraleBarSize * units[i].Morale / moraleLimit, 0)), moraleColor);
					}
				}
				
				// Draw battle info
				fillRect(battleX, battleY, battleWidth, unitSize, highlightColor);
				drawGlowMessage(officers[battles[0]['Commander0']].Name + ' Unit', attX, forceY, 'center');
				drawGlowMessage(officers[battles[0]['Commander1']].Name + ' Unit', defX, forceY, 'center');
				drawGlowMessage('⚔' + battles[0]['Stats0']['ATK'] + ' ⛨' + battles[0]['Stats0']['DEF'], attX, statsY, 'center');
				drawGlowMessage('⚔' + battles[0]['Stats1']['ATK'] + ' ⛨' + battles[0]['Stats1']['DEF'], defX, statsY, 'center');
				drawGlowMessage('☗ ' + getDeployedStrength(battles[0]['Commander0']), attX, strengthY, 'center');
				drawGlowMessage('☗ ' + getDeployedStrength(battles[0]['Commander1']), defX, strengthY, 'center');
				if (!battles[0]['Resumed']) drawGlowMessage('Paused', battleX + battleWidth / 2, statsY, 'center');
			}
		}
		
		ctx.stroke();
	}
}
