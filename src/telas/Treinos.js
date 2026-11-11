import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COR } from '../tema';
import { MODELOS_TREINO } from '../dados';
import { Vidro, Botao, Cabecalho, Info } from '../componentes/ui';
import { fmt, hoje, relogio, dataCurta } from '../utils';
import { s } from '../estilos';

export default function Treinos({ historico, iniciar }) {
  return (
    <>
      <Cabecalho sub="Escolha o treino de hoje" titulo="Treinos" />
      {MODELOS_TREINO.map((m) => (
        <TouchableOpacity key={m.id} activeOpacity={0.8} onPress={() => iniciar(m)}>
          <Vidro style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={[s.iconeRedondo, { backgroundColor: COR.vidroForte }]}>
              <Text style={{ color: COR.texto, fontWeight: '800', fontSize: 18 }}>{m.id.toUpperCase()}</Text>
            </View>
            <View style={{ flex: 1, marginHorizontal: 14 }}>
              <Text style={s.cardTitulo}>{m.nome.split(' · ')[1]}</Text>
              <Text style={s.mini} numberOfLines={1}>{m.exercicios.join(' · ')}</Text>
            </View>
            <Ionicons name="play-circle" size={34} color={COR.acento} />
          </Vidro>
        </TouchableOpacity>
      ))}
      <Botao titulo="Treino livre" icone="add" variante="secundario" onPress={() => iniciar({ nome: 'Treino livre', exercicios: [] })} style={{ marginBottom: 24 }} />

      <Text style={s.secao}>Histórico</Text>
      {historico.length === 0 && <Text style={[s.mini, { textAlign: 'center', marginVertical: 20 }]}>Seus treinos finalizados aparecem aqui.</Text>}
      {historico.slice(0, 15).map((h) => (
        <Vidro key={h.id} style={{ paddingVertical: 14 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={s.cardTitulo}>{h.nome}</Text>
            <Text style={s.mini}>{dataCurta(h.data)}</Text>
          </View>
          <View style={{ flexDirection: 'row', marginTop: 8, gap: 18 }}>
            <Info icone="time-outline" texto={relogio(h.duracao)} />
            <Info icone="layers-outline" texto={`${h.series} séries`} />
            <Info icone="trending-up" texto={`${fmt(h.volume)} kg`} />
          </View>
        </Vidro>
      ))}
    </>
  );
}
