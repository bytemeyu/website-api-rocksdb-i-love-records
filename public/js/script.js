document.addEventListener('DOMContentLoaded', function() {
    fetchProdutos();
});

function fetchProdutos() {
    fetch('http://localhost:3000/api/product')
    .then(response => response.json())
    .then(data => {
        console.log(data);
        mostrarProdutos(data);
    })
    .catch(error => console.error('erro ao buscar produtos:', error));
}

function mostrarProdutos(produtos) {
    const container = document.getElementById('lista-produtos');
    container.innerHTML = '';
    produtos.forEach(produto => {
        const newDiv = document.createElement('div');

        newDiv.classList.add('produto');

        const produtoInfo = JSON.parse(produto.value);

        newDiv.innerHTML = `<h3>${produtoInfo.name}</h3><p>R$ ${produtoInfo.value}</p>`;

        const newImg = document.createElement('img');
        newImg.id = 'coverImg';
        newImg.src = produtoInfo.imgUrl;
        newDiv.appendChild(newImg);

        container.appendChild(newDiv);
    });
}