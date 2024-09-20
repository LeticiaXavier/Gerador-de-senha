const fs  = require('fs');
const crypto = require('crypto');
const inquirer = require('inquirer');
const { select } = require('@inquirer/prompts');

// Iniciando a aplicação

const start = async () => {
    //Carrehar sennhas

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
start()