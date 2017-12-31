import babylon from 'babylon'
import {parserOption, generatorOption} from '../option'
import generate from 'babel-generator'

export const createAst = (jsx) => {
    return babylon.parse(jsx, parserOption).program.body[0].expression
}

export class Node{
    constructor(tagName, props, children){
        this.tagName = tagName;
        this.props = props;
        this.children = children;
    }
    toJsx(){
        return createJsxNode(this.tagName, this.props, this.children);
    }
}

export function renderJsx(ast){
    return generate(ast, generatorOption)
}

export const createJsxNode = (tagName, props, children) => {
    let openTag,
        endTag,
        propStr = '';
    if(props){
        propStr = Object.keys(props).map((key)=>{
            let val = props[key];
            let valType = typeof val;
            if(valType === 'string'){
                if(/^o-/.test(val)){
                    return `${key}={${val.substring(2)}}`
                }
                return `${key}="${val}"`
            }else if(valType === 'number'){
                return `${key}={${val}}`
            }else if(valType === 'object' && val != null){
                return `${key}={${obj2String(val)}}`
            }else{
                return ''
            }
        }).join(' ')
    }
    if(!children){
        openTag = `<${tagName} ${propStr}/>`
        return openTag;
    }
    openTag = `<${tagName} ${propStr}>`;
    endTag = `</${tagName}>`;
    if(typeof children == 'string'){
        return  (openTag + children + endTag)
    }
    let childrenJsx = children.map(_=>_.toJsx()).join(' ')
    return (openTag + childrenJsx + endTag);
}

export 

/**
 * this function is not working as usual. only used here!
 */
function obj2String(obj){
    if(!obj) return '{}';
    let keys = Object.keys(obj);
    let content = keys.map((key, index)=>{
        let val = obj[key];
        let isLast = index == (keys.length-1);
        let valType = typeof val;
        let result = null;
        if(valType == 'string'){
            if(/^o-/.test(val)){
                result = `${key}: ${val.substring(2)}`
            }else{
                result = `${key}: '${val}'`
            }
        }else if(valType == 'number'){
            result = `${key}: ${val}`
        }else if(valType == 'object' && val != null){
            result = `${key}: ${obj2String(val)}`;
        }
        if(!result){
            return ''
        }
        if(!isLast){
            result += ',';
        }
        return result
    }).join('\n')
    return `{\n${content}}`;
}