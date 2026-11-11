import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COR } from '../tema';
import { REFEICOES } from '../dados';
import { Vidro, Barra, Cabecalho, Macro } from '../componentes/ui';
import { fmt, somar } from '../utils';
import { s } from '../estilos';

export default function Nutricao({ registro, metas, totais, mudarAgua, removerItem, abrirAlimentos }) {
  return (
    <>
      <Cabecalho sub={`Protocolo ${metas.protocolo} · ${fmt(metas.kcal)} kcal`} titulo="Nutrição" />

      <Vidro>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
          <Text style={s.cardTitulo}>Resumo do dia</Text>
          <Text style={[s.mini, { color: '#fff' }]}>{fmt(totais.kcal)} / {fmt(metas.kcal)} kcal</Text>
        </View>
        <Barra valor={totais.kcal} meta={metas.kcal} cor={totais.kcal > metas.kcal ? COR.vermelho : COR.acento} altura={10} />
        <View style={{ flexDirection: 'row', gap: 12, marginTop: 16 }}>
          <Macro rotulo="Proteína" valor={totais.p} meta={metas.p} cor={COR.p} />
          <Macro rotulo="Carbo" valor={totais.c} meta={metas.c} cor={COR.c} />
          <Macro rotulo="Gordura" valor={totais.g} meta={metas.g} cor={COR.g} />
        </View>
      </Vidro>

      <Vidro>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Ionicons name="water" size={26} color={COR.agua} />
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={s.cardTitulo}>Hidratação</Text>
            <Text style={s.mini}>{fmt(registro.agua)} ml de {fmt(metas.agua)} ml</Text>
          </View>
          <Text style={[s.numeroMedio, { color: COR.agua }]}>{Math.min(100, Math.round((registro.agua / metas.agua) * 100))}%</Text>
        </View>
        <View style={{ marginVertical: 14 }}><Barra valor={registro.agua} meta={metas.agua} cor={COR.agua} altura={10} /></View>
        <View style={{ flexDirection: 'row', gap: 10 }}>
          {[250, 500].map((ml) => (
            <TouchableOpacity key={ml} onPress={() => mudarAgua(ml)} style={[s.botaoAgua, { flex: 1 }]}>
              <Text style={[s.botaoTexto, { color: COR.agua }]}>+{ml} ml</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity onPress={() => mudarAgua(-250)} style={[s.botaoAgua, { paddingHorizontal: 16 }]}>
            <Ionicons name="remove" size={18} color={COR.sub} />
          </TouchableOpacity>
        </View>
      </Vidro>

      {REFEICOES.map((ref) => {
        const itens = registro.refeicoes.filter((i) => i.refeicao === ref);
        const t = somar(itens);
        return (
          <Vidro key={ref}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
              <View style={{ flex: 1 }}>
                <Text style={s.cardTitulo}>{ref}</Text>
                <Text style={s.mini}>{fmt(t.kcal)} kcal · P {Math.round(t.p)}g · C {Math.round(t.c)}g · G {Math.round(t.g)}g</Text>
              </View>
              <TouchableOpacity onPress={() => abrirAlimentos(ref)} style={s.iconeBotao}>
                <Ionicons name="add" size={22} color={COR.acento} />
              </TouchableOpacity>
            </View>
            {itens.map((i) => (
              <View key={i.id} style={s.itemAlimento}>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: '#fff', fontSize: 14 }}>{i.nome}</Text>
                  <Text style={s.mini}>{fmt(i.gramas)} g · {fmt(i.kcal)} kcal</Text>
                </View>
                <TouchableOpacity onPress={() => removerItem(i.id)} hitSlop={10}>
                  <Ionicons name="close-circle" size={20} color={COR.fraco} />
                </TouchableOpacity>
              </View>
            ))}
            {itens.length === 0 && (
              <TouchableOpacity onPress={() => abrirAlimentos(ref)} style={s.vazio}>
                <Text style={s.mini}>Nenhum alimento ainda · toque para adicionar</Text>
              </TouchableOpacity>
            )}
          </Vidro>
        );
      })}
    </>
  );
}
