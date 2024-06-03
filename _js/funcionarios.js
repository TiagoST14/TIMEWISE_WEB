
document.addEventListener("DOMContentLoaded", function() {
    document.getElementById('card_funcionario').addEventListener("click",function(){
                
        window.location.href = "perfilFuncionario.html";
    });
    document.getElementById('sair').addEventListener('click', function(){
        window.location.href = "home.html"
    })
    document.getElementById('novoFuncionario').addEventListener('click', function(){
        window.location.href = "novoFuncionario.html"
    })
    document.getElementById('voltar_funcionario').addEventListener('click', function(){
        window.location.href = "funcionarios.html"
    })
});

