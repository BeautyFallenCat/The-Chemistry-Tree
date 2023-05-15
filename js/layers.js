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
        if(hasUpgrade('Uni','uni5')) gain = gain.mul(layers.Uni.buyables['uni2'].effect())
        if(hasUpgrade('Uni','uni3')) gain = gain.mul(layers.Uni.upgrades['uni3'].effect()), gain = gain.mul(layers.Ach.effect())
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
            },
        },
        'uni2': {
            title() {return quickColor('['+this.id+']'+'<h3>精华压缩<br>',hasUpgrade(this.layer,this.id)?'green':'')},
            description() {return '解锁精华收集器，升级它能够倍增宇宙精华获取。'},
            color(){return '#ffffff'},
            canAfford() {return player.Uni.points.gte(this.cost())},
            cost() {return n(50)},
            style() {
                if(!hasUpgrade(this.layer,this.id)&&!this.canAfford()){return ''}
                else if(!hasUpgrade(this.layer,this.id)&&this.canAfford()){return {'box-shadow':'inset 0px 0px 5px '+(player.timePlayed%2+5)+'px '+this.color(), 'background-color':'black', 'color':'white', 'height':'130px', 'width':'130px','border-color':'white'}}
                else return {'background-color':this.color(), 'color':'black', 'border-color':'green', 'box-shadow':'0px 0px 5px '+(player.timePlayed%2+5)+'px '+this.color(), 'height':'130px', 'width':'130px'}
            },
            unlocked() {return hasUpgrade(this.layer,'uni'+Number(this.id[3]-1))}
        },
        'uni3': {
            title() {return quickColor('['+this.id+']'+'<h3>*精华*<br>',hasUpgrade(this.layer,this.id)?'green':'')},
            description() {return '该层级的每个升级都会提升精华收益 1.2。同时解锁 '+quickColor('苯','blue')},
            effect() {
                let eff = Decimal.pow(1.2,player.Uni.upgrades.length)
                return eff
            },
            effectDisplay() {return '×'+format(layers.Uni.upgrades[this.layer,this.id].effect())+""},
            color(){return '#ffffff'},
            canAfford() {return player.Uni.points.gte(this.cost())},
            cost() {return n(1000)},
            style() {
                if(!hasUpgrade(this.layer,this.id)&&!this.canAfford()){return ''}
                else if(!hasUpgrade(this.layer,this.id)&&this.canAfford()){return {'box-shadow':'inset 0px 0px 5px '+(player.timePlayed%2+5)+'px '+this.color(), 'background-color':'black', 'color':'white', 'height':'130px', 'width':'130px','border-color':'white'}}
                else return {'background-color':this.color(), 'color':'black', 'border-color':'green', 'box-shadow':'0px 0px 5px '+(player.timePlayed%2+5)+'px '+this.color(), 'height':'130px', 'width':'130px'}
            },
            unlocked() {return hasUpgrade(this.layer,'uni'+Number(this.id[3]-1))}
        },
        'uni4': {
            title() {return quickColor('['+this.id+']'+'<h3>能量收集<br>',hasUpgrade(this.layer,this.id)?'green':'')},
            description() {return '该层级的每个升级都会提升能量收集速率 2。'},
            effect() {
                let eff = Decimal.pow(2,player.Uni.upgrades.length)
                if(eff.gte(100)) softcap(eff,'root',n(100),3)
                return eff
            },
            effectDisplay() {return '×'+format(layers.Uni.upgrades[this.layer,this.id].effect())+""},
            color(){return '#ffffff'},
            canAfford() {return player.Uni.points.gte(this.cost())},
            cost() {return n(5000)},
            style() {
                if(!hasUpgrade(this.layer,this.id)&&!this.canAfford()){return ''}
                else if(!hasUpgrade(this.layer,this.id)&&this.canAfford()){return {'box-shadow':'inset 0px 0px 5px '+(player.timePlayed%2+5)+'px '+this.color(), 'background-color':'black', 'color':'white', 'height':'130px', 'width':'130px','border-color':'white'}}
                else return {'background-color':this.color(), 'color':'black', 'border-color':'green', 'box-shadow':'0px 0px 5px '+(player.timePlayed%2+5)+'px '+this.color(), 'height':'130px', 'width':'130px'}
            },
            unlocked() {return hasUpgrade(this.layer,'uni'+Number(this.id[3]-1))}
        },
        'uni5': {
            title() {return quickColor('['+this.id+']'+'<h3>精华压缩<br>',hasUpgrade(this.layer,this.id)?'green':'')},
            description() {return '解锁精华倍增器，升级它能够更快倍增宇宙精华获取。'},
            color(){return '#ffffff'},
            canAfford() {return player.Uni.points.gte(this.cost())},
            cost() {return n(20000)},
            style() {
                if(!hasUpgrade(this.layer,this.id)&&!this.canAfford()){return ''}
                else if(!hasUpgrade(this.layer,this.id)&&this.canAfford()){return {'box-shadow':'inset 0px 0px 5px '+(player.timePlayed%2+5)+'px '+this.color(), 'background-color':'black', 'color':'white', 'height':'130px', 'width':'130px','border-color':'white'}}
                else return {'background-color':this.color(), 'color':'black', 'border-color':'green', 'box-shadow':'0px 0px 5px '+(player.timePlayed%2+5)+'px '+this.color(), 'height':'130px', 'width':'130px'}
            },
            unlocked() {return hasUpgrade(this.layer,'uni'+Number(this.id[3]-1))}
        },
    },
    buyables: {
        'uni1': {
            title() {return '<h3>精华收集器 Mk.I<br>'},
            display() {return '倍增宇宙精华获取。<br><br>收集器等级：'+getBuyableAmount(this.layer,this.id)+'<br>'+'宇宙精华效率 ×'+format(this.effect())+quickColor("(基数：×"+format(this.base())+")","red")+"<br>费用："+format(this.cost())+" 宇宙精华"},
            canAfford() {return player.Uni.points.gte(this.cost())},
            cost(x){
                let cost = Decimal.mul(n(10),Decimal.pow(n(1.01),Decimal.pow(x,2))).mul(Decimal.pow(1.98,x))
                return cost
            },
            base(){
                let base = Decimal.add(1.3,getAchievementAmount(0,1)*0.01)
                return base
            },
            effect(x){
                let effect = Decimal.pow(this.base(),x)
                return effect
            },
            buy(){
                player.Uni.points = player.Uni.points.sub(this.cost())
                setBuyableAmount(this.layer,this.id,getBuyableAmount(this.layer,this.id).add(1))
            },
            style() {
                if(!this.canAfford()){return {'background-color':'black', 'color':'white','border-color':'black'}}
                else return {'background-color':'white', 'color':'black','border-color':'white','box-shadow':'inset 3px 3px 3px #aaaaaa,0px 0px 10px #ffffff'}
            }
        },
        'uni2': {
            title() {return '<h3>精华倍增器 Mk.II<br>'},
            display() {return '倍增宇宙精华获取。<br><br>倍增器等级：'+getBuyableAmount(this.layer,this.id)+'<br>'+'宇宙精华效率 ×'+format(this.effect())+quickColor("(基数：×"+format(this.base())+")","red")+"<br>费用："+format(this.cost())+" 宇宙精华"},
            canAfford() {return player.Uni.points.gte(this.cost())},
            cost(x){
                let cost = Decimal.mul(n(1e4),Decimal.pow(n(1.25),Decimal.pow(x,2))).mul(Decimal.pow(4,x))
                return cost
            },
            base(){
                let base = n(2)
                return base
            },
            effect(x){
                let effect = Decimal.pow(this.base(),x)
                return effect
            },
            buy(){
                player.Uni.points = player.Uni.points.sub(this.cost())
                setBuyableAmount(this.layer,this.id,getBuyableAmount(this.layer,this.id).add(1))
            },
            style() {
                if(!this.canAfford()){return {'background-color':'black', 'color':'white','border-color':'black'}}
                else return {'background-color':'#FFFFE0', 'color':'black','border-color':'#FFFFE0','box-shadow':'inset 3px 3px 3px #aaaaaa,0px 0px 10px #FFFFE0'}
            },
            unlocked() {return hasUpgrade('Uni','uni5')}
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
                return 'linear-gradient(to right,white 11%, lightyellow) '
            }
            ], "blank", ['row',[['buyable','uni1'],['buyable','uni2']]]], {
                "background": "#dec895",
                color: "black",
                width: "48vw",
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
addLayer("Ach", {
    name: "⌬", // This is optional, only used in a few places, If absent it just uses the layer id.
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
        feature: 0,
    }},
    color: "yellow",
    resource: "⌬",
    symbol(){return "⌬"},
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    effect() {
        return Decimal.pow(1.1,player.Ach.points)
    },
    effectDescription() {
        return "加速能量生产 "+quickColor("<h2>"+format(layers.Ach.effect().mul(100))+"%","yellow")+""
    },
    nodeStyle(){
        return {
            "border-color":"yellow",
            "border-width":"3px",
            "background": "linear-gradient(135deg,yellow 6%, white 81%)",
            "height": "70px",
            "width": "70px",
        }
    },
    achievements: {
        '0-1-1':{
            name() {return "环 己 三 烯！"},
            tooltip() { return '解锁成就层。+1苯'},
            done() { return hasUpgrade('Uni','uni3')}, 
            onComplete() {return player.Ach.points = player.Ach.points.add(1)
            },
        },
        '0-1-2':{
            name() {return "10<sup>4"},
            tooltip() { return '获得 10000 宇宙精华。+1苯'},
            done() { return player.Uni.points.gte(10000)}, 
            onComplete() {return player.Ach.points = player.Ach.points.add(1)
            },
        },
    },
    row: 'side', // Row the layer is in on the tree (0 is the first row)
    layerShown(){return hasUpgrade('Uni','uni3')},
    tabFormat:{
        "Pre-Hydrogen":{
                content:[
                    "main-display",
                    "blank",
                    ['display-text',function(){return '<h2><u><==成就 Part1-前元素周期表 ==>'}],
                    
                    ["column", [["raw-html", function() {}],
                     "blank",['display-text',function(){return '<h3>[阶段0-1]-宇宙精华<br>此阶段的每个成就将会给予 0.01 精华收集器基数'}],
                    ['row',[["achievement",'0-1-1'],["achievement",'0-1-2']]]
                    ],
                    {
                        "color":"#FFFFFF",
                        "width":"600px",
                        "border-color":"#FFFFFF",
                        "border-width":"3px",
                        "background-color":"#000000",
                        "background-image":
                        "linear-gradient(#000 30px,transparent 0),linear-gradient(90deg,white 1px,transparent 0)",
                        "background-size":"31px 31px,31px 31px",
                        "background-position"() { return (player.timePlayed)%100+"%"+" "+(player.timePlayed%100)+"%"}
                    }]
                ],
                buttonStyle() {return {"color":"#FFFFFF",
                "border-radius":"5px",
                "border-color":"#FFFFFF",
                "border-width":"2px",
                "background":"#000000",
                "background-image":
                "linear-gradient(#000 15px,transparent 0),linear-gradient(90deg,white 1px,transparent 0)",
                "background-size":"16px 16px,16px 16px",
                "box-shadow":"2px 2px 2px white"
                }}
            },
        },
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
    layerShown(){return false},
    branches(){return ["Uni"]}
    
})
function getAchievementAmount(order1,order2)
{
    count = 0
    for (var i = 0; i< player.Ach.achievements.length; i++)
    {
        if(player.Ach.achievements[i][0] == order1&&player.Ach.achievements[i][2] == order2) count++
    }
    return count
}
function softcap(name,type,start,power)
{
    if(type == 'root'){ //根号软上限
        name = (name.div(start).root(power)).mul(start)
    }
}
