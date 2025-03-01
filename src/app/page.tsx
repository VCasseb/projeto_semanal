"use client";
import React, { useState } from 'react';
import Image from 'next/image';

interface Pedido {
  Id: string;
  Cliente: string;
  Email: string;
  Total: number;
  Status: string;
  DataCriacao: string;
  DataAtualiza: string;
  Itens: string; // JSON string contendo os itens do pedido
}

interface Item {
  id: string;
  nome: string;
  quantidade: number;
  preco: number;
}

export default function Home() {
  const [pedidoId, setPedidoId] = useState("");
  const [resultado, setResultado] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(false);

  // Estados para o formulário de inserção de pedido
  const [cliente, setCliente] = useState("");
  const [email, setEmail] = useState("");
  const [itens, setItens] = useState("");
  const [status, setStatus] = useState("PENDENTE");

  const handleConsultarPedido = async () => {
    setLoading(true);
    console.log("funcao");
    console.log(pedidoId);
    if (pedidoId && pedidoId.trim() !== "") {
      try {
        console.log("entrou ONE CONSULTA");
        const response = await fetch(
          `https://consultaronepedido.azurewebsites.net/api/consultaronepedido/${pedidoId}?code=ycV4rX_dli8s8gUa2Dhx-H3uQ682e8NMt_neIETY3QNDAzFuVZKnyg==`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              id: pedidoId,
            }),
          }
        );

        if (!response.ok) {
          throw new Error(`Erro na requisição: ${response.statusText}`);
        }
        const data = await response.json();
        setResultado(data);
      } catch (error) {
        console.error("Erro ao consultar pedidos:", error);
        setResultado([]);
      } finally {
        setLoading(false);
      }
    } else {
      try {
        console.log("CONSULTA");
        const response = await fetch(
          `https://semanal.azurewebsites.net/api/consultarpedidos?code=hhLwjuIImarTerNlkmzz1CuMSdL8qEGM8GYuKaKVfgVUAzFuB8t9LA==`
        );
        const data: Pedido[] = await response.json();
        setResultado(data);
      } catch (error) {
        console.error("Erro ao consultar pedidos:", error);
        setResultado([]);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleInserirPedido = async () => {
    // Validação de campos obrigatórios
    if (!cliente || !email || !itens || !status) {
      alert("Todos os campos são obrigatórios!");
      return;
    }
  
    // Criação dos itens no formato correto (produto como um array de objetos)
    const itensFormatados = JSON.stringify({
      produtos: itens.split(',').map((produto, index) => ({
        id: `item-${index + 1}`,
        nome: produto.trim(),
        quantidade: 1, // Defina a quantidade conforme necessário
        preco: 0, // Defina o preço conforme necessário
      })),
    });
  
    // Formatação correta do pedido com os itens escapados
    const pedido = `
    {
      "cliente": "${cliente}",
      "email": "${email}",
      "itens": "${itensFormatados.replace(/"/g, '\\"')}",
      "total": 0,
      "status": "${status}"
    }`;
  
    console.log("pedido: ", pedido);
  
    // Agora você pode fazer a requisição com o objeto 'pedido'
    try {
      // Envio da requisição
      await fetch("https://inserirpedidos.azurewebsites.net/api/inserirpedidos?code=_MWbNmCbn04zDoBRWwuwAis0tjN3mX9a2j7mJivzjHoOAzFuiYjOaw==", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: pedido, // Enviar como string diretamente
      });
    } catch (error) {
      console.error("Erro ao inserir pedido:", error);
    }
  };
  
  
  
  const handleDeletarPedido = async (id: string) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://excluirpedido.azurewebsites.net/api/excluirpedido/${id}?code=fFqsP5qau9byWTdr7UQByEagAy4UJKzvfvz3EYigfpDYAzFuzH6IrQ==`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Erro ao deletar pedido: ${response.statusText}`);
      }

      // Atualiza a lista de pedidos após a exclusão
      setResultado(resultado.filter((pedido) => pedido.Id !== id));
      alert("Pedido deletado com sucesso!");
    } catch (error) {
      console.error("Erro ao deletar pedido:", error);
      alert("Erro ao deletar pedido.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />
        <div className="flex flex-col gap-4">
          {/* Formulário para inserir pedido */}
          <div className="flex flex-col gap-4">
            <h2 className="text-xl font-semibold">Inserir Novo Pedido</h2>
            <input
              type="text"
              value={cliente}
              onChange={(e) => setCliente(e.target.value)}
              placeholder="Cliente"
              className="p-2 border rounded"
            />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="p-2 border rounded"
            />
            <textarea
              value={itens}
              onChange={(e) => setItens(e.target.value)}
              placeholder="Itens (separados por vírgulas, ex: Produto1, Produto2, Produto3)"
              className="p-2 border rounded"
              rows={4}
            />
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="p-2 border rounded"
            >
              <option value="PENDENTE">Pendente</option>
              <option value="CONCLUIDO">Concluído</option>
              <option value="CANCELADO">Cancelado</option>
            </select>
            <button
              onClick={handleInserirPedido}
              className="p-2 bg-green-500 text-white rounded"
              disabled={loading}
            >
              {loading ? 'Inserindo...' : 'Inserir Pedido'}
            </button>
          </div>

          {/* Consulta de pedido por ID */}
          <input
            type="text"
            value={pedidoId}
            onChange={(e) => setPedidoId(e.target.value)}
            placeholder="ID do Pedido"
            className="p-2 border rounded"
          />
          <div className="flex gap-4">
            <button
              onClick={handleConsultarPedido}
              className="p-2 bg-blue-500 text-white rounded"
              disabled={loading}
            >
              {loading ? 'Carregando...' : 'Consultar Pedido'}
            </button>
          </div>

          {/* Exibição dos resultados */}
          {resultado.length > 0 && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4">Resultados:</h2>
              <div className="space-y-4">
                {resultado.map((pedido) => {
                  let itens: Item[] = [];
                  try {
                    // Tenta converter o campo Itens de string JSON para objeto
                    if (typeof pedido.Itens === "string") {
                      itens = JSON.parse(pedido.Itens).produtos;
                    } else {
                      console.error("Campo Itens não é uma string JSON válida:", pedido.Itens);
                    }
                  } catch (error) {
                    console.error("Erro ao fazer parsing do campo Itens:", error);
                  }

                  return (
                    <div key={pedido.Id} className="border p-4 rounded-lg shadow-sm">
                      <p>
                        <strong>ID:</strong> {pedido.Id}
                      </p>
                      <p>
                        <strong>Cliente:</strong> {pedido.Cliente}
                      </p>
                      <p>
                        <strong>Email:</strong> {pedido.Email}
                      </p>
                      <p>
                        <strong>Total:</strong> R$ {pedido.Total.toFixed(2)}
                      </p>
                      <p>
                        <strong>Status:</strong> {pedido.Status}
                      </p>
                      <p>
                        <strong>Data de Criação:</strong>{" "}
                        {new Date(pedido.DataCriacao).toLocaleString()}
                      </p>
                      <p>
                        <strong>Data de Atualização:</strong>{" "}
                        {new Date(pedido.DataAtualiza).toLocaleString()}
                      </p>
                      <div>
                        <strong>Itens:</strong>
                        {itens.length > 0 ? (
                          <ul className="list-disc pl-6">
                            {itens.map((item) => (
                              <li key={item.id}>
                                {item.nome} - {item.quantidade}x R$ {item.preco.toFixed(2)}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-red-500">Itens inválidos ou não disponíveis.</p>
                        )}
                      </div>
                      <button
                        onClick={() => handleDeletarPedido(pedido.Id)}
                        className="p-2 bg-red-500 text-white rounded mt-2"
                        disabled={loading}
                      >
                        Deletar
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to nextjs.org →
        </a>
      </footer>
    </div>
  );
}