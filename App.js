// UPPER LIFE — treino e nutrição num app só
// React Native + Expo · dados salvos no aparelho (AsyncStorage)

import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, ScrollView, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BarraAbas from './src/componentes/BarraAbas';
import Home from './src/telas/Home';
import ModalAlimento from './src/componentes/ModalAlimento';
import ModalExercicio from './src/componentes/ModalExercicio';
import Nutricao from './src/telas/Nutricao';
import Perfil from './src/telas/Perfil';
import SessaoAtiva from './src/telas/SessaoAtiva';
import Treinos from './src/telas/Treinos';
import Autenticacao from './src/telas/Autenticacao';
import { carregarSessao, encerrarSessao } from './src/auth';
import { ALIMENTOS, MODELOS_TREINO } from './src/dados';
import { CHAVE, uid, num, fmt, hoje, diaOffset, criarItem, somar, calcularMetas, novaSerie, ESTADO_INICIAL } from './src/utils';
import { COR } from './src/tema';
import { Fundo } from './src/componentes/ui';
import { s } from './src/estilos';

const LEGADO_MIGRADO = 'upperlife:legadoMigrado';

function Principal({ usuario, sair }) {
  const chave = `${CHAVE}:${usuario.email}`; // cada conta tem os próprios dados
  const [dados, setDados] = useState(ESTADO_INICIAL);
  const [carregado, setCarregado] = useState(false);
  const [aba, setAba] = useState('home');
  const [agora, setAgora] = useState(Date.now());
  const [modalAlimento, setModalAlimento] = useState(null); // nome da refeição ou null
  const [modalExercicio, setModalExercicio] = useState(false);

  // carregar / salvar no aparelho
  useEffect(() => {
    (async () => {
      try {
        let bruto = await AsyncStorage.getItem(chave);
        // dados de antes do login (versão 1.0) vão para a primeira conta que entrar
        if (!bruto && !(await AsyncStorage.getItem(LEGADO_MIGRADO))) {
          bruto = await AsyncStorage.getItem(CHAVE);
          await AsyncStorage.setItem(LEGADO_MIGRADO, '1');
        }
        const salvo = bruto ? JSON.parse(bruto) : {};
        const perfil = { ...ESTADO_INICIAL.perfil, ...(salvo.perfil || {}) };
        if (!perfil.nome) perfil.nome = usuario.nome.split(' ')[0];
        setDados({ ...ESTADO_INICIAL, ...salvo, perfil });
      } catch (e) { /* começa do zero */ }
      setCarregado(true);
    })();
  }, []);
  useEffect(() => {
    if (carregado) AsyncStorage.setItem(chave, JSON.stringify(dados)).catch(() => {});
  }, [dados, carregado]);

  // cronômetro da sessão
  const idSessao = dados.sessao ? dados.sessao.id : null;
  useEffect(() => {
    if (!idSessao) return undefined;
    setAgora(Date.now());
    const t = setInterval(() => setAgora(Date.now()), 1000);
    return () => clearInterval(t);
  }, [idSessao]);

  const dia = hoje();
  const registro = dados.diario[dia] || { refeicoes: [], agua: 0 };
  const metas = useMemo(() => calcularMetas(dados.perfil), [dados.perfil]);
  const totais = useMemo(() => somar(registro.refeicoes), [registro.refeicoes]);

  const anteriores = useMemo(() => {
    const mapa = {};
    dados.historico.forEach((h) => h.exercicios.forEach((e) => {
      if (!mapa[e.nome] && e.series.length) {
        const melhor = e.series.reduce((a, b) => (b.peso * b.reps > a.peso * a.reps ? b : a));
        mapa[e.nome] = `${melhor.peso} kg × ${melhor.reps}`;
      }
    }));
    return mapa;
  }, [dados.historico]);

  // ações
  const atualizarHoje = (fn) => setDados((d) => {
    const atual = d.diario[dia] || { refeicoes: [], agua: 0 };
    return { ...d, diario: { ...d.diario, [dia]: fn(atual) } };
  });
  const mudarPerfil = (campos) => setDados((d) => ({ ...d, perfil: { ...d.perfil, ...campos } }));
  const atualizarSessao = (fn) => setDados((d) => (d.sessao ? { ...d, sessao: fn(d.sessao) } : d));

  const iniciarTreino = (modelo) => {
    if (dados.sessao) { setAba('treinos'); return; }
    setDados((d) => ({
      ...d,
      sessao: {
        id: uid(), nome: modelo.nome, inicio: Date.now(), descansoAte: 0,
        exercicios: modelo.exercicios.map((nome) => ({ id: uid(), nome, series: [novaSerie(), novaSerie(), novaSerie()] })),
      },
    }));
  };

  const finalizarTreino = () => {
    const ss = dados.sessao;
    const exercicios = ss.exercicios
      .map((e) => ({ nome: e.nome, series: e.series.filter((x) => x.feito).map((x) => ({ peso: num(x.peso), reps: num(x.reps) })) }))
      .filter((e) => e.series.length);
    if (!exercicios.length) {
      Alert.alert('Nenhuma série concluída', 'Marque pelo menos uma série com ✓ antes de finalizar.');
      return;
    }
    const volume = exercicios.reduce((t, e) => t + e.series.reduce((a, x) => a + x.peso * x.reps, 0), 0);
    const series = exercicios.reduce((t, e) => t + e.series.length, 0);
    Alert.alert('Finalizar treino?', `${series} séries · ${fmt(volume)} kg de volume`, [
      { text: 'Continuar treinando', style: 'cancel' },
      {
        text: 'Finalizar',
        onPress: () => {
          setDados((d) => ({
            ...d, sessao: null,
            historico: [{ id: uid(), nome: ss.nome, data: hoje(), duracao: Math.round((Date.now() - ss.inicio) / 1000), volume, series, exercicios }, ...d.historico],
          }));
          setAba('home');
        },
      },
    ]);
  };

  const cancelarTreino = () => Alert.alert('Descartar treino?', 'As séries desta sessão não serão salvas.', [
    { text: 'Voltar', style: 'cancel' },
    { text: 'Descartar', style: 'destructive', onPress: () => setDados((d) => ({ ...d, sessao: null })) },
  ]);

  const carregarDemo = () => {
    // ~4 meses de treinos: 4 a 5 por semana, uma semana de pausa no meio e os últimos 4 dias seguidos
    const diasTreinados = [];
    for (let diasAtras = 1; diasAtras <= 115; diasAtras++) {
      const pausa = diasAtras >= 40 && diasAtras <= 46;
      const treina = diasAtras <= 4 || (!pausa && (diasAtras * 7) % 10 < 6);
      if (treina) diasTreinados.push(diasAtras);
    }
    const historico = diasTreinados.map((diasAtras, i) => {
      const m = MODELOS_TREINO[i % MODELOS_TREINO.length];
      const progresso = Math.floor((115 - diasAtras) / 14) * 2.5; // carga sobe a cada 2 semanas
      const exercicios = m.exercicios.slice(0, 4).map((nome, j) => ({
        nome, series: [0, 1, 2].map((k) => ({ peso: 20 + j * 7.5 + progresso, reps: 12 - k * 2 - (i % 3 === 0 ? 1 : 0) })),
      }));
      const volume = exercicios.reduce((t, e) => t + e.series.reduce((a, x) => a + x.peso * x.reps, 0), 0);
      return { id: uid(), nome: m.nome, data: diaOffset(-diasAtras), duracao: 2900 + (i % 5) * 310, volume, series: 12, exercicios };
    });
    const achar = (id) => ALIMENTOS.find((a) => a.id === id);
    const refeicoes = [
      criarItem(achar('aveia'), 40, 'Café da manhã'),
      criarItem(achar('banana'), 100, 'Café da manhã'),
      criarItem(achar('ovo'), 100, 'Café da manhã'),
      criarItem(achar('arroz'), 150, 'Almoço'),
      criarItem(achar('feijao'), 100, 'Almoço'),
      criarItem(achar('frango'), 150, 'Almoço'),
      criarItem(achar('brocolis'), 80, 'Almoço'),
    ];
    setDados((d) => ({
      ...d,
      perfil: { ...d.perfil, nome: d.perfil.nome || 'Gabriel' },
      historico,
      diario: { ...d.diario, [dia]: { refeicoes, agua: 1250 } },
    }));
    setAba('home');
  };

  const apagarTudo = () => Alert.alert('Apagar todos os dados?', 'Treinos, refeições e perfil serão removidos deste aparelho.', [
    { text: 'Cancelar', style: 'cancel' },
    { text: 'Apagar', style: 'destructive', onPress: () => { setDados(ESTADO_INICIAL); setAba('home'); } },
  ]);

  if (!carregado) return <View style={{ flex: 1, backgroundColor: COR.fundo[0] }} />;

  return (
    <View style={{ flex: 1 }}>
      <StatusBar style="light" />
      <Fundo />
      <SafeAreaView edges={['top']} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={s.conteudo} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <View style={s.marca}>
            <View style={[s.logo, { backgroundColor: COR.acento }]}><Ionicons name="arrow-up" size={14} color={COR.acentoTexto} /></View>
            <Text style={s.marcaTexto}>UPPER LIFE</Text>
          </View>

          {aba === 'home' && (
            <Home perfil={dados.perfil} metas={metas} totais={totais} agua={registro.agua} historico={dados.historico} sessao={dados.sessao} irPara={setAba} />
          )}
          {aba === 'treinos' && (dados.sessao ? (
            <SessaoAtiva
              sessao={dados.sessao} agora={agora} anteriores={anteriores} atualizar={atualizarSessao}
              abrirExercicios={() => setModalExercicio(true)} finalizar={finalizarTreino} cancelar={cancelarTreino}
            />
          ) : (
            <Treinos historico={dados.historico} iniciar={iniciarTreino} />
          ))}
          {aba === 'nutricao' && (
            <Nutricao
              registro={registro} metas={metas} totais={totais}
              mudarAgua={(ml) => atualizarHoje((r) => ({ ...r, agua: Math.max(0, r.agua + ml) }))}
              removerItem={(id) => atualizarHoje((r) => ({ ...r, refeicoes: r.refeicoes.filter((i) => i.id !== id) }))}
              abrirAlimentos={(ref) => setModalAlimento(ref)}
            />
          )}
          {aba === 'perfil' && (
            <Perfil usuario={usuario} sair={sair} perfil={dados.perfil} metas={metas} historico={dados.historico} mudarPerfil={mudarPerfil} apagarTudo={apagarTudo} carregarDemo={carregarDemo} />
          )}
        </ScrollView>
      </SafeAreaView>

      <BarraAbas aba={aba} setAba={setAba} emTreino={!!dados.sessao} />

      <ModalAlimento
        visivel={modalAlimento !== null} refeicaoInicial={modalAlimento}
        onFechar={() => setModalAlimento(null)}
        onAdicionar={(item) => { atualizarHoje((r) => ({ ...r, refeicoes: [...r.refeicoes, item] })); setModalAlimento(null); }}
      />
      <ModalExercicio
        visivel={modalExercicio} onFechar={() => setModalExercicio(false)}
        onEscolher={(nome) => {
          atualizarSessao((ss) => ({ ...ss, exercicios: [...ss.exercicios, { id: uid(), nome, series: [novaSerie(), novaSerie(), novaSerie()] }] }));
          setModalExercicio(false);
        }}
      />
    </View>
  );
}

export default function App() {
  const [usuario, setUsuario] = useState(undefined); // undefined = ainda verificando a sessão

  useEffect(() => { carregarSessao().then(setUsuario); }, []);

  const sair = () => Alert.alert('Sair da conta?', 'Seus treinos e refeições continuam salvos neste aparelho.', [
    { text: 'Cancelar', style: 'cancel' },
    { text: 'Sair', onPress: async () => { await encerrarSessao(); setUsuario(null); } },
  ]);

  return (
    <SafeAreaProvider>
      {usuario === undefined && <View style={{ flex: 1, backgroundColor: COR.fundo[0] }} />}
      {usuario === null && <Autenticacao onEntrar={setUsuario} />}
      {usuario && <Principal key={usuario.email} usuario={usuario} sair={sair} />}
    </SafeAreaProvider>
  );
}
