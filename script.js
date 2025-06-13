document.addEventListener('DOMContentLoaded', function() {
    const distritoSelect = document.getElementById('distritoSelect');
    const searchButton = document.getElementById('searchButton');
    const pontosList = document.getElementById('pontosList');
    const resultsTitle = document.getElementById('resultsTitle');
    const loading = document.getElementById('loading');
    
    const API_BASE_URL = 'https://api-webservices-1.onrender.com/api'; // Rota da API
    
    searchButton.addEventListener('click', buscarPontosPorDistrito);
    
async function buscarPontosPorDistrito() {
    const distrito = distritoSelect.value;
    
    if (!distrito) {
        alert('Por favor, selecione um distrito');
        return;
    }
    
    loading.style.display = 'block';
    pontosList.innerHTML = '';
    
    try {
        const url = `${API_BASE_URL}/pontos-turisticos/distrito/${encodeURIComponent(distrito)}`;
        console.log('URL da requisição:', url); 
        
        const response = await fetch(url);
        
        console.log('Status da resposta:', response.status); 
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            throw new Error(errorData?.message || `Erro HTTP: ${response.status}`);
        }
        
        const pontos = await response.json();
        console.log('Pontos recebidos:', pontos); 
        
        loading.style.display = 'none';
        resultsTitle.textContent = `Pontos Turísticos do Distrito de ${distrito} (${pontos.length})`;
        
        if (pontos.length === 0) {
            pontosList.innerHTML = '<p>Nenhum ponto turístico encontrado para este distrito.</p>';
            return;
        }
        
        pontos.forEach(ponto => {
            const card = criarCardPontoTuristico(ponto);
            pontosList.appendChild(card);
        });
        
    } catch (error) {
        loading.style.display = 'none';
        pontosList.innerHTML = `
            <div class="error">
                <p>Erro ao carregar pontos turísticos:</p>
                <p><strong>${error.message}</strong></p>
                <p>Verifique o console para mais detalhes.</p>
            </div>
        `;
        console.error('Erro completo:', error);
    }
}
    
    function criarCardPontoTuristico(ponto) {
        const card = document.createElement('div');
        card.className = 'ponto-card';
        
        const imagem = document.createElement('img');
        imagem.className = 'ponto-image';
        imagem.src = ponto.imagem_url || 'https://via.placeholder.com/300x200?text=Sem+Imagem';
        imagem.alt = ponto.nome;
        
        const info = document.createElement('div');
        info.className = 'ponto-info';
        
        const nome = document.createElement('h3');
        nome.className = 'ponto-nome';
        nome.textContent = ponto.nome;
        
        const localizacao = document.createElement('p');
        localizacao.className = 'ponto-localizacao';
        localizacao.textContent = `${ponto.cidade || 'Local não especificado'} - ${ponto.localizacao}`;
        
        const descricao = document.createElement('p');
        descricao.className = 'ponto-descricao';
        descricao.textContent = ponto.descricao;
        
        info.appendChild(nome);
        info.appendChild(localizacao);
        info.appendChild(descricao);
        
        card.appendChild(imagem);
        card.appendChild(info);
        
        return card;
    }
});