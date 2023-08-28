# Automated Carpark

A demonstration of an automated carpark web application for parkers to manage their carpark subscription with an integrated automated license plate recognition system.

Supported Features:
- [x] Multi-tenanted license plate management
- [x] Stripe API billing & subscription management
- [x] SmartParking API integration for license plate synchronisation
- [x] Administrative panel

## Repo structure

* `/client` - React.js frontend
* `/server` - Express.js backend

## Architecture

See [architecture.md](/ARCHITECTURE.md).

## Stack

### Frontend

* React.js
* Bootstrap UI
* Redux state management

### Backend

* Node.js
* Express.js
* PostgreSQL + Sequlize.js ORM

### Infrastructure

* AWS Elastic Beanstalk
* AWS SES

## Improvements
* Add TypeScript support
* Add unit (Jest) & E2E (Cypress) tests
* Better use of dependency inversion in server

## Credits

**NB: Excerpted and adapted from a 2018 Project for [innovationcarpark.co.nz](https://innovationcarpark.co.nz)**
