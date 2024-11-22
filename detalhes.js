// Obtém os parâmetros da URL
const params = new URLSearchParams(window.location.search);

// Obtém o ID da URL e o valor máximo de ID armazenado no sessionStorage
const id = parseInt(params.get("id"));
const idMax = parseInt(sessionStorage.getItem("idMax"));

// Obtém o container onde os dados serão exibidos
const container = document.getElementById("container");

// Função para realizar a requisição para a API e retornar os dados
const pega_json = async (caminho) => {
    const resposta = await fetch(caminho);  // Faz a requisição
    const dados = await resposta.json();    // Converte a resposta para JSON
    return dados;
}

// URL base para as requisições
const urlBase = "https://botafogo-atletas.mange.li/2024-1/";

// Obtém os dados do atleta armazenados no sessionStorage
const dadosSessionStorage = sessionStorage.getItem('dados');

// Função para montar a página com as informações do atleta
const montaPagina = async (dados) => {
    if (sessionStorage.getItem('login')) {  // Verifica se o usuário está logado
        if (id > idMax || id < 1 || isNaN(id)) {
            document.body.innerHTML = '<h1 class="semPermissao">ID não encontrado</h1>'; // Exibe mensagem de erro caso o ID seja inválido
        } else {
            // Limpa o conteúdo anterior da página
            const container = document.getElementById('container');
            container.innerHTML = '';

            // Cria os elementos da página com as informações do atleta
            const nome = document.createElement('h1');
            nome.innerHTML = dados.nome;
            nome.className = 'nome-content';
            container.appendChild(nome);

            const card = document.createElement('div');
            card.className = 'card';
            container.appendChild(card);

            const infoContainer = document.createElement('div');
            infoContainer.className = 'info-container';
            card.appendChild(infoContainer);

            const imagem = document.createElement('img');
            imagem.alt = 'imagem do atleta';
            imagem.src = dados.imagem;
            imagem.className = 'imagem';
            infoContainer.appendChild(imagem);

            const textContainer = document.createElement('div');
            textContainer.className = 'text-container';
            infoContainer.appendChild(textContainer);

            // Cria e adiciona as informações adicionais do atleta
            const descricao = document.createElement('p');
            descricao.innerHTML = dados.detalhes;
            descricao.className = 'content-descricao';
            textContainer.appendChild(descricao);

            const statsContainer = document.createElement('div');
            statsContainer.className = 'stats-container';
            textContainer.appendChild(statsContainer);

            // Exibe as estatísticas do atleta
            const nJogos = document.createElement('p');
            nJogos.innerText = `Número de jogos: ${dados.n_jogos}`;
            nJogos.className = 'stats';
            statsContainer.appendChild(nJogos);

            const elenco = document.createElement('p');
            elenco.innerText = `Elenco: ${dados.elenco}`;
            elenco.className = 'stats';
            statsContainer.appendChild(elenco);

            const noTimeDesde = document.createElement('p');
            noTimeDesde.innerText = `No time desde: ${dados.no_botafogo_desde}`;
            noTimeDesde.className = 'stats';
            statsContainer.appendChild(noTimeDesde);

            const posicao = document.createElement('p');
            posicao.innerText = `Posição: ${dados.posicao}`;
            posicao.className = 'stats';
            statsContainer.appendChild(posicao);

            const naturalidade = document.createElement('p');
            naturalidade.innerText = `Naturalidade: ${dados.naturalidade}`;
            naturalidade.className = 'stats';
            statsContainer.appendChild(naturalidade);

            const nascimento = document.createElement('p');
            nascimento.innerText = `Nascimento: ${dados.nascimento}`;
            nascimento.className = 'stats';
            statsContainer.appendChild(nascimento);

            const altura = document.createElement('p');
            altura.innerText = `Altura: ${dados.altura}`;
            altura.className = 'stats';
            statsContainer.appendChild(altura);

            // Cria um botão de "Voltar" para redirecionar à página principal
            const botao = document.createElement('button');
            botao.className = 'botao-voltar content';
            botao.innerText = 'Voltar';
            botao.onclick = () => {
                window.location.href = 'index.html';  // Redireciona para a página principal
            }
            container.appendChild(botao);
        }
    } else {
        // Caso o usuário não esteja logado, exibe a mensagem de erro
        document.body.innerHTML = '<h1 class="semPermissao">Você precisa estar logado para ter acesso</h1>';
    }
}

// Faz a requisição para obter os dados do atleta com o ID fornecido na URL
pega_json(`https://botafogo-atletas.mange.li/2024-1/${id}`).then(
    (r) => montaPagina(r)
);
