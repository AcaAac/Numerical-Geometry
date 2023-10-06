
# HOMEWORK 1 - LMECA2170 - GROUP 17


## Overview : 

The following code implements 2 different exercises on a HTML canvas.
Exercise 1 is implemented on "canvas1", top of the screen, while Exercise 2 is implemented on "canvas2", bottom of the screen.
The goal of both exercises was to increase the group's sensibility and awarness of how simple triangulations and meshes work.


## Exercise 1:

 - On the "canvas1" template a user can click as many times with his/her mouse creating a red dot
 - Every 2 clicks a line is created between 2 red dots, meaning that every 4 clicks there are 2 lines drawn
 - Should the pair of the 2n lines, n = {1,2,3,...}, intersect a green dot is drawn at the intersection point of the lines
 - If they do not intersect, then no green dot is shown
 - The group also implemented the degenerate case where the 2n lines are coincident. If this happens, a yellow line appears indicating the coincident parallel lines

## Exercise 2:

 - The "canvas2" displays a simple mesh with its triangles/nodes numbers
 - Every click inside one of the triangles of the mesh  displays a red dot, indicating the location where the user clicked, and colors the triangle where the point is located inside of with the color green
