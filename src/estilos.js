import { StyleSheet, Platform } from 'react-native';
import { COR } from './tema';

export const s = StyleSheet.create({
  conteudo: { paddingHorizontal: 18, paddingTop: 8, paddingBottom: 140 },
  marca: { flexDirection: 'row', alignItems: 'center', marginBottom: 18 },
  logo: { width: 26, height: 26, borderRadius: 8, alignItems: 'center', justifyContent: 'center', marginRight: 8 },
  marcaTexto: { color: '#fff', fontWeight: '900', letterSpacing: 3, fontSize: 13 },

  vidro: {
    backgroundColor: COR.vidro, borderColor: COR.borda, borderWidth: 1, borderRadius: 24,
    padding: 18, marginBottom: 12, overflow: 'hidden',
  },
  trilho: { width: '100%', backgroundColor: 'rgba(255,255,255,0.08)', overflow: 'hidden' },

  cabSub: { color: COR.sub, fontSize: 14, marginBottom: 2 },
  cabTitulo: { color: '#fff', fontSize: 32, fontWeight: '800', letterSpacing: -0.5 },
  secao: { color: '#fff', fontSize: 18, fontWeight: '700', marginBottom: 12, marginTop: 4 },
  cardTitulo: { color: '#fff', fontSize: 16, fontWeight: '700' },
  rotulo: { color: COR.sub, fontSize: 12, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.8 },
  mini: { color: COR.sub, fontSize: 12 },
  numeroGrande: { color: '#fff', fontSize: 38, fontWeight: '800', marginTop: 4, letterSpacing: -1, fontVariant: ['tabular-nums'] },
  anelNumero: { color: COR.texto, fontSize: 28, fontWeight: '800', letterSpacing: -0.5, fontVariant: ['tabular-nums'] },
  miniForte: { color: COR.texto, fontWeight: '700' },
  divisor: { height: 1, backgroundColor: COR.borda, marginVertical: 16 },
  pilula: { height: 34, paddingHorizontal: 16, borderRadius: 17, backgroundColor: COR.vidroForte, alignItems: 'center', justifyContent: 'center' },
  vazio: { paddingVertical: 14, borderRadius: 14, borderWidth: 1, borderStyle: 'dashed', borderColor: COR.borda, alignItems: 'center' },
  numeroUnidade: { color: COR.sub, fontSize: 15, fontWeight: '500', letterSpacing: 0 },
  numeroMedio: { color: '#fff', fontSize: 22, fontWeight: '800', fontVariant: ['tabular-nums'] },

  selo: { backgroundColor: COR.acentoFundo, borderColor: COR.acentoBorda, borderWidth: 1, borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 },
  seloTexto: { color: COR.acento, fontSize: 12, fontWeight: '700' },

  botao: { height: 54, borderRadius: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 16 },
  botaoSec: { backgroundColor: COR.vidro, borderWidth: 1, borderColor: COR.borda },
  botaoTexto: { color: '#fff', fontWeight: '700', fontSize: 15 },
  botaoAgua: { height: 46, borderRadius: 14, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(79,195,247,0.12)', borderWidth: 1, borderColor: 'rgba(79,195,247,0.3)' },

  chip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, backgroundColor: COR.vidro, borderWidth: 1, borderColor: COR.borda },
  chipAtivo: { backgroundColor: COR.acento, borderColor: COR.acento },
  chipTexto: { color: COR.sub, fontWeight: '600', fontSize: 13 },

  iconeRedondo: { width: 48, height: 48, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  iconeBotao: { width: 44, height: 44, borderRadius: 22, backgroundColor: COR.vidro, borderWidth: 1, borderColor: COR.borda, alignItems: 'center', justifyContent: 'center' },

  linhaSerie: { flexDirection: 'row', alignItems: 'center', paddingVertical: 6, paddingHorizontal: 4, borderRadius: 12, marginBottom: 4 },
  colSerie: { width: 44, textAlign: 'center' },
  colInput: { flex: 1, marginHorizontal: 5 },
  inputSerie: { height: 44, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.08)', color: '#fff', textAlign: 'center', fontSize: 16, fontWeight: '700' },
  check: { width: 44, height: 44, borderRadius: 12, borderWidth: 1, borderColor: COR.borda, alignItems: 'center', justifyContent: 'center' },
  addSerie: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 10, marginTop: 4, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.04)' },

  itemAlimento: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.06)' },
  input: { height: 50, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.08)', color: '#fff', paddingHorizontal: 14, fontSize: 16, marginTop: 6, borderWidth: 1, borderColor: COR.borda },

  modalFundo: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)' },
  folha: { backgroundColor: '#121418', borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 20, paddingBottom: 36, borderWidth: 1, borderColor: COR.borda },
  alca: { width: 44, height: 5, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.25)', alignSelf: 'center', marginBottom: 14 },
  busca: { flexDirection: 'row', alignItems: 'center', height: 48, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.08)', paddingHorizontal: 14, marginBottom: 10 },
  buscaInput: { flex: 1, color: '#fff', marginLeft: 8, fontSize: 15 },
  itemLista: { flexDirection: 'row', alignItems: 'center', padding: 14, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.04)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)', marginBottom: 8 },

  barraWrap: { position: 'absolute', left: 16, right: 16, borderRadius: 30, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255,255,255,0.16)' },
  barra: { flexDirection: 'row', paddingVertical: 8, paddingHorizontal: 6, backgroundColor: Platform.OS === 'android' ? 'rgba(18,20,24,0.96)' : 'rgba(18,20,24,0.86)' },
  abaBotao: { flex: 1, alignItems: 'center' },
  abaIcone: { width: 52, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  abaTexto: { color: COR.sub, fontSize: 11, marginTop: 2, fontWeight: '600' },
  pontoAtivo: { position: 'absolute', top: 3, right: 10, width: 8, height: 8, borderRadius: 4, backgroundColor: COR.acento },
});
