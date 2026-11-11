// UPPER LIFE — dados estáticos
// Alimentos: valores por 100 g (ou 100 ml), aproximados com base na Tabela TACO (UNICAMP).

export const ALIMENTOS = [
  { id: 'arroz', nome: 'Arroz branco cozido', kcal: 128, p: 2.5, c: 28.1, g: 0.2 },
  { id: 'arroz-int', nome: 'Arroz integral cozido', kcal: 124, p: 2.6, c: 25.8, g: 1.0 },
  { id: 'feijao', nome: 'Feijão carioca cozido', kcal: 76, p: 4.8, c: 13.6, g: 0.5 },
  { id: 'frango', nome: 'Peito de frango grelhado', kcal: 159, p: 32.0, c: 0, g: 2.5 },
  { id: 'patinho', nome: 'Patinho grelhado', kcal: 219, p: 35.9, c: 0, g: 7.3 },
  { id: 'atum', nome: 'Atum em conserva', kcal: 166, p: 26.2, c: 0, g: 6.0 },
  { id: 'ovo', nome: 'Ovo de galinha cozido', kcal: 146, p: 13.3, c: 0.6, g: 9.5 },
  { id: 'batata-doce', nome: 'Batata-doce cozida', kcal: 77, p: 0.6, c: 18.4, g: 0.1 },
  { id: 'mandioca', nome: 'Mandioca cozida', kcal: 125, p: 0.6, c: 30.1, g: 0.3 },
  { id: 'cuscuz', nome: 'Cuscuz de milho cozido', kcal: 113, p: 2.2, c: 25.3, g: 0.7 },
  { id: 'macarrao', nome: 'Macarrão cozido', kcal: 102, p: 3.4, c: 19.9, g: 1.2 },
  { id: 'pao', nome: 'Pão francês', kcal: 300, p: 8.0, c: 58.6, g: 3.1 },
  { id: 'aveia', nome: 'Aveia em flocos', kcal: 394, p: 13.9, c: 66.6, g: 8.5 },
  { id: 'banana', nome: 'Banana prata', kcal: 98, p: 1.3, c: 26.0, g: 0.1 },
  { id: 'maca', nome: 'Maçã fuji', kcal: 56, p: 0.3, c: 15.2, g: 0.1 },
  { id: 'mamao', nome: 'Mamão papaia', kcal: 40, p: 0.5, c: 10.4, g: 0.1 },
  { id: 'leite', nome: 'Leite integral (100 ml)', kcal: 61, p: 2.9, c: 4.3, g: 3.2 },
  { id: 'iogurte', nome: 'Iogurte natural', kcal: 51, p: 4.1, c: 1.9, g: 3.0 },
  { id: 'queijo', nome: 'Queijo minas frescal', kcal: 264, p: 17.4, c: 3.2, g: 20.2 },
  { id: 'amendoim', nome: 'Amendoim torrado', kcal: 606, p: 22.5, c: 18.7, g: 54.0 },
  { id: 'azeite', nome: 'Azeite de oliva', kcal: 884, p: 0, c: 0, g: 100 },
  { id: 'brocolis', nome: 'Brócolis cozido', kcal: 25, p: 2.1, c: 4.4, g: 0.5 },
  { id: 'alface', nome: 'Alface crespa', kcal: 11, p: 1.3, c: 1.7, g: 0.2 },
  { id: 'tomate', nome: 'Tomate', kcal: 15, p: 1.1, c: 3.1, g: 0.2 },
  { id: 'whey', nome: 'Whey protein (rótulo médio)', kcal: 400, p: 80.0, c: 8.0, g: 6.0 },
];

export const REFEICOES = ['Café da manhã', 'Almoço', 'Lanche', 'Jantar'];

export const PROTOCOLOS = [
  { id: 'cutting', nome: 'Cutting', desc: 'Perder gordura', kcal: 1800, icone: 'flame' },
  { id: 'manter', nome: 'Manter', desc: 'Manter o peso', kcal: 2200, icone: 'scale' },
  { id: 'bulking', nome: 'Bulking', desc: 'Ganhar massa', kcal: 3000, icone: 'barbell' },
  { id: 'personalizado', nome: 'Personalizado', desc: 'Defina sua meta', kcal: null, icone: 'options' },
];

export const EXERCICIOS = [
  { grupo: 'Peito', itens: ['Supino reto', 'Supino inclinado com halteres', 'Crucifixo', 'Crossover', 'Flexão de braço'] },
  { grupo: 'Costas', itens: ['Puxada frontal', 'Remada curvada', 'Remada baixa', 'Barra fixa', 'Levantamento terra'] },
  { grupo: 'Pernas', itens: ['Agachamento livre', 'Leg press', 'Cadeira extensora', 'Mesa flexora', 'Stiff', 'Panturrilha em pé'] },
  { grupo: 'Ombros', itens: ['Desenvolvimento com halteres', 'Elevação lateral', 'Elevação frontal', 'Crucifixo inverso'] },
  { grupo: 'Bíceps', itens: ['Rosca direta', 'Rosca martelo', 'Rosca Scott'] },
  { grupo: 'Tríceps', itens: ['Tríceps pulley', 'Tríceps francês', 'Mergulho no banco'] },
  { grupo: 'Abdômen', itens: ['Abdominal crunch', 'Prancha', 'Elevação de pernas'] },
];

export const MODELOS_TREINO = [
  { id: 'a', nome: 'Treino A · Peito e Tríceps', cor: '#F472B6', exercicios: ['Supino reto', 'Supino inclinado com halteres', 'Crucifixo', 'Tríceps pulley', 'Tríceps francês'] },
  { id: 'b', nome: 'Treino B · Costas e Bíceps', cor: '#60A5FA', exercicios: ['Puxada frontal', 'Remada curvada', 'Remada baixa', 'Rosca direta', 'Rosca martelo'] },
  { id: 'c', nome: 'Treino C · Pernas', cor: '#34D399', exercicios: ['Agachamento livre', 'Leg press', 'Cadeira extensora', 'Mesa flexora', 'Panturrilha em pé'] },
  { id: 'd', nome: 'Treino D · Ombros e Abdômen', cor: '#FBBF24', exercicios: ['Desenvolvimento com halteres', 'Elevação lateral', 'Crucifixo inverso', 'Abdominal crunch', 'Prancha'] },
];
