# Yoga Class Enrollment Form Backend
This Node.js Application is the Backend for the Yoga Class Enrollment Form Frontend (https://stereogon.github.io/yoga-class-enrollment-form/). 
Frontend Repo Link: https://github.com/stereogon/yoga-class-enrollment-form
# Technologies Used 
## Backend
Node.js and Express.js
## Database
Mongodb (Hosted on Mongodb Atlas)


This Application is hosted at https://yoga-class-enrollment-form-server.onrender.com

# API Endpoints
## POST /users/enroll-user
Request Type: POST\
Payload: \
{\
   &nbsp;&nbsp;firstName,\
   &nbsp;&nbsp;lastName,\
   &nbsp;&nbsp;age,\
   &nbsp;&nbsp;gender: {\
     &nbsp;&nbsp;&nbsp;&nbsp;label,\
     &nbsp;&nbsp;&nbsp;&nbsp;value\
   &nbsp;&nbsp;},\
   &nbsp;&nbsp;mobile,\
   &nbsp;&nbsp;month (MM-YYYY),\
   &nbsp;&nbsp;batch: {\
     &nbsp;&nbsp;&nbsp;&nbsp;label,\
     &nbsp;&nbsp;&nbsp;&nbsp;startHour,\
     &nbsp;&nbsp;&nbsp;&nbsp;endHour,\
     &nbsp;&nbsp;&nbsp;&nbsp;value,\
     &nbsp;&nbsp;&nbsp;&nbsp;AMPM\
   &nbsp;&nbsp;}\
}
### Steps
1. Checks for the presence of the batch in the database. If the batch info is found, it is retrieved. 
2. If the batch does not exist, The batch is created and stored in the database. its info is then retrieved from the database.
3. Checks for the presence of the user in the database. If the user is found, it is retrieved.
4. If the User does not exist, The User is Created and stored in the database and its info is then retrieved from the database.
5. If there is any error while creating the user, Error is thrown with the required info.
6. All the previous enrollment records of the user are retrieved from the database.
7. If there is an unpaid enrollment, an error is thrown with the required info.
8. The month and the batch together are used to retrieve the required program from the database.
9. if no such program exist, the program is created with the month and batch info.
10. the program info is then retrieved.
11. the user info and the program info are then used to create a new enrollment.
 
## GET /users/get-enrolls/:mobile
Request Type: GET\
Request Paramenter: Mobile No.\
Response: \
{\
  &nbsp;&nbsp;data: [\
  &nbsp;&nbsp;&nbsp;&nbsp;{\
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;_id,\
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;program: {\
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;_id,\
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;month,\
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;batch: {\
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;_id,\
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;batchId,\
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;startHour,\
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;endHour,\
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;AMPM\
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}\
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;},\
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;user,\
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;isPaid\
  &nbsp;&nbsp;&nbsp;&nbsp;},\
  &nbsp;&nbsp;&nbsp;&nbsp;{...},\
  &nbsp;&nbsp;&nbsp;&nbsp;{...},\
  &nbsp;&nbsp;&nbsp;&nbsp; ...\
  &nbsp;&nbsp;],
  
  &nbsp;&nbsp;user: {\
  &nbsp;&nbsp;&nbsp;&nbsp;_id,\
  &nbsp;&nbsp;&nbsp;&nbsp;firstName,\
  &nbsp;&nbsp;&nbsp;&nbsp;lastName,\
  &nbsp;&nbsp;&nbsp;&nbsp;age,\
  &nbsp;&nbsp;&nbsp;&nbsp;gender,\
  &nbsp;&nbsp;&nbsp;&nbsp;mobile\
  &nbsp;&nbsp;}\
}

if the mobile number in the request parameters does not match with any registered mobile number, an error is thrown with the required info.
## POST /users/pay-enroll/:enrollmentId
Request Type: POST\
Resquest Parameter: EnrollmentId\
Payload: \
{\
&nbsp;&nbsp;cardHolder,\
&nbsp;&nbsp;cardNo,\
&nbsp;&nbsp;cvv,\
}

### Steps
1. Finds the Enrollment using the Enrollment Id, in the database.
2. Passes the Billing info to the CompletePayment() Function.
3. Complete Payment Function returns True or False depending upon whether the payment was done or not.
4. The Function is Programmed to Behave like an actual banking system. It completes the payment 80% of time.
5. If the Payment is not complete, an error is thrown with the required info.
6. If the payment is complete, the database info of the enrollment is updated.
7. This update is then shown on the frontend.

# Database Design
![drawSQL-export-2022-12-15_18_31](https://user-images.githubusercontent.com/64136587/208084612-370e853b-f79d-403e-a626-bfcc256406c9.png)


## Batches
Every batch has a starttime and an endtime.

## Programs
A Month can have different programs (month + batch) eg. October 'A' Batch, October 'B' Batch, etc. This makes Month + Batch a candidate key for the relation. **There will be a One to Many Relation between month and batch**. Although it is not very well shown in the diagram.

## Users
A user is anyone who enrolls in a program. A user is uniquely identified by the mobile phone number. There is a **Many to Many Relation between Programs and Users**.

# Assumptions
1. User can only enroll in the current month or the next month's programs. Because it does not make sense to take enrollments for future programs without the surity that they will happen.
2. User does not have to pay at the time of the enrollment.
3. The User cannot Enroll in another program if he/she already have an unpaid program.
4. 1 Mobile Phone = 1 User Enrollment For lifetime. (Just Like Aadhar Cards).
