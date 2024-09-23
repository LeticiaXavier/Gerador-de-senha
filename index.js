const { select, input, checkbox } = require('@inquirer/prompts');
const fs = require('fs').promises;
let mensagem = 'Bem Vindo ao sistema de gerenciamento de Senhas';
let senhas = []; // Aqui é "senhas" no plural

// Gerando uma senha aleatória
function gerarSenhaAleatoria(length) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
    let senha = '';
    for (let i = 0; i < length; i++) {
        senha += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return senha;
}

// Função para carregar senhas do arquivo
const carregarSenhas = async () => {
    try {
        const dados = await fs.readFile("senhas.json", "utf8");
        senhas = JSON.parse(dados);
    } catch (erro) {
        senhas = []; // Se o arquivo não existir, inicie com um array vazio
    }
};

// Função para salvar senhas no arquivo
const salvarSenhas = async () => {
    await fs.writeFile("senhas.json", JSON.stringify(senhas, null, 2)); // Usa "senhas" no plural
};

// Função para esperar a entrada do usuário
const esperarEntrada = async () => {
    await input({ message: 'Pressione Enter para continuar...' });
};

// Função para visualizar senhas
const visualizarSenhaMenu = async () => {
    // Verifica se há senhas salvas
    if (senhas.length === 0) {
        console.log('Não existem senhas salvas.');
        await esperarEntrada();
        return;
    }

    // Lista os nomes das senhas com checkboxes
    const escolhas = await checkbox({
        message: 'Escolha uma ou mais senhas para visualizar:',
        choices: senhas.map((item, index) => ({
            name: item.name,  // Exibe o nome da senha
            value: index      // Usa o índice para referenciar a senha
        })),
    });

    // Verifica e exibe as senhas selecionadas, solicitando o PIN
    for (const escolha of escolhas) {
        const pinInput = await input({
            message: `Digite o PIN para acessar a senha de ${senhas[escolha].name}:`,
        });

        // Verifica se o PIN está correto
        const senhaEscolhida = senhas[escolha];
        if (senhaEscolhida.pin === pinInput) {
            console.log(`Senha para ${senhaEscolhida.name}: ${senhaEscolhida.senha}`);
        } else {
            console.log(`PIN incorreto! Não foi possível acessar a senha de ${senhaEscolhida.name}.`);
        }
    }

    await esperarEntrada(); // Pausa antes de voltar ao menu
};

// Submenu para gerar uma nova senha
const gerarSenhaMenu = async () => {
    const length = await input({
        message: 'Quantidade de caracteres da senha: ',
        validate: (value) =>{
            const parsed = parseInt(value, 10);
            if(isNaN(parsed) || parsed <= 0){
                return 'Insira um número válido.';
            }
            return true;
        },
    });

    const name = await input({
        message: 'Nome da senha: ',
    });

    const pin = await input({
        message: 'Faça um PIN de acesso à sua senha: ',
    });

    const novaSenha = gerarSenhaAleatoria(parseInt(length));
    senhas.push({ name, pin, senha: novaSenha });
    console.log(`Nova senha gerada para ${name}: ${novaSenha}`);

    await salvarSenhas(); // Salvar no arquivo
    await esperarEntrada(); // Pausa antes de voltar ao menu
};

// Submenu para deletar uma senha
const deletarSenhaMenu = async () => {
    if (senhas.length === 0) {
        console.log('Não existem senhas salvas.');
        await esperarEntrada();
        return;
    }

    // Lista as senhas com checkboxes para selecionar uma ou mais para deletar
    const escolhas = await checkbox({
        message: 'Escolha uma ou mais senhas para deletar:',
        choices: senhas.map((item, index) => ({
            name: item.name,  // Exibe o nome da senha
            value: index      // Usa o índice para referenciar a senha
        })),
    });

    // Para cada senha selecionada, pede o PIN para confirmar a deleção
    for (const escolha of escolhas) {
        const pinInput = await input({
            message: `Digite o PIN para deletar a senha de ${senhas[escolha].name}:`,
        });

        const senhaEscolhida = senhas[escolha];
        if (senhaEscolhida.pin === pinInput) {
            console.log(`Senha para ${senhaEscolhida.name} deletada com sucesso!`);
            senhas.splice(escolha, 1); // Remove a senha do array
        } else {
            console.log(`PIN incorreto! Não foi possível deletar a senha de ${senhaEscolhida.name}.`);
        }
    }

    await salvarSenhas(); // Salvar as alterações no arquivo
    await esperarEntrada(); // Pausa antes de voltar ao menu
};

// Iniciando a aplicação
const mainMenu = async () => {
    await carregarSenhas(); // Carregar as senhas no início

    while (true) {
        console.clear();
        console.log(mensagem);

        const opcao = await select({
            message: 'Menu principal >>>',
            choices: [
                { name: 'Gerar uma nova senha', value: 'GerarSenha' },
                { name: 'Visualizar Senha', value: 'VisualizarSenha' },
                { name: 'Deletar senha', value: 'DeletarSenha' },
                { name: 'Sair', value: 'Sair' },
            ],
        });

        switch (opcao) {
            case 'GerarSenha':
                await gerarSenhaMenu();
                break;
            case 'VisualizarSenha':
                await visualizarSenhaMenu();
                break;
            case 'DeletarSenha':
                await deletarSenhaMenu();
                break;
            case 'Sair':
                console.log('Até a próxima!');
                process.exit();
        }
    }
};

mainMenu();
