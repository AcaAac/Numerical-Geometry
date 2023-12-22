
function to_click(nodes, canvas, canvasBis){
    mesh=find_triangulation_mesh(nodes);
    draw_mesh(mesh, canvas);

    voronoi = generateVoronoiDiagram(mesh);
    drawVoronoiDiagram(voronoi,canvasBis);

    canvas.addEventListener('mousedown', (e)=>{
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        pos = [x/450, y/450, 0];

        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const ctx2 = canvasBis.getContext('2d');
        ctx2.clearRect(0,0, canvasBis.width, canvasBis.height);

        nodes.push(pos);
        //console.log('New nodes', nodes);
        mesh=find_triangulation_mesh(nodes);
        draw_mesh(mesh, canvas);

        voronoi = generateVoronoiDiagram(mesh);
        drawVoronoiDiagram(voronoi,canvasBis);
    })
}

function show_initial_mesh(nodes, canvas1, canvas2){
    mesh=find_triangulation_mesh(nodes);
    draw_mesh(mesh, canvas1);

    nodes.forEach(point => {
        draw_point(canvas2, point[0]*450, point[1]*450, 'blue');
    })

    voronoi = generateVoronoiDiagram(mesh);
    drawVoronoiDiagram(voronoi,canvas2);
}


function find_triangulation_mesh(nodes) {
    let triangulation = []; // Initialize triangulation array

    // Calculate and draw convex hull
    const convexHull = gift_wrapping(nodes);
    console.log("Convex hull:", convexHull);

    // Create super triangle
    const superTriangle = createSuperTriangle(nodes);
    console.log("Super triangle:", superTriangle);

    // Initialize triangulation with super triangle
    triangulation = [superTriangle];

    // Bowyer-Watson algorithm
    nodes.forEach(point => {
        let badTriangles = triangulation.filter(triangle => pointInsideCircumcircle(point, triangle));

        let polygonEdges = new Set();
        badTriangles.forEach(badTriangle => {
            getEdges(badTriangle).forEach(edge => {
                const edgeStr = JSON.stringify(edge.sort());
                if (polygonEdges.has(edgeStr)) {
                    polygonEdges.delete(edgeStr); // Remove edge if it's shared by another bad triangle
                } else {
                    polygonEdges.add(edgeStr); // Add edge if it's not shared
                }
            });
        });

        triangulation = triangulation.filter(triangle => !badTriangles.includes(triangle));

        polygonEdges.forEach(edgeStr => {
            const edge = JSON.parse(edgeStr);
            if (superTriangle.includes(edge[0]) || superTriangle.includes(edge[1])) {
                // Skip edges that are connected to the super triangle
                return;
            }
            const newTriangle = [edge[0], edge[1], point];
            triangulation.push(newTriangle);
        });
    });

    // Final clean-up: Remove all triangles that have any vertex from the super triangle
    triangulation = triangulation.filter(triangle => 
        !triangle.some(vertex => 
            superTriangle.some(superVertex => isSamePoint(vertex, superVertex))
        )
    );
    console.log("Final triangulation:", triangulation);

    mesh = create_mesh(triangulation, nodes);
    return mesh;
}

function gift_wrapping(nodes) {
    const n = nodes.length;
    if (n < 3) return nodes;

    let pivot = nodes[0];
    for (let i = 1; i < n; i++) {
        if (nodes[i][1] < pivot[1] || (nodes[i][1] === pivot[1] && nodes[i][0] < pivot[0])) {
            pivot = nodes[i];
        }
    }

    nodes.sort((a, b) => {
        const angleA = Math.atan2(a[1] - pivot[1], a[0] - pivot[0]);
        const angleB = Math.atan2(b[1] - pivot[1], b[0] - pivot[0]);

        if (angleA < angleB) return -1;
        if (angleA > angleB) return 1;

        const distanceA = Math.hypot(a[0] - pivot[0], a[1] - pivot[1]);
        const distanceB = Math.hypot(b[0] - pivot[0], b[1] - pivot[1]);

        return distanceA - distanceB;
    });

    const convexHull = [pivot, nodes[0]];
    let i = 1;

    while (i < n) {
        while (i < n - 1 && orientation_2(pivot, nodes[i], nodes[i + 1]) === 0) {
            i++;
        }
        convexHull.push(nodes[i]);
        i++;
    }

    return convexHull;
}

function createSuperTriangle(nodes) {
    const minX = Math.min(...nodes.map(point => point[0]));
    const maxX = Math.max(...nodes.map(point => point[0]));
    const minY = Math.min(...nodes.map(point => point[1]));
    const maxY = Math.max(...nodes.map(point => point[1]));

    const midX = (minX + maxX) / 2;
    const midY = (minY + maxY) / 2;

    const superTriangle = [
        [midX - 3 * (maxX - minX), midY - 3 * (maxY - minY)],
        [midX, midY + 3 * (maxY - minY)],
        [midX + 3 * (maxX - minX), midY - 3 * (maxY - minY)]
    ];

    return superTriangle;
}

function isSamePoint(p1, p2) {
    return p1[0] === p2[0] && p1[1] === p2[1];
}


function arraysEqual(arr1, arr2) {
    return arr1.every((value, index) => value === arr2[index]);
}


function calculateCircumcenter(triangle) {
    const [p1, p2, p3] = triangle;
    const ax = p2[0] - p1[0];
    const ay = p2[1] - p1[1];
    const bx = p3[0] - p1[0];
    const by = p3[1] - p1[1];
    const d = 2 * (ax * by - ay * bx);
    const ux = ((by * (ax * ax + ay * ay)) - (ay * (bx * bx + by * by))) / d + p1[0];
    const uy = ((ax * (bx * bx + by * by)) - (bx * (ax * ax + ay * ay))) / d + p1[1];
    return [ux, uy];
}

function calculateCircumradius(circumcenter, triangle) {
    const [cx, cy] = circumcenter;
    const [p1, p2, p3] = triangle;
    const radius = Math.sqrt((cx - p1[0]) ** 2 + (cy - p1[1]) ** 2);
    return radius;
}

function pointInsideCircumcircle(point, triangle) {
    const circumcenter = calculateCircumcenter(triangle);
    const radius = calculateCircumradius(circumcenter, triangle);

    const distanceToPoint = Math.sqrt((point[0] - circumcenter[0]) ** 2 + (point[1] - circumcenter[1]) ** 2);

    return distanceToPoint <= radius ? 1 : 0;
}

// Function to get the edges of a triangle
function getEdges(triangle) {
    return [
        [triangle[0], triangle[1]],
        [triangle[1], triangle[2]],
        [triangle[2], triangle[0]]
    ];
}

// Function to find the opposite triangle given an edge
function findOppositeTriangle(edge, triangles) {
    const [v1, v2] = edge;

    for (const triangle of triangles) {
        let matches = 0;
        for (const vertex of triangle) {
            if ((vertex[0] === v1[0] && vertex[1] === v1[1]) || 
                (vertex[0] === v2[0] && vertex[1] === v2[1])) {
                matches++;
            }
        }

        // If both vertices match, return the third vertex
        if (matches === 2) {
            return triangle.find(vertex => !(vertex[0] === v1[0] && vertex[1] === v1[1]) && 
                                           !(vertex[0] === v2[0] && vertex[1] === v2[1]));
        }
    }

    return null; // No opposite triangle found
}


// Your existing orientation_2 function remains the same
function orientation_2(p, q, r) {
    const val = (q[1] - p[1]) * (r[0] - q[0]) - (q[0] - p[0]) * (r[1] - q[1]);
    if (val === 0) return 0; // collinear
    return (val > 0) ? 1 : 2; // clock or counterclockwise
}


//Voronoi Diagram
function generateVoronoiDiagram(mesh) {
    centers=[]

    for (i in mesh.faces){
        face_edge = mesh.faces[i].incidentEdge
        p1 = face_edge.orig.pos
        p2 = face_edge.dest.pos
        p3 = face_edge.next.dest.pos

        center = calculateCircumcenter([p1, p2, p3])

        centers.push({
            pos : center,
            centerId : i, 
            incidentFace : mesh.faces[i], 
        }) 
    }
    console.log('Voronoi Diagram :', centers)
    return centers
}


function drawVoronoiDiagram(voronoiDiagram, canvas) {
    for (i in voronoiDiagram){
        center = voronoiDiagram[i].pos
        draw_point(canvas, center[0], center[1], 'red') 

        if (voronoiDiagram[i].incidentFace.incidentEdge.oppo!=null){
            oppositeCenter1 = voronoiDiagram[voronoiDiagram[i].incidentFace.incidentEdge.oppo.incidentFace].pos
            draw_edge(center, oppositeCenter1, canvas, 'red')
        }
        if (voronoiDiagram[i].incidentFace.incidentEdge.next.oppo!=null){
            oppositeCenter2 = voronoiDiagram[voronoiDiagram[i].incidentFace.incidentEdge.next.oppo.incidentFace].pos
            draw_edge(center, oppositeCenter2, canvas, 'red')
        }
        if (voronoiDiagram[i].incidentFace.incidentEdge.next.next.oppo!=null){
            oppositeCenter3 = voronoiDiagram[voronoiDiagram[i].incidentFace.incidentEdge.next.next.oppo.incidentFace].pos
            draw_edge(center, oppositeCenter3, canvas, 'red')
        }
    }

}

// Function to generate random colors
function getRandomColor() {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function draw_point(canvas, x, y, color){
    context = canvas.getContext('2d');
    context.beginPath();
    context.fillStyle = color;
    context.arc(x,y, 3, 0, 2*Math.PI);
    context.closePath();
    context.fill();
}

function create_mesh(triangulation, nodes){
    mesh = {
        nodes : [],
        faces : [], 
        edges : []
    };

    // Create nodes
    for ( i = 0 ; i<nodes.length ; i++){
        mesh.nodes.push( {
            id: i,
            pos: nodes[i]
        })
    }

    // Create faces and half edges
    nodePairToEdge = {};
    for (i = 0 ; i< triangulation.length ; i++){
        mesh.faces.push( {
            id: i,
            incidentEdge: null 
        })

        // Create 3 half_edges in the triangle
        const shape = triangulation[0].length;

        for (j = 0 ; j<shape ; j++){
            origin = nodes.findIndex(row => row.toString() === triangulation[i][j].toString());
            destination = nodes.findIndex(row => row.toString() === triangulation[i][(j+1)%shape].toString());
            mesh.edges.push( {
                incidentFace: i,
                orig: mesh.nodes[origin],
                dest: mesh.nodes[destination],
                next:null,
                oppo: null,

            })
            if (nodePairToEdge[mesh.nodes[origin].id.toString() + "_" + mesh.nodes[destination].id.toString()]!=null){
                nodePairToEdge[mesh.nodes[origin].id.toString() + "_" + mesh.nodes[destination].id.toString()]=mesh.edges[shape*i+j];
            } else {nodePairToEdge[mesh.nodes[destination].id.toString() + "_" + mesh.nodes[origin].id.toString()] = mesh.edges[shape*i+j];}
        }

        // Determine the connectivity of the half-edges
        for (j = 0; j < shape; j++) {
            mesh.edges[shape*i+j].next = mesh.edges[shape*i+(j+1)%shape];
        }

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
        context.lineTo(face_nodes[0][0], face_nodes[0][1]);
        context.stroke();

        x_G = (face.incidentEdge.orig.pos[0]+face.incidentEdge.dest.pos[0]+face.incidentEdge.next.dest.pos[0])/3;
        y_G = (face.incidentEdge.orig.pos[1]+face.incidentEdge.dest.pos[1]+face.incidentEdge.next.dest.pos[1])/3;
        //context.fillText(face.id.toString(), x_G, y_G);
        //context.fillText(face.incidentEdge.orig.id.toString(), face.incidentEdge.orig.pos[0], face.incidentEdge.orig.pos[1]);
        // context.fillText(face.incidentEdge.dest.id.toString(), face.incidentEdge.dest.pos[0], face.incidentEdge.dest.pos[1]);
        // context.fillText(face.incidentEdge.next.dest.id.toString(), face.incidentEdge.next.dest.pos[0], face.incidentEdge.next.dest.pos[1]);
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
    return [pos[0]*450, pos[1]*450];
}

function draw_edge(A,B,canvas, color){
    context = canvas.getContext('2d');
    context.strokeStyle = color;
    context.beginPath(); //Begins the segment
    context.moveTo(A[0], A[1]); //Coordinates at the begin of the segment
    context.lineTo(B[0], B[1]); //Coordinates at the end of the segment
    context.stroke();
}
