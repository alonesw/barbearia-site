import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } 
from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore, collection, addDoc, getDocs, query, where, deleteDoc, doc } 
from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "SUA_API_KEY",
  authDomain: "SEU_AUTH_DOMAIN",
  projectId: "SEU_PROJECT_ID",
  storageBucket: "SEU_STORAGE",
  messagingSenderId: "SEU_ID",
  appId: "SEU_APP_ID"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

let usuarioLogado = null;

window.registrar = async function () {
  try {
    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;

    await createUserWithEmailAndPassword(auth, email, senha);
    alert("Conta criada com sucesso!");
    fecharModal();
  } catch (error) {
    alert(error.message);
  }
};

window.login = async function () {
  try {
    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;

    await signInWithEmailAndPassword(auth, email, senha);
    alert("Login realizado!");
    fecharModal();
  } catch (error) {
    alert(error.message);
  }
};

window.logout = function () {
  signOut(auth);
};

onAuthStateChanged(auth, (user) => {
  if (user) {
    usuarioLogado = user;
    carregarAgendamentos();
  } else {
    usuarioLogado = null;
    document.getElementById("listaAgendamentos").innerHTML =
      "<h3>Seus Agendamentos</h3><p>Faça login para visualizar</p>";
  }
});

window.salvarAgendamento = async function (servico, data, hora) {
  if (!usuarioLogado) {
    alert("Você precisa estar logado!");
    return;
  }

  await addDoc(collection(db, "agendamentos"), {
    userId: usuarioLogado.uid,
    servico,
    data,
    hora
  });

  carregarAgendamentos();
};

async function carregarAgendamentos() {
  const lista = document.getElementById("listaAgendamentos");
  lista.innerHTML = "<h3>Seus Agendamentos</h3>";

  const q = query(
    collection(db, "agendamentos"),
    where("userId", "==", usuarioLogado.uid)
  );

  const snapshot = await getDocs(q);

  snapshot.forEach((docItem) => {
    const dados = docItem.data();

    lista.innerHTML += `
      <div class="agendamento-item">
        <p><strong>${dados.servico}</strong></p>
        <p>${dados.data} às ${dados.hora}</p>
        <button onclick="cancelarAgendamento('${docItem.id}')">
          Cancelar
        </button>
      </div>
    `;
  });
}

window.cancelarAgendamento = async function (id) {
  await deleteDoc(doc(db, "agendamentos", id));
  carregarAgendamentos();
};
