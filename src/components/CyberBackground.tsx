import { useEffect, useState } from "react";

import Particles, { initParticlesEngine } from "@tsparticles/react";

import { loadSlim } from "@tsparticles/slim";

import type { Engine } from "@tsparticles/engine";

export default function CyberBackground() {
  const [particlesInitialized, setParticlesInitialized] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine: Engine) => {
      await loadSlim(engine);
    }).then(() => {
      setParticlesInitialized(true);
    });
  }, []);

  if (!particlesInitialized) {
    return null;
  }

  return (
    <Particles
      id="tsparticles"
      className="fixed inset-0 -z-10"
      options={{
        background: {
          color: {
            value: "#0f172a",
          },
        },

        fpsLimit: 60,

        particles: {
          number: {
            value: 60,
            density: {
              enable: true,
            },
          },

          color: {
            value: "#00f5d4",
          },

          links: {
            enable: true,
            color: "#00f5d4",
            distance: 150,
            opacity: 0.2,
            width: 1,
          },

          move: {
            enable: true,
            speed: 1,
          },

          opacity: {
            value: 0.3,
          },

          size: {
            value: {
              min: 1,
              max: 3,
            },
          },
        },

        detectRetina: true,
      }}
    />
  );
}