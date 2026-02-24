import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

const supabaseUrl = 'https://zuupkhhvcrjzwkgwwtgz.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp1dXBraGh2Y3JqendrZ3d3dGd6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE5NDg3MTcsImV4cCI6MjA4NzUyNDcxN30.KJiStEORy4v9egIiPsbK5qy_KS4GPwYSypFEZ3494zw'
const supabase = createClient(supabaseUrl, supabaseKey)

// ===============================
// 🔥 ADICIONAR PREÇO
// ===============================
window.adicionarPreco = async function () {

  const produtoSelect = document.getElementById("produto")
  const barInput = document.getElementById("bar")
  const precoInput = document.getElementById("preco")

  if (!produtoSelect || !barInput || !precoInput) {
    console.log("Algum elemento não foi encontrado")
    return
  }

  const produto = produtoSelect.value
  const bar = barInput.value
  const preco = parseFloat(precoInput.value)

  if (!produto || !bar || isNaN(preco)) {
    alert("Preencha todos os campos corretamente")
    return
  }

  const { error } = await supabase
    .from("bares")
    .insert([{ produto, bar, preco }])

  if (error) {
    alert("Erro ao salvar")
    console.log(error)
  } else {
    alert("Preço salvo com sucesso!")
    barInput.value = ""
    precoInput.value = ""
  }
}



// ===============================
// 🔎 BUSCAR PREÇO
// ===============================
window.buscarPreco = async function () {

  const buscaSelect = document.getElementById("buscaProduto")
  const resultadoDiv = document.getElementById("resultado")

  if (!buscaSelect || !resultadoDiv) {
    console.log("Elemento não encontrado")
    return
  }

  const produto = buscaSelect.value

  console.log("Produto buscado:", produto)

  if (!produto) {
    alert("Selecione um produto")
    return
  }

  const { data, error } = await supabase
    .from("bares")
    .select("*")
    .eq("produto", produto)
    .order("preco", { ascending: true })

  if (error) {
    console.log(error)
    alert("Erro ao buscar")
    return
  }

  if (data.length === 0) {
    resultadoDiv.innerHTML = "Nenhum preço encontrado."
    return
  }

  let html = ""

  data.forEach((item, index) => {
    if (index === 0) {
      html += `
        <p style="color: green; font-weight: bold;">
          🏆 ${item.bar} - R$ ${item.preco.toFixed(2)}
        </p>
      `
    } else {
      html += `
        <p>
          ${item.bar} - R$ ${item.preco.toFixed(2)}
        </p>
      `
    }
  })

  resultadoDiv.innerHTML = html
}
