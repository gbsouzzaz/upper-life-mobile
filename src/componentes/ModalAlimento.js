import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ALIMENTOS, REFEICOES } from '../dados';
import { Botao, Chip, MetaItem, Folha } from './ui';
import { COR } from '../tema';
import { num, fmt, pad, criarItem } from '../utils';
import { s } from '../estilos';

export default function ModalAlimento({ visivel, refeicaoInicial, onFechar, onAdicionar }) {
  const [busca, setBusca] = useState('');
  const [sel, setSel] = useState(null);
  const [gramas, setGramas] = useState('100');
  const [refeicao, setRefeicao] = useState(REFEICOES[0]);

  useEffect(() => {
    if (visivel) { setBusca(''); setSel(null); setGramas('100'); setRefeicao(refeicaoInicial || REFEICOES[0]); }
  }, [visivel, refeicaoInicial]);

  const lista = ALIMENTOS.filter((a) => a.nome.toLowerCase().includes(busca.toLowerCase().trim()));
  const previa = sel ? criarItem(sel, num(gramas), refeicao) : null;

  return (
    <Folha visivel={visivel} titulo={sel ? sel.nome : 'Adicionar alimento'} onFechar={onFechar}>
      {!sel ? (
        <>
          <View style={s.busca}>
            <Ionicons name="search" size={18} color={COR.fraco} />
            <TextInput style={s.buscaInput} placeholder="Buscar na Tabela TACO" placeholderTextColor={COR.fraco} value={busca} onChangeText={setBusca} />
          </View>
          <ScrollView style={{ maxHeight: 420 }} keyboardShouldPersistTaps="handled">
            {lista.map((a) => (
              <TouchableOpacity key={a.id} onPress={() => setSel(a)} style={s.itemLista}>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: '#fff', fontSize: 15 }}>{a.nome}</Text>
                  <Text style={s.mini}>100 g · P {a.p} · C {a.c} · G {a.g}</Text>
                </View>
                <Text style={[s.mini, { color: '#fff' }]}>{a.kcal} kcal</Text>
              </TouchableOpacity>
            ))}
            {lista.length === 0 && <Text style={[s.mini, { textAlign: 'center', marginTop: 20 }]}>Nenhum alimento encontrado.</Text>}
          </ScrollView>
        </>
      ) : (
        <>
          <Text style={s.rotulo}>Quantidade (g)</Text>
          <TextInput style={[s.input, { fontSize: 28, fontWeight: '800', textAlign: 'center' }]} keyboardType="number-pad" value={gramas} onChangeText={setGramas} autoFocus />
          <View style={{ flexDirection: 'row', gap: 8, marginTop: 10 }}>
            {[50, 100, 150, 200].map((g) => <Chip key={g} titulo={`${g} g`} ativo={num(gramas) === g} onPress={() => setGramas(String(g))} />)}
          </View>
          <Text style={[s.rotulo, { marginTop: 16 }]}>Refeição</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 6 }}>
            {REFEICOES.map((r) => <Chip key={r} titulo={r} ativo={refeicao === r} onPress={() => setRefeicao(r)} />)}
          </View>
          <View style={[s.vidro, { flexDirection: 'row', justifyContent: 'space-around', marginTop: 16 }]}>
            <MetaItem rotulo="kcal" valor={fmt(previa.kcal)} cor="#fff" />
            <MetaItem rotulo="Proteína" valor={`${previa.p.toFixed(1)}g`} cor={COR.p} />
            <MetaItem rotulo="Carbo" valor={`${previa.c.toFixed(1)}g`} cor={COR.c} />
            <MetaItem rotulo="Gordura" valor={`${previa.g.toFixed(1)}g`} cor={COR.g} />
          </View>
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <Botao titulo="Voltar" variante="secundario" onPress={() => setSel(null)} style={{ flex: 1 }} />
            <Botao titulo="Adicionar" icone="checkmark" onPress={() => { if (num(gramas) > 0) onAdicionar(previa); }} style={{ flex: 2 }} />
          </View>
        </>
      )}
    </Folha>
  );
}
