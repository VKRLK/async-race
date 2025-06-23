test task for EPAM lab

Application is running at Github Pages here:
https://vkrlk.github.io/async-race/

🎯Project's checklist
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
✅Empty Garage Handle empty garage with user friendly message "No Cars" or something like this. Do it at your discretion.
✅Empty Garage Page If you remove the last one car on the page, you should be moved on the previous page, to hide the empty one.

Winners View (50 points)
✅ Display Winners (15 points): After some car wins it should be displayed at the "Winners view" table.
✅ Pagination for Winners (10 points): Implement pagination for the "Winners" view, with 10 winners per page.
✅ Winners Table (15 points): The table should include columns for the car's №, image, name, number of wins, and best time in seconds. If the same car wins more than once the number of wins should be incremented while best time should be saved only if it's better than the stored one.
✅ Sorting Functionality (10 points): Allow users to sort the table by the number of wins and best time, in ascending or descending order.

Race (170 points)
✅Start Engine Animation (20 points): User clicks to the engine start button near each car -> UI is waiting for car's velocity answer -> animate the car and makes another request to drive. In case api returned 500 error car animation should be stopped.
✅ Stop Engine Animation (20 points): User clicks to the engine stop button near each car -> UI is waiting for answer for stopping engine -> car returned to it's initial place.
✅ Responsive Animation (30 points): Ensure car animations are fluid and responsive on screens as small as 500px.
✅ Start Race Button (10 points): Start button should start the race for all cars on the current page.
✅ Reset Race Button (15 points): Reset button should return all cars to their starting positions.
🌟Winner Announcement (5 points): After some car finishes first user should see the message contains car's name that shows which one has won.
✅Button States (20 points): Start engine button should be disabled in case car is already in driving mode. As well as stop engine button should be disabled when car is on it's initial place.
✅Actions during the race (50 points): Control over actions during a running race. Such as, deleting or editing a car, changing a page or view. Adding new cars. You can block buttons and stop the race. The main thing is to ensure predictable operation of the application.

✅Prettier and ESLint Configuration (10 points)
✅Prettier Setup (5 points): Prettier is correctly set up with two scripts in package.json: format for auto-formatting and ci:format for checking issues.
🌟ESLint Configuration (5 points): ESLint is configured with the Airbnb style guide. A lint script in package.json runs ESLint checks. Configuration files should reflect strict TypeScript settings as per tsconfig.json.
