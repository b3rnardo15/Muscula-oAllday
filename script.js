// Função para salvar o treino e redirecionar para a página principal
function salvarTreino() {
    // Garantir que os dados do treino sejam salvos antes de redirecionar
    const treinoForm = document.getElementById('treinoForm');
    if (treinoForm) {
        treinoForm.dispatchEvent(new Event('submit')); // Submete o formulário para garantir que os dados sejam salvos
    }

    // Redirecionar para a página inicial após 500ms
    setTimeout(function() {
        window.location.href = 'index.html'; // Redireciona para index.html
    }, 500); // Atraso para garantir que o salvamento aconteça antes do redirecionamento
}

// Função para adicionar exercícios na página treino.html
function adicionarExercicio(event) {
    event.preventDefault(); // Evita o recarregamento da página ao submeter o formulário

    // Obtém os valores dos campos do formulário
    const nome = document.getElementById('nomeExercicio').value;
    const repeticoes = document.getElementById('repeticoes').value;
    const carga = document.getElementById('kgs').value;
    const series = document.getElementById('series').value;
    const categoria = document.getElementById('categoria').value;

    // Cria um objeto com as informações do exercício
    const novoExercicio = { nome, repeticoes, carga, series, categoria };

    // Carregar exercícios existentes ou inicializar um array vazio
    let exercicios = JSON.parse(localStorage.getItem('exercicios')) || [];
    exercicios.push(novoExercicio); // Adiciona o novo exercício ao array

    // Salva os dados no localStorage
    localStorage.setItem('exercicios', JSON.stringify(exercicios));

    // Limpa o formulário para o próximo exercício
    document.getElementById('treinoForm').reset();

    // Atualiza a lista de exercícios na página
    renderizarExercicios();
}

// Função para renderizar os exercícios na página inicial (index.html)
function renderizarExercicios() {
    const cardsTreinos = document.getElementById('cardsTreinos');
    const exercicios = JSON.parse(localStorage.getItem('exercicios')) || [];

    // Limpa os treinos anteriores
    cardsTreinos.innerHTML = '';

    // Agrupa os exercícios por categoria
    const categorias = {};
    exercicios.forEach(exercicio => {
        if (!categorias[exercicio.categoria]) {
            categorias[exercicio.categoria] = [];
        }
        categorias[exercicio.categoria].push(exercicio);
    });

    // Cria cards para cada categoria
    for (const categoria in categorias) {
        const cardCategoria = document.createElement('div');
        cardCategoria.classList.add('col-md-4', 'mb-3');

        const cardContent = `
            <div class="card category-card shadow-sm p-3 mb-5 bg-white rounded" style="border: 1px solid #f0c4f0;">
                <div class="card-body">
                    <h5 class="card-title">${categoria}</h5>
                    <ul class="list-group" style="display: none;">
                        ${categorias[categoria].map(exercicio => `
                            <li class="list-group-item">
                                <h6>${exercicio.nome}</h6>
                                <p>Repetições: ${exercicio.repeticoes}</p>
                                <p>Carga: ${exercicio.carga}kg</p>
                                <p>Séries: ${exercicio.series}</p>
                            </li>
                        `).join('')}
                    </ul>
                    <button class="btn btn-info" onclick="toggleListaExercicios(this)">Ver Exercícios</button>
                </div>
            </div>
        `;
        cardCategoria.innerHTML = cardContent;

        // Adiciona o card à tela
        cardsTreinos.appendChild(cardCategoria);
    }
}

// Função para alternar a exibição dos exercícios dentro do card
function toggleListaExercicios(button) {
    const listGroup = button.previousElementSibling;
    listGroup.style.display = (listGroup.style.display === 'none' || listGroup.style.display === '') ? 'block' : 'none';
}

// Função para renderizar o gráfico de desempenho na página desempenho.html
function renderizarGrafico() {
    // Obtendo os dados armazenados no localStorage
    const exercicios = JSON.parse(localStorage.getItem('exercicios')) || [];

    // Preparando os dados para o gráfico
    const labels = [];  // Para armazenar os nomes das categorias
    const dataSeries = [];  // Para armazenar os totais de séries por categoria

    exercicios.forEach(exercicio => {
        labels.push(exercicio.categoria);
        const totalSeries = exercicio.series;
        dataSeries.push(totalSeries); // Somando as séries por categoria
    });

    // Configuração do gráfico usando Chart.js
    const ctx = document.getElementById('graficoExercicios').getContext('2d');
    const grafico = new Chart(ctx, {
        type: 'bar',  // Tipo do gráfico (barras)
        data: {
            labels: labels,  // Usando as categorias como rótulos no gráfico
            datasets: [{
                label: 'Total de Séries por Categoria',
                data: dataSeries,  // Dados das séries somadas por categoria
                backgroundColor: 'rgba(40, 167, 69, 0.5)',  // Cor de fundo das barras
                borderColor: 'rgba(40, 167, 69, 1)',  // Cor da borda das barras
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true  // Garante que o gráfico comece do zero no eixo Y
                }
            }
        }
    });
}

// Verificar a página atual e executar a função necessária
window.addEventListener('load', function() {
    if (window.location.pathname.includes('treino.html')) {
        // Se estamos em treino.html, adiciona o evento de submit ao formulário
        const treinoForm = document.getElementById('treinoForm');
        treinoForm.addEventListener('submit', adicionarExercicio);

        // Adiciona o evento de click no botão "Salvar Treino"
        document.getElementById('salvarTreino').addEventListener('click', salvarTreino);
    } else if (window.location.pathname.includes('index.html')) {
        // Se estamos em index.html, renderiza os exercícios salvos
        renderizarExercicios();
    } else if (window.location.pathname.includes('desempenho.html')) {
        // Se estamos em desempenho.html, renderiza o gráfico
        renderizarGrafico();
    }
});
