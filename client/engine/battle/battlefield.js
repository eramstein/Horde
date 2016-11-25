export const getCreaturesAtCell = function(state, { row, column }) {
  const count = _.filter(state.creatures, (c) => {
    return c.pos.row === row && c.pos.column === column
  }).length;
  return count > 0 ? true : false
}
