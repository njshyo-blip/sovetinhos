// Clientes
var clientes = [
    { nome: "Cliente 1", imagem: "cliente-1.png" },
    { nome: "Cliente 2", imagem: "cliente-2.png" },
    { nome: "Cliente 3", imagem: "cliente-3.png" },
    { nome: "Cliente 4", imagem: "cliente-4.png" }
];

// Sabores
var sabores = {
    morango: { nome: "morango", cor: "#f18b9a" },
    chocolate: { nome: "chocolate", cor: "#795044" },
    baunilha: { nome: "baunilha", cor: "#f4e4bd" },
    pistache: { nome: "pistache", cor: "#a8bb83" },
    menta: { nome: "menta", cor: "#8fc9b1" }
};

var nomesCasquinhas = {
    tradicional: "tradicional",
    waffle: "waffle",
    chocolate: "de chocolate"
};

var clienteAtual = 0;
var pedido = {};
var casquinhaEscolhida = "";
var bolasEscolhidas = [];

function pegarElemento(id) {
    return document.getElementById(id);
}

// Cria um pedido aleatorio
function criarPedido() {
    var casquinhas = ["tradicional", "waffle", "chocolate"];
    var listaSabores = ["morango", "chocolate", "baunilha", "pistache", "menta"];

    var novoPedido = {
        casquinha: casquinhas[Math.floor(Math.random() * 3)],
        bolas: []
    };

    var quantidade = Math.floor(Math.random() * 3) + 1;

    for (var i = 0; i < quantidade; i++) {
        var numero = Math.floor(Math.random() * listaSabores.length);
        novoPedido.bolas.push(listaSabores[numero]);
    }

    return novoPedido;
}

// Mostra o pedido do cliente
function mostrarPedido() {
    var quantidade = "uma bola";

    if (pedido.bolas.length == 2) {
        quantidade = "duas bolas";
    } else if (pedido.bolas.length == 3) {
        quantidade = "três bolas";
    }

    var lista = "";

    for (var i = 0; i < pedido.bolas.length; i++) {
        lista += sabores[pedido.bolas[i]].nome;

        if (i < pedido.bolas.length - 1) {
            lista += ", ";
        }
    }

    var texto = "Quero uma casquinha " + nomesCasquinhas[pedido.casquinha] +
        " com " + quantidade + " de " + lista + ".";

    pegarElemento("requestText").textContent = texto;

    var previa = '<span class="mini-cone"></span>';

    for (var j = 0; j < pedido.bolas.length; j++) {
        var sabor = pedido.bolas[j];
        previa += '<i class="mini-dot" style="background:' + sabores[sabor].cor + '"></i>';
    }

    pegarElemento("requestPreview").innerHTML = previa;
}

// Mostra o cliente atual
function mostrarCliente() {
    var cliente = clientes[clienteAtual % clientes.length];

    pegarElemento("customerImage").src = cliente.imagem;
    pegarElemento("customerImage").alt = cliente.nome;
    pegarElemento("customerName").textContent = cliente.nome;

    pedido = criarPedido();
    mostrarPedido();
    limparSorvete();
}

// Limpa o sorvete
function limparSorvete() {
    casquinhaEscolhida = "";
    bolasEscolhidas = [];

    var botoes = document.querySelectorAll("[data-cone], [data-flavor]");

    for (var i = 0; i < botoes.length; i++) {
        botoes[i].classList.remove("selected");
    }

    atualizarSorvete();
    pegarElemento("feedback").textContent = "";
}

// Atualiza o desenho do sorvete
function atualizarSorvete() {
    var casquinha = pegarElemento("coneShape");
    casquinha.className = "cone-shape";

    if (casquinhaEscolhida != "") {
        casquinha.classList.add(casquinhaEscolhida);
    }

    var desenho = "";

    for (var i = 0; i < bolasEscolhidas.length; i++) {
        var sabor = bolasEscolhidas[i];
        desenho += '<div class="scoop" style="background:' +
            sabores[sabor].cor + '"></div>';
    }

    pegarElemento("scoopStack").innerHTML = desenho;

    if (casquinhaEscolhida != "" && bolasEscolhidas.length > 0) {
        pegarElemento("deliverBtn").disabled = false;
    } else {
        pegarElemento("deliverBtn").disabled = true;
    }
}

// Escolhe a casquinha
pegarElemento("coneChoices").addEventListener("click", function(evento) {
    var botao = evento.target.closest("[data-cone]");

    if (botao == null) {
        return;
    }

    casquinhaEscolhida = botao.getAttribute("data-cone");

    var botoes = document.querySelectorAll("[data-cone]");

    for (var i = 0; i < botoes.length; i++) {
        botoes[i].classList.remove("selected");
    }

    botao.classList.add("selected");
    atualizarSorvete();
});

// Escolhe o sabor
pegarElemento("flavorChoices").addEventListener("click", function(evento) {
    var botao = evento.target.closest("[data-flavor]");

    if (botao == null) {
        return;
    }

    if (bolasEscolhidas.length >= 3) {
        pegarElemento("feedback").textContent = "Máximo de 3 bolas.";
        return;
    }

    bolasEscolhidas.push(botao.getAttribute("data-flavor"));
    atualizarSorvete();
});

// Confere o pedido
pegarElemento("deliverBtn").addEventListener("click", function() {
    var certo = true;

    if (casquinhaEscolhida != pedido.casquinha) {
        certo = false;
    }

    if (bolasEscolhidas.length != pedido.bolas.length) {
        certo = false;
    }

    for (var i = 0; i < pedido.bolas.length; i++) {
        if (bolasEscolhidas[i] != pedido.bolas[i]) {
            certo = false;
        }
    }

    if (certo == true) {
        pegarElemento("feedback").textContent = "Pedido entregue!";
        pegarElemento("deliverBtn").disabled = true;

        setTimeout(function() {
            clienteAtual++;
            mostrarCliente();
        }, 900);
    } else {
        pegarElemento("feedback").textContent = "Pedido incorreto. Tente novamente.";
    }
});

// Inicia o jogo
mostrarCliente();
