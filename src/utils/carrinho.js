// O carrinho guarda uma entrada por unidade adicionada.
// Ex.: duas camisetas iguais = o mesmo produto duas vezes no array.

export function produtoVendido(produto) {
  if (!produto || typeof produto !== 'object') return false

  const preco = Number(produto.price)
  return Number.isFinite(preco)
}

export function produtoDisponivel(produto) {
  if (!produto || typeof produto !== 'object') return false

  return produtoVendido(produto) && Number(produto.estoque) > 0
}

export function removerUmaUnidade(carrinho, produtoId) {
  if (!Array.isArray(carrinho)) return []

  const indice = carrinho.findIndex((produto) => produto && produto.id === produtoId)
  if (indice === -1) {
    return carrinho
  }

  return carrinho.filter((_, posicao) => posicao !== indice)
}

export function calcularTotal(carrinho) {
  return carrinho.reduce((total, produto) => {
    if (!produtoVendido(produto)) {
      return total
    }

    return total + Number(produto.price)
  }, 0)
}

export function agruparItens(carrinho) {
  const itens = []
  carrinho.forEach((produto) => {
    if (!produtoVendido(produto)) {
      return
    }

    const existente = itens.find((item) => item.produto.id === produto.id)
    if (existente) {
      existente.quantidade += 1
    } else {
      itens.push({ produto, quantidade: 1 })
    }
  })
  return itens
}
