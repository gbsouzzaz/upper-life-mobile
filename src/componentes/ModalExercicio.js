import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COR } from '../tema';
import { EXERCICIOS } from '../dados';
import { Folha } from './ui';
import { s } from '../estilos';

export default function ModalExercicio({ visivel, onFechar, onEscolher }) {
  const [busca, setBusca] = useState('');
  useEffect(() => { if (visivel) setBusca(''); }, [visivel]);
  const termo = busca.toLowerCase().trim();
  const grupos = EXERCICIOS
    .map((g) => ({ ...g, itens: g.itens.filter((i) => i.toLowerCase().includes(termo) || g.grupo.toLowerCase().includes(termo)) }))
    .filter((g) => g.itens.length);

  return (
    <Folha visivel={visivel} titulo="Adicionar exercício" onFechar={onFechar}>
      <View style={s.busca}>
        <Ionicons name="search" size={18} color={COR.fraco} />
        <TextInput style={s.buscaInput} placeholder="Buscar ou criar exercício" placeholderTextColor={COR.fraco} value={busca} onChangeText={setBusca} />
      </View>
      <ScrollView style={{ maxHeight: 440 }} keyboardShouldPersistTaps="handled">
        {termo.length > 1 && (
          <TouchableOpacity onPress={() => onEscolher(busca.trim())} style={[s.itemLista, { borderColor: COR.acento }]}>
            <Ionicons name="create-outline" size={18} color={COR.acento} />
            <Text style={{ color: '#fff', marginLeft: 10 }}>Criar “{busca.trim()}”</Text>
          </TouchableOpacity>
        )}
        {grupos.map((g) => (
          <View key={g.grupo}>
            <Text style={[s.rotulo, { marginTop: 10, marginBottom: 6 }]}>{g.grupo}</Text>
            {g.itens.map((i) => (
              <TouchableOpacity key={i} onPress={() => onEscolher(i)} style={s.itemLista}>
                <Text style={{ color: '#fff', flex: 1 }}>{i}</Text>
                <Ionicons name="add-circle" size={24} color={COR.acento} />
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </ScrollView>
    </Folha>
  );
}
