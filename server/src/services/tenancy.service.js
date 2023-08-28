import { tenancyDb, userDb } from '../db';
import * as smartParkingService from './smartparking.service';
import * as billingService from './billing.service';
import { tenancySchema } from '../schemas';
import { BadRequestError } from '../status/clientErrorCodes';
import { convertTzDate, AUCKLAND_IANTZ_CODE } from '../util';

export const getAllTenancies = async () => {
  try {
    return await tenancyDb.getAllTenancies();
  } catch (e) {
    throw e;
  }
};

export const getTenancies = async (userId) => {
  try {
    return await tenancyDb.getTenancies(userId);
  } catch (e) {
    throw e;
  }
};

export const getTenancy = async (id) => {
  try {
    return await tenancyDb.getTenancy(id);
  } catch (e) {
    throw e;
  }
};

export const startTenancy = async (tenancy, paymentBehaviour) => {
  try {
    const user = await userDb.getUser(tenancy.userId);
    if (user.corporateCarparks === 0) {
      await billingService.addSubscriptionItem(tenancy, paymentBehaviour);
    }

    if (tenancy.vehicleType !== 'Bicycle') {
      await smartParkingService.createLease(tenancy, user);
    }

    return await tenancyDb.updateTenancy({
      ...tenancy,
      subscriptionStarted: true,
      subscriptionEnded: false,
      paid: true,
    });
  } catch (e) {
    throw e;
  }
};

export const pauseTenancy = async (tenancy) => {
  try {
    if (tenancy.vehicleType !== 'Bicycle') {
      await smartParkingService.deleteLease(tenancy.id);
    }

    return await tenancyDb.updateTenancy({
      ...tenancy,
      subscriptionStarted: true,
      subscriptionEnded: false,
      paid: false,
    });
  } catch (e) {
    throw e;
  }
};

export const resumeTenancy = async (tenancy) => {
  try {
    if (tenancy.vehicleType !== 'Bicycle') {
      const user = await userDb.getUser(tenancy.userId);
      await smartParkingService.createLease(tenancy, user);
    }

    return await tenancyDb.updateTenancy({
      ...tenancy,
      subscriptionStarted: true,
      subscriptionEnded: false,
      paid: true,
    });
  } catch (e) {
    throw e;
  }
};

export const endTenancy = async (tenancy) => {
  try {
    const user = await userDb.getUser(tenancy.userId);
    if (user.corporateCarparks === 0) {
      await billingService.deleteSubscriptionItem(tenancy);
    }

    if (tenancy.vehicleType !== 'Bicycle') {
      await smartParkingService.deleteLease(tenancy);
    }

    return await tenancyDb.updateTenancy({
      ...tenancy,
      subscriptionStarted: true,
      subscriptionEnded: true,
      paid: false,
    });
  } catch (e) {
    throw e;
  }
};

export const createTenancy = async (tenancy) => {
  const today = convertTzDate(new Date(), AUCKLAND_IANTZ_CODE);
  let newTenancy;

  const user = await userDb.getUser(tenancy.userId);
  if (user.corporateCarparks !== 0) {
    const tenancies = await tenancyDb.getTenancies(tenancy.userId);

    if (tenancies.get().length + 1 > user.corporateCarparks) {
      throw new BadRequestError(
        'Allocated carparks exceeded. Please delete (expired) tenancies to add more.',
        'vehicleType',
      );
    }
  }

  // Create the tenancy in the database
  try {
    newTenancy = await tenancyDb.createTenancy(tenancy);
  } catch (e) {
    throw e;
  }

  // Start tenancy if start date is today
  if (newTenancy.startDate.getTime() === today.getTime()) {
    try {
      return await startTenancy(newTenancy.get());
    } catch (e) {
      // Roll back tenancy creation if error occurs during payment
      try {
        await tenancyDb.deleteTenancy(newTenancy.id, newTenancy.userId);
      } catch (error) {
        throw error;
      }
      throw e;
    }
  }

  return newTenancy;
};

export const updateTenancy = async (tenancy, role) => {
  const today = convertTzDate(new Date(), AUCKLAND_IANTZ_CODE);
  let validatedTenancy;

  // Check that startDate and endDate are valid
  try {
    const currentTenancy = await tenancyDb.getTenancy(tenancy.id);
    validatedTenancy = await tenancySchema
      .validate(tenancy, {
        context: { ...currentTenancy.get(), role },
        abortEarly: false,
        stripUnknown: true,
      })
      .catch((err) => {
        // Reduce Yup ValidationErrors object into simple object with field name (path) as key
        const errors = err.inner.reduce((obj, item) => ({ ...obj, [item.path]: item.message }), {});
        throw new BadRequestError(errors);
      });

    // Add user id back into tenancy for validation in db
    validatedTenancy = { ...validatedTenancy, userId: currentTenancy.userId };
  } catch (e) {
    throw e;
  }

  try {
    let updatedTenancy = await tenancyDb.updateTenancy(validatedTenancy);

    // Start tenancy if start date is today and has not already paid
    if (updatedTenancy.startDate.getTime() === today.getTime() && !updatedTenancy.paid) {
      try {
        updatedTenancy = await startTenancy(updatedTenancy.get());
      } catch (e) {
        throw e;
      }
    }

    // If tenancy is in progress and vehicle is not bicycle, update plates
    if (
      updatedTenancy.subscriptionStarted
      && !updatedTenancy.subscriptionEnded
      && updatedTenancy.vehicleType !== 'Bicycle'
    ) {
      const user = await userDb.getUser(updatedTenancy.userId);
      await smartParkingService.updateLease(updatedTenancy, user);
    }

    return updatedTenancy;
  } catch (e) {
    throw e;
  }
};

export const deleteTenancy = async (id, userId) => {
  // Validate that tenancy is not in progress
  try {
    const user = await userDb.getUser(userId);
    const { corporateCarparks } = user;
    const isCorporate = !(corporateCarparks === 0);

    const tenancy = await tenancyDb.getTenancy(id);
    const { subscriptionStarted, subscriptionEnded } = tenancy;
    const inProgress = subscriptionStarted && !subscriptionEnded;

    if (!isCorporate && inProgress) {
      throw new BadRequestError('A tenancy in progress cannot be deleted');
    }

    if (tenancy.vehicleType !== 'Bicycle') {
      await smartParkingService.deleteLease(tenancy);
    }

    // Delete the tenancy
    return await tenancyDb.deleteTenancy(id, userId);
  } catch (e) {
    throw e;
  }
};
