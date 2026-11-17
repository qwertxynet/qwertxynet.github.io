import { createContext, useContext, useEffect, useState } from 'react';
import { sfx } from '../audio/sfx';
import { local } from '../storage';

const SoundCtx = createContext({ soundOn: false, setSoundOn: () => {} });

export function SoundProvider({ children }) {
  const [soundOn, setSoundOn] = useState(() => local.get('qx-sound') === '1');

  useEffect(() => {
    sfx.setEnabled(soundOn);
    local.set('qx-sound', soundOn ? '1' : '0');
  }, [soundOn]);

  // One delegated listener gives every button and link a click + hover sound.
  useEffect(() => {
    const target = (e) => e.target instanceof Element && e.target.closest('a, button, [role="tab"], input[type="range"]');
    const onDown = (e) => {
      const el = target(e);
      if (el && !el.hasAttribute('data-silent')) sfx.click();
    };
    const onOver = (e) => {
      const el = target(e);
      if (el && !el.hasAttribute('data-silent') && !el.contains(e.relatedTarget)) sfx.hover();
    };
    document.addEventListener('pointerdown', onDown);
    document.addEventListener('pointerover', onOver);
    return () => {
      document.removeEventListener('pointerdown', onDown);
      document.removeEventListener('pointerover', onOver);
    };
  }, []);

  return <SoundCtx.Provider value={{ soundOn, setSoundOn }}>{children}</SoundCtx.Provider>;
}

export const useSound = () => useContext(SoundCtx);
