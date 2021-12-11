//checks if character is a mathematical operator
const isOperator = function (char) {
	return ['+', '-', '/', '*', '^', '~', '%'].includes(char);
};

export default isOperator;
