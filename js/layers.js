const UNI_PARTICLES = ["光子","夸克","电子","质子","中子","玻色子"]
const UNI_PARTICLES_COLOR = ["#ffffb0","#dd3333","yellow"]
const UNI_PARTICLES_REQ = [1.5e6,1e21,1e70,1e100]

const UNI_PHOTONS_ORDER = ["无线电波","微波","红外线","可见光","紫外线","X射线","伽马射线"]
const UNI_PHOTONS_COLOR = ["#444444","brown","red"]
const UNI_PHOTONS_REQ = [10,25,50,100,160,360,500,2500,7000,14000]
addLayer("Uni", {
    name: "宇宙", 
    position: 0, 
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
        photons: new Decimal(0),
        photonsP: new Decimal(0),
        photonsE: new Decimal(0),
        quarks: new Decimal(0),
        coloredQuarks: [n(0),n(0),n(0),n(0),n(0),n(0)],
        coloredQuarksE: [n(0),n(0),n(0),n(0),n(0),n(0)],
        totalQuarks: n(1),
        feature: 0,
        content: '',
    }},
    color: "#FFFFFF",
    requires: new Decimal(10), 
    passiveGeneration() {
        let gain = player.points.log(10)
        if(hasUpgrade('Uni','uni2')) gain = gain.mul(layers.Uni.buyables['uni1'].effect())
        if(hasUpgrade('Uni','uni5')) gain = gain.mul(layers.Uni.buyables['uni2'].effect())
        if(hasUpgrade('Uni','uni3')) gain = gain.mul(layers.Uni.upgrades['uni3'].effect()), gain = gain.mul(layers.Ach.effect())
        if(hasAchievement('Ach','0-3-1')) gain = gain.mul(Decimal.pow(2,getAchievementAmount(0,3)))
        if(player.Uni.feature >= 1) gain = gain.mul(layers.Uni.photonEff())
        if(player.Uni.feature >= 2) gain = gain.mul(layers.Uni.quarkEff())
        if(getBuyableAmount('Uni','ph5')) gain = gain.mul(buyableEffect('Uni','ph5'))
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
    quarksBonus:{
        0:{
            desc:'能量获取提升',
            effect(){return player.Uni.totalQuarks},
            start: n(10),
            prev: '×',
            color: "#FFFFFF"
        },
        1:{
            desc:'光子获取提升',
            effect(){return player.Uni.totalQuarks.div(100).sqrt()},
            start: n(100),
            prev: '×',
            color: "#ffff88"
        },
        2:{
            desc:'光子溢出<sup>2</sup>指数提升',
            effect(){return n(0.03)},
            start: n(1000),
            prev: '+',
            color: "orange"
        },
        3:{
            desc:'夸克获取提升',
            effect(){return player.Uni.totalQuarks.add(1).log(20).sqrt()},
            start: n(1e6),
            prev: '×',
            color: "#dd3333"
        },
        4:{
            desc:'光子获取提升',
            effect(){return player.Uni.totalQuarks.div(100).sqrt()},
            start: n(1e12),
            prev: '×',
            color: "#FFFFFF"
        },
        5:{
            desc:'光子获取提升',
            effect(){return player.Uni.totalQuarks.div(100).sqrt()},
            start: n(1e99),
            prev: '×',
            color: "#FFFFFF"
        },
    },
    clickables: {
        'f': {
            title() {return "粒子生成器<br>"},
            display() {return "解锁一种全新的基本粒子！<br>下一个粒子: "+quickColor(UNI_PARTICLES[player.Uni.feature]+"<br><br>"+"需要宇宙精华 "+format(UNI_PARTICLES_REQ[player.Uni.feature]) , UNI_PARTICLES_COLOR[player.Uni.feature])+"<br>(解锁夸克实际仅需要10<sup>20</sup>宇宙精华，将在下个版本开放夸克)"},
            canClick() {return player.Uni.points.gte(UNI_PARTICLES_REQ[player.Uni.feature])},
            style(){
                if(layers.Uni.clickables[this.layer,this.id].canClick()) return {'box-shadow':'inset 0px 0px 5px '+(player.timePlayed%2+5)+'px '+UNI_PARTICLES_COLOR[player.Uni.feature], 'background-color':'black', 'color':'white', 'height':'200px', 'width':'200px', 'font-size':'13px' }
                else return {'height':'200px', 'width':'200px' , 'font-size':'13px'}
            },
            onClick() { player.Uni.feature++ },
            unlocked(){
                return hasUpgrade(this.layer,'uni6')
            }
        },
        'ph1': {
            title() {return "光子共振<br>"},
            display() {return "重置光子，但提升一个光子共振阶层。<br>"+getPhotonLayerName(player.Uni.photonsP)+" → "+getPhotonLayerName(player.Uni.photonsP.add(1))+"<br>"+quickColor('获得 '+formatWhole(player.Uni.photonsP.add(1).mul(layers.Uni.getExtraPhotons()[1]))+' 光子精华','#ffff88')+"<br><br>"+quickColor("需要光子 "+formatWhole(layers.Uni.getPhotonReq()),"#ffff88")},
            canClick() {return player.Uni.photons.gte(layers.Uni.getPhotonReq())},
            style(){
                if(layers.Uni.clickables[this.layer,this.id].canClick()) return {'background-color':'#000000', 'color':'white','border-color':'#FFFF88','box-shadow':'inset 0px 0px 5px 5px #FFFF88', 'height':'150px', 'width':'300px' , 'font-size':'13px' , 'border-radius':'12px'}
                else return {'height':'150px', 'width':'300px' , 'font-size':'13px', 'border-radius':'12px'}
            },
            onClick() { 
                player.Uni.photonsP = player.Uni.photonsP.add(1)
                player.Uni.photons = new Decimal(0)
                player.Uni.photonsE = n(0) 
                for(var i = 0; i <= 9; i++){
                    setBuyableAmount("Uni",'ph'+i,n(0))
                }
                for(var i = 1; i <= player.Uni.photonsP; i++){
                    player.Uni.photonsE = player.Uni.photonsE.add(layers.Uni.getExtraPhotons()[1].mul(i))
                }
                player.Uni.photons = n(0)
                
            },
            unlocked(){
                return hasUpgrade(this.layer,'ph1')
            }
        },
        'ph2': {
            title() {return "光子复位<br>"},
            display() {return "重置所有的光子升级和光子，并返还所有花费的光子精华。"},
            canClick() {return true},
            style(){
                if(layers.Uni.clickables[this.layer,this.id].canClick()) return {'background-color':'#000000', 'color':'white','border-color':'#FFFF88','box-shadow':'inset 0px 0px 5px 5px #FFFF88', 'height':'150px', 'width':'150px' , 'font-size':'13px' }
                else return {'height':'150px', 'width':'150px' , 'font-size':'13px'}
            },
            onClick() {
                player.Uni.photonsE = layers.Uni.getExtraPhotons()[0]
                for(var i = 0; i <= 9; i++){
                    setBuyableAmount("Uni",'ph'+i,n(0))
                }
                for(var i = 1; i <= player.Uni.photonsP; i++){
                    player.Uni.photonsE = player.Uni.photonsE.add(layers.Uni.getExtraPhotons()[1].mul(i))
                }
                player.Uni.photons = n(0)
            },
            unlocked(){
                return hasMilestone(this.layer,'ph2')
            }
        },
        'qk1': {
            title() {return "夸克坍缩<br>"},
            display() {return "坍缩您全部的光子和光子精华，并获得 "+quickColor(formatWhole(layers.Uni.getQuarkGain())+' 夸克','#dd3333')+"<br><br>"+quickColor("Req: 微波8层 + 100,000 光子","#dd3333")},
            canClick() {return player.Uni.photons.gte(1e5)&&player.Uni.photonsP.gte(12)},
            style(){
                if(layers.Uni.clickables[this.layer,this.id].canClick()) return {'background-color':'#000000', 'color':'white','border-color':'#dd3333','box-shadow':'inset 0px 0px 5px 5px #dd3333', 'height':'150px', 'width':'300px' , 'font-size':'13px' , 'border-radius':'12px'}
                else return {'height':'150px', 'width':'300px' , 'font-size':'13px', 'border-radius':'12px'}
            },
            onClick() { 
                player.Uni.quarks = player.Uni.quarks.add(layers.Uni.getQuarkGain())
                player.Uni.photons = new Decimal(0)
                player.Uni.photonsP = new Decimal(0)
                player.Uni.milestones = []
                player.Uni.photonsE = layers.Uni.getExtraPhotons()[0]
                for(var i = 0; i <= 9; i++){
                    setBuyableAmount("Uni",'ph'+i,n(0))
                }
                player.Uni.photons = n(0)
                
            },
            unlocked(){
                return true
            }
        },
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
            title() {return quickColor('['+this.id+']'+'<h3>精华加倍<br>',hasUpgrade(this.layer,this.id)?'green':'')},
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
        'uni6': {
            title() {return quickColor('['+this.id+']'+'<h3>第一个粒子<br>',hasUpgrade(this.layer,this.id)?'green':'')},
            description() {return '2 免费的精华倍增器与粒子生成器。'},
            color(){return '#ffffff'},
            canAfford() {return player.Uni.points.gte(this.cost())},
            cost() {return n(100000)},
            style() {
                if(!hasUpgrade(this.layer,this.id)&&!this.canAfford()){return ''}
                else if(!hasUpgrade(this.layer,this.id)&&this.canAfford()){return {'box-shadow':'inset 0px 0px 5px '+(player.timePlayed%2+5)+'px '+this.color(), 'background-color':'black', 'color':'white', 'height':'130px', 'width':'130px','border-color':'white'}}
                else return {'background-color':this.color(), 'color':'black', 'border-color':'green', 'box-shadow':'0px 0px 5px '+(player.timePlayed%2+5)+'px '+this.color(), 'height':'130px', 'width':'130px'}
            },
            unlocked() {return hasUpgrade(this.layer,'uni'+Number(this.id[3]-1))}
        },
        'ph1': {
            title() {return quickColor('['+this.id+']'+'<h3>更多的光',hasUpgrade(this.layer,this.id)?'green':this.color())},
            description() {return '为什么不让光子更有用呢？uni6再生效一次，并且获得光子共振的能力！'},
            color(){return '#ffff88'},
            canAfford() {return player.Uni.points.gte(this.cost())},
            cost() {return n(50000000)},
            style() {
                if(!hasUpgrade(this.layer,this.id)&&!this.canAfford()){return ''}
                else if(!hasUpgrade(this.layer,this.id)&&this.canAfford()){return {'box-shadow':'inset 0px 0px 5px '+(player.timePlayed%2+5)+'px '+this.color(), 'background-color':'black', 'color':'white', 'height':'130px', 'width':'130px','border-color':this.color()}}
                else return {'background-color':this.color(), 'color':'black', 'border-color':'green', 'box-shadow':'0px 0px 5px '+(player.timePlayed%2+5)+'px '+this.color(), 'height':'130px', 'width':'130px'}
            },
            unlocked() {return player.Uni.feature >= 1}
        },
        'qk1': {
            title() {return quickColor('['+this.id+']'+'<h3>夸克力量 1',hasUpgrade(this.layer,this.id)?'green':this.color())},
            currencyLayer : 'Uni',
            currencyInternalName: 'quarks',
            currencyDisplayName: '夸克',
            description() {return '从 5 个光子精华开始。'},
            color(){return '#dd3333'},
            canAfford() {return player.Uni.quarks.gte(this.cost())},
            cost() {return n(1)},
            style() {
                if(!hasUpgrade(this.layer,this.id)&&!this.canAfford()){return ''}
                else if(!hasUpgrade(this.layer,this.id)&&this.canAfford()){return {'box-shadow':'inset 0px 0px 5px '+(player.timePlayed%2+5)+'px '+this.color(), 'background-color':'black', 'color':'white', 'height':'130px', 'width':'130px','border-color':this.color()}}
                else return {'background-color':this.color(), 'color':'black', 'border-color':'green', 'box-shadow':'0px 0px 5px '+(player.timePlayed%2+5)+'px '+this.color(), 'height':'130px', 'width':'130px'}
            },
            unlocked() {return player.Uni.feature >= 2}
        },
        'qk2': {
            title() {return quickColor('['+this.id+']'+'<h3>夸克力量 2',hasUpgrade(this.layer,this.id)?'green':this.color())},
            currencyLayer : 'Uni',
            currencyInternalName: 'quarks',
            currencyDisplayName: '夸克',
            description() {return '在夸克效应的公式中 增加 2。'},
            color(){return '#dd3333'},
            canAfford() {return player.Uni.quarks.gte(this.cost())},
            cost() {return n(1)},
            style() {
                if(!hasUpgrade(this.layer,this.id)&&!this.canAfford()){return ''}
                else if(!hasUpgrade(this.layer,this.id)&&this.canAfford()){return {'box-shadow':'inset 0px 0px 5px '+(player.timePlayed%2+5)+'px '+this.color(), 'background-color':'black', 'color':'white', 'height':'130px', 'width':'130px','border-color':this.color()}}
                else return {'background-color':this.color(), 'color':'black', 'border-color':'green', 'box-shadow':'0px 0px 5px '+(player.timePlayed%2+5)+'px '+this.color(), 'height':'130px', 'width':'130px'}
            },
            unlocked() {return player.Uni.feature >= 2}
        },
        'qk3': {
            title() {return quickColor('['+this.id+']'+'<h3>夸克力量 3',hasUpgrade(this.layer,this.id)?'green':this.color())},
            currencyLayer : 'Uni',
            currencyInternalName: 'quarks',
            currencyDisplayName: '夸克',
            description() {return '开始就拥有 0.5 级的 狭义相对论。'},
            color(){return '#dd3333'},
            canAfford() {return player.Uni.quarks.gte(this.cost())},
            cost() {return n(1)},
            style() {
                if(!hasUpgrade(this.layer,this.id)&&!this.canAfford()){return ''}
                else if(!hasUpgrade(this.layer,this.id)&&this.canAfford()){return {'box-shadow':'inset 0px 0px 5px '+(player.timePlayed%2+5)+'px '+this.color(), 'background-color':'black', 'color':'white', 'height':'130px', 'width':'130px','border-color':this.color()}}
                else return {'background-color':this.color(), 'color':'black', 'border-color':'green', 'box-shadow':'0px 0px 5px '+(player.timePlayed%2+5)+'px '+this.color(), 'height':'130px', 'width':'130px'}
            },
            unlocked() {return player.Uni.feature >= 2}
        },
        'qk4': {
            title() {return quickColor('['+this.id+']'+'<h3>夸克作用力',hasUpgrade(this.layer,this.id)?'green':this.color())},
            currencyLayer : 'Uni',
            currencyInternalName: 'quarks',
            currencyDisplayName: '夸克',
            description() {return '光子以降低的倍率提升自身。'},
            color(){return '#dd3333'},
            canAfford() {return player.Uni.quarks.gte(this.cost())},
            cost() {return n(2)},
            effect() {
                let eff = player.Uni.photons.add(1).log(40).add(1)
                if(eff.gte(10)) eff = softcap(eff,'root',10,4)
                return eff
            },
            effectDisplay() {return '×'+format(layers.Uni.upgrades[this.layer,this.id].effect())+""},
            style() {
                if(!hasUpgrade(this.layer,this.id)&&!this.canAfford()){return ''}
                else if(!hasUpgrade(this.layer,this.id)&&this.canAfford()){return {'box-shadow':'inset 0px 0px 5px '+(player.timePlayed%2+5)+'px '+this.color(), 'background-color':'black', 'color':'white', 'height':'130px', 'width':'130px','border-color':this.color()}}
                else return {'background-color':this.color(), 'color':'black', 'border-color':'green', 'box-shadow':'0px 0px 5px '+(player.timePlayed%2+5)+'px '+this.color(), 'height':'130px', 'width':'130px'}
            },
            unlocked() {return hasAchievement("Ach",'0-3-1')}
        },
        'qk5': {
            title() {return quickColor('['+this.id+']'+'<h3>夸克质量',hasUpgrade(this.layer,this.id)?'green':this.color())},
            currencyLayer : 'Uni',
            currencyInternalName: 'quarks',
            currencyDisplayName: '夸克',
            description() {return '根据夸克数量略微延后光子溢出。'},
            color(){return '#dd3333'},
            canAfford() {return player.Uni.quarks.gte(this.cost())},
            cost() {return n(2)},
            effect() {
                let eff = player.Uni.quarks.add(10).log(10).add(0.5)
                if(eff.gte(4)) eff = softcap(eff,'root',n(4),3)
                return eff
            },
            effectDisplay() {return '×'+format(layers.Uni.upgrades[this.layer,this.id].effect())+""},
            style() {
                if(!hasUpgrade(this.layer,this.id)&&!this.canAfford()){return ''}
                else if(!hasUpgrade(this.layer,this.id)&&this.canAfford()){return {'box-shadow':'inset 0px 0px 5px '+(player.timePlayed%2+5)+'px '+this.color(), 'background-color':'black', 'color':'white', 'height':'130px', 'width':'130px','border-color':this.color()}}
                else return {'background-color':this.color(), 'color':'black', 'border-color':'green', 'box-shadow':'0px 0px 5px '+(player.timePlayed%2+5)+'px '+this.color(), 'height':'130px', 'width':'130px'}
            },
            unlocked() {return hasAchievement("Ach",'0-3-1')}
        },
        'qk6': {
            title() {return quickColor('['+this.id+']'+'<h3>夸克自旋',hasUpgrade(this.layer,this.id)?'green':this.color())},
            currencyLayer : 'Uni',
            currencyInternalName: 'quarks',
            currencyDisplayName: '夸克',
            description() {return '无线电波 4 层的里程碑以增加的倍率适用于光子获取。'},
            color(){return '#dd3333'},
            canAfford() {return player.Uni.quarks.gte(this.cost())},
            cost() {return n(5)},
            effect() {
                let eff = layers.Uni.milestones['ph3'].effect().mul(2)
                return eff
            },
            effectDisplay() {return '×'+format(layers.Uni.upgrades[this.layer,this.id].effect())+""},
            style() {
                if(!hasUpgrade(this.layer,this.id)&&!this.canAfford()){return ''}
                else if(!hasUpgrade(this.layer,this.id)&&this.canAfford()){return {'box-shadow':'inset 0px 0px 5px '+(player.timePlayed%2+5)+'px '+this.color(), 'background-color':'black', 'color':'white', 'height':'130px', 'width':'130px','border-color':this.color()}}
                else return {'background-color':this.color(), 'color':'black', 'border-color':'green', 'box-shadow':'0px 0px 5px '+(player.timePlayed%2+5)+'px '+this.color(), 'height':'130px', 'width':'130px'}
            },
            unlocked() {return hasUpgrade(this.layer,'qk'+Number(this.id[2]-1))}
        },
        'qk7': {
            title() {return quickColor('['+this.id+']'+'<h3>强夸克作用力',hasUpgrade(this.layer,this.id)?'green':this.color())},
            currencyLayer : 'Uni',
            currencyInternalName: 'quarks',
            currencyDisplayName: '夸克',
            description() {return '根据精华可购买总数目提升光子收益，同时解锁3个新的光子理论项。'},
            color(){return '#dd3333'},
            canAfford() {return player.Uni.quarks.gte(this.cost())},
            cost() {return n(15)},
            effect() {
                let eff = getBuyableAmount('Uni','uni1').add(getBuyableAmount('Uni','uni2')).div(10).add(1)
                return eff
            },
            effectDisplay() {return '×'+format(layers.Uni.upgrades[this.layer,this.id].effect())+""},
            style() {
                if(!hasUpgrade(this.layer,this.id)&&!this.canAfford()){return ''}
                else if(!hasUpgrade(this.layer,this.id)&&this.canAfford()){return {'box-shadow':'inset 0px 0px 5px '+(player.timePlayed%2+5)+'px '+this.color(), 'background-color':'black', 'color':'white', 'height':'130px', 'width':'130px','border-color':this.color()}}
                else return {'background-color':this.color(), 'color':'black', 'border-color':'green', 'box-shadow':'0px 0px 5px '+(player.timePlayed%2+5)+'px '+this.color(), 'height':'130px', 'width':'130px'}
            },
            unlocked() {return hasUpgrade(this.layer,'qk'+Number(this.id[2]-1))}
        },
        'qk8': {
            title() {return quickColor('['+this.id+']'+'<h3>弱夸克作用力',hasUpgrade(this.layer,this.id)?'green':this.color())},
            currencyLayer : 'Uni',
            currencyInternalName: 'quarks',
            currencyDisplayName: '夸克',
            description() {return '解锁夸克理论。'},
            color(){return '#dd3333'},
            canAfford() {return player.Uni.quarks.gte(this.cost())},
            cost() {return n(50)},
            style() {
                if(!hasUpgrade(this.layer,this.id)&&!this.canAfford()){return ''}
                else if(!hasUpgrade(this.layer,this.id)&&this.canAfford()){return {'box-shadow':'inset 0px 0px 5px '+(player.timePlayed%2+5)+'px '+this.color(), 'background-color':'black', 'color':'white', 'height':'130px', 'width':'130px','border-color':this.color()}}
                else return {'background-color':this.color(), 'color':'black', 'border-color':'green', 'box-shadow':'0px 0px 5px '+(player.timePlayed%2+5)+'px '+this.color(), 'height':'130px', 'width':'130px'}
            },
            unlocked() {return hasUpgrade(this.layer,'qk'+Number(this.id[2]-1))}
        },
        'qk9': {
            title() {return quickColor('['+this.id+']'+'<h3>多元夸克',hasUpgrade(this.layer,this.id)?'green':this.color())},
            currencyLayer : 'Uni',
            currencyInternalName: 'quarks',
            currencyDisplayName: '夸克',
            description() {return '光子加成夸克获取的公式略微变得更好。光子获取×4'},
            color(){return '#dd3333'},
            canAfford() {return player.Uni.quarks.gte(this.cost())},
            cost() {return n(300)},
            style() {
                if(!hasUpgrade(this.layer,this.id)&&!this.canAfford()){return ''}
                else if(!hasUpgrade(this.layer,this.id)&&this.canAfford()){return {'box-shadow':'inset 0px 0px 5px '+(player.timePlayed%2+5)+'px '+this.color(), 'background-color':'black', 'color':'white', 'height':'130px', 'width':'130px','border-color':this.color()}}
                else return {'background-color':this.color(), 'color':'black', 'border-color':'green', 'box-shadow':'0px 0px 5px '+(player.timePlayed%2+5)+'px '+this.color(), 'height':'130px', 'width':'130px'}
            },
            unlocked() {return hasUpgrade(this.layer,'qk'+Number(this.id[2]-1))}
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
                let effect = Decimal.pow(this.base(),x.add(hasUpgrade('Uni','uni6')?2:0).add(hasUpgrade('Uni','ph1')?2:0).add(hasMilestone('Uni','ph5')?2:0))
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
        'ph1': {
            title() {return '<h4>狭义相对论<br>'},
            display() {return '倍增光子获取。<br><br>当前等级：'+getBuyableAmount(this.layer,this.id)+'<br>'+'光子获取速率 ×'+format(this.effect())+quickColor("(基数：×"+format(this.base())+")","red")+"<br>费用："+formatWhole(this.cost())+" 光子精华"},
            canAfford() {return player.Uni.photonsE.gte(this.cost())},
            cost(x){
                let cost = Decimal.pow(1.777,x).add(x).floor()
                return cost
            },
            base(){
                let base = n(2)
                return base
            },
            effect(x){
                let effect = Decimal.pow(this.base(),x.add(hasUpgrade('Uni','qk3')? 0.5 : 0))
                return effect
            },
            buy(){
                player.Uni.photonsE = player.Uni.photonsE.sub(this.cost().mul(buyableEffect('Uni','qk1')).round())
                setBuyableAmount(this.layer,this.id,getBuyableAmount(this.layer,this.id).add(1))
            },
            style() {
                if(layers.Uni.buyables[this.layer,this.id].canAfford()) return {'background-color':'#000000', 'color':'white','border-color':'#FFFF88','box-shadow':'inset 0px 0px 5px 5px #FFFF88', 'height':'200px', 'width':'200px' , 'font-size':'13px' }
                else return {'height':'200px', 'width':'200px' , 'font-size':'13px'}
            },
            unlocked() {return hasMilestone('Uni','ph2')}
        },
        'ph2': {
            title() {return '<h4>光子光度<br>'},
            display() {if(n(player.Uni.photonsP).gte(7))return '光子溢出<sup>2</sup>延迟开始。<br><br>当前等级：'+getBuyableAmount(this.layer,this.id)+'<br>'+'溢出延迟 ×'+format(this.effect())+quickColor("(基数：×"+format(this.base())+")","red")+"<br>费用："+formatWhole(this.cost())+" 光子精华"
        else return '无线电波3层解锁'},
            canAfford() {return player.Uni.photonsE.gte(this.cost())&&n(player.Uni.photonsP).gte(7)},
            cost(x){
                let cost = Decimal.pow(2.111,x).add(x*2).floor()
                return cost
            },
            base(){
                let base = n(1.5)
                return base
            },
            effect(x){
                let effect = Decimal.pow(this.base(),x)
                return effect
            },
            buy(){
                player.Uni.photonsE = player.Uni.photonsE.sub(this.cost().mul(buyableEffect('Uni','qk1')).round())
                setBuyableAmount(this.layer,this.id,getBuyableAmount(this.layer,this.id).add(1))
            },
            style() {
                if(layers.Uni.buyables[this.layer,this.id].canAfford()) return {'background-color':'#000000', 'color':'white','border-color':'#FFFF88','box-shadow':'inset 0px 0px 5px 5px #FFFF88', 'height':'200px', 'width':'200px' , 'font-size':'13px' }
                else return {'height':'200px', 'width':'200px' , 'font-size':'13px'}
            },
            unlocked() {return hasMilestone('Uni','ph2')}
        },
        'ph3': {
            title() {return '<h4>光子能量<br>'},
            display() {if(n(player.Uni.photonsP).gte(9))return '光子获取获得基于宇宙精华的一个加成。<br><br>当前等级：'+getBuyableAmount(this.layer,this.id)+'<br>'+'光子获取速率 ×'+format(this.effect())+quickColor("(基数：×"+format(this.base())+")","red")+"<br>费用："+formatWhole(this.cost())+" 光子精华"
        else return '无线电波1层解锁'},
            canAfford() {return player.Uni.photonsE.gte(this.cost())&&n(player.Uni.photonsP).gte(9)},
            cost(x){
                let cost = Decimal.pow(9,x).add(x).floor()
                return cost
            },
            base(){
                let base = n(2).mul(player.Uni.points.root(20))
                if(base.gte(20)) base = softcap(base, 'root', 20, 10)
                if(player.Uni.activeChallenge == 'qk1') base = n(1)
                if(player.Uni.activeChallenge == 'qk2') base = n(5)
                if(player.Uni.activeChallenge == 'qk3') base = n(1)
                return base
            },
            effect(x){
                let effect = Decimal.pow(this.base(),x)
                return effect
            },
            buy(){
                player.Uni.photonsE = player.Uni.photonsE.sub(this.cost().mul(buyableEffect('Uni','qk1')).round())
                setBuyableAmount(this.layer,this.id,getBuyableAmount(this.layer,this.id).add(1))
            },
            style() {
                if(layers.Uni.buyables[this.layer,this.id].canAfford()) return {'background-color':'#000000', 'color':'white','border-color':'#FFFF88','box-shadow':'inset 0px 0px 5px 5px #FFFF88', 'height':'200px', 'width':'200px' , 'font-size':'13px' }
                else return {'height':'200px', 'width':'200px' , 'font-size':'13px'}
            },
            unlocked() {return hasMilestone('Uni','ph2')}
        },
        'ph4': {
            title() {return '<h4>光子-夸克协同<br>'},
            display() {if(n(player.Uni.photonsP).gte(14))return '提升夸克获取乘数。<br><br>当前等级：'+getBuyableAmount(this.layer,this.id)+'<br>'+'光子获取速率 ×'+format(this.effect())+quickColor("(基数：×"+format(this.base())+")","red")+"<br>费用："+formatWhole(this.cost())+" 光子精华"
        else return '微波6层解锁'},
            canAfford() {return player.Uni.photonsE.gte(this.cost())&&n(player.Uni.photonsP).gte(14)},
            cost(x){
                let cost = Decimal.pow(13,x).add(x).floor()
                return cost
            },
            base(){
                let base = n(1.3)
                return base
            },
            effect(x){
                let effect = Decimal.pow(this.base(),x)
                return effect
            },
            buy(){
                player.Uni.photonsE = player.Uni.photonsE.sub(this.cost().mul(buyableEffect('Uni','qk1')).round())
                setBuyableAmount(this.layer,this.id,getBuyableAmount(this.layer,this.id).add(1))
            },
            style() {
                if(layers.Uni.buyables[this.layer,this.id].canAfford()) return {'background-color':'#000000', 'color':'white','border-color':'#FFFF88','box-shadow':'inset 0px 0px 5px 5px #FFFF88', 'height':'200px', 'width':'200px' , 'font-size':'13px' }
                else return {'height':'200px', 'width':'200px' , 'font-size':'13px'}
            },
            unlocked() {return hasUpgrade('Uni','qk7')&&n(player.Uni.photonsP).gte(10)}
        },
        'ph5': {
            title() {return '<h4>光子衰变<br>'},
            display() {if(n(player.Uni.photonsP).gte(17))return '提升前光子资源增益。<br><br>当前等级：'+getBuyableAmount(this.layer,this.id)+'<br>'+'光子获取速率 ×'+format(this.effect())+quickColor("(基数：×"+format(this.base())+")","red")+"<br>费用："+formatWhole(this.cost())+" 光子精华"
        else return '微波3层解锁'},
            canAfford() {return player.Uni.photonsE.gte(this.cost())&&n(player.Uni.photonsP).gte(17)},
            cost(x){
                let cost = Decimal.pow(2.777,x).add(x*5).floor()
                return cost
            },
            base(){
                let base = n(3)
                return base
            },
            effect(x){
                let effect = Decimal.pow(this.base(),x)
                if(effect.gte(1000)) effect = softcap(effect,'root',n(1000),5)
                return effect
            },
            buy(){
                player.Uni.photonsE = player.Uni.photonsE.sub(this.cost().mul(buyableEffect('Uni','qk1')).round())
                setBuyableAmount(this.layer,this.id,getBuyableAmount(this.layer,this.id).add(1))
            },
            style() {
                if(layers.Uni.buyables[this.layer,this.id].canAfford()) return {'background-color':'#000000', 'color':'white','border-color':'#FFFF88','box-shadow':'inset 0px 0px 5px 5px #FFFF88', 'height':'200px', 'width':'200px' , 'font-size':'13px' }
                else return {'height':'200px', 'width':'200px' , 'font-size':'13px'}
            },
            unlocked() {return hasUpgrade('Uni','qk7')&&n(player.Uni.photonsP).gte(10)}
        },
        'ph6': {
            title() {return '<h4>光子聚变<br>'},
            display() {if(n(player.Uni.photonsP).gte(22))return '提升前光子资源增益。<br><br>当前等级：'+getBuyableAmount(this.layer,this.id)+'<br>'+'光子获取速率 ×'+format(this.effect())+quickColor("(基数：×"+format(this.base())+")","red")+"<br>费用："+formatWhole(this.cost())+" 光子精华"
        else return '红外线8层解锁'},
            canAfford() {return player.Uni.photonsE.gte(this.cost())&&n(player.Uni.photonsP).gte(22)},
            cost(x){
                let cost = Decimal.pow(2.777,x).add(x*5).floor()
                return cost
            },
            base(){
                let base = n(3)
                return base
            },
            effect(x){
                let effect = Decimal.pow(this.base(),x)
                if(effect.gte(1000)) effect = softcap(effect,'root',n(1000),5)
                return effect
            },
            buy(){
                player.Uni.photonsE = player.Uni.photonsE.sub(this.cost().mul(buyableEffect('Uni','qk1')).round())
                setBuyableAmount(this.layer,this.id,getBuyableAmount(this.layer,this.id).add(1))
            },
            style() {
                if(layers.Uni.buyables[this.layer,this.id].canAfford()) return {'background-color':'#000000', 'color':'white','border-color':'#FFFF88','box-shadow':'inset 0px 0px 5px 5px #FFFF88', 'height':'200px', 'width':'200px' , 'font-size':'13px' }
                else return {'height':'200px', 'width':'200px' , 'font-size':'13px'}
            },
            unlocked() {return hasUpgrade('Uni','qk7')&&n(player.Uni.photonsP).gte(10)}
        },
        'qk1': {
            title() {return '<h4>光子精华限制器<br>'},
            display() {return '升级光子理论只需要消耗部分光子精华。<br><br>当前等级：'+getBuyableAmount(this.layer,this.id)+' / 10<br>'+'消耗倍率：'+formatWhole(this.effect().mul(100))+"%<br>费用："+formatWhole(this.cost())+" 夸克"},
            canAfford() {return player.Uni.quarks.gte(this.cost())&&getBuyableAmount(this.layer,this.id).lt(10)},
            cost(x){
                let cost = Decimal.pow(2,x).mul(10)
                return cost
            },
            base(){
                let base = n(0.1)
                return base
            },
            effect(x){
                let effect = Decimal.sub(1,Decimal.mul(this.base(),x))
                return effect
            },
            buy(){
                player.Uni.quarks = player.Uni.quarks.sub(this.cost())
                setBuyableAmount(this.layer,this.id,getBuyableAmount(this.layer,this.id).add(1))
            },
            style() {
                if(layers.Uni.buyables[this.layer,this.id].canAfford()) return {'background-color':'#000000', 'color':'white','border-color':'#dd3333','box-shadow':'inset 0px 0px 5px 5px #dd3333', 'height':'200px', 'width':'200px' , 'font-size':'13px' }
                else return {'height':'200px', 'width':'200px' , 'font-size':'13px'}
            },
            unlocked() {return hasUpgrade('Uni','qk8')},
        },
        'qk2': {
            title() {return '<h4>夸克复制器<br>'},
            display() {return '倍增夸克获取。<br><br>当前等级：'+getBuyableAmount(this.layer,this.id)+'<br>'+'当前效果：×'+format(this.effect())+quickColor("(基数：×"+format(this.base())+")","red")+"<br>费用："+formatWhole(this.cost())+" 夸克"},
            canAfford() {return player.Uni.quarks.gte(this.cost())},
            cost(x){
                let cost = Decimal.pow(10,x).mul(100)
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
                player.Uni.quarks = player.Uni.quarks.sub(this.cost())
                setBuyableAmount(this.layer,this.id,getBuyableAmount(this.layer,this.id).add(1))
            },
            style() {
                if(layers.Uni.buyables[this.layer,this.id].canAfford()) return {'background-color':'#000000', 'color':'white','border-color':'#dd3333','box-shadow':'inset 0px 0px 5px 5px #dd3333', 'height':'200px', 'width':'200px' , 'font-size':'13px' }
                else return {'height':'200px', 'width':'200px' , 'font-size':'13px'}
            },
            unlocked() {return hasUpgrade('Uni','qk8')},
        },
        
    },
    milestones: {
        'ph1': {
            requirementDescription() {return quickColor("光子共振层达到 "+getPhotonLayerName(this.req)+" ("+formatWhole(n(player.Uni.photonsP).div(layers.Uni.milestones[this.id].req).mul(100).min(100))+"%)",hasMilestone(this.layer,this.id)?'green':'')},
            effectDescription(){ return `————————————————————————————————————————————————<br>1.每个光子共振提升苯指数 0.05。(当前：+${format(this.effect())})<br>2.光子获取受到苯分子数量的加成。(当前：×${formatWhole(player.Ach.points)})`},
            req: n(3),
            done() { return player.Uni.photonsP.gte(this.req) },
            effect() { return n(player.Uni.photonsP).mul(0.05) },
            style() {
                if(!hasMilestone(this.layer,this.id)){ return {'height':'100px','width':'650px','background':`linear-gradient(to right,#999999 ${formatWhole(n(player.Uni.photonsP).div(layers.Uni.milestones[this.id].req).mul(100))}%,grey ${formatWhole(player.Uni.photonsP.div(layers.Uni.milestones[this.id].req).mul(100))}%)`,'border-radius':'5px'}}
                else return {'background': `repeating-linear-gradient(90deg, #444444 0, #444444 1px, #001700 0,#001700 70px)`,'background-size':'70px','color':'white','height':'100px','width':'650px','box-shadow':`0px 0px 4px ${player.timePlayed%2+5}px #444444`}
            },
            unlocked() {return hasUpgrade('Uni','ph1')}
        },
        'ph2': {
            requirementDescription() {return quickColor("光子共振层达到 "+getPhotonLayerName(this.req)+" ("+formatWhole(n(player.Uni.photonsP).div(layers.Uni.milestones[this.id].req).mul(100).min(100))+"%)",hasMilestone(this.layer,this.id)?'green':'')},
            effectDescription(){ return `————————————————————————————————————————————————<br>`+quickColor('1.解锁新的机制：光子理论。','#ffff88')},
            req: n(5),
            done() { return player.Uni.photonsP.gte(this.req) },
            style() {
                if(!hasMilestone(this.layer,this.id)){ return {'height':'100px','width':'650px','background':`linear-gradient(to right,#999999 ${formatWhole(n(player.Uni.photonsP).div(layers.Uni.milestones[this.id].req).mul(100))}%,grey ${formatWhole(player.Uni.photonsP.div(layers.Uni.milestones[this.id].req).mul(100))}%)`,'border-radius':'5px'}}
                else return {'background': `repeating-linear-gradient(90deg, #444444 0, #444444 1px, #001700 0,#001700 50px)`,'background-size':'50px','color':'white','height':'100px','width':'650px','box-shadow':`0px 0px 4px ${player.timePlayed%2+5}px #444444`}
            },
            unlocked() {return hasMilestone(this.layer,'ph'+Number(this.id[2]-1))}
        },
        'ph3': {
            requirementDescription() {return quickColor("光子共振层达到 "+getPhotonLayerName(this.req)+" ("+formatWhole(n(player.Uni.photonsP).div(layers.Uni.milestones[this.id].req).mul(100).min(100))+"%)",hasMilestone(this.layer,this.id)?'green':'')},
            effectDescription(){ return `————————————————————————————————————————————————<br>`+`1.每次进行光子共振，光子溢出就延迟 1.1 倍开始。(当前：×${format(this.effect())})<br>2.光子获取 ×2 (不受到溢出影响)`},
            req: n(6),
            effect() { return Decimal.pow(1.1,player.Uni.photonsP) },
            done() { return player.Uni.photonsP.gte(this.req) },
            style() {
                if(!hasMilestone(this.layer,this.id)){ return {'height':'100px','width':'650px','background':`linear-gradient(to right,#999999 ${formatWhole(n(player.Uni.photonsP).div(layers.Uni.milestones[this.id].req).mul(100))}%,grey ${formatWhole(player.Uni.photonsP.div(layers.Uni.milestones[this.id].req).mul(100))}%)`,'border-radius':'5px'}}
                else return {'background': `repeating-linear-gradient(90deg, #444444 0, #444444 1px, #001700 0,#001700 40px)`,'background-size':'40px','color':'white','height':'100px','width':'650px','box-shadow':`0px 0px 4px ${player.timePlayed%2+5}px #444444`}
            },
            unlocked() {return hasMilestone(this.layer,'ph'+Number(this.id[2]-1))}
        },
        'ph4': {
            requirementDescription() {return quickColor("光子共振层达到 "+getPhotonLayerName(this.req)+" ("+formatWhole(n(player.Uni.photonsP).div(layers.Uni.milestones[this.id].req).mul(100).min(100))+"%)",hasMilestone(this.layer,this.id)?'green':'')},
            effectDescription(){ return `————————————————————————————————————————————————<br>`+`1.光子的一重溢出导致的削弱上限为/2。<br>2.无线电波 7 层的里程碑第一个效果的 10 倍适用于光子效应。`},
            req: n(7),
            effect() { return Decimal.pow(1.1,player.Uni.photonsP) },
            done() { return player.Uni.photonsP.gte(this.req) },
            style() {
                if(!hasMilestone(this.layer,this.id)){ return {'height':'100px','width':'650px','background':`linear-gradient(to right,#999999 ${formatWhole(n(player.Uni.photonsP).div(layers.Uni.milestones[this.id].req).mul(100))}%,grey ${formatWhole(player.Uni.photonsP.div(layers.Uni.milestones[this.id].req).mul(100))}%)`,'border-radius':'5px'}}
                else return {'background': `repeating-linear-gradient(90deg, #444444 0, #444444 1px, #001700 0,#001700 30px)`,'background-size':'30px','color':'white','height':'100px','width':'650px','box-shadow':`0px 0px 4px ${player.timePlayed%2+5}px #444444`}
            },
            unlocked() {return hasMilestone(this.layer,'ph'+Number(this.id[2]-1))}
        },
        'ph5': {
            requirementDescription() {return quickColor("光子共振层达到 "+getPhotonLayerName(this.req)+" ("+formatWhole(n(player.Uni.photonsP).div(layers.Uni.milestones[this.id].req).mul(100).min(100))+"%)",hasMilestone(this.layer,this.id)?'green':'')},
            effectDescription(){ return `————————————————————————————————————————————————<br>`+`1.光子的${quickColor("溢出<sup>2</sup>",'orange')}导致的削弱指数+0.03。(这反而是加成！)<br>2.uni6再生效一次。`},
            req: n(11),
            done() { return player.Uni.photonsP.gte(this.req) },
            style() {
                if(!hasMilestone(this.layer,this.id)){ return {'height':'100px','width':'650px','background':`linear-gradient(to right,#999999 ${formatWhole(n(player.Uni.photonsP).div(layers.Uni.milestones[this.id].req).mul(100))}%,grey ${formatWhole(player.Uni.photonsP.div(layers.Uni.milestones[this.id].req).mul(100))}%)`,'border-radius':'5px'}}
                else return {'background': `repeating-linear-gradient(90deg, brown 0, brown 1px, #001700 0,#001700 90px)`,'background-size':'90px','color':'white','height':'100px','width':'650px','box-shadow':`0px 0px 4px ${player.timePlayed%4+5}px brown`}
            },
            unlocked() {return hasMilestone(this.layer,'ph'+Number(this.id[2]-1))}
        },
        'ph6': {
            requirementDescription() {return quickColor("光子共振层达到 "+getPhotonLayerName(this.req)+" ("+formatWhole(n(player.Uni.photonsP).div(layers.Uni.milestones[this.id].req).mul(100).min(100))+"%)",hasMilestone(this.layer,this.id)?'green':'')},
            effectDescription(){ return `————————————————————————————————————————————————<br>`+`1.自动购买宇宙精华相关的可重复升级。<br>2.夸克获取×2。`},
            req: n(15),
            done() { return player.Uni.photonsP.gte(this.req) },
            style() {
                if(!hasMilestone(this.layer,this.id)){ return {'height':'100px','width':'650px','background':`linear-gradient(to right,#999999 ${formatWhole(n(player.Uni.photonsP).div(layers.Uni.milestones[this.id].req).mul(100))}%,grey ${formatWhole(player.Uni.photonsP.div(layers.Uni.milestones[this.id].req).mul(100))}%)`,'border-radius':'5px'}}
                else return {'background': `repeating-linear-gradient(90deg, brown 0, brown 1px, #001700 0,#001700 50px)`,'background-size':'50px','color':'white','height':'100px','width':'650px','box-shadow':`0px 0px 4px ${player.timePlayed%4+5}px brown`}
            },
            unlocked() {return hasMilestone(this.layer,'ph'+Number(this.id[2]-1))}
        },
        'ph7': {
            requirementDescription() {return quickColor("光子共振层达到 "+getPhotonLayerName(this.req)+" ("+formatWhole(n(player.Uni.photonsP).div(layers.Uni.milestones[this.id].req).mul(100).min(100))+"%)",hasMilestone(this.layer,this.id)?'green':'')},
            effectDescription(){ return `————————————————————————————————————————————————<br>`+`1.升级 qk4 同样适用于夸克的自动生成速率。`},
            req: n(19),
            done() { return player.Uni.photonsP.gte(this.req) },
            style() {
                if(!hasMilestone(this.layer,this.id)){ return {'height':'100px','width':'650px','background':`linear-gradient(to right,#999999 ${formatWhole(n(player.Uni.photonsP).div(layers.Uni.milestones[this.id].req).mul(100))}%,grey ${formatWhole(player.Uni.photonsP.div(layers.Uni.milestones[this.id].req).mul(100))}%)`,'border-radius':'5px'}}
                else return {'background': `repeating-linear-gradient(90deg, brown 0, brown 1px, #001700 0,#001700 10px)`,'background-size':'10px','color':'white','height':'100px','width':'650px','box-shadow':`0px 0px 4px ${player.timePlayed%4+5}px brown`}
            },
            unlocked() {return hasMilestone(this.layer,'ph'+Number(this.id[2]-1))}
        },
    },
    infoboxes: {
    'qk1': {
        title: "夸克共振奖励",
        body() { 
            player.Uni.content = ''
            for(var i = 0; i <= 999; i++){
                if(player.Uni.totalQuarks.gte(layers.Uni.quarksBonus[i].start)) player.Uni.content += "["+i+"]"+layers.Uni.quarksBonus[i].desc+" "+quickBigColor(layers.Uni.quarksBonus[i].prev+format(layers.Uni.quarksBonus[i].effect()),layers.Uni.quarksBonus[i].color)+"<br>"
                else {
                    player.Uni.content += quickColor('下一项夸克共振奖励在'+formatWhole(layers.Uni.quarksBonus[i].start)+'总夸克能量！','#444444')
                    break
                }
            }
            return player.Uni.content
        },
        color(){return '#dd3333'},
        style(){return {'border-color':'#dd3333'}},
    },
},
    tabFormat:{
    "Universe":{
            content:[
                ['display-text',function(){return '<h4>你当前拥有 '+quickBigColor(formatWhole(player.Uni.points),'#FFFFFF') +' 宇宙精华。'}],
                "blank",
                ['display-text',function(){return '你正在每秒获取 +'+format(layers.Uni.passiveGeneration())+' 宇宙精华。(基于能量自动生成！)'}],
                "blank",
                ["clickable",'f'],
                "blank",
                ['row',[['upgrade','uni1'],['upgrade','uni2'],['upgrade','uni3'],['upgrade','uni4'],['upgrade','uni5']]],
                ['row',[['upgrade','uni6'],['upgrade','ph1'],['upgrade','uni8'],['upgrade','uni9'],['upgrade','uni10']]],
            ],
            buttonStyle() {return {'border-radius':'5px','background-color':'white','color':'black'}}
        },
    "Essence":{
        content:[
            ["column", [["raw-html", function() {
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
        },
    "Photons":{
        content:[
            ['display-text',function(){return quickBigColor("[光子共振层："+getPhotonLayerName(player.Uni.photonsP)+"]",UNI_PHOTONS_COLOR[player.Uni.photonsP.div(10).floor()])}],
            "blank",
            ['display-text',function(){return '<h4>你当前拥有 '+quickDoubleColor(formatWhole(player.Uni.photons),'#FFFFAA','#FFFF33') +' 光子。'+"(+"+format(layers.Uni.getPhotonGain())+"/sec)<br>这也给予了一个 "+quickDoubleColor("×"+format(layers.Uni.photonEff()),'white','white')+" 的宇宙精华与能量加成。"}],
            ['display-text',function(){return '<h4>你当前拥有 '+quickDoubleColor(formatWhole(player.Uni.photonsE),'#FFFFAA','#FFFF33') +' 光子精华。'}],
            "blank",
            ['display-text',function(){if(player.Uni.photons.gte(layers.Uni.getPhotonScs()[0])) return '<h4>由于你的光子过多，光子溢出导致您的光子产量除以 '+quickBigColor("/"+format(n(1).div(layers.Uni.getPhotonScs()[2].pow(player.Uni.photons.div(layers.Uni.getPhotonScs()[0]).log(2)).max(hasMilestone('Uni','ph4')?0.5:1e-300).max(hasAchievement('Ach','0-3-3')?1:1e-300))),'red')+" ！"}],
            "blank",
            ['display-text',function(){if(player.Uni.photons.gte(layers.Uni.getPhotonScs()[1])) return '<h4>由于你的光子过多，光子溢出<sup>2</sup>导致您的光子产量除以 '+quickBigColor("/"+format(n(1).div(layers.Uni.getPhotonScs()[3].pow(player.Uni.photons.div(layers.Uni.getPhotonScs()[1]).log(2)))),'orange')+" ！"}],
            "blank",
            ['row',[['clickable','ph1'],['clickable','ph2']]],
            "blank",
            ['row',[['buyable','ph1'],['buyable','ph2'],['buyable','ph3']]],
            ['row',[['buyable','ph4'],['buyable','ph5'],['buyable','ph6']]],
            "blank",
            "milestones",
        ],
        buttonStyle() {return {'border-radius':'5px','background':'#FFFFAA','color':'black','box-shadow':'2px 2px 2px grey'}},
        unlocked() {return player.Uni.feature >= 1},
        style() {return {'background': `repeating-linear-gradient(90deg, ${UNI_PHOTONS_COLOR[player.Uni.photonsP.div(10).floor()]} 0, ${UNI_PHOTONS_COLOR[player.Uni.photonsP.div(10).floor()]} 1px, black 0, black ${100-((player.Uni.photonsP%10)*10)+ 'px'})`,"background-position":""+(player.timePlayed)%100-((player.Uni.photonsP%10))+"%"+" "+(player.timePlayed%100-((player.Uni.photonsP%10)))+"%",'background-size':`${100-((player.Uni.photonsP%10)*10)+'px'} ${100-((player.Uni.photonsP%10)*10)+'px'}`}}
        },
    "Quarks":{
        content:[
            ['display-text',function(){return quickBigColor("[光子共振层："+getPhotonLayerName(player.Uni.photonsP)+"]",UNI_PHOTONS_COLOR[player.Uni.photonsP.div(10).floor()])}],
            "blank",
            ['display-text',function(){return '<h4>你当前拥有 '+quickBigColor(formatWhole(player.Uni.quarks),'#DD3333') +' 夸克，加成绝大部分先前粒子 '+quickBigColor("×"+format(layers.Uni.quarkEff()),'#DD3333')}],
            "blank",
            ['clickable','qk1'],
            "blank",
            ['row',[['upgrade','qk1'],['upgrade','qk2'],['upgrade','qk3'],['upgrade','qk4'],['upgrade','qk5']]],
            ['row',[['upgrade','qk6'],['upgrade','qk7'],['upgrade','qk8'],['upgrade','qk9'],['upgrade','qk10']]],
            "blank",
            ['row',[['buyable','qk1'],['buyable','qk2']]],
        ],
        buttonStyle() {return {'border-radius':'5px','background': '#dd3333', 'box-shadow': '2px 2px 0px red','border-color':'#dd3333'}},
        unlocked() {return player.Uni.feature >= 2},
        },
    "ColoredQuarks":{
        content:[
            ['display-text',function(){return quickBigColor("[光子共振层："+getPhotonLayerName(player.Uni.photonsP)+"]",UNI_PHOTONS_COLOR[player.Uni.photonsP.div(10).floor()])}],
            "blank",
            ['display-text',function(){return "你的总夸克能量为 "+quickBigColor(formatWhole(player.Uni.totalQuarks),"#dd3333")+"，提供了下面的一系列增益"}],
            "blank",
            ["infobox",'qk1'],
            ['row',[['challenge','qk1'],['challenge','qk2']]],
            ['row',[['challenge','qk3'],['challenge','qk4']]],
        ],
        buttonStyle() {return {'border-radius':'5px','background': '#dd5555', 'box-shadow': '2px 2px 5px red','border-color':'#dd5555'}},
        unlocked() {return player.Uni.feature >= 2},
        },
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
    photonEff(){
        let eff = Decimal.pow(player.Uni.photons.add(1).log(10),n(0.75).add(hasMilestone('Uni','ph4')?layers.Uni.milestones['ph1'].effect().mul(10):0)).add(1)
        if(eff.gte(10000)) eff = softcap(eff, 'root', 10000, 5)
        return eff
    },
    photonBoost(){
        if(player.Uni.activeChallenge == 'qk2') return n(1).div(Decimal.pow(1.2,player.Uni.photonsP).mul(Decimal.mul(1,player.Uni.photonsP.add(1))))
        else if(player.Uni.activeChallenge == 'qk3') return n(1e-4).div(Decimal.pow(1.2,player.Uni.photonsP).mul(Decimal.mul(4,player.Uni.photonsP.add(1))))
        else return Decimal.pow(1.2,player.Uni.photonsP).mul(Decimal.mul(0.4,player.Uni.photonsP.add(1))).mul(2.5)
    },
    getPhotonScs(){
        let sc = [n(10),n(100),n(0.4),n(0.2)]
        sc[0] = sc[0].mul(Decimal.pow(1.1,getAchievementAmount(0,2))) , sc[1] = sc[1].mul(Decimal.pow(1.1,getAchievementAmount(0,2)))
        if(hasMilestone('Uni','ph3')) {sc[0] = sc[0].mul(Decimal.pow(layers.Uni.milestones.ph3.effect())) , sc[1] = sc[1].mul(Decimal.pow(layers.Uni.milestones.ph3.effect()))}
        if(hasMilestone('Uni','ph4')) sc[1] = sc[1].mul(buyableEffect('Uni','ph2'))
        if(hasMilestone('Uni','ph5')) sc[3] = sc[3].add(0.03)
        if(player.Uni.totalQuarks.gte(layers.Uni.quarksBonus[2].start)) sc[3] = sc[3].add(0.03)
        if(hasUpgrade('Uni','1k5')) {sc[0] = sc[0].mul(layers.Uni.upgrades['qk5'].effect()) , sc[1] = sc[1].mul(layers.Uni.upgrades['qk5'].effect())}
        else if(player.Uni.activeChallenge == 'qk3') sc[3] = n(0.191981)
        if(player.Uni.coloredQuarks[2].gte(1)) sc[3] = sc[3].add(0.04)
        return sc
    },
    getPhotonReq(){
        if(player.Uni.photonsP.lt(10)) return UNI_PHOTONS_REQ[player.Uni.photonsP]
        else return Decimal.pow(2.5,player.Uni.photonsP.sub(10).pow(1.25)).mul(40000)
    },
    getPhotonGain(){
        let gain = n(1)
        gain = gain.mul(layers.Uni.photonBoost())
        gain = gain.mul(layers.Uni.quarkEff())
        if(hasMilestone(this.layer,'ph1')) gain = gain.mul(player.Ach.points)
        if(hasMilestone(this.layer,'ph2')) gain = gain.mul(layers.Uni.buyables['ph1'].effect())
        if(hasMilestone(this.layer,'ph4')) gain = gain.mul(layers.Uni.buyables['ph3'].effect())
        if(hasUpgrade(this.layer,'qk4')) gain = gain.mul(layers.Uni.upgrades['qk4'].effect())
        if(hasUpgrade(this.layer,'qk6')) gain = gain.mul(layers.Uni.upgrades['qk6'].effect())
        if(hasUpgrade(this.layer,'qk7')) gain = gain.mul(layers.Uni.upgrades['qk7'].effect())
        if(hasUpgrade(this.layer,'qk9')) gain = gain.mul(4)
        if(player.Uni.coloredQuarks[0].gte(1)) gain = gain.mul(15)
        if(player.Uni.totalQuarks.gte(layers.Uni.quarksBonus[1].start)) gain = gain.mul(layers.Uni.quarksBonus[1].effect())
        if(player.Uni.photons.gte(layers.Uni.getPhotonScs()[0])) gain = gain.mul(layers.Uni.getPhotonScs()[2].pow(player.Uni.photons.div(layers.Uni.getPhotonScs()[0]).log(2)).max(hasMilestone('Uni','ph4')?0.5:1e-300).max(hasAchievement('Ach','0-3-3')?1:1e-300))
        if(player.Uni.photons.gte(layers.Uni.getPhotonScs()[1])) gain = gain.mul(layers.Uni.getPhotonScs()[3].pow(player.Uni.photons.div(layers.Uni.getPhotonScs()[1]).log(2)))
        if(hasMilestone('Uni','ph3')) gain = gain.mul(2)
        return gain
    },
    getExtraPhotons()
    {
        let extra = [n(0),n(1)]
        if(hasUpgrade('Uni','qk1')) extra[0] = extra[0].add(5)
        if(player.Uni.activeChallenge == 'qk1') extra[1] = extra[1].div(100)
        if(hasAchievement('Ach','0-3-5')) extra[1] = extra[1].mul(1.5)
        return extra
    },
    getQuarkGain(){
        if(!layers.Uni.clickables['qk1'].canClick()) return n(0)
        let gain = player.Uni.photons.add(1).div(5e4).log(2).root(hasUpgrade('Uni','qk9')?1.7:2)
        if(!hasUpgrade('Uni','qk9')) gain = gain.floor()
        gain = gain.mul(player.Uni.photonsP.sub(12).mul(2).max(1))
        if(hasMilestone('Uni','ph6')) gain = gain.mul(2)
        if(getBuyableAmount('Uni','ph4').gte(1)) gain = gain.mul(layers.Uni.buyables['ph4'].effect()).floor()
        if(getBuyableAmount('Uni','qk2').gte(1)) gain = gain.mul(layers.Uni.buyables['qk2'].effect()).floor()
        if(player.Uni.totalQuarks.gte(layers.Uni.quarksBonus[3].start)) gain = gain.mul(layers.Uni.quarksBonus[3].effect())
        return gain
    },
    getColoredQuarkGain(){
        if(!layers.Uni.clickables['qk1'].canClick()) return n(0)
        let gain = player.Uni.photons.add(1).div(5e4).log(2).root(hasUpgrade('Uni','qk9')?1.7:2)
        if(!hasUpgrade('Uni','qk9')) gain = gain.floor()
        gain = gain.mul(player.Uni.photonsP.sub(12).mul(2).max(1))
        return gain
    },
    quarkEff(){
        let eff = player.Uni.quarks.add(1).add(hasUpgrade('Uni','qk2')? 2 : 0).cbrt()
        return eff
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    layerShown(){return true},
    update(diff){
        if(player.Uni.feature >= 1) player.Uni.photons = player.Uni.photons.add(n(diff).mul(layers.Uni.getPhotonGain()).min(player.Uni.photons.add(1).mul(1000)))
        if(hasAchievement('Ach','0-3-2')) if(player.Uni.photons.gte(layers.Uni.getPhotonReq())) {player.Uni.photonsP = player.Uni.photonsP.add(1),player.Uni.photonsE = player.Uni.photonsE.add(layers.Uni.getExtraPhotons()[1].mul(player.Uni.photonsP))}
        if(hasMilestone('Uni','ph6')){
            if(layers.Uni.buyables['uni1'].canAfford) buyBuyable('Uni','uni1')
            if(layers.Uni.buyables['uni2'].canAfford) buyBuyable('Uni','uni2')
        }
        if(hasAchievement('Ach','0-3-5')){
            for(var i = 1; i <= 6; i++){
                buyBuyable('Uni','ph'+i)
            }
        }
        for(var i = 0; i <= 5; i++){
            if(i == 0)qk = n(1)
            if(player.Uni.coloredQuarksE[i].lt(player.Uni.coloredQuarks[i].mul(100))) player.Uni.coloredQuarksE[i] = player.Uni.coloredQuarksE[i].add(player.Uni.coloredQuarks[i].mul(diff))
            qk = qk.mul(player.Uni.coloredQuarksE[i].add(1))
            if(i == 5) player.Uni.totalQuarks = qk
        }
        if(player.Uni.coloredQuarks[1].gte(1)) player.Uni.quarks = player.Uni.quarks.add(layers.Uni.getQuarkGain().mul(0.1).mul(diff).mul(hasMilestone(this.layer,'ph7')?upgradeEffect('Uni','qk4'):1))
    },
    tooltip(){
        let tooltip = '宇宙精华: '+formatWhole(player.Uni.points)+"<br>"
        if(player.Uni.feature >= 1) tooltip += quickColor("光子 / 光子阶层: "+formatWhole(player.Uni.photons)+' / '+formatWhole(player.Uni.photonsP)+"<br>",'#ffff88')
        if(player.Uni.feature >= 1) tooltip += quickColor("夸克: "+formatWhole(player.Uni.quarks)+"<br>",'#dd3333')
        return tooltip
    },
    resetsNothing() {return true},
    challenges:{
        'qk1':{
            name() {return "["+this.id+"] 上夸克"+((this.locked())?'(锁定)':(player.Uni.activeChallenge == 'qk1'?("("+format(layers.Uni.getColoredQuarkGain().sub(player.Uni.coloredQuarks[this.id[2]-1]))+")"):("(不活跃)")))},
            text() {return "u"},
            locked() {return player.Uni.quarks.lt(1000)&&!(player.Uni.activeChallenge == 'qk1')},
            exp: "1",
            color: '#FF2222',
            challengeDescription() {
                let desc = "↑↑点击夸克图标以开始夸克共振！<br>———————————————————————<br>共振效果：1.光子精华获取变为 1%。<br> 2.光子能量基础强制固定在 ×1。<br><div style='background-color:#FF2222'>夸克共振需求：夸克≥1000</div>"
                if(!this.locked()) desc += "———————————————————————<br>如果你能在夸克共振中完成夸克坍缩，<br>你将获得上夸克！<br>(获取数量基于光子和光子共振层)<br><div style='background-color:#FF2222'>你拥有 "+formatWhole(player.Uni.coloredQuarks[this.id[2]-1])+" 上夸克。<br>第一次完成时，光子获取提升至 15 倍！<br>同时生成上夸克能量 +"+formatWhole(player.Uni.coloredQuarks[this.id[2]-1])+"/sec。</div>"
                return desc
            },
            style() {
                if(player.Uni.activeChallenge == 'qk1') return {'background-color':'#FF6666','box-shadow':'0px 0px 6px 6px #FF6666'}
                else if(!this.locked()) return {'background-color':'#FF6666','box-shadow':'0px 0px 3px 3px #FF6666'}
                else return {'background-color':'#888888'}
            },
            onEnter() {
                doQuarkReset()
                player.Uni.activeChallenge = this.id
            },
            onExit()
            {
                if(layers.Uni.getColoredQuarkGain().gte(player.Uni.coloredQuarks[this.id[2]-1])) player.Uni.coloredQuarks[this.id[2]-1] = layers.Uni.getColoredQuarkGain()
                player.Uni.activeChallenge = ''
            },
        },
        'qk2':{
            name() {return "["+this.id+"] 下夸克"+((this.locked())?'(锁定)':(player.Uni.activeChallenge == 'qk2'?("("+format(layers.Uni.getColoredQuarkGain().sub(player.Uni.coloredQuarks[this.id[2]-1]))+")"):("(不活跃)")))},
            text() {return "d"},
            locked() {return player.Uni.quarks.lt(30000)&&!(player.Uni.activeChallenge == 'qk2')},
            exp: "2",
            color: '#22FF22',
            challengeDescription() {
                let desc = "↑↑点击夸克图标以开始夸克共振！<br>———————————————————————<br>共振效果：1.共振阶层不再提升光子获取，而是加倍降低光子获取。<br> 2.光子能量基础强制固定在 ×5。<br><div style='background-color:#22FF22'>夸克共振需求：夸克≥30000</div>"
                if(!this.locked()) desc += "———————————————————————<br>如果你能在夸克共振中完成夸克坍缩，<br>你将获得下夸克！<br>(获取数量基于光子和光子共振层)<br><div style='background-color:#22FF22'>你拥有 "+formatWhole(player.Uni.coloredQuarks[this.id[2]-1])+" 下夸克。<br>第一次完成时，每秒自动获得 10% 重置可获得的夸克！(在较高数值时达到上限)<br>同时生成下夸克能量 +"+formatWhole(player.Uni.coloredQuarks[this.id[2]-1])+"/sec。</div>"
                return desc
            },
            style() {
                if(player.Uni.activeChallenge == 'qk2') return {'background-color':'#66FF66','box-shadow':'0px 0px 6px 6px #66FF66'}
                else if(!this.locked()) return {'background-color':'#66FF66','box-shadow':'0px 0px 3px 3px #66FF66'}
                else return {'background-color':'#888888'}
            },
            onEnter() {
                doQuarkReset()
                player.Uni.activeChallenge = this.id
            },
            onExit()
            {
                if(layers.Uni.getColoredQuarkGain().gte(player.Uni.coloredQuarks[this.id[2]-1])) player.Uni.coloredQuarks[this.id[2]-1] = layers.Uni.getColoredQuarkGain()
                player.Uni.activeChallenge = ''
            },
            unlocked() {return player.Uni.coloredQuarks[this.id[2]-2].gte(1)}
        },
        'qk3':{
            name() {return "["+this.id+"] 奇夸克"+((this.locked())?'(锁定)':(player.Uni.activeChallenge == 'qk3'?("("+format(layers.Uni.getColoredQuarkGain().sub(player.Uni.coloredQuarks[this.id[2]-1]))+")"):("(不活跃)")))},
            text() {return "s"},
            locked() {return player.Uni.quarks.lt(1e6)&&!(player.Uni.activeChallenge == 'qk3')},
            exp: "3",
            color: '#2255FF',
            challengeDescription() {
                let desc = "↑↑点击夸克图标以开始夸克共振！<br>———————————————————————<br>共振效果：1.共振阶层不再提升光子获取，而是超级加倍降低光子获取。<br> 2.光子溢出指数固定为x<sup>0.191981</sup>。<br>3.见上夸克的第一条效果。<div style='background-color:#2255FF'>夸克共振需求：夸克≥10<sup>6</sup></div>"
                if(!this.locked()) desc += "———————————————————————<br>如果你能在夸克共振中完成夸克坍缩，<br>你将获得奇夸克！<br>(获取数量基于光子和光子共振层)<br><div style='background-color:#2255FF'>你拥有 "+formatWhole(player.Uni.coloredQuarks[this.id[2]-1])+" 奇夸克。<br>第一次完成时，光子溢出指数提升 +0.04！<br>同时生成奇夸克能量 +"+formatWhole(player.Uni.coloredQuarks[this.id[2]-1])+"/sec。</div>"
                return desc
            },
            style() {
                if(player.Uni.activeChallenge == 'qk3') return {'background-color':'#6688FF','box-shadow':'0px 0px 6px 6px #6688FF'}
                else if(!this.locked()) return {'background-color':'#6688FF','box-shadow':'0px 0px 3px 3px #6688FF'}
                else return {'background-color':'#888888'}
            },
            onEnter() {
                doQuarkReset()
                player.Uni.activeChallenge = this.id
            },
            onExit()
            {
                if(layers.Uni.getColoredQuarkGain().gte(player.Uni.coloredQuarks[this.id[2]-1])) player.Uni.coloredQuarks[this.id[2]-1] = layers.Uni.getColoredQuarkGain()
                player.Uni.activeChallenge = ''
            },
            unlocked() {return player.Uni.coloredQuarks[this.id[2]-2].gte(1)}
        },
        'qk4':{
            name() {return "["+this.id+"] 粲夸克"+((this.locked())?'(锁定)':(player.Uni.activeChallenge == 'qk4'?("("+format(layers.Uni.getColoredQuarkGain().sub(player.Uni.coloredQuarks[this.id[2]-1]))+")"):("(不活跃)")))},
            text() {return "c"},
            locked() {return player.Uni.quarks.lt('1eee6')&&!(player.Uni.activeChallenge == 'qk4')},
            exp: "4",
            color: '#55FFFF',
            challengeDescription() {
                let desc = "↑↑点击夸克图标以开始夸克共振！<br>———————————————————————<br>哦不...这个夸克被颜值爆表、超绝可爱的落猫猫宇宙女王控制了！需要无穷多的夸克才能解除封印！<div style='background-color:#55FFFF'>夸克共振需求：夸克≥10<sup>100,000,000</sup></div>"
                if(!this.locked()) desc += "———————————————————————<br>如果你能在夸克共振中完成夸克坍缩，<br>你将获得奇夸克！<br>(获取数量基于光子和光子共振层)<br><div style='background-color:#FF55FF'>你拥有 "+formatWhole(player.Uni.coloredQuarks[this.id[2]-1])+" 奇夸克。<br>第一次完成时，光子溢出指数提升 +0.04！<br>同时生成奇夸克能量 +"+formatWhole(player.Uni.coloredQuarks[this.id[2]-1])+"/sec。</div>"
                return desc
            },
            style() {
                if(player.Uni.activeChallenge == 'qk4') return {'background-color':'#6688FF','box-shadow':'0px 0px 6px 6px #6688FF'}
                else if(!this.locked()) return {'background-color':'#6688FF','box-shadow':'0px 0px 3px 3px #6688FF'}
                else return {'background-color':'#888888'}
            },
            onEnter() {
                doQuarkReset()
                player.Uni.activeChallenge = this.id
            },
            onExit()
            {
                if(layers.Uni.getColoredQuarkGain().gte(player.Uni.coloredQuarks[this.id[2]-1])) player.Uni.coloredQuarks[this.id[2]-1] = layers.Uni.getColoredQuarkGain()
                player.Uni.activeChallenge = ''
            },
            unlocked() {return player.Uni.coloredQuarks[this.id[2]-2].gte(1)}
        },
    }
})

function getPhotonLayerName(layer){
    return UNI_PHOTONS_ORDER[layer.div(10).floor()]+" "+n(10).sub(layer%10)+"层"
}

function doQuarkReset(){
    player.Uni.quarks = player.Uni.quarks.add(layers.Uni.getQuarkGain())
    player.Uni.photons = new Decimal(0)
    player.Uni.photonsP = new Decimal(0)
    player.Uni.milestones = []
    player.Uni.photonsE = layers.Uni.getExtraPhotons()[0]
    for(var i = 0; i <= 9; i++){
        setBuyableAmount("Uni",'ph'+i,n(0))
    }
    player.Uni.photons = n(0)
}

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
        return Decimal.pow(Decimal.add(1.1,hasMilestone('Uni','ph1')? layers.Uni.milestones['ph1'].effect():0),player.Ach.points)
    },
    effectDescription() {
        return "加速能量生产 "+quickBigColor(format(layers.Ach.effect().mul(100))+"%","yellow")+""
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
        '0-1-3':{
            name() {return "无质量？"},
            tooltip() { return '解锁光子。+1苯'},
            done() { return player.Uni.feature >= 1}, 
            onComplete() {return player.Ach.points = player.Ach.points.add(1)
            },
        },
        '0-2-1':{
            name() {return "100个光子很多了！"},
            tooltip() { return '获得 100 光子。+2苯'},
            done() { return player.Uni.photons.gte(100) }, 
            onComplete() {return player.Ach.points = player.Ach.points.add(2)
            },
        },
        '0-2-2':{
            name() {return "专精"},
            tooltip() { return '解锁光子理论。+2苯'},
            done() { return hasMilestone('Uni','ph2') }, 
            onComplete() {return player.Ach.points = player.Ach.points.add(2)
            },
        },
        '0-2-3':{
            name() {return "火柴天堂"},
            tooltip() { return '拥有10<sup>15</sup>宇宙精华。+2苯'},
            done() { return player.Uni.points.gte(1e15) }, 
            onComplete() {return player.Ach.points = player.Ach.points.add(2)
            },
        },
        '0-2-4':{
            name() {return "微波炉"},
            tooltip() { return '光子共振层达到"微波"。+2苯'},
            done() { return player.Uni.photonsP.gte(10) }, 
            onComplete() {return player.Ach.points = player.Ach.points.add(2)
            },
        },
        '0-3-1':{
            name() {return "哦不！我的加成只有这点吗？"},
            tooltip() { return '获得 3 夸克升级。+3苯'},
            done() { return hasUpgrade("Uni",'qk1')&&hasUpgrade("Uni",'qk2')&&hasUpgrade("Uni",'qk3') }, 
            onComplete() {return player.Ach.points = player.Ach.points.add(3)
            },
        },
        '0-3-2':{
            name() {return "再来一个？"},
            tooltip() { return '一次重置中获得2个夸克。+3苯，如果可以进行光子共振，则不消耗光子进行共振！'},
            done() { return layers.Uni.getQuarkGain().gte(2) }, 
            onComplete() {return player.Ach.points = player.Ach.points.add(3)
            },
        },
        '0-3-3':{
            name() {return "四个也一样！"},
            tooltip() { return '一次重置中获得4个夸克。+3苯，光子的一重溢出效应永远为 /1。'},
            done() { return layers.Uni.getQuarkGain().gte(4) }, 
            onComplete() {return player.Ach.points = player.Ach.points.add(3)
            },
        },
        '0-3-4':{
            name() {return "夸克强化"},
            tooltip() { return '完成上夸克的共振。+3苯'},
            done() { return player.Uni.coloredQuarks[0].gte(1) }, 
            onComplete() {return player.Ach.points = player.Ach.points.add(3)
            },
        },
        '0-3-5':{
            name() {return "η=100%"},
            tooltip() { return '使宇宙精华永远不会被消耗。+3苯，自动购买全部的光子理论，光子精华 ×1.5'},
            done() { return layers.Uni.buyables['qk1'].effect().lt(0.1)}, 
            onComplete() {return player.Ach.points = player.Ach.points.add(3)
            },
        },
        '0-3-6':{
            name() {return "红外测温仪"},
            tooltip() { return '光子共振层达到"红外线"。+3苯'},
            done() { return player.Uni.photonsP.gte(20) }, 
            onComplete() {return player.Ach.points = player.Ach.points.add(3)
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
                    ['row',[["achievement",'0-1-1'],["achievement",'0-1-2'],["achievement",'0-1-3']]],
                    "blank",
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
                    }],
                    "blank",
                    ["column", [["raw-html", function() {}],
                     "blank",['display-text',function(){return '<h3>[阶段0-2]-光子&电磁波<br>此阶段的每个成就将会延迟光子溢出 1.1× '}],
                    ['row',[["achievement",'0-2-1'],["achievement",'0-2-2'],["achievement",'0-2-3'],["achievement",'0-2-4']]],
                    "blank",
                    ],
                    {
                        "color":"#000000",
                        "width":"600px",
                        "border-color":"#FFFFFF",
                        "border-width":"3px",
                        "background-color":"#ffff88",
                    }],
                    ["column", [["raw-html", function() {}],
                     "blank",['display-text',function(){return '<h3>[阶段0-3]-夸克<br>此阶段的每个成就都会提升 2 倍宇宙精华 '}],
                    ['row',[["achievement",'0-3-1'],["achievement",'0-3-2'],["achievement",'0-3-3'],["achievement",'0-3-4'],["achievement",'0-3-5']]],
                    ['row',[["achievement",'0-3-6'],["achievement",'0-3-7'],["achievement",'0-3-8'],["achievement",'0-3-9']]],
                    "blank",
                    ],
                    {
                        "color":"#000000",
                        "width":"600px",
                        "border-color":"#FFFFFF",
                        "border-width":"3px",
                        "background-color":"#dd3333",
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
        name = name.div(start).root(power).mul(start)
    }
    return name
}