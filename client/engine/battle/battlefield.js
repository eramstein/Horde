export const isCellOccupied = function(state, { row, column }) {
  return creatureAtCell(state, { row, column }) ? true : false
}

export const creatureAtCell = function(state, { row, column }) {
  const creatures = _.filter(state.creatures, (c) => {
    return c.pos.row === row && c.pos.column === column
  });
  return creatures.length > 0 ? creatures[0] : null
}

