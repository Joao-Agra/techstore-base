import { formatarPreco } from '../utils/formatarPreco'
import { produtoVendido } from '../utils/carrinho'
import { resumirCategoriaLojista } from '../utils/lojista'

export default function PainelLojista({ produtos, listaEspera }) {
  const resumoCategorias = resumirCategoriaLojista(produtos, listaEspera)
  const categorias = Object.values(resumoCategorias)

  const valorTotalEmEstoque = categorias.reduce((total, categoria) => total + categoria.valorEstoque, 0)
  const lucroTotalEstimado = categorias.reduce((total, categoria) => total + categoria.lucroEstimado, 0)
  const clientesEsperando = listaEspera.length
  const produtosSemPreco = produtos.filter((produto) => !produtoVendido(produto)).length
  const produtosSemPrecoLista = produtos.filter((produto) => !produtoVendido(produto))

  return (
    <section className="painel-lojista">
      <div className="painel-topo">
        <div>
          <p className="sobretitulo">Painel do lojista</p>
          <h1>Rendimento da loja</h1>
        </div>
      </div>

      <div className="cards-metricas">
        <div className="card-metrica">
          <span className="metrica-label">Valor em estoque</span>
          <strong className="metrica-valor">{formatarPreco(valorTotalEmEstoque)}</strong>
        </div>

        <div className="card-metrica">
          <span className="metrica-label">Lucro bruto estimado</span>
          <strong className="metrica-valor">{formatarPreco(lucroTotalEstimado)}</strong>
        </div>

        <div className="card-metrica">
          <span className="metrica-label">Clientes esperando retorno</span>
          <strong className="metrica-valor">{clientesEsperando}</strong>
        </div>

        <div className="card-metrica">
          <span className="metrica-label">Produtos sem preço</span>
          <strong className="metrica-valor">{produtosSemPreco}</strong>
        </div>
      </div>

      <div className="painel-grid">
        <div className="painel-bloco">
          <h2>Resumo por categoria</h2>

          <div className="tabela-moldura">
            <table className="tabela tabela-painel">
              <thead>
                <tr>
                  <th>Categoria</th>
                  <th>Valor em estoque</th>
                  <th>Lucro bruto</th>
                  <th>Clientes esperando</th>
                </tr>
              </thead>
              <tbody>
                {categorias.map((categoria) => (
                  <tr key={categoria.categoria}>
                    <td>{categoria.categoria}</td>
                    <td>{formatarPreco(categoria.valorEstoque)}</td>
                    <td>{formatarPreco(categoria.lucroEstimado)}</td>
                    <td>{categoria.clientesEsperando}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="painel-bloco">
          <h2>Parados esperando preço</h2>

          {produtosSemPrecoLista.length === 0 ? (
            <p className="lista-vazia">Nenhum produto está aguardando preço do time de suprimentos.</p>
          ) : (
            <ul className="lista-painel">
              {produtosSemPrecoLista.map((produto) => (
                <li key={produto.id}>
                  <strong>{produto.title}</strong>
                  <span>{produto.category}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  )
}
