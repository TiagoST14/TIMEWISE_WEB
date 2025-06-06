document.addEventListener("DOMContentLoaded", function() {
    // Verifica se o formulário existe
    const form = document.querySelector('.form-grid');
    if (!form) {
        console.error('Formulário não encontrado');
        return;
    }

    // Elemento para exibir mensagens
    const messageBox = document.getElementById('messageBox');

    // Função para mostrar mensagem
    function showMessage(text, type) {
        if (!messageBox) return;
        messageBox.textContent = text;
        messageBox.className = 'message-box ' + (type === 'success' ? 'success' : 'error');
        messageBox.style.display = 'block';
    }

    // Limpa mensagem
    function clearMessage() {
        if (!messageBox) return;
        messageBox.textContent = '';
        messageBox.style.display = 'none';
        messageBox.className = 'message-box';
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
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        clearMessage();

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

        console.log('Dados enviados:', novoFuncionario);

        fetch('http://localhost:3000/funcCadastro', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(novoFuncionario)
        })
        .then(response => {
            console.log('Status da resposta:', response.status);
            if (!response.ok) {
                return response.json().then(err => { 
                    throw new Error(err.errorcpfmsg || 'Erro ao cadastrar funcionário');
                });
            }
            return response.json();
        })
        .then(data => {
            console.log('Resposta da API:', data);
            showMessage('Funcionário registrado com sucesso!', 'success');
            form.reset();
        })
        .catch(error => {
            console.error('Erro durante a requisição:', error);
            showMessage(error.message || 'Ocorreu um erro ao registrar o Funcionário. Por favor, tente novamente.', 'error');
        });
    });

    // Botão Voltar
    const voltarBtn = document.getElementById('voltar_funcionario');
    if (voltarBtn) {
        voltarBtn.addEventListener('click', function(e) {
            e.preventDefault(); // Evita comportamento padrão (se for um link)
            console.log("Redirecionando para listafuncionarios.html"); // Debug
            window.location.href = "listafuncionarios.html"; // Ajuste o caminho se necessário
        });
    }

    function showMessage(text, type) {
    if (!messageBox) return;
    messageBox.textContent = text;
    messageBox.className = 'message-box ' + (type === 'success' ? 'success' : 'error');
    messageBox.style.display = 'block';

    // Esconde a mensagem depois de 2 segundos (2000 ms)
    setTimeout(() => {
        messageBox.style.display = 'none';
    }, 2000);
}
});
