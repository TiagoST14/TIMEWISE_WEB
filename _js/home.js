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

