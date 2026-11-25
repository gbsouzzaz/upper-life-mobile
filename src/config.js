// Configuração do login com Google.
//
// Cole aqui os Client IDs criados no Google Cloud Console
// (APIs e serviços → Credenciais → Criar credenciais → ID do cliente OAuth).
// Passo a passo completo no README, seção "Login com Google".
//
// Enquanto o campo da plataforma estiver vazio, o botão "Continuar com Google"
// mostra um aviso em vez de abrir o Google. O login por e-mail e senha
// funciona sem nada disso.

export const GOOGLE = {
  webClientId: '',     // tipo "Aplicativo da Web" — usado ao rodar no navegador (npm run web)
  androidClientId: '', // tipo "Android" — só funciona em build de desenvolvimento, não no Expo Go
  iosClientId: '',     // tipo "iOS" — idem
};
