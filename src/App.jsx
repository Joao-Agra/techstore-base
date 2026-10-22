import { useEffect, useState } from 'react'
import { Routes, Route } from 'react-router'
import Header from './components/Header'
import Footer from './components/Footer'
import RolarParaTopo from './components/RolarParaTopo'
import Loja from './pages/Loja'
import PaginaProduto from './pages/PaginaProduto'
import Carrinho from './pages/Carrinho'
import Estoque from './pages/Estoque'
import PainelLojista from './pages/PainelLojista'
import { buscarProdutos } from './services/produtos'
import { buscarClientes } from './services/clientes'
import { produtoDisponivel, removerUmaUnidade } from './utils/carrinho'
import { adicionarPedidoEspera } from './utils/espera'

export default function App() {
  const [produtos, setProdutos] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState(null)
  const [carrinho, setCarrinho] = useState([])
  const [clientes, setClientes] = useState([])
  const [clienteAtualId, setClienteAtualId] = useState(null)
  const [listaEspera, setListaEspera] = useState(() => {
    if (typeof window === 'undefined') return []

    try {
      const salvo = window.localStorage.getItem('techstore-lista-espera')
      return salvo ? JSON.parse(salvo) : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('techstore-lista-espera', JSON.stringify(listaEspera))
    }
  }, [listaEspera])

  useEffect(() => {
    buscarProdutos()
      .then((dados) => setProdutos(dados))
      .catch(() => setErro('Não foi possível carregar os produtos.'))
      .finally(() => setCarregando(false))

    buscarClientes().then((dados) => {
      setClientes(dados)
      if (dados.length > 0) setClienteAtualId(dados[0].id)
    })
  }, [])

  function adicionarAoCarrinho(produto) {
    if (!produtoDisponivel(produto)) {
      return
    }

    setCarrinho((atual) => atual.concat(produto))
  }

  function removerProdutoDoCarrinho(produtoId) {
    setCarrinho((atual) => removerUmaUnidade(atual, produtoId))
  }

  function registrarListaEspera(produtoId, nome, email) {
    const proximo = adicionarPedidoEspera(listaEspera, produtoId, nome, email)

    if (proximo.length === listaEspera.length) {
      return false
    }

    setListaEspera(proximo)
    return true
  }

  const clienteAtual = clientes.find((cliente) => cliente.id === clienteAtualId)

  return (
    <div className="app">
      <RolarParaTopo />
      <Header carrinho={carrinho} clienteAtual={clienteAtual} />

      <main className="conteudo">
        {carregando && <p className="aviso">Carregando produtos...</p>}
        {erro && <p className="aviso aviso-erro">{erro}</p>}

        {!carregando && !erro && (
          <Routes>
            <Route
              path="/"
              element={<Loja produtos={produtos} onAdicionar={adicionarAoCarrinho} />}
            />
            <Route
              path="/produto/:id"
              element={
                <PaginaProduto
                  produtos={produtos}
                  onAdicionar={adicionarAoCarrinho}
                  onAdicionarListaEspera={registrarListaEspera}
                  listaEspera={listaEspera}
                />
              }
            />
            <Route
              path="/carrinho"
              element={
                <Carrinho
                  carrinho={carrinho}
                  produtos={produtos}
                  clienteAtual={clienteAtual}
                  onAdicionar={adicionarAoCarrinho}
                  onRemover={removerProdutoDoCarrinho}
                />
              }
            />
            <Route path="/estoque" element={<Estoque produtos={produtos} listaEspera={listaEspera} />} />
            <Route
              path="/painel-lojista"
              element={<PainelLojista produtos={produtos} listaEspera={listaEspera} />}
            />
          </Routes>
        )}
      </main>

      <Footer
        clientes={clientes}
        clienteAtualId={clienteAtualId}
        onTrocarCliente={setClienteAtualId}
      />
    </div>
  )
}
