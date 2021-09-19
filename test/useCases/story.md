# Story: Renting a car

# Use case 1
As a system user
in order to get an available car in a specific category
Given a car category containing 3 different cars, when I check if there's a car available, 
Then it should choose randomly a car from the category chosen

# Use case 2
As a system user
In order to calculate the final renting price

Given a custumer who wants to rent a car for 5 days

and he is 50 yrs old
when he chooses a car category that costs $37.6 per day

Then I must add the Tax of his age which is 30% to the car category price

Then the final formula will be: ((price_per_day * Tax) * number_of_days)

And the final result will be ```((37.6*1.3)*5)= 244.4```

And the final price will be printed in Brazillian Portuguese format as "R$ 244,40"

# Use case 3

As a system user

In order to register a renting transaction

Given a rengistered customer who is 50yrs old

And a car model that costs $37.6 per day

And a delivery date that is 05 days behind

And given an actual date 05/11/2020

When I rent a car I should see the customer data

And the car selected

And the final price will be R$ 244,40

And DueDate which will be printed in Brazillian Portuguese format "10 de Novembro de 2020"
