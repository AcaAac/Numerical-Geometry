# Triangle and Segment Location in a Mesh

This code provides three functions,`create_mesh` ,  `setup_triangle_location` and `setup_segment_location`, to interact with a mesh and determine the location of a point or a segment in the mesh.

## `create_mesh`

Builds a mesh with the following structure : 

   - mesh.nodes : an array of nodes with the structure :
         - node.id : a unique integer identifying the node
         - node.pos : a pair of coordinates representing the position of the
           node.
   - mesh.faces : an array of faces; a face has structure
         – face.id: a unique integer identifying the face (use the indices given in the JSON file),
         – face.incidentEdge: one (!) edge that is incident to face, i.e., has face on its left side.
   -  mesh.edges: an array of (half-)edges; an edge has structure :
         -  edge.orig: the origin node of the half-edge,
         – edge.dest: the destination node of the half-edge,
         – edge.incidentFace: the face to the left of the half-edge,
         – edge.next: the next half-edge on the boundary of the incident
           face,
         – edge.oppo: the opposite half-edge.

## `setup_triangle_location`

Allows for the visualization of the developed Marching Triangles algorithm. 

1. It displays the mesh on an HTML canvas.
2. When you click on the canvas, the code performs the following steps:
   - Selects an arbitrary triangle in the mesh.
   - Uses the Marching Triangle algorithm to find the triangle containing the clicked point.
   - If the point is inside a triangle, it fills the triangle with green color, draws a line between the target point and the arbitrary vertex, and marks the target point as red.
   - To display the half-edges in a pretty way, it paints every crossed half-edge in yellow.

## `setup_segment_location`

Allows for the visualization of a segment intersection with the mesh, also using the Marching Triangles algorithm.

1. It displays the mesh on an HTML canvas.
2. When you click on the canvas, the code performs the following steps:
   - Selects an arbitrary triangle in the mesh.
   - Uses the Marching Triangle algorithm to find the triangle containing the first clicked point, which will be the starting point of the segment.
   - Marks the starting point as red.
   - When you click a second time, it determines the segment by connecting the two clicked points in red and calculates the intersections of this segment with the mesh. 
   - To display the half-edges in a pretty way, it paint every crossed half-edge in blue.
3. The process continues until you have two points and the code calculates and displays the intersections of the segment with the mesh.

## Mesh Visualization

Both functions also display the mesh with triangles and their vertices on an HTML canvas. The triangles are drawn with their IDs and vertex IDs.

## Marching Triangle Algorithm 

The algorithm used to detect in which triangle the user clicked works as follows : 

 1. It creates a segment between the barycentric coordinates of an arbitrary triangle and the position of the click of the user.
 2. It checks if the target point is in the triangle. If not, from this arbitrary triangle, it travels every half-edge and detects if it intersects with the segment previously created.
 4. If it intersects, then it evolves in the triangle associated with opposite half-edge and if it doesn't, it travels to the next half-edge of the current triangle.
 5. The algorithm ends when the target point is in the current triangle.
