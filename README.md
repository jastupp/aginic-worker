#Worker

The worker module will read a URL 
to from the database. The URL will be tested 
and the results published back to the datatbase.
Each of the tests is transactional and stateless, 
therefore you can spawn as many workers as needed 
ensuring each test will be carried out once and only 
once.

##Usage

The worker requires four parameters.

### Parameters
- MYSQL_HOST={ mysql hostname } 
- MYSQL_USERNAME={ mysql username } 
- MYSQL_PASSWORD={ mysql password } 
- MYSQL_DATABASE={ mysql database } 

example...
```bash 
MYSQL_HOST=localhost \
MYSQL_USERNAME=myser \
MYSQL_PASSWORD=mypassword \
MYSQL_DATABASE=aginic \
npm start
```

