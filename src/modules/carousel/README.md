# Summary

This carousel module shall handle all carousel cases for this site.

## Example config

```php
  // Example data
  $data = [
    ['copy' => 'Lorem ipsum dolor sit amet'],
    ['copy' => 'Lorem ipsum dolor sit amet'],
    ['copy' => 'Lorem ipsum dolor sit amet']
  ];

  the_module('carousel', array(
    'class' => 'modifier--class',
    'title' => 'Header Title',
    'copy' => 'Header Copy',
    'spacing' => 75,
    'slides_per_view' => 3,
    'loop' => true,
    'navigation' => true,
    'pagination' => true,
    'init_at_breakpoint' => 'lg',
    'cards' => array_map(function ($list) { // Loops over all items in $data array
      return get_module('testimonial-card', $list); // $list is an item of the $data array
    }, $data)
  ));
```

## Inclusion

This module is used on the following templates and sections:

- hero-carousel

- job-listing
  - Use 1 slide per view here with pagination and hero as the card

- homepage
  - Use 1 slide per view here with pagination and hero as the card

- about-us

- why-us

- legal-finance
  - Use ***init_at_breakpoint*** for this module

- account-dashboard
  - Use ***init_at_breakpoint*** for this module

## Parameters

This modules accepts the follwing arguments:

- `$class` (type = string): Supplies class modifier to module
- `$title` (type = string): Header title
- `$copy` (type = string): Header Copy
- `$spacing` (type = int): Defines spacing between cards

  - Default is 0 if this variable is not defined

- `$slides_per_view` (type = int) - Defines how many slides shall appear in view

  - Default is 1 if this variable is not defined

- `$loop` (type = boolean) - Determines whether the carousel will loop or not
- `$navigation` (type = boolean) - Determines whether the carousel will have navigation or not
- `$pagination` (type = boolean) - Determines whether the carousel will have pagination or not
- `$init_at_breakpoint` (type = string) - Initializes carousel when window reaches the specified breakpoint max-width
  
  - `options`: ['sm', 'md', 'lg', 'xl']

- `$cards` (type = array) - An array of modules that are supplied with the get_module() function
