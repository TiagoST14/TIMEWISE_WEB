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
    
    // 4. Configura o popup de logout
    setupLogoutPopup();
}

/**
 * Configura o popup de logout
 */
function setupLogoutPopup() {
    // Elementos do popup
    const logoutPopup = document.getElementById("logout-popup");
    const logoutConfirm = document.getElementById("logout-confirm");
    const logoutCancel = document.getElementById("logout-cancel");
    const logoutButton = document.getElementById("sair");

    if (!logoutPopup || !logoutConfirm || !logoutCancel || !logoutButton) {
        console.warn("Elementos do popup de logout não encontrados");
        return;
    }

    // Mostrar popup ao clicar em Sair
    logoutButton.addEventListener("click", function(e) {
        e.preventDefault();
        logoutPopup.style.display = "flex";
    });

    // Confirmar logout
    logoutConfirm.addEventListener("click", function() {
        handleLogout(new Event('click'));
    });

    // Cancelar logout
    logoutCancel.addEventListener("click", function() {
        logoutPopup.style.display = "none";
    });

    // Fechar popup ao clicar fora do conteúdo
    logoutPopup.addEventListener("click", function(e) {
        if (e.target === logoutPopup) {
            logoutPopup.style.display = "none";
        }
    });

    // Fechar com ESC
    document.addEventListener("keydown", function(e) {
        if (e.key === "Escape" && logoutPopup.style.display === "flex") {
            logoutPopup.style.display = "none";
        }
    });
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
    window.location.href = CONFIG.loginPage;
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
    // Botão de logout (já configurado no setupLogoutPopup)
    
    // Cards clicáveis
    setupCardListeners();
}

/**
 * Lida com o logout do usuário
 */
function handleLogout(event) {
    if (event) event.preventDefault();
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