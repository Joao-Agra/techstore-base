import test from 'node:test'
import assert from 'node:assert/strict'

import { resumirCategoriaLojista } from './lojista.js'

test('resumirCategoriaLojista calcula valor em estoque, clientes na fila e lucro estimado por categoria', () => {
  const produtos = [
    { id: 'p1', category: 'roupas', title: 'Camiseta', price: 50, estoque: 2 },
    { id: 'p2', category: 'roupas', title: 'Regata', price: 40, estoque: 1 },
    { id: 'p3', category: 'eletronicos', title: 'Mouse', price: undefined, estoque: 5 },
    { id: 'p4', category: 'eletronicos', title: 'Teclado', price: 200, estoque: 3 },
  ]

  const listaEspera = [
    { produtoId: 'p1', nome: 'Ana', email: 'ana@email.com' },
    { produtoId: 'p2', nome: 'Bia', email: 'bia@email.com' },
    { produtoId: 'p4', nome: 'Caio', email: 'caio@email.com' },
  ]

  const resumo = resumirCategoriaLojista(produtos, listaEspera)

  assert.deepEqual(resumo.roupas, {
    categoria: 'roupas',
    valorEstoque: 140,
    lucroEstimado: 56,
    clientesEsperando: 2,
    produtosSemPreco: 0,
  })

  assert.deepEqual(resumo.eletronicos, {
    categoria: 'eletronicos',
    valorEstoque: 600,
    lucroEstimado: 240,
    clientesEsperando: 1,
    produtosSemPreco: 1,
  })
})
