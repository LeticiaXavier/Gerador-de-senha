const { select, input } = require('@inquirer/prompts');
const fs = require('fs').promises;
let mensagem = 'Bem Vindo ao sistema de gerenciamento de Senhas';
let senhas = [];

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
    await fs.writeFile("senhas.json", JSON.stringify(senhas, null, 2));
    
};

// Função para esperar a entrada do usuário
const esperarEntrada = async () => {
    await input({ message: 'Pressione Enter para continuar...' });
};

// Função para visualizar uma senha
const visualizarSenhaMenu = async () => {
    if (senhas.length == 0) {
        console.log('Não existem senhas armazenadas.');
        await esperarEntrada(); // Pausa antes de voltar ao menu
        return;
    }

    const name = await input({
        message: 'Digite o nome da senha que deseja visualizar:',
    });

    const pin = await input({
        message: 'Digite o PIN de acesso à senha:',
    });

    const senhaEncontrada = senhas.find(item => item.name === name);

    if (!senhaEncontrada) {
        console.log('Senha não encontrada.');
        await esperarEntrada(); // Pausa antes de voltar ao menu
        return;
    }

    if (senhaEncontrada.pin !== pin) {
        console.log('PIN incorreto.');
        await esperarEntrada(); // Pausa antes de voltar ao menu
        return;
    }

    console.log(`A senha para ${name} é: ${senhaEncontrada.senha}`);
    await esperarEntrada(); // Pausa antes de voltar ao menu
};

// Submenu para gerar uma nova senha
const gerarSenhaMenu = async () => {
    const length = await input({
        message: 'Quantidade de caracteres da senha: ',
        validate: (value) =>{
            const parsed = parseInt(value, 10);
            if(isNaN(parsed) || parsed <= 0){
                return 'insira um número válido.';
            }
            return true
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
    const name = await input({
        message: 'Digite o nome da senha a ser deletada:',
    });

    const pin = await input({
        message: 'Digite o PIN de acesso à senha:',
    });

    const index = senhas.findIndex(item => item.name === name && item.pin === pin);

    if (index === -1) {
        console.log('Senha ou PIN incorretos.');
    } else {
        senhas.splice(index, 1);
        console.log(`Senha para ${name} deletada com sucesso!`);
        await salvarSenhas(); // Salvar a alteração no arquivo
    }

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
