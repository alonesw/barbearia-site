import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } 
from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore, collection, addDoc, getDocs, query, where } 
from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "SUA_API_KEY_AQUI",
  authDomain: "SEU_AUTH_DOMAIN",
  projectId: "SEU_PROJECT_ID",
  storageBucket: "SEU_STORAGE",
  messagingSenderId: "SEU_MESSAGING_ID",
  appId: "SEU_APP_ID"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

let usuarioLogado = null;

window.registrar = function () {
  const email = document.getElementById("email").value;
  const senha = document.getElementById("senha").value;

  createUserWithEmailAndPassword(auth, email, senha)
    .then(() => {
      alert("Conta criada!");
      document.getElementById("modalLogin").style.display = "none";
    })
    .catch(error => alert(error.message));
};

window.login = function () {
  const email = document.getElementById("email").value;
  const senha = document.getElementById("senha").value;

  signInWithEmailAndPassword(auth, email, senha)
    .then(() => {
      alert("Login realizado!");
      document.getElementById("modalLogin").style.display = "none";
    })
    .catch(error => alert(error.message));
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
    document.getElementById("listaAgendamentos").innerHTML = "";
  }
});

window.salvarAgendamento = async function (servico, data, hora) {
  if (!usuarioLogado) {
    alert("Faça login primeiro!");
    return;
  }

  await addDoc(collection(db, "agendamentos"), {
    userId: usuarioLogado.uid,
    servico,
    data,
    hora
  });

  alert("Agendamento realizado!");
  carregarAgendamentos();
};

async function carregarAgendamentos() {
  const lista = document.getElementById("listaAgendamentos");
  lista.innerHTML = "<h3>Seus Agendamentos:</h3>";

  const q = query(
    collection(db, "agendamentos"),
    where("userId", "==", usuarioLogado.uid)
  );

  const snapshot = await getDocs(q);

  snapshot.forEach((doc) => {
    const dados = doc.data();
    lista.innerHTML += `<p>${dados.servico} - ${dados.data} às ${dados.hora}</p>`;
  });
}
