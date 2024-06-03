document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("card_user").addEventListener("click", function() {
        // Redirecionar para outra página
        window.location.href = "telaCadastro.html";
    });
    document.getElementById("sair").addEventListener("click", function() {
        // Redirecionar para outra página
        window.location.href = "telaLogin.html";
    });
    document.getElementById('cardFuncionario').addEventListener("click",function(){
            
        window.location.href = "funcionarios.html";
    })
});

