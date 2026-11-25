import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COR } from '../tema';
import { Vidro, Barra, Botao, Cabecalho, Macro, Anel, Info, Estatistica } from '../componentes/ui';
import CalendarioTreinos from '../componentes/CalendarioTreinos';
import { fmt, chaveData, hoje, relogio, DIAS_CURTOS, dataExtenso, dataCurta, constancia } from '../utils';
import { s } from '../estilos';

export default function Home({ perfil, metas, totais, agua, historico, sessao, irPara }) {
  const restante = Math.max(0, metas.kcal - totais.kcal);
  const acima = totais.kcal > metas.kcal;
  const semana = useMemo(() => {
    const dias = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(); d.setDate(d.getDate() - i);
      const chave = chaveData(d);
      const vol = historico.filter((h) => h.data === chave).reduce((t, h) => t + h.volume, 0);
      dias.push({ chave, letra: DIAS_CURTOS[d.getDay()], vol, hoje: i === 0 });
    }
    return dias;
  }, [historico]);
  const maxVol = Math.max(1, ...semana.map((d) => d.vol));
  const volSemana = semana.reduce((t, d) => t + d.vol, 0);
  const treinosSemana = historico.filter((h) => semana.some((d) => d.chave === h.data)).length;
  const ultimo = historico[0];
  const cons = useMemo(() => constancia(historico), [historico]);
  const dias = (n) => (n === 1 ? '1 dia' : `${n} dias`);

  return (
    <>
      <Cabecalho sub={dataExtenso()} titulo={`Olá, ${perfil.nome || 'atleta'}`} />

      {sessao && (
        <TouchableOpacity onPress={() => irPara('treinos')}>
          <View style={[s.vidro, { flexDirection: 'row', alignItems: 'center', borderColor: COR.acentoBorda, backgroundColor: COR.acentoFundo }]}>
            <Ionicons name="pulse" size={22} color={COR.acento} />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={s.cardTitulo}>Treino em andamento</Text>
              <Text style={s.mini}>{sessao.nome}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={COR.sub} />
          </View>
        </TouchableOpacity>
      )}

      <Vidro>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <Text style={s.rotulo}>Calorias de hoje</Text>
          <View style={s.selo}><Text style={s.seloTexto}>{metas.protocolo}</Text></View>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Anel valor={totais.kcal} meta={metas.kcal} cor={acima ? COR.vermelho : COR.acento}>
            <Text style={s.anelNumero}>{fmt(acima ? totais.kcal - metas.kcal : restante)}</Text>
            <Text style={s.mini}>{acima ? 'kcal acima' : 'kcal restantes'}</Text>
          </Anel>
          <View style={{ flex: 1, marginLeft: 20, gap: 14 }}>
            <Macro rotulo="Proteína" valor={totais.p} meta={metas.p} cor={COR.p} />
            <Macro rotulo="Carboidrato" valor={totais.c} meta={metas.c} cor={COR.c} />
            <Macro rotulo="Gordura" valor={totais.g} meta={metas.g} cor={COR.g} />
          </View>
        </View>
        <View style={s.divisor} />
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={s.mini}>Consumido <Text style={s.miniForte}>{fmt(totais.kcal)} kcal</Text></Text>
          <Text style={s.mini}>Meta <Text style={s.miniForte}>{fmt(metas.kcal)} kcal</Text></Text>
        </View>
      </Vidro>

      <View style={{ flexDirection: 'row', gap: 12 }}>
        <TouchableOpacity style={{ flex: 1 }} onPress={() => irPara('nutricao')}>
          <Vidro>
            <Ionicons name="water" size={22} color={COR.agua} />
            <Text style={[s.numeroMedio, { marginTop: 10 }]}>{(agua / 1000).toFixed(2).replace('.', ',')} L</Text>
            <Text style={[s.mini, { marginBottom: 10 }]}>de {(metas.agua / 1000).toFixed(1).replace('.', ',')} L</Text>
            <Barra valor={agua} meta={metas.agua} cor={COR.agua} />
          </Vidro>
        </TouchableOpacity>
        <TouchableOpacity style={{ flex: 1 }} onPress={() => irPara('treinos')}>
          <Vidro>
            <Ionicons name="barbell" size={22} color={COR.acento} />
            <Text style={[s.numeroMedio, { marginTop: 10 }]}>{treinosSemana}</Text>
            <Text style={[s.mini, { marginBottom: 10 }]}>treinos em 7 dias</Text>
            <Barra valor={treinosSemana} meta={5} cor={COR.acento} />
          </Vidro>
        </TouchableOpacity>
      </View>

      <Vidro>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
          <Ionicons name="flame" size={20} color={cons.atual > 0 ? COR.acento : COR.fraco} />
          <Text style={[s.cardTitulo, { marginLeft: 8, flex: 1 }]}>Constância</Text>
          <Text style={s.mini}>{cons.treinouHoje ? 'Treino de hoje feito' : cons.atual > 0 ? 'Treine hoje pra manter' : 'Comece uma sequência hoje'}</Text>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 14 }}>
          <Estatistica rotulo="seguidos agora" valor={dias(cons.atual)} cor={cons.atual > 0 ? COR.acento : COR.texto} />
          <Estatistica rotulo="recorde" valor={dias(cons.recorde)} cor={COR.texto} />
          <Estatistica rotulo="treinados" valor={dias(cons.total)} cor={COR.texto} />
        </View>
        <CalendarioTreinos historico={historico} />
      </Vidro>

      <Vidro>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 }}>
          <Text style={s.cardTitulo}>Volume da semana</Text>
          <Text style={[s.mini, { color: COR.acento }]}>{fmt(volSemana)} kg</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', height: 120 }}>
          {semana.map((d) => (
            <View key={d.chave} style={{ alignItems: 'center', flex: 1 }}>
              <View style={{ height: 96, justifyContent: 'flex-end' }}>
                {d.vol > 0 ? (
                  <View style={{ width: 22, borderRadius: 8, height: Math.max(8, (d.vol / maxVol) * 96), backgroundColor: d.hoje ? COR.acento : 'rgba(200,240,49,0.4)' }} />
                ) : (
                  <View style={{ width: 22, height: 8, borderRadius: 8, backgroundColor: 'rgba(255,255,255,0.08)' }} />
                )}
              </View>
              <Text style={[s.mini, { marginTop: 6 }, d.hoje && { color: '#fff', fontWeight: '700' }]}>{d.letra}</Text>
            </View>
          ))}
        </View>
      </Vidro>

      {ultimo ? (
        <Vidro>
          <Text style={s.rotulo}>Último treino · {dataCurta(ultimo.data)}</Text>
          <Text style={[s.cardTitulo, { marginTop: 4 }]}>{ultimo.nome}</Text>
          <View style={{ flexDirection: 'row', marginTop: 12, gap: 18 }}>
            <Info icone="time-outline" texto={relogio(ultimo.duracao)} />
            <Info icone="layers-outline" texto={`${ultimo.series} séries`} />
            <Info icone="trending-up" texto={`${fmt(ultimo.volume)} kg`} />
          </View>
        </Vidro>
      ) : (
        <Botao titulo="Começar meu primeiro treino" icone="play" onPress={() => irPara('treinos')} />
      )}
    </>
  );
}
