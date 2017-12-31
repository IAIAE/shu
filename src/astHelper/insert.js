import {checkParent, checkType, indexIt} from '../util/sugar'

/**
 * 父元素下一级push一个子元素
 */
export const appendChild = checkType([checkParent])((parent, newChild) => {
    parent.children.push(newChild)
})

/**
 * 在子元素child前面添加添加一个兄弟节点newChild
 */
export const insertBefore = checkType([checkParent])((parent, child, newChild) => {
    let i;
    if((i = indexIt(parent, child))!=-1){
        parent.children.splice(i, 0, newChild)
        return true;
    }
    return false;
})

/**
 * 在子元素child后面添加添加一个兄弟节点newChild
 */
export const insertAfter = checkType([checkParent])((parent, child, newChild) => {
    let i;
    if((i = indexIt(parent, child))!=-1){
        parent.children.splice(i+1, 0, newChild)
        return true;
    }
    return false;
})

