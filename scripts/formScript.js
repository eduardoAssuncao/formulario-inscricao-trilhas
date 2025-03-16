document.addEventListener('DOMContentLoaded', function() {
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

    // Manipulação do input de CEP
    const cepInput = document.querySelector('sl-input[placeholder="Cep"]');
    if (cepInput) {
        cepInput.addEventListener('blur', async function() {
            const cep = this.value.replace(/\D/g, '');
            
            if (cep.length === 8) {
                const endereco = await buscarCep(cep);
                if (endereco) {
                    const ruaInput = document.querySelector('.input-rua');
                    const cidadeInput = document.querySelector('.input-cidade');
                    const estadoInput = document.querySelector('.input-estado');
                    
                    if (ruaInput) ruaInput.value = endereco.logradouro;
                    if (cidadeInput) cidadeInput.value = endereco.localidade;
                    if (estadoInput) estadoInput.value = endereco.uf;
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
                label.textContent = this.files[0].name;
                uploadArea.classList.add('file-selected');
            } else {
                label.textContent = 'Clique aqui para selecionar o arquivo';
                uploadArea.classList.remove('file-selected');
            }
        });
    });

    // Validação do formulário
    const form = document.querySelector('form');
    if (form) {
        // evento de submit ao formulário
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('Formulário submetido');
            
            // variáveis  de validação
            let isValid = true;
            let camposInvalidos = [];
            
            try {
                    // validacoes
              
                const inputs = form.querySelectorAll('sl-input[required]');
                inputs.forEach(input => {
                    console.log(`Verificando input: ${input.label || 'sem label'}, valor: "${input.value}"`);
                    
                    input.removeAttribute('invalid');
                    
                    if (!input.value || input.value.trim() === '') {
                        isValid = false;
                        input.setAttribute('invalid', '');
                        camposInvalidos.push(input.label || 'Campo obrigatório');
                        console.log(`Campo inválido: ${input.label || 'sem label'}`);
                    }
                });
                
                const selects = form.querySelectorAll('sl-select[required]');
                selects.forEach(select => {
                    console.log(`Verificando select: ${select.label || 'sem label'}, valor: "${select.value}"`);
                    
                    select.removeAttribute('invalid');
                    
                    if (!select.value || select.value.trim() === '') {
                        isValid = false;
                        select.setAttribute('invalid', '');
                        camposInvalidos.push(select.label || 'Campo obrigatório');
                        console.log(`Campo inválido: ${select.label || 'sem label'}`);
                    }
                });
                
                const checkbox = form.querySelector('sl-checkbox[required]');
                if (checkbox) {
                    console.log(`Verificando checkbox, checked: ${checkbox.checked}`);
                    
                    checkbox.removeAttribute('invalid');
                    
                    if (!checkbox.checked) {
                        isValid = false;
                        checkbox.setAttribute('invalid', '');
                        camposInvalidos.push('Termos e condições');
                        console.log('Checkbox inválido: Termos e condições');
                    }
                }
                
                fileInputs.forEach(input => {
                    console.log(`Verificando arquivo: ${input.id}, files: ${input.files ? input.files.length : 0}`);
                    
                    const uploadArea = input.nextElementSibling;
                    uploadArea.style.borderColor = '';
                    
                    if (!input.files || input.files.length === 0) {
                        isValid = false;
                        uploadArea.style.borderColor = 'var(--sl-color-danger-500)';
                        const label = input.id === 'fileInputIdentidade' ? 'Documento de identidade' : 'Comprovante de residência';
                        camposInvalidos.push(label);
                        console.log(`Arquivo inválido: ${label}`);
                    }
                });
                
                
                const radioGroup = form.querySelector('.trilha__radio');
                if (radioGroup) {
                    console.log(`Verificando radio group, valor: "${radioGroup.value}"`);
                    
                    radioGroup.removeAttribute('invalid');
                    
                    if (!radioGroup.value) {
                        isValid = false;
                        radioGroup.setAttribute('invalid', '');
                        camposInvalidos.push('Trilha de aprendizagem');
                        console.log('Radio group inválido: Trilha de aprendizagem');
                    }
                }
                
                // Processar resultado da validação
                if (isValid) {
                    console.log('Formulário válido!');
                    
                    // Salvar dados no localStorage
                    localStorage.setItem('inscricaoRealizada', 'true');
                    
                    alert('Formulário enviado com sucesso!');
                    
                    // Redirecionar para a página principal após o envio
                    setTimeout(() => {
                        window.location.href = './mainView.html';
                    }, 1000);
                } else {
                    console.log('Formulário inválido!');
                    console.log('Campos inválidos:', camposInvalidos);
                    
                    alert(`Por favor, preencha todos os campos obrigatórios.\nCampos com problema: ${camposInvalidos.join(', ')}`);
                    
                    const primeiroInvalido = form.querySelector('[invalid], input[style*="border-color"]');
                    if (primeiroInvalido) {
                        primeiroInvalido.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                }
            } catch (error) {
                console.error('Erro durante a validação:', error);
                alert('Ocorreu um erro durante a validação do formulário. Verifique o console para mais detalhes.');
            }
        });
    } else {
        console.error('Formulário não encontrado!');
    }
});