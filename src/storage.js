// Storage can throw (private mode, blocked site data). Never let it break the page.
const wrap = (kind) => ({
  get(key) {
    try { return window[kind].getItem(key); } catch { return null; }
  },
  set(key, value) {
    try { window[kind].setItem(key, value); } catch { /* ignore */ }
  },
});

export const local = wrap('localStorage');
export const session = wrap('sessionStorage');
