import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import BotaoGoogle from '../componentes/BotaoGoogle';
import { Fundo } from '../componentes/ui';
import { registrar, entrar, entrarComGoogle, emailValido } from '../auth';
import { COR } from '../tema';
import { s } from '../estilos';

const Campo = ({ rotulo, erro, children }) => (
  <View style={{ marginBottom: 14 }}>
    <Text style={s.rotulo}>{rotulo}</Text>
    {children}
    {erro ? <Text style={[s.mini, { color: COR.vermelho, marginTop: 6 }]}>{erro}</Text> : null}
  </View>
);

export default function Autenticacao({ onEntrar }) {
  const [modo, setModo] = useState('entrar'); // 'entrar' | 'registrar'
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [verSenha, setVerSenha] = useState(false);
  const [erros, setErros] = useState({});
  const [erroGeral, setErroGeral] = useState('');
  const [enviando, setEnviando] = useState(false);

  const registrando = modo === 'registrar';

  const validar = (campo) => {
    if (campo === 'nome' && registrando && !nome.trim()) return 'Digite como quer ser chamado.';
    if (campo === 'email' && !emailValido(email)) return 'Digite um e-mail no formato nome@exemplo.com.';
    if (campo === 'senha' && registrando && senha.length < 6) return 'Use pelo menos 6 caracteres.';
    if (campo === 'senha' && !registrando && !senha) return 'Digite sua senha.';
    return '';
  };
  const aoSair = (campo) => setErros((e) => ({ ...e, [campo]: validar(campo) }));
  const mudar = (campo, setter) => (v) => { setter(v); setErroGeral(''); if (erros[campo]) setErros((e) => ({ ...e, [campo]: '' })); };

  const trocarModo = () => {
    setModo(registrando ? 'entrar' : 'registrar');
    setErros({}); setErroGeral('');
  };

  const enviar = async () => {
    const novos = { nome: validar('nome'), email: validar('email'), senha: validar('senha') };
    setErros(novos);
    if (Object.values(novos).some(Boolean)) return;
    setEnviando(true); setErroGeral('');
    try {
      const usuario = registrando ? await registrar({ nome, email, senha }) : await entrar({ email, senha });
      onEntrar(usuario);
    } catch (e) {
      setErroGeral(e.message);
      setEnviando(false);
    }
  };

  const viaGoogle = async (perfilGoogle) => {
    try { onEntrar(await entrarComGoogle(perfilGoogle)); } catch (e) { setErroGeral(e.message); }
  };

  return (
    <View style={{ flex: 1 }}>
      <StatusBar style="light" />
      <Fundo />
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={{ paddingHorizontal: 22, paddingTop: 36, paddingBottom: 40 }} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
            <View style={[s.marca, { marginBottom: 40 }]}>
              <View style={[s.logo, { backgroundColor: COR.acento }]}><Ionicons name="arrow-up" size={14} color={COR.acentoTexto} /></View>
              <Text style={s.marcaTexto}>UPPER LIFE</Text>
            </View>

            <Text style={s.cabTitulo}>{registrando ? 'Criar conta' : 'Entrar'}</Text>
            <Text style={[s.cabSub, { marginTop: 6, marginBottom: 28 }]}>
              {registrando ? 'Treino e nutrição no mesmo lugar. Leva 20 segundos.' : 'Bom te ver de novo. Bora pro treino?'}
            </Text>

            <BotaoGoogle onPerfil={viaGoogle} onErro={setErroGeral} />

            <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 24 }}>
              <View style={{ flex: 1, height: 1, backgroundColor: COR.borda }} />
              <Text style={[s.mini, { marginHorizontal: 12 }]}>ou com e-mail</Text>
              <View style={{ flex: 1, height: 1, backgroundColor: COR.borda }} />
            </View>

            {registrando && (
              <Campo rotulo="Nome" erro={erros.nome}>
                <TextInput
                  style={[s.input, erros.nome && { borderColor: COR.vermelho }]} value={nome} onChangeText={mudar('nome', setNome)}
                  onBlur={() => aoSair('nome')} placeholder="Gabriel" placeholderTextColor={COR.fraco}
                  autoCapitalize="words" autoComplete="name" textContentType="name"
                />
              </Campo>
            )}

            <Campo rotulo="E-mail" erro={erros.email}>
              <TextInput
                style={[s.input, erros.email && { borderColor: COR.vermelho }]} value={email} onChangeText={mudar('email', setEmail)}
                onBlur={() => aoSair('email')} placeholder="nome@exemplo.com" placeholderTextColor={COR.fraco}
                keyboardType="email-address" autoCapitalize="none" autoCorrect={false} autoComplete="email" textContentType="emailAddress"
              />
            </Campo>

            <Campo rotulo="Senha" erro={erros.senha}>
              <View style={{ justifyContent: 'center' }}>
                <TextInput
                  style={[s.input, { paddingRight: 52 }, erros.senha && { borderColor: COR.vermelho }]} value={senha} onChangeText={mudar('senha', setSenha)}
                  onBlur={() => aoSair('senha')} placeholder={registrando ? 'Mínimo de 6 caracteres' : ''} placeholderTextColor={COR.fraco}
                  secureTextEntry={!verSenha} autoCapitalize="none" autoCorrect={false}
                  autoComplete={registrando ? 'password-new' : 'password'} textContentType={registrando ? 'newPassword' : 'password'}
                  onSubmitEditing={enviar} returnKeyType="go"
                />
                <TouchableOpacity
                  onPress={() => setVerSenha((v) => !v)} hitSlop={10}
                  style={{ position: 'absolute', right: 6, top: 6, width: 44, height: 50, alignItems: 'center', justifyContent: 'center' }}
                  accessibilityLabel={verSenha ? 'Esconder senha' : 'Mostrar senha'}
                >
                  <Ionicons name={verSenha ? 'eye-off-outline' : 'eye-outline'} size={20} color={COR.sub} />
                </TouchableOpacity>
              </View>
            </Campo>

            {erroGeral ? (
              <View style={{ flexDirection: 'row', alignItems: 'flex-start', padding: 12, borderRadius: 14, backgroundColor: 'rgba(255,107,107,0.10)', borderWidth: 1, borderColor: 'rgba(255,107,107,0.35)', marginBottom: 14 }}>
                <Ionicons name="alert-circle-outline" size={18} color={COR.vermelho} />
                <Text style={[s.mini, { color: COR.texto, marginLeft: 8, flexShrink: 1, lineHeight: 18 }]}>{erroGeral}</Text>
              </View>
            ) : null}

            <TouchableOpacity activeOpacity={0.85} onPress={enviar} disabled={enviando} style={{ marginTop: 4 }}>
              <View style={[s.botao, { backgroundColor: COR.acento, opacity: enviando ? 0.6 : 1 }]}>
                <Text style={[s.botaoTexto, { color: COR.acentoTexto }]}>
                  {enviando ? (registrando ? 'Criando conta…' : 'Entrando…') : (registrando ? 'Criar conta' : 'Entrar')}
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={trocarModo} style={{ alignItems: 'center', paddingVertical: 18 }}>
              <Text style={s.mini}>
                {registrando ? 'Já tem conta? ' : 'Ainda não tem conta? '}
                <Text style={{ color: COR.acento, fontWeight: '700' }}>{registrando ? 'Entrar' : 'Criar conta'}</Text>
              </Text>
            </TouchableOpacity>

            <Text style={[s.mini, { textAlign: 'center', color: COR.fraco, marginTop: 8, lineHeight: 18 }]}>
              Seus dados ficam salvos só neste aparelho.
            </Text>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}
