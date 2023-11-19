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

    // Find the convex hull using the super_triangle function
    const convexHull = gift_wrapping(nodes);
    console.log("Convex hull:", convexHull);
    // Draw super triangle edges
    ctx.beginPath();
    ctx.moveTo(convexHull[0][0] * canvas.width, (1 - convexHull[0][1]) * canvas.height);
    for (let i = 1; i < convexHull.length; i++) {
        ctx.lineTo(convexHull[i][0] * canvas.width, (1 - convexHull[i][1]) * canvas.height);~
        console.log("Convex length:", convexHull.length);
    }
    // Close the path with the first vertex to complete the super triangle
    ctx.lineTo(convexHull[0][0] * canvas.width, (1 - convexHull[0][1]) * canvas.height);
    ctx.closePath();
    
    ctx.strokeStyle = "red";
    ctx.stroke();
}



function orientation_2(p, q, r) {
    const val = (q[1] - p[1]) * (r[0] - q[0]) - (q[0] - p[0]) * (r[1] - q[1]);
    if (val === 0) return 0; // collinear
    return (val > 0) ? 1 : 2; // clock or counterclockwise
}


function gift_wrapping(points) {
    const n = points.length;
    if (n < 3) {
        console.error("Gift wrapping requires at least 3 points.");
        return null;
    }

    // Find the leftmost point
    let leftmost = 0;
    for (let i = 1; i < n; i++) {
        if (points[i][0] < points[leftmost][0]) {
            leftmost = i;
        }
    }

    let hull = [];
    let p = leftmost, q;
    do {
        hull.push(p);
        q = (p + 1) % n;
        for (let i = 0; i < n; i++) {
            if (orientation_2(points[p], points[i], points[q]) === 2) {
                q = i;
            }
        }
        p = q;
    } while (p !== leftmost);

    // Extract the points in the hull
    const hullPoints = hull.map(index => points[index]);

    // Find the bounding box of the hull points
    const minX = Math.min(...hullPoints.map(point => point[0]));
    const minY = Math.min(...hullPoints.map(point => point[1]));
    const maxX = Math.max(...hullPoints.map(point => point[0]));
    const maxY = Math.max(...hullPoints.map(point => point[1]));

    // Create the super triangle using the bounding box
    const superTriangle = [
        [minX - 1, minY - 1],
        [maxX + 1, minY - 1],
        [(minX + maxX) / 2, maxY + 1]
    ];

    return superTriangle;
}

// function gift_wrapping(points) {
//     const n = points.length;
//     if (n < 3) {
//         console.error("Gift wrapping requires at least 3 points.");
//         return null;
//     }

//     // Find the leftmost point
//     let leftmost = 0;
//     for (let i = 1; i < n; i++) {
//         if (points[i][0] < points[leftmost][0]) {
//             leftmost = i;
//         }
//     }

//     let hull = [];
//     let p = leftmost, q;
//     do {
//         hull.push(p);
//         q = (p + 1) % n;
//         for (let i = 0; i < n; i++) {
//             if (orientation_2(points[p], points[i], points[q]) === 1) {
//                 q = i;
//             }
//         }
//         p = q;
//     } while (p !== leftmost);

//     // Extract the points in the hull
//     const hullPoints = hull.map(index => points[index]);

//     // Find the bounding box of the hull points
//     const minX = Math.min(...hullPoints.map(point => point[0]));
//     const minY = Math.min(...hullPoints.map(point => point[1]));
//     const maxX = Math.max(...hullPoints.map(point => point[0]));
//     const maxY = Math.max(...hullPoints.map(point => point[1]));

//     // Create the super triangle using the bounding box
//     const superTriangle = [
//         [minX, minY],
//         [maxX, minY],
//         [(minX + maxX) / 2, maxY]
//     ];

//     return superTriangle;
// }


