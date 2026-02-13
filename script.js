// 🔥 IMPORTAÇÕES FIREBASE
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  onAuthStateChanged, 
  signOut 
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

import { 
  getFirestore, 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  deleteDoc, 
  doc 
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";


// 🔥 COLE A CONFIG REAL DO SEU FIREBASE AQUI
const firebaseConfig = {
  apiKey: "COLE_AQUI_SUA_API_KEY_REAL",
  authDomain: "COLE_AQUI.firebaseapp.com",
  projectId: "COLE_AQUI",
  storageBucket: "COLE_AQUI.appspot.com",
  messagingSenderId: "COLE_AQUI",
  appId: "COLE_AQUI"
};


// 🔥 INICIALIZA
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

let usuarioLogado = null;


// =============================
// 🔐 REGISTRAR
// =============================
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


// =============================
// 🔑 LOGIN
// =============================
window.login = async function () {
  try {
    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;

    await signInWithEmailAndPassword(auth, email, senha);
    alert("Login realizado com sucesso!");
    fecharModal();
  } catch (error) {
    alert(error.message);
  }
};


// =============================
// 🚪 LOGOUT
// =============================
window.logout = function () {
  signOut(auth);
};


// =============================
// 👤 VERIFICA LOGIN
// =============================
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


// =============================
// 💾 SALVAR AGENDAMENTO
// =============================
window.salvarAgendamento = async function (servico, data, hora) {

  if (!usuarioLogado) {
    alert("Você precisa estar logado!");
    return;
  }

  try {
    await addDoc(collection(db, "agendamentos"), {
      userId: usuarioLogado.uid,
      servico,
      data,
      hora,
      criadoEm: new Date()
    });

    carregarAgendamentos();
  } catch (error) {
    alert(error.message);
  }
};


// =============================
// 📅 CARREGAR AGENDAMENTOS
// =============================
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


// =============================
// ❌ CANCELAR AGENDAMENTO
// =============================
window.cancelarAgendamento = async function (id) {
  await deleteDoc(doc(db, "agendamentos", id));
  carregarAgendamentos();
};
