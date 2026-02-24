import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

const supabaseUrl = 'https://zuupkhhvcrjzwkgwwtgz.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp1dXBraGh2Y3JqendrZ3d3dGd6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE5NDg3MTcsImV4cCI6MjA4NzUyNDcxN30.KJiStEORy4v9egIiPsbK5qy_KS4GPwYSypFEZ3494zw'
const supabase = createClient(supabaseUrl, supabaseKey)

// Expor globalmente (opcional para testes no console)
window.supabase = supabase;

// --- FUNÇÃO ADICIONAR OU ATUALIZAR PREÇO ---
window.adicionarPreco = async function () {
  const produtoSelect = document.getElementById("produto");
  const barInput = document.getElementById("bar");
  const precoInput = document.getElementById("preco");

  const produto = produtoSelect.value;
  const bar = barInput.value.trim();
  const preco = parseFloat(precoInput.value);

  if (!produto || !bar || isNaN(preco)) {
    alert("Preencha todos os campos corretamente!");
    return;
  }

  // 1️⃣ Deletar preço antigo, se existir
  const { error: deleteError } = await supabase
    .from("bares")
    .delete()
    .eq("produto", produto)
    .eq("bar", bar);

  if (deleteError) {
    console.log("Erro ao deletar antigo:", deleteError);
  }

  // 2️⃣ Inserir novo registro
  const { error: insertError } = await supabase
    .from("bares")
    .insert([{ produto, bar, preco }]);

  if (insertError) {
    console.log("Erro ao inserir novo:", insertError);
    alert("Erro ao salvar preço!");
  } else {
    alert("Preço atualizado com sucesso!");
    precoInput.value = "";
    barInput.value = "";
    produtoSelect.value = "";
  }
};

// --- FUNÇÃO BUSCAR PREÇOS ---
window.buscarPreco = async function () {
  const buscaSelect = document.getElementById("buscaProduto");
  const resultadoDiv = document.getElementById("resultado");

  if (!buscaSelect || !resultadoDiv) {
    console.log("Elemento de busca não encontrado");
    return;
  }

  const produto = buscaSelect.value;
  console.log("Produto buscado:", produto);

  if (!produto) {
    alert("Selecione um produto");
    return;
  }

  const { data, error } = await supabase
    .from("bares")
    .select("*")
    .eq("produto", produto)
    .order("preco", { ascending: true });

  if (error) {
    console.log(error);
    resultadoDiv.innerHTML = "Erro ao buscar preços.";
    return;
  }

  if (data.length === 0) {
    resultadoDiv.innerHTML = "Nenhum preço encontrado.";
    return;
  }

  // montar HTML do resultado
  let html = "";
  data.forEach((item, index) => {
    if (index === 0) {
      html += `
        <p style="color: green; font-weight: bold;">
          🏆 ${item.bar} - R$ ${item.preco.toFixed(2)}
        </p>
      `;
    } else {
      html += `<p>${item.bar} - R$ ${item.preco.toFixed(2)}</p>`;
    }
  });

  resultadoDiv.innerHTML = html;
};
