# Mesh and Triangulation Exercises

This code provides a collection of exercises and functions designed to enhance understanding of mesh structures, Delaunay triangulations, and segment interactions in a mesh. The exercises are implemented using HTML canvas elements, with interactive features to visualize mesh structures and triangulation algorithms.

## Table of Contents

- [Exercise 1: Canvas1 - Delaunay Triangulations and Intersection Detection](#exercise-1-canvas1)
- [Exercise 2: Canvas2 - Mesh Display and Triangle Interaction](#exercise-2-canvas2)
- [Triangle and Segment Location in a Mesh](#triangle-and-segment-location-in-a-mesh)
  - [setup_triangle_location](#setup_triangle_location)
  - [setup_segment_location](#setup_segment_location)

## Exercise 1: Canvas1 - Delaunay Triangulations and Intersection Detection

### Overview

In this exercise, users interact with "canvas1" by clicking to create red dots. The system automatically draws line segments between every two consecutive dots and detects intersections.

### Features

- **User Interaction:** Clicking on "canvas1" creates red dots, adding a new dot with every click.
- **Segment Drawing:** Each pair of consecutive clicks results in a line drawn between the dots.
- **Intersection Detection:** When two line segments intersect, a green dot appears at the intersection point.
- **Coincident Lines:** Yellow lines indicate coincident (parallel and overlapping) line segments.

### Instructions

1. **Run the Code:**
   - Ensure the code is executed in a browser environment.
   - "canvas1" must be available as an HTML canvas.

2. **User Interaction:**
   - Click on "canvas1" to draw red dots.
   - Green dots will appear at the intersection points of every two consecutive line segments.
   - Yellow lines will appear for coincident line segments.

### Bonus Points

A bonus function, `zoomWheel`, is available for zooming using the mouse wheel. To enable zooming:

- **Integration (Bonus):**
  - Integrate the `zoomWheel` function into the main code.
  - Call `zoomWheel` when the mouse wheel is scrolled.

---

## Exercise 2: Canvas2 - Mesh Display and Triangle Interaction

### Overview

In this exercise, "canvas2" is used to display a simple mesh consisting of triangular elements. Users can interact with the mesh by clicking inside the triangles.

### Features

- **Mesh Display:** "canvas2" visualizes a simple triangular mesh.
- **Point and Triangle Interaction:** Clicking inside any triangle adds a red dot at the clicked location and colors the triangle green.

### Instructions

1. **Run the Code:**
   - Ensure the code is executed in a browser environment.
   - "canvas2" must be available as an HTML canvas.

2. **User Interaction:**
   - Click inside a triangle on "canvas2" to:
     - Add a red dot at the clicked location.
     - Color the selected triangle green.

---

## Triangle and Segment Location in a Mesh

This section describes two functions, `setup_triangle_location` and `setup_segment_location`, which provide more advanced visualization features by interacting with the mesh.

### setup_triangle_location

This function allows the visualization of the Marching Triangles algorithm to identify the triangle containing a point in the mesh.

### Features

- **Mesh Display:** Displays the mesh with its triangles on an HTML canvas.
- **Point Location:** When you click on the canvas:
  1. An arbitrary triangle in the mesh is selected.
  2. The Marching Triangles algorithm is used to find the triangle containing the clicked point.
  3. If the point is inside a triangle, the triangle is filled with green color, and the target point is marked with a red dot.
  4. A line is drawn from the target point to the arbitrary vertex.
  5. Any crossed half-edges are painted yellow for clear visualization.

---

### setup_segment_location

This function allows the visualization of a segment intersection with the mesh using the Marching Triangles algorithm.

### Features

- **Mesh Display:** Displays the mesh on an HTML canvas.
- **Segment Intersection:** When you click on the canvas:
  1. Select an arbitrary triangle in the mesh.
  2. The Marching Triangles algorithm is used to find the triangle containing the first clicked point, which marks the starting point of the segment.
  3. The first point is marked with a red dot.
  4. A second click creates the segment by connecting the two points, and intersections with the mesh are calculated and displayed.
  5. Any crossed half-edges are painted blue for clear visualization.
- **Process Continuation:** The process continues as you add more segments and calculate their intersections with the mesh.

---

## Instructions for Both Triangle Functions

1. **Run the Code:**
   - Ensure the code is executed in a browser environment.
   - Both functions work on an HTML canvas that displays a mesh.

2. **User Interaction:**
   - For `setup_triangle_location`, click on the mesh to identify the triangle containing the clicked point.
   - For `setup_segment_location`, click twice on the mesh to define a segment and visualize its intersections with the mesh.

---

This repository provides a comprehensive set of tools to interact with mesh structures, triangulations, and segment locations, all implemented with interactive HTML canvas elements. These exercises and functions are ideal for learning and visualizing important concepts in computational geometry and mesh manipulation.
