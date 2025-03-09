document.addEventListener('DOMContentLoaded', function () {
  const formulario = document.querySelector('form.input-validation-required')
  const campoCPF = document.querySelector('sl-input[label="CPF"]')
  const campoTelefone = document.querySelector('sl-input[label="Telefone"]')
  const campoCEP = document.querySelector('sl-input[label="CEP"]')
  const camposArquivo = document.querySelectorAll('input[type="file"]')

  if (campoCPF) {
    campoCPF.addEventListener('sl-input', function (e) {
      let valor = e.target.value.replace(/\D/g, '')
      if (valor.length > 11) {
        valor = valor.substring(0, 11)
      }

      if (valor.length > 9) {
        valor = valor.replace(/^(\d{3})(\d{3})(\d{3})/, '$1.$2.$3-')
      } else if (valor.length > 6) {
        valor = valor.replace(/^(\d{3})(\d{3})/, '$1.$2.')
      } else if (valor.length > 3) {
        valor = valor.replace(/^(\d{3})/, '$1.')
      }

      e.target.value = valor
    })
  }

  if (campoTelefone) {
    campoTelefone.addEventListener('sl-input', function (e) {
      let valor = e.target.value.replace(/\D/g, '')
      if (valor.length > 11) {
        valor = valor.substring(0, 11)
      }

      if (valor.length > 10) {
        valor = valor.replace(/^(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
      } else if (valor.length > 6) {
        valor = valor.replace(/^(\d{2})(\d{4})/, '($1) $2-')
      } else if (valor.length > 2) {
        valor = valor.replace(/^(\d{2})/, '($1) ')
      }

      e.target.value = valor
    })
  }

  // Consulta de CEP
  if (campoCEP) {
    campoCEP.addEventListener('sl-blur', function (e) {
      const cep = e.target.value.replace(/\D/g, '')

      if (cep.length === 8) {
        // Aplicar máscara ao CEP
        e.target.value = cep.replace(/^(\d{5})(\d{3})/, '$1-$2')

        // API ViaCEP
        fetch(`https://viacep.com.br/ws/${cep}/json/`)
          .then((resposta) => resposta.json())
          .then((dados) => {
            if (!dados.erro) {
              // Preencher campos de endereço
              document.querySelector(
                'sl-input[label="Data de nascimento"][placeholder="Rua"]'
              ).value = dados.logradouro
              document.querySelector('sl-input[label="Cidade"]').value = dados.localidade
              document.querySelector('sl-input[label="Estado"]').value = dados.uf
            }
          })
          .catch((erro) => {
            console.error('Erro ao consultar CEP:', erro)
          })
      }
    })
  }

  // upload de arquivos
  camposArquivo.forEach((campoArquivo) => {
    const areaUpload = campoArquivo.nextElementSibling

    campoArquivo.addEventListener('change', function (e) {
      const nomeArquivo = e.target.files[0]?.name

      if (nomeArquivo) {
        const elementoSpan = areaUpload.querySelector('span')
        elementoSpan.textContent = nomeArquivo
        areaUpload.classList.add('file-selected')
      }
    })
  })

  // Validação e submissão do formulário
  if (formulario) {
    formulario.addEventListener('submit', function (e) {
      e.preventDefault()

      // Verificar se todos os campos obrigatórios estão preenchidos
      const camposObrigatorios = formulario.querySelectorAll('[required]')
      let formularioValido = true

      camposObrigatorios.forEach((campo) => {
        if (!campo.value) {
          formularioValido = false
          // Destacar campo não preenchido
          if (
            campo.tagName.toLowerCase() === 'sl-input' ||
            campo.tagName.toLowerCase() === 'sl-select'
          ) {
            campo.setAttribute('invalid', '')
          }
        }
      })

      // Validar CPF
      if (campoCPF && campoCPF.value) {
        if (!validarCPF(campoCPF.value)) {
          formularioValido = false
          campoCPF.setAttribute('invalid', '')

          // Exibir mensagem de erro de CPF
          const mensagemErro = document.createElement('sl-alert')
          mensagemErro.variant = 'danger'
          mensagemErro.closable = true
          mensagemErro.duration = 5000
          mensagemErro.innerHTML = `
            <sl-icon slot="icon" name="exclamation-triangle"></sl-icon>
            <strong>CPF Inválido</strong><br>
            Por favor, verifique o número do CPF informado.
          `

          document.body.appendChild(mensagemErro)
          mensagemErro.toast()
        }
      }

      if (formularioValido) {
        // Coletar dados do formulário
        const dadosFormulario = new FormData(formulario)
        const dadosInscricao = {
          nome: document.querySelector('sl-input[label="Nome completo"]').value,
          dataNascimento: document.querySelector('sl-input[label="Data de nascimento"]').value,
          cpf: campoCPF.value,
          email: document.querySelector('sl-input[label="E-mail"]').value,
          telefone: campoTelefone.value,
          endereco: {
            cep: campoCEP.value,
            rua: document.querySelector('sl-input[placeholder="Rua"]').value,
            numero: document.querySelector('sl-input[label="Número"]').value,
            cidade: document.querySelector('sl-input[label="Cidade"]').value,
            estado: document.querySelector('sl-input[label="Estado"]').value,
          },
          trilha: document.querySelector('sl-radio-group').value,
          dataInscricao: new Date().toISOString(),
        }

        // armazenamento local
        localStorage.setItem('dadosInscricao', JSON.stringify(dadosInscricao))
        localStorage.setItem('inscricaoRealizada', 'true')

        // Criar modal de sucesso
        const modal = document.createElement('sl-dialog')
        modal.label = 'Inscrição Realizada'
        modal.innerHTML = `
          <div style="text-align: center; padding: 20px;">
            <sl-icon name="check-circle" style="font-size: 3rem; color: green;"></sl-icon>
            <h2>Inscrição realizada com sucesso!</h2>
            <p>Agradecemos seu interesse no Programa Trilhas.</p>
            <p>Em breve entraremos em contato por e-mail com mais informações.</p>
          </div>
          <div slot="footer">
            <sl-button variant="primary" id="btnVoltarInicio">Voltar para o início</sl-button>
          </div>
        `

        document.body.appendChild(modal)
        modal.show()

        // Adicionar evento ao botão de voltar
        document.getElementById('btnVoltarInicio').addEventListener('click', function () {
          window.location.href = './mainView.html'
        })
      } else {
        // Exibir mensagem de erro
        const mensagemErro = document.createElement('sl-alert')
        mensagemErro.variant = 'danger'
        mensagemErro.closable = true
        mensagemErro.duration = 5000
        mensagemErro.innerHTML = `
          <sl-icon slot="icon" name="exclamation-triangle"></sl-icon>
          <strong>Erro no formulário</strong><br>
          Por favor, preencha todos os campos obrigatórios.
        `

        document.body.appendChild(mensagemErro)
        mensagemErro.toast()
      }
    })
  }

  // Função para validar CPF
  function validarCPF(cpf) {
    cpf = cpf.replace(/[^\d]/g, '')

    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
      return false
    }

    let soma = 0
    let resto

    for (let i = 1; i <= 9; i++) {
      soma += parseInt(cpf.substring(i - 1, i)) * (11 - i)
    }

    resto = (soma * 10) % 11
    if (resto === 10 || resto === 11) {
      resto = 0
    }

    if (resto !== parseInt(cpf.substring(9, 10))) {
      return false
    }

    soma = 0
    for (let i = 1; i <= 10; i++) {
      soma += parseInt(cpf.substring(i - 1, i)) * (12 - i)
    }

    resto = (soma * 10) % 11
    if (resto === 10 || resto === 11) {
      resto = 0
    }

    if (resto !== parseInt(cpf.substring(10, 11))) {
      return false
    }

    return true
  }
})
