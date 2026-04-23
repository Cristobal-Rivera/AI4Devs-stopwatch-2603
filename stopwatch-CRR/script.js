(() => {
  // --- State ---
  let startTime   = 0;   // performance.now() snapshot when last started
  let accumulated = 0;   // ms accumulated before the current run
  let rafId       = null;
  let running     = false;
  let lapCount    = 0;

  // --- DOM refs ---
  const elHH      = document.getElementById('hh');
  const elMM      = document.getElementById('mm');
  const elSS      = document.getElementById('ss');
  const elMillis  = document.getElementById('millis');
  const elSep1    = document.getElementById('sep1');
  const elSep2    = document.getElementById('sep2');
  const elDisplay = document.getElementById('display');
  const btnStart  = document.getElementById('btnStart');
  const btnClear  = document.getElementById('btnClear');
  const elLaps    = document.getElementById('laps');

  // --- Render ---
  function pad2(n) { return String(Math.floor(n)).padStart(2, '0'); }
  function pad3(n) { return String(Math.floor(n)).padStart(3, '0'); }

  function render(ms) {
    const totalSec = Math.floor(ms / 1000);
    const hh  = Math.floor(totalSec / 3600);
    const mm  = Math.floor((totalSec % 3600) / 60);
    const ss  = totalSec % 60;
    const mil = ms % 1000;

    elHH.textContent    = pad2(hh);
    elMM.textContent    = pad2(mm);
    elSS.textContent    = pad2(ss);
    elMillis.textContent = pad3(mil);
  }

  // --- RAF loop ---
  function tick() {
    const elapsed = accumulated + (performance.now() - startTime);
    render(elapsed);
    rafId = requestAnimationFrame(tick);
  }

  // --- Controls ---
  function start() {
    startTime = performance.now();
    running   = true;

    elDisplay.classList.add('running');
    elSep1.classList.remove('paused');
    elSep2.classList.remove('paused');
    btnStart.textContent = 'Pause';
    btnStart.classList.remove('paused');

    rafId = requestAnimationFrame(tick);
  }

  function pause() {
    cancelAnimationFrame(rafId);
    accumulated += performance.now() - startTime;
    running = false;

    elDisplay.classList.remove('running');
    elSep1.classList.add('paused');
    elSep2.classList.add('paused');
    btnStart.textContent = 'Resume';
    btnStart.classList.add('paused');

    // Snapshot a lap
    lapCount++;
    addLap(lapCount, accumulated);
  }

  function clear() {
    cancelAnimationFrame(rafId);
    accumulated = 0;
    running     = false;
    lapCount    = 0;

    render(0);
    elDisplay.classList.remove('running');
    elSep1.classList.remove('paused');
    elSep2.classList.remove('paused');
    btnStart.textContent = 'Start';
    btnStart.classList.remove('paused');
    elLaps.innerHTML = '';
  }

  function addLap(n, ms) {
    const totalSec = Math.floor(ms / 1000);
    const hh  = Math.floor(totalSec / 3600);
    const mm  = Math.floor((totalSec % 3600) / 60);
    const ss  = totalSec % 60;
    const mil = ms % 1000;
    const formatted = `${pad2(hh)}:${pad2(mm)}:${pad2(ss)}.${pad3(mil)}`;

    const item = document.createElement('div');
    item.className = 'lap-item';
    item.innerHTML = `<span class="lap-n">LAP ${String(n).padStart(2,'0')}</span><span class="lap-t">${formatted}</span>`;
    elLaps.prepend(item);
  }

  // --- Events ---
  btnStart.addEventListener('click', () => {
    running ? pause() : start();
  });

  btnClear.addEventListener('click', clear);

  // Initial render
  render(0);
})();
