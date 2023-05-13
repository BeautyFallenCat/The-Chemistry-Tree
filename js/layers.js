const UNI_PARTICLES = ["光子","夸克","电子","质子","中子","玻色子"]
const UNI_PARTICLES_COLOR = ["#ffffb0","#dd3333","yellow"]
const UNI_PARTICLES_REQ = [100,1e8,1e40,1e100]
addLayer("Uni", {
    name: "宇宙", 
    position: 0, 
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
        feature: 0,
    }},
    color: "#FFFFFF",
    requires: new Decimal(10), 
    passiveGeneration() {
        let gain = player.points.log(10)
        if(hasUpgrade('Uni','uni2')) gain = gain.mul(layers.Uni.buyables['uni1'].effect())
        return gain
    },
    resource: "宇宙精华", 
    baseResource: "能量", 
    baseAmount() {return player.points}, 
    type: "normal", 
    exponent: 0, 
    symbol(){return "Uni"+"<sup> "+formatWhole(player.Uni.feature)+" / 6 ("+formatWhole(player.Uni.points)+" UniE)"},
    gainMult() { 
        return new Decimal(1)
    },
    gainExp() { 
        return new Decimal(1)
    },
    clickables: {
        'f': {
            title() {return "粒子生成器<br>"},
            display() {return "解锁一种全新的基本粒子！<br>下一个粒子: "+quickColor(UNI_PARTICLES[player.Uni.feature]+"<br><br>"+"需要宇宙精华 "+UNI_PARTICLES_REQ[player.Uni.feature] , UNI_PARTICLES_COLOR[player.Uni.feature])},
            canClick() {return player.Uni.points.gte(UNI_PARTICLES_REQ[player.Uni.feature])},
            style(){
                if(layers.Uni.clickables[this.layer,this.id].canClick()) return {'box-shadow':'inset 0px 0px 5px '+(player.timePlayed%2+5)+'px '+UNI_PARTICLES_COLOR[player.Uni.feature], 'background-color':'black', 'color':'white', 'height':'200px', 'width':'200px', 'font-size':'13px' }
                else return {'height':'200px', 'width':'200px' , 'font-size':'13px'}
            }
        }
    },
    upgrades: {
        'uni1': {
            title() {return quickColor('['+this.id+']'+'<h3>宇宙大爆炸<br>',hasUpgrade(this.layer,this.id)?'green':'')},
            description() {return '宇宙精华数量倍增能量获取。'},
            effect() {
                let eff = player.Uni.points
                return eff
            },
            color(){return '#ffffff'},
            canAfford() {return player.Uni.points.gte(this.cost())},
            effectDisplay() {return '×'+format(layers.Uni.upgrades[this.layer,this.id].effect())+""},
            cost() {return n(10)},
            style() {
                if(!hasUpgrade(this.layer,this.id)&&!this.canAfford()){return ''}
                else if(!hasUpgrade(this.layer,this.id)&&this.canAfford()){return {'box-shadow':'inset 0px 0px 5px '+(player.timePlayed%2+5)+'px '+this.color(), 'background-color':'black', 'color':'white', 'height':'130px', 'width':'130px','border-color':'white'}}
                else return {'background-color':this.color(), 'color':'black', 'border-color':'green', 'box-shadow':'0px 0px 5px '+(player.timePlayed%2+5)+'px '+this.color(), 'height':'130px', 'width':'130px'}
            }
        },
        'uni2': {
            title() {return quickColor('['+this.id+']'+'<h3>精华压缩<br>',hasUpgrade(this.layer,this.id)?'green':'')},
            description() {return '解锁精华收集器，升级它能够倍增宇宙精华获取。'},
            effect() {
                let eff = player.Uni.points
                return eff
            },
            color(){return '#ffffff'},
            canAfford() {return player.Uni.points.gte(this.cost())},
            cost() {return n(50)},
            style() {
                if(!hasUpgrade(this.layer,this.id)&&!this.canAfford()){return ''}
                else if(!hasUpgrade(this.layer,this.id)&&this.canAfford()){return {'box-shadow':'inset 0px 0px 5px '+(player.timePlayed%2+5)+'px '+this.color(), 'background-color':'black', 'color':'white', 'height':'130px', 'width':'130px','border-color':'white'}}
                else return {'background-color':this.color(), 'color':'black', 'border-color':'green', 'box-shadow':'0px 0px 5px '+(player.timePlayed%2+5)+'px '+this.color(), 'height':'130px', 'width':'130px'}
            }
        },
    },
    buyables: {
        'uni1': {
            title() {return '<h3>精华收集器 Mk.I<br>'},
            display() {return '倍增宇宙精华获取。<br>每10个等级效果将获得大幅提升!<br><br>收集器等级：'+getBuyableAmount(this.layer,this.id)+'<br>'+'宇宙精华效率 ×'+format(this.effect())+"<br>费用："+format(this.cost())+" 宇宙精华"},
            canAfford() {return player.Uni.points.gte(this.cost())},
            cost(x){
                let cost = Decimal.mul(n(10),Decimal.pow(n(1.01),Decimal.pow(x,2))).mul(Decimal.pow(1.98,x))
                return cost
            },
            effect(x){
                let effect = Decimal.pow(1.5,x)
                return effect
            },
            buy(){
                player.Uni.points = player.Uni.points.sub(this.cost())
                setBuyableAmount(this.layer,this.id,getBuyableAmount(this.layer,this.id).add(1))
            },
            style() {
                if(!this.canAfford()){return {'background-color':'black', 'color':'white','border-color':'grey'}}
                else return {'background-color':'white', 'color':'black','border-color':'white','box-shadow':'inset 3px 3px 3px #aaaaaa'}
            }
        },
    },
    tabFormat:{
    "Universe":{
            content:[
                "main-display",
                "blank",
                ['display-text',function(){return '你正在每秒获取 +'+format(layers.Uni.passiveGeneration())+' 宇宙精华。(基于能量自动生成！)'}],
                "blank",
                ["clickable",'f'],
                "blank",
                ['row',[['upgrade','uni1'],['upgrade','uni2'],['upgrade','uni3'],['upgrade','uni4'],['upgrade','uni5']]],
            ],
            buttonStyle() {return {'border-radius':'5px','background-color':'white','color':'black'}}
        },
    "Essence":{
        content:[
            ["column", [["raw-html", function() {
                return ''
            }
            ], "blank", ["buyable", 'uni1']], {
                "background-color": "#dec895",
                color: "black",
                width: "16vw",
                padding: "10px",
                margin: "0 auto",
                "height": "250px"
            }]
        ],
        buttonStyle() {return {'border-radius':'5px','background':'linear-gradient(to right,white 11%, lightyellow 56%)','color':'black','box-shadow':'2px 2px 2px grey'}},
        unlocked() {return hasUpgrade('Uni','uni2')}
        }
    },
    nodeStyle(){
        return {
            "color":"#FFFFFF",
            "width":"600px",
            "border-color":"#FFFFFF",
            "border-width":"3px",
            "background":"#000000",
            "background-image":
            "linear-gradient(#000 30px,transparent 0),linear-gradient(90deg,white 1px,transparent 0)",
            "background-size":"31px 31px,31px 31px",
            "background-position":""+(player.timePlayed)%100+"%"+" "+(player.timePlayed%100)+"%"
        }
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    layerShown(){return true}
    
})
addNode("P",{
    row:999,
    color:'blue',
    onClick(){if(player.devSpeed!=1e-300) player.devSpeed = 1e-300
    else player.devSpeed = 1},
    canClick(){return true}
})
addLayer("H", {
    name: "氢", // This is optional, only used in a few places, If absent it just uses the layer id.
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
        feature: 0,
    }},
    color: "#FFFFFF",
    requires: new Decimal(10), // Can be a function that takes requirement increases into account
    resource: "氢", // Name of prestige currency
    baseResource: "宇宙能量", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    symbol(){return "H<sup>3"},
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    nodeStyle(){
        return {
            "border-color":"#FFFFFF",
            "border-width":"3px",
            "background": "linear-gradient(to right,green 11%, white 11%)",
        }
    },
    row: 1, // Row the layer is in on the tree (0 is the first row)
    layerShown(){return true},
    branches(){return ["Uni"]}
    
})