document.addEventListener('DOMContentLoaded', function() {
    // Função para gerar ID randômico para o usuário
    const atribuirId = () => {
        try {
            const randomPart = Math.random().toString(36).substr(2, 9);
            const timestampPart = Date.now().toString(36);
            return randomPart + timestampPart;
        } catch (error) {
            throw new Error('Erro ao atribuir um ID');
        }
    }

    // Função para buscar endereço pelo CEP
    const buscarCep = async (cep) => {
        try {
            const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
            const data = await response.json();
            
            if (data.erro) {
                throw new Error('CEP não encontrado');
            }

            return data;
        } catch (error) {
            console.error('Erro ao buscar CEP:', error);
            return null;
        }
    }

    // CPF
    const formatarCPF = (cpf) => {
        cpf = cpf.replace(/\D/g, '');
        if (cpf.length > 11) cpf = cpf.substring(0, 11);
        
        if (cpf.length > 9) {
            cpf = cpf.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4');
        } else if (cpf.length > 6) {
            cpf = cpf.replace(/^(\d{3})(\d{3})(\d{1,3})$/, '$1.$2.$3');
        } else if (cpf.length > 3) {
            cpf = cpf.replace(/^(\d{3})(\d{1,3})$/, '$1.$2');
        }
        
        return cpf;
    };
    
    const validarCPF = (cpf) => {
        cpf = cpf.replace(/\D/g, '');
        
        if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;
        
        let soma = 0;
        let resto;
        
        for (let i = 1; i <= 9; i++) {
            soma += parseInt(cpf.substring(i-1, i)) * (11 - i);
        }
        
        resto = (soma * 10) % 11;
        if (resto === 10 || resto === 11) resto = 0;
        if (resto !== parseInt(cpf.substring(9, 10))) return false;
        
        soma = 0;
        for (let i = 1; i <= 10; i++) {
            soma += parseInt(cpf.substring(i-1, i)) * (12 - i);
        }
        
        resto = (soma * 10) % 11;
        if (resto === 10 || resto === 11) resto = 0;
        if (resto !== parseInt(cpf.substring(10, 11))) return false;
        
        return true;
    };
    
    // Telefone: 
    const formatarTelefone = (telefone) => {
        telefone = telefone.replace(/\D/g, '');
        if (telefone.length > 11) telefone = telefone.substring(0, 11);
        
        if (telefone.length > 10) {
            telefone = telefone.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
        } else if (telefone.length > 6) {
            telefone = telefone.replace(/^(\d{2})(\d{4,5})(\d{0,4})$/, '($1) $2-$3');
        } else if (telefone.length > 2) {
            telefone = telefone.replace(/^(\d{2})(\d{0,5})$/, '($1) $2');
        }
        
        return telefone;
    };
    
    //   CEP
    const formatarCEP = (cep) => {
        cep = cep.replace(/\D/g, '');
        if (cep.length > 8) cep = cep.substring(0, 8);
        
        if (cep.length > 5) {
            cep = cep.replace(/^(\d{5})(\d{3})$/, '$1-$2');
        }
        
        return cep;
    };

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

    setTimeout(() => {
        
        const radioGroup = document.querySelector('.trilha__radio');
        if (radioGroup) {
            if (radioGroup.value) {
                console.log('Radio group já tem valor:', radioGroup.value);
                
                // Forçar a seleção do radio correspondente
                const radio = document.querySelector(`sl-radio[value="${radioGroup.value}"]`);
                if (radio) {
                    radio.checked = true;
                }
            } else {
                console.log('Radio group não tem valor, definindo valor padrão...');
                
                // Definir valor padrão (primeira opção)
                const primeiroRadio = document.querySelector('sl-radio');
                if (primeiroRadio) {
                    primeiroRadio.checked = true;
                    radioGroup.value = primeiroRadio.value;
                    console.log('Valor padrão definido:', radioGroup.value);
                }
            }
            // evento para garantir que o valor seja atualizado
            const radios = document.querySelectorAll('sl-radio');
            radios.forEach(radio => {
                radio.addEventListener('sl-change', function() {
                    if (this.checked) {
                        radioGroup.value = this.value;
                        console.log('Radio alterado, novo valor:', radioGroup.value);
                    }
                });
            });
        }
        
        //  sl-select
        const selects = document.querySelectorAll('sl-select[required]');
        selects.forEach(select => {
            // Garantir que o valor padrão seja aplicado
            if (select.value) {
                console.log(`Select ${select.label} já tem valor:`, select.value);
            } else if (select.getAttribute('value')) {
                // Forçar o valor do atributo
                select.value = select.getAttribute('value');
                console.log(`Select ${select.label} valor definido do atributo:`, select.value);
            }
        });
        
        // sl-checkbox
        const checkbox = document.querySelector('sl-checkbox[required]');
        if (checkbox) {
            const label = checkbox.shadowRoot?.querySelector('label');
            if (label) {
                label.style.color = 'var(--sl-color-danger-500)';
            }
        }
        
        console.log('Correções aplicadas com sucesso!');
    }, 500); 

    // Atribuição de ID
    const userID = atribuirId();
    const idElement = document.getElementById('id_participante');
    if (idElement) {
        idElement.value = userID;
    }
    // Manipulação do input de CEP
    const cepInput = document.querySelector('sl-input[placeholder="Cep"]');
    if (cepInput) {
        // Adicionar formatação ao digitar
        cepInput.addEventListener('sl-input', function() {
            this.value = formatarCEP(this.value);
        });
        
        cepInput.addEventListener('blur', async function() {
            const cep = this.value.replace(/\D/g, '');
            
            if (cep.length === 8) {
                // Mostrar indicador de carregamento
                this.setAttribute('loading', '');
                
                const endereco = await buscarCep(cep);
                
                // Remover 
                this.removeAttribute('loading');
                
                if (endereco) {
                    const ruaInput = document.querySelector('.input-rua');
                    const cidadeInput = document.querySelector('.input-cidade');
                    const estadoInput = document.querySelector('.input-estado');
                    
                    if (ruaInput) ruaInput.value = endereco.logradouro;
                    if (cidadeInput) cidadeInput.value = endereco.localidade;
                    if (estadoInput) estadoInput.value = endereco.uf;
                    
                    // Focar no campo de número após preencher o endereço
                    const numeroInput = document.querySelector('.input-numero');
                    if (numeroInput) setTimeout(() => numeroInput.focus(), 100);
                } else {
                    // Mostrar erro se o CEP não for encontrado
                    this.setAttribute('invalid', '');
                    this.help = 'CEP não encontrado';
                }
            }
        });
    }

    // Formatação e validação de CPF
    const cpfInput = document.querySelector('sl-input[placeholder="Cpf"]');
    if (cpfInput) {
        cpfInput.addEventListener('sl-input', function() {
            this.value = formatarCPF(this.value);
        });
        
        cpfInput.addEventListener('blur', function() {
            const cpf = this.value.replace(/\D/g, '');
            
            if (cpf.length === 11) {
                if (!validarCPF(cpf)) {
                    this.setAttribute('invalid', '');
                    this.help = 'CPF inválido';
                } else {
                    this.removeAttribute('invalid');
                    this.help = '';
                }
            } else if (cpf.length > 0) {
                this.setAttribute('invalid', '');
                this.help = 'CPF incompleto';
            }
        });
    }
    
    // Formatação de telefone
    const telefoneInput = document.querySelector('sl-input[placeholder="Telefone"]');
    if (telefoneInput) {
        telefoneInput.addEventListener('sl-input', function() {
            this.value = formatarTelefone(this.value);
        });
        
        telefoneInput.addEventListener('blur', function() {
            const telefone = this.value.replace(/\D/g, '');
            
            if (telefone.length < 10 && telefone.length > 0) {
                this.setAttribute('invalid', '');
                this.help = 'Telefone incompleto';
            } else {
                this.removeAttribute('invalid');
                this.help = '';
            }
        });
    }
    
    // Validação de e-mail
    const emailInput = document.querySelector('sl-input[placeholder="Email"]');
    if (emailInput) {
        emailInput.addEventListener('blur', function() {
            const email = this.value.trim();
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            
            if (email && !emailRegex.test(email)) {
                this.setAttribute('invalid', '');
                this.help = 'E-mail inválido';
            } else {
                this.removeAttribute('invalid');
                this.help = '';
            }
        });
    }
    
    // Validação de data de nascimento
    const dataNascimentoInput = document.querySelector('sl-input[type="date"]');
    if (dataNascimentoInput) {
        dataNascimentoInput.addEventListener('blur', function() {
            if (this.value) {
                const dataNascimento = new Date(this.value);
                const hoje = new Date();
                const idade = hoje.getFullYear() - dataNascimento.getFullYear();
                
                // Verificar se já fez aniversário este ano
                const mesAtual = hoje.getMonth();
                const diaAtual = hoje.getDate();
                const mesNascimento = dataNascimento.getMonth();
                const diaNascimento = dataNascimento.getDate();
                
                const idadeExata = idade - ((mesAtual < mesNascimento || (mesAtual === mesNascimento && diaAtual < diaNascimento)) ? 1 : 0);
                
                if (idadeExata < 16) {
                    this.setAttribute('invalid', '');
                    this.help = 'Você deve ter pelo menos 16 anos';
                } else if (idadeExata > 100) {
                    this.setAttribute('invalid', '');
                    this.help = 'Data de nascimento inválida';
                } else {
                    this.removeAttribute('invalid');
                    this.help = '';
                }
            }
        });
    }

    //  inputs de arquivo
    const fileInputs = document.querySelectorAll('input[type="file"]');
    fileInputs.forEach(input => {
        input.addEventListener('change', function() {
            const label = this.nextElementSibling.querySelector('span');
            const uploadArea = this.nextElementSibling;
            
            if (this.files.length > 0) {
                const arquivo = this.files[0];
                
                // Verificar tamanho do arquivo (máximo 5MB)
                if (arquivo.size > 5 * 1024 * 1024) {
                    mostrarAlerta('O tamanho máximo permitido é 5MB.', 'danger');
                    
                    // Limpar o input
                    this.value = '';
                    label.textContent = 'Clique aqui para selecionar o arquivo';
                    uploadArea.classList.remove('file-selected');
                    return;
                }
                
                // Verificar tipo de arquivo (apenas PDF)
                if (!arquivo.type.includes('pdf')) {
                    mostrarAlerta('Apenas arquivos PDF são aceitos.', 'danger');
                    
                    this.value = '';
                    label.textContent = 'Clique aqui para selecionar o arquivo';
                    uploadArea.classList.remove('file-selected');
                    return;
                }
                
                label.textContent = arquivo.name;
                uploadArea.classList.add('file-selected');
            } else {
                label.textContent = 'Clique aqui para selecionar o arquivo';
                uploadArea.classList.remove('file-selected');
            }
        });
    });

    // Validação de senha
    const senhaInput = document.querySelector('sl-input[type="password"]');
    if (senhaInput) {
        senhaInput.addEventListener('sl-input', function() {
            const senha = this.value;
            
            if (senha.length < 6) {
                this.setAttribute('invalid', '');
                this.help = 'A senha deve ter no mínimo 6 caracteres';
            } else {
                this.removeAttribute('invalid');
                this.help = '';
            }
        });

        senhaInput.addEventListener('sl-blur', function() {
            const senha = this.value;
            
            if (!senha) {
                this.setAttribute('invalid', '');
                this.help = 'Este campo é obrigatório';
            } else if (senha.length < 6) {
                this.setAttribute('invalid', '');
                this.help = 'A senha deve ter no mínimo 6 caracteres';
            } else {
                this.removeAttribute('invalid');
                this.help = '';
            }
        });
    }

    // Função para validar o formulário
    const validarFormulario = (form) => {
        let isValid = true;
        const inputs = form.querySelectorAll('sl-input[required], sl-select[required], sl-radio-group[required]');
        
        inputs.forEach(input => {
            if (!input.value) {
                input.setAttribute('invalid', '');
                input.help = 'Este campo é obrigatório';
                isValid = false;
            } else if (input.type === 'password' && input.value.length < 6) {
                input.setAttribute('invalid', '');
                input.help = 'A senha deve ter no mínimo 6 caracteres';
                isValid = false;
            } else {
                input.removeAttribute('invalid');
                input.help = '';
            }
        });

        const checkbox = form.querySelector('sl-checkbox[required]');
        if (checkbox && !checkbox.checked) {
            isValid = false;
            checkbox.setAttribute('invalid', '');
        }

        return isValid;
    }

    // Configurar validações do formulário
    const form = document.querySelector('form');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (validarFormulario(form)) {
                // Coletar dados do formulário
                const dadosFormulario = {
                    idUsuario: form.querySelector('#id_participante').value,
                    senha: form.querySelector('sl-input[type="password"]').value,
                    nome: form.querySelector('sl-input[placeholder="Nome"]').value,
                    dataNascimento: form.querySelector('sl-input[type="date"]').value,
                    cpf: form.querySelector('sl-input[placeholder="Cpf"]').value,
                    sexo: form.querySelector('sl-select[label="Sexo"]').value,
                    email: form.querySelector('sl-input[placeholder="Email"]').value,
                    telefone: form.querySelector('sl-input[placeholder="Telefone"]').value,
                    endereco: {
                        cep: form.querySelector('sl-input[placeholder="Cep"]').value,
                        rua: form.querySelector('.input-rua').value,
                        numero: form.querySelector('.input-numero').value,
                        cidade: form.querySelector('.input-cidade').value,
                        estado: form.querySelector('.input-estado').value
                    },
                    trilha: document.querySelector('.trilha__radio').value,
                    dataInscricao: new Date().toISOString()
                };

                // Salvar dados no localStorage
                localStorage.setItem('dadosInscricao', JSON.stringify(dadosFormulario));
                localStorage.setItem('inscricaoRealizada', 'true');

                mostrarAlerta('Inscrição realizada com sucesso! Redirecionando...', 'success', 2000);
                
                setTimeout(() => {
                    window.location.href = './registrationView.html';
                }, 2000);
            } else {
                mostrarAlerta('Por favor, preencha todos os campos obrigatórios.', 'danger');
            }
        });

        const inputs = form.querySelectorAll('sl-input[required], sl-select[required]');
        inputs.forEach(input => {
            input.addEventListener('sl-blur', function() {
                if (!this.value) {
                    this.setAttribute('invalid', '');
                    this.help = 'Este campo é obrigatório';
                } else {
                    this.removeAttribute('invalid');
                    this.help = '';
                }
            });
        });
    } else {
        console.error('Formulário não encontrado!');
    }
});