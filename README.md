# Coleção de Criações

## Estrutura

- `index.html` → página única. Todo mundo vê a galeria; só quem sabe a senha vê os controles de edição.
- `JS/projetos-data.js` → arquivo com os dados publicados dos projetos (o que o site carrega ao abrir).
- `JS/script.js` → toda a lógica: galeria pública + modo admin com senha.
- `CSS/style.css` → estilo.

## Como usar o modo admin

1. Abra o site (local ou já publicado) e clique no botão **"Admin"** no canto superior direito.
2. Digite a senha. Os botões de **adicionar**, **excluir** e **gerar arquivo** aparecem.
3. Adicione ou exclua os projetos normalmente — as mudanças ficam salvas só no seu navegador (rascunho), ninguém mais vê ainda.
4. Clique em **"Gerar arquivo"** → **"Baixar projetos-data.js"**.
5. Substitua o arquivo `JS/projetos-data.js` do seu repositório pelo baixado.
6. `git add`, `git commit`, `git push`.
7. Em pouco tempo o GitHub Pages atualiza o site para todo mundo que acessar o link.


## Importante entender sobre a senha

O botão "Admin" evita que um visitante comum (como um recrutador) veja ou use os controles de
edição — ele nem sabe que existem. Só o *hash* da senha fica no código (não a senha em texto puro),
então quem olhar o código-fonte não vê sua senha diretamente.

Dito isso, isto **não é segurança real de servidor**: como o site é 100% estático, alguém com conhecimento técnico avançado poderia, em teoria, inspecionar o JavaScript pelo console do navegador e manipular o estado da página manualmente. Na prática isso é bem improvável para o seu caso de uso (mostrar um portfólio para recrutadores), mas não trate essa senha como se protegesse dados sigilosos — é uma trava de conveniência, não um sistema de login de verdade.

## Limitação sobre imagens

As imagens ficam guardadas como base64 dentro do `projetos-data.js`. Evite subir dezenas de fotos
em altíssima resolução — isso deixa o arquivo (e o carregamento do site) pesado. Fotos de algumas centenas de KB cada já ficam ótimas para portfólio.