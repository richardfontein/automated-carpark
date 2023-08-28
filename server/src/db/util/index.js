/**
 * Takes an array of Sequelize models (source) and an array of (updated) objects
 * and returns the deltas
 * @param  {Array<Model>}   source      An array of sequelize source models
 * @param  {Array<Object>}  updated     An array of objects to be updated
 * @param  {String}         key="id"    An key to differentiate deltas
 */
// eslint-disable-next-line import/prefer-default-export
export function getDelta(source, updated, key = 'id') {
  const added = updated.filter(
    updatedItem => source.find(sourceItem => sourceItem[key] === updatedItem[key]) === undefined,
  );
  const changed = source.filter(
    sourceItem => updated.find(updatedItem => updatedItem[key] === sourceItem[key]) !== undefined,
  );
  const deleted = source.filter(
    sourceItem => updated.find(updatedItem => updatedItem[key] === sourceItem[key]) === undefined,
  );

  return { added, changed, deleted };
}
