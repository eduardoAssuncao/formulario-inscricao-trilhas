document.addEventListener('DOMContentLoaded', function() {
    // Verificar se já existe uma inscrição
    const inscricaoRealizada = localStorage.getItem('inscricaoRealizada');
    const botaoInscrever = document.querySelector('.subscribe__button');

    if (inscricaoRealizada === 'true') {
        if (botaoInscrever) {
            botaoInscrever.setAttribute('disabled', '');
            botaoInscrever.innerHTML = `
                <sl-icon slot="prefix" name="check-circle"></sl-icon>
                Inscrição Realizada
            `;
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
});