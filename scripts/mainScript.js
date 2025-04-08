document.addEventListener('DOMContentLoaded', function() {
    // Verificar se já existe uma inscrição
    const inscricaoRealizada = localStorage.getItem('inscricaoRealizada');
    const botaoInscrever = document.querySelector('.subscribe__button');
    const dadosInscricao = JSON.parse(localStorage.getItem('dadosInscricao'));

    if (inscricaoRealizada === 'true') {
        if (botaoInscrever) {
            botaoInscrever.setAttribute('disabled', '');
            botaoInscrever.innerHTML = `
                <sl-icon slot="prefix" name="check-circle"></sl-icon>
                Inscrição Realizada
            `;
        }
    }

    // Função para mostrar alertas
    const mostrarAlerta = (mensagem, tipo = 'danger', duracao = 5000) => {
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

        setTimeout(() => {
            alerta.style.opacity = '1';
        }, 10);

        setTimeout(() => {
            alerta.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(alerta);
            }, 300);
        }, duracao);
    };

    // Função de login
    function realizarLogin() {
        const idUsuario = document.getElementById('id_usuario').value;
        const idSenha = document.getElementById('id_senha').value;

        if (!idUsuario || !idSenha) {
            mostrarAlerta('Por favor, preencha todos os campos.', 'danger');
            return;
        }

        try {
            if (dadosInscricao) {
                if (idUsuario === dadosInscricao.idUsuario && idSenha === dadosInscricao.senha) {
                    mostrarAlerta('Login realizado com sucesso! Redirecionando...', 'success', 2000);
                    setTimeout(() => {
                        window.location.href = './registrationView.html';
                    }, 2000);
                } else {
                    mostrarAlerta('Credenciais inválidas. Por favor, verifique seu ID e senha.', 'danger');
                }
            } else {
                mostrarAlerta('Você ainda não realizou a inscrição no Trilhas Inova.', 'danger');
            }
        } catch (error) {
            console.error('Erro ao realizar login:', error);
            mostrarAlerta('Ocorreu um erro ao tentar fazer login. Tente novamente.', 'danger');
        }
    }

    const buttonLogin = document.getElementById('login_button');
    if (buttonLogin) {
        buttonLogin.addEventListener('click', realizarLogin);
    }

    const loginForm = document.querySelector('.login__container');
    if (loginForm) {
        loginForm.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                realizarLogin();
            }
        });
    }

    // Animações
    if (botaoInscrever) {
        botaoInscrever.addEventListener('mouseover', function() {
            this.style.transform = 'scale(1.05)';
            this.style.transition = 'transform 0.3s ease';
        });

        botaoInscrever.addEventListener('mouseout', function() {
            this.style.transform = 'scale(1)';
        });
    }

    const ilustracao = document.querySelector('.illustration');
    if (ilustracao) {
        ilustracao.style.opacity = '0';
        ilustracao.style.transform = 'translateY(20px)';
        ilustracao.style.transition = 'opacity 0.8s ease, transform 0.8s ease';

        setTimeout(() => {
            ilustracao.style.opacity = '1';
            ilustracao.style.transform = 'translateY(0)';
        }, 100);
    }
});