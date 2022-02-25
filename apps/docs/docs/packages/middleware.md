---
sidebar_position: 2
---

# @calatrava/middleware

The middleware in this package is used directly within your lambda endpoints. They are here to make some of the repetetive tasks easier to deal with. Such tasks might include token validation, wrapping dynamodb tables with the custom datawrapper, and more.

## Middleware

Individually callable middleware that ship with the package are:

- [getTables](#gettables)
- [getUser](#getuser)
- [getUserTeams](#getuserteams)
- [isValidRequest](#isvalidrequest)
- [logDatabase](#logdatabase)
- [getPresignedPost](#getpresignedpost)

### getTables

This middleware is responsible for wrapping the `arc.tables()` helper and crafting the relevant DynamoDB queries. It will add a prop to the request object called tables with a getter that takes in a Type param as well as a Table name value.

It is included in the default route template.

### getUser

This middleware is responsible for validating the JWT token in the header and fetching a user associated with it. It will return an 401 error if either of those steps fail.

The user object is then placed on the request object for use inside of routes.

It is included in the default route template.

### getUserTeams

This middleware is responsible for fetching teams that relate to the user from the getUser middleware. So, it must be called after the getUser middleware.

The request object will be decorated with props for `ownedTeams` and `joinedTeams`.

Not all apps will need this functionality so it is not included in the default route template.

### isValidRequest

This middleware uses the `zod` schemas that are generated via the `scaffold` cli command.

It ensures that a POST request body matches the generated schema from your request interfaces since interfaces are not available at runtime after compilation.

It is a higher order function to which you must pass one of the schemas as an argument.

### logDatabase

This middleware is meant for debugging purposes. It will `console.log` the entire database after doing a scan.

WARNING: This can be an expensive operation in a production environment. Use at your own risk or for local development only.

### getPresignedPost

This middleware creates a presignedPost request for uploading to Amazon S3.

Not all apps will need this, but any that allow user uploads will want to make use of presignedPost rather than presignedUrl to be able to limit the file size a user can upload.

It looks for a fileSize property on an incoming POST request.

## Repository

The repository can be found at https://github.com/cmgriffing/calatrava/tree/main/packages/middleware
