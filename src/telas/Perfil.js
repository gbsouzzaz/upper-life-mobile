import React from 'react';
import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COR } from '../tema';
import { PROTOCOLOS } from '../dados';
import { Vidro, Botao, Cabecalho, Estatistica, MetaItem } from '../componentes/ui';
import { fmt, pad } from '../utils';
import { s } from '../estilos';

export default function Perfil({ usuario, sair, perfil, metas, historico, mudarPerfil, apagarTudo, carregarDemo }) {
  const volumeTotal = historico.reduce((t, h) => t + h.volume, 0);
  return (
    <>
      <Cabecalho sub="Seus dados e objetivo" titulo="Perfil" />

      <Vidro style={{ flexDirection: 'row', alignItems: 'center' }}>
        <View style={[s.iconeRedondo, { backgroundColor: COR.acentoFundo, borderWidth: 1, borderColor: COR.acentoBorda }]}>
          <Text style={{ color: COR.acento, fontWeight: '800', fontSize: 18 }}>{(usuario.nome || usuario.email)[0].toUpperCase()}</Text>
        </View>
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={s.cardTitulo} numberOfLines={1}>{usuario.nome}</Text>
          <Text style={s.mini} numberOfLines={1}>{usuario.email}</Text>
        </View>
        <View style={[s.selo, { flexDirection: 'row', alignItems: 'center' }]}>
          <Ionicons name={usuario.provedor === 'google' ? 'logo-google' : 'mail-outline'} size={12} color={COR.acento} style={{ marginRight: 4 }} />
          <Text style={s.seloTexto}>{usuario.provedor === 'google' ? 'Google' : 'E-mail'}</Text>
        </View>
      </Vidro>

      <Vidro style={{ flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 16 }}>
        <Estatistica rotulo="Treinos" valor={String(historico.length)} cor={COR.texto} />
        <Estatistica rotulo="Volume total" valor={`${fmt(volumeTotal / 1000)} t`} cor={COR.acento} />
        <Estatistica rotulo="Meta diária" valor={`${fmt(metas.kcal)}`} cor={COR.texto} />
      </Vidro>

      <Vidro>
        <Text style={s.rotulo}>Nome</Text>
        <TextInput style={s.input} value={perfil.nome} placeholder="Como quer ser chamado?" placeholderTextColor={COR.fraco} onChangeText={(v) => mudarPerfil({ nome: v })} />
        <Text style={[s.rotulo, { marginTop: 14 }]}>Peso (kg)</Text>
        <TextInput style={s.input} value={perfil.peso} keyboardType="decimal-pad" placeholder="75" placeholderTextColor={COR.fraco} onChangeText={(v) => mudarPerfil({ peso: v })} />
        <Text style={[s.mini, { marginTop: 8 }]}>Usado para calcular proteína (2 g/kg), gordura (0,9 g/kg) e água (35 ml/kg).</Text>
      </Vidro>

      <Text style={s.secao}>Qual é o seu objetivo?</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
        {PROTOCOLOS.map((p) => {
          const ativo = perfil.objetivo === p.id;
          return (
            <TouchableOpacity key={p.id} activeOpacity={0.8} onPress={() => mudarPerfil({ objetivo: p.id })} style={{ width: '48.5%' }}>
              <Vidro style={[{ alignItems: 'flex-start' }, ativo && { borderColor: COR.acentoBorda, backgroundColor: COR.acentoFundo }]}>
                <Ionicons name={p.icone} size={22} color={ativo ? COR.acento : COR.sub} />
                <Text style={[s.cardTitulo, { marginTop: 8 }]}>{p.nome}</Text>
                <Text style={s.mini}>{p.kcal ? `${fmt(p.kcal)} kcal` : p.desc}</Text>
              </Vidro>
            </TouchableOpacity>
          );
        })}
      </View>
      {perfil.objetivo === 'personalizado' && (
        <Vidro>
          <Text style={s.rotulo}>Meta de calorias (kcal)</Text>
          <TextInput style={s.input} value={perfil.metaPersonalizada} keyboardType="number-pad" placeholderTextColor={COR.fraco} onChangeText={(v) => mudarPerfil({ metaPersonalizada: v })} />
        </Vidro>
      )}

      <Vidro>
        <Text style={s.cardTitulo}>Suas metas diárias</Text>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 }}>
          <MetaItem rotulo="Proteína" valor={`${metas.p} g`} cor={COR.p} />
          <MetaItem rotulo="Carbo" valor={`${metas.c} g`} cor={COR.c} />
          <MetaItem rotulo="Gordura" valor={`${metas.g} g`} cor={COR.g} />
          <MetaItem rotulo="Água" valor={`${(metas.agua / 1000).toFixed(1).replace('.', ',')} L`} cor={COR.agua} />
        </View>
      </Vidro>

      <Botao titulo="Carregar dados de exemplo" icone="sparkles-outline" variante="secundario" onPress={carregarDemo} style={{ marginBottom: 12 }} />
      <Botao titulo="Sair da conta" icone="log-out-outline" variante="secundario" onPress={sair} style={{ marginBottom: 12 }} />
      <Botao titulo="Apagar todos os dados" icone="trash-outline" variante="perigo" onPress={apagarTudo} />
    </>
  );
}
