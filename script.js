let logado = false;
let agendamentos = [];
let servicoSelecionado = "";

const modalLogin = document.getElementById("modalLogin");
const modalAgendamento = document.getElementById("modalAgendamento");
const modalSucesso = document.getElementById("modalSucesso");

const loginText = document.getElementById("loginText");
const fecharLogin = document.getElementById("fecharLogin");
const fecharAgendamento = document.getElementById("fecharAgendamento");
const fecharSucesso = document.getElementById("fecharSucesso");

const btnLogin = document.getElementById("btnLogin");
const botoesAgendar = document.querySelectorAll(".agendar");
const confirmarAgendamento = document.getElementById("confirmarAgendamento");

const sidebar = document.getElementById("sidebar");
const toggleSidebar = document.getElementById("toggleSidebar");
const listaAgendamentos = document.getElementById("listaAgendamentos");

/* LOGIN */
loginText.addEventListener("click", () => {
    modalLogin.style.display = "flex";
});

fecharLogin.addEventListener("click", () => {
    modalLogin.style.display = "none";
});

btnLogin.addEventListener("click", () => {
    const usuario = document.getElementById("usuario").value;
    const senha = document.getElementById("senha").value;

    if(usuario && senha) {
        logado = true;
        loginText.innerText = "Bem-vindo!";
        modalLogin.style.display = "none";
    }
});

/* AGENDAR */
botoesAgendar.forEach(botao => {
    botao.addEventListener("click", () => {

        if(!logado) {
            modalLogin.style.display = "flex";
            return;
        }

        servicoSelecionado = botao.parentElement.querySelector("h2").innerText;
        modalAgendamento.style.display = "flex";
    });
});

confirmarAgendamento.addEventListener("click", () => {
    const data = document.getElementById("data").value;
    const hora = document.getElementById("hora").value;

    if(data && hora) {
        agendamentos.push({
            servico: servicoSelecionado,
            data,
            hora
        });

        atualizarLista();
        modalAgendamento.style.display = "none";
        modalSucesso.style.display = "flex";
    }
});

fecharAgendamento.addEventListener("click", () => {
    modalAgendamento.style.display = "none";
});

fecharSucesso.addEventListener("click", () => {
    modalSucesso.style.display = "none";
});

/* SIDEBAR */
toggleSidebar.addEventListener("click", () => {
    sidebar.classList.toggle("ativa");

    if(sidebar.classList.contains("ativa")) {
        toggleSidebar.innerHTML = "❮";
    } else {
        toggleSidebar.innerHTML = "❯";
    }
});

/* ATUALIZAR LISTA */
function atualizarLista() {
    listaAgendamentos.innerHTML = "";

    agendamentos.forEach((item, index) => {

        const div = document.createElement("div");
        div.classList.add("agendamento-item");

        div.innerHTML = `
            <strong>${item.servico}</strong>
            <span>Data: ${item.data}</span>
            <span>Horário: ${item.hora}</span>
            <button class="editar">Alterar</button>
            <button class="cancelar">Cancelar</button>
        `;

        div.querySelector(".cancelar").addEventListener("click", () => {
            agendamentos.splice(index, 1);
            atualizarLista();
        });

        div.querySelector(".editar").addEventListener("click", () => {
            servicoSelecionado = item.servico;
            agendamentos.splice(index, 1);
            atualizarLista();
            modalAgendamento.style.display = "flex";
        });

        listaAgendamentos.appendChild(div);
    });
}
