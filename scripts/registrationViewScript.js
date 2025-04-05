// Função para preencher os dados do comprovante a partir do localStorage
document.addEventListener("DOMContentLoaded", () => {
    const savedData = JSON.parse(localStorage.getItem("inscricao"));

    if (savedData) {
        document.getElementById("id_participante").textContent = savedData.id_participante || "Não informado";
        document.getElementById("nome").textContent = savedData.nome || "Não informado";
        document.getElementById("data_nascimento").textContent = savedData.data_nascimento || "Não informado";
        document.getElementById("cpf").textContent = savedData.cpf || "Não informado";
        document.getElementById("endereco").textContent = `${savedData.rua}, ${savedData.numero}, ${savedData.cidade} - ${savedData.estado}` || "Não informado";
        document.getElementById("telefone").textContent = savedData.telefone || "Não informado";
    } else {
        alert("Nenhum dado de inscrição encontrado.");
    }
});