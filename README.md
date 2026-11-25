# UPPER LIFE

**Treino e nutrição num app só.** App mobile em React Native (Expo) para registrar o treino série por série e controlar calorias, macros e água com alimentos da Tabela TACO.

<p>
  <img src="docs/prints/home.png" width="200" alt="Tela Home">
  <img src="docs/prints/treino.png" width="200" alt="Sessão de treino">
  <img src="docs/prints/nutricao.png" width="200" alt="Tela Nutrição">
  <img src="docs/prints/perfil.png" width="200" alt="Tela Perfil">
</p>

## O problema
Quem treina e faz dieta costuma usar dois ou três apps separados: um para anotar as séries, outro para contar calorias e outro para lembrar de beber água. Os apps de dieta mais conhecidos usam bases de alimentos estrangeiras, que não batem com a comida brasileira. O UPPER LIFE junta tudo numa tela, com metas calculadas pelo peso e pelo objetivo de cada pessoa.

## Funcionalidades
- **Login e cadastro:** conta com nome, e-mail e senha, ou **Continuar com Google**. Cada conta tem os próprios treinos e refeições. A senha não é guardada: o app salva só um hash SHA-256 com sal aleatório.
- **Constância:** dias seguidos treinando, recorde e total de dias treinados, com um calendário no estilo do GitHub (cada quadrado é um dia; quanto mais volume, mais forte a cor).
- **Home:** anel de calorias restantes, macros do dia, hidratação, treinos da semana, constância, volume da semana e último treino.
- **Treinos:** quatro treinos prontos (A, B, C e D) ou treino livre. Na sessão ativa:
  - cronômetro e campos de kg e reps por série;
  - descanso automático de 90 s depois de cada ✓;
  - "última vez" de cada exercício;
  - exercício personalizado;
  - volume (peso × reps) calculado ao vivo.
- **Nutrição:** busca na Tabela TACO, quantidade em gramas com macros proporcionais, quatro refeições e água com botões rápidos.
- **Perfil:** peso e objetivo (Cutting 1800, Manter 2200, Bulking 3000 ou Personalizado). As metas de proteína (2 g/kg), gordura (0,9 g/kg), carboidrato e água (35 ml/kg) são calculadas automaticamente.
- Os dados ficam salvos no aparelho com AsyncStorage. O botão **Carregar dados de exemplo** no Perfil serve para demonstrações.

## Como rodar
Pré-requisitos: Node.js LTS e o app **Expo Go** no celular.

```bash
git clone <url-deste-repositorio>
cd <pasta-do-repositorio>
npm install
npm run setup     # instala as dependências na versão certa para o SDK do Expo
npm start         # escaneie o QR code com o Expo Go
```

Para abrir no navegador do computador: `npm run web` (abre em http://localhost:8081).

Se o Expo Go do celular disser que o SDK do projeto é incompatível, rode `npx expo install expo@<versão-do-seu-Expo-Go>` e depois `npm run setup` de novo. Se o QR code não conectar, use `npx expo start --tunnel`.

## Login com Google
O botão funciona depois que você cria um **Client ID** no Google (é de graça, uns 10 minutos):

1. Entre em https://console.cloud.google.com e crie um projeto (ex.: "upper-life").
2. **APIs e serviços → Tela de permissão OAuth:** tipo *Externo*, preencha nome do app e seu e-mail, e em *Usuários de teste* adicione os e-mails que vão entrar.
3. **APIs e serviços → Credenciais → Criar credenciais → ID do cliente OAuth → Aplicativo da Web.**
   - Origens JavaScript autorizadas: `http://localhost:8081`
   - URIs de redirecionamento autorizados: `http://localhost:8081`
4. Copie o ID gerado (termina em `.apps.googleusercontent.com`) e cole em `src/config.js`, no campo `webClientId`.
5. Rode `npm run web` e toque em **Continuar com Google**.

**Limitação:** no celular pelo Expo Go o Google não aceita o login (o Expo Go não tem um endereço de retorno que o Google permita). No celular, use e-mail e senha, ou gere um build de desenvolvimento (`npx expo run:android`) com um Client ID do tipo *Android*.

Sem servidor, as contas existem só no aparelho (ou navegador) onde foram criadas.

## Estrutura
```
App.js                      sessão (login), estado global, persistência e navegação entre abas
index.js                    ponto de entrada do Expo
src/
  telas/                    Autenticacao (login/cadastro), Home, Treinos, SessaoAtiva, Nutricao, Perfil
  componentes/
    ui.js                   cartão de vidro, barra, anel, botões, chips, folha (bottom sheet)
    BarraAbas.js            barra de navegação flutuante
    BotaoGoogle.js          login com Google (expo-auth-session)
    CalendarioTreinos.js    calendário de constância estilo GitHub
    ModalAlimento.js        busca e porção de alimentos
    ModalExercicio.js       busca e criação de exercícios
  dados.js                  Tabela TACO, exercícios, treinos prontos e protocolos
  utils.js                  datas, cálculo de metas, macros, volume e constância
  auth.js                   contas, cadastro, login e sessão
  config.js                 Client IDs do Google
  tema.js                   paleta de cores
  estilos.js                StyleSheet compartilhado
docs/prints/                capturas de tela
docs/APRESENTACAO.md        roteiro do vídeo e pitch da apresentação
```

## Stack
React Native · Expo · AsyncStorage · expo-auth-session · expo-crypto · expo-linear-gradient · expo-blur · react-native-svg · Ionicons

## Próximos passos
- Sincronização das contas na nuvem (hoje ficam só no aparelho)
- Histórico de peso corporal e gráficos de evolução por exercício
- Assistente de IA para sugerir treino e dieta

---
Valores nutricionais aproximados com base na Tabela Brasileira de Composição de Alimentos (TACO/UNICAMP).
