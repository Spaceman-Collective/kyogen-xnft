import { AtomEffect } from "recoil";

export const localStorageEffect: <T>(key: string) => AtomEffect<T> =
  (key) =>
  ({ setSelf, onSet }) => {
    if (typeof window === "undefined") {
      // noop when not on browser
      return;
    }
    const savedValue = window.localStorage.getItem(key);
    if (savedValue != null) {
      setSelf(JSON.parse(savedValue));
    }

    onSet((newValue, _, isReset) => {
      isReset
        ? window.localStorage.removeItem(key)
        : window.localStorage.setItem(key, JSON.stringify(newValue));
    });
  };
