let modInfo = {
	name: "The Chimestry Tree",
	id: "Fallen_Cat_3",
	author: "Fallen_Cat feat. PurepleMare437",
	pointsName: "能量",
	modFiles: ["layers.js", "tree.js"],

	discordName: "",
	discordLink: "",
	initialStartPoints: new Decimal (0), // Used for hard resets and new players
	offlineLimit: 1,  // In hours
}

// Set your version in num and name
let VERSION = {
	num: "ersion [Perturbed Fallen_Cat 3]",
	name: "Literally nothing",
}

let changelog = `<h1>Changelog:</h1><br>
	<h3>v0.0</h3><br>
		- Added things.<br>
		- Added stuff.`

let winText = `恭喜！你通关了目前版本的The Chimestry Tree化学树！<br>这款增量游戏是由一对化竞生哥妹联手打造的，希望各位大佬们喜欢、支持这个作品OwO，如果大家觉得不错的话化学树会持续更新哦~<br>作者：Fallen_Cat feat. PurpleMare437`

// If you add new functions anywhere inside of a layer, and those functions have an effect when called, add them here.
// (The ones here are examples, all official functions are already taken care of)
var doNotCallTheseFunctionsEveryTick = ["blowUpEverything",'buy','onEnter','onExit','onComplete']

function getStartPoints(){
    return new Decimal(modInfo.initialStartPoints)
}

// Determines if it should show points/sec
function canGenPoints(){
	return true
}

// Calculate points/sec!
function getPointGen() {
	if(!canGenPoints())
		return new Decimal(0)

	let gain = new Decimal(1)
	if(hasUpgrade('Uni','uni1')) gain = gain.mul(layers.Uni.upgrades['uni1'].effect())
	if(hasUpgrade('Uni','uni4')) gain = gain.mul(layers.Uni.upgrades['uni4'].effect())
	if(player.Uni.feature >= 1) gain = gain.mul(layers.Uni.photonEff())
	if(player.Uni.feature >= 2) gain = gain.mul(layers.Uni.quarkEff())
	if(player.Uni.totalQuarks.gte(layers.Uni.quarksBonus[0].start)) gain = gain.mul(layers.Uni.quarksBonus[0].effect())
	if(getBuyableAmount('Uni','ph5')) gain = gain.mul(buyableEffect('Uni','ph5'))
	return gain
}

// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { return {
}}

// Display extra things at the top of the page
var displayThings = [
	function(){return '你的宇宙当前拥有 '+quickBigColor(formatHeat(player.points),'#FFFFFF')+' 能量。'},
	function(){return tmp.other.oompsMag != 0 ? format(tmp.other.oomps) + " OOM" + (tmp.other.oompsMag < 0 ? "^OOM" : tmp.other.oompsMag > 1 ? "^" + tmp.other.oompsMag : "") + "s" : '+'+formatHeat(getPointGen())+"/sec"},
	`结局：40⌬ + 光子共振层达到 黄光10层`
]

// Determines when the game "ends"
function isEndgame() {
	return player.Uni.photonsP.gte(40)
}



// Less important things beyond this point!

// Style for the background, can be a function
var backgroundStyle = {

}

// You can change this if you have things that can be messed up by long tick lengths
function maxTickLength() {
	return(3600) // Default is 1 hour which is just arbitrarily large
}

// Use this if you need to undo inflation from an older version. If the version is older than the version that fixed the issue,
// you can cap their current resources with this.
function fixOldSave(oldVersion){
}