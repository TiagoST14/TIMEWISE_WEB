/**
 * Dashboard Script - TimeWise Enterprise
 * Controle de autenticação e navegação
 */

// Configurações globais
const CONFIG = {
    loginPage: "telaLogin.html",
    sessionItems: ['token', 'usuarioNome', '_grecaptcha'],
    redirects: {
        card_user: "telaCadastro.html",
        cardFuncionario: "listaFuncionarios.html",
        cardEmpresa: "empresas.html",
        cardRegistro: "registroPonto.html" 
    }
};

// Aguarda o DOM estar totalmente carregado
document.addEventListener("DOMContentLoaded", function() {
    initApplication();
window.onload = function(){
    const token = localStorage.getItem('token');
    if (!token ){
        alert("Faça Login Novamente!")
        window.location.href = "telaLogin.html";
    }
        const _grecaptcha = localStorage.getItem('_grecaptcha');
    if (!_grecaptcha){
        alert("Faça Login Novamente!")
        window.location.href = "telaLogin.html";
    }
}
document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("card_user").addEventListener("click", function() {
        
        window.location.href = "telaCadastro.html";
    });
    document.getElementById("sair").addEventListener("click", function() {
        localStorage.removeItem('token');
        localStorage.removeItem('usuarioNome');
        localStorage.removeItem('_grecaptcha');
        
        window.location.href = "telaLogin.html";
    });
    document.getElementById('cardFuncionario').addEventListener("click",function(){
            
        window.location.href = "listaFuncionarios.html";
    });

    document.getElementById('cardEmpresa').addEventListener("click",function(){
        window.location.href= "empresas.html";
    })
    function atualizarNomeUsuario() {
        const usuarioLogElement = document.getElementById('usuario_log');
        const usuarioNome = localStorage.getItem('usuarioNome') || 'Usuário';
        usuarioLogElement.textContent = usuarioNome;
    }
    atualizarNomeUsuario();
});

/**
 * Inicializa a aplicação
 */
function initApplication() {
    // 1. Verifica autenticação
    if (!checkAuthentication()) {
        redirectToLogin();
        return;
    }

    // 2. Configura elementos da UI
    setupUI();

    // 3. Configura event listeners
    setupEventListeners();
}

/**
 * Verifica se o usuário está autenticado
 */
function checkAuthentication() {
    const token = localStorage.getItem('token');
    const _grecaptcha = localStorage.getItem('_grecaptcha');
    
    // Verifica se os tokens existem e são válidos
    if (!token || token === "undefined" || token === "null" || !_grecaptcha) {
        console.warn("Autenticação inválida - Token:", token);
        return false;
    }
    
    return true;
}

/**
 * Redireciona para a página de login
 */
function redirectToLogin() {
    alert("Sessão expirada. Redirecionando para login...");
    clearSessionData();
    window.location.href = CONFIG.loginPage;  // ← Use loginPage em vez de Login
}

/**
 * Limpa os dados da sessão
 */
function clearSessionData() {
    CONFIG.sessionItems.forEach(item => {
        localStorage.removeItem(item);
    });
    console.log("Dados da sessão limpos");
}

/**
 * Configura os elementos da interface
 */
function setupUI() {
    // Atualiza o nome do usuário
    updateUserName();
    
    // Pode adicionar outras configurações de UI aqui
}

/**
 * Atualiza o nome do usuário no header
 */
function updateUserName() {
    const userElement = document.getElementById('usuario_log');
    if (userElement) {
        const userName = localStorage.getItem('usuarioNome') || 'Usuário';
        userElement.textContent = userName;
    }
}

/**
 * Configura todos os event listeners
 */
function setupEventListeners() {
    // Botão de logout
    const logoutBtn = document.getElementById('sair');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }

    // Cards clicáveis
    setupCardListeners();
}

/**
 * Lida com o logout do usuário
 */
function handleLogout(event) {
    event.preventDefault();
    console.log("Logout iniciado");
    
    clearSessionData();
    
    // Força o redirecionamento mesmo se houver erro
    window.location.replace(CONFIG.loginPage);
    
    // Backup caso o replace não funcione
    setTimeout(() => {
        window.location.href = CONFIG.loginPage;
    }, 100);
}

/**
 * Configura os listeners para os cards
 */
function setupCardListeners() {
    Object.keys(CONFIG.redirects).forEach(cardId => {
        const card = document.getElementById(cardId);
        if (card) {
            card.addEventListener('click', () => {
                window.location.href = CONFIG.redirects[cardId];
            });
            
            // Adiciona feedback visual
            card.style.cursor = 'pointer';
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-5px)';
            });
            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
            });
        } else {
            console.warn(`Elemento não encontrado: ${cardId}`);
        }
    });
}

// Verificação adicional quando a página carrega
window.addEventListener('load', function() {
    if (!checkAuthentication()) {
        redirectToLogin();
    }
});

// Proteção contra navegação para trás após logout
window.onpageshow = function(event) {
    if (event.persisted && !checkAuthentication()) {
        redirectToLogin();
    }
};