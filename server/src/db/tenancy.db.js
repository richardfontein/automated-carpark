import Tenancy from './models/Tenancy';
import Plate from './models/Plate';
import db from '../config/database';
import { AuthorizationError, NotFoundError } from '../status/clientErrorCodes';
import { getDelta } from './util';
import {
  CreatedResource,
  RetrievedResource,
  UpdatedResource,
  DeletedResource,
} from '../status/successCodes';

export const getAllTenancies = async () =>
  Tenancy.findAll().then(
    tenancies => new RetrievedResource(tenancies.map(tenancy => tenancy.get())),
  );

export const getTenancies = async userId =>
  Tenancy.findAll({ where: { userId } }).then(
    tenancies => new RetrievedResource(tenancies.map(tenancy => tenancy.get())),
  );

export const getTenancy = async id =>
  Tenancy.findByPk(id).then((tenancy) => {
    if (!tenancy) {
      throw new NotFoundError('Tenancy does not exist');
    }

    return new RetrievedResource(tenancy.get());
  });

export const createTenancy = async data =>
  Tenancy.create(data, { include: [Plate] })
    .then(createdTenancy => Tenancy.findByPk(createdTenancy.id))
    .then(retrievedCreatedTenancy => new CreatedResource(retrievedCreatedTenancy.get()));

export const updateTenancy = async data =>
  Tenancy.findByPk(data.id).then(async (tenancy) => {
    // Check that tenancy exists
    if (!tenancy) {
      throw new NotFoundError('Tenancy does not exist');
    }

    // Check that user owns tenancy
    if (data.userId !== tenancy.userId) {
      throw new AuthorizationError('User unauthorized');
    }

    // Begin SQL transaction, rolls back any changes if an update fails
    return db
      .transaction(async (transaction) => {
        // Find plate delta (added and deleted plates)
        const plateDelta = getDelta(tenancy.plates, data.plates, 'registration');

        // Update plates individually, because calling update on parent model
        // does not update associated models
        await Promise.all([
          ...plateDelta.added.map(async plate =>
            Plate.create({ tenancyId: data.id, ...plate }, { transaction })),
          ...plateDelta.deleted.map(async plate => plate.destroy({ transaction })),
        ]);

        // Finally, update tenancy
        return tenancy.update(data);
      })
      .then(updatedTenancy => Tenancy.findByPk(updatedTenancy.id))
      .then(retrievedUpdatedTenancy => new UpdatedResource(retrievedUpdatedTenancy.get()));
  });

export const deleteTenancy = async (tenancyId, userId) =>
  Tenancy.findByPk(tenancyId).then(async (tenancy) => {
    // Check that tenancy exists
    if (!tenancy) {
      throw new NotFoundError('Tenancy does not exist');
    }

    // Check that user owns tenancy
    if (userId !== tenancy.userId) {
      throw new AuthorizationError('User unauthorized');
    }

    // Delete tenancy
    return tenancy.destroy().then(() => new DeletedResource());
  });
