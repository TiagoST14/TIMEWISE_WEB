function cadastroEmpresa() {
    const form = document.querySelector('.form');

    function recebeForm(evento) {
        evento.preventDefault();
        const nome = form.querySelector('#nome').value;
        const email = form.querySelector('#email').value;
        const telefone = form.querySelector('#telefone').value;
        const numeroCadastroEmpresa = form.querySelector('#cadastroEmpresa').value;
        const senha = form.querySelector('#password').value;
        const confirmarSenha = form.querySelector('#confirmPassword').value;

        if (!nome || !email || !telefone || !numeroCadastroEmpresa || !senha || !confirmarSenha) {
            nome.classList.add("erroUser")
            email.classList.add("erroUser")
            telefone.classList.add("erroUser")
            numeroCadastroEmpresa.classList.add("erroUser")
            senha.classList.add("erroUser")
            confirmarSenha.classList.add("erroUser")
            return;
        }

        const usuario = {
            nome: nome,
            email: email,
            telefone: telefone,
            numeroCadastroEmpresa: numeroCadastroEmpresa,
            senha: senha,
            confirmarSenha: confirmarSenha
        };

        console.log('Dados do usuário:', usuario);

        // Envia os dados do usuário para a API
        fetch('http://localhost:3000/registro', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(usuario)
        })
        .then(response => {
            console.log('Status da resposta:', response.status);
            if (response.status === 422) {
                return response.json().then(data => {
                    console.log('Erro da API:', data);
                    throw new Error(data.erroemailmsg || 'Erro ao enviar requisição');
                });
            }
            if (!response.ok) {
                throw new Error('Erro ao enviar requisição: ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            console.log('Resposta da API:', data);
            alert('Usuário registrado com sucesso!');
            // Limpa os campos do formulário após o cadastro bem-sucedido
            form.querySelector('#nome').value = '';
            form.querySelector('#email').value = '';
            form.querySelector('#telefone').value = '';
            form.querySelector('#cadastroEmpresa').value = '';
            form.querySelector('#password').value = '';
            form.querySelector('#confirmPassword').value = '';
        })
        .catch(error => {
            console.error('Erro durante a requisição:', error);
            alert(error.message || 'Ocorreu um erro ao registrar o usuário. Por favor, tente novamente.');
        });
    }

    form.addEventListener('submit', recebeForm); 
}

cadastroEmpresa();

document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("sair").addEventListener("click", function() {
        // Redirecionar para outra página
        window.location.href = "home.html";
    })
});
