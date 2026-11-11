import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import Home from '../telas/Home';
import Perfil from '../telas/Perfil';
import Treinos from '../telas/Treinos';
import { COR } from '../tema';
import { s } from '../estilos';

const ABAS = [
  { id: 'home', nome: 'Home', icone: 'home' },
  { id: 'treinos', nome: 'Treinos', icone: 'barbell' },
  { id: 'nutricao', nome: 'Nutrição', icone: 'nutrition' },
  { id: 'perfil', nome: 'Perfil', icone: 'person' },
];

export default function BarraAbas({ aba, setAba, emTreino }) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[s.barraWrap, { bottom: Math.max(insets.bottom, 12) }]}>
      <BlurView intensity={50} tint="dark" style={s.barra}>
        {ABAS.map((a) => {
          const ativo = aba === a.id;
          return (
            <TouchableOpacity key={a.id} onPress={() => setAba(a.id)} style={s.abaBotao} activeOpacity={0.7}>
              <View style={[s.abaIcone, ativo && { backgroundColor: 'rgba(200,240,49,0.14)' }]}>
                <Ionicons name={ativo ? a.icone : `${a.icone}-outline`} size={22} color={ativo ? COR.acento : COR.sub} />
                {a.id === 'treinos' && emTreino && <View style={s.pontoAtivo} />}
              </View>
              <Text style={[s.abaTexto, ativo && { color: '#fff' }]}>{a.nome}</Text>
            </TouchableOpacity>
          );
        })}
      </BlurView>
    </View>
  );
}
