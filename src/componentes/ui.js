import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, KeyboardAvoidingView, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';
import { COR } from '../tema';
import { s } from '../estilos';

export const Vidro = ({ children, style }) => <View style={[s.vidro, style]}>{children}</View>;

export const Barra = ({ valor, meta, cor, altura = 8 }) => {
  const pct = meta > 0 ? Math.min(1, valor / meta) : 0;
  return (
    <View style={[s.trilho, { height: altura, borderRadius: altura }]}>
      <View style={{ width: `${pct * 100}%`, height: '100%', borderRadius: altura, backgroundColor: cor }} />
    </View>
  );
};

export const Botao = ({ titulo, onPress, icone, variante = 'primario', style }) => {
  if (variante === 'primario') {
    return (
      <TouchableOpacity activeOpacity={0.85} onPress={onPress} style={style}>
        <View style={[s.botao, { backgroundColor: COR.acento }]}>
          {icone && <Ionicons name={icone} size={18} color={COR.acentoTexto} style={{ marginRight: 8 }} />}
          <Text style={[s.botaoTexto, { color: COR.acentoTexto }]}>{titulo}</Text>
        </View>
      </TouchableOpacity>
    );
  }
  const cor = variante === 'perigo' ? COR.vermelho : COR.texto;
  return (
    <TouchableOpacity activeOpacity={0.7} onPress={onPress} style={[s.botao, s.botaoSec, style]}>
      {icone && <Ionicons name={icone} size={18} color={cor} style={{ marginRight: 8 }} />}
      <Text style={[s.botaoTexto, { color: cor }]}>{titulo}</Text>
    </TouchableOpacity>
  );
};

export const Chip = ({ titulo, ativo, onPress }) => (
  <TouchableOpacity onPress={onPress} style={[s.chip, ativo && s.chipAtivo]}>
    <Text style={[s.chipTexto, ativo && { color: COR.acentoTexto }]}>{titulo}</Text>
  </TouchableOpacity>
);

export const Cabecalho = ({ titulo, sub }) => (
  <View style={{ marginBottom: 18 }}>
    {sub ? <Text style={s.cabSub}>{sub}</Text> : null}
    <Text style={s.cabTitulo}>{titulo}</Text>
  </View>
);

export const Macro = ({ rotulo, valor, meta, cor }) => (
  <View style={{ flex: 1 }}>
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
      <Text style={[s.mini, { color: cor }]}>{rotulo}</Text>
      <Text style={s.mini}>{Math.round(valor)}/{meta}g</Text>
    </View>
    <Barra valor={valor} meta={meta} cor={cor} altura={6} />
  </View>
);

export const Anel = ({ valor, meta, cor, tam = 136, esp = 12, children }) => {
  const r = (tam - esp) / 2;
  const circ = 2 * Math.PI * r;
  const pct = meta > 0 ? Math.min(1, valor / meta) : 0;
  return (
    <View style={{ width: tam, height: tam, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={tam} height={tam} style={{ position: 'absolute', transform: [{ rotate: '-90deg' }] }}>
        <Circle cx={tam / 2} cy={tam / 2} r={r} stroke="rgba(255,255,255,0.08)" strokeWidth={esp} fill="none" />
        <Circle
          cx={tam / 2} cy={tam / 2} r={r} stroke={cor} strokeWidth={esp} fill="none" strokeLinecap="round"
          strokeDasharray={`${circ} ${circ}`} strokeDashoffset={circ * (1 - pct)}
        />
      </Svg>
      {children}
    </View>
  );
};

export const Fundo = () => (
  <View style={StyleSheet.absoluteFill} pointerEvents="none">
    <LinearGradient colors={COR.fundo} locations={[0, 0.32, 1]} style={StyleSheet.absoluteFill} />
  </View>
);

export const Info = ({ icone, texto }) => (
  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
    <Ionicons name={icone} size={15} color={COR.sub} />
    <Text style={[s.mini, { marginLeft: 5, color: COR.texto }]}>{texto}</Text>
  </View>
);

export const Estatistica = ({ rotulo, valor, cor }) => (
  <View style={{ alignItems: 'center' }}>
    <Text style={[s.numeroMedio, { color: cor, fontVariant: ['tabular-nums'] }]}>{valor}</Text>
    <Text style={s.mini}>{rotulo}</Text>
  </View>
);

export const MetaItem = ({ rotulo, valor, cor }) => (
  <View style={{ alignItems: 'center' }}>
    <Text style={{ color: cor, fontWeight: '800', fontSize: 16 }}>{valor}</Text>
    <Text style={s.mini}>{rotulo}</Text>
  </View>
);

export function Folha({ visivel, titulo, onFechar, children }) {
  return (
    <Modal visible={visivel} animationType="slide" transparent onRequestClose={onFechar}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <View style={s.modalFundo}>
          <TouchableOpacity style={{ flex: 1 }} activeOpacity={1} onPress={onFechar} />
          <View style={s.folha}>
            <View style={s.alca} />
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 14 }}>
              <Text style={[s.cabTitulo, { fontSize: 22, flex: 1 }]}>{titulo}</Text>
              <TouchableOpacity onPress={onFechar} style={s.iconeBotao}><Ionicons name="close" size={20} color={COR.sub} /></TouchableOpacity>
            </View>
            {children}
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
