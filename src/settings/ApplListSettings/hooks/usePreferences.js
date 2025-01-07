import localforage from 'localforage';

export default () => {
  const setPreference = async (name, value) => {
    await localforage.setItem(name, value);
  };

  const getPreference = async (name) => {
    await localforage.getItem(name);
  };

  return {
    setPreference,
    getPreference,
  };
};
