import walk from 'babylon-walker'

class Found{
	constructor(obj) {
		this.node = obj
	}
}

function throwFind(func){
	return function(){
		try{
			func.apply(null, arguments);
		}catch(e){
			if(e instanceof Found){
				return e.node
			}
			throw e;
		}
	}
}

export const findMethod = methodName => className => ast => {
	try{
		walk.ancestor(ast, {
			ClassMethod: (_, ancestors)=>{
				if(_.key && _.key.type == 'Identifier' && _.key.name == methodName){
					if(!className){
						throw new Found(_);
					}
					for(let i = ancestors.length-1;i>=0;i--){
						let p = ancestors[i];
						if(p.type == 'ClassDeclaration'){
							let _className = p.id.name;
							if(_className == className){
								throw new Found(_);
							}
						}
					}
				}
			}
		})
	}catch(e){
		if(e instanceof Found){
			return e.node
		}
		throw e;
	}
}

export const findAllReturn = funcAst => {
	let returns = [];
	walk.ancestor(funcAst, {
		ReturnStatement: (_, ancestors)=>{
			let ancestorTypes = ancestors.map(_=>_.type);
			if(ancestorTypes.indexOf('FunctionExpression')==-1 && ancestorTypes.indexOf('ArrowFunctionExpression'==-1)){
				returns.push(_)
			}
		}
	})
	return returns;
}

export const findJsxElementInReturn = throwFind(returnAst => {
	walk.ancestor(returnAst, {
		JSXElement: (_, ancestors)=>{
			let ancestorTypes = ancestors.map(_=>_.type);
			if(ancestorTypes.indexOf('JSXElement')==-1){
				throw new Found(_)
			}
		}
	})
})

export const findJsxElement = throwFind((jsxAst, predication) => {
	walk.ancestor(jsxAst, {
		JSXElement: (_, ancestors)=>{
			let result = predication(_, ancestors);
			if(result){
				throw new Found(_)
			}
		}
	})
})
