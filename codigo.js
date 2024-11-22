// URL base para pegar os dados
const url = "https://botafogo-atletas.mange.li/2024-1/";

// Definindo o valor máximo de id
const idMax = 60;
sessionStorage.setItem('idMax', idMax);

// Seletores principais
const container = document.getElementById("container");
const divBotoes = document.getElementById("divBotoes");

// Função para pegar os dados em JSON
const pega_json = async (caminho) => {
    const resposta = await fetch(caminho);
    const dados = await resposta.json();
    return dados;
}

// Função que cria o cartão de um atleta
const montaCard = (atleta) => {
    const cartao = document.createElement("article");
    cartao.style.backgroundColor = '#FFF';
    cartao.style.fontFamily = 'Josefin Sans, sans-serif'; 
    
    const nome = document.createElement("h1");
    nome.innerText = atleta.nome;
    nome.style.fontFamily = 'Josefin Sans, sans-serif'; 
    cartao.appendChild(nome);

    const imagem = document.createElement("img");
    imagem.src = atleta.imagem;
    cartao.appendChild(imagem);

    cartao.dataset.id = atleta.id;
    cartao.dataset.nJogos = atleta.n_jogos;

    cartao.onclick = manipulaCLick;

    return cartao;
}

// Função que lida com o clique nos cartões
const manipulaCLick = (e) => {
    const id = e.currentTarget.dataset.id;

    const url = `detalhes.html?id=${id}`;

    document.cookie = `id=${id}`;
    document.cookie = `nJogos=${e.currentTarget.dataset.nJogos}`;

    localStorage.setItem('id', id);
    localStorage.setItem('dados', JSON.stringify(e.currentTarget.dataset));

    sessionStorage.setItem('id', id);
    sessionStorage.setItem('dados', JSON.stringify(e.currentTarget.dataset));

    window.location.href = url;

    console.log(e.currentTarget);
}

// Funções para manipular os botões de seleção
const botaoMasculino = () => {
    pega_json(`${url}masculino`).then(r => {
        container.innerHTML = "";
        r.forEach(ele => container.appendChild(montaCard(ele)));
    });
}

const botaoFeminino = () => {
    pega_json(`${url}feminino`).then(r => {
        container.innerHTML = "";
        r.forEach(ele => container.appendChild(montaCard(ele)));
    });
}

const botaoTodos = () => {
    pega_json(`${url}all`).then(r => {
        container.innerHTML = "";
        r.forEach(ele => container.appendChild(montaCard(ele)));
    });
}

const criaBotoesTimes = () => {
    const botoes = document.createElement("div");
    botoes.id = "botoes";
    botoes.innerHTML = `
    <div class="botao-selecao">
        <div id="teamSelection">
            <button id="botaoMasculino">Masculino</button>
            <button id="botaoFeminino">Feminino</button>
            <button id="botaoTodos">Mostrar todos</button>
        </div>
        <input type="text" id="busca" placeholder="Digite o nome do atleta">
    </div>
    `;

    botoes.querySelectorAll('button').forEach(button => {
        button.style.fontFamily = 'Josefin Sans, sans-serif';  
    });

    return botoes;
}

const criaSelectTimes = () => {
    const select = document.createElement("select");
    select.id = "teamSelection";
    select.className = "dropdown";
    select.innerHTML = `
        <option value="masculino">Masculino</option>
        <option value="feminino">Feminino</option>
        <option value="all">Mostrar todos</option>
    `;
    select.style.fontFamily = 'Josefin Sans, sans-serif'; 
    select.onchange = (e) => {
        const value = e.target.value;
        if (value === "masculino") botaoMasculino();
        else if (value === "feminino") botaoFeminino();
        else if (value === "all") botaoTodos();
    };
    return select;
}

const configuraBotoesTimes = () => {
    if (sessionStorage.getItem('login')) {
        const teamSelection = document.getElementById("teamSelection");
        if (window.innerWidth <= 768) {
            teamSelection.replaceWith(criaSelectTimes());
        } else {
            document.getElementById("botaoMasculino").onclick = botaoMasculino;
            document.getElementById("botaoFeminino").onclick = botaoFeminino;
            document.getElementById("botaoTodos").onclick = botaoTodos;
        }
    }
}

// Função de busca de atletas
const loginValido = () => {
    container.innerHTML = "";
    divBotoes.appendChild(criaBotoesTimes());

    setTimeout(configuraBotoesTimes, 300);

    const input = document.getElementById('busca');
    input.addEventListener('input', () => {
        const termo = input.value.toLowerCase();
        const cartoes = container.getElementsByTagName('article');

        for (let i = 0; i < cartoes.length; i++) {
            const cartao = cartoes[i];
            const nome = cartao.getElementsByTagName('h1')[0].innerText.toLowerCase();

            if (nome.includes(termo)) {
                cartao.style.display = 'block';
            } else {
                cartao.style.display = 'none';
            }
        }
    });
}

// Função para validar o login
const manipulaBotaoLogin = () => {
    const texto = document.getElementById("senha").value;

    document.getElementById("senha").value = "";

    if (hex_sha256(texto) === "ded6a687514227ff822d40bd397f30f5ae9132487ad6c846599131c740d784f0") {
        sessionStorage.setItem('login', true);

        document.getElementById("botaoLogin").style.display = "none";
        document.getElementById("senha").style.display = "none";
        document.getElementById("mostraSenha").style.display = "none";
        document.getElementById("card-login").style.display = "none";
        document.getElementById("logout").style.display = "block";

        if (sessionStorage.getItem('login')) {
            loginValido();
        }
    } else {
        alert("Senha incorreta");
    }
}

// Função para verificar o status do login
const checkLoginStatus = () => {
    if (sessionStorage.getItem('login')) {
        document.getElementById("botaoLogin").style.display = "none";
        document.getElementById("senha").style.display = "none";
        document.getElementById("mostraSenha").style.display = "none";
        document.getElementById("card-login").style.display = "none";
        document.getElementById("logout").style.display = "block";
        loginValido();
    }
}

// Função para realizar o logout
document.getElementById("logout").onclick = () => {
    sessionStorage.removeItem('login');
    container.innerHTML = "";
    divBotoes.innerHTML = "";

    document.getElementById("botaoLogin").style.display = "inline";
    document.getElementById("senha").style.display = "inline";
    document.getElementById("mostraSenha").style.display = "block";
    document.getElementById("card-login").style.display = "flex";
    document.getElementById("logout").style.display = "none";
}

// Inicialização após carregamento do DOM
document.addEventListener('DOMContentLoaded', checkLoginStatus);
document.getElementById("botaoLogin").onclick = manipulaBotaoLogin;

// Redimensionamento da janela para reconfigurar os botões
window.addEventListener('resize', () => {
    if (sessionStorage.getItem('login')) {
        const teamSelection = document.getElementById("teamSelection");
        if (window.innerWidth <= 768 && teamSelection.tagName !== "SELECT") {
            teamSelection.replaceWith(criaSelectTimes());
        } else if (window.innerWidth > 768 && teamSelection.tagName === "SELECT") {
            teamSelection.replaceWith(criaBotoesTimes().querySelector("#teamSelection"));
            configuraBotoesTimes();
        }
    }
});
