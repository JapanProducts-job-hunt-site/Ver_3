[![Build Status](https://travis-ci.org/JapanProducts-job-hunt-site/Ver_3.svg?branch=master)](https://travis-ci.org/JapanProducts-job-hunt-site/Ver_3)

tada
# How to start

## Install all dependencies
```
npm install
```

## Start the server
```
npm start
```

# API List

```
POST /api/register      	/Student registration
POST /api/authenticate  	/Student authentication
PUT  /api/users	        	/Student update
PUT  /api/updatepassword	/Student update password
GET  /api/users	        	/Get all students
GET  /api/user	        	/Get one student by JWT
```

**Registration**
----
  Post email and password and return success message 

* **URL**

  /api/register

* **Method:**

  `POST`
  
*  **URL Params**

 
     None

* **Data Params**

   **Required:**
    `name=${name}&email=${email}&password=${password}`

* **Success Response:**

  * **Code:** 200 <br />
    **Content:** `{ success : ture }`
 
* **Error Response:**

  * **Code:** 400 BAD REQUEST <br />
    **Content:** `{ success : false,  error : "User doesn't exist" }`

  OR

  * **Code:** 401 UNAUTHORIZED <br />
    **Content:** `{ error : "You are unauthorized to make this request." }`

* **Sample Call:**

  ``javascript
    $.ajax({
      url: "/users/1",
      dataType: "json",
      type : "GET",
      success : function(r) {
        console.log(r);
      }
    });
  ```

## To create user (Sign up)

```
http://localhost:8080/api/register
```
Send this
 * POST
 * application/x-www-form-urlencoded
 * Required properties
	 * username (Unique)
	 * password
	 * email (Unique)

Return JSON file

true if authentication succseede 
false  if authentication did not succseede 


## To authentiate  user (Log in)

```
http://localhost:8080/api/authenticate
```

Send this
 * POST
 * application/x-www-form-urlencoded
 * username
 * password

Return JWT if authorization susscesful
 
## To update user information

```
PUT /api/users
```

Send this
 * PUT
 * application/update
 * JSON that contains key and value to be updated

Below JSON will update user's name to "Updated name" and password "Updated password"
``` 
{
  "user": {
    "name":"Updated name",
    "password":"Updated password"
  }
}
``` 

Return updated user data in JSON if update susscesful

## To create an account for a company (Sign up)

```
http://localhost:8080/api/company/register
```
Send this
 * POST
 * application/x-www-form-urlencoded
 * Required properties
	 * username (Unique)
	 * password
	 * email (Unique)

Return JSON file

true if authentication succseede 
false  if authentication did not succseede 


## To authentiate a company's user account (Log in)

```
http://localhost:8080/api/company/authenticate
```

Send this
 * POST
 * application/x-www-form-urlencoded
 * username
 * password

Return JSON web token if authorization susscesful
## To Get User information (can be used for profile/dashboard page) 

```
http://localhost:8080/api/user
```

Send this in *Header*

x-access-token:JSON web token

return 
User JSON object


## To Check Payload of JWT

```
http://localhost:8080/api/check
```

Send this in *Header*

x-access-token:JSON web token

return 
Decoded Payload such as userinformation


## To Show all users

```
http://localhost:8080/api/users
```

Send this in *Header*

x-access-token:JSON web token

## To Search Students
This route is used to send the query request to API
```
http://localhost:8080/api/search
```

For example, below searchs users whose username is bbbb
```
http://localhost:8080/api/search?username=bbbb
```

Send this in *Header*

x-access-token:JSON web token


# Pages to make 

## Landing page for student

* Sign up
* Sign in
* Explanation about the web site for students 
(Example: Show the list of companies registered)

## Landing page for company

* Sign up
* Sign in
* Explanation about the web site for companies
(Example: Show the price comparing to going to Boston career forum)

## Profile page for student

* User can see their profile
* User can edit their profile

## Profile page for company

* User can see their profile
* User can edit their profile

## Dashboard page for students

* User can see the notification of offer from companies

## Dashboard page for company

* List of job information user made
 ***More detail required***

## Search page for students to search companies

* Student can search companies and their job postings
* Student can click on each job post and see more details

## Search page for company to search students

* Companies can search students 
* Companies can click on each student and go to their profile page
* Companies can click the button to notify students that they are interested

# Database schema
# Homescreens
