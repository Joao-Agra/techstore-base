import { useState } from 'react'
import { Link, useParams } from 'react-router'
import { produtoDisponivel, produtoVendido } from '../utils/carrinho'
import { formatarPreco } from '../utils/formatarPreco'
import { obterListaEsperaPorProduto } from '../utils/espera'

export default function PaginaProduto({ produtos, onAdicionar, onAdicionarListaEspera, listaEspera }) {
  const { id } = useParams()
  const produto = produtos.find((item) => item.id === id)
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [mensagem, setMensagem] = useState('')
  const [sucesso, setSucesso] = useState(false)

  if (!produto) {
    return (
      <div className="estado-vazio">
        <p>Produto não encontrado.</p>
        <Link to="/" className="botao botao-secundario">
          Voltar para a loja
        </Link>
      </div>
    )
  }

  const podeVender = produtoDisponivel(produto)
  const relacionados = produtos
    .filter(
      (item) =>
        item.category === produto.category &&
        item.id !== produto.id &&
        produtoDisponivel(item)
    )
    .slice(0, 4)
  const interessados = obterListaEsperaPorProduto(listaEspera, produto.id)
  const indisponivel = !produtoDisponivel(produto)

  function enviarCadastroEspera(evento) {
    evento.preventDefault()

    const salvo = onAdicionarListaEspera(produto.id, nome, email)
    if (!salvo) {
      setSucesso(false)
      setMensagem('Preencha nome e e-mail válidos para receber o aviso quando o produto voltar.')
      return
    }

    setSucesso(true)
    setMensagem(`Tudo certo, ${nome.trim()}! Você será avisado por e-mail quando o produto voltar.`)
    setNome('')
    setEmail('')
  }

  return (
    <section>
      <nav className="trilha" aria-label="Você está em">
        <Link to="/">Loja</Link>
        <span aria-hidden="true">/</span>
        <span>{produto.title}</span>
      </nav>

      <div className="detalhe">
        <div className="detalhe-imagem-moldura">
          <img src={produto.image} alt={produto.title} className="detalhe-imagem" />
        </div>

        <div className="detalhe-info">
          <h1>{produto.title}</h1>
          <p className="card-avaliacao">
            ★ {produto.rating.rate} <span>({produto.rating.count} avaliações)</span>
          </p>
          <p className="detalhe-preco">{formatarPreco(produto.price)}</p>
          <p className="detalhe-descricao">{produto.description}</p>
          <p className={`detalhe-estoque ${indisponivel ? 'detalhe-estoque-esgotado' : ''}`}>
            {indisponivel
              ? !produtoVendido(produto)
                ? 'Produto sem preço definido'
                : 'Produto esgotado'
              : `${produto.estoque} unidades disponíveis`}
          </p>

          {indisponivel && (
            <div className="alerta-esgotado">
              <p className="mensagem-esgotado">
                Vimos o pedido do comercial sobre os esgotados. Só lembrando que o marketing
                divulga links de produtos nas redes sociais, e o cliente que chega por um desses links
                num produto indisponível precisa conseguir pedir para ser avisado quando ele voltar.
              </p>

              <form className="form-esgotado" onSubmit={enviarCadastroEspera}>
                <label className="campo-form">
                  <span>Nome</span>
                  <input
                    type="text"
                    value={nome}
                    onChange={(evento) => setNome(evento.target.value)}
                    placeholder="Seu nome"
                    required
                  />
                </label>

                <label className="campo-form">
                  <span>E-mail</span>
                  <input
                    type="email"
                    value={email}
                    onChange={(evento) => setEmail(evento.target.value)}
                    placeholder="seu@email.com"
                    required
                  />
                </label>

                <button type="submit" className="botao botao-grande">
                  Quero receber aviso
                </button>

                {mensagem && (
                  <p className={sucesso ? 'mensagem-form mensagem-sucesso' : 'mensagem-form mensagem-erro'}>
                    {mensagem}
                  </p>
                )}
              </form>

              {interessados.length > 0 && (
                <p className="lista-espera-total">
                  Já há {interessados.length} pessoa{interessados.length > 1 ? 's' : ''} esperando a
                  volta deste produto.
                </p>
              )}
            </div>
          )}

          <button
            className="botao botao-grande"
            onClick={() => onAdicionar(produto)}
            disabled={!podeVender}
          >
            Adicionar ao carrinho
          </button>

          <ul className="detalhe-garantias">
            <li>Troca grátis em até 30 dias</li>
            <li>Parcele em até 10x sem juros</li>
          </ul>
        </div>
      </div>

      <h2>Produtos relacionados</h2>
      <div className="grade">
        {relacionados.map((item) => (
          <article key={item.id} className="card">
            <Link to={`/produto/${item.id}`} className="card-link">
              <div className="card-imagem-moldura">
                <img src={item.image} alt={item.title} className="card-imagem" />
              </div>
              <h3 className="card-titulo">{item.title}</h3>
            </Link>
            <p className="preco">{formatarPreco(item.price)}</p>
            <button className="botao" onClick={() => onAdicionar(item)} disabled={!produtoVendido(item)}>
              Adicionar ao carrinho
            </button>
          </article>
        ))}
      </div>
    </section>
  )
}
