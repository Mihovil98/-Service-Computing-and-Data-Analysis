# Communities and Crime

## Description

The main functionality of this web application is to deliver crime rate prediction results based on entered values. A full description of the attribute being predicted is 'Total number of violent crimes per 100000 popuation'.

The project relies on prediction algorithms enabled through the Azure ML service, and the model is exposed as a web service, and the client application uses the realized service.

The web application server uses the web service and provides the web application GUI with several routes such as sending values and returning responses from the web service, saving the predicted result, retrieving all saved results, and deleting an individual saved result.

## Setup

The web application can be setup locally using the Node.js environment and the Express.js framework for creating a local server, as well as the Apache module and the MySQL tool XAMPP for creating a local database.

![XAMPP](https://user-images.githubusercontent.com/74960514/186097525-bebd3154-114b-4763-9983-93423fc51e22.png)

![Server start](https://user-images.githubusercontent.com/74960514/186097554-8a9945d2-b5c0-4f64-a32b-7b538a22da93.png)

## Conclusion

The created web application cannot find a direct application in the real world because the data set used is not contemporary but from the 1990s. Nevertheless, it serves as a good example of using a prediction service based on known data. The user interface is intuitive and there is no downtime because all (known) errors have been processed.

Some of the further possibilities of expanding this web application are filtering and sorting saved results, creating more complex visualizations, providing your own API service, public hosting.
