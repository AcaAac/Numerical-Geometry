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
        click_point_tri(canvas2, e);
    });


}

function click_point_tri(canvas, event, triangles, nodal_coord){
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    pos = [x,y];
    console.log(pos);  //register the point in the console
    draw_point(canvas, pos[0], pos[1], "red");

    A_min=get_mat_coord(nodal_coord, triangles, 0,0);
    B_min=get_mat_coord(nodal_coord, triangles, 0,1);
    C_min=get_mat_coord(nodal_coord, triangles, 0,2);

    dist_A_x = Math.abs(x-A_min[0]); dist_A_y = Math.abs(y-A_min[1]);
    dist_B_x = Math.abs(x-B_min[0]); dist_B_y = Math.abs(y-B_min[1]);
    dist_C_x = Math.abs(x-C_min[0]); dist_C_y = Math.abs(y-C_min[1]);
    for (let i = 1 ; i<triangles.length ; i++){
        A = get_mat_coord(nodal_coord, triangles, i,0);
        B = get_mat_coord(nodal_coord, triangles, i,1);
        C = get_mat_coord(nodal_coord, triangles, i,2);
    }


}

function get_mat_coord(nodal_coord, tri, i, j){
    return [nodal_coord[tri[i][j]][0]*900, nodal_coord[tri[i][j]][1]*900];
}


function click_point(canvas, event, nodes){
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    pos = [x,y];
    console.log(pos);  //register the point in the console
    draw_point(canvas, pos[0], pos[1], "red");
    nodes.push(pos);
    if (nodes.length==2){
        draw_edge(nodes[0], nodes[1], canvas);
    }
    if (nodes.length==4){
        draw_edge(nodes[2], nodes[3], canvas);

        x1=nodes[0][0]; y1=nodes[0][1];
        x2=nodes[1][0]; y2=nodes[1][1];
        x3=nodes[2][0]; y3=nodes[2][1];
        x4=nodes[3][0]; y4=nodes[3][1];
        
        den = ((x2-x1)*(y4-y3)-(x4-x3)*(y2-y1));  
        
        if (den!=0){   //If lines are note parallel

            ua=((x4-x3)*(y1-y3)-(x1-x3)*(y4-y3))/den;
            ub=((x2-x1)*(y1-y3)-(x1-x3)*(y2-y1))/den;

            if (ua>0 && ub<1 && ub>0 && ub<1){  //If lines are not coincident
                x_intersect=x1 + ua*(x2-x1);
                y_interesct=y1 + ua*(y2-y1);

                draw_point(canvas, x_intersect, y_interesct, "green");
            }
        }

        while (nodes.length>0) nodes.pop(); //Empty the list so we can focus on the next clicks
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
