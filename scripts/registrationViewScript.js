document.addEventListener("DOMContentLoaded", function(){
    const dadosInscricao = JSON.parse(localStorage.getItem("dadosInscricao"));

    // mensagem de alerta
    const mostrarAlerta = (mensagem, tipo = 'danger', duracao = 5000) => {
        // elemento de alerta
        const alerta = document.createElement('div');
        alerta.className = `alerta alerta-${tipo}`;
        alerta.style.position = 'fixed';
        alerta.style.top = '20px';
        alerta.style.right = '20px';
        alerta.style.zIndex = '9999';
        alerta.style.padding = '15px 20px';
        alerta.style.borderRadius = '4px';
        alerta.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
        alerta.style.backgroundColor = tipo === 'success' ? '#4CAF50' : '#F44336';
        alerta.style.color = 'white';
        alerta.style.maxWidth = '400px';
        alerta.style.opacity = '0';
        alerta.style.transition = 'opacity 0.3s ease';

        const icone = tipo === 'success' ? '✓' : '⚠';

        alerta.innerHTML = `<strong>${icone} ${tipo === 'success' ? 'Sucesso' : 'Erro'}</strong><br>${mensagem}`;

        document.body.appendChild(alerta);

        // Mostrar com animação
        setTimeout(() => {
            alerta.style.opacity = '1';
        }, 10);

        // Remover após a duração
        setTimeout(() => {
            alerta.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(alerta);
            }, 300);
        }, duracao);
    };

    if (dadosInscricao) {
        document.getElementById("id_participante").textContent = dadosInscricao.idUsuario || "Não informado";
        document.getElementById("nome").textContent = dadosInscricao.nome || "Não informado";
        document.getElementById("data_nascimento").textContent = dadosInscricao.dataNascimento || "Não informado";
        document.getElementById("cpf").textContent = dadosInscricao.cpf || "Não informado";
        document.getElementById("endereco").textContent = `${dadosInscricao.endereco.rua}, ${dadosInscricao.endereco.numero}, ${dadosInscricao.endereco.cidade} - ${dadosInscricao.endereco.estado}` || "Não informado";
        document.getElementById("telefone").textContent = dadosInscricao.telefone || "Não informado";
        mostrarAlerta('Informações de inscrição recuperadas.', 'success', 3000);
    } else {
        mostrarAlerta('Não foi possível recuperar as informações de inscrição.', 'danger', 3000);
    }
});


