import { Produto } from "./Produto"
import express, { Request, Response } from "express"

const app = express()
const PORT = process.env.PORT ?? 3000
const produtos: Produto[] = [];
app.use(express.json())

function novoProduto (req: Request, res: Response): void {
    try {
        let data: any = req.body;

        if (
            !data.nome ||
            !data.preco ||
            !data.fabricante
        ) {
            throw new Error (
            "Produto requer nome, preco e fabricante"
            );
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
        if (
            !data.fabricante.endereco ||
            !data.fabricante.endereco.cidade ||
            !data.fabricante.endereco.pais
        ) {
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

        const produto = new Produto(
        data.id ,
        data.nome ,
        data.preco ,
        data.fabricante
        );

        produtos.push(produto);

        res.status(200).json(produto);
    } catch (e: unknown) {
        res.status(500).json({
            Message: (e as Error).message
        });
    }
}

function buscarProduto(req: Request, res: Response): void{
    try{
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
    } catch (e: unknown) {
        res.status(500).json({
            Message: (e as Error).message
        });
    }
}

function atualizarProduto(req: Request, res: Response): void{
    try{
        let data: any = req.body;
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

        if (
            !data.nome ||
            !data.preco ||
            !data.fabricante
        ) {
            throw new Error (
            "Produto requer nome, preco e fabricante"
            ) ;
        }

        //validacao para o preco ser maior que 0
        if (data.preco <= 0) {
            res.status(400).json({
                Message: "O preco deve ser maior que zero"
            });
            return;
        }

        //validacao para que o endereco seja preenchido
        if (
            !data.fabricante.endereco ||
            !data.fabricante.endereco.cidade ||
            !data.fabricante.endereco.pais
        ) {
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
    } catch (e: unknown) {
        res.status(500).json({
            Message: (e as Error).message
        });
    }
}

function removerProduto(req: Request, res: Response): void{
    try{
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
    } catch (e: unknown) {
        res.status(500).json({
            Message: (e as Error).message
        });
    }
}

app.post('/api/produto', novoProduto);
app.get('/api/produto/:id', buscarProduto);
app.put('/api/produto/:id', atualizarProduto);
app.delete('/api/produto/:id', removerProduto);

app.listen(PORT, () => console.log(`API em execução no URL: http://localhost:${PORT}`))