import React, { useEffect, useRef } from 'react';
import isGreaterThan from './helper/isGreaterThan';
import isOperator from './helper/isOperator';


const Keypad = ({
	showInput,
	hClick,
	input,
	answer,
	isInputHidden,
	init,
	hideInput,
}) => {
	//NOTE: addToView now has parameter. older version did not use an argument.

	const ref = useRef();

	const addToView = (el) => {
		console.log(`el is ${el}`);
		console.log(`input is ${input}`);

		//value props
		const appAnswer = answer;
		const appIsInputHidden = isInputHidden;
		let newInputArr = Array.from(input);
		let lastChar = newInputArr[newInputArr.length - 1];

		//function props
		const appInit = init;
		const appHideInput = hideInput;

		switch (el) {
			case 'CE':
				return appInit(newInputArr.join(''));

			case 'c':
			case 'C':
				appHideInput();
				return appInit();

			case '=':
			case 'Enter':
				return appInit(0, appAnswer);


			case '+/-':
				if (newInputArr[0] === '-') {
					newInputArr.shift();
					newInputArr.unshift('+');
				} else if (newInputArr[0] === '+') {
					newInputArr.shift();
					newInputArr.unshift('-');
				}

				if (!isNaN(newInputArr[0])) {
					newInputArr.unshift('+');
				}

				break;

			case ')':
				if (lastChar !== '(') {
					newInputArr.push(')');

					if (
						newInputArr.length === 1 ||
						isGreaterThan(')', '(', newInputArr)
					) {
						newInputArr.pop();
					}
				}
				break;

			case 'Backspace':
			case 'Delete':
			case 'DEL':
				newInputArr.pop();

				if (
					newInputArr.length === 1 &&
					(isOperator(newInputArr[0]) ||
						['(', ')'].includes(newInputArr[0]))
				) {
					newInputArr.pop();
				}

				if (newInputArr.length === 0) {
					appHideInput();
					return appInit();
				}

				break;

			case '.':
				if (isOperator(lastChar) || lastChar === '.') {
					newInputArr.pop();
				}

				//prevent two decimals in one number
				const stack = newInputArr.filter(
					(el) => isOperator(el) || ['(', ')', '.'].includes(el)
				);
				stack.push(el);
				const stackStr = stack.join('');

				if (!stackStr.includes('..')) {
					appIsInputHidden
						? (newInputArr = [appAnswer, el])
						: newInputArr.push(el);
				}

				break;

			case 'X':
			case 'x':
				if (isOperator(lastChar)) {
					newInputArr.pop();
				}

				newInputArr.push('*');
				if (appIsInputHidden && appAnswer !== '0') {
					newInputArr = [appAnswer, '*'];
				}

				break;

			default:
				if (isOperator(el)) {
					if (isOperator(lastChar)) {
						newInputArr.pop();
					}

					if (appIsInputHidden) {
						newInputArr = [appAnswer];
					}
				}
				newInputArr.push(el);

				break;
		}

		console.log('newInputArr: ' + newInputArr.join(''));
		showInput();
		hClick(newInputArr.join(''));
	};



	useEffect(() => {
		console.log('re-render');
	});

	const defaultStyle =
		'font-weight-bold btn-keypad border-grey rounded p-2 m-2 text-center btn unselectable';

	const renderBtn = (arr, style, size = '2', callBack) => {
		return arr.map((el) => {
			const callAddToView = () => {
				//unfocus on button after 300ms
				setTimeout(() => {
					document.getElementById(el).blur();
				}, 300);

				//calculate then add to view
				addToView(el);
			};

			return (
				<input
					key={el}
					id={el}
					type="button"
					className={`${defaultStyle} col-${size} ${style}`}
					value={el}
					onClick={callBack || callAddToView}
				/>
			);
		});
	};

	return (
		<div ref={ref} className="container m-2 mb-4">
			<div className="row  justify-content-center">
				{renderBtn(['%'], 'btn-outline-secondary')}
				{renderBtn(['CE'], 'btn-outline-primary font-weight-bold')}
				{renderBtn(['C'], 'btn-outline-primary font-weight-bold')}
				{renderBtn(['DEL'], 'btn-outline-danger font-weight-bold')}
			</div>
			<div className="row  justify-content-center">
				{renderBtn(['^', '(', ')', '/'], 'btn-outline-secondary')}
			</div>
			<div className="row  justify-content-center">
				{renderBtn(['7', '8', '9'], 'btn-light')}
				{renderBtn(['x'], 'btn-outline-secondary')}
			</div>

			<div className="row  justify-content-center">
				{renderBtn(['4', '5', '6'], 'btn-light')}
				{renderBtn(['-'], 'btn-outline-secondary')}
			</div>
			<div className="row  justify-content-center">
				{renderBtn(['1', '2', '3'], 'btn-light')}
				{renderBtn(['+'], 'btn-outline-secondary')}
			</div>
			<div className="row  justify-content-center">
				{renderBtn(['+/-'], 'btn-outline-secondary')} {/* needs logic */}
				{renderBtn(['0'], 'btn-light')}
				{renderBtn(['.', '='], 'btn-outline-secondary')}
			</div>
		</div>
	);
};

export default Keypad;
