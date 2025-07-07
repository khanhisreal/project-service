/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import mongoose from 'mongoose';

export const DEFAULT_PAGE_SIZE = 10;

export const idIsValid = (id: string) => {
  return mongoose.Types.ObjectId.isValid(id);
};

export function buildProjectFilter(
  query?: string,
  ownedBy?: string,
  currentUserId?: string,
) {
  const filter: any = {};

  if (query) {
    const conditions: any[] = [
      { title: { $regex: query, $options: 'i' } },
      { description: { $regex: query, $options: 'i' } },
    ];
    if (idIsValid(query)) {
      conditions.unshift({ _id: query });
    }
    filter.$or = conditions;
  }

  if (ownedBy && currentUserId) {
    if (ownedBy === 'you') {
      filter.ownerId = currentUserId;
    } else if (ownedBy === 'otherManagers') {
      filter.ownerId = { $ne: currentUserId };
    }
  }

  return filter;
}
