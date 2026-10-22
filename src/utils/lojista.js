export function resumirCategoriaLojista(produtos = [], listaEspera = []) {
    const porCategoria = {}

    const pedidosPorProduto = new Map()
    listaEspera.forEach((pedido) => {
        const produtoId = String(pedido.produtoId ?? '')
        if (!produtoId) return

        const atual = pedidosPorProduto.get(produtoId) ?? []
        atual.push(pedido)
        pedidosPorProduto.set(produtoId, atual)
    })

    produtos.forEach((produto) => {
        const categoria = produto.category || 'sem-categoria'
        const preco = Number(produto.price)
        const estoque = Number(produto.estoque) || 0
        const precoValido = Number.isFinite(preco)
        const valorEstoque = precoValido && estoque > 0 ? preco * estoque : 0
        const lucroEstimado = valorEstoque * 0.4

        if (!porCategoria[categoria]) {
            porCategoria[categoria] = {
                categoria,
                valorEstoque: 0,
                lucroEstimado: 0,
                clientesEsperando: 0,
                produtosSemPreco: 0,
            }
        }

        porCategoria[categoria].valorEstoque += valorEstoque
        porCategoria[categoria].lucroEstimado += lucroEstimado
        porCategoria[categoria].clientesEsperando += pedidosPorProduto.get(produto.id)?.length || 0
        porCategoria[categoria].produtosSemPreco += precoValido ? 0 : 1
    })

    return Object.fromEntries(
        Object.entries(porCategoria).sort((a, b) => b[1].valorEstoque - a[1].valorEstoque)
    )
}
