function cadastroEmpresa(){
    const form = document.querySelector('.form');
    

    const usuarios = [];

    function recebeForm(evento){
        evento.preventDefault();
        const nome = form.querySelector('#nome');
        const email = form.querySelector('#email');
        const telefone = form.querySelector('#telefone');
        const numeroCadastroEmpresa = form.querySelector('#cadastroEmpresa');
        const senha = form.querySelector('#password');
        const confirmarSenha = form.querySelector('#confirmPassword');
        
        usuarios.push({
            nome: nome.value,
            email: email.value,
            telefone: telefone.value,
            numeroCadastroEmpresa: numeroCadastroEmpresa.value,
            senha: senha.value,
            confirmarSenha: confirmarSenha.value
        });
        
        console.log(usuarios)
    }
    form.addEventListener('submit',recebeForm);

}
cadastroEmpresa();