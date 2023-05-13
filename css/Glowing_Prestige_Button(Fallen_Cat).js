Vue.component('prestige-button', {
    props: ['layer', 'data'],
    template: `
    <button v-if="(tmp[layer].type !== 'none')" v-bind:class="{ [layer]: true, reset: true, locked: !tmp[layer].canReset, can: tmp[layer].canReset}"
        v-bind:style="[tmp[layer].canReset ? {'background-color': '#000000'} : {'background-color': 'rgb(184,75,95)'},tmp[layer].canReset ? {'box-shadow': 'inset 0px 0px 10px '+(player.timePlayed%5+5)+'px ' +tmp[layer].color} : {'box-shadow':''},tmp[layer].canReset ? {'color':'white'} : {'color':'black'}, tmp[layer].componentStyles['prestige-button']]"
        v-html="prestigeButtonText(layer)" v-on:click="doReset(layer)">
    </button>
    `

})
//改变重置按钮样式，使之背景底色变为黑色，同时边缘有随时间脉动的阴影(阴影颜色与设定层级颜色相同)
//作者：你群弱受落猫妹妹()