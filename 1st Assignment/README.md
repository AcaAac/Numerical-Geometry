
# HOMEWORK 1 - LMECA2170 - GROUP 17


## Overview : 

The following code implements 2 different exercises on a HTML canvas.
Exercise 1 is implemented on "canvas1", top of the screen, while Exercise 2 is implemented on "canvas2", bottom of the screen.
The goal of both exercises was to increase the group's sensibility and awarness of how simple triangulations and meshes work.


## Exercise 1:

- ***User Interaction***: Clicking on "canvas1" creates red dots, with each click adding a dot.
- ***Segment Drawing***: Every two clicks result in a line drawn between two consecutive red dots.
- ***Intersection Detection***: If a pair of lines (formed by every two segments) intersects, a green dot appears at the intersection point.
- ***Coincident Lines***: If the lines are coincident (degenerate case), a yellow line indicates the coincidence.

## Exercise 2:

- ***Mesh Display***: "canvas2" displays a simple mesh with triangular elements (with the numbers of the nodes and triangles as well).
- ***Point and Triangle Interaction*** : Clicking inside a triangle on "canvas2" adds a red dot at the clicked location and colors the triangle green.

## Instructions

***1. Run the Code***:

 - Ensure the code is executed in a browser environment.
 - Two HTML canvas elements, "canvas1" and "canvas2," are required.

***2. Exercise 1 - "canvas1"***:

 - Click on "canvas1" to draw red dots and form line segments.
 - Green dots appear at the intersection points of every two consecutive line segments.
 - Yellow lines indicate coincident parallel lines.

***3. Exercise 2 - "canvas2"***:

 - "canvas2" displays a mesh with triangular elements.
 - Click inside a triangle to:
   - Add a red dot at the clicked location.
   - Color the triangle green.


## Bonus points

A bonus function named zoomWheel is available for zooming using the mouse wheel. To enable zooming:

- ***Integration (Bonus)***:
  - Integrate the zoomWheel function into the main code.
  - Call zoomWheel when the mouse wheel is scrolled.
   
***Note***: Ensure that the HTML structure and necessary mesh data are provided for the code to execute correctly.
