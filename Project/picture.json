import cv2
import json
import numpy as np

# Load the image
image = cv2.imread('path_to_your_image.jpg')

# Convert to grayscale
gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

# Apply Canny edge detection
edges = cv2.Canny(gray, threshold1=30, threshold2=100)

# Find coordinates of the edges
points = np.column_stack(np.where(edges > 0))

# Convert to a list of lists and scale down (if necessary)
scaled_points = points.tolist()

# Convert to JSON format
json_data = json.dumps({"points": scaled_points})

# Save to a JSON file
with open('bear_points.json', 'w') as json_file:
    json_file.write(json_data)
