import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Alert, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { GOOGLE } from '../config';
import { COR } from '../tema';
import { s } from '../estilos';

// fecha a janela do navegador quando o Google devolve o login (necessário na versão web)
WebBrowser.maybeCompleteAuthSession();

const Visual = ({ onPress, carregando }) => (
  <TouchableOpacity activeOpacity={0.8} onPress={onPress} disabled={carregando}>
    <View style={[s.botao, { backgroundColor: '#F5F7FA', opacity: carregando ? 0.6 : 1 }]}>
      <Ionicons name="logo-google" size={18} color="#0B0D10" style={{ marginRight: 10 }} />
      <Text style={[s.botaoTexto, { color: '#0B0D10' }]}>{carregando ? 'Abrindo o Google…' : 'Continuar com Google'}</Text>
    </View>
  </TouchableOpacity>
);

function BotaoGoogleAtivo({ onPerfil, onErro }) {
  const [esperando, setEsperando] = useState(false);
  const [pedido, resposta, abrir] = Google.useAuthRequest({
    webClientId: GOOGLE.webClientId || undefined,
    androidClientId: GOOGLE.androidClientId || undefined,
    iosClientId: GOOGLE.iosClientId || undefined,
  });

  useEffect(() => {
    if (!resposta) return;
    if (resposta.type === 'success') {
      const token = resposta.authentication && resposta.authentication.accessToken;
      fetch('https://www.googleapis.com/userinfo/v2/me', { headers: { Authorization: `Bearer ${token}` } })
        .then((r) => r.json())
        .then(onPerfil)
        .catch(() => onErro('Não foi possível ler seu perfil do Google. Verifique a internet e tente de novo.'))
        .finally(() => setEsperando(false));
    } else {
      setEsperando(false);
      if (resposta.type === 'error') onErro('O Google não concluiu o login. Tente de novo.');
    }
  }, [resposta]);

  return <Visual carregando={!pedido || esperando} onPress={() => { setEsperando(true); abrir(); }} />;
}

export default function BotaoGoogle(props) {
  const id = Platform.select({ web: GOOGLE.webClientId, android: GOOGLE.androidClientId, ios: GOOGLE.iosClientId, default: '' });
  if (!id) {
    return (
      <Visual onPress={() => Alert.alert(
        'Login com Google ainda não configurado',
        'Falta colar o Client ID do Google em src/config.js. Enquanto isso, entre com e-mail e senha.',
      )} />
    );
  }
  return <BotaoGoogleAtivo {...props} />;
}
