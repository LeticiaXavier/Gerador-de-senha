const fs  = require('fs');
const crypto = require('crypto');
const inquirer = require('inquirer');
const { select } = require('@inquirer/prompts');
const { type } = require('os');

// Iniciando a aplicação

/*const start = async () => {

    

    while (true) {
        const opcao = await select({
            message: 'Menu de Gerenciameno de Senhas >>',

            choices: [{
                name: 'Gerar uma nova senha',
                value: 'Senha'
            },
            {
                name: 'Visualizar senhas',
                value: 'Visualizar'  
            },
            {
                name: 'Deletar senha',
                value: 'Deletar'
            },
            {
                name: 'Sair',
                value: 'Sair'
            },
        ],
        })

        switch (opcao){

            case "Gerar nova senha":
                console.log("Nova senha");
                break

            case "Visualizar Senhas":
                break

            case "Deletar senha":
                break
            case "Sair":
                console.log("Ate a proxima!")
                return    
        }
    }
}
start()*/


// Função principal do Mneu inicial

async function mainMenu(){
    const choices =  await inquirer.prompt([
        {
            type: 'list',
            name:'action',
            mensage: '## Sistema de gerenciamento de Senhas Aleatórias via terminal ##\nEscolha uma ação:',  
            choices: ['Gerar uma nova senha', 'Visualizar senha', 'Deletar senha', 'Sair']
        }
    ]);

    switch (choices.action){
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

//Submenu parar gerar uma nova senha

async function gerarSenhaMenu(){
    const {length, name, pin} =  await inquirer.prompt([
        
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

function gerarSenhaAleatoria(length){
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
    let senha = '';
    for (let i = 0; i < length; i++){
        senha += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    return senha;
}

// SubMenu para visualizar as senhas

async function visualizarSenhaMenu(){
    const {name, pin} = await inquireria.prompt([
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

async function deletarSenhaMenu(){
    const {name, pin} = await inquirer.prompt([
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