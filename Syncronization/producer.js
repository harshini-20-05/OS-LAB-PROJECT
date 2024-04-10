var queue = [ 0, 0, 0, 0, 0 ];
var flag = 0;
var rear = -1;
var front = -1;

function Counter() {
	var Counter = rear - front + 1;
	// console.log(rear)
	if (rear == -1) {
		var change = document.getElementById('count');
		change.innerHTML = 'Counter = 0';
	} else if (Counter == 1) {
		var change = document.getElementById('count');
		change.innerHTML = 'Counter = 1';
	}
	if (Counter == 2) {
		var change = document.getElementById('count');
		change.innerHTML = 'Counter = 2';
	}
	if (Counter == 3) {
		var change = document.getElementById('count');
		change.innerHTML = 'Counter = 3';
	}

	if (Counter == 4) {
		var change = document.getElementById('count');
		change.innerHTML = 'Counter = 4';
	}
	if (Counter == 5) {
		var change = document.getElementById('count');
		change.innerHTML = 'Counter = 5';
	}
}

function check() {
	if (flag > 0) {
		document.getElementById('consume button').disabled = false;
	}
	if (flag < 4) {
		document.getElementById('produce button').disabled = false;
	}
}

function color() {
	if (queue[0] == 1) {
		document.getElementById('one').style.backgroundColor = '#8BC34A';
	}
	if (queue[1] == 1) {
		document.getElementById('two').style.backgroundColor = '#8BC34A';
	}
	if (queue[2] == 1) {
		document.getElementById('three').style.backgroundColor = '#8BC34A';
	}
	if (queue[3] == 1) {
		document.getElementById('four').style.backgroundColor = '#8BC34A';
	}
	if (queue[4] == 1) {
		document.getElementById('five').style.backgroundColor = '#8BC34A';
	}

	if (queue[0] == 0) {
		document.getElementById('one').style.backgroundColor = '#FFFFFF';
	}
	if (queue[1] == 0) {
		document.getElementById('two').style.backgroundColor = '#FFFFFF';
	}
	if (queue[2] == 0) {
		document.getElementById('three').style.backgroundColor = '#FFFFFF';
	}
	if (queue[3] == 0) {
		document.getElementById('four').style.backgroundColor = '#FFFFFF';
	}
	if (queue[4] == 0) {
		document.getElementById('five').style.backgroundColor = '#FFFFFF';
	}

	//check();
}

function produce() {
	// flag++;
	if (flag == 5) {
		document.getElementById('produce button').disabled = true;
		alert("Buffer full can't add the produced item to the buffer!");
		return;
	}
	// document.getElementById("prod1").style.color=green;
	if (front == -1 && rear == -1) {
		front = 0;
		rear = 0;
		queue[rear] = 1;
		flag++;
	} else {
		rear = (rear + 1) % 5;
		queue[rear] = 1;
		flag++;
	}

	color();

	if (flag == 1) {
		document.getElementById('consume button').disabled = false;
	}
	Counter();
}

function consume() {
	//   myMove();
	if (flag == 0) {
		document.getElementById('consume button').disabled = true;
		alert('No item to consume for the consumer!');
		return;
	}

	if (front == rear) {
		queue[front] = 0;
		front = -1;
		rear = -1;
		flag--;
	} else {
		if (flag == 5) {
			document.getElementById('produce button').disabled = true;
			queue[front] = 0;
			front = (front + 1) % 5;
			flag--;
		} else {
			queue[front] = 0;
			front = (front + 1) % 5;
			flag--;
		}
	}
	color();
	Counter();

	if (flag == 4) {
		document.getElementById('produce button').disabled = false;
	}
}

function barrieradd() {
	var n = Math.random();
	num = Math.floor(n * 2);

	if (flag == 0 && num == 1) {
		alert('No item to consume for the consumer!');
		document.getElementById('num').innerHTML = 'No item to consume';
	} else if (flag == 5 && num == 0) {
		document.getElementById('num').innerHTML = 'buffer Full to produce';
		alert("Buffer full can't add the produced item to the buffer!");
	} else if (num == 0) {
		document.getElementById('prod1').style.backgroundColor = 'green';
		document.getElementById('con').style.backgroundColor = 'white';

		document.getElementById('num').innerHTML = 'producer';
		produce();
	} else {
		document.getElementById('con').style.backgroundColor = 'green';
		document.getElementById('prod1').style.backgroundColor = 'white';

		document.getElementById('num').innerHTML = 'consumer';
		consume();
	}
}
