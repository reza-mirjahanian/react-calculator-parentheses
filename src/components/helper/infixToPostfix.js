import getPrecedence from './getPrecedence';
import isEqualQty from './isEqualQty';
import isOperator from './isOperator';

//.converts string of infix to postfix.
const infixToPostfix = function (input) {
	let result = '';
	const stack = [];
	let inputArr = input.replace(/\s/g, '').split('');

	const isSpecialChar = function (char) {
		return ['.', '%'].includes(char);
	};

	//get top of stack or (last element of stack array)
	const topOfStack = () => {
		return stack[stack.length - 1];
	};

	//#validator
	if (
		(!['+', '-', '.', '('].includes(inputArr[0]) && isNaN(inputArr[0])) ||
		!isEqualQty('(', ')', inputArr)
	) {
		return 'invalid entry';
	}

	for (const [index, value] of inputArr.entries()) {
		//protect against two consecutive decimals in one number
		if (isOperator(value) || ['(', ')', '.'].includes(value)) {
			stack.push(value);
			let stackStr = stack.join('');
			while (stack.length > 0) {
				stack.pop();
			}
			if (stackStr.includes('..')) {
				return 'invalid entry';
			}
		}

		//protect against missing operand
		if (isOperator(value) && isOperator(inputArr[index + 1])) {
			return 'invalid entry';
		} else if (
			isSpecialChar(value) &&
			isOperator(inputArr[index - 1]) &&
			isOperator(inputArr[index + 1])
		) {
			return 'invalid entry';
		} else if (value === '%' && isNaN(inputArr[index - 1])) {
			return 'invalid entry';
		}
	}

	//#grouper
	//groups numeric values together
	for (let i = 0; i <= inputArr.length - 1; ) {
		if (inputArr[0] === '.' && !isNaN(inputArr[1])) {
			inputArr.splice(i, 2, `0${inputArr[i] + inputArr[i + 1]}`);
		} else if (
			(isOperator(inputArr[i]) || ['(', ')'].includes(inputArr[i])) &&
			inputArr[i + 1] === '.'
		) {
			inputArr.splice(i + 1, 1, `0.`);
		} else if (inputArr[i + 1] === '.' && !inputArr[i].includes('.')) {
			inputArr.splice(i, 2, inputArr[i] + inputArr[i + 1]);
		} else if (
			['+', '-'].includes(inputArr[i]) &&
			['('].includes(inputArr[i - 1]) &&
			!isNaN(inputArr[i + 1])
		) {
			inputArr.splice(i, 2, inputArr[i] + inputArr[i + 1]);
		} else if (['+', '-'].includes(inputArr[0]) && !isNaN(inputArr[1])) {
			inputArr.splice(i, 2, inputArr[0] + inputArr[1]);
		} else if (!isNaN(inputArr[i]) && !isNaN(inputArr[i + 1])) {
			inputArr.splice(i, 2, inputArr[i] + inputArr[i + 1]);
		} else if (inputArr[i] === '(' && inputArr[i + 1] === ')') {
			inputArr.length === 2
				? inputArr.splice(i, 2, '0')
				: inputArr.splice(i, 2); //! empty bracket logic
		} else {
			i++;
		}
	}

	//checks if parentheses if preceded by a number of operator. if it's alphanumeric, it inserts a '*' at beginning of the problem inside the parentheses so the solution inside the parentheses gets multiplied to the number outside before solving the rest of the problem
	if (input.includes('(')) {
		for (const [index, value] of inputArr.entries()) {
			//add * before open bracket
			if (
				value === '(' &&
				(/\w/.test(inputArr[index - 1]) || inputArr[index - 1] === ')') &&
				inputArr[index - 1] !== undefined
			) {
				inputArr.splice(index, 0, '*');
			}

			//add * after closing bracket
			if (
				value === ')' &&
				/\w/.test(inputArr[index + 1]) &&
				inputArr[index + 1] !== undefined
			) {
				inputArr.splice(index + 1, 0, '*');
			}
		}
	}

	//evaluate inputArr and convert to postfix
	for (let idx = 0; idx <= inputArr.length - 1; ) {
		let element = inputArr[idx];

		if (!isNaN(element) && inputArr[idx + 1] === '%') {
			!isNaN(inputArr[idx + 2])
				? inputArr.splice(
						idx,
						3,
						`${
							(Number(inputArr[idx]) / 100) * Number(inputArr[idx + 2])
						} `
				  )
				: inputArr.splice(idx, 2, `${Number(inputArr[idx]) / 100} `);
			result += inputArr[idx];
		} else if (/\w/.test(element)) {
			result += `${element} `;
		} else if (element === '(') {
			stack.push(element);
		} else if (element === ')') {
			//if element is closing parentheses, empty stack until open parantheses has been found
			while (topOfStack() !== '(') {
				result += `${stack.pop()} `;
			}
			stack.pop();
		} else {
			//if element is an operator, compare precedence with top of stack
			if (getPrecedence(element) <= getPrecedence(topOfStack())) {
				result += `${stack.pop()} `;
			}
			stack.push(element);
		}
		idx++;
	}

	//push remaining operators in stack to result after each element has been evaluated
	while (stack.length > 0) {
		result += `${stack.pop()} `;
	}

	//since each operator and number is followed by a space, last number/operator will contain a space, this cleans that and prepares result for calculation which splits the string by space.
	return result.trimEnd();
}; //#end of infixToPostfix function;

export default infixToPostfix;
