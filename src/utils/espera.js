export function adicionarPedidoEspera(listaAtual = [], produtoId, nome, email) {
    if (!Array.isArray(listaAtual)) return []

    const id = String(produtoId ?? '').trim()
    const nomeLimpo = String(nome ?? '').trim()
    const emailLimpo = String(email ?? '').trim().toLowerCase()

    if (!id || !nomeLimpo || !emailLimpo) {
        return listaAtual
    }

    const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailLimpo)
    if (!emailValido) {
        return listaAtual
    }

    const jaExiste = listaAtual.some(
        (pedido) => pedido.produtoId === id && pedido.email === emailLimpo
    )

    if (jaExiste) {
        return listaAtual
    }

    return [...listaAtual, { produtoId: id, nome: nomeLimpo, email: emailLimpo }]
}

export function obterListaEsperaPorProduto(listaEspera = [], produtoId) {
    if (!Array.isArray(listaEspera)) return []

    const id = String(produtoId ?? '').trim()
    if (!id) return []

    return listaEspera.filter((pedido) => pedido.produtoId === id)
}
