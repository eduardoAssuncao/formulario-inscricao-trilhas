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

    const buttonLogin = document.getElementById('login_button');
    buttonLogin.addEventListener('click', (e) => {
        e.preventDefault();
        realizarLogin();
    })

    function realizarLogin() {
      const idUsuario = document.getElementById('id_usuario').value;
      const idSenha = document.getElementById('id_senha').value;

      if(dadosInscricao) {
          if (idUsuario === dadosInscricao.idUsuario
              && idSenha === dadosInscricao.senha) {
              mostrarAlerta('Login realizado com sucesso! Redirecionando para a página com comprovante...', 'success', 3000);

              // Redirecionar para a página comprovante após um breve delay
              setTimeout(() => {
                  window.location.href = './registrationView.html';
              }, 3000);
              return 1;
          } else {
              mostrarAlerta('Erro ao realizar login. Verifique se as credenciais estão corretas.', 'danger', 3000);
          }
      } else {
          mostrarAlerta('Você ainda não realizou a inscrição no Trilhas Inova', 'danger', 3000);
      }

    }

    // animação ao botão
    if (botaoInscrever) {
        botaoInscrever.addEventListener('mouseover', function() {
            this.style.transform = 'scale(1.05)';
            this.style.transition = 'transform 0.3s ease';
        });

        botaoInscrever.addEventListener('mouseout', function() {
            this.style.transform = 'scale(1)';
        });
    }

    // animação suave
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
});