document.addEventListener('DOMContentLoaded', function() {
    const dadosInscricao = localStorage.getItem('dadosInscricao');
    const inscricaoRealizada = localStorage.getItem('inscricaoRealizada');

    if (!dadosInscricao || !inscricaoRealizada) {
        window.location.href = './mainView.html';
        return;
    }

    try {
        const dados = JSON.parse(dadosInscricao);

        document.getElementById('id_participante').textContent = dados.idUsuario;
        document.getElementById('nome').textContent = dados.nome;
        document.getElementById('data_nascimento').textContent = new Date(dados.dataNascimento).toLocaleDateString('pt-BR');
        document.getElementById('cpf').textContent = dados.cpf;
        document.getElementById('endereco').textContent = `${dados.endereco.rua}, ${dados.endereco.numero} - ${dados.endereco.cidade}/${dados.endereco.estado}`;
        document.getElementById('telefone').textContent = dados.telefone;

    } catch (error) {
        console.error('Erro ao carregar dados:', error);
        window.location.href = './mainView.html';
    }
});


