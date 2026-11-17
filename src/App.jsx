import { useEffect, useState } from 'react';
import { SoundProvider } from './components/Sound';
import Background from './components/Background';
import BootScreen from './components/BootScreen';
import SparkleCursor from './components/SparkleCursor';
import Nav from './components/Nav';
import Hero from './components/Hero';
import Marquee from './components/Marquee';
import Projects from './components/Projects';
import Engineering from './components/Engineering';
import About from './components/About';
import Contact from './components/Contact';
import Footer from './components/Footer';
import MusicPlayer from './components/MusicPlayer';
import { session } from './storage';

function useReveal(active) {
  useEffect(() => {
    if (!active) return;
    const els = document.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window)) {
      els.forEach((el) => el.classList.add('is-in'));
      return;
    }
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('is-in');
            io.unobserve(e.target);
          }
        }),
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [active]);
}

export default function App() {
  const [booted, setBooted] = useState(() => session.get('qx-booted') === '1');
  useReveal(booted);

  return (
    <SoundProvider>
      <Background />
      {!booted && (
        <BootScreen
          onDone={() => {
            session.set('qx-booted', '1');
            setBooted(true);
          }}
        />
      )}
      <div className={`app ${booted ? 'app--in' : ''}`} inert={!booted || undefined}>
        <Nav />
        <main>
          <Hero />
          <Marquee />
          <Projects />
          <Engineering />
          <About />
          <Contact />
        </main>
        <Footer />
      </div>
      {booted && <MusicPlayer />}
      <SparkleCursor />
    </SoundProvider>
  );
}
