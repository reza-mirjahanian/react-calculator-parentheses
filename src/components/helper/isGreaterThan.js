//checks if element1 occurence in iterative is greater than element2
const isGreaterThan = function (element1, element2, iterative) {
	let count = [0, 0];

	for (const cur of iterative) {
		if (cur === element1) {
			count[0]++;
		} else if (cur === element2) {
			count[1]++;
		}
	}

	return count[0] > count[1];
};

export default isGreaterThan;
