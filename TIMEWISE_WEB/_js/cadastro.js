function cadastroEmpresa() {
    const form = document.querySelector('.form');

    // Função para mostrar o popup
    function showPopup(message, isSuccess) {
        const popup = document.getElementById('popup');
        const popupMessage = document.getElementById('popup-message');
        
        popupMessage.textContent = message;
        popup.style.display = 'flex';
        
        // Adiciona classe baseada no sucesso/erro
        popupMessage.style.color = isSuccess ? 'green' : 'red';
        
        // Remove event listeners anteriores para evitar múltiplas atribuições
        const closeButton = document.getElementById('popup-close');
        const newCloseButton = closeButton.cloneNode(true);
        closeButton.parentNode.replaceChild(newCloseButton, closeButton);
        
        // Fechar popup e redirecionar se for sucesso
        newCloseButton.addEventListener('click', function() {
            popup.style.display = 'none';
            if(isSuccess) {
                // Limpa os campos do formulário
                form.reset();
                // Redireciona para a home após 500ms
                setTimeout(() => {
                    window.location.href = "home.html";
                }, 500);
            }
        });
    }

    async function recebeForm(evento) {
        evento.preventDefault();
        const nomeInput = form.querySelector('#nome');
        const emailInput = form.querySelector('#email');
        const telefoneInput = form.querySelector('#telefone');
        const empresaInput = form.querySelector('#cadastroEmpresa');
        const senhaInput = form.querySelector('#password');
        const confirmarSenhaInput = form.querySelector('#confirmPassword');

        // Remove classes de erro anteriores
        [nomeInput, emailInput, telefoneInput, empresaInput, senhaInput, confirmarSenhaInput].forEach(input => {
            input.classList.remove("erroUser");
        });

        // Validação dos campos
        if (!nomeInput.value || !emailInput.value || !telefoneInput.value || 
            !empresaInput.value || !senhaInput.value || !confirmarSenhaInput.value) {
            
            [nomeInput, emailInput, telefoneInput, empresaInput, senhaInput, confirmarSenhaInput].forEach(input => {
                if(!input.value) input.classList.add("erroUser");
            });
            
            showPopup('Por favor, preencha todos os campos!', false);
            return;
        }

        if(senhaInput.value !== confirmarSenhaInput.value) {
            senhaInput.classList.add("erroUser");
            confirmarSenhaInput.classList.add("erroUser");
            showPopup('As senhas não coincidem!', false);
            return;
        }

        const usuario = {
            nome: nomeInput.value,
            email: emailInput.value,
            telefone: telefoneInput.value,
            numeroCadastroEmpresa: empresaInput.value,
            senha: senhaInput.value,
            confirmarSenha: confirmarSenhaInput.value
        };

        try {
            const response = await fetch('http://localhost:3000/registro', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(usuario)
            });

            const data = await response.json();

            if (!response.ok) {
                if (response.status === 422) {
                    throw new Error(data.erroemailmsg || 'Erro ao cadastrar usuário');
                }
                throw new Error(data.message || 'Erro ao cadastrar usuário');
            }

            console.log('Resposta da API:', data);
            showPopup('Cadastro realizado com sucesso!', true);
            
        } catch (error) {
            console.error('Erro durante a requisição:', error);
            showPopup(error.message || 'Ocorreu um erro ao registrar. Por favor, tente novamente.', false);
        }
    }

    form.addEventListener('submit', recebeForm); 
}

// Inicialização
document.addEventListener("DOMContentLoaded", function() {
    cadastroEmpresa();
    
    document.getElementById("sair").addEventListener("click", function() {
        window.location.href = "home.html";
    });
});