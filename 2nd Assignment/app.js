function setup_triangle_location(mesh, canvas) {
	console.log("Hello from setup_triangle_location");
	draw_mesh(mesh, canvas);

	canvas.addEventListener('mousedown', (e) => {
		const rect = canvas.getBoundingClientRect();
    	const x = e.clientX - rect.left;
    	const y = e.clientY - rect.top;
    	pos = [x, y];

		//Selection of the arbitrary triangle
		let current_tri = mesh.faces[0];
		const first_vertex_pos_x = (current_tri.incidentEdge.orig.pos[0] +  current_tri.incidentEdge.dest.pos[0] + current_tri.incidentEdge.next.dest.pos[0])/3;
		const first_vertex_pos_y = (current_tri.incidentEdge.orig.pos[1] +  current_tri.incidentEdge.dest.pos[1] + current_tri.incidentEdge.next.dest.pos[1])/3;
		const first_vertex_pos=[first_vertex_pos_x, first_vertex_pos_y];
		

		//Marching Triangle algorithm
		let faces_visited=[];
		const target_seg = [first_vertex_pos, pos];
		let init=true;

		while(init){
			const vert1 = current_tri.incidentEdge.orig.pos;
			const vert2 = current_tri.incidentEdge.dest.pos;
			const vert3 = current_tri.incidentEdge.next.dest.pos;

			if (isInside(vert1, vert2, vert3, pos)){
				fill_triangle(canvas, vert1, vert2, vert3, 'green');
				//Draw line between the target point and the arbitrary vertex
				draw_edge(pos, first_vertex_pos, canvas);
				draw_point(canvas, x,y, 'red');
				init=false;
				return;
			}

			else {
				const seg12 = [vert1, vert2];
				const seg23 = [vert2, vert3];
				const seg31 = [vert3, vert1];

				if (intersect(seg12, target_seg) && !faces_visited.includes(current_tri.incidentEdge.oppo.incidentFace.id)){
					faces_visited.push(current_tri.id);
					fill_triangle(canvas, vert1, vert2, vert3, 'gray');
					current_tri=current_tri.incidentEdge.oppo.incidentFace;
				} else if (intersect(seg23, target_seg) && !faces_visited.includes(current_tri.incidentEdge.next.oppo.incidentFace.id)){
					faces_visited.push(current_tri.id);
					fill_triangle(canvas, vert1, vert2, vert3, 'gray');
					current_tri=current_tri.incidentEdge.next.oppo.incidentFace;
				} else if (intersect(seg31, target_seg) && !faces_visited.includes(current_tri.incidentEdge.next.next.oppo.incidentFace.id)){
					faces_visited.push(current_tri.id);
					fill_triangle(canvas, vert1, vert2, vert3, 'gray');
					current_tri=current_tri.incidentEdge.next.next.oppo.incidentFace;
				}
			}
		}
	});
}

function setup_segment_location(mesh, canvas) {
	console.log("Hello from setup_segment_location");
	draw_mesh(mesh, canvas);
	nodes=[];
	let target_tri;
	canvas.addEventListener("click", (e) =>{
		const rect = canvas.getBoundingClientRect();
    	const x = e.clientX - rect.left;
    	const y = e.clientY - rect.top;
    	pos = [x, y];

		//Selection of the arbitrary triangle
		let current_tri = mesh.faces[0];
		const first_vertex_pos_x = (current_tri.incidentEdge.orig.pos[0] +  current_tri.incidentEdge.dest.pos[0] + current_tri.incidentEdge.next.dest.pos[0])/3;
		const first_vertex_pos_y = (current_tri.incidentEdge.orig.pos[1] +  current_tri.incidentEdge.dest.pos[1] + current_tri.incidentEdge.next.dest.pos[1])/3;
		const first_vertex_pos=[first_vertex_pos_x, first_vertex_pos_y];
		

		//Marching Triangle algorithm
		let faces_visited=[];
		const target_seg = [first_vertex_pos, pos];
		let init=true;

		if (nodes.length===0){
			while(init){
				const vert1 = current_tri.incidentEdge.orig.pos;
				const vert2 = current_tri.incidentEdge.dest.pos;
				const vert3 = current_tri.incidentEdge.next.dest.pos;
	
				if (isInside(vert1, vert2, vert3, pos)){
					init=false;
					target_tri=current_tri;
				}
	
				else {
					const seg12 = [vert1, vert2];
					const seg23 = [vert2, vert3];
					const seg31 = [vert3, vert1];
	
					if (intersect(seg12, target_seg) && !faces_visited.includes(current_tri.incidentEdge.oppo.incidentFace.id)){
						faces_visited.push(current_tri.id);
						current_tri=current_tri.incidentEdge.oppo.incidentFace;
					} else if (intersect(seg23, target_seg) && !faces_visited.includes(current_tri.incidentEdge.next.oppo.incidentFace.id)){
						faces_visited.push(current_tri.id);
						current_tri=current_tri.incidentEdge.next.oppo.incidentFace;
					} else if (intersect(seg31, target_seg) && !faces_visited.includes(current_tri.incidentEdge.next.next.oppo.incidentFace.id)){
						faces_visited.push(current_tri.id);
						current_tri=current_tri.incidentEdge.next.next.oppo.incidentFace;
					}
				}
			}
		}

		draw_point(canvas, x,y, 'red');
		nodes.push(pos);

		if (nodes.length === 2){
			const new_target = [nodes[0], nodes[1]];
	
			let new_faces=[];
			init=true;

			while(init){
				const vert1 = target_tri.incidentEdge.orig.pos;
				const vert2 = target_tri.incidentEdge.dest.pos;
				const vert3 = target_tri.incidentEdge.next.dest.pos;
	
				if (isInside(vert1, vert2, vert3, pos)){
					draw_point(canvas, x,y, 'red');
					init=false;
				}
	
				else {
					const seg12 = [vert1, vert2];
					const seg23 = [vert2, vert3];
					const seg31 = [vert3, vert1];
	
					if (intersect(seg12, new_target) && !new_faces.includes(target_tri.incidentEdge.oppo.incidentFace.id)){
						new_faces.push(target_tri.id);
						target_tri=target_tri.incidentEdge.oppo.incidentFace;
						compute_intersection(seg12, new_target, canvas);
					} else if (intersect(seg23, new_target) && !new_faces.includes(target_tri.incidentEdge.next.oppo.incidentFace.id)){
						new_faces.push(target_tri.id);
						target_tri=target_tri.incidentEdge.next.oppo.incidentFace;
						compute_intersection(seg23, new_target, canvas);
					} else if (intersect(seg31, new_target) && !new_faces.includes(target_tri.incidentEdge.next.next.oppo.incidentFace.id)){
						new_faces.push(target_tri.id);
						target_tri=target_tri.incidentEdge.next.next.oppo.incidentFace;
						compute_intersection(seg31, new_target, canvas);
					}
				}
				
			}
			draw_edge(nodes[0], nodes[1], canvas, 'red')
			nodes.pop();
			nodes.pop();
	

		}

	});

}

function compute_intersection(seg1, seg2, canvas){
	const x1 = seg1[0][0] ; const y1 = seg1[0][1];
	const x2 = seg1[1][0] ; const y2 = seg1[1][1];
	const x3 = seg2[0][0] ; const y3 = seg2[0][1];
	const x4 = seg2[1][0] ; const y4 = seg2[1][1];

	const den = (x2 - x1) * (y4 - y3) - (x4 - x3) * (y2 - y1);
    const tolerance_1 = 100;
    const tolerance_2 = 1e-6;

    if (Math.abs(den) > 100 || Math.abs(den) < -100) {   // If lines are not parallel
		const ua = ((x4 - x3) * (y1 - y3) - (x1 - x3) * (y4 - y3)) / den;
		const ub = ((x2 - x1) * (y1 - y3) - (x1 - x3) * (y2 - y1)) / den;

		if (ua > 0 && ua < 1 && ub > 0 && ub < 1) {  // If lines are not coincident
			const x_intersect = x1 + ua * (x2 - x1);
			const y_intersect = y1 + ua * (y2 - y1);

			draw_point(canvas, x_intersect, y_intersect, "green");
		}
	}
}

function create_mesh(mesh_data) {    //mesh_data = mesh_small.json
	// Initialize the mesh data structure
	mesh = {
		nodes : [],
		faces : [], 
		edges : []
	};

	node_data = mesh_data.Nodes[0];
	elem_data = mesh_data.Elements[1];

	// Create nodes

	for ( i = 0 ; i<node_data.Indices.length ; i++){
		mesh.nodes.push( {
			id: node_data.Indices[i],
			pos: node_data.Coordinates[i]
		})
	}

	// Create faces and half edges
	nodePairToEdge = {};
	for (i = 0 ; i< elem_data.Indices.length ; i++){
		mesh.faces.push( {
			id: elem_data.Indices[i],
			incidentEdge: null 
		})

		// Create 3 half_edges in the triangle
		const shape = elem_data.NodalConnectivity[0].length;

		for (j = 0 ; j<shape ; j++){
			origin = elem_data.NodalConnectivity[i][j];
			destination = elem_data.NodalConnectivity[i][(j+1)%shape];
			mesh.edges.push( {
				incidentFace: mesh.faces[i],
				orig: mesh.nodes[origin],
				dest: mesh.nodes[destination],
				next:null,
				oppo: null,
				
			})

			nodePairToEdge[mesh.nodes[origin].id.toString() + "_" + mesh.nodes[destination].id.toString()]=mesh.edges[shape*i+j];
		}

		// Determine the connectivity of the half-edges
		mesh.edges[shape*i].next=mesh.edges[shape*i+1];
		mesh.edges[shape*i+1].next=mesh.edges[shape*i+2];
		mesh.edges[shape*i+2].next=mesh.edges[shape*i];

		mesh.faces[i].incidentEdge = mesh.edges[shape*i];

	}

	for (let i = 0; i < mesh.edges.length; i++) {
		const e = mesh.edges[i];
		e.oppo = nodePairToEdge[e.dest.id.toString() + "_" + e.orig.id.toString()];
	}

	return mesh;
}

function draw_mesh(mesh, canvas) {
	size_adapt(canvas, mesh.nodes, offset=5);

	// Draw triangles
	context = canvas.getContext('2d');
	context.strokeStyle = "black";
	for (face of mesh.faces) {
		edge = face.incidentEdge;
		face_nodes = [edge.orig.pos, edge.dest.pos, edge.next.dest.pos];
		context.beginPath();
		context.moveTo(face_nodes[0][0], face_nodes[0][1]);
		context.lineTo(face_nodes[1][0], face_nodes[1][1]);
		context.lineTo(face_nodes[2][0], face_nodes[2][1]);
		context.stroke();

		x_G = (face.incidentEdge.orig.pos[0]+face.incidentEdge.dest.pos[0]+face.incidentEdge.next.dest.pos[0])/3;
        y_G = (face.incidentEdge.orig.pos[1]+face.incidentEdge.dest.pos[1]+face.incidentEdge.next.dest.pos[1])/3;
        context.fillText(face.id.toString(), x_G, y_G);
        context.fillText(face.incidentEdge.orig.id.toString(), face.incidentEdge.orig.pos[0], face.incidentEdge.orig.pos[1]);
        context.fillText(face.incidentEdge.dest.id.toString(), face.incidentEdge.dest.pos[0], face.incidentEdge.dest.pos[1]);
        context.fillText(face.incidentEdge.next.dest.id.toString(), face.incidentEdge.next.dest.pos[0], face.incidentEdge.next.dest.pos[1]);
	}

}

function size_adapt(canvas, nodes, offset){
    // bounding box of the mesh
	let xMin = Number.MAX_VALUE;
	let yMin = Number.MAX_VALUE;
	let xMax = Number.MIN_VALUE;
	let yMax = Number.MIN_VALUE;
	for (node of nodes) {
		xMax = Math.max(xMax, node.pos[0]);
		xMin = Math.min(xMin, node.pos[0]);
		yMax = Math.max(yMax, node.pos[1]);
		yMin = Math.min(yMin, node.pos[1]);
	}
	const xRange = xMax - xMin;
	const yRange = yMax - yMin;
	const scale = Math.min(canvas.width/xRange, canvas.height/yRange);
    
    for (node of nodes)
        node.pos = transform(node.pos, scale, xMin, yMin, offset);

    return {scale:scale, xMin:xMin, yMin:yMin};
}

function transform(pos, scale, xMin, yMin, offset) {
    return [offset+(pos[0]-xMin)*scale, offset+(pos[1]-yMin)*scale];
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
    context.strokeStyle = "red";
    context.beginPath(); //Begins the segment
    context.moveTo(A[0], A[1]); //Coordinates at the begin of the segment
    context.lineTo(B[0], B[1]); //Coordinates at the end of the segment
    context.stroke() ; //Draws a line
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

function find_orientation(p1, p2, p3){  
	const o = (p2[1] - p1[1]) * (p3[0] - p2[0]) - (p2[0] - p1[0]) * (p3[1] - p2[1]);

	if (o==0) return 0; //collinear
	if (o<0) return 1; //counterclock wise
	return 2; //clock wise 
}

function intersect(seg1, seg2){
	const o1 = find_orientation(seg1[0], seg2[0], seg1[1]); 
	const o2 = find_orientation(seg1[0], seg2[0], seg2[1]);
	const o3 = find_orientation(seg1[0], seg2[1], seg1[1]);
	const o4 = find_orientation(seg1[1], seg2[0], seg2[1]);

	if (o1!=o3 && o2!=o4) return true;
	return false;
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
