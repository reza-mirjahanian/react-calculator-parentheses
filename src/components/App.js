//components
import React, { useState } from 'react';
import View from './View';
import Keypad from './Keypad';

//modules
import calculate from './helper/calcPostfix';
import infixToPostfix from './helper/infixToPostfix';
import '../index.scss';
import isOperator from './helper/isOperator';
import isEqualQty from './helper/isEqualQty';

function App() {
	const [input, setInput] = useState('');
	const [inputDisplay, setInputDisplay] = useState('');
	const [isInputHidden, setIsInputHidden] = useState(true);
	const [sizeModifier, setSizeModifier] = useState('xxl');
	const [answer, setAnswer] = useState('0');

	const hideInput = () => {
		setIsInputHidden(true);
		setSizeModifier('xxl');
	};

	const showInput = () => {
		setIsInputHidden(false);
		setSizeModifier('xl');
	};

	const closeBracket = (open, close, arr) => {
		while (!isEqualQty(open, close, arr)) {
			arr.push(close);
		}
	};

	//state controller function
	const solve = (newInput, newAnswer = answer) => {
		setInput(newInput);
		setInputDisplay(newInput.replace(/\*/g, 'x'));

		let newInputArr = Array.from(newInput);

		if (calculate(infixToPostfix(newInput)) !== 'invalid entry') {
			//if input is clear of error, solve
			setAnswer(calculate(infixToPostfix(newInput)));
		} else if (isOperator(newInput.slice(-1))) {
			//if last character is operator, pop and solve.
			newInputArr.pop();
			if (isEqualQty('(', ')', newInputArr)) {
				setAnswer(calculate(infixToPostfix(newInputArr.join(''))));
			} else {
				//close parenthese if left open after popping operator
				closeBracket('(', ')', newInputArr);
				setAnswer(calculate(infixToPostfix(newInputArr.join(''))));
			}
		} else if (
			!isEqualQty('(', ')', newInputArr) &&
			!isNaN(newInput.slice(-1))
		) {
			// close parentheses if open.
			closeBracket('(', ')', newInputArr);
			setAnswer(calculate(infixToPostfix(newInputArr.join(''))));
		}
	};

	//initialize states
	const init = (input, answer = 0) => {
		setInput(input || '');
		setInputDisplay(input ? input.replace(/\*/g, 'x') : '');
		setAnswer(answer);

		if (!input) {
			hideInput();
		} else {
			showInput();
		}

		console.log(input);
	};

	return (
		<div className="">
			<div className="container border border-dark mt-2">

				<View
					input={inputDisplay}
					answer={answer}
					isInputHidden={isInputHidden}
					sizeModifier={sizeModifier}
				/>
				<br />
				<Keypad
					input={input}
					hClick={solve}
					init={init}
					answer={answer}
					hideInput={hideInput}
					showInput={showInput}
					isInputHidden={isInputHidden}
				/>
			</div>
		</div>
	);
}

export default App;
