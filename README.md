![README Banner](/images/readme_banner.jfif)
# ETL: Bob Ross and the Joy of Coding  
This API allows users to explore the extensive work of Bob Ross' *The Joy of Painting* by filtering episodes by their preferred color palette, subject, and month of the year.  

It is a RESTful API built with Node.js, Express.js, and PostgreSQL. It utilizes a PostgreSQL database for data storage, with provided scripts for setup and population.  

## Setup Instructions  
Once the necessary prerequisites and dependencies are installed from the package.json file, make sure to create an .env file with this information:  
```env
# .env
DB_HOST=localhost
DB_PORT=5432
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=bob_ross
```
To set up the database, run the following SQL script. Make sure to replace *your-username* and *your-database-name* with the correct values.
```
psql -U <your-username> -d <your-database-name> -f scripts/db_scripts/init.sql
```
Then, to populate the database, run the five *populate_* scripts found in db_scripts. Each of these will populate its associated table in the database. For example, to populate the *colors* table, run:  
```
python3 scripts/db_scripts/populate_colors.py
```
Repeat for the other table scripts.  
## Using the API 
The API runs locally at  
```
http://localhost:3000
```
All requests to the API should begin with this.
### Endpoints
#### 1. List All Episodes
* Endpoint: */episodes*
* Method: GET
* Description: Returns all episodes with metadata
* Example: ```GET /episodes```
* Expected Result:
```
{
        "id": 1,
        "episode_code": "S01E01",
        "title": "A Walk in the Woods",
        "air_date": "1983-01-11T06:00:00.000Z",
        "month": 1,
        "year": 1983
    },
    {
        "id": 2,
        "episode_code": "S01E02",
        "title": "Mount McKinley",
        "air_date": "1983-01-11T06:00:00.000Z",
        "month": 1,
        "year": 1983
    },
```
#### 2. List all Subjects
* Endpoint: */subjects*
* Method: GET
* Description: Returns all subjects with corresponding ID
* Example: ```GET /subjects```
* Expected Result:
  ```
    {   "id": 1,
        "subject_name": "APPLE_FRAME"
    },
    {
        "id": 2,
        "subject_name": "AURORA_BOREALIS"
  ```
#### 3. List all Colors
* Endpoint: */colors*
* Method: GET
* Description: Returns all colors with ID and hex_value
* Example: ```GET /colors```
* Expected Result:
```
{
        "color_id": 1,
        "color_name": "Alizarin Crimson",
        "hex_value": "#4E1500"
    },
    {
        "color_id": 9,
        "color_name": "Black Gesso",
        "hex_value": "#000000"
    },
```
#### 4. Filter Episodes by Month
* Endpoint: */episodes*
* Method: GET
* Query Parameter: month
* Example: ```GET /episodes?month=April```
* Description: Returns all episodes that aired during month entered as parameter
* Expected Result:
```
{
        "id": 105,
        "episode_code": "S09E01",
        "title": "Winter Evergreens",
        "air_date": "1986-04-30T05:00:00.000Z",
        "month": 4,
        "year": 1986
    },
    {
        "id": 144,
        "episode_code": "S12E01",
        "title": "Golden Knoll",
        "air_date": "1987-04-29T05:00:00.000Z",
        "month": 4,
        "year": 1987
    },
```
#### 5. Filter Episodes by Subject
* Endpoint: */episodes*
* Method: GET
* Query Parameter: subject
* Example: ```GET /episodes?subject=Bridge```
* Description: Returns all episodes containing subject entered as parameter
* Expected Result:
```
{
        "id": 32,
        "episode_code": "S03E06",
        "title": "Covered Bridge",
        "air_date": "1984-02-08T06:00:00.000Z",
        "month": 2,
        "year": 1984
    },
    {
        "id": 121,
        "episode_code": "S10E04",
        "title": "Secluded Bridge",
        "air_date": "1986-09-24T05:00:00.000Z",
        "month": 9,
        "year": 1986
    },
```
#### 6. Filter Episodes by Color
* Endpoint: */episodes*
* Method: GET
* Query Parameter: color
* Example: ```GET /episodes?color=Dark Sienna```
* Description: Returns all episodes using color entered as parameter
* Expected Result:
```
{
        "id": 79,
        "episode_code": "S07E01",
        "title": "Winter Cabin",
        "air_date": "1985-10-02T05:00:00.000Z",
        "month": 10,
        "year": 1985
    },
    {
        "id": 80,
        "episode_code": "S07E02",
        "title": "Secluded Lake",
        "air_date": "1985-10-09T05:00:00.000Z",
        "month": 10,
        "year": 1985
    },
```
## Running the App
To start the server, run the following:  
```node app.js```  
The server will run at ```http://localhost:3000```. Use Postman or a browser to test the endpoints.
