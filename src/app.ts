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

        const produto = new Produto(
        data.id ,
        data.nome ,
        data.preco ,
        data.fabricante
        );

        produtos.push(produto);

        res.status(200).json(produto);
    } catch (e: unknown) {
        res.status(400).json({
            Message: (e as Error).message
        });
    }
}

function buscarProduto(req: Request, res: Response): Produto | undefined{
    try{
        let id = Number(req.params.id);

        const produto = produtos.find(produto => produto.id === id);

        if (!produto) {
            res.status(404).json({
                Message: "Produto não encontrado"
            });
            return;
        }

        res.status(200).json(produto);
    } catch (e: unknown) {
        res.status(400).json({
            Message: (e as Error).message
        });
    }
}

function atualizarProduto(req: Request, res: Response): void{
    try{
        let data: any = req.body;
        let id = Number(req.params.id);

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

        const produtoNovo = new Produto(
        data.id ,
        data.nome ,
        data.preco ,
        data.fabricante
        );

        produto.nome = data.nome;
        produto.preco = data.preco;
        produto.fabricante = data.fabricante;

        res.status(200).json(produto);
    } catch (e: unknown) {
        res.status(400).json({
            Message: (e as Error).message
        });
    }
}

function removerProduto(req: Request, res: Response): void{
    try{
        let id = Number(req.params.id);

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
        res.status(400).json({
            Message: (e as Error).message
        });
    }
}

app.post('/api/product', novoProduto);
app.get('/api/product/:id', buscarProduto);
app.put('/api/product/:id', atualizarProduto);
app.delete('/api/product/:id', removerProduto);

app.listen(PORT, () => console.log(`API em execução no URL: http://localhost:${PORT}`))