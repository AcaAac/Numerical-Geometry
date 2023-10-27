# Triangle and Segment Location in a Mesh

This code provides two functions, `setup_triangle_location` and `setup_segment_location`, to interact with a mesh and determine the location of a point or a segment in the mesh.

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
