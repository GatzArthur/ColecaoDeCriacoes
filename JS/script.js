// ==========================================
// COLEÇÃO DE CRIAÇÕES
// ==========================================
// Um único arquivo cuida de tudo: a galeria pública e o modo admin.
// O modo admin só aparece depois de digitar a senha correta.

// ==========================================
// CONFIGURAÇÃO DA SENHA
// ==========================================
const SENHA_HASH = "01d025d94c28e748cb8dd5e087db1a1a88b456c42225837522bb50adfc96aee2";


// ==========================================
// ESTADO
// ==========================================

let projetos = (typeof projetosIniciais !== "undefined") ? projetosIniciais.slice() : [];

let adminDesbloqueado = sessionStorage.getItem("adminDesbloqueado") === "true";

// Se já está em modo admin (mesma aba), recupera rascunho não exportado ainda
if (adminDesbloqueado) {
    const rascunho = localStorage.getItem("projetosAdmin");
    if (rascunho) {
        projetos = JSON.parse(rascunho);
    }
}


// ==========================================
// ELEMENTOS
// ==========================================

const modal = document.getElementById("modal");
const modalImagem = document.getElementById("modalImagem");
const modalExportar = document.getElementById("modalExportar");
const modalLogin = document.getElementById("modalLogin");

const galeria = document.getElementById("galeria");
const mensagemVazia = document.getElementById("mensagemVazia");
const textoVazio = document.getElementById("textoVazio");

const contador = document.getElementById("contador");

const form = document.getElementById("formProjeto");
const formLogin = document.getElementById("formLogin");
const erroLogin = document.getElementById("erroLogin");

const btnAdmin = document.getElementById("btnAdmin");
const btnSair = document.getElementById("btnSair");
const badgeAdmin = document.getElementById("badgeAdmin");
const elementosAdmin = document.querySelectorAll(".admin-only");


// ==========================================
// LOGIN ADMIN
// ==========================================

function abrirLogin() {
    modalLogin.classList.add("active");
    document.getElementById("senhaAdmin").focus();
}

function fecharLogin() {
    modalLogin.classList.remove("active");
    erroLogin.style.display = "none";
    formLogin.reset();
}

modalLogin.addEventListener("click", function(event) {
    if (event.target === modalLogin) {
        fecharLogin();
    }
});

async function calcularHash(texto) {
    const dados = new TextEncoder().encode(texto);
    const buffer = await crypto.subtle.digest("SHA-256", dados);
    return Array.from(new Uint8Array(buffer))
        .map(b => b.toString(16).padStart(2, "0"))
        .join("");
}

formLogin.addEventListener("submit", async function(event) {

    event.preventDefault();

    const senhaDigitada = document.getElementById("senhaAdmin").value;
    const hashDigitado = await calcularHash(senhaDigitada);

    if (hashDigitado === SENHA_HASH) {
        entrarAdmin();
        fecharLogin();
    } else {
        erroLogin.style.display = "block";
    }

});

function entrarAdmin() {

    adminDesbloqueado = true;
    sessionStorage.setItem("adminDesbloqueado", "true");

    // Carrega rascunho salvo, se existir; senão parte dos dados publicados
    const rascunho = localStorage.getItem("projetosAdmin");
    projetos = rascunho ? JSON.parse(rascunho) : projetos;

    atualizarVisibilidadeAdmin();
    renderizarProjetos();

}

function sairAdmin() {
    adminDesbloqueado = false;
    sessionStorage.removeItem("adminDesbloqueado");
    projetos = (typeof projetosIniciais !== "undefined") ? projetosIniciais.slice() : [];
    atualizarVisibilidadeAdmin();
    renderizarProjetos();
}

function atualizarVisibilidadeAdmin() {

    btnAdmin.style.display = adminDesbloqueado ? "none" : "inline-flex";
    btnSair.style.display = adminDesbloqueado ? "inline-flex" : "none";
    badgeAdmin.style.display = adminDesbloqueado ? "inline-flex" : "none";

    elementosAdmin.forEach(function(el) {
        el.style.display = adminDesbloqueado ? "inline-flex" : "none";
    });

    textoVazio.textContent = adminDesbloqueado
        ? "Comece adicionando sua primeira criação."
        : "Nenhuma criação foi publicada ainda.";

}


// ==========================================
// ABRIR / FECHAR MODAL ADICIONAR
// ==========================================

function abrirModal() {
    if (!adminDesbloqueado) return;
    modal.classList.add("active");
}

function fecharModal() {
    modal.classList.remove("active");
    form.reset();
}

modal.addEventListener("click", function(event) {
    if (event.target === modal) {
        fecharModal();
    }
});


// ==========================================
// ADICIONAR PROJETO
// ==========================================

function lerComoDataURL(arquivo) {
    return new Promise(function(resolve, reject) {
        const leitor = new FileReader();
        leitor.onload = function(e) { resolve(e.target.result); };
        leitor.onerror = reject;
        leitor.readAsDataURL(arquivo);
    });
}

// Mostra uma pequena prévia de quantas imagens foram selecionadas
document.getElementById("imagem").addEventListener("change", function(event) {
    const previa = document.getElementById("previaImagens");
    const qtd = event.target.files.length;
    previa.textContent = qtd === 0
        ? ""
        : qtd === 1
            ? "1 imagem selecionada"
            : qtd + " imagens selecionadas";
});

form.addEventListener("submit", async function(event) {

    event.preventDefault();

    if (!adminDesbloqueado) return;

    const titulo = document.getElementById("titulo").value;
    const descricao = document.getElementById("descricao").value;
    const arquivos = Array.from(document.getElementById("imagem").files);

    if (arquivos.length === 0) {
        alert("Selecione pelo menos uma imagem.");
        return;
    }

    const botaoSubmit = form.querySelector(".btn-submit");
    botaoSubmit.disabled = true;
    botaoSubmit.textContent = "Processando imagens...";

    try {

        const imagens = await Promise.all(arquivos.map(lerComoDataURL));

        const novoProjeto = {
            id: Date.now(),
            titulo: titulo,
            descricao: descricao,
            imagens: imagens
        };

        projetos.push(novoProjeto);

        salvarRascunho();
        renderizarProjetos();
        fecharModal();

    } finally {
        botaoSubmit.disabled = false;
        botaoSubmit.textContent = "Adicionar à coleção";
        document.getElementById("previaImagens").textContent = "";
    }

});

function salvarRascunho() {
    localStorage.setItem("projetosAdmin", JSON.stringify(projetos));
}


// ==========================================
// RENDERIZAR PROJETOS
// ==========================================

function obterImagens(projeto) {
    if (Array.isArray(projeto.imagens) && projeto.imagens.length > 0) {
        return projeto.imagens;
    }
    if (projeto.imagem) {
        return [projeto.imagem];
    }
    return [];
}

function renderizarProjetos() {

    galeria.innerHTML = "";

    contador.textContent =
        projetos.length +
        (projetos.length === 1 ? " criação" : " criações");

    if (projetos.length === 0) {
        mensagemVazia.style.display = "block";
        return;
    }

    mensagemVazia.style.display = "none";

    projetos.forEach(function(projeto, index) {

        const card = document.createElement("article");
        card.className = "card";

        const imagens = obterImagens(projeto);
        const temVarias = imagens.length > 1;

        card.innerHTML = `

            <div class="card-image-wrapper">

                <img
                    class="card-image"
                    src="${imagens[0]}"
                    alt="${projeto.titulo}"
                >

                ${temVarias ? `
                    <span class="card-image-badge">
                        +${imagens.length - 1}
                    </span>
                ` : ""}

            </div>

            <div class="card-content">

                <h3 class="card-title">
                    ${projeto.titulo}
                </h3>

                <p class="card-description">
                    ${projeto.descricao}
                </p>

                <div class="card-footer">

                    <span class="card-number">
                        CRIAÇÃO ${String(index + 1).padStart(2, "0")}
                    </span>

                    ${adminDesbloqueado ? `
                        <button class="btn-delete" onclick="excluirProjeto(${projeto.id})">
                            Excluir
                        </button>
                    ` : ""}

                </div>

            </div>

        `;

        card.querySelector(".card-image").addEventListener("click", function() {
            abrirImagem(imagens, 0);
        });

        galeria.appendChild(card);

    });

}


// ==========================================
// EXCLUIR PROJETO
// ==========================================

function excluirProjeto(id) {

    if (!adminDesbloqueado) return;

    const confirmar = confirm("Deseja realmente excluir esta criação?");
    if (!confirmar) return;

    projetos = projetos.filter(function(projeto) {
        return projeto.id !== id;
    });

    salvarRascunho();
    renderizarProjetos();

}


// ==========================================
// EXPORTAR / GERAR ARQUIVO projetos-data.js
// ==========================================

function gerarConteudoArquivo() {

    return "// ==========================================\n" +
        "// DADOS DOS PROJETOS\n" +
        "// ==========================================\n" +
        "// Gerado no modo admin em " + new Date().toLocaleString("pt-BR") + "\n\n" +
        "const projetosIniciais = " + JSON.stringify(projetos, null, 4) + ";\n";

}

function abrirExportar() {
    if (!adminDesbloqueado) return;
    document.getElementById("previaExportar").textContent = gerarConteudoArquivo();
    modalExportar.classList.add("active");
}

function fecharExportar() {
    modalExportar.classList.remove("active");
}

modalExportar.addEventListener("click", function(event) {
    if (event.target === modalExportar) {
        fecharExportar();
    }
});

function baixarArquivoDados() {

    if (!adminDesbloqueado) return;

    const conteudo = gerarConteudoArquivo();
    const blob = new Blob([conteudo], { type: "text/javascript" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "projetos-data.js";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);

}


// ==========================================
// ABRIR / FECHAR / NAVEGAR IMAGEM GRANDE
// ==========================================

let imagensAtuais = [];
let indiceAtual = 0;

const btnImagemAnterior = document.getElementById("btnImagemAnterior");
const btnImagemProxima = document.getElementById("btnImagemProxima");
const contadorImagens = document.getElementById("contadorImagens");

function abrirImagem(imagens, indiceInicial) {
    imagensAtuais = imagens;
    indiceAtual = indiceInicial || 0;
    mostrarImagemAtual();
    modalImagem.classList.add("active");
}

function mostrarImagemAtual() {

    const imagemGrande = document.getElementById("imagemGrande");
    imagemGrande.src = imagensAtuais[indiceAtual];

    const temVarias = imagensAtuais.length > 1;

    btnImagemAnterior.style.display = temVarias ? "flex" : "none";
    btnImagemProxima.style.display = temVarias ? "flex" : "none";
    contadorImagens.style.display = temVarias ? "block" : "none";

    if (temVarias) {
        contadorImagens.textContent = (indiceAtual + 1) + " / " + imagensAtuais.length;
    }

}

function proximaImagem() {
    indiceAtual = (indiceAtual + 1) % imagensAtuais.length;
    mostrarImagemAtual();
}

function imagemAnterior() {
    indiceAtual = (indiceAtual - 1 + imagensAtuais.length) % imagensAtuais.length;
    mostrarImagemAtual();
}

function fecharImagem() {
    modalImagem.classList.remove("active");
}

modalImagem.addEventListener("click", function(event) {
    if (event.target === modalImagem) {
        fecharImagem();
    }
});


// ==========================================
// ESC FECHA QUALQUER MODAL ABERTO
// ==========================================

document.addEventListener("keydown", function(event) {

    if (event.key === "Escape") {
        fecharModal();
        fecharExportar();
        fecharImagem();
        fecharLogin();
    }

    if (modalImagem.classList.contains("active") && imagensAtuais.length > 1) {
        if (event.key === "ArrowRight") proximaImagem();
        if (event.key === "ArrowLeft") imagemAnterior();
    }

});


// ==========================================
// INICIAR
// ==========================================

atualizarVisibilidadeAdmin();
renderizarProjetos();