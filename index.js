

const { select, input, checkbox } = require('@inquirer/prompts');
const fs = require('fs').promises

let mensagem = ' Bem Vindo ao sistema de gerenciamento de Senhas'

// Iniciando a aplicação


const mainMenu = async () => {

    while (true) {
        const opcao = await select({
            message: 'Menu principal >>>',

            choices: [{
                name: 'Gerar uma nova senha',
                value: 'GerarSenha'

            },
            {
                name: 'Visualizar Senha',
                value: 'visualizarSenha'
            },

            {
                name: 'Deletar senha',
                value: 'DeletarSenha'
            },

            {
                name: 'Sair',
                value: 'Sair'
            },
            ],

        })

        switch (opcao) {
            case 'Gerar uma nova senha':
                await gerarSenhaMenu();
                break;
            case 'Visualizar Senha':
                await visualizarSenhaMenu();
                break
            case 'Deletar Senha':
                await deletarSenhaMenu();
                break;
            case 'Sair':
                console.log('Ate a proxima!');
                process.exit();
        }

    }
}
    //Submenu parar gerar uma nova senha

    const gerarSenhaMenu = async () => {
        const { length, name, pin } = await inquirer.prompt([

            {
                type: 'input',
                name: 'length',
                mesage: 'Quantidade de caracteres da senha: '
            },

            {
                type: 'input',
                name: 'name',
                message: 'Nome da Senha'
            },

            {
                type: 'input',
                name: 'pin',
                message: 'Faça um pin de acesso á sua senha: '
            }

        ]);

        const senha = gerarSenhaAleatoria(parseInt(length));
        console.log("Nova senha gerada para ${name}: ${senha}");

        // arquivo para salvar a senha

        await mainMenu(); // Retornar ao menu principal
    }


    // Gerando uma senha aleatória:

    function gerarSenhaAleatoria(length) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
        let senha = '';
        for (let i = 0; i < length; i++) {
            senha += chars.charAt(Math.floor(Math.random() * chars.length));
        }

        return senha;
    }

    // SubMenu para visualizar as senhas

    const visualizarSenhaMenu = async () => {
        const { name, pin } = await inquireria.prompt([
            {
                type: 'input',
                name: 'nome',
                message: 'Digite o nome da senha:'
            },

            {
                type: 'input',
                name: 'pin',
                message: 'Digite o pin de acesso á senha:'

            }
        ]);

        // Recuperar a senha com base no pin fornecido

        console.log('Visualizar a senha para ${name}...');

        await mainMenu() // Retornar ao menu principal
    }

    // Submenu para deletar uma senha

    const deletarSenhaMenu = async () => {
        const { name, pin } = await inquirer.prompt([
            {
                type: 'input',
                name: 'name',
                message: 'Digite o nome da senha a ser deletada:'
            },

            {
                type: 'input',
                name: 'pin',
                message: 'Digite o pin de acesso á senha:'
            }
        ]);

        //Deletar a senha se o pin estiver correto

        console.log('Senha para ${nome} deletada com sucesso!');

        await mainMenu(); // Retornar ao Menu inicial
    }

    mainMenu(); 