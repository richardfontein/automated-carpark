import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import Sequelize from 'sequelize';

import User from './models/User';
import { BadRequestError, NotFoundError } from '../status/clientErrorCodes';
import { CreatedResource, RetrievedResource, UpdatedResource } from '../status/successCodes';

const SALT_ROUNDS = 12;
const TOKEN_BYTES = 20;
const TOKEN_ENCODING = 'hex';
const TOKEN_EXPIRY = 3600000; // in milliseconds - 1 hour

export const createUser = async data =>
  User.findOne({
    where: { email: data.email },
  }).then(async (user) => {
    if (user) {
      throw new BadRequestError('User already exists with that email', 'email');
    }

    return bcrypt
      .hash(data.password, SALT_ROUNDS)
      .then(hash =>
        User.create({
          ...data,
          password: hash,
        }))
      .then(createdUser => User.findByPk(createdUser.id))
      .then(userWithoutPassword => new CreatedResource(userWithoutPassword.get()));
  });

export const getUser = async id =>
  User.findByPk(id).then((user) => {
    if (!user) {
      throw new NotFoundError('No user found with that id', 'user');
    }

    return new RetrievedResource(user.get());
  });

export const getUsers = async () =>
  User.findAll().then(users => new RetrievedResource(users.map(user => user.get())));

export const getUserByStripeCustomerId = async stripeCustomerId =>
  User.findOne({ where: { stripeCustomerId } }).then((user) => {
    if (!user) {
      throw new NotFoundError('No user found with that id', 'user');
    }

    return new RetrievedResource(user.get());
  });

export const getUserByEmail = async email =>
  User.findOne({ where: { email } }).then((user) => {
    if (!user) {
      throw new NotFoundError('No user found with that id', 'user');
    }

    return new RetrievedResource(user.get());
  });

export const updateUser = async (data) => {
  if (data.email) {
    // Check that email is not already in use by another user
    const userCheck = await User.findOne({
      where: { id: { [Sequelize.Op.not]: data.id }, email: data.email },
    });

    if (userCheck) {
      throw new BadRequestError('User already exists with that email', 'email');
    }
  }

  return User.findByPk(data.id)
    .then(user => user.update(data))
    .then(updatedUser => new UpdatedResource(updatedUser.get()));
};

export const updatePassword = async data =>
  User.findByPk(data.id, { attributes: ['id', 'password'] }).then(user =>
    bcrypt.compare(data.currentPassword, user.password).then(async (isMatch) => {
      // Password does not match
      if (!isMatch) {
        throw new BadRequestError('Incorrect password', 'currentPassword');
      }

      return bcrypt
        .hash(data.newPassword, SALT_ROUNDS)
        .then(hash => user.update({ password: hash }))
        .then(() => new UpdatedResource());
    }));

export const updatePasswordToken = async data =>
  User.findOne({
    where: { email: data.email },
    attributes: { include: ['resetPasswordToken', 'resetPasswordExpires'] },
  }).then((user) => {
    if (!user) {
      throw new BadRequestError('No user registered with that email', 'email');
    }

    const resetPasswordToken = crypto.randomBytes(TOKEN_BYTES).toString(TOKEN_ENCODING);
    const resetPasswordExpires = Date.now() + TOKEN_EXPIRY;

    return bcrypt
      .hash(resetPasswordToken, SALT_ROUNDS)
      .then(hash => user.update({ resetPasswordToken: hash, resetPasswordExpires }))
      .then(updatedUser => ({ ...updatedUser.get(), resetPasswordToken }));
  });

export const resetPassword = async data =>
  User.findOne({
    where: { email: data.email },
    attributes: ['id', 'email', 'resetPasswordToken', 'resetPasswordExpires'],
  }).then((user) => {
    if (!user) {
      throw new BadRequestError('No user registered with that email', 'email');
    }

    if (Date.now() > user.resetPasswordExpires) {
      // Token has expired
      throw new BadRequestError(
        'Token expired... Try requesting a new password reset email',
        'resetPasswordToken',
      );
    }

    return bcrypt.compare(data.resetPasswordToken, user.resetPasswordToken).then((isMatch) => {
      // Token does not match
      if (!isMatch) {
        throw new BadRequestError(
          'Invalid token... Try requesting a new password reset email',
          'resetPasswordToken',
        );
      }

      return bcrypt
        .hash(data.password, SALT_ROUNDS)
        .then(hash =>
          user.update({ password: hash, resetPasswordToken: null, resetPasswordExpires: null }))
        .then(updatedUser => User.findByPk(updatedUser.id))
        .then(userWithoutPassword => new CreatedResource(userWithoutPassword.get()));
    });
  });
