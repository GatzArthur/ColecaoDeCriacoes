# Coleção de Criações

Uma coleção dos projetos, experiências e criações que desenvolvi ao longo da minha jornada por curiosidade e estudos.

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
