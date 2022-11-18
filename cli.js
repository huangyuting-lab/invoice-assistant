#!/usr/bin/env node

const { Command } = require('commander')
const { calculate } = require('./index')

const program = new Command()

program
    .command('<numbers...>')
    .description('add invoice amount as parameter, press enter and calculate automatically')
    .action((_, { args }) => {
        console.log(calculate(args))
    })
    .parse()