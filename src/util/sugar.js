import fs from 'fs'


export function readFile(path){
	return new Promise((done, notDone)=>{
		fs.readFile(path, 'utf-8', (err, data)=>{
			if(err){
				notDone(err)
			}else{
				done(data)
			}
		})
	})
}

export function writeFile(path, str){
	return new Promise((done, notDone)=>{
		fs.writeFile(path, str, (err)=>{
			if(err){
				notDone(err)
			}else{
				done()
			}	
		})
	})
}


export function indexIt(parent, child){
    for(let i = 0; i < parent.children.length; i++){
        if(parent.children[i] == child){
            break;
        }
    }
    return (i==parent.children.length)?-1:i
}
export const checkType = predications => func => {
    return function(){
        let result = predications.reduce((seed, predication)=>{
            if(!seed) return seed;
            return seed && predication.apply(null, arguments);
        }, true)
        if(!result){
            return false
        }
        return func.apply(null, arguments);
    }
}

export const checkParent = (parent)=>{
    if(parent.type == 'JSXElement'){
        return true;
    }
    console.warn('you want insert a node into a non-JSXElement, check it');
    return false;
};
