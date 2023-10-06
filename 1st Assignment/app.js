function main(canvas1, canvas2){

    //////////  First part of the homework /////////

    //If the user clicks, then a point is created and a segment is created if the user clicks a second time
    //If another segment is drawn and if it intersects with the previous one, a point is created at the intersect
    nodes = [];
    canvas1.addEventListener('mousedown', function(e){  //each time we put the mouse down, it calls the function
        click_point(canvas1,e,nodes);
    });


    //////////  Second part of the homework /////////

    // Get nodal elements
    var data_el = mesh["Elements"];
    var tri=[];
    for (let i=0 ; i<data_el.length ; i++){
        if (data_el[i]["Type"]==2){
            tri=data_el[i]["NodalConnectivity"];
            break;
        }
    }

    for (let i = 0 ; i<tri.length ; ++i){
        console.log(tri[i]);
    }

    // Draw the mesh
    var data_coord = mesh["Nodes"];
    var nodal_coord= data_coord[0]["Coordinates"];
    for (let i = 0 ; i<tri.length ; i++){
        A = get_mat_coord(nodal_coord, tri, i,0);
        B = get_mat_coord(nodal_coord, tri, i,1);
        C = get_mat_coord(nodal_coord, tri, i,2);
        draw_edge(A,B, canvas2);
        draw_edge(B,C, canvas2);
        draw_edge(C,A, canvas2);
    }


    // When you click in a triangle, it detects which one and colors it
    canvas2.addEventListener('mousedown', function(e){
        click_point_tri(canvas2, e, tri, nodal_coord);
    });


}

function click_point_tri(canvas, event, triangles, nodal_coord) {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    pos = [x, y];
    console.log(pos);  // Register the point in the console

    for (let i = 0; i < triangles.length; i++) {
        // Triangle i
        A = get_mat_coord(nodal_coord, triangles, i, 0);
        B = get_mat_coord(nodal_coord, triangles, i, 1);
        C = get_mat_coord(nodal_coord, triangles, i, 2);

        // Color the interior of the triangle when you click inside
        if (isInside(A, B, C, pos)) {
            // Draw the green-filled triangle
            fill_triangle(canvas, A, B, C, "green");
            draw_point(canvas, pos[0], pos[1], "red");
            break;
        }
    }
}
function isInside(A, B, C, pos) {
    // Calculate area of triangle ABC
    var A_area = area(A[0], A[1], B[0], B[1], C[0], C[1]);
    // Calculate area of three sub-triangles with the given point
    var P_area = area(pos[0], pos[1], B[0], B[1], C[0], C[1]);
    var Q_area = area(A[0], A[1], pos[0], pos[1], C[0], C[1]);
    var R_area = area(A[0], A[1], B[0], B[1], pos[0], pos[1]);
    // Check if the sum of sub-triangle areas is approximately equal to the original triangle area
    return Math.abs(A_area - (P_area + Q_area + R_area)) < 1e-6;
}


function area(x1, y1, x2, y2, x3, y3){
    return Math.abs((x1*(y2-y3) + x2*(y3-y1)+ x3*(y1-y2))/2.0);
}

function fill_triangle(canvas, A, B, C, color) {
    const context = canvas.getContext('2d');
    context.fillStyle = color;
    context.beginPath();
    context.moveTo(A[0], A[1]);
    context.lineTo(B[0], B[1]);
    context.lineTo(C[0], C[1]);
    context.closePath();
    context.fill();
}

function get_mat_coord(nodal_coord, tri, i, j){
    return [nodal_coord[tri[i][j]][0]*900, nodal_coord[tri[i][j]][1]*900];
}


function click_point(canvas, event, nodes){
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    pos = [x, y];
    console.log(pos);  // Register the point in the console
    draw_point(canvas, pos[0], pos[1], "red");
    nodes.push(pos);

    if (nodes.length === 2) {
        draw_edge(nodes[0], nodes[1], canvas);
    }
    
    if (nodes.length === 4) {
        draw_edge(nodes[2], nodes[3], canvas);

        const x1 = nodes[0][0], y1 = nodes[0][1];
        const x2 = nodes[1][0], y2 = nodes[1][1];
        const x3 = nodes[2][0], y3 = nodes[2][1];
        const x4 = nodes[3][0], y4 = nodes[3][1];

        const den = (x2 - x1) * (y4 - y3) - (x4 - x3) * (y2 - y1);
        const tolerance_1 = 100;
        const tolerance_2 = 1e-6;
        console.log("den is - ", den);

        if (Math.abs(den) > 100 || Math.abs(den) < -100) {   // If lines are not parallel
            const ua = ((x4 - x3) * (y1 - y3) - (x1 - x3) * (y4 - y3)) / den;
            const ub = ((x2 - x1) * (y1 - y3) - (x1 - x3) * (y2 - y1)) / den;

            if (ua > 0 && ua < 1 && ub > 0 && ub < 1) {  // If lines are not coincident
                const x_intersect = x1 + ua * (x2 - x1);
                const y_intersect = y1 + ua * (y2 - y1);

                draw_point(canvas, x_intersect, y_intersect, "green");
            }
        } else {
            // Lines are parallel, check for coincidence
            const distance = Math.sqrt((x3 - x1) ** 2 + (y3 - y1) ** 2);
            const distance_2 = Math.sqrt((x4 - x2) ** 2 + (y4 - y2) ** 2);
            console.log("distance is - ", distance);
            console.log("distance_2 is - ", distance_2);

            if (distance < 4 && distance > -4 && distance_2 < 4 && distance_2 > -4) {
                console.log("Lines are coincident");
                draw_special_edge(nodes[2], nodes[3], canvas);
                draw_special_edge(nodes[0], nodes[1], canvas);
            } else {
                console.log("Lines are parallel but not coincident");
            }
        }

        while (nodes.length > 0) nodes.pop(); // Empty the list for the next clicks
    }
}


function draw_point(canvas, x, y, color){
    context = canvas.getContext('2d');
    context.beginPath();
    context.fillStyle = color;
    context.arc(x,y, 10, 0, 2*Math.PI);
    context.closePath();
    context.fill();
}

function draw_edge(A,B,canvas){
    context = canvas.getContext('2d');
    context.strokeStyle = "black";
    context.beginPath(); //Begins the segment
    context.moveTo(A[0], A[1]); //Coordinates at the begin of the segment
    context.lineTo(B[0], B[1]); //Coordinates at the end of the segment
    context.stroke() ; //Draws a line
}

function draw_special_edge(A,B,canvas){
    context = canvas.getContext('2d');
    context.strokeStyle = "yellow";
    context.beginPath(); //Begins the segment
    context.moveTo(A[0], A[1]); //Coordinates at the begin of the segment
    context.lineTo(B[0], B[1]); //Coordinates at the end of the segment
    context.stroke() ; //Draws a line
}



//Bonus points

function zoomWheel(event, scale){
    const zoomSpeed = 0.1;

    if (event.deltaY > 0 ){
        scale/= 1 + zoomSpeed;
    }
    if (event.deltaY < 0){
        scale+= 1 + zoomSpeed;
    }
}
