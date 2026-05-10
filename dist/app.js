"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Produto_1 = require("./Produto");
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const PORT = process.env.PORT ?? 3000;
const produtos = [];
app.use(express_1.default.json());
function novoProduto(req, res) {
    try {
        let data = req.body;
        if (!data.nome ||
            !data.preco ||
            !data.fabricante) {
            throw new Error("Produto requer nome, preco e fabricante");
        }
        //validacao para nao ter id duplicado
        const produtoExistente = produtos.find(produto => produto.id === data.id);
        if (produtoExistente) {
            res.status(400).json({
                Message: "Já existe um produto com esse ID"
            });
            return;
        }
        //validacao para o preco ser maior que 0
        if (data.preco <= 0) {
            res.status(400).json({
                Message: "O preco deve ser maior que zero"
            });
            return;
        }
        //validacao para que o endereco seja preenchido
        if (!data.fabricante.endereco ||
            !data.fabricante.endereco.cidade ||
            !data.fabricante.endereco.pais) {
            res.status(400).json({
                Message: "Cidade e pais sao obrigatorios"
            });
            return;
        }
        //validacao para que o fabricante tenha nome
        if (!data.fabricante.nome) {
            res.status(400).json({
                Message: "Fabricante deve possuir nome"
            });
            return;
        }
        const produto = new Produto_1.Produto(data.id, data.nome, data.preco, data.fabricante);
        produtos.push(produto);
        res.status(200).json(produto);
    }
    catch (e) {
        res.status(500).json({
            Message: e.message
        });
    }
}
function buscarProduto(req, res) {
    try {
        let id = Number(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({
                Message: "ID inválido"
            });
            return;
        }
        const produto = produtos.find(produto => produto.id === id);
        if (!produto) {
            res.status(404).json({
                Message: "Produto não encontrado"
            });
            return;
        }
        res.status(200).json(produto);
    }
    catch (e) {
        res.status(500).json({
            Message: e.message
        });
    }
}
function atualizarProduto(req, res) {
    try {
        let data = req.body;
        let id = Number(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({
                Message: "ID inválido"
            });
            return;
        }
        const produto = produtos.find(produto => produto.id === id);
        if (!produto) {
            res.status(404).json({
                Message: "Produto não encontrado"
            });
            return;
        }
        if (!data.nome ||
            !data.preco ||
            !data.fabricante) {
            throw new Error("Produto requer nome, preco e fabricante");
        }
        //validacao para o preco ser maior que 0
        if (data.preco <= 0) {
            res.status(400).json({
                Message: "O preco deve ser maior que zero"
            });
            return;
        }
        //validacao para que o endereco seja preenchido
        if (!data.fabricante.endereco ||
            !data.fabricante.endereco.cidade ||
            !data.fabricante.endereco.pais) {
            res.status(400).json({
                Message: "Cidade e pais sao obrigatorios"
            });
            return;
        }
        //validacao para que o fabricante tenha nome
        if (!data.fabricante.nome) {
            res.status(400).json({
                Message: "Fabricante deve possuir nome"
            });
            return;
        }
        produto.nome = data.nome;
        produto.preco = data.preco;
        produto.fabricante = data.fabricante;
        res.status(200).json(produto);
    }
    catch (e) {
        res.status(500).json({
            Message: e.message
        });
    }
}
function removerProduto(req, res) {
    try {
        let id = Number(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({
                Message: "ID inválido"
            });
            return;
        }
        const produto = produtos.find(produto => produto.id === id);
        if (!produto) {
            res.status(404).json({
                Message: "Produto não encontrado"
            });
            return;
        }
        const index = produtos.indexOf(produto);
        produtos.splice(index, 1);
        res.status(200).json(produto);
    }
    catch (e) {
        res.status(500).json({
            Message: e.message
        });
    }
}
app.post('/api/product', novoProduto);
app.get('/api/product/:id', buscarProduto);
app.put('/api/product/:id', atualizarProduto);
app.delete('/api/product/:id', removerProduto);
app.listen(PORT, () => console.log(`API em execução no URL: http://localhost:${PORT}`));
