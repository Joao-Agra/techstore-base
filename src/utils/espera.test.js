import test from 'node:test'
import assert from 'node:assert/strict'

import { adicionarPedidoEspera, obterListaEsperaPorProduto } from './espera.js'

test('adicionarPedidoEspera guarda cadastro de espera sem duplicar o mesmo e-mail para o mesmo produto', () => {
    const listaInicial = [
        { produtoId: 'p1', nome: 'Maria', email: 'maria@email.com' },
    ]

    const comNovo = adicionarPedidoEspera(listaInicial, 'p1', 'Maria', 'maria@email.com')
    const comOutro = adicionarPedidoEspera(listaInicial, 'p1', 'João', 'joao@email.com')

    assert.deepEqual(comNovo, listaInicial)
    assert.equal(comOutro.length, 2)
    assert.equal(comOutro[1].nome, 'João')
})

test('obterListaEsperaPorProduto retorna só os interessados do produto informado', () => {
    const lista = [
        { produtoId: 'p1', nome: 'Maria', email: 'maria@email.com' },
        { produtoId: 'p2', nome: 'Pedro', email: 'pedro@email.com' },
        { produtoId: 'p1', nome: 'José', email: 'jose@email.com' },
    ]

    assert.deepEqual(obterListaEsperaPorProduto(lista, 'p1'), [
        { produtoId: 'p1', nome: 'Maria', email: 'maria@email.com' },
        { produtoId: 'p1', nome: 'José', email: 'jose@email.com' },
    ])
})
