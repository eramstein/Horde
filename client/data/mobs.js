import { adjacentCreatures, adjacentAllies } from '../engine/battle/battlefield'
import { addModifier, damage as damageCreature } from '../engine/battle/creature'
import abilities from './abilities'

const mobs = {
'Goblin': 
    {
        type: 'creature',
        subtypes: ['goblin'],
        cost: 1,
        hpMax: 3,
        energy: 0,
        attack: 1,
        abilities: [],
        keywords: {},
        behaviours: { stupid: true }
    },
'Wolf': 
    {
        type: 'creature',
        subtypes: ['animal'],
        cost: 3,
        hpMax: 3,
        energy: 0,
        attack: 3,
        abilities: [],
        keywords: {},
        behaviours: { stupid: true }
    },
'Bear': 
    {
        type: 'creature',
        subtypes: ['animal'],
        cost: 5,
        hpMax: 8,
        energy: 0,
        attack: 3,
        abilities: [],
        keywords: {},
        behaviours: { stupid: true }
    },
'The Black Knight': 
    {
        type: 'creature',
        subtypes: ['human', 'knight'],
        cost: 10,
        hpMax: 10,
        energy: 0,
        attack: 2,
        abilities: [],
        keywords: {},
        behaviours: { stupid: true }
    },
}

export default mobs