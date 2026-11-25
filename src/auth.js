// Contas do UPPER LIFE — guardadas só neste aparelho (AsyncStorage).
// A senha nunca é salva: guardamos um hash SHA-256 de "sal:senha",
// com um sal aleatório diferente para cada conta.

import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Crypto from 'expo-crypto';

const CONTAS = 'upperlife:contas';
const SESSAO = 'upperlife:sessao';

const normalizar = (email) => email.trim().toLowerCase();
export const emailValido = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

const lerContas = async () => {
  try { return JSON.parse(await AsyncStorage.getItem(CONTAS)) || {}; } catch (e) { return {}; }
};
const salvarContas = (contas) => AsyncStorage.setItem(CONTAS, JSON.stringify(contas));
const gerarHash = (sal, senha) => Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, `${sal}:${senha}`);

// o que o resto do app enxerga de uma conta (nunca o hash)
const publico = (c) => ({ nome: c.nome, email: c.email, provedor: c.provedor, foto: c.foto || null });

const abrirSessao = async (conta) => {
  await AsyncStorage.setItem(SESSAO, JSON.stringify({ email: conta.email }));
  return publico(conta);
};

export async function carregarSessao() {
  try {
    const sessao = JSON.parse(await AsyncStorage.getItem(SESSAO));
    if (!sessao) return null;
    const contas = await lerContas();
    return contas[sessao.email] ? publico(contas[sessao.email]) : null;
  } catch (e) {
    return null;
  }
}

export async function registrar({ nome, email, senha }) {
  const chave = normalizar(email);
  const contas = await lerContas();
  if (contas[chave]) throw new Error('Já existe uma conta com este e-mail. Toque em "Entrar" para acessar.');
  const sal = Crypto.randomUUID();
  const conta = { nome: nome.trim(), email: chave, provedor: 'email', sal, hash: await gerarHash(sal, senha), criadaEm: Date.now() };
  await salvarContas({ ...contas, [chave]: conta });
  return abrirSessao(conta);
}

export async function entrar({ email, senha }) {
  const conta = (await lerContas())[normalizar(email)];
  if (!conta) throw new Error('Não encontramos uma conta com este e-mail neste aparelho. Crie uma conta para começar.');
  if (!conta.hash) throw new Error('Esta conta foi criada com o Google. Use "Continuar com Google".');
  if ((await gerarHash(conta.sal, senha)) !== conta.hash) throw new Error('E-mail e senha não conferem. Confira e tente de novo.');
  return abrirSessao(conta);
}

// perfil = resposta de https://www.googleapis.com/userinfo/v2/me
export async function entrarComGoogle(perfil) {
  if (!perfil || !perfil.email) throw new Error('O Google não enviou seu e-mail. Tente de novo.');
  const chave = normalizar(perfil.email);
  const contas = await lerContas();
  const existente = contas[chave];
  const conta = {
    ...existente,
    email: chave,
    nome: (existente && existente.nome) || perfil.name || perfil.given_name || chave.split('@')[0],
    foto: perfil.picture || (existente && existente.foto) || null,
    provedor: existente ? existente.provedor : 'google',
    google: true,
    criadaEm: (existente && existente.criadaEm) || Date.now(),
  };
  await salvarContas({ ...contas, [chave]: conta });
  return abrirSessao(conta);
}

export const encerrarSessao = () => AsyncStorage.removeItem(SESSAO);
