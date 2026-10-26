/* ====================================================================
   SYSTEM & UTILITY FUNCTIONS
   ==================================================================== */

const btnContrast = document.getElementById('btn-contrast');
btnContrast?.addEventListener('click', () => {
    document.body.classList.toggle('high-contrast');
    const isHC = document.body.classList.contains('high-contrast');
    showToast(isHC ? 'Modo Alto Contraste Ativado' : 'Modo Padrão Ativado', 'info');
});

const btnMobileMenu = document.getElementById('btn-mobile-menu');
const mobileMenu = document.getElementById('mobile-menu');
btnMobileMenu?.addEventListener('click', () => {
    mobileMenu?.classList.toggle('hidden');
});

function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    const icon = type === 'success' ? 'fa-circle-check text-emerald-400' : 'fa-circle-info text-blue-400';

    toast.className = `pointer-events-auto bg-slate-900 border border-slate-700/80 text-slate-200 px-4 py-3 rounded-2xl text-xs font-semibold shadow-2xl flex items-center space-x-3 transition-all duration-300 opacity-0 transform translate-y-2`;
    toast.innerHTML = `<i class="fas ${icon} text-base"></i><span>${message}</span>`;

    container.appendChild(toast);

    requestAnimationFrame(() => toast.classList.remove('opacity-0', 'translate-y-2'));

    setTimeout(() => {
        toast.classList.add('opacity-0', 'translate-y-2');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

async function copyText(text, successMsg) {
    try {
        if (navigator.clipboard?.writeText) {
            await navigator.clipboard.writeText(text);
        } else {
            const textarea = document.createElement('textarea');
            textarea.value = text;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
        }
        showToast(successMsg);
    } catch (e) {
        showToast('Erro ao copiar texto', 'info');
    }
}

function filterApiMethods() {
    const query = document.getElementById('api-search')?.value.toLowerCase() || '';
    const items = document.querySelectorAll('.api-item');
    items.forEach(item => {
        item.style.display = item.textContent.toLowerCase().includes(query) ? 'block' : 'none';
    });
}

function toggleFaq(btn) {
    const content = btn.nextElementSibling;
    const icon = btn.querySelector('.fa-chevron-down');
    if (!content || !icon) return;
    const isHidden = content.classList.toggle('hidden');
    icon.style.transform = isHidden ? 'rotate(0deg)' : 'rotate(180deg)';
}

function downloadResource(filename) {
    showToast(`Iniciando download de ${filename}`, 'info');
}

/* ====================================================================
   LESSON MODALS DATA & ACTIONS
   ==================================================================== */

const lessonData = {
    matematica: {
        title: "Módulo Matemática: Geometria de Rotação",
        tag: "Anos Finais • 6º ao 8º Ano",
        color: "emerald",
        summary: "Os alunos utilizam rotações dos motores e tempo para compreender o conceito de ângulos internos/externos.",
        bncc: "EF06MA18, EF07MA22",
        duration: "2 Aulas de 50 minutos",
        code: `import jacarev3 as jv\n\nbase = jv.Base()\nmotor_b = jv.Motor('B')\n\n# Desenhando um pentágono regular\nfor i in range(5):\n    base.mover(30, 1)\n    motor_b.girar_por_tempo(30, 0.38)`
    }
};

function openLessonModal(key) {
    const data = lessonData[key];
    if (!data) return;
    const modal = document.getElementById('lesson-modal');
    const content = document.getElementById('lesson-modal-content');
    if (!modal || !content) return;

    content.innerHTML = `
        <div class="inline-block px-3 py-1 rounded-full bg-${data.color}-500/10 text-${data.color}-400 text-xs font-mono font-bold mb-3 border border-${data.color}-500/20">
            ${data.tag}
        </div>
        <h3 class="text-2xl font-bold text-white mb-4">${data.title}</h3>
        <p class="text-slate-300 text-sm leading-relaxed mb-6">${data.summary}</p>
        
        <div class="mb-6">
            <span class="text-xs font-mono text-slate-400 block mb-2">CÓDIGO-BASE:</span>
            <pre class="bg-slate-950 p-4 rounded-xl font-mono text-xs text-emerald-300 overflow-x-auto border border-slate-800"><code>${data.code}</code></pre>
        </div>

        <div class="flex justify-end gap-3">
            <button onclick="closeLessonModal()" class="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl transition">Fechar</button>
            <button onclick="closeLessonModal(); document.getElementById('simulador')?.scrollIntoView({behavior: 'smooth'});" class="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold rounded-xl transition">Testar no Simulador</button>
        </div>
    `;
    modal.classList.remove('hidden');
}

function closeLessonModal() {
    document.getElementById('lesson-modal')?.classList.add('hidden');
}

/* ====================================================================
   AUDIO SYNTHESIZER
   ==================================================================== */

let globalAudioCtx = null;
function getAudioContext() {
    if (!globalAudioCtx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) globalAudioCtx = new AudioCtx();
    }
    if (globalAudioCtx && globalAudioCtx.state === 'suspended') globalAudioCtx.resume();
    return globalAudioCtx;
}

function playBeep(freq = 440, durationMs = 300) {
    try {
        const ctx = getAudioContext();
        if (!ctx) return;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + (durationMs / 1000));
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + (durationMs / 1000));
    } catch (e) {
        console.warn('Áudio não suportado.');
    }
}

/* ====================================================================
   THREE.JS 3D SIMULATOR LOGIC & CODE RUNNER (OTIMIZADO)
   ==================================================================== */

const PRESETS = {
    mover_frente: `import jacarev3 as jv

base = jv.Base()
som = jv.Som()

# O robô avança com 50% de velocidade por 2 segundos
base.mover(50, 2)

# Emite um bipe para avisar que chegou ao destino
som.apitar(523, 300)
`,

    quadrado: `import jacarev3 as jv

base = jv.Base()
motor_b = jv.Motor('B')
som = jv.Som()

# Usamos um laço de repetição para desenhar os 4 lados
for lado in range(4):
    base.mover(40, 1)                  # 1. Avança a reta
    motor_b.girar_por_tempo(50, 0.67)  # 2. Gira 90 graus perfeitos

# Comemora o fim do trajeto
som.apitar(880, 500)
`,

    desviar: `import jacarev3 as jv

base = jv.Base()
motor_b = jv.Motor('B')
som = jv.Som()

# 1. O robô começa a se aproximar do obstáculo vermelho
base.mover(40, 1.5)

# 2. Simulamos a lógica do sensor de distância (se estiver menor que 20cm)
distancia = 15 

if distancia < 20:
    # Alerta sonoro de perigo!
    som.apitar(440, 200)
    som.apitar(440, 200)
    
    # Gira para desviar e foge pelo novo caminho
    motor_b.girar_por_tempo(40, 0.8)
    base.mover(40, 2)
`,

    musica: `import jacarev3 as jv

som = jv.Som()
base = jv.Base()

# Toca uma pequena melodia musical (Notas: Dó, Mi, Sol)
som.apitar(523, 200)
som.apitar(659, 200)
som.apitar(784, 400)

# O robô faz uma "dança" para a frente e para trás
base.mover(30, 0.5)
base.mover(-30, 0.5)
base.mover(30, 0.5)
`
};

const editorArea = document.getElementById('code-editor');
if (editorArea) editorArea.value = PRESETS.mover_frente;

function applyPresetCode(key) {
    if (PRESETS[key] && editorArea) {
        editorArea.value = PRESETS[key];
        showToast("Roteiro carregado!");
    }
}

function loadChallengeIntoSim(key) {
    const selector = document.getElementById('preset-selector');
    if (selector) selector.value = key;
    applyPresetCode(key);
    document.getElementById('simulador')?.scrollIntoView({ behavior: 'smooth' });
}

function logConsole(text, colorClass = 'text-emerald-300') {
    const consoleDiv = document.getElementById('sim-console');
    if (!consoleDiv) return;
    const line = document.createElement('div');
    line.className = colorClass;
    line.textContent = `> ${text}`;
    consoleDiv.appendChild(line);
    consoleDiv.scrollTop = consoleDiv.scrollHeight;
}

function clearConsoleLog() {
    const consoleDiv = document.getElementById('sim-console');
    if (consoleDiv) consoleDiv.innerHTML = '';
}

// Global Three.js Engine Variables
let scene, camera, renderer, controls;
let robotGroup, obstacleMesh, ledMesh;
let trailLine, trailGeometry;
const MAX_TRAIL_POINTS = 2000;
const trailPositionsArray = new Float32Array(MAX_TRAIL_POINTS * 3);
let trailCount = 0;

let robotRotation = 0;
let isSimulating = false;
let currentAbortController = null;
let distDisplayEl = null;

function init3DSimulator() {
    const canvas = document.getElementById('sim-canvas');
    if (!canvas) return;
    const container = canvas.parentElement;
    distDisplayEl = document.getElementById('dist-display');

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x020617);
    scene.fog = new THREE.FogExp2(0x020617, 0.08);

    camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 100);
    camera.position.set(2.5, 3.5, 3.5);

    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight, false);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;

    if (typeof THREE.OrbitControls !== 'undefined') {
        controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.maxPolarAngle = Math.PI / 2 - 0.05;
        controls.minDistance = 2;
        controls.maxDistance = 15;
    } else {
        camera.lookAt(0, 0, 0);
    }

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    const dirLight = new THREE.DirectionalLight(0x34d399, 1.2);
    dirLight.position.set(4, 8, 4);
    dirLight.castShadow = true;
    scene.add(dirLight);

    const gridHelper = new THREE.GridHelper(8, 16, 0x10b981, 0x1e293b);
    scene.add(gridHelper);

    const planeGeo = new THREE.PlaneGeometry(8, 8);
    const planeMat = new THREE.MeshStandardMaterial({ color: 0x020617, roughness: 0.9 });
    const groundMesh = new THREE.Mesh(planeGeo, planeMat);
    groundMesh.rotation.x = -Math.PI / 2;
    groundMesh.receiveShadow = true;
    scene.add(groundMesh);

    // Robot Group
    robotGroup = new THREE.Group();
    const bodyGeo = new THREE.BoxGeometry(0.5, 0.25, 0.6);
    const bodyMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.3 });
    const bodyMesh = new THREE.Mesh(bodyGeo, bodyMat);
    bodyMesh.position.y = 0.125;
    bodyMesh.castShadow = true;
    robotGroup.add(bodyMesh);

    const ledGeo = new THREE.BoxGeometry(0.1, 0.02, 0.05);
    const ledMat = new THREE.MeshStandardMaterial({ color: 0x334155, emissive: 0x000000 });
    ledMesh = new THREE.Mesh(ledGeo, ledMat);
    ledMesh.position.set(0, 0.251, 0.15);
    robotGroup.add(ledMesh);

    const wheelGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.08, 24);
    const wheelMat = new THREE.MeshStandardMaterial({ color: 0x0f172a });
    const wheelLeft = new THREE.Mesh(wheelGeo, wheelMat);
    wheelLeft.rotation.z = Math.PI / 2;
    wheelLeft.position.set(-0.28, 0.12, 0);
    robotGroup.add(wheelLeft);
    
    const wheelRight = wheelLeft.clone();
    wheelRight.position.set(0.28, 0.12, 0);
    robotGroup.add(wheelRight);

    scene.add(robotGroup);

    // Obstacle
    const obsGeo = new THREE.BoxGeometry(0.6, 0.5, 0.6);
    const obsMat = new THREE.MeshStandardMaterial({ color: 0xf43f5e });
    obstacleMesh = new THREE.Mesh(obsGeo, obsMat);
    obstacleMesh.position.set(0, 0.25, -1.8);
    scene.add(obstacleMesh);

    // Trail
    trailGeometry = new THREE.BufferGeometry();
    trailGeometry.setAttribute('position', new THREE.BufferAttribute(trailPositionsArray, 3));
    trailGeometry.setDrawRange(0, 0); 
    const trailMat = new THREE.LineBasicMaterial({ color: 0x34d399, linewidth: 2 });
    trailLine = new THREE.Line(trailGeometry, trailMat);
    scene.add(trailLine);

    const resizeObserver = new ResizeObserver(entries => {
        for (let entry of entries) {
            if (entry.contentRect.width > 0) {
                camera.aspect = entry.contentRect.width / entry.contentRect.height;
                camera.updateProjectionMatrix();
                renderer.setSize(entry.contentRect.width, entry.contentRect.height, false);
            }
        }
    });
    resizeObserver.observe(container);

    function animate() {
        requestAnimationFrame(animate);
        if (controls) controls.update();
        if (distDisplayEl && robotGroup && obstacleMesh) {
            const dist = Math.round(robotGroup.position.distanceTo(obstacleMesh.position) * 100);
            distDisplayEl.textContent = `${Math.max(5, dist)} cm`;
        }
        renderer.render(scene, camera);
    }
    animate();
}

function resetSimulation() {
    if (currentAbortController) {
        currentAbortController.abort();
        currentAbortController = null;
    }
    isSimulating = false;
    robotGroup.position.set(0, 0, 0);
    robotGroup.rotation.set(0, 0, 0);
    robotRotation = 0;
    if (ledMesh) ledMesh.material.emissive.setHex(0x000000);
    clearTrail();
    
    const statusText = document.getElementById('sim-status-text');
    if (statusText) {
        statusText.textContent = "Robô Pronto";
        statusText.className = "text-emerald-400";
    }
}

function clearTrail() {
    trailCount = 0;
    trailGeometry.setDrawRange(0, 0);
}

function addTrailPoint(pos) {
    if (trailCount >= MAX_TRAIL_POINTS) return; 
    const index = trailCount * 3;
    trailPositionsArray[index] = pos.x;
    trailPositionsArray[index + 1] = pos.y + 0.02; 
    trailPositionsArray[index + 2] = pos.z;
    trailGeometry.attributes.position.needsUpdate = true;
    trailCount++;
    trailGeometry.setDrawRange(0, trailCount);
}

/* ====================================================================
   NATIVE PYODIDE INTEGRATION (PYTHON REAL NO NAVEGADOR)
   ==================================================================== */

let pyodideInstance = null;

// Funções expostas no escopo global para o Python chamar
window.simAnimarMovimento = function(speed, durationMs) {
    return animateMoveForward(speed, durationMs, currentAbortController?.signal);
};
window.simAnimarGiro = function(speed, durationMs) {
    return animateTurn(speed, durationMs, currentAbortController?.signal);
};
window.simTocarApito = function(freq, durationMs) {
    playBeep(freq, durationMs);
    return new Promise(r => setTimeout(r, durationMs));
};
window.simLog = function(msg, colorClass) {
    logConsole(msg, colorClass);
};
window.simLerSensor = function() {
    if (!robotGroup || !obstacleMesh) return 255;
    return Math.round(robotGroup.position.distanceTo(obstacleMesh.position) * 100);
};

// Inicia o motor WebAssembly Python
async function initPyodideEnvironment() {
    logConsole("[Sistema] Inicializando motor Python (Pyodide)...", "text-blue-400");
    try {
        // Carrega o Pyodide via CDN (assegure-se de ter o script do Pyodide no seu HTML)
        pyodideInstance = await loadPyodide();
        
        // Criando a biblioteca Virtual jacarev3 no FileSystem do Pyodide
        const vfsCode = `
import os
os.makedirs('/home/pyodide/jacarev3', exist_ok=True)

with open('/home/pyodide/jacarev3/__init__.py', 'w') as f:
    f.write("from .base import Base\\nfrom .motor import Motor\\nfrom .som import Som")

with open('/home/pyodide/jacarev3/base.py', 'w') as f:
    f.write("""
import js
import asyncio

class Base:
    async def mover(self, vel, tempo_s):
        js.simLog(f"Base: Mover vel={vel}% tempo={tempo_s}s", "text-emerald-300")
        await js.simAnimarMovimento(vel, int(tempo_s * 1000))
        
    async def executar_com_acessibilidade(self, texto, func):
        js.simLog(f"[Acessibilidade] {texto}", "text-cyan-300")
        await js.simTocarApito(600, 150)
        # Se func for uma rotina assíncrona gerada dinamicamente
        import inspect
        if inspect.iscoroutinefunction(func):
            await func()
        else:
            res = func()
            if inspect.isawaitable(res):
                await res
""")

with open('/home/pyodide/jacarev3/motor.py', 'w') as f:
    f.write("""
import js
class Motor:
    def __init__(self, porta):
        self.porta = porta
    async def girar_por_tempo(self, vel, tempo_s):
        js.simLog(f"Motor {self.porta}: Girar vel={vel}% tempo={tempo_s}s", "text-emerald-300")
        await js.simAnimarGiro(vel, int(tempo_s * 1000))
""")

with open('/home/pyodide/jacarev3/som.py', 'w') as f:
    f.write("""
import js
class Som:
    async def apitar(self, freq, dur_ms):
        js.simLog(f"Som: Apitar {freq}Hz por {dur_ms}ms", "text-purple-300")
        await js.simTocarApito(freq, dur_ms)
""")
`;
        await pyodideInstance.runPythonAsync(vfsCode);
        logConsole("[Sistema] Motor Python 100% Pronto!", "text-emerald-400 font-bold");
    } catch (e) {
        logConsole(`Erro ao carregar Python: ${e.message}`, "text-red-500");
    }
}

// Injeção dinâmica de Await para código síncrono padrão do utilizador
function autoInjectAwait(code) {
    const lines = code.split('\n');

    return lines.map(line => {
        // Ignora comentários e imports
        if (line.trim().startsWith('#') || line.trim().startsWith('import') || line.trim().startsWith('from')) {
            return line;
        }

        // Converte chamadas lambdas para blocos async (Workaround Pyodide)
        if (line.includes('lambda:')) {
            return line.replace(/lambda:\s*(.*)/, 'async def _temp_lambda():\n        await $1\n    _temp_lambda()');
        }

        // Verifica chamadas conhecidas da biblioteca e adiciona await
        if (line.match(/\b(?:mover|girar_por_tempo|apitar|executar_com_acessibilidade)\s*\(/)) {
            if (!line.includes('await ')) {
                // Preserva a indentação original
                const indent = line.match(/^\s*/)[0];
                const content = line.trim();
                return `${indent}await ${content}`;
            }
        }
        return line;
    }).join('\n');
}

async function runSimulation() {
    if (isSimulating) return;
    if (!pyodideInstance) {
        logConsole("Aguarde, motor Python carregando...", "text-yellow-400");
        return;
    }

    if (currentAbortController) currentAbortController.abort();
    currentAbortController = new AbortController();
    
    isSimulating = true;
    clearConsoleLog();
    logConsole("--- Iniciando Execução nativa jacarEV3 ---", "text-emerald-400 font-bold");
    
    const statusText = document.getElementById('sim-status-text');
    if (statusText) {
        statusText.textContent = "Executando (Pyodide)...";
        statusText.className = "text-teal-400 animate-pulse";
    }

    let rawCode = editorArea?.value || '';
    
    // Converte sintaxe lambda síncrona para def assíncrona na hora da compilação JIT
    if (rawCode.includes("lambda:")) {
        rawCode = rawCode.replace(/lambda:\s*(.*)/g, '(_ for _ in ()).throw(Exception("Use \'async def\' em vez de lambda no WebSimulator"))');
    }

    // Processador interceptor de "await" automático
    const asyncCode = autoInjectAwait(rawCode);

    try {
        await pyodideInstance.runPythonAsync(asyncCode);
        logConsole("--- Execução Concluída ---", "text-emerald-400 font-bold");
        playBeep(880, 200);
        if (statusText) {
            statusText.textContent = "Robô Concluído";
            statusText.className = "text-emerald-400";
        }
    } catch (err) {
        if (err.message.includes("AbortError") || err.message.includes("Interrompida")) {
            logConsole("[Sistema] Simulação parada pelo usuário.", "text-yellow-400");
        } else {
            logConsole(`Erro Python: ${err.message.split('File "<exec>"')[1] || err.message}`, 'text-red-400');
        }
    } finally {
        isSimulating = false;
        currentAbortController = null;
    }
}

function animateMoveForward(speed, duration, signal) {
    return new Promise((resolve, reject) => {
        const startTime = performance.now();
        const startPos = robotGroup.position.clone();
        const dir = new THREE.Vector3(0, 0, -1).applyAxisAngle(new THREE.Vector3(0, 1, 0), robotRotation);
        const distance = (speed / 100) * (duration / 1000) * 1.2;

        function step(now) {
            if (signal?.aborted) return reject(new Error("Simulação Interrompida."));
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            robotGroup.position.copy(startPos).addScaledVector(dir, distance * progress);
            addTrailPoint(robotGroup.position);

            if (progress < 1) requestAnimationFrame(step);
            else resolve();
        }
        requestAnimationFrame(step);
    });
}

function animateTurn(speed, duration, signal) {
    return new Promise((resolve, reject) => {
        const startTime = performance.now();
        const startRot = robotRotation;
        const angle = (speed / 100) * (duration / 1000) * Math.PI * 1.5;

        function step(now) {
            if (signal?.aborted) return reject(new Error("Simulação Interrompida."));
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            robotRotation = startRot + angle * progress;
            robotGroup.rotation.y = robotRotation;

            if (progress < 1) requestAnimationFrame(step);
            else resolve();
        }
        requestAnimationFrame(step);
    });
}

window.addEventListener('DOMContentLoaded', () => {
    init3DSimulator();
    initPyodideEnvironment(); // Chama o carregamento do Pyodide assim que a tela abre
});