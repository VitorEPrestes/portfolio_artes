# Descrição detalhada do site ISOLAS

## 1. O que é este site

Este projeto é um portfólio de artista digital focado em comissões (encomendas) de arte. O site apresenta trabalhos em destaque, galeria filtrável por categoria, tabela de preços, termos de serviço e canais de contato/comunidade.

A aplicação foi construída em React com Vite e tem uma proposta visual forte: mistura estética de grafite urbano com referências de jogos retrô, usando cores neon, texturas e animações para criar personalidade.

## 2. Objetivo principal

O site foi desenhado para cumprir três objetivos ao mesmo tempo:

- Exibir o estilo artístico e os tipos de trabalho do artista.
- Converter visitantes em clientes através de seções de preços e termos.
- Fortalecer presença de comunidade com chamada para Discord e redes sociais.

## 3. Público-alvo

- Pessoas que querem encomendar arte digital personalizada.
- Criadores de conteúdo que precisam de thumbnails e identidade visual.
- Comunidade de jogos/streaming que busca ícones, avatares e personagens estilizados.

## 4. Estilo visual

### 4.1 Direção estética

A direção visual é definida no próprio projeto como:

- Grafite de rua + jogos retrô.
- Ambiente escuro com contraste neon.
- Sensação de interface "arcade"/"cyber-urbana".

### 4.2 Cores e atmosfera

O tema usa base escura (cinza/preto) com acentos neon:

- Neon rosa, azul, verde, amarelo, laranja e roxo.
- Separadores e gradientes para guiar leitura entre blocos.
- Texturas sutis de ruído e linhas de varredura (scanlines) para reforçar atmosfera retrô.

### 4.3 Tipografia

A tipografia combina legibilidade com identidade gamer:

- Fonte pixel para títulos.
- Fonte monoespaçada para corpo e interface.

Esse contraste ajuda a manter o site estilizado sem perder clareza.

### 4.4 Movimento e animação

As animações (com Motion) são parte da linguagem visual:

- Entradas suaves em scroll para títulos e cards.
- Hover com elevação/escala para cards e ações.
- Abertura de menu mobile com transição lateral.
- Lightbox animado para visualização ampliada de artes.

Resultado: interface dinâmica, sem quebrar a navegação.

## 5. Estrutura e conteúdo das seções

### 5.1 Navegação (Navbar)

Menu fixo com links para:

- Início
- Destaques
- Galeria
- Preços
- Termos
- Contato

Inclui versão mobile com menu em overlay e bloqueio de scroll de fundo enquanto aberto.

### 5.2 Hero (capa)

Primeira dobra do site, com:

- Tag "ARTISTA DIGITAL".
- Nome/marca "ISOLAS" em destaque.
- CTA principal "Ver trabalhos".
- CTA secundário "Preços".
- Indicador de rolagem para a próxima seção.

É a área mais orientada à primeira impressão de marca.

### 5.3 Showcase (Melhores trabalhos)

Grade de destaques com cards clicáveis e abertura em lightbox.

Conteúdo atual:

- 6 itens de destaque (placeholders).
- Foco em exibir portfólio principal em formato rápido.

### 5.4 Galeria

Seção com filtro por categoria e animação de reorganização.

Categorias:

- Todos
- Thumbnails
- Ícones
- Meio-corpo
- Corpo inteiro
- Outros

Conteúdo atual:

- Itens ainda em placeholder (imagens SVG inline).
- Estrutura pronta para receber artes reais.

### 5.5 Tabela de preços

Cards com planos de comissão:

- Ícone: R$ 25
- Meio-corpo: R$ 50 (marcado como popular)
- Corpo inteiro: R$ 80

Notas complementares:

- Valor pode variar conforme complexidade.
- Cenários/extras são combinados à parte.
- Pagamento: 50/50 ou antecipado.

### 5.6 Termos de serviço

Componente em formato acordeão com tópicos como:

- O que faz
- O que não faz
- Prazo de entrega
- Política de reembolso
- Uso da arte

Essa seção aumenta transparência e reduz atrito no fechamento de pedidos.

### 5.7 Em construção

Bloco de anúncio para futuras entregas:

- Destaque para "Low Poly 3D" chegando em breve.
- Elementos visuais de sinalização (fita, cones, ícones).

Serve para comunicar roadmap e manter interesse.

### 5.8 Discord

Card de convite para comunidade com:

- Benefícios de entrar no servidor.
- Estado visual de "online".
- Botão de entrada (atualmente placeholder).

### 5.9 Footer

Rodapé com:

- Links sociais (Twitter/X, Instagram, YouTube, Discord).
- Assinatura da marca ISOLAS.
- Copyright dinâmico por ano.

## 6. Experiência de uso (UX)

### 6.1 Fluxo esperado do visitante

Fluxo principal pensado para conversão:

- Impacto inicial no hero.
- Prova visual em destaques e galeria.
- Decisão em preços + termos.
- Ação via contato/redes/Discord.

### 6.2 Acessibilidade e usabilidade

Pontos positivos já presentes:

- Skip link para pular direto ao conteúdo.
- Navegação por seções com rolagem suave.
- Separação clara de blocos e títulos.
- Layout adaptado para mobile.

## 7. Stack técnica

- React 19
- Vite 6
- Motion (animações)
- React Scroll (navegação por âncora)
- React Icons (ícones)

Scripts principais:

- `npm run dev` para desenvolvimento
- `npm run build` para produção
- `npm run preview` para testar build
- `npm run deploy` para gerar build de produção

## 8. Estado atual do conteúdo

Atualmente o site está estruturalmente completo no front-end, com visual e interações prontos, mas com parte do conteúdo ainda em modo de preparação:

- Galeria e destaques usam placeholders SVG.
- Links de redes/Discord e botão de encomenda estão como `#` (sem destino final).

Ou seja: a base de design, navegação e componentes está pronta; falta principalmente plugar assets reais e links de produção.

## 9. Resumo executivo

Este é um portfólio de artista digital com foco comercial, forte identidade visual (grafite + retrô neon), arquitetura de seções orientada à conversão e experiência dinâmica com animações. O projeto já comunica marca, serviços, preços e regras com clareza, e está em fase ideal para substituição dos placeholders por conteúdo final e publicação definitiva.
