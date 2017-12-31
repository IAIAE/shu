import {Node} from './create'
import babylon from 'babylon'
import {parserOption} from '../option'

export const updateNode = (jsxAst, props) => {
    let attrs = jsxAst.JSXOpeningElement.attributes;
    if(!attrs){
        attrs = [];
    }
    let theAttrHaved = attrs.map(attr=>attr.name.name);
    // create a new Node and get its attr
    var node = new Node('div', props);
    let newAst = babylon.parse(node.toJsx(), parserOption)
    let newAttrs = newAst.JSXOpeningElement.attributes;
    newAttrs.forEach((attr)=>{
        let i;
        if((i = theAttrHaved.indexOf(attr.name.name)) != -1){
            attrs[i] = attr;
        }else{
            attrs.push(attr);
        }
    })
    jsxAst.JSXOpeningElement.attributes = attrs;
}


