/**
 * VIGILANTE TERMINAL - Interactive Engine (Batman x Hacker Theme)
 * Inherited from Stitch AI Design System Tokens
 */

(function () {
  'use strict';

  // =========================================================================
  // AUDIO SYNTHESIZER (Tactical Web Audio API)
  // =========================================================================
  let audioCtx = null;
  let audioEnabled = true;

  function initAudio() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        audioCtx = new AudioContext();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  function playTone(freq, type = 'sine', duration = 0.08, gainVal = 0.05) {
    if (!audioEnabled || !audioCtx) return;
    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gain.gain.setValueAtTime(gainVal, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
      // Audio context might be restricted before user gesture
    }
  }

  function soundClick() {
    initAudio();
    playTone(850, 'triangle', 0.04, 0.04);
  }

  function soundBeep() {
    initAudio();
    playTone(1200, 'sine', 0.08, 0.06);
  }

  function soundSuccess() {
    initAudio();
    if (!audioCtx) return;
    playTone(600, 'sine', 0.06, 0.04);
    setTimeout(() => playTone(900, 'sine', 0.08, 0.05), 60);
  }

  function soundError() {
    initAudio();
    playTone(220, 'sawtooth', 0.15, 0.07);
  }

  function soundBatSignal() {
    initAudio();
    if (!audioCtx) return;
    playTone(320, 'sine', 0.3, 0.08);
    setTimeout(() => playTone(640, 'triangle', 0.25, 0.06), 120);
  }

  // Audio Toggle UI
  const btnToggleAudio = document.getElementById('btn-toggle-audio');
  const iconSoundOn = document.getElementById('icon-sound-on');
  const iconSoundOff = document.getElementById('icon-sound-off');

  if (btnToggleAudio) {
    btnToggleAudio.addEventListener('click', () => {
      initAudio();
      audioEnabled = !audioEnabled;
      if (audioEnabled) {
        iconSoundOn.style.display = 'block';
        iconSoundOff.style.display = 'none';
        btnToggleAudio.classList.add('active');
        soundBeep();
      } else {
        iconSoundOn.style.display = 'none';
        iconSoundOff.style.display = 'block';
        btnToggleAudio.classList.remove('active');
      }
    });
  }

  // Bind clicks to tactical SFX
  document.addEventListener('click', (e) => {
    if (e.target.closest('a, button, .terminal-shortcut-btn, .redacted')) {
      soundClick();
    }
  });

  // =========================================================================
  // INTERACTIVE BAT-SIGNAL CANVAS
  // =========================================================================
  const canvas = document.getElementById('bat-signal-canvas');
  let ctx = null;
  let batSignalActive = true;
  let mouseX = window.innerWidth * 0.75;
  let mouseY = window.innerHeight * 0.35;
  let targetX = mouseX;
  let targetY = mouseY;

  if (canvas) {
    ctx = canvas.getContext('2d');
    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

  // Custom Tactical Cursor Tracker
  const tacticalCursor = document.getElementById('tactical-cursor');
  let cursorVisible = false;

  window.addEventListener('mousemove', (e) => {
    targetX = e.clientX;
    targetY = e.clientY;

    if (tacticalCursor) {
      tacticalCursor.style.left = `${e.clientX}px`;
      tacticalCursor.style.top = `${e.clientY}px`;
      if (!cursorVisible) {
        tacticalCursor.style.opacity = '1';
        cursorVisible = true;
      }
    }
  });

  document.addEventListener('mouseleave', () => {
    if (tacticalCursor) {
      tacticalCursor.style.opacity = '0';
      cursorVisible = false;
    }
  });

  // Interactive hover expansion for cursor
  document.addEventListener('mouseover', (e) => {
    if (e.target.closest('a, button, input, select, textarea, .chamfer-card, .btn, .terminal-shortcut-btn, .redacted')) {
      document.body.classList.add('cursor-hover');
    } else {
      document.body.classList.remove('cursor-hover');
    }
  });

    const emblemImg = new Image();
    emblemImg.src = 'assets/vigilante-emblem.png';

    function drawBatInsignia(cx, cy, scale) {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.scale(scale, scale);

      if (emblemImg.complete && emblemImg.naturalWidth !== 0) {
        ctx.shadowColor = 'rgba(225, 6, 0, 0.95)';
        ctx.shadowBlur = 24;
        ctx.drawImage(emblemImg, -45, -45, 90, 90);
      } else {
        ctx.beginPath();
        // Sharp Batman Emblem Fallback Path
        ctx.moveTo(0, -25);
        ctx.lineTo(12, -2);
        ctx.lineTo(28, -15);
        ctx.lineTo(22, 10);
        ctx.lineTo(45, 5);
        ctx.lineTo(30, 25);
        ctx.lineTo(0, 28);
        ctx.lineTo(-30, 25);
        ctx.lineTo(-45, 5);
        ctx.lineTo(-22, 10);
        ctx.lineTo(-28, -15);
        ctx.lineTo(-12, -2);
        ctx.closePath();

        ctx.fillStyle = '#060202';
        ctx.shadowColor = 'rgba(225, 6, 0, 0.9)';
        ctx.shadowBlur = 20;
        ctx.fill();

        ctx.lineWidth = 2;
        ctx.strokeStyle = '#e10600';
        ctx.stroke();
      }

      ctx.restore();
    }

    function renderBatSignal() {
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (batSignalActive) {
        // Smooth interpolation towards mouse target
        mouseX += (targetX - mouseX) * 0.05;
        mouseY += (targetY - mouseY) * 0.05;

        const originX = canvas.width * 0.95;
        const originY = 0;

        // Spotlight Cone
        const gradient = ctx.createRadialGradient(
          mouseX, mouseY, 10,
          mouseX, mouseY, 280
        );
        gradient.addColorStop(0, 'rgba(225, 6, 0, 0.35)');
        gradient.addColorStop(0.3, 'rgba(225, 6, 0, 0.18)');
        gradient.addColorStop(0.7, 'rgba(142, 29, 24, 0.05)');
        gradient.addColorStop(1, 'transparent');

        // Draw Searchlight Beam
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(originX, originY);
        ctx.lineTo(mouseX - 180, mouseY + 60);
        ctx.lineTo(mouseX + 180, mouseY - 60);
        ctx.closePath();
        const beamGrad = ctx.createLinearGradient(originX, originY, mouseX, mouseY);
        beamGrad.addColorStop(0, 'rgba(225, 6, 0, 0.25)');
        beamGrad.addColorStop(1, 'rgba(225, 6, 0, 0.02)');
        ctx.fillStyle = beamGrad;
        ctx.fill();
        ctx.restore();

        // Draw Spotlight Oval
        ctx.save();
        ctx.beginPath();
        ctx.ellipse(mouseX, mouseY, 190, 130, -Math.PI / 12, 0, 2 * Math.PI);
        ctx.fillStyle = gradient;
        ctx.fill();
        ctx.restore();

        // Draw Bat Emblem in center of spotlight
        drawBatInsignia(mouseX, mouseY, 1.4);
      }

      requestAnimationFrame(renderBatSignal);
    }
    requestAnimationFrame(renderBatSignal);
  }

  // Bat-Signal Toggle UI
  const btnToggleBatSignal = document.getElementById('btn-toggle-batsignal');
  if (btnToggleBatSignal) {
    btnToggleBatSignal.addEventListener('click', () => {
      batSignalActive = !batSignalActive;
      btnToggleBatSignal.classList.toggle('active', batSignalActive);
      document.body.classList.toggle('batsignal-off', !batSignalActive);
      soundBatSignal();
    });
  }

  // =========================================================================
  // REAL-TIME CLOCK & SIMULATED TELEMETRY
  // =========================================================================
  const hudClock = document.getElementById('hud-clock');
  const hudValGrid = document.getElementById('hud-val-grid');
  const hudValProxies = document.getElementById('hud-val-proxies');

  function updateClock() {
    if (hudClock) {
      const now = new Date();
      const utcString = now.toISOString().substring(11, 19) + ' UTC';
      hudClock.textContent = utcString;
    }
  }
  setInterval(updateClock, 1000);
  updateClock();

  // Fluctuate telemetry values subtly
  setInterval(() => {
    if (hudValGrid) {
      const randomLoad = (38 + Math.random() * 8).toFixed(1);
      hudValGrid.textContent = randomLoad + '%';
    }
    if (hudValProxies) {
      const randomNodes = Math.floor(10 + Math.random() * 5);
      hudValProxies.textContent = randomNodes + ' NODE';
    }
  }, 3500);

  // =========================================================================
  // TYPEWRITER EFFECT (Hero Briefing)
  // =========================================================================
  const typewriterElement = document.getElementById('hero-typewriter');
  const typingPhrases = [
    '> Initializing secure node for Operator: MANJIT GOLCONDA...',
    '> "B.Tech Cyber Security student specializing in VAPT, Ethical Hacking & Network Defense."',
    '> "Conducting authorized penetration testing, vulnerability assessment & security research."',
    '> "Building robust secure web architectures, civic AI safety platforms & automated scanners."',
    '> "Eliminate attack surfaces. Audit vulnerabilities. Enforce zero-trust defense."'
  ];

  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 40;

  function typeWriterLoop() {
    if (!typewriterElement) return;

    const currentPhrase = typingPhrases[phraseIndex];

    if (isDeleting) {
      typewriterElement.textContent = currentPhrase.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 20;
    } else {
      typewriterElement.textContent = currentPhrase.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 35 + Math.random() * 20;
    }

    if (!isDeleting && charIndex === currentPhrase.length) {
      typingSpeed = 2500; // Pause at end of sentence
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % typingPhrases.length;
      typingSpeed = 400;
    }

    setTimeout(typeWriterLoop, typingSpeed);
  }
  setTimeout(typeWriterLoop, 500);

  // =========================================================================
  // TEXT SCRAMBLE / MATRIX DECODER EFFECT
  // =========================================================================
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';

  function scrambleText(element) {
    const originalText = element.dataset.scramble || element.innerText;
    let iteration = 0;
    const interval = setInterval(() => {
      element.innerText = originalText
        .split('')
        .map((char, index) => {
          if (index < iteration) {
            return originalText[index];
          }
          if (char === ' ') return ' ';
          return letters[Math.floor(Math.random() * letters.length)];
        })
        .join('');

      if (iteration >= originalText.length) {
        clearInterval(interval);
      }
      iteration += 1 / 2;
    }, 25);
  }

  const glitchElements = document.querySelectorAll('.title-glitch');
  glitchElements.forEach((el) => {
    el.addEventListener('mouseenter', () => scrambleText(el));
  });


  // =========================================================================
  // PROJECT DETAILS MODAL & SCHEMATICS
  // =========================================================================
  const projectData = {
    saferoute: {
      code: 'OPERATION // SAFE_ROUTE_HYD',
      status: '[MAJOR PROJECT // ACTIVE]',
      title: 'SAFE ROUTE HYDERABAD: CIVIC AI SAFETY PLATFORM',
      body: `
        A safety-aware navigation and intelligence system tailored specifically for Hyderabad, comparing shortest and safest routes.
        Integrates crime incident heatmaps, poorly-lit area overlays, police station coordinate markers, live browser geolocation, and community reporting.
        Designed entirely with client-side analysis and LocalStorage data caching, eliminating reliance on paid proprietary API infrastructure.
      `,
      specs: `
STACK:        HTML5, CSS3, JavaScript (ES6+), Leaflet.js, OSRM Routing Engine
GEOSPATIAL:   Custom GeoJSON boundary layers, Leaflet Heatmap Plugin
STORAGE:      Client-side LocalStorage for dynamic incident report ingestion
ARCHITECTURE: Zero-paid API overhead, optimized for high client responsiveness
      `
    },
    msme: {
      code: 'OPERATION // MSME_CONNECT',
      status: '[MSME HACKATHON 5.0 // TEAM PROJECT]',
      title: 'MSME CONNECT: HYPERLOCAL B2B MARKETPLACE',
      body: `
        A hyperlocal verified marketplace platform built for the MSME Idea Hackathon 5.0 to connect verified local businesses with commercial opportunities.
        Features AI-powered business recommendation matchmaking, secure JWT token authentication, and instant QR-enabled digital business cards.
      `,
      specs: `
FRONTEND:     React.js, Tailwind CSS, Responsive Mobile-First Architecture
BACKEND:      Node.js, Express.js RESTful API Microservices
AUTH:         JSON Web Tokens (JWT) with secure HTTP-only cookies & Bcrypt
FEATURES:     AI Vendor Matchmaking, QR Code Digital Identity Profiles
      `
    },
    pentestlab: {
      code: 'OPERATION // INTERNAL_VAPT_LAB',
      status: '[RESEARCH SUITE // AUDITED]',
      title: 'INTERNAL PENETRATION TESTING LAB & PROTOCOL ANALYSIS',
      body: `
        An isolated cybersecurity testing environment dedicated to executing controlled adversary simulations, port auditing, vulnerability scanning, and protocol dissections.
        Evaluates legacy protocol vulnerabilities including ARP spoofing and DNS poisoning scenarios in authorized research sandboxes.
      `,
      specs: `
OPERATING OS: Kali Linux 2024 / Hardened Debian Environment
SCANNING:     Nmap (OS fingerprinting, NSE scripts), OpenVAS (CVE analysis)
WEB AUDIT:    OWASP ZAP (Intercepting proxy), SQLMap (Automated injection)
TRAFFIC:      Wireshark, tcpdump packet analysis & ARP/DNS poisoning simulation
      `
    },
    maltego: {
      code: 'OPERATION // EMAIL_OSINT_FORENSICS',
      status: '[COMPLETED // FORENSIC RECORD]',
      title: 'MALICIOUS EMAIL INVESTIGATION & OSINT WITH MALTEGO',
      body: `
        Forensic investigation pipeline analyzing malicious email artifacts, phishing headers, spoofed sender infrastructure, and domain link associations using Maltego entity transforms and custom Python parsers.
      `,
      specs: `
FORENSICS:    RFC 822 Email Header Dissection, SPF/DKIM/DMARC Verification
OSINT ENGINE: Maltego Entity Transforms & Domain Graph Analysis
AUTOMATION:   Python scripts for payload string extraction & IOC tagging
DELIVERABLE:  Detailed Threat Intelligence Incident Attribution Report
      `
    }
  };

  const projectModal = document.getElementById('project-modal');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalActionClose = document.getElementById('modal-action-close');
  const modalProjectCode = document.getElementById('modal-project-code');
  const modalProjectStatus = document.getElementById('modal-project-status');
  const modalProjectTitle = document.getElementById('modal-project-title');
  const modalProjectBody = document.getElementById('modal-project-body');
  const modalProjectSpecs = document.getElementById('modal-project-specs');

  function openProjectModal(key) {
    const data = projectData[key];
    if (!data || !projectModal) return;

    modalProjectCode.textContent = data.code;
    modalProjectStatus.textContent = data.status;
    modalProjectTitle.textContent = data.title;
    modalProjectBody.textContent = data.body.trim();
    modalProjectSpecs.textContent = data.specs.trim();

    projectModal.classList.add('active');
    projectModal.setAttribute('aria-hidden', 'false');
    soundBeep();
  }

  function closeProjectModal() {
    if (projectModal) {
      projectModal.classList.remove('active');
      projectModal.setAttribute('aria-hidden', 'true');
    }
  }

  document.querySelectorAll('.btn-inspect-proj').forEach((btn) => {
    btn.addEventListener('click', () => {
      const key = btn.dataset.modal;
      if (key) openProjectModal(key);
    });
  });

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeProjectModal);
  if (modalActionClose) modalActionClose.addEventListener('click', closeProjectModal);
  if (projectModal) {
    projectModal.addEventListener('click', (e) => {
      if (e.target === projectModal) closeProjectModal();
    });
  }

  // =========================================================================
  // ENCRYPTED DISPATCH CONTACT FORM
  // =========================================================================
  const contactForm = document.getElementById('contact-form');
  const encStatus = document.getElementById('encryption-status');
  const encStatusText = document.getElementById('encryption-status-text');
  const btnSubmitDispatch = document.getElementById('btn-submit-dispatch');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      initAudio();
      soundBeep();

      if (encStatus && encStatusText && btnSubmitDispatch) {
        encStatus.style.display = 'block';
        btnSubmitDispatch.disabled = true;
        btnSubmitDispatch.innerHTML = `<span>[ TRANSMITTING CIPHER... ]</span>`;

        const steps = [
          'GENERATING EPHEMERAL AES-256 SESSION KEY...',
          'ENCRYPTING TRANSMISSION PAYLOAD WITH PGP PUBLIC KEY...',
          'SIGNING PACKET WITH SHA3-512 CHECKSUM...',
          'ROUTING VIA GOTHAM ONION RELAY (4 HOPS)...',
          'DISPATCH CONFIRMED: TRANSMISSION LOGGED & SECURED.'
        ];

        let stepIndex = 0;
        const cipherInterval = setInterval(() => {
          if (stepIndex < steps.length) {
            encStatusText.textContent = steps[stepIndex];
            soundClick();
            stepIndex++;
          } else {
            clearInterval(cipherInterval);
            soundSuccess();
            encStatusText.style.color = '#52ff83';
            btnSubmitDispatch.innerHTML = `<span>[ DISPATCH TRANSMITTED // SUCCESS ]</span>`;
            btnSubmitDispatch.style.background = '#00873a';
            contactForm.reset();

            setTimeout(() => {
              btnSubmitDispatch.disabled = false;
              btnSubmitDispatch.innerHTML = `<span>[ TRANSMIT ENCRYPTED DISPATCH ]</span>`;
              btnSubmitDispatch.style.background = '';
              encStatus.style.display = 'none';
              encStatusText.style.color = '';
            }, 6000);
          }
        }, 650);
      }
    });
  }

  // PGP Key Copy Button
  const btnCopyPgp = document.getElementById('btn-copy-pgp');
  const pgpKeyContent = document.getElementById('pgp-key-content');

  if (btnCopyPgp && pgpKeyContent) {
    btnCopyPgp.addEventListener('click', () => {
      const keyText = pgpKeyContent.textContent.trim();
      navigator.clipboard.writeText(keyText).then(() => {
        const originalText = btnCopyPgp.textContent;
        btnCopyPgp.textContent = '[COPIED TO CLIPBOARD]';
        btnCopyPgp.style.borderColor = 'var(--primary-container)';
        soundSuccess();
        setTimeout(() => {
          btnCopyPgp.textContent = originalText;
          btnCopyPgp.style.borderColor = '';
        }, 2500);
      });
    });
  }

  // =========================================================================
  // MOBILE NAVIGATION & ACTIVE NAV HIGHLIGHTING
  // =========================================================================
  const mobileNavBtn = document.getElementById('mobile-nav-btn');
  const navMenu = document.getElementById('nav-menu');

  if (mobileNavBtn && navMenu) {
    mobileNavBtn.addEventListener('click', () => {
      navMenu.classList.toggle('open');
      soundClick();
    });

    document.querySelectorAll('.nav-link').forEach((link) => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
      });
    });
  }

  // Active section scroll spy
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 180;
      if (window.pageYOffset >= sectionTop) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove('active');
      if (link.dataset.nav === current) {
        link.classList.add('active');
      }
    });
  });

  // =========================================================================
  // PORTRAIT REVEAL INTERACTION (Dual-Layer Masked -> Unmasked Toggle)
  // =========================================================================
  const portraitViewport = document.getElementById('portrait-viewport');
  const portraitStatusDot = document.getElementById('portrait-status-dot');
  const portraitStatusHeader = document.getElementById('portrait-status-header');
  const portraitStatusStamp = document.getElementById('portrait-status-stamp');
  const portraitValStatus = document.getElementById('portrait-val-status');
  const portraitCue = document.getElementById('portrait-interaction-cue');

  function setPortraitRevealed(isRevealed) {
    if (portraitStatusDot) {
      portraitStatusDot.style.background = isRevealed ? '#52ff83' : 'var(--primary-container)';
      portraitStatusDot.style.boxShadow = isRevealed ? '0 0 10px #52ff83' : '0 0 8px var(--primary-container)';
    }
    if (portraitStatusHeader) {
      portraitStatusHeader.textContent = isRevealed ? 'DECLASSIFIED // MANJIT GOLCONDA' : 'TACTICAL DOSSIER // SUBJECT PROFILE';
    }
    if (portraitStatusStamp) {
      portraitStatusStamp.textContent = isRevealed ? '[UNMASKED]' : '[ENCRYPTED]';
      portraitStatusStamp.className = isRevealed ? 'status-stamp stamp-cyan' : 'status-stamp';
    }
    if (portraitValStatus) {
      portraitValStatus.textContent = isRevealed ? 'UNMASKED // VERIFIED' : 'MASKED // SECURE';
      portraitValStatus.style.color = isRevealed ? '#52ff83' : 'var(--primary)';
    }
    if (portraitCue) {
      const cueText = portraitCue.querySelector('.cue-text');
      if (cueText) {
        cueText.textContent = isRevealed ? '[ IDENTITY DECLASSIFIED ]' : '[ HOVER / TAP TO UNMASK ]';
      }
    }
  }

  if (portraitViewport) {
    let isHovering = false;
    const spotlightBeam = document.getElementById('spotlight-beam-polygon');
    const spotlightMaskHole = document.getElementById('spotlight-mask-hole');
    const spotlightConeGrad = document.getElementById('spotlight-cone-grad');

    function updateSpotlight(x, y, rect) {
      portraitViewport.style.setProperty('--spotlight-x', `${x}px`);
      portraitViewport.style.setProperty('--spotlight-y', `${y}px`);

      if (spotlightBeam && rect) {
        const originX = rect.width - 8;
        const originY = 8;
        const dx = x - originX;
        const dy = y - originY;
        const dist = Math.hypot(dx, dy);

        if (dist > 5) {
          const px = -dy / dist;
          const py = dx / dist;
          const beamSpread = 95;

          const p1x = originX.toFixed(1);
          const p1y = originY.toFixed(1);
          const p2x = (x + px * beamSpread).toFixed(1);
          const p2y = (y + py * beamSpread).toFixed(1);
          const p3x = (x - px * beamSpread).toFixed(1);
          const p3y = (y - py * beamSpread).toFixed(1);

          spotlightBeam.setAttribute('points', `${p1x},${p1y} ${p2x},${p2y} ${p3x},${p3y}`);

          if (spotlightMaskHole) {
            spotlightMaskHole.setAttribute('cx', x);
            spotlightMaskHole.setAttribute('cy', y);
            spotlightMaskHole.setAttribute('r', '96');
          }

          if (spotlightConeGrad) {
            spotlightConeGrad.setAttribute('x1', `${originX}`);
            spotlightConeGrad.setAttribute('y1', `${originY}`);
            spotlightConeGrad.setAttribute('x2', `${x}`);
            spotlightConeGrad.setAttribute('y2', `${y}`);
          }
        }
      }
    }

    portraitViewport.addEventListener('mousemove', (e) => {
      const rect = portraitViewport.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      updateSpotlight(x, y, rect);

      if (!isHovering) {
        isHovering = true;
        portraitViewport.classList.add('is-hovering');
        portraitViewport.style.setProperty('--spotlight-radius', '110px');
        setPortraitRevealed(true);
        soundBeep();
      }
    });

    portraitViewport.addEventListener('mouseleave', () => {
      isHovering = false;
      portraitViewport.classList.remove('is-hovering');
      if (!portraitViewport.classList.contains('full-reveal')) {
        portraitViewport.style.setProperty('--spotlight-radius', '0px');
        setPortraitRevealed(false);
      }
    });

    // Touch / Mobile: Track touch movement directly
    portraitViewport.addEventListener('touchmove', (e) => {
      if (e.touches.length > 0) {
        const rect = portraitViewport.getBoundingClientRect();
        const touch = e.touches[0];
        const x = touch.clientX - rect.left;
        const y = touch.clientY - rect.top;
        updateSpotlight(x, y, rect);
        portraitViewport.classList.add('is-hovering');
        portraitViewport.style.setProperty('--spotlight-radius', '115px');
        setPortraitRevealed(true);
      }
    }, { passive: true });

    // Click: Toggle Full Reveal or Re-mask
    portraitViewport.addEventListener('click', () => {
      const isFull = portraitViewport.classList.toggle('full-reveal');
      if (isFull) {
        setPortraitRevealed(true);
        soundSuccess();
      } else {
        setPortraitRevealed(isHovering);
        soundClick();
      }
    });
  }

})();
