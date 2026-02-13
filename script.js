// 🔥 IMPORTAÇÕES DO FIREBASE (CDN)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } 
from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore, collection, addDoc } 
from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// 🔥 CONFIG DO SEU PROJETO
const firebaseConfig = {
  apiKey: "AIzaSyCDh3qhr32hVR1pdtndXRJ-7EEgSh6J15Q",
  authDomain: "barbearia-site-a8f97.firebaseapp.com",
  projectId: "barbearia-site-a8f97",
  storageBucket: "barbearia-site-a8f97.firebasestorage.app",
  messagingSenderId: "426142172316",
  appId: "1:426142172316:web:7c5ad6c2147b40b1a21959",
  measurementId: "G-DLG7KEP94V"
};

// 🔥 INICIALIZA FIREBASE
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

let usuarioLogado = null;

// ===============================
// 🔐 CADASTRO
// ===============================
window.registrar = function () {
  const email = document.getElementById("email").value;
  const senha = document.getElementById("senha").value;

  createUserWithEmailAndPassword(auth, email, senha)
    .then(() => {
      alert("Conta criada com sucesso!");
    })
    .catch(error => {
      alert("Erro: " + error.message);
    });
};

// ===============================
// 🔑 LOGIN
// ===============================
window.login = function () {
  const email = document.getElementById("email").value;
  const senha = document.getElementById("senha").value;

  signInWithEmailAndPassword(auth, email, senha)
    .then(() => {
      alert("Login realizado com sucesso!");
    })
    .catch(error => {
      alert("Erro: " + error.message);
    });
};

// ===============================
// 🚪 LOGOUT
// ===============================
window.logout = function () {
  signOut(auth);
};

// ===============================
// 👤 VERIFICA SE ESTÁ LOGADO
// ===============================
onAuthStateChanged(auth, (user) => {
  if (user) {
    usuarioLogado = user;
    console.log("Usuário logado:", user.email);
  } else {
    usuarioLogado = null;
    console.log("Nenhum usuário logado");
  }
});

// ===============================
// 💾 SALVAR AGENDAMENTO
// ===============================
window.salvarAgendamento = async function (servico, data, hora) {

  if (!usuarioLogado) {
    alert("Você precisa estar logado para agendar!");
    return;
  }

  try {
    await addDoc(collection(db, "agendamentos"), {
      userId: usuarioLogado.uid,
      email: usuarioLogado.email,
      servico: servico,
      data: data,
      hora: hora,
      criadoEm: new Date()
    });

    alert("Agendamento realizado com sucesso!");

  } catch (error) {
    alert("Erro ao salvar: " + error.message);
  }
};
