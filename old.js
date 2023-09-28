function main(canvas1){
    var A = [100, 200];
    var B = [400, 400];
    count = 0
    //draw_edge(A,B, canvas1);

    var data_el = mesh["Elements"];
    var tri = [];
    for (let i = 0; i < data_el.length; i++) {
        if(data_el[i]["Type"] == 2){
            tri = data_el[i]["NodalConnectivity"];
            break;
        }
    }

    for(let i = 0; i < tri.length; i++){
        console.log(tri[i]);
    }


    nodes = [];
    i = 0;
    canvas1.addEventListener('click', function(e) {
        pos_1 = click_point(canvas1, e, nodes);
        if (count == 4) {
            context.clearRect(0, 0, canvas1.width, canvas1.height);
            count = 0;
        }
        draw_point_1(pos_1, canvas1);
        console.log("Inside 1st Event")
    });
    console.log("Outside 1st Event");
    canvas1.addEventListener('click', function(e) {
        pos_2 = click_point(canvas1, e, nodes);
        draw_point_2(pos_2, canvas1);
        count += 1;
        console.log("Inside 2nd Event")
    });
    console.log("Outside 2nd Event");
    // draw_edge(nodes[i], nodes[i + 2], canvas1);
    i += 4;


}
function draw_point_1(pos, canvas1){
    context = canvas1.getContext("2d");
    context.fillStyle = "blue";
    context.beginPath();
    context.arc(pos[0], pos[1], 5, 0, 2*Math.PI);
    context.closePath();
    context.fill();

}
function draw_point_2(pos, canvas1){
    context = canvas1.getContext("2d");
    context.fillStyle = "green";
    context.beginPath();
    context.arc(pos[0], pos[1], 5, 0, 2*Math.PI);
    context.closePath();
    context.fill();

}
function click_point(canvas, event, nodes){
    //click position
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    pos = [x, y];

    // console.log(pos);

    return pos;
}

function draw_edge(A, B, canvas1){
    context = canvas1.getContext("2d");
    context.strokeStyle = "black";
    context.beginPath();
    context.moveTo(A[0], A[1]); 
    context.lineTo(B[0], B[1]);
    context.stroke();
}

// s = [0,1]
//s_inter = T_1 / (T_1 + T_2 )
