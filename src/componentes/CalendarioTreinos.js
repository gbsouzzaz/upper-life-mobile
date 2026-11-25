// Calendário de constância no estilo do GitHub: cada quadradinho é um dia,
// cada coluna é uma semana (domingo em cima). Quanto mais volume no dia, mais forte a cor.

import React, { useMemo, useState } from 'react';
import { View, Text } from 'react-native';
import { chaveData, MESES } from '../utils';
import { COR } from '../tema';
import { s } from '../estilos';

const NIVEIS = ['rgba(255,255,255,0.07)', 'rgba(200,240,49,0.28)', 'rgba(200,240,49,0.5)', 'rgba(200,240,49,0.75)', COR.acento];
const ESPACO = 4;

export default function CalendarioTreinos({ historico, semanas = 17 }) {
  const [largura, setLargura] = useState(0);

  const { colunas, meses } = useMemo(() => {
    const volumePorDia = {};
    historico.forEach((h) => { volumePorDia[h.data] = (volumePorDia[h.data] || 0) + h.volume; });
    const maior = Math.max(1, ...Object.values(volumePorDia));

    const hojeD = new Date(); hojeD.setHours(12, 0, 0, 0);
    const chaveHoje = chaveData(hojeD);
    const inicio = new Date(hojeD);
    inicio.setDate(hojeD.getDate() - hojeD.getDay() - (semanas - 1) * 7); // domingo da primeira semana

    const cols = [];
    const rotulos = [];
    for (let w = 0; w < semanas; w++) {
      const col = [];
      for (let d = 0; d < 7; d++) {
        const dt = new Date(inicio); dt.setDate(inicio.getDate() + w * 7 + d);
        const chave = chaveData(dt);
        const vol = volumePorDia[chave] || 0;
        col.push({ chave, futuro: dt > hojeD, hoje: chave === chaveHoje, nivel: vol > 0 ? Math.max(1, Math.ceil((vol / maior) * 4)) : 0 });
      }
      // rótulo do mês na semana em que o mês começa (e na primeira coluna, se couber)
      const domingo = new Date(inicio); domingo.setDate(inicio.getDate() + w * 7);
      if (domingo.getDate() <= 7 || w === 0) rotulos.push({ w, nome: MESES[domingo.getMonth()].slice(0, 3) });
      cols.push(col);
    }
    // evita dois rótulos encavalados (ex.: primeira coluna e mês novo logo depois)
    const filtrados = rotulos.filter((r, i) => !rotulos[i + 1] || rotulos[i + 1].w - r.w >= 3);
    return { colunas: cols, meses: filtrados };
  }, [historico, semanas]);

  const tam = largura ? Math.floor((largura - ESPACO * (semanas - 1)) / semanas) : 0;

  return (
    <View onLayout={(e) => setLargura(e.nativeEvent.layout.width)}>
      {tam > 0 && (
        <>
          <View style={{ height: 16, marginBottom: 4 }}>
            {meses.map((m) => (
              <Text key={m.w} style={[s.mini, { position: 'absolute', left: m.w * (tam + ESPACO), fontSize: 11 }]}>{m.nome}</Text>
            ))}
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            {colunas.map((col, w) => (
              <View key={w} style={{ gap: ESPACO }}>
                {col.map((dia) => (
                  <View
                    key={dia.chave}
                    style={{
                      width: tam, height: tam, borderRadius: 3,
                      backgroundColor: dia.futuro ? 'transparent' : NIVEIS[dia.nivel],
                      borderWidth: dia.hoje ? 1 : 0, borderColor: '#fff',
                    }}
                  />
                ))}
              </View>
            ))}
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', marginTop: 10, gap: 4 }}>
            <Text style={[s.mini, { fontSize: 11, marginRight: 4 }]}>Menos</Text>
            {NIVEIS.map((cor) => <View key={cor} style={{ width: 10, height: 10, borderRadius: 2, backgroundColor: cor }} />)}
            <Text style={[s.mini, { fontSize: 11, marginLeft: 4 }]}>Mais</Text>
          </View>
        </>
      )}
    </View>
  );
}
