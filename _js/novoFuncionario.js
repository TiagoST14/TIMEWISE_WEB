function cadastroFuncionario() {
    const form = document.querySelector('form');
    function recebeForm(event) {
        event.preventDefault();

        const nome = document.querySelector('#nome').value;
        const email = document.querySelector('#email').value;
        const cpf = document.querySelector('#cpf').value;
        const nascimento = document.querySelector('#nascimento').value;
        const sexo = document.querySelector('#sexo').value;
        const telefone = document.querySelector('#telefone').value;
        const endereco = document.querySelector('#endereco').value;
        const contrato = document.querySelector('#contrato').value;
        const setor = document.querySelector('#setor').value;
        const filial = document.querySelector('#filial').value;
        const escala = document.querySelector('#escala').value;

        if (!nome || !email || !nascimento || !sexo || !telefone || !endereco || !contrato || !setor || !filial || !escala) {
            alert('Por favor, preencha todos os campos.');
            return;
        }

        const funcionario = {
            func_name: nome,
            func_email: email,
            func_cpf: cpf,
            func_nasc: nascimento,
            func_sexo: sexo,
            func_tel: telefone,
            func_end: endereco,
            func_contrato: contrato,
            setor: setor,
            filial: filial,
            escala: escala
        };

        console.log('Dados do funcionário:', funcionario);

        // Envio dos dados para o servidor
        fetch('http://localhost:4000/funcCadastro', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(funcionario)
        })
        .then(response => {
            console.log('Status da resposta:', response.status);
            if (response.status === 422) {
                return response.json().then(data => {
                    console.log('Erro da API:', data);
                    throw new Error(data.message || 'CPF já existe!');
                });
            }
            if (!response.ok) {
                throw new Error('Erro ao enviar requisição: ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            console.log('Resposta da API:', data);
            alert('Funcionario registrado com sucesso!')
            limparCampos();
        })
        .catch(error => {
            console.error('Erro durante a requisição:', error);
            alert(error.message || 'Ocorreu um erro ao registrar o Funcionário. Por favor, tente novamente.');
        });
    }

    if (form) {
        form.addEventListener('submit', recebeForm);
    } else {
        console.error('Elemento <form> não encontrado!');
    }

    function limparCampos() {
        document.querySelector('#nome').value = '';
        document.querySelector('#email').value = '';
        document.querySelector('#nascimento').value = '';
        document.querySelector('#sexo').value = '';
        document.querySelector('#telefone').value = '';
        document.querySelector('#endereco').value = '';
        document.querySelector('#contrato').value = '';
        document.querySelector('#setor').value = '';
        document.querySelector('#filial').value = '';
        document.querySelector('#escala').value = '';
    }
}

cadastroFuncionario();


document.getElementById('voltar_funcionario').addEventListener('click', function () {
    window.location.href = "funcionarios.html"
})