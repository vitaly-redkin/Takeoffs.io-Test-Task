This project is a test assignment for Takeoffs.io

The application allows user to create a "takeoff" by submiting a file and then 
to review and modify extracted floor plans and tiled areas.

The application consists of two parts:
- Back-end part (server folder) is a REST API which uses Python 3, Flask framework with Flask-RESTful and MongoDB to store the data.
- Front-end part (client folder) is a SPA application created with React 16 and Typescript.

## Back-end

To run the back-end use this command line in the server folder: 
```sh
python api.py
```

It launches Flask web server usually accessible on http://localhost:5000.


To run the back-end tests use this command line in the server folder: 

```sh
python tests.py
```

It runs a comprehensive test suite for app API endpoints.

**Warning: each test starts with recreating the MondoDB database - so if you have something of a value there please change the database name in the configuration before running the tests.**

You can configure the back-end by editing config.py file. You can set the MongoDB connection string (you can use a local server or a MongoDB Atlas cloud based server - but this last one will be sloooow), MongoDB database name and the folder to look for the test files in. Please note only PNG files from this folder will be used.

The back-end uses PyMongo MongoDB driver and PIL image manipulation library.

## Front-end

The front end is a React application created with the create-react-app (CRA) script so all usual shell commands are available to run the application:

- `npm start`
Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

- `npm test`
Launches the test runner in the interactive watch mode.

- `npm run build`
Builds the app for production to the `build` folder.

**Warning: the front-end has no unit tests save for a "smoke test" created by the CRA. There are two reasons for this: a) lack of time; b) most of the UI manipulations are done with mouse and produce binary images so it would be hard to properly check the results. While writing the tests is not impossible I considered it to be redundant for the scope of the test task.**

The front-end can be configured (used .env file) to use a non-standard API host address.

The front-end uses reactstrap package (Bootsrtap wrapper) for styling, react-router package to navigate through application pages and lodash package for debouncing.

**Warning: I considered using Redux for this application and finally decided against it because writing all Redux-specific boilerplate code was not justified in this particular case. There is no application state shared between components so we do not really need a central store for this state. That said, I would probably use Redux anyway if this code was not a test task but "for real" - the new requirements could be added later and it is better to have an extensible architecture from the start.**

**Warning: The application code uses (to a limited scope) a component inheritance (there are couple od "base" components which provide a common functionality for their ancestors. I know such inheritance is considered as a "lower form of life" in the React adept circles but in this particular case it works just fine and I did not have time to invent a way to use a composition over the inheritance.**

## Application Workflow

- The first page presented to user is a "Create Takeoff" one. User can select an image file (PNG, GIF or JPEG) with the floor plan and submit it.

**Warning: As I understand in the real life you work with PDF files and each PDF file contains a floor plan image. I do not have an access to such files and my first thought was to allow the user submitting any PDF file and then convert each PDF page into an image. The problem is 
I was not able to find a Python PDF library which can convert PDF pages into images and not being a wrapper for some platform specific binary code. Since I intend to finally deploy this app to Heroku (or some other cloud platform) I prefer to avoid such binary dependencies. Extracting images from PDF was another posibility but the code examples I tried were not 100% reliable. So I finally decided to allow submitting an image file and creating four "pages" for each image by simply rotating it by 0, 90, 180 and 270 degrees.**

Since we are working with images and storing them into the database this database size may became quite significant. This is especially important if we use a cloud-based MongoDB server. Since it is a test task and the data has no value for anybody I provided a functionality to clean up the database - use it with caution, though, there is no "rollback".

- When the plan file is submitted a new takeoff is created (on the back-end side). Each takeoff has four pages (see above about rotating an original image) and each page has two bboxes. For each page/bbox a floor plan is generated with tiled mask (the tiled mask is 1 bit PNG image of the same size as the floor plan). All this generation is done synchronously on the server and for large images may take some time (it would not be the case in the real application, of course). The geometry of generated bboxes and masks is very simple - just some rectangles to cover a significant part of an original image.

- When the takeoff is generated user is redirected to the Takeoff Status page. This page shows status (a dummy one!) of the takeoff processing. The back-end code creates two steps ('Extracting Floor Plans' and 'Calculating Tiled Areas') and emulates their delayed processing. The Status page shows each step status and, if the step is completed, a button to redirect to the next page. The page auto-refresh itself (until all steps are completed).

- The "Floor Plan List" page shows the takeoff pages (again - just four rotating images in this case) with predefined bboxes. User can add new bboxes (by dragging a rectangle) or delete them (by clicing on the (X) icon in the top right corner). The back-end endpoint to update the page bboxes is called right away (no "Save Changes" button). 

- The "Tiled Area List" page shows all floor plans (8 of them - 2 plans for each of 4 pages) with the semi-transparent mask over the tiled area. You can add to this mask by dragging a rectangle without any key pressed, or you can subtract from the mask by dragging a rectangle holding Alt key pressed. The back-end endpoint to update the tiled mask is called right away (no "Save Changes" button).

**Warning: I generate an updated tiled mask image on the front-end using Canvas. Unfortunately, I cannot make canvas to generate 1 bit B&W PNGs (they are always 24 bit color ones) so I convert the color tiled mask PNGs sent from the client to B&W PNGs on the server.**

- The last page is a "takeoff Complete" one. This is just a dummy page without any logic - just to make the workflow look completed.

## Some Optimization Thoughts

- The provided Architecture document required to send the Base64 encoded image content in JSON. It makes "natural" to (but not requires to) save the images in the database. I think it may cause some problems in the real application - the images could be quite large. If I have my way I would consider storing the images as files (or in the RDBMS BLOB fields, or in GridFS, etc.) and having a special API endpoint to send the image content. The "main" GET API end point JSON would just return the URL to use as an HTML image src attribute. I understand the client will have to make 1+N requests to the server but I believe the overal performance would be better anyway.

- I slightly "enhanced" the PUT API endpoint calls by adding a second parameter (:page_number or :floor_plan_number) to allow updating bboxes/tiled_mask of a particular page/floor plan instead of sending them all at once (it does not make sense since the user works on one image at one moment of time).

## Possible Code Enhancements

- It would be natural (from the real application logic point of view) to regenerate floor plans for the page with changed bboxes when this bboxes are saved. It is not very hard to do with the suggested database structure but I considered it to be out of scope for this task. Please let me know if you think otherwise.

- Components for the floor plan list and tiled area list and - especially - for the floor plan and tiled are have quite a lot of almost indentical code (I used copy/paste when creating them). It is possible (and I would definitely do this in the real life) to create some base classes for them or use a composition but due to the time constraints I left them as they are for now.
