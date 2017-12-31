import {checkParent, checkType, indexIt} from '../util/sugar'

export const deleteNode  = checkType([checkParent])((parent, child) => {
    let i;
    if((i = indexIt(parent, child))!=-1){
        parent.children.splice(i, 1)
        return true;
    }
    return false;
})

export const deleteAfter  = checkType([checkParent])((parent, child) => {
    let i;
    if((i = indexIt(parent, child))!=-1){
        if(i==(parent.children.lenght-1)) return false
        parent.children.splice(i+1, 1)
        return true;
    }
    return false;
})

export const deleteBefore  = checkType([checkParent])((parent, child) => {
    let i;
    if((i = indexIt(parent, child))!=-1){
        if(i==0) return false;
        parent.children.splice(i-1, 1)
        return true;
    }
    return false;
})
