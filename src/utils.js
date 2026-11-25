import { PROTOCOLOS } from './dados';
import { s } from './estilos';

export const CHAVE = 'upperlife:v1';
export const DESCANSO_SEG = 90;

export const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
export const num = (v) => { const n = parseFloat(String(v).replace(',', '.')); return isNaN(n) ? 0 : n; };
export const fmt = (n) => Math.round(n).toLocaleString('pt-BR');
export const pad = (n) => String(n).padStart(2, '0');
export const chaveData = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
export const hoje = () => chaveData(new Date());
export const diaOffset = (dias) => { const d = new Date(); d.setDate(d.getDate() + dias); return chaveData(d); };
export const relogio = (seg) => {
  const h = Math.floor(seg / 3600), m = Math.floor((seg % 3600) / 60), s = seg % 60;
  return h > 0 ? `${h}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`;
};
export const DIAS = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];
export const DIAS_CURTOS = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
export const MESES = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
export const dataExtenso = () => {
  const d = new Date(); const dia = DIAS[d.getDay()];
  return `${dia[0].toUpperCase()}${dia.slice(1)}, ${d.getDate()} de ${MESES[d.getMonth()]}`;
};
export const dataCurta = (chave) => { const [a, m, d] = chave.split('-'); return `${d}/${m}`; };

export const criarItem = (alimento, gramas, refeicao) => {
  const f = gramas / 100;
  return {
    id: uid(), nome: alimento.nome, gramas, refeicao,
    kcal: alimento.kcal * f, p: alimento.p * f, c: alimento.c * f, g: alimento.g * f,
  };
};
export const somar = (itens) => itens.reduce(
  (t, i) => ({ kcal: t.kcal + i.kcal, p: t.p + i.p, c: t.c + i.c, g: t.g + i.g }),
  { kcal: 0, p: 0, c: 0, g: 0 },
);
export const volumeDe = (exercicios, soFeitas) => exercicios.reduce(
  (t, e) => t + e.series.reduce((s, x) => (soFeitas && !x.feito ? s : s + num(x.peso) * num(x.reps)), 0),
  0,
);
export const calcularMetas = (perfil) => {
  const proto = PROTOCOLOS.find((x) => x.id === perfil.objetivo) || PROTOCOLOS[1];
  const kcal = proto.id === 'personalizado' ? num(perfil.metaPersonalizada) || 2200 : proto.kcal;
  const peso = num(perfil.peso) || 70;
  const p = Math.round(peso * 2);
  const g = Math.round(peso * 0.9);
  const c = Math.max(0, Math.round((kcal - p * 4 - g * 9) / 4));
  const agua = Math.round((peso * 35) / 250) * 250;
  return { kcal, p, c, g, agua, protocolo: proto.nome };
};
export const novaSerie = () => ({ id: uid(), peso: '', reps: '', feito: false });

// Constância: quantos dias diferentes a pessoa treinou e as sequências de dias seguidos.
// A sequência atual continua valendo se o último treino foi hoje ou ontem.
export const constancia = (historico) => {
  const dias = new Set(historico.map((h) => h.data));
  const umDia = 86400000;
  const meioDia = (chave) => new Date(`${chave}T12:00:00`).getTime();

  let recorde = 0, corrente = 0, anterior = null;
  [...dias].sort().forEach((chave) => {
    const t = meioDia(chave);
    corrente = anterior !== null && Math.round((t - anterior) / umDia) === 1 ? corrente + 1 : 1;
    recorde = Math.max(recorde, corrente);
    anterior = t;
  });

  const treinouHoje = dias.has(hoje());
  let atual = 0;
  for (let i = treinouHoje ? 0 : 1; dias.has(diaOffset(-i)); i++) atual++;

  return { total: dias.size, atual, recorde, treinouHoje };
};

export const ESTADO_INICIAL = {
  perfil: { nome: '', peso: '75', objetivo: 'manter', metaPersonalizada: '2500' },
  diario: {},
  historico: [],
  sessao: null,
};
