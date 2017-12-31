// import fs from 'fs'
// import praan from 'praan'
// import walk from 'babylon-walker'
// import generate from 'babel-generator'
// import babylon from 'babylon'
// import {parserOption, generatorOption} from './option'
// import {readFile, writeFile, findMethod, findAllReturn} from './util/sugar'
// const findRenderMethod = findMethod('render')

import {Node, createAst, renderJsx, insertAfter, insertBefore, appendChild, deleteAfter, deleteBefore, deleteNode, findAllReturn, findJsxElement, findJsxElementInReturn, findMethod, updateNode} from './astHelper/index.js'

let node = new Node('div', {
    style: {
        marginLeft: 10,
        zIndex: 12,
        height: '12px',
        backgroundImage: 'url(http://www.baidu.com/logo.png)'
    },
    info: 'o-info',
    test: 1,
    hello: 'world'
}, 'this is a text')
let outerNode = new Node('section', {
    className: 'hello world'
}, [node])

let testAst = createAst(outerNode.toJsx())
let newNode = new Node('span', {
    style: {
        fontSize: '1em'
    }
})
let newAst = createAst(newNode.toJsx())

let targetAst = findJsxElement(testAst, (_, ancestors)=>{
    return (_.type == 'JSXElement') && _.openingElement.name.name == 'section';
})
appendChild(testAst, newAst);
console.info(testAst == targetAst);
let findNewNode = findJsxElement(testAst, (_, ancestors)=>{
    return (_.type=='JSXElement')&& _.openingElement.name.name == 'span'
})

console.info(newAst === findNewNode)


console.info(renderJsx(testAst).code)
// console.info(targetAst)

