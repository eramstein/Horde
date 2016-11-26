export const isCellOccupied = function(state, { row, column }) {
  return creatureAtCell(state, { row, column }) ? true : false
}

export const creatureAtCell = function(state, { row, column }) {
  const creatures = _.filter(state.creatures, (c) => {
    return c.pos.row === row && c.pos.column === column
  });
  return creatures.length > 0 ? creatures[0] : null
}

export const adjacentCreatures = function(state, { row, column }) {
  return _.filter(state.creatures, (c) => {
    return c.pos.row === row && c.pos.column === column + 1
      || c.pos.row === row && c.pos.column === column - 1
      || c.pos.column === column && c.pos.row === row + 1
      || c.pos.column === column && c.pos.row === row - 1
  })
}

export const adjacentAllies = function(state, { row, column, hero }) {
  return adjacentCreatures(state, { row, column })
    .filter((c) => c.controller === hero)
}

