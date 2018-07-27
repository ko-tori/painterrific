let resize = function() {
	$('canvas').attr('width', $(window).width())
		.attr('height', $(window).height());
}

let mouseDown = false;
let prevX = Infinity, prevY = Infinity;
let mouseX = Infinity, mouseY = Infinity;
let socket;

$(document).ready(function () {
	let canvas = document.getElementById('canvas');
	let ctx = canvas.getContext('2d');
	$(window).on('resize', resize);
	resize();
	$(window).on('mousedown', function() {
		mouseDown = true;
	});
	$(window).on('mouseup', function() {
		mouseDown = false;
	});

	socket = io.connect(location.pathname);
	socket.on('connect', function() {
		console.log('socket connected.');
		$('canvas').on('mousemove', function(e) {
			prevX = mouseX;
			prevY = mouseY;
			mouseX = e.offsetX;
			mouseY = e.offsetY;
			if (mouseDown) {
				ctx.beginPath();
				ctx.moveTo(prevX, prevY);
				ctx.lineTo(mouseX, mouseY);
				ctx.stroke();
				let data = {
					pt1: [prevX, prevY],
					pt2: [mouseX, mouseY],
					uid: 0 // TBD
				};
				socket.emit('draw', data);
			}
		});
	});

	socket.on('draw', function(data) {
		let uid = data.uid;
		ctx.beginPath();
		ctx.moveTo(...data.pt1);
		ctx.lineTo(...data.pt2);
		ctx.stroke();
	});

	socket.on('mesasge', function(data) {
		console.log(data);
	});

	socket.on('disconnect', function() {
		$('canvas').off('mousemoved');
	})
});