// --- VARIÁVEIS DE ESTADO ---
let credits = 1550;
let xp = 0;
let level = 1;
const xpPerLevel = 100;

let tutorialActive = false;
let tutorialStep = 0;
let firstSaleDone = false; 
let engineTested = false; 
let engineReady = false;
let oilLevel = 0;
let parts = [];
let draggedPart = null;
let mouseTargetPos = {x:0, y:0};
let speedTick = 0;
let displayKmh = 0;
let tool = 'hand';
let currentLang = 'pt'; 
let tutorialFinished = false; // NOVA VARIÁVEL

const tutOrder = ['block', 'piston', 'crank', 'head', 'pan'];

// --- DICIONÁRIO DE TRADUÇÃO ---
const langData = {
    pt: {
        settingsTitle: "⚙️ CONFIGURAÇÕES",
        accountTitle: "👤 MINHA CONTA",
        langTitle: "🌐 IDIOMA",
        statMoney: "💰 DINHEIRO:",
        statParts: "🔧 PEÇAS:",
        statLvl: "🏆 NÍVEL:",
        btnSave: "💾 SALVAR JOGO",
        btnReset: "⚠️ RESETAR JOGO",
        btnClose: "VOLTAR",
        welcomeTitle: "BEM-VINDO!",
        welcomeDesc: "Deseja ativar o tutorial de montagem?",
        btnYes: "SIM",
        btnNo: "NÃO",
        sureTitle: "TEM CERTEZA?",
        sureDesc: "Você terá que montar o motor sem ajuda.",
        btnConfirm: "SIM, TENHO CERTEZA",
        btnBack: "NÃO, VOLTAR",
        hudWallet: "CARTEIRA:",
        hudLvl: "NÍVEL",
        hudEngine: "MOTOR:",
        hudOil: "ÓLEO:",
        hudSpeed: "VELOCIDADE:",
        shopTitle: "AUTO PEÇAS TORQUE",
        btnExitShop: "SAIR DA LOJA",
        btnShop: "🛒 Loja",
        btnHand: "🖐️ Arrastar",
        btnWrench: "🔧 Chave",
        btnOil: "🛢️ Óleo",
        btnIgn: "🔑 Ignição",
        btnSellPart: "♻️ Vender Peça",
        btnSellEngine: "💰 Vender Motor",
        engineOff: "DESLIGADO",
        engineOn: "LIGADO",
        engineBroken: "QUEBRADO",
        basketText: "DEPOSITE AQUI PARA VENDER",
        tutBuy: "PASSO: Compre o {name} na loja",
        tutDrag: "PASSO: Arraste a peça para a marca vermelha.",
        tutWrench: "PASSO: Use a CHAVE para apertar os parafusos.",
        tutWrenchPart: "PASSO: Aperte TODOS os parafusos do {name}!", // NOVO
        tutOilStep: "PASSO: Use o ÓLEO até 100%!",
        tutTest: "TESTE: Ligue o motor por 5 segundos!",
        tutDone: "MOTOR TESTADO! AGORA PODE VENDER!",
        successTitle: "SUCESSO! VOCÊ AGORA É UM MECÂNICO PROFISSIONAL", // NOVO
        getDiploma: "RECEBER DIPLOMA DE MECÂNICO", // NOVO
        lvlUp: "NÍVEL UP! VOCÊ ESTÁ EVOLUINDO!",
        perfUnlocked: "PEÇAS DE PERFORMANCE LIBERADAS!",
        explosionMsg: "CABOOM! O motor explodiu! Verifique parafusos e óleo!",
        shopLocked: "(VENDA O 1º MOTOR)",
        noMoney: "VOCÊ NÃO TEM BUFUNFA!!"
    },
    en: {
        settingsTitle: "⚙️ SETTINGS",
        accountTitle: "👤 MY ACCOUNT",
        langTitle: "🌐 LANGUAGE",
        statMoney: "💰 MONEY:",
        statParts: "🔧 PARTS:",
        statLvl: "🏆 LEVEL:",
        btnSave: "💾 SAVE GAME",
        btnReset: "⚠️ RESET GAME",
        btnClose: "BACK",
        welcomeTitle: "WELCOME!",
        welcomeDesc: "Would you like to activate the assembly tutorial?",
        btnYes: "YES",
        btnNo: "NO",
        sureTitle: "ARE YOU SURE?",
        sureDesc: "You will have to assemble the engine without help.",
        btnConfirm: "YES, I'M SURE",
        btnBack: "NO, GO BACK",
        hudWallet: "WALLET:",
        hudLvl: "LEVEL",
        hudEngine: "ENGINE:",
        hudOil: "OIL:",
        hudSpeed: "SPEED:",
        shopTitle: "TORQUE AUTO PARTS",
        btnExitShop: "EXIT SHOP",
        btnShop: "🛒 Shop",
        btnHand: "🖐️ Drag",
        btnWrench: "🔧 Wrench",
        btnOil: "🛢️ Oil",
        btnIgn: "🔑 Ignition",
        btnSellPart: "♻️ Sell Part",
        btnSellEngine: "💰 Sell Engine",
        engineOff: "OFFLINE",
        engineOn: "ONLINE",
        engineBroken: "BROKEN",
        basketText: "DROP HERE TO SELL",
        tutBuy: "STEP: Buy the {name} at the shop",
        tutDrag: "STEP: Drag the part to the red mark.",
        tutWrench: "STEP: Use the WRENCH to tighten bolts.",
        tutWrenchPart: "STEP: Tighten ALL bolts of the {name}!", // NOVO
        tutOilStep: "STEP: Use OIL until 100%!",
        tutTest: "TEST: Start engine for 5 seconds!",
        tutDone: "ENGINE TESTED! NOW YOU CAN SELL!",
        successTitle: "SUCCESS! YOU ARE NOW A PROFESSIONAL MECHANIC", // NOVO
        getDiploma: "GET MECHANIC DIPLOMA", // NOVO
        lvlUp: "LEVEL UP! YOU ARE EVOLVING!",
        perfUnlocked: "PERFORMANCE PARTS UNLOCKED!",
        explosionMsg: "CABOOM! Engine exploded! Check bolts and oil!",
        shopLocked: "(SELL 1ST ENGINE)",
        noMoney: "YOU DON'T HAVE THE MONEY!!"
    }
};

// --- FUNÇÕES DO DIPLOMA (ATUALIZADAS COM CSS EMBUTIDO) ---
function showDiploma() {
    playSynthSound('money');
    const l = langData[currentLang];
    const div = document.createElement('div');
    div.id = "modal-diploma";
    
    // Estilização para garantir que apareça no centro da tela
    Object.assign(div.style, {
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: '10000'
    });

    div.innerHTML = `
        <div class="diploma-content" style="
            background: #1a1a1a; 
            padding: 40px; 
            border: 5px solid gold; 
            border-radius: 20px; 
            text-align: center;
            box-shadow: 0 0 50px rgba(255, 215, 0, 0.4);
            max-width: 80%;
        ">
            <h1 style="font-size: 80px; margin: 0;">📜</h1>
            <h2 style="color: gold; font-family: sans-serif; margin: 20px 0;">${l.successTitle}</h2>
            <button class="control-btn" style="background: gold; color: black; padding: 15px 30px; cursor:pointer; font-weight: bold; border: none; border-radius: 5px; font-size: 18px;" onclick="closeDiploma()">
                ${l.getDiploma}
            </button>
        </div>
    `;
    document.body.appendChild(div);
}

function closeDiploma() {
    const d = document.getElementById('modal-diploma');
    if(d) d.remove();
    tutorialActive = false;
    const tutMsg = document.getElementById('tutorial-msg');
    if(tutMsg) tutMsg.style.display = 'none';
}

// --- FUNÇÃO DE TRADUÇÃO DA UI ---
function applyLanguage() {
    const l = langData[currentLang];
    document.getElementById('txt-settings-title').innerText = l.settingsTitle;
    document.getElementById('txt-account-title').innerText = l.accountTitle;
    document.getElementById('txt-lang-title').innerText = l.langTitle;
    document.getElementById('txt-stat-money').innerText = l.statMoney;
    document.getElementById('txt-stat-parts').innerText = l.statParts;
    document.getElementById('txt-stat-lvl').innerText = l.statLvl;
    document.getElementById('txt-btn-save').innerText = l.btnSave;
    document.getElementById('txt-btn-reset').innerText = l.btnReset;
    document.getElementById('txt-btn-close').innerText = l.btnClose;
    document.getElementById('txt-welcome-title').innerText = l.welcomeTitle;
    document.getElementById('txt-welcome-desc').innerText = l.welcomeDesc;
    document.getElementById('txt-btn-yes').innerText = l.btnYes;
    document.getElementById('txt-btn-no').innerText = l.btnNo;
    document.getElementById('txt-sure-title').innerText = l.sureTitle;
    document.getElementById('txt-sure-desc').innerText = l.sureDesc;
    document.getElementById('txt-btn-confirm').innerText = l.btnConfirm;
    document.getElementById('txt-btn-back').innerText = l.btnBack;
    document.getElementById('txt-hud-wallet').innerText = l.hudWallet;
    document.getElementById('txt-hud-lvl').innerText = l.hudLvl;
    document.getElementById('txt-hud-engine').innerText = l.hudEngine;
    document.getElementById('txt-hud-oil').innerText = l.hudOil;
    document.getElementById('txt-hud-speed').innerText = l.hudSpeed;
    document.getElementById('txt-shop-title').innerText = l.shopTitle;
    document.getElementById('txt-btn-exit-shop').innerText = l.btnExitShop;
    document.getElementById('txt-btn-shop').innerText = l.btnShop;
    document.getElementById('txt-btn-hand').innerText = l.btnHand;
    document.getElementById('txt-btn-wrench').innerText = l.btnWrench;
    document.getElementById('txt-btn-oil').innerText = l.btnOil;
    document.getElementById('txt-btn-ign').innerText = l.btnIgn;
    document.getElementById('txt-btn-sellpart').innerText = l.btnSellPart;
    document.getElementById('txt-btn-sellengine').innerText = l.btnSellEngine;
    
    const statusEl = document.getElementById('engine-status');
    if (!engineReady && statusEl.innerText !== l.engineBroken) {
        statusEl.innerText = l.engineOff;
        statusEl.className = "offline";
    } else if (engineReady) {
        statusEl.innerText = l.engineOn;
        statusEl.className = "online";
    }

    updateTut();
    renderShop();
    checkEngineStatus();
}

function setLanguage(lang) {
    currentLang = lang;
    applyLanguage();
    saveGame();
}

// --- ATUALIZAÇÃO DA INTERFACE ---
function updateUI() {
    document.getElementById('credits-label').innerText = credits;
    document.getElementById('oil-counter').innerText = oilLevel + " / 100%";
    document.getElementById('lvl-label').innerText = level;
    let progress = (xp / xpPerLevel) * 100;
    document.getElementById('xp-fill').style.width = progress + "%";
}

function toggleSettings() {
    const modal = document.getElementById('modal-settings');
    if(modal.style.display === 'flex') {
        modal.style.display = 'none';
    } else {
        document.getElementById('acc-money').innerText = '$' + credits;
        document.getElementById('acc-parts').innerText = parts.length;
        document.getElementById('acc-lvl').innerText = level;
        modal.style.display = 'flex';
    }
}

function saveGame() {
    const gameState = {
        credits: credits, xp: xp, level: level,
        firstSaleDone: firstSaleDone, oilLevel: oilLevel,
        engineTested: engineTested, currentLang: currentLang,
        parts: parts.map(p => ({
            id: p.id, x: p.x, y: p.y, vx: p.vx, vy: p.vy, 
            bolts: p.bolts, installed: p.installed
        }))
    };
    localStorage.setItem('torque2d_save', JSON.stringify(gameState));
}

function loadGame() {
    const saved = localStorage.getItem('torque2d_save');
    if (saved) {
        const state = JSON.parse(saved);
        credits = state.credits;
        xp = state.xp || 0;
        level = state.level || 1;
        firstSaleDone = state.firstSaleDone;
        oilLevel = state.oilLevel;
        engineTested = state.engineTested || false;
        currentLang = state.currentLang || 'pt';
        parts = state.parts.map(savedPart => {
            const template = shopCatalog.find(i => i.id === savedPart.id);
            return { ...template, ...savedPart };
        });
        updateUI();
        applyLanguage();
        document.getElementById('modal-welcome').style.display = 'none';
        checkEngineStatus();
    }
}

function resetGame() {
    const msg = currentLang === 'pt' ? "Deseja apagar todo seu progresso?" : "Delete all progress?";
    if(confirm(msg)) {
        localStorage.removeItem('torque2d_save');
        location.reload();
    }
}

function updateTut(customMsg = null) {
    if(!tutorialActive && !customMsg) return;
    const msg = document.getElementById('tutorial-msg');
    const l = langData[currentLang];
    msg.style.display = 'block';

    if(customMsg) {
        msg.innerText = customMsg;
        msg.style.background = "#ff4444";
        setTimeout(() => { 
            msg.style.background = "var(--neon-blue)"; 
            if(!tutorialActive) msg.style.display = "none";
            else updateTut();
        }, 3000);
        return;
    }

    const currentPartId = tutOrder[tutorialStep];
    const shopItem = shopCatalog.find(p=>p.id===currentPartId);
    const installedPart = parts.find(p => p.id === currentPartId);

    // 1. COMPRA
    if (tutorialStep < tutOrder.length && !installedPart) {
        msg.innerText = l.tutBuy.replace("{name}", shopItem ? shopItem.name : "");
    } 
    // 2. MONTAGEM (SOLTA)
    else if (installedPart && !installedPart.installed) {
        msg.innerText = l.tutDrag;
    } 
    // 3. APERTO DE PARAFUSOS (CORREÇÃO: SÓ AVANÇA SE APERTAR TUDO)
    else if (installedPart && installedPart.installed && installedPart.bolts < installedPart.maxBolts) {
        msg.innerText = l.tutWrenchPart.replace("{name}", shopItem.name);
    }
    // 4. PRÓXIMO PASSO (SÓ ENTRA AQUI SE A PEÇA ATUAL ESTIVER INSTALADA E APERTADA)
    else if (tutorialStep < tutOrder.length - 1) {
        tutorialStep++;
        updateTut();
    }
    // 5. ÓLEO
    else if (oilLevel < 100) {
        msg.innerText = l.tutOilStep;
    } 
    // 6. TESTE
    else if (!engineTested) {
        msg.innerText = l.tutTest;
    } 
    // 7. FINALIZAÇÃO
    else {
        if(!tutorialFinished) {
            showDiploma();
            tutorialFinished = true;
        }
        msg.innerText = l.tutDone;
        setTimeout(()=> { if(tutorialActive) msg.style.display='none'; }, 8000);
    }
}

// --- ÁUDIO ---
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
function playSynthSound(type) {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    osc.connect(gainNode); gainNode.connect(audioCtx.destination);
    const now = audioCtx.currentTime;
    switch (type) {
        case 'grab': osc.type = 'sine'; osc.frequency.setValueAtTime(400, now); gainNode.gain.setValueAtTime(0.1, now); osc.start(now); osc.stop(now + 0.06); break;
        case 'install': osc.type = 'triangle'; osc.frequency.setValueAtTime(200, now); gainNode.gain.setValueAtTime(0.15, now); osc.start(now); osc.stop(now + 0.2); break;
        case 'wrench': 
            osc.type = 'square'; osc.frequency.setValueAtTime(1200, now); gainNode.gain.setValueAtTime(0.05, now);
            osc.frequency.exponentialRampToValueAtTime(100, now + 0.05); osc.start(now); osc.stop(now + 0.05); break;
        case 'oil': osc.type = 'sine'; osc.frequency.setValueAtTime(300, now); gainNode.gain.setValueAtTime(0.1, now); osc.start(now); osc.stop(now + 0.2); break;
        case 'money': osc.type = 'sine'; osc.frequency.setValueAtTime(900, now); gainNode.gain.setValueAtTime(0.1, now); osc.start(now); osc.stop(now + 0.1); break;
        case 'explosion': 
            osc.type = 'sawtooth'; osc.frequency.setValueAtTime(150, now); gainNode.gain.setValueAtTime(0.3, now);
            osc.frequency.exponentialRampToValueAtTime(40, now + 0.5); gainNode.gain.linearRampToValueAtTime(0, now + 0.5);
            osc.start(now); osc.stop(now + 0.5); break;
    }
}

const motorRealAudio = new Audio('car-engine.mp3');
motorRealAudio.loop = false;
motorRealAudio.volume = 0.2;

motorRealAudio.onended = () => {
    engineReady = false;
    displayKmh = 0;
    document.getElementById('kmh-label').innerText = "0";
    const statusEl = document.getElementById('engine-status');
    statusEl.innerText = langData[currentLang].engineOff;
    statusEl.className = "offline";
    checkEngineStatus();
};

const canvas = document.getElementById('c'), ctx = canvas.getContext('2d');
const GRAVITY = 0.5, FRICTION = 0.92, FLOOR_LEVEL = 580, MOUSE_PULL_STRENGTH = 0.15;
const standPos = { x: 450, y: 250 };

const basketImg = new Image();
basketImg.src = 'cesta venda.png';
const basketRect = { x: 40, y: 390, w: 320, h: 220 }; 

const shopCatalog = [
    { id: 'block', name: 'BLOCO', price: 500, w: 180, h: 140, tx: standPos.x - 90, ty: standPos.y - 65, req: null, maxBolts: 4, speedPlus: 0, imgSrc: 'bloco do motor.png', essential: true },
    { id: 'piston', name: 'PISTÃO', price: 150, w: 60, h: 80, tx: standPos.x - 30, ty: standPos.y - 30, req: 'block', maxBolts: 2, speedPlus: 5, imgSrc: 'pistão.png', essential: true },
    { id: 'crank', name: 'VIRAQUIM', price: 300, w: 160, h: 45, tx: standPos.x - 80, ty: standPos.y + 40, req: 'piston', maxBolts: 2, speedPlus: 0, imgSrc: 'virabrequin.png', essential: true },
    { id: 'head', name: 'CABEÇOTE', price: 400, w: 180, h: 70, tx: standPos.x - 90, ty: standPos.y - 120, req: 'crank', maxBolts: 4, speedPlus: 0, imgSrc: 'cabecote.png', essential: true },
    { id: 'pan', name: 'CÁRTER', price: 200, w: 160, h: 50, tx: standPos.x - 80, ty: standPos.y + 80, req: 'crank', maxBolts: 4, speedPlus: 0, imgSrc: 'carter.png', essential: true },
    { id: 'turbo', name: 'KIT TURBO', price: 600, w: 100, h: 100, tx: standPos.x + 80, ty: standPos.y - 80, req: 'head', maxBolts: 3, speedPlus: 40, imgSrc: 'turbo.png', essential: false },
    { id: 'filter', name: 'FILTRO ESP.', price: 300, w: 70, h: 70, tx: standPos.x - 160, ty: standPos.y - 85, req: 'head', maxBolts: 1, speedPlus: 10, imgSrc: 'filtro esportivo.png', essential: false },
    { id: 'flywheel', name: 'VOLANTE DO MOTOR', price: 350, w: 140, h: 140, tx: standPos.x - 130, ty: standPos.y + 30, req: 'crank', maxBolts: 6, speedPlus: 10, imgSrc: 'volante do motor.png', essential: false },
    { id: 'wastegate', name: 'WASTEGATE', price: 250, w: 50, h: 60, tx: standPos.x + 110, ty: standPos.y - 110, req: 'turbo', maxBolts: 2, speedPlus: 15, imgSrc: 'Wastegate.png', essential: false }
];

const images = {};
shopCatalog.forEach(p => { images[p.id] = new Image(); images[p.id].src = p.imgSrc; });

function toggleShop() {
    const s = document.getElementById('shop-overlay');
    s.style.display = (s.style.display === 'flex') ? 'none' : 'flex';
    if(s.style.display === 'flex') renderShop();
}

function renderShop() {
    const list = document.getElementById('shop-list');
    list.innerHTML = '';
    const l = langData[currentLang];
    
    shopCatalog.forEach(item => {
        const jaTem = parts.find(p => p.id === item.id);
        const depPart = parts.find(p => p.id === item.req);
        
        // MUDANÇA: Se a primeira venda foi feita, ignora os requisitos (req)
        const reqFaltando = !firstSaleDone && item.req && (!depPart || !depPart.installed);
        
        // MUDANÇA: Agora o "bloqueado" respeita o nível se a primeira venda já ocorreu
        const bloqueado = !firstSaleDone && !item.essential;
        const semGrana = credits < item.price;
        
        let btnStyle = "";
        if (jaTem || bloqueado || reqFaltando) {
            btnStyle = "background: #444; cursor: not-allowed;";
        } else if (semGrana) {
            btnStyle = "background: #ff4444; border-color: #ff0000; box-shadow: 0 0 10px #ff0000; cursor: pointer;";
        }
        
        list.innerHTML += `<div class="shop-item">
            <span style="color:${bloqueado || reqFaltando ? '#555' : 'white'}">${item.name} - $${item.price} ${bloqueado ? l.shopLocked : (reqFaltando ? '(REQ: '+item.req+')' : '')}</span>
            <button 
                style="${btnStyle}"
                onclick="buyPart('${item.id}')" 
                ${jaTem || bloqueado || reqFaltando ? 'disabled' : ''}>
                ${jaTem ? 'OK' : (bloqueado || reqFaltando ? '🔒' : (currentLang === 'pt' ? 'COMPRAR' : 'BUY'))}
            </button>
        </div>`;
    });
}

function buyPart(id) {
    const item = shopCatalog.find(i => i.id === id);
    
    // Bloqueia compra fora de ordem se tutorial ativo
    if(tutorialActive && id !== tutOrder[tutorialStep]) return;

    if (credits < item.price) {
        updateTut(langData[currentLang].noMoney);
        playSynthSound('grab');
        return;
    }

    credits -= item.price; 
    parts.push({ ...item, x: 750 + Math.random()*150, y: -50, vx: 0, vy: 0, bolts: 0, installed: false });
    playSynthSound('install'); 
    renderShop();
    updateTut(); 
    updateUI();
    saveGame();
}

function sellEngine() {
    if (!engineTested) return;
    motorRealAudio.pause(); 
    motorRealAudio.currentTime = 0;
    let value = parts.reduce((acc, p) => acc + p.price, 0);
    let finalSale = Math.floor(value * 1.5);
    credits += finalSale;
    xp += 50;
    if (xp >= xpPerLevel) {
        xp = 0; level++;
        updateTut(langData[currentLang].lvlUp);
        playSynthSound('install');
    }
    if (!firstSaleDone) { firstSaleDone = true; updateTut(langData[currentLang].perfUnlocked); }
    parts = []; engineReady = false; oilLevel = 0; engineTested = false;
    document.getElementById('engine-status').innerText = langData[currentLang].engineOff;
    document.getElementById('engine-status').className = "offline";
    document.getElementById('kmh-label').innerText = "0";
    playSynthSound('money');
    updateUI();
    checkEngineStatus();
    tutorialStep = 0; 
    saveGame();
}

function sellSinglePart() {
    const partInBasket = parts.find(p => !p.installed && 
        p.x + p.w/2 > basketRect.x && p.x + p.w/2 < basketRect.x + basketRect.w &&
        p.y + p.h/2 > basketRect.y && p.y + p.h/2 < basketRect.y + basketRect.h
    );
    if (partInBasket) {
        const sellPrice = Math.floor(partInBasket.price * 0.7);
        credits += sellPrice;
        parts = parts.filter(p => p !== partInBasket);
        playSynthSound('money');
        updateUI();
        checkEngineStatus();
        saveGame();
    }
}

function loop() { updatePhysics(); draw(); requestAnimationFrame(loop); }

function updatePhysics() {
    parts.forEach(p => {
        if (p.installed) return;
        if (p === draggedPart) {
            p.vx += (mouseTargetPos.x - (p.x + p.w / 2)) * MOUSE_PULL_STRENGTH;
            p.vy += (mouseTargetPos.y - (p.y + p.h / 2)) * MOUSE_PULL_STRENGTH;
            p.vx *= 0.8; p.vy *= 0.8;
        } else {
            p.vy += GRAVITY; p.vx *= FRICTION; p.vy *= FRICTION;
            const basketInnerBottom = basketRect.y + basketRect.h - 15;
            const basketInnerLeft = basketRect.x + 20;
            const basketInnerRight = basketRect.x + basketRect.w - 20;
            if (p.x + p.w > basketInnerLeft && p.x < basketInnerRight) {
                if (p.y + p.h > basketInnerBottom && p.y < basketInnerBottom) {
                    p.y = basketInnerBottom - p.h;
                    p.vy = -p.vy * 0.1; p.vx *= 0.7;
                }
            }
            if (p.y + p.h > basketRect.y + 20 && p.y < basketInnerBottom) {
                if (p.x < basketInnerLeft && p.x + p.w > basketInnerLeft) {
                    p.x = basketInnerLeft; p.vx = -p.vx * 0.3;
                }
                if (p.x + p.w > basketInnerRight && p.x < basketInnerRight) {
                    p.x = basketInnerRight - p.w; p.vx = -p.vx * 0.3;
                }
            }
            if (p.y + p.h > FLOOR_LEVEL) { p.y = FLOOR_LEVEL - p.h; p.vy = -p.vy * 0.3; p.vx *= 0.8; }
        }
        p.x += p.vx; p.y += p.vy;
    });

    const somePartInBasket = parts.some(p => !p.installed && 
        p.x + p.w/2 > basketRect.x && p.x + p.w/2 < basketRect.x + basketRect.w &&
        p.y + p.h/2 > basketRect.y && p.y + p.h/2 < basketRect.y + basketRect.h
    );

    if (firstSaleDone && somePartInBasket) {
        document.getElementById('btn-sell-part').style.display = 'flex';
    } else {
        document.getElementById('btn-sell-part').style.display = 'none';
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const next = parts.find(p => !p.installed && (!p.req || parts.find(r => r.id === p.req && r.installed)));
    if (next) {
        const isNear = Math.hypot(next.x - next.tx, next.y - next.ty) < 35; 
        ctx.save();
        ctx.strokeStyle = isNear ? '#00ff00' : '#ff0000';
        ctx.lineWidth = 4; ctx.setLineDash([8, 4]);
        ctx.strokeRect(next.tx, next.ty, next.w, next.h);
        ctx.restore();
    }
    ctx.strokeStyle = 'rgba(0, 234, 255, 0.6)'; ctx.lineWidth = 3; ctx.strokeRect(standPos.x - 90, standPos.y + 130, 180, 20);
    const sortedParts = [...parts].sort((a, b) => {
        if (a === draggedPart) return 1;
        if (b === draggedPart) return -1;
        return (a.installed === b.installed) ? 0 : (a.installed ? -1 : 1);
    });
    sortedParts.forEach(p => {
        ctx.save();
        if (images[p.id].complete) { ctx.drawImage(images[p.id], p.x, p.y, p.w, p.h); } 
        else { ctx.fillStyle = '#444'; ctx.fillRect(p.x, p.y, p.w, p.h); }
        if (p === draggedPart) { ctx.strokeStyle = '#fff'; ctx.lineWidth = 4; ctx.strokeRect(p.x, p.y, p.w, p.h); } 
        else {
            ctx.strokeStyle = p.installed ? (p.bolts === p.maxBolts ? '#00ff00' : '#ff8c00') : '#222';
            ctx.lineWidth = 2; ctx.strokeRect(p.x, p.y, p.w, p.h);
        }
        ctx.fillStyle = 'white'; ctx.font = 'bold 12px sans-serif'; ctx.textAlign = 'center';
        ctx.fillText(p.name, p.x + p.w / 2, p.y - 10);
        if(p.installed) {
            for(let i=1; i<=p.maxBolts; i++) {
                ctx.beginPath(); ctx.arc(p.x + (p.w/(p.maxBolts+1)*i), p.y + p.h - 10, 5, 0, Math.PI*2);
                ctx.fillStyle = i <= p.bolts ? '#00ff00' : '#444'; ctx.fill();
            }
        }
        ctx.restore();
    });

    // MUDANÇA: A cestinha só aparece se o jogador já tiver vendido pelo menos um motor
    const temPecaSolta = parts.some(p => !p.installed);
    if (firstSaleDone && temPecaSolta) {
        if (basketImg.complete) {
            ctx.drawImage(basketImg, basketRect.x, basketRect.y, basketRect.w, basketRect.h);
        }
        ctx.fillStyle = '#ff00ff'; 
        ctx.font = 'bold 14px sans-serif'; 
        ctx.textAlign = 'center';
        ctx.fillText(langData[currentLang].basketText, basketRect.x + basketRect.w/2, basketRect.y - 10);
    }

    if(engineReady) {
        speedTick++;
        if(speedTick >= 10) {
            let bonus = parts.filter(p => p.installed).reduce((acc, p) => acc + p.speedPlus, 0);
            displayKmh = Math.floor((60 + bonus) + (Math.random() * 2) - 1);
            speedTick = 0;
            document.getElementById('kmh-label').innerText = displayKmh;
        }
    } else {
        displayKmh = 0;
    }
}

// EVENTOS DE MOUSE E TOOLS
canvas.addEventListener('mousedown', (e) => {
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left, my = e.clientY - rect.top;
    
    if (tool === 'hand') {
        draggedPart = [...parts].reverse().find(p => !p.installed && mx > p.x && mx < p.x + p.w && my > p.y && my < p.y + p.h);
        if(draggedPart) playSynthSound('grab');
    } else if (tool === 'wrench') {
        parts.forEach(p => {
            if(p.installed && p.bolts < p.maxBolts && mx > p.x && mx < p.x+p.w && my > p.y && my < p.y+p.h) {
                p.bolts++; playSynthSound('wrench'); checkEngineStatus(); updateTut(); saveGame();
            }
        });
    } else if (tool === 'oil') {
        oilLevel = Math.min(oilLevel + 5, 100); playSynthSound('oil');
        updateUI(); checkEngineStatus(); updateTut(); saveGame();
    }
});

canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouseTargetPos = { x: e.clientX - rect.left, y: e.clientY - rect.top };
});

canvas.addEventListener('mouseup', () => {
    if (draggedPart) {
        const dist = Math.hypot(draggedPart.x - draggedPart.tx, draggedPart.y - draggedPart.ty);
        const depPart = parts.find(p => p.id === draggedPart.req);
        
        // MUDANÇA: Se já vendeu o primeiro motor, ignora a necessidade de pré-requisito no encaixe
        const dep = firstSaleDone || !draggedPart.req || (depPart && depPart.installed);
        
        if (dist < 35 && dep) { 
            draggedPart.x = draggedPart.tx; draggedPart.y = draggedPart.ty;
            draggedPart.vx = 0; draggedPart.vy = 0;
            draggedPart.installed = true; playSynthSound('install');
            engineTested = false; updateTut(); saveGame();
        }
        draggedPart = null; checkEngineStatus();
    }
});

function setTool(t) {
    tool = t;
    canvas.classList.remove('tool-hand', 'tool-wrench', 'tool-oil');
    if (t === 'hand') canvas.classList.add('tool-hand');
    if (t === 'wrench') canvas.classList.add('tool-wrench');
    if (t === 'oil') canvas.classList.add('tool-oil');

    document.querySelectorAll('.control-btn').forEach(b => b.classList.remove('active-tool'));
    if(document.getElementById('btn-' + t)) document.getElementById('btn-' + t).classList.add('active-tool');
}

function checkEngineStatus() {
    const coreIds = ['block', 'piston', 'crank', 'head', 'pan'];
    const coresInstaladas = coreIds.every(id => parts.find(p => p.id === id && p.installed));
    document.getElementById('btn-ign').disabled = !coresInstaladas || engineReady;
    document.getElementById('btn-sell').disabled = !engineTested;
    return coresInstaladas;
}

function handleIgnitionClick() {
    const parafusosSoltos = parts.some(p => p.installed && p.bolts < p.maxBolts);
    if (parafusosSoltos || oilLevel < 100) { explodeEngine(); return; }
    attemptIgnition();
}

function explodeEngine() {
    playSynthSound('explosion');
    updateTut(langData[currentLang].explosionMsg);
    oilLevel = 0; 
    engineTested = false; 
    engineReady = false; 
    motorRealAudio.pause();
    motorRealAudio.currentTime = 0;
    
    updateUI();
    parts.forEach(p => {
        if (p.installed) { p.installed = false; p.bolts = 0; p.vx = (Math.random()-0.5)*60; p.vy = -Math.random()*40; }
    });

    const statusEl = document.getElementById('engine-status');
    statusEl.innerText = langData[currentLang].engineBroken;
    statusEl.className = "offline";
    document.getElementById('kmh-label').innerText = "0";
    checkEngineStatus(); saveGame();
}

function attemptIgnition() {
    motorRealAudio.currentTime = 0;
    motorRealAudio.play().catch(e => console.log("Erro áudio."));
    engineReady = true;
    const statusEl = document.getElementById('engine-status');
    statusEl.innerText = langData[currentLang].engineOn;
    statusEl.className = "online";

    setTimeout(() => {
        if (engineReady) {
            engineTested = true;
            checkEngineStatus();
            updateTut(); // Chama o tutorial para verificar se terminou
        }
    }, 5000);
    checkEngineStatus(); updateTut(); saveGame();
}

function startTutorial() { tutorialActive = true; closeAllModals(false); updateTut(); }
function showAreYouSure() { document.getElementById('modal-welcome').style.display='none'; document.getElementById('modal-sure').style.display='flex'; }
function backToWelcome() { document.getElementById('modal-sure').style.display='none'; document.getElementById('modal-welcome').style.display='flex'; }
function closeAllModals(save) { document.querySelectorAll('.modal-overlay').forEach(m => m.style.display='none'); }

loadGame();
loop();