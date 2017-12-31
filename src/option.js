export let parserOption = {
	ecmaVersion: 7,
	sourceType: 'module',
	allowReserved: false,
	allowReturnOutsideFunction: false,
	allowImportExportEverywhere: true,
	allowHashBang: true,
	locations: true,
	ranges: true,
	tokens: false,
	plugins: [
		'jsx',
		'classProperties',
		'objectRestSpread'
	]
};

export let generatorOption = {
	retainLines: true,
	comments: true
}