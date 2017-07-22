[![Build Status](https://travis-ci.org/JapanProducts-job-hunt-site/Ver_3.svg?branch=master)](https://travis-ci.org/JapanProducts-job-hunt-site/Ver_3)

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


