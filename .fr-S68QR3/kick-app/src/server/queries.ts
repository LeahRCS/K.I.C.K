import { Work, Category, Collection, Favorite } from 'wasp/entities';
import { HttpError } from 'wasp/server';

export const getWorks = async (args: any, context: any) => {
  return context.entities.Work.findMany({
    include: { category: true, collection: true },
    orderBy: { createdAt: 'desc' }
  });
};

export const getWork = async ({ id }: any, context: any) => {
  const work = await context.entities.Work.findUnique({
    where: { id },
    include: { category: true, collection: true, favoritedBy: true }
  });
  if (!work) throw new HttpError(404, 'Work not found');
  return work;
};

export const getCategories = async (args: any, context: any) => {
  return context.entities.Category.findMany();
};

export const getCollections = async (args: any, context: any) => {
  return context.entities.Collection.findMany({
    orderBy: { createdAt: 'desc' }
  });
};

export const getFavorites = async (args: any, context: any) => {
  if (!context.user) throw new HttpError(401);
  return context.entities.Favorite.findMany({
    where: { userId: context.user.id },
    include: { work: true },
    orderBy: { createdAt: 'desc' }
  });
};
