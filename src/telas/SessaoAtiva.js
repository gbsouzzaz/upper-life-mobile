import React from 'react';
import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COR } from '../tema';
import { DESCANSO_SEG, fmt, pad, relogio, volumeDe } from '../utils';
import { Vidro, Barra, Botao, Estatistica } from '../componentes/ui';
import { s } from '../estilos';

export default function SessaoAtiva({ sessao, agora, anteriores, atualizar, abrirExercicios, finalizar, cancelar }) {
  const tempo = Math.max(0, Math.floor((agora - sessao.inicio) / 1000));
  const descanso = Math.max(0, Math.ceil((sessao.descansoAte - agora) / 1000));
  const volume = volumeDe(sessao.exercicios, true);
  const feitas = sessao.exercicios.reduce((t, e) => t + e.series.filter((x) => x.feito).length, 0);

  const mudarExercicio = (exId, fn) => atualizar((ss) => ({
    ...ss, exercicios: ss.exercicios.map((e) => (e.id === exId ? fn(e) : e)),
  }));
  const mudarSerie = (exId, serieId, campos) => mudarExercicio(exId, (e) => ({
    ...e, series: e.series.map((x) => (x.id === serieId ? { ...x, ...campos } : x)),
  }));
  const alternarFeito = (exId, serie) => {
    const feito = !serie.feito;
    atualizar((ss) => ({
      ...ss,
      descansoAte: feito ? Date.now() + DESCANSO_SEG * 1000 : ss.descansoAte,
      exercicios: ss.exercicios.map((e) => (e.id !== exId ? e : {
        ...e, series: e.series.map((x) => (x.id === serie.id ? { ...x, feito } : x)),
      })),
    }));
  };

  return (
    <>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
        <View style={{ flex: 1 }}>
          <Text style={s.cabSub}>Sessão ativa</Text>
          <Text style={[s.cabTitulo, { fontSize: 24 }]} numberOfLines={1}>{sessao.nome}</Text>
        </View>
        <TouchableOpacity onPress={cancelar} style={s.iconeBotao}>
          <Ionicons name="close" size={22} color={COR.sub} />
        </TouchableOpacity>
      </View>

      <Vidro style={{ flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 16 }}>
        <Estatistica rotulo="Tempo" valor={relogio(tempo)} cor={COR.texto} />
        <Estatistica rotulo="Volume" valor={`${fmt(volume)} kg`} cor={COR.acento} />
        <Estatistica rotulo="Séries" valor={String(feitas)} cor={COR.texto} />
      </Vidro>

      {descanso > 0 && (
        <View style={[s.vidro, { borderColor: COR.acentoBorda, backgroundColor: COR.acentoFundo }]}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="hourglass-outline" size={20} color={COR.acento} />
            <Text style={[s.cardTitulo, { flex: 1, marginLeft: 10 }]}>
              Descanso <Text style={{ color: COR.acento, fontVariant: ['tabular-nums'] }}>{relogio(descanso)}</Text>
            </Text>
            <TouchableOpacity onPress={() => atualizar((ss) => ({ ...ss, descansoAte: 0 }))} style={s.pilula} hitSlop={8}>
              <Text style={[s.mini, { color: COR.texto, fontWeight: '700' }]}>Pular</Text>
            </TouchableOpacity>
          </View>
          <View style={{ marginTop: 12 }}><Barra valor={descanso} meta={DESCANSO_SEG} cor={COR.acento} altura={4} /></View>
        </View>
      )}

      {sessao.exercicios.map((e) => (
        <Vidro key={e.id}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
            <Text style={[s.cardTitulo, { flex: 1 }]}>{e.nome}</Text>
            <TouchableOpacity onPress={() => atualizar((ss) => ({ ...ss, exercicios: ss.exercicios.filter((x) => x.id !== e.id) }))}>
              <Ionicons name="trash-outline" size={18} color={COR.fraco} />
            </TouchableOpacity>
          </View>
          {anteriores[e.nome] && <Text style={[s.mini, { marginBottom: 8 }]}>Última vez: {anteriores[e.nome]}</Text>}

          <View style={[s.linhaSerie, { marginBottom: 2 }]}>
            <Text style={[s.colSerie, s.mini]}>SÉRIE</Text>
            <Text style={[s.colInput, s.mini, { textAlign: 'center' }]}>KG</Text>
            <Text style={[s.colInput, s.mini, { textAlign: 'center' }]}>REPS</Text>
            <View style={{ width: 44 }} />
          </View>
          {e.series.map((x, i) => (
            <View key={x.id} style={[s.linhaSerie, x.feito && { backgroundColor: COR.acentoFundo }]}>
              <Text style={[s.colSerie, { color: '#fff', fontWeight: '700' }]}>{i + 1}</Text>
              <TextInput
                style={[s.colInput, s.inputSerie]} keyboardType="decimal-pad" placeholder="0"
                placeholderTextColor={COR.fraco} value={x.peso}
                onChangeText={(v) => mudarSerie(e.id, x.id, { peso: v })}
              />
              <TextInput
                style={[s.colInput, s.inputSerie]} keyboardType="number-pad" placeholder="0"
                placeholderTextColor={COR.fraco} value={x.reps}
                onChangeText={(v) => mudarSerie(e.id, x.id, { reps: v })}
              />
              <TouchableOpacity onPress={() => alternarFeito(e.id, x)} style={[s.check, x.feito && { backgroundColor: COR.acento, borderColor: COR.acento }]}>
                <Ionicons name="checkmark" size={18} color={x.feito ? COR.acentoTexto : COR.fraco} />
              </TouchableOpacity>
            </View>
          ))}
          <TouchableOpacity onPress={() => mudarExercicio(e.id, (ex) => {
            const ult = ex.series[ex.series.length - 1];
            return { ...ex, series: [...ex.series, { ...novaSerie(), peso: ult ? ult.peso : '', reps: ult ? ult.reps : '' }] };
          })} style={s.addSerie}>
            <Ionicons name="add" size={16} color={COR.acento} />
            <Text style={[s.mini, { color: COR.acento, marginLeft: 4, fontWeight: '700' }]}>Adicionar série</Text>
          </TouchableOpacity>
        </Vidro>
      ))}

      <Botao titulo="Adicionar exercício" icone="add-circle-outline" variante="secundario" onPress={abrirExercicios} style={{ marginBottom: 12 }} />
      <Botao titulo="Finalizar treino" icone="flag" onPress={finalizar} />
    </>
  );
}
