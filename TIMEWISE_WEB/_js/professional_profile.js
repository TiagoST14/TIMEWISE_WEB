document.getElementById('sair').addEventListener('click', function() {
    window.location.href = "listaFuncionarios.html";
});

document.getElementById('edit-btn').addEventListener('click', function() {
    toggleEditMode(true); // Habilita o modo de edição
});


// Função para carregar os dados do funcionário pelo CPF
async function loadEmployeeDataByCPF(cpf) {
    try {
        const response = await fetch(`http://localhost:3000/funcionario/${cpf}`);
        
        // Verifica se a resposta é bem-sucedida
        if (!response.ok) {
            throw new Error('Erro ao carregar dados do funcionário');
        }

        const employeeData = await response.json();

        // Preenche os campos do formulário com os dados recebidos
        document.getElementById('nome').value = employeeData.func_nome;
        document.getElementById('email').value = employeeData.func_email;
        document.getElementById('cpf').value = employeeData.func_cpf;
        document.getElementById('nascimento').value = employeeData.func_nasc;
        document.getElementById('sexo').value = employeeData.func_sexo;
        document.getElementById('telefone').value = employeeData.func_tel;
        document.getElementById('endereco').value = employeeData.func_end;
        document.getElementById('contrato').value = employeeData.func_contrato;
        document.getElementById('setor').value = employeeData.func_setor;
        document.getElementById('filial').value = employeeData.func_filial;
        document.getElementById('escala').value = employeeData.func_escala;

       // Preenche o nome e o setor na página
        document.getElementById('nome').innerText = employeeData.func_nome; // Nome do funcionário
        document.getElementById('cargo').innerText = employeeData.func_setor; // Cargo do funcionário


        // Ativa todos os campos para edição, exceto o CPF
        toggleEditMode(false);  // Inicia com os campos desabilitados
    } catch (error) {
        console.error('Erro ao carregar os dados do funcionário:', error);
        alert('Não foi possível carregar os dados do funcionário');
    }
}

function toggleEditMode(isEditMode = false) {
    const inputs = document.querySelectorAll('.profile-details input');
    const saveButton = document.getElementById('save-btn');
    const editButton = document.getElementById('edit-btn');

    inputs.forEach(input => {
        if (input.id !== 'cpf') { // CPF permanece desativado
            input.disabled = !isEditMode; // Habilita ou desabilita
            input.readOnly = !isEditMode; // Remove o atributo readonly
        }
    });

    saveButton.style.display = isEditMode ? 'inline-block' : 'none';
    editButton.style.display = isEditMode ? 'none' : 'inline-block';
}


// Função para salvar os dados atualizados do funcionário
async function saveProfile() {
    const cpf = document.getElementById('cpf').value;
    const func_nome = document.getElementById('nome').value;
    const func_email = document.getElementById('email').value;
    const func_nasc = document.getElementById('nascimento').value;
    const func_sexo = document.getElementById('sexo').value;
    const func_tel = document.getElementById('telefone').value;
    const func_end = document.getElementById('endereco').value;
    const func_contrato = document.getElementById('contrato').value;
    const func_setor = document.getElementById('setor').value;
    const func_filial = document.getElementById('filial').value;
    const func_escala = document.getElementById('escala').value;

    // Prepara o objeto com os dados atualizados
    const updatedEmployee = {
        func_nome, 
        func_email, 
        func_cpf: cpf, 
        func_nasc, 
        func_sexo, 
        func_tel, 
        func_end, 
        func_contrato, 
        func_setor, 
        func_filial, 
        func_escala
    };

    try {
        // Envia a requisição para atualizar os dados no backend
        const response = await fetch(`http://localhost:3000/funcUpdateByCPF/${cpf}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedEmployee)
        });

        // Verifica se a resposta é bem-sucedida
        if (!response.ok) {
            throw new Error('Erro ao atualizar dados do funcionário');
        }

        const result = await response.json();
        alert(result.message);

        // Desativa o modo de edição após salvar
        toggleEditMode(false);  // Retorna ao modo visualização
    } catch (error) {
        console.error('Erro ao salvar dados do funcionário:', error);
        alert('Não foi possível salvar os dados do funcionário');
    }
}

// Função chamada quando a página for carregada (por exemplo, quando um CPF é passado na URL)
window.onload = function() {
    const urlParams = new URLSearchParams(window.location.search);
    const cpf = urlParams.get('cpf'); // Exemplo: ?cpf=12345678901

    if (cpf) {
        // Carregar os dados do funcionário com base no CPF
        loadEmployeeDataByCPF(cpf);
    } else {
        alert('CPF não fornecido na URL');
    }
};
