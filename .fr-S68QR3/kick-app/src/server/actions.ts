import { Work, Favorite, History } from 'wasp/entities';
import { HttpError } from 'wasp/server';

type CreateWorkPayload = Pick<Work, 'title' | 'description' | 'authorName' | 'creationDate' | 'imageUrl' | 'relatedFileUrl' | 'historicalLocation' | 'tags' | 'categoryId' | 'collectionId'>;

export const createWork = async (args: any, context: any) => {
  if (!context.user) throw new HttpError(401);
  // RBAC check: only ADMIN or CURATOR can create works
  if (context.user.role === 'USER') throw new HttpError(403, 'Permission denied');

  const work = await context.entities.Work.create({
    data: args
  });

  await context.entities.History.create({
    data: {
      action: 'CREATED',
      entityType: 'WORK',
      entityId: work.id,
      userId: context.user.id,
      workId: work.id
    }
  });

  return work;
};

type UpdateWorkPayload = Partial<CreateWorkPayload> & { id: string };

export const updateWork = async (args: any, context: any) => {
  if (!context.user) throw new HttpError(401);
  if (context.user.role === 'USER') throw new HttpError(403, 'Permission denied');

  const { id, ...data } = args;

  const work = await context.entities.Work.update({
    where: { id },
    data
  });

  await context.entities.History.create({
    data: {
      action: 'UPDATED',
      entityType: 'WORK',
      entityId: work.id,
      userId: context.user.id,
      workId: work.id
    }
  });

  return work;
};

export const deleteWork = async ({ id }: any, context: any) => {
  if (!context.user) throw new HttpError(401);
  if (context.user.role === 'USER') throw new HttpError(403, 'Permission denied');

  await context.entities.Work.delete({
    where: { id }
  });

  await context.entities.History.create({
    data: {
      action: 'DELETED',
      entityType: 'WORK',
      entityId: id,
      userId: context.user.id
    }
  });
};

export const toggleFavorite = async ({ workId }: any, context: any) => {
  if (!context.user) throw new HttpError(401);

  const existing = await context.entities.Favorite.findUnique({
    where: {
      userId_workId: {
        userId: context.user.id,
        workId
      }
    }
  });

  if (existing) {
    await context.entities.Favorite.delete({
      where: { id: existing.id }
    });
    return { deleted: true };
  }

  return context.entities.Favorite.create({
    data: {
      userId: context.user.id,
      workId
    }
  });
};
