# TechFlow — Dashboard de Projetos

## Objetivo
Projeto acadêmico desenvolvido para o Checkpoint 5 de FrontEnd Design da FIAP. O projeto apresenta um painel responsivo para acompanhar projetos, equipes, prazos e indicadores.

## Integrantes
- Jonathan Josué (569810)
- Nicolas Prestelo (570785)
- Murillo Serrano (569296)
## Tecnologias utilizadas
- HTML5
- Tailwind CSS (via CDN)
- CSS3 complementar
- JavaScript puro (Vanilla JavaScript)
- `localStorage` e `matchMedia` para preferência de tema

## Funcionalidades
- Dashboard com quatro indicadores e seis projetos de exemplo.
- Cards de projetos organizados com CSS Grid e dimensões adaptáveis.
- Pesquisa por nome, categoria, responsável ou status.
- Modal de cadastro com validação visual e feedback de sucesso.
- Adição dinâmica de projetos durante a sessão.
- Sidebar responsiva e dropdown do usuário.
- Temas Light, Dark e System, com preferência armazenada no `localStorage`.
- Estados de hover, focus, active, disabled e group-hover.
- Layout Mobile-First com breakpoints do Tailwind (`sm`, `md`, `lg`, `xl`, `2xl`).
- Mensagens de validação, estado vazio e suporte a interações por teclado.

## Estrutura
```text
techflow-dashboard/
├── index.html
├── css/
│   └── styles.css
├── js/
│   └── app.js
└── README.md
```

## Como executar
1. Descompacte a pasta do projeto.
2. Abra a pasta `techflow-dashboard` no Visual Studio Code.
3. Abra `index.html` no navegador. Para uma experiência mais consistente, use a extensão Live Server do VS Code e clique em **Open with Live Server**.
4. Como o Tailwind é carregado por CDN, é necessária uma conexão com a internet para carregar o framework.

Não há etapa de build, backend ou banco de dados. Os projetos adicionados pelo formulário existem apenas durante a sessão atual; somente a preferência de tema é persistida no `localStorage`.

## Repositório GitHub
(https://github.com/jonathanjosue-vazquez/CP5-FRONT-END)

## Dificuldades encontradas
Durante o desenvolvimento, os principais desafios foram ajustar a responsividade do dashboard para diferentes tamanhos de tela, integrar as interações em JavaScript aos estilos do Tailwind CSS e garantir o funcionamento dos temas claro e escuro. Também foi necessário testar a validação do formulário e os estados visuais dos botões para proporcionar uma experiência de uso consistente.
