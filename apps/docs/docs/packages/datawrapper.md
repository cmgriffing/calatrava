---
sidebar_position: 1
---

# @calatrava/datawrapper

The datawrapper package is responsible for handling queries to the underlying DynamoDB table. It is heavily reliant on a single table data structure but it still supports multiple tables in the event you need TTL or other extra Dynamo functionality.

## Details

The datawrapper is used within the `getTables` middleware.

A single table data structure is preferred in many cases. Here are some articles that explain the reasoning:

- https://aws.amazon.com/blogs/compute/creating-a-single-table-design-with-amazon-dynamodb/
- https://www.alexdebrie.com/posts/dynamodb-single-table/

## Architect

The data wrapper is an opinionated wrapper around the `arc.tables()` method that allows for type safety. You can read more about the `arc.tables()` helper in the Architect documentation: https://arc.codes/docs/en/reference/runtime-helpers/node.js

Note: No direct link available to the `arc.tables()` function.

## Repository

The repository can be found at https://github.com/cmgriffing/calatrava/tree/main/packages/datawrapper
