export const createEntity = (() => {
  let id = 0;
  return () => ({ id: id++ });
})();

export const addComponent = (store, entity, component) => ({
  ...store,
  [entity.id]: { ...(store[entity.id] || {}), ...component },
});

export const runSystem = (systemFn, store, input) => systemFn(store, input);
