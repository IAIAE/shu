(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(require('babylon'), require('babel-generator'), require('babylon-walker'), require('fs')) :
	typeof define === 'function' && define.amd ? define(['babylon', 'babel-generator', 'babylon-walker', 'fs'], factory) :
	(factory(global.babylon,global.generate,global.walk,global.fs));
}(this, (function (babylon,generate,walk,fs) { 'use strict';

babylon = babylon && babylon.hasOwnProperty('default') ? babylon['default'] : babylon;
generate = generate && generate.hasOwnProperty('default') ? generate['default'] : generate;
walk = walk && walk.hasOwnProperty('default') ? walk['default'] : walk;
fs = fs && fs.hasOwnProperty('default') ? fs['default'] : fs;

var parserOption = {
	ecmaVersion: 7,
	sourceType: 'module',
	allowReserved: false,
	allowReturnOutsideFunction: false,
	allowImportExportEverywhere: true,
	allowHashBang: true,
	locations: true,
	ranges: true,
	tokens: false,
	plugins: ['jsx', 'classProperties', 'objectRestSpread']
};

var generatorOption = {
	retainLines: true,
	comments: true
};

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};





var asyncGenerator = function () {
  function AwaitValue(value) {
    this.value = value;
  }

  function AsyncGenerator(gen) {
    var front, back;

    function send(key, arg) {
      return new Promise(function (resolve, reject) {
        var request = {
          key: key,
          arg: arg,
          resolve: resolve,
          reject: reject,
          next: null
        };

        if (back) {
          back = back.next = request;
        } else {
          front = back = request;
          resume(key, arg);
        }
      });
    }

    function resume(key, arg) {
      try {
        var result = gen[key](arg);
        var value = result.value;

        if (value instanceof AwaitValue) {
          Promise.resolve(value.value).then(function (arg) {
            resume("next", arg);
          }, function (arg) {
            resume("throw", arg);
          });
        } else {
          settle(result.done ? "return" : "normal", result.value);
        }
      } catch (err) {
        settle("throw", err);
      }
    }

    function settle(type, value) {
      switch (type) {
        case "return":
          front.resolve({
            value: value,
            done: true
          });
          break;

        case "throw":
          front.reject(value);
          break;

        default:
          front.resolve({
            value: value,
            done: false
          });
          break;
      }

      front = front.next;

      if (front) {
        resume(front.key, front.arg);
      } else {
        back = null;
      }
    }

    this._invoke = send;

    if (typeof gen.return !== "function") {
      this.return = undefined;
    }
  }

  if (typeof Symbol === "function" && Symbol.asyncIterator) {
    AsyncGenerator.prototype[Symbol.asyncIterator] = function () {
      return this;
    };
  }

  AsyncGenerator.prototype.next = function (arg) {
    return this._invoke("next", arg);
  };

  AsyncGenerator.prototype.throw = function (arg) {
    return this._invoke("throw", arg);
  };

  AsyncGenerator.prototype.return = function (arg) {
    return this._invoke("return", arg);
  };

  return {
    wrap: function (fn) {
      return function () {
        return new AsyncGenerator(fn.apply(this, arguments));
      };
    },
    await: function (value) {
      return new AwaitValue(value);
    }
  };
}();





var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

var createAst = function createAst(jsx$$1) {
    return babylon.parse(jsx$$1, parserOption).program.body[0].expression;
};

var Node = function () {
    function Node(tagName, props, children) {
        classCallCheck(this, Node);

        this.tagName = tagName;
        this.props = props;
        this.children = children;
    }

    createClass(Node, [{
        key: 'toJsx',
        value: function toJsx() {
            return createJsxNode(this.tagName, this.props, this.children);
        }
    }]);
    return Node;
}();

function renderJsx(ast) {
    return generate(ast, generatorOption);
}

var createJsxNode = function createJsxNode(tagName, props, children) {
    var openTag = void 0,
        endTag = void 0,
        propStr = '';
    if (props) {
        propStr = Object.keys(props).map(function (key) {
            var val = props[key];
            var valType = typeof val === 'undefined' ? 'undefined' : _typeof(val);
            if (valType === 'string') {
                if (/^o-/.test(val)) {
                    return key + '={' + val.substring(2) + '}';
                }
                return key + '="' + val + '"';
            } else if (valType === 'number') {
                return key + '={' + val + '}';
            } else if (valType === 'object' && val != null) {
                return key + '={' + obj2String(val) + '}';
            } else {
                return '';
            }
        }).join(' ');
    }
    if (!children) {
        openTag = '<' + tagName + ' ' + propStr + '/>';
        return openTag;
    }
    openTag = '<' + tagName + ' ' + propStr + '>';
    endTag = '</' + tagName + '>';
    if (typeof children == 'string') {
        return openTag + children + endTag;
    }
    var childrenJsx = children.map(function (_) {
        return _.toJsx();
    }).join(' ');
    return openTag + childrenJsx + endTag;
};

function obj2String(obj) {
    if (!obj) return '{}';
    var keys = Object.keys(obj);
    var content = keys.map(function (key, index) {
        var val = obj[key];
        var isLast = index == keys.length - 1;
        var valType = typeof val === 'undefined' ? 'undefined' : _typeof(val);
        var result = null;
        if (valType == 'string') {
            if (/^o-/.test(val)) {
                result = key + ': ' + val.substring(2);
            } else {
                result = key + ': \'' + val + '\'';
            }
        } else if (valType == 'number') {
            result = key + ': ' + val;
        } else if (valType == 'object' && val != null) {
            result = key + ': ' + obj2String(val);
        }
        if (!result) {
            return '';
        }
        if (!isLast) {
            result += ',';
        }
        return result;
    }).join('\n');
    return '{\n' + content + '}';
}

var Found = function Found(obj) {
	classCallCheck(this, Found);

	this.node = obj;
};

function throwFind(func) {
	return function () {
		try {
			func.apply(null, arguments);
		} catch (e) {
			if (e instanceof Found) {
				return e.node;
			}
			throw e;
		}
	};
}





var findJsxElementInReturn = throwFind(function (returnAst) {
	walk.ancestor(returnAst, {
		JSXElement: function JSXElement(_, ancestors) {
			var ancestorTypes = ancestors.map(function (_) {
				return _.type;
			});
			if (ancestorTypes.indexOf('JSXElement') == -1) {
				throw new Found(_);
			}
		}
	});
});

var findJsxElement = throwFind(function (jsxAst, predication) {
	walk.ancestor(jsxAst, {
		JSXElement: function JSXElement(_, ancestors) {
			var result = predication(_, ancestors);
			if (result) {
				throw new Found(_);
			}
		}
	});
});

function indexIt(parent, child) {
  return i == parent.children.length ? -1 : i;
}
var checkType = function checkType(predications) {
  return function (func) {
    return function () {
      var _arguments = arguments;

      var result = predications.reduce(function (seed, predication) {
        if (!seed) return seed;
        return seed && predication.apply(null, _arguments);
      }, true);
      if (!result) {
        return false;
      }
      return func.apply(null, arguments);
    };
  };
};

var checkParent = function checkParent(parent) {
  if (parent.type == 'JSXElement') {
    return true;
  }
  console.warn('you want insert a node into a non-JSXElement, check it');
  return false;
};

var appendChild = checkType([checkParent])(function (parent, newChild) {
    parent.children.push(newChild);
});

/**
 * 在子元素child前面添加添加一个兄弟节点newChild
 */
var insertBefore = checkType([checkParent])(function (parent, child, newChild) {
    var i = void 0;
    if ((i = indexIt(parent, child)) != -1) {
        parent.children.splice(i, 0, newChild);
        return true;
    }
    return false;
});

/**
 * 在子元素child后面添加添加一个兄弟节点newChild
 */
var insertAfter = checkType([checkParent])(function (parent, child, newChild) {
    var i = void 0;
    if ((i = indexIt(parent, child)) != -1) {
        parent.children.splice(i + 1, 0, newChild);
        return true;
    }
    return false;
});

var deleteNode = checkType([checkParent])(function (parent, child) {
    var i = void 0;
    if ((i = indexIt(parent, child)) != -1) {
        parent.children.splice(i, 1);
        return true;
    }
    return false;
});

var deleteAfter = checkType([checkParent])(function (parent, child) {
    var i = void 0;
    if ((i = indexIt(parent, child)) != -1) {
        if (i == parent.children.lenght - 1) return false;
        parent.children.splice(i + 1, 1);
        return true;
    }
    return false;
});

var deleteBefore = checkType([checkParent])(function (parent, child) {
    var i = void 0;
    if ((i = indexIt(parent, child)) != -1) {
        if (i == 0) return false;
        parent.children.splice(i - 1, 1);
        return true;
    }
    return false;
});

// import fs from 'fs'
// import praan from 'praan'
// import walk from 'babylon-walker'
// import generate from 'babel-generator'
// import babylon from 'babylon'
// import {parserOption, generatorOption} from './option'
// import {readFile, writeFile, findMethod, findAllReturn} from './util/sugar'
// const findRenderMethod = findMethod('render')

var node = new Node('div', {
    style: {
        marginLeft: 10,
        zIndex: 12,
        height: '12px',
        backgroundImage: 'url(http://www.baidu.com/logo.png)'
    },
    info: 'o-info',
    test: 1,
    hello: 'world'
}, 'this is a text');
var outerNode = new Node('section', {
    className: 'hello world'
}, [node]);

var testAst = createAst(outerNode.toJsx());
var newNode = new Node('span', {
    style: {
        fontSize: '1em'
    }
});
var newAst = createAst(newNode.toJsx());

var targetAst = findJsxElement(testAst, function (_, ancestors) {
    return _.type == 'JSXElement' && _.openingElement.name.name == 'section';
});
appendChild(testAst, newAst);
console.info(testAst == targetAst);
var findNewNode = findJsxElement(testAst, function (_, ancestors) {
    return _.type == 'JSXElement' && _.openingElement.name.name == 'span';
});

console.info(newAst === findNewNode);

console.info(renderJsx(testAst).code);
// console.info(targetAst)

})));
