const circumcircleCenters = [];

// Gift Wrapping Algorithm
function gift_wrapping(nodes) {
    const n = nodes.length;
    if (n < 3) return nodes; // Convex hull is not possible with less than 3 points

    // Find the point with the lowest y-coordinate (and leftmost if ties)
    let pivot = nodes[0];
    for (let i = 1; i < n; i++) {
        if (nodes[i][1] < pivot[1] || (nodes[i][1] === pivot[1] && nodes[i][0] < pivot[0])) {
            pivot = nodes[i];
        }
    }

    // Sort the points based on polar angle with respect to the pivot
    nodes.sort((a, b) => {
        const angleA = Math.atan2(a[1] - pivot[1], a[0] - pivot[0]);
        const angleB = Math.atan2(b[1] - pivot[1], b[0] - pivot[0]);

        if (angleA < angleB) return -1;
        if (angleA > angleB) return 1;

        // If angles are the same, prioritize the closest point
        const distanceA = Math.hypot(a[0] - pivot[0], a[1] - pivot[1]);
        const distanceB = Math.hypot(b[0] - pivot[0], b[1] - pivot[1]);

        return distanceA - distanceB;
    });

    // Initialize the convex hull
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

// Function to create a super triangle outside the convex hull
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

// Your existing main_processing function remains the same
function main_processing(nodes, canvas) {
    const ctx = canvas.getContext("2d");

    // Draw points
    nodes.forEach(point => {
        ctx.beginPath();
        ctx.arc(point[0] * canvas.width, (1 - point[1]) * canvas.height, 3, 0, 2 * Math.PI);
        ctx.fillStyle = "blue";
        ctx.fill();
        ctx.closePath();
    });

    // Find the convex hull using the modified gift_wrapping function
    const convexHull = gift_wrapping(nodes);
    console.log("Convex hull:", convexHull);

    // Draw convex hull edges
    ctx.beginPath();
    ctx.moveTo(convexHull[0][0] * canvas.width, (1 - convexHull[0][1]) * canvas.height);
    for (let i = 1; i < convexHull.length; i++) {
        ctx.lineTo(convexHull[i][0] * canvas.width, (1 - convexHull[i][1]) * canvas.height);
    }
    ctx.closePath();

    ctx.strokeStyle = "red";
    ctx.stroke();

    // Call createSuperTriangle to get the super triangle
    const superTriangle = createSuperTriangle(convexHull);
    console.log("Super triangle:", superTriangle);

    // Draw super triangle edges
    ctx.beginPath();
    for (let i = 0; i < superTriangle.length; i++) {
        ctx.moveTo(superTriangle[i][0] * canvas.width, (1 - superTriangle[i][1]) * canvas.height);

        // Connect each point to every vertex of the super triangle
        // nodes.forEach(point => {
        //     ctx.lineTo(point[0] * canvas.width, (1 - point[1]) * canvas.height);
        //     ctx.moveTo(superTriangle[i][0] * canvas.width, (1 - superTriangle[i][1]) * canvas.height);
        // });
    }
    ctx.closePath();

    ctx.strokeStyle = "green"; // You can change the color to your preference
    ctx.stroke();


    // Perform Bowyer-Watson algorithm to create Delaunay triangulation
    let triangulation = [superTriangle];
    console.log("Initial triangulation:", triangulation);
    console.log("Triangulation length:", triangulation.length);

    // Iterate over each point and add it to the triangulation
    nodes.forEach(point => {
        let badTriangles = [];
        let newTriangles = [];
        console.log("Current point is:", point);

        // Find triangles that are no longer valid with the new point
        for (let i = triangulation.length - 1; i >= 0; i--) {
            const triangle = triangulation[i];
            console.log("Current triangle is:", triangle);
            if (pointInsideCircumcircle(point, triangle)) {
                console.log("Point inside circumcircle:", point, triangle);
                badTriangles.push(triangle);
                console.log("Bad triangles read from circumcircle:", badTriangles);
                triangulation.splice(i, 1);
            }
        }

        // Create new triangles using the edges of the removed bad triangles
        for (let i = 0; i < badTriangles.length; i++) {
            console.log("Bad triangle read from 2nd loop:", badTriangles[i]);
            const edges = getEdges(badTriangles[i]);
            edges.forEach(edge => {
                const oppositeTriangle = findOppositeTriangle(edge, badTriangles);
                if (oppositeTriangle) {
                    const newTriangle = [edge[0], edge[1], point];
                    newTriangles.push(newTriangle);
                }
            });
        }

        triangulation = triangulation.concat(newTriangles);
    });

    // Draw Delaunay triangulation edges
    ctx.beginPath();
    triangulation.forEach(triangle => {
        for (let i = 0; i < triangle.length; i++) {
            const vertex = triangle[i];
            ctx.lineTo(vertex[0] * canvas.width, (1 - vertex[1]) * canvas.height);
        }
        ctx.closePath();
    });

    ctx.strokeStyle = "black"; // You can change the color to your preference
    ctx.stroke();
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
    for (let i = 0; i < triangles.length; i++) {
        const triangle = triangles[i];
        if (
            (triangle[0] !== edge[0] && triangle[0] !== edge[1]) &&
            (triangle[1] !== edge[0] && triangle[1] !== edge[1]) &&
            (triangle[2] !== edge[0] && triangle[2] !== edge[1])
        ) {
            return triangle;
        }
    }
    return null;
}

// Your existing orientation_2 function remains the same
function orientation_2(p, q, r) {
    const val = (q[1] - p[1]) * (r[0] - q[0]) - (q[0] - p[0]) * (r[1] - q[1]);
    if (val === 0) return 0; // collinear
    return (val > 0) ? 1 : 2; // clock or counterclockwise
}