document.addEventListener("DOMContentLoaded", function() {
    // Elementos do popup
    const popupOverlay = document.getElementById('popupOverlay');
    const popupMessage = document.getElementById('popupMessage');

    // Função para mostrar popup e redirecionar após 1 segundo
    function showPopupAndRedirect(message, isSuccess) {
    const popupContent = document.getElementById('popupContent');
    const popupMessage = document.getElementById('popupMessage');
    const checkmark = document.querySelector('.checkmark');
    const errorMark = document.querySelector('.error-mark');
    
    // Configura o estilo baseado no sucesso/erro
    if (isSuccess) {
        popupContent.classList.remove('error');
        checkmark.style.display = 'block';
        errorMark.style.display = 'none';
    } else {
        popupContent.classList.add('error');
        checkmark.style.display = 'none';
        errorMark.style.display = 'block';
    }
    
    popupMessage.textContent = message;
    popupOverlay.classList.add('active');
    
    // Redireciona após 1 segundo
    setTimeout(() => {
        window.location.href = "listafuncionarios.html";
    }, 1000);
    }

    // Máscara CPF (exemplo simples)
    const cpfInput = document.getElementById('cpf');
    if (cpfInput) {
        cpfInput.addEventListener('keypress', () => {
            let cpfLength = cpfInput.value.length;
            if (cpfLength === 3 || cpfLength === 7) {
                cpfInput.value += '.';
            }
            if (cpfLength === 11) {
                cpfInput.value += '-';
            }
        });
    }

    // Evento submit do formulário
    const form = document.querySelector('.form-grid');
    if (form) {
        form.addEventListener('submit', function(event) {
            event.preventDefault();

            const novoFuncionario = {
                func_nome: document.getElementById('nome')?.value || '',
                func_email: document.getElementById('email')?.value || '',
                func_cpf: document.getElementById('cpf')?.value || '',
                func_nasc: document.getElementById('nascimento')?.value || '',
                func_sexo: document.getElementById('sexo')?.value || '',
                func_tel: document.getElementById('telefone')?.value || '',
                func_end: document.getElementById('endereco')?.value || '',
                func_contrato: document.getElementById('contrato')?.value || '',
                func_setor: document.getElementById('setor')?.value || '',
                func_filial: document.getElementById('filial')?.value || '',
                func_escala: document.getElementById('escala')?.value || ''
            };

            fetch('http://localhost:3000/funcCadastro', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(novoFuncionario)
            })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(err => { 
                        throw new Error(err.errorcpfmsg || 'Erro ao cadastrar funcionário');
                    });
                }
                return response.json();
            })
            .then(data => {
                showPopupAndRedirect('FUNCIONÁRIO CADASTRADO COM SUCESSO', true);
                form.reset();
            })
            .catch(error => {
                showPopupAndRedirect('NÃO FOI POSSÍVEL CADASTRAR O FUNCIONÁRIO', false);
            });
        });
    }

    // Botão Voltar
    const voltarBtn = document.getElementById('voltar_funcionario');
    if (voltarBtn) {
        voltarBtn.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = "listafuncionarios.html";
        });
    }
});