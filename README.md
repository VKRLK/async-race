test task for EPAM lab
https://vkrlk.github.io/async-race/

project's checklist

Basic Structure (80 points)
✅ Two Views (10 points): Implement two primary views: "Garage" and "Winners".
✅ Garage View Content (30 points): The "Garage" view must display:
Name of view
Car creation and editing panel
Race control panel
Garage section
✅ Winners View Content (10 points): The "Winners" view should display:
Name of view ("Winners")
Winners table
Pagination
✅ Persistent State (30 points): Ensure the view state remains consistent when navigating between views. This includes preserving page numbers and input states. For example, page number shouldn't be reset, input controls should contain that they contained before switching, etc.

Garage View (90 points)
✅ Car Creation And Editing Panel. CRUD Operations (20 points): Enable users to create, update, and delete cars. A car has two attributes: "name" and "color". Empty and too long names should be handled. For "delete"-operation car should be deleted from "garage" table as well as from "winners".
✅ Color Selection (10 points): Allow color selection from an RGB palette (like here), displaying the selected color on the car's image along with its name.
✅ Random Car Creation (20 points): There should be a button to create random cars (100 cars per click). Name should be assembled from two random parts, for example "Tesla" + "Model S", or "Ford" + "Mustang" (At least 10 different names for each part). Color should be also generated randomly.
✅ Car Management Buttons (10 points): Provide buttons near each car's image for updating its attributes or deleting it.
✅ Pagination (10 points): Implement pagination for the "Garage" view, displaying 7 cars per page.
EXTRA POINTS (20 points):
Empty Garage Handle empty garage with user friendly message "No Cars" or something like this. Do it at your discretion.
Empty Garage Page If you remove the last one car on the page, you should be moved on the previous page, to hide the empty one.
