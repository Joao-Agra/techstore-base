import test from 'node:test'
import assert from 'node:assert/strict'

import { calcularTotal, produtoDisponivel, produtoVendido, removerUmaUnidade } from './carrinho.js'

test('calcularTotal ignora produtos sem preço válido', () => {
    const carrinho = [
        { id: 'p1', price: 79.9 },
        { id: 'p2', price: undefined },
        { id: 'p3', price: '' },
    ]

    assert.equal(calcularTotal(carrinho), 79.9)
})

test('produtoVendido rejeita itens sem preço definido', () => {
    assert.equal(produtoVendido({ id: 'p1', price: 49.9 }), true)
    assert.equal(produtoVendido({ id: 'p2', price: undefined }), false)
    assert.equal(produtoVendido({ id: 'p3' }), false)
})

test('produtoDisponivel rejeita itens sem preço ou sem estoque', () => {
    assert.equal(produtoDisponivel({ id: 'p1', price: 49.9, estoque: 3 }), true)
    assert.equal(produtoDisponivel({ id: 'p2', price: undefined, estoque: 10 }), false)
    assert.equal(produtoDisponivel({ id: 'p3', price: 99.9, estoque: 0 }), false)
})

test('removerUmaUnidade remove apenas uma unidade por clique, mesmo repetindo o mesmo produto', () => {
    const carrinho = [
        { id: 'p1', price: 20 },
        { id: 'p1', price: 20 },
        { id: 'p2', price: 30 },
    ]

    assert.deepEqual(removerUmaUnidade(carrinho, 'p1'), [
        { id: 'p1', price: 20 },
        { id: 'p2', price: 30 },
    ])

    assert.deepEqual(removerUmaUnidade(removerUmaUnidade(carrinho, 'p1'), 'p1'), [
        { id: 'p2', price: 30 },
    ])
})
