import React from 'react';

const View = ({ answer,  input, sizeModifier }) => {

	console.log({ answer,  input, sizeModifier })
	return (
		<div className="parent d-flex flex-column justify-content-end pr-3 py-1 ml-3 mr-3 viewport rounded">
			<span
				className={`d-inline-block text-wrap d-flex flex-row justify-content-end fs-${sizeModifier}`}
				id="solution"
			>
				<strong>{answer || 0}</strong>
			</span>
			<div
				className="equation d-flex flex-row justify-content-end text-black-50 font-weight-bold ls-1"
				id="problem"
			>
				{input || ''}
			</div>
		</div>
	);
};

export default View;
