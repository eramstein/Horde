import { adjacentCreatures, adjacentAllies, adjacentEnnemies } from '../engine/battle/battlefield'
import { addModifier, damage as damageCreature, addEnergy, heal, destroy as destroyCreature } from '../engine/battle/creature'
import abilities from './abilities'
import mobs from './mobs'

const cards = {
'Blacksmith': 
    {
        type: 'creature',
        subtypes: ['human'],
        cost: 1,
        hpMax: 2,
        energy: 0,
        attack: 1,
        abilities: [{
            trigger: 'moved',
            effect: (state, me, { creatureId }) => {
                const modifier = { type: 'attack', value: 1, until: 'eot' }
                const targets = adjacentAllies(state, { ...me.pos, hero: me.controller })
                _.forEach(targets, (c) => {
                    addModifier(state, { creatureId: c.id, modifier })
                })
            },
            text: 'After Move, +1 ATK to adj. allies until EOT'
        }],
        keywords: {},
    },
'Peasant': 
    {
        type: 'creature',
        subtypes: ['human'],
        cost: 1,
        hpMax: 3,
        attack: 1,
        energy: 0,
        abilities: [],
        keywords: {},
    },
'Knight of the Rose': 
    {
        type: 'creature',
        subtypes: ['human', 'soldier'],
        cost: 2,
        hpMax: 4,
        attack: 2,
        energy: 0,
        moves: 3,
        abilities: [ abilities.charge() ],
        keywords: {},
    },
'Wall of Pikes': 
    {
        type: 'creature',
        subtypes: ['structure'],
        cost: 1,
        hpMax: 9,
        attack: 0,
        energy: 0,
        abilities: [ abilities.retaliation({ damage: 5 }) ],
        keywords: { static: true, pacific: true },
    },
'Timz Tower': 
    {
        type: 'creature',
        subtypes: ['structure'],
        cost: 3,
        hpMax: 9,
        attack: 0,
        energy: 3,
        abilities: [{
            trigger: 'activated',
            cost: 1,
            targetType: 'creature',
            exhausts: true,
            effect: (state, me, { targetCreatureId }) => {
                damageCreature(state, { creatureId: targetCreatureId, damage: 1 })
            },
            text: 'Deal 1 HP damage to target creature'
        }],
        keywords: { static: true, pacific: true, airdrop: true },
    },
'Teleporter Mage': 
    {
        type: 'creature',
        subtypes: ['mage'],
        cost: 1,
        hpMax: 1,
        attack: 0,
        energy: 3,
        abilities: [{
            trigger: 'activated',
            cost: 1,
            targetTypes: { 'creature': 1, 'cell': 1 },
            exhausts: true,
            effect: (state, me, { targetCreatureId, targetCell }) => {
                console.log({ targetCreatureId, targetCell });
            },
            text: 'Teleport a target creature to a target cell'
        }],
        keywords: {},
    },
'Cave Troll': 
    {
        type: 'creature',
        subtypes: ['troll'],
        cost: 5,
        hpMax: 5,
        attack: 3,
        energy: 0,
        abilities: [{
            trigger: 'activated',
            cost: 3,
            exhausts: true,
            effect: (state, me, { targetCreatureId }) => {
                const targets = adjacentEnnemies(state, { ...me.pos, hero: me.controller })
                _.forEach(targets, (c) => {
                    damageCreature(state, { creatureId: c.id, damage: me.attack })
                })                
            },
            text: 'Deal Cave Troll\'s attack damage to all adjacent ennemies'
        }, {
            trigger: 'startPlayerTurn',
            effect: (state, me) => {
                const regenValue = Math.min(3, me.hpMax - me.hp)
                addEnergy(state, { creatureId: me.id, value: regenValue })
                heal(state, { creatureId: me.id, value: 3 })
            },
            text: 'Regenerate: 3. When Cave Troll regenerates, gain 1E per HP regenerated.'
        }],
        keywords: { },
    },
'Dwarven Inn': 
    {
        type: 'creature',
        subtypes: ['structure'],
        cost: 2,
        hpMax: 6,
        attack: 0,
        energy: 3,
        abilities: [{
            trigger: 'startPlayerTurn',
            effect: (state, me) => {
                const targets = adjacentAllies(state, { ...me.pos, hero: me.controller })
                _.forEach(targets, (c) => {
                    addEnergy(state, { creatureId: c.id, value: 1 })
                })
            },
            text: 'Start of your turn: +1E to all adjacent allies.'
        }, {
            trigger: 'activated',
            cost: 3,
            targetType: 'creature',
            targetFilter: (c) => { return c.subtypes.indexOf('dwarf') !== -1 },
            effect: (state, me, { targetCreatureId }) => {
                const modifier = { type: 'attack', value: 3, until: 'eot' }
                addModifier(state, { creatureId: targetCreatureId, modifier })
            },
            text: 'Target dwarf gains +3 ATK until EOT'
        }],
        keywords: { static: true, pacific: true, airdrop: true },
    },
'Thirsty Dwarf': 
    {
        type: 'creature',
        subtypes: ['dwarf'],
        cost: 1,
        hpMax: 3,
        attack: 3,
        energy: 3,
        abilities: [{
            trigger: 'startPlayerTurn',
            effect: (state, me) => {
                addEnergy(state, { creatureId: me.id, value: -1 })
                if (me.energy <= 0) {
                    destroyCreature(state, { creatureId: me.id })
                }
            },
            text: 'Loses 1E at the start of your turn. If 0E, dies.'
        }],
        keywords: {},
    },
'Lightining Bolt': 
    {
        type: 'spell',
        cost: 1,
        targetType: 'creature',
        effect: (state, { targetCreatureId }) => {
            damageCreature(state, { creatureId: targetCreatureId, damage: 3 })
        },
        text: 'Deal 3 HP damage to target creature'
    },
'Bzzzt': 
    {
        type: 'spell',
        cost: 0,
        targetType: 'creature',
        effect: (state, { targetCreatureId }) => {
            damageCreature(state, { creatureId: targetCreatureId, damage: 1000 })
        },
        text: 'Deal 1000 HP damage to target creature'
    },
}

const all = _.merge(cards, mobs)

export default all