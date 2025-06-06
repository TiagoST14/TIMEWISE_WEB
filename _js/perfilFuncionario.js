document.addEventListener('DOMContentLoaded', () => {
    const formBusca = document.querySelector('.formBusca');

    formBusca.addEventListener('submit', async function (evento) {
        evento.preventDefault();
        const inputBusca = document.getElementById('busca').value;

        try {
            const response = await fetch(`http://localhost:3000/buscar?nome=${encodeURIComponent(inputBusca)}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`Erro: ${response.statusText}`);
            }

            const data = await response.json();
            mostrarResultado(data);
        } catch (error) {
            console.error('Erro ao buscar usuário:', error);
            document.getElementById('resultadoBusca').innerText = 'Erro ao buscar usuário';
        }
    });

    function mostrarResultado(data) {
        const resultadoDiv = document.getElementById('resultadoBusca');
        resultadoDiv.innerHTML = '';

        if (Array.isArray(data) && data.length > 0) {
            data.forEach(usuario => {
                const userDiv = document.createElement('div');
                userDiv.textContent = `Nome: ${usuario.nome}, Email: ${usuario.email}, Telefone: ${usuario.telefone}`;
                resultadoDiv.appendChild(userDiv);
            });
        } else {
            resultadoDiv.innerText = 'Nenhum usuário encontrado';
        }
    }
});
