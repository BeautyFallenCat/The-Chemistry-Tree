const UNI_PARTICLES = ["光子","夸克","电子","质子","中子","玻色子"]
const UNI_PARTICLES_COLOR = ["#ffffb0","#dd3333","yellow"]
const UNI_PARTICLES_REQ = [1.5e6,1e30,1e40,1e100]

const UNI_PHOTONS_ORDER = ["无线电波","微波","红外线","可见光","紫外线","X射线","伽马射线"]
const UNI_PHOTONS_COLOR = ["#444444","brown"]
const UNI_PHOTONS_REQ = [10,25,50,100,160,360,666,2500,6000,10000]
addLayer("Uni", {
    name: "宇宙", 
    position: 0, 
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
        photons: new Decimal(0),
        photonsP: new Decimal(0),
        photonsE: new Decimal(0),
        feature: 0,
    }},
    color: "#FFFFFF",
    requires: new Decimal(10), 
    passiveGeneration() {
        let gain = player.points.log(10)
        if(hasUpgrade('Uni','uni2')) gain = gain.mul(layers.Uni.buyables['uni1'].effect())
        if(hasUpgrade('Uni','uni5')) gain = gain.mul(layers.Uni.buyables['uni2'].effect())
        if(hasUpgrade('Uni','uni3')) gain = gain.mul(layers.Uni.upgrades['uni3'].effect()), gain = gain.mul(layers.Ach.effect())
        if(player.Uni.feature >= 1) gain = gain.mul(layers.Uni.photonEff())
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
            display() {return "重置光子，但提升一个光子共振阶层。<br>"+getPhotonLayerName(player.Uni.photonsP)+" → "+getPhotonLayerName(player.Uni.photonsP.add(1))+"<br>"+quickColor('获得 '+formatWhole(player.Uni.photonsP.add(1))+' 光子精华','#ffff88')+"<br><br>"+quickColor("需要光子 "+formatWhole(layers.Uni.getPhotonReq()),"#ffff88")},
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
                    player.Uni.photonsE = player.Uni.photonsE.add(i)
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
                player.Uni.photonsE = n(0) 
                for(var i = 0; i <= 9; i++){
                    setBuyableAmount("Uni",'ph'+i,n(0))
                }
                for(var i = 1; i <= player.Uni.photonsP; i++){
                    player.Uni.photonsE = player.Uni.photonsE.add(i)
                }
                player.Uni.photons = n(0)
            },
            unlocked(){
                return hasMilestone(this.layer,'ph2')
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
            cost() {return n(500000)},
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
                let effect = Decimal.pow(this.base(),x.add(hasUpgrade('Uni','uni6')?2:0).add(hasUpgrade('Uni','ph1')?2:0))
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
                let effect = Decimal.pow(this.base(),x)
                return effect
            },
            buy(){
                player.Uni.photonsE = player.Uni.photonsE.sub(this.cost())
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
            display() {if(n(player.Uni.photonsP).gte(7))return '光子溢出<sup>2</sup>延迟开始。<br><br>当前等级：'+getBuyableAmount(this.layer,this.id)+'<br>'+'光子获取速率 ×'+format(this.effect())+quickColor("(基数：×"+format(this.base())+")","red")+"<br>费用："+formatWhole(this.cost())+" 光子精华"
        else return '无线电波3层解锁'},
            canAfford() {return player.Uni.photonsE.gte(this.cost())&&n(player.Uni.photonsP).gte(6)},
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
                player.Uni.photonsE = player.Uni.photonsE.sub(this.cost())
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
                let base = n(2).mul(player.Uni.points.log(20))
                return base
            },
            effect(x){
                let effect = Decimal.pow(this.base(),x)
                return effect
            },
            buy(){
                player.Uni.photonsE = player.Uni.photonsE.sub(this.cost())
                setBuyableAmount(this.layer,this.id,getBuyableAmount(this.layer,this.id).add(1))
            },
            style() {
                if(layers.Uni.buyables[this.layer,this.id].canAfford()) return {'background-color':'#000000', 'color':'white','border-color':'#FFFF88','box-shadow':'inset 0px 0px 5px 5px #FFFF88', 'height':'200px', 'width':'200px' , 'font-size':'13px' }
                else return {'height':'200px', 'width':'200px' , 'font-size':'13px'}
            },
            unlocked() {return hasMilestone('Uni','ph2')}
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
                else return {'background': `repeating-linear-gradient(90deg, #444444 0, #444444 1px, black 0, black 70px)`,'background-size':'70px','color':'white','height':'100px','width':'650px','box-shadow':`0px 0px 4px ${player.timePlayed%2+5}px #444444`}
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
                else return {'background': `repeating-linear-gradient(90deg, #444444 0, #444444 1px, black 0, black 50px)`,'background-size':'50px','color':'white','height':'100px','width':'650px','box-shadow':`0px 0px 4px ${player.timePlayed%2+5}px #444444`}
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
                else return {'background': `repeating-linear-gradient(90deg, #444444 0, #444444 1px, black 0, black 40px)`,'background-size':'40px','color':'white','height':'100px','width':'650px','box-shadow':`0px 0px 4px ${player.timePlayed%2+5}px #444444`}
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
                else return {'background': `repeating-linear-gradient(90deg, #444444 0, #444444 1px, black 0, black 30px)`,'background-size':'30px','color':'white','height':'100px','width':'650px','box-shadow':`0px 0px 4px ${player.timePlayed%2+5}px #444444`}
            },
            unlocked() {return hasMilestone(this.layer,'ph'+Number(this.id[2]-1))}
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
            ['display-text',function(){if(player.Uni.photons.gte(layers.Uni.getPhotonScs()[0])) return '<h4>由于你的光子过多，光子溢出导致您的光子产量除以 '+quickBigColor("/"+format(n(1).div(layers.Uni.getPhotonScs()[2].pow(player.Uni.photons.div(layers.Uni.getPhotonScs()[0]).log(2)).max(hasMilestone('Uni','ph4')?0.5:1e-300))),'red')+" ！"}],
            "blank",
            ['display-text',function(){if(player.Uni.photons.gte(layers.Uni.getPhotonScs()[1])) return '<h4>由于你的光子过多，光子溢出<sup>2</sup>导致您的光子产量除以 '+quickBigColor("/"+format(n(1).div(layers.Uni.getPhotonScs()[3].pow(player.Uni.photons.div(layers.Uni.getPhotonScs()[1]).log(2)))),'orange')+" ！"}],
            "blank",
            ['row',[['clickable','ph1'],['clickable','ph2']]],
            "blank",
            ['row',[['buyable','ph1'],['buyable','ph2'],['buyable','ph3']]],
            "blank",
            "milestones",
        ],
        buttonStyle() {return {'border-radius':'5px','background':'#FFFFAA','color':'black','box-shadow':'2px 2px 2px grey'}},
        unlocked() {return player.Uni.feature >= 1},
        style() {return {'background': `repeating-linear-gradient(90deg, ${UNI_PHOTONS_COLOR[player.Uni.photonsP.div(10).floor()]} 0, ${UNI_PHOTONS_COLOR[player.Uni.photonsP.div(10).floor()]} 1px, black 0, black ${100-((player.Uni.photonsP%10)*10)+ 'px'})`,"background-position":""+(player.timePlayed)%100-((player.Uni.photonsP%10))+"%"+" "+(player.timePlayed%100-((player.Uni.photonsP%10)))+"%",'background-size':`${100-((player.Uni.photonsP%10)*10)+'px'} ${100-((player.Uni.photonsP%10)*10)+'px'}`}}
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
        return Decimal.pow(1.2,player.Uni.photonsP).mul(Decimal.mul(0.4,player.Uni.photonsP.add(1))).mul(2.5)
    },
    getPhotonScs(){
        let sc = [n(10),n(100),n(0.4),n(0.2)]
        sc[2] = sc[2].mul(Decimal.pow(1.1,getAchievementAmount(0,2))) , sc[3] = sc[3].mul(Decimal.pow(1.1,getAchievementAmount(0,2)))
        if(hasMilestone('Uni','ph3')) {sc[2] = sc[2].mul(Decimal.pow(layers.Uni.milestones.ph3.effect())) , sc[3] = sc[3].mul(Decimal.pow(layers.Uni.milestones.ph3.effect())).min(0.8)}
        if(hasMilestone('Uni','ph4')) sc[1] = sc[1].mul(buyableEffect('Uni','ph2'))
        return sc
    },
    getPhotonReq(){
        if(player.Uni.photonsP.lt(10)) return UNI_PHOTONS_REQ[player.Uni.photonsP]
        else return Decimal.pow(2.5,player.Uni.photonsP.sub(10).pow(1.25)).mul(4000)
    },
    getPhotonGain(){
        let gain = n(1)
        gain = gain.mul(layers.Uni.photonBoost())
        if(hasMilestone(this.layer,'ph1')) gain = gain.mul(player.Ach.points)
        if(hasMilestone(this.layer,'ph2')) gain = gain.mul(layers.Uni.buyables['ph1'].effect())
        if(hasMilestone(this.layer,'ph4')) gain = gain.mul(layers.Uni.buyables['ph3'].effect())
        if(player.Uni.photons.gte(layers.Uni.getPhotonScs()[0])) gain = gain.mul(layers.Uni.getPhotonScs()[2].pow(player.Uni.photons.div(layers.Uni.getPhotonScs()[0]).log(2)).max(hasMilestone('Uni','ph4')?0.5:1e-300))
        if(player.Uni.photons.gte(layers.Uni.getPhotonScs()[1])) gain = gain.mul(layers.Uni.getPhotonScs()[3].pow(player.Uni.photons.div(layers.Uni.getPhotonScs()[1]).log(2)))
        if(hasMilestone('Uni','ph3')) gain = gain.mul(2)
        return gain
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    layerShown(){return true},
    update(diff){
        if(player.Uni.feature >= 1) player.Uni.photons = player.Uni.photons.add(n(diff).mul(layers.Uni.getPhotonGain()))
    },
    tooltip(){
        let tooltip = '宇宙精华: '+formatWhole(player.Uni.points)+"<br>"
        if(player.Uni.feature >= 1) tooltip += quickColor("光子 / 光子阶层: "+formatWhole(player.Uni.photons)+' / '+formatWhole(player.Uni.photonsP),'#ffff88')
        return tooltip
    },
    
})

function getPhotonLayerName(layer){
    return UNI_PHOTONS_ORDER[layer.div(10).floor()]+" "+n(10).sub(layer%10)+"层"
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