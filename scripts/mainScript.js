// Script para a página principal
document.addEventListener('DOMContentLoaded', function () {
  // Referência ao botão de inscrição
  const botaoInscrever = document.querySelector('.subscribe__button')

  // Adicionar animação ao botão
  if (botaoInscrever) {
    botaoInscrever.addEventListener('mouseenter', function () {
      this.style.transform = 'scale(1.05)'
      this.style.transition = 'transform 0.3s ease'
    })

    botaoInscrever.addEventListener('mouseleave', function () {
      this.style.transform = 'scale(1)'
    })

    // Adicionar efeito de clique
    botaoInscrever.addEventListener('click', function () {
      this.style.animation = 'pulse 0.5s'

      setTimeout(function () {
        window.location.href = './formView.html'
      }, 300)
    })
  }

  const ilustracao = document.querySelector('.illustration')
  const logo = document.querySelector('.logo')

  if (ilustracao) {
    setTimeout(function () {
      ilustracao.classList.add('animated')
    }, 300)
  }

  if (logo) {
    // Adicionar classe para iniciar animação
    setTimeout(function () {
      logo.classList.add('animated')
    }, 600)
  }

  // Verificar se há dados de inscrição no armazenamento local
  const temInscricao = localStorage.getItem('inscricaoRealizada')

  if (temInscricao === 'true') {
    // Criar notificação de boas-vindas
    const notificacao = document.createElement('sl-alert')
    notificacao.variant = 'success'
    notificacao.closable = true
    notificacao.duration = 5000
    notificacao.innerHTML = `
            <sl-icon slot="icon" name="check-circle"></sl-icon>
            <strong>Bem-vindo de volta!</strong><br>
            Sua inscrição já foi realizada com sucesso.
        `

    document.body.appendChild(notificacao)

    setTimeout(() => {
      notificacao.toast()
    }, 1000)
  }
})
