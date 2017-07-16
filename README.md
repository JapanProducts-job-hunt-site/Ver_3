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
 * username
 * passport

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
 * passport

Return JSON web token if authorization susscesful
 
## To show all users

```
http://localhost:8080/api/users
```

Send this in *Header*

x-access-token:JSON web token


