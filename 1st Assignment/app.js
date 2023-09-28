var count = 0;
var pos_1, pos_2;
var nodes = [];

function main() {

    var data_el = mesh["Elements"];
    var tri = [];
    for (let i = 0; i < data_el.length; i++) {
        if (data_el[i]["Type"] == 2) {
            tri = data_el[i]["NodalConnectivity"];
            break;
        }
    }

    for (let i = 0; i < tri.length; i++) {
        console.log(tri[i]);
    }

    canvas1.addEventListener('click', function (e) {
        if (count % 2 === 0) {
            pos_1 = click_point(canvas1, e, nodes);
            draw_point_1(pos_1, canvas1);
        } else {
            pos_2 = click_point(canvas1, e, nodes);
            draw_point_2(pos_2, canvas1);
            draw_edge(pos_1, pos_2, canvas1);
        }

        count += 1;

        if (count === 5) {
            context.clearRect(0, 0, canvas1.width, canvas1.height);
            count = 1;  // Reset the counter and draw the first point again
            draw_point_1(pos_1, canvas1);
        }
    });
}



function draw_point_1(pos, canvas1) {
    context = canvas1.getContext("2d");
    context.fillStyle = "blue";
    context.beginPath();
    context.arc(pos[0], pos[1], 5, 0, 2 * Math.PI);
    context.closePath();
    context.fill();
}

function draw_point_2(pos, canvas1) {
    context = canvas1.getContext("2d");
    context.fillStyle = "blue";
    context.beginPath();
    context.arc(pos[0], pos[1], 5, 0, 2 * Math.PI);
    context.closePath();
    context.fill();
}

function click_point(canvas, event, nodes) {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    return [x, y];
}

function draw_edge(A, B, canvas1) {
    context = canvas1.getContext("2d");
    context.strokeStyle = "black";
    context.beginPath();
    context.moveTo(A[0], A[1]);
    context.lineTo(B[0], B[1]);
    context.stroke();
}
