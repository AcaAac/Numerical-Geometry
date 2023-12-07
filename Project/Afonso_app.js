const circumcircleCenters = [];

let triangulation = []; // Initialize triangulation array

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

function main_processing(nodes, canvas) {
    const ctx = canvas.getContext("2d");

    // Draw nodes
    nodes.forEach(point => {
        ctx.beginPath();
        ctx.arc(point[0] * canvas.width, (1 - point[1]) * canvas.height, 3, 0, 2 * Math.PI);
        ctx.fillStyle = "blue";
        ctx.fill();
        ctx.closePath();
    });

    // Calculate and draw convex hull
    const convexHull = gift_wrapping(nodes);
    console.log("Convex hull:", convexHull);

    // ctx.beginPath();
    // ctx.moveTo(convexHull[0][0] * canvas.width, (1 - convexHull[0][1]) * canvas.height);
    // for (let i = 1; i < convexHull.length; i++) {
    //     ctx.lineTo(convexHull[i][0] * canvas.width, (1 - convexHull[i][1]) * canvas.height);
    // }
    // ctx.closePath();

    // ctx.strokeStyle = "red";
    // ctx.stroke();

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

    // Draw final triangulation
    ctx.beginPath();
    triangulation.forEach(triangle => {
        ctx.moveTo(triangle[0][0] * canvas.width, (1 - triangle[0][1]) * canvas.height);
        triangle.forEach(vertex => {
            ctx.lineTo(vertex[0] * canvas.width, (1 - vertex[1]) * canvas.height);
        });
        ctx.lineTo(triangle[0][0] * canvas.width, (1 - triangle[0][1]) * canvas.height);
    });
    ctx.strokeStyle = "yellow";
    ctx.stroke();
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