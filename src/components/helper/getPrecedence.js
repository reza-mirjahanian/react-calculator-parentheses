//evaluates level of symbol
const getPrecedence = function (symbol) {
	switch (symbol) {
		case '^':
			return 5;
		case '*':
		case '/':
		case '~':
			return 4;
		case '+':
		case '-':
			return 3;
		case '(':
			return 2;
		case '=':
			return 1;

		default:
			return;
	}
};

export default getPrecedence;
