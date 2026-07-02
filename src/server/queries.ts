// @ts-nocheck
import { HttpError } from 'wasp/server';
import type {
  GetWorks,
  GetApprovedWorks,
  GetWork,
  GetCategories,
  GetCollections,
  GetFavorites,
  GetHistory,
} from 'wasp/server/operations';

type GetWorkArgs = { id: string };
type GetHistoryArgs = { limit?: number };

export const getWorks: GetWorks<void, any> = async (_args: any, context: any) => {
  return context.entities.Work.findMany({
    include: { category: true, collection: true },
    orderBy: { createdAt: 'desc' },
  });
};

export const getApprovedWorks: GetApprovedWorks<void, any> = async (_args: any, context: any) => {
  return context.entities.Work.findMany({
    where: { status: 'APPROVED' },
    include: { category: true, collection: true },
    orderBy: { createdAt: 'desc' },
  });
};

export const getWork: GetWork<GetWorkArgs, any> = async ({ id }: any, context: any) => {
  const work = await context.entities.Work.findUnique({
    where: { id },
    include: { category: true, collection: true, favoritedBy: true },
  });
  if (!work) throw new HttpError(404, 'Registro não encontrado');
  return work;
};

export const getCategories: GetCategories<void, any> = async (
  _args: any,
  context: any,
) => {
  return context.entities.Category.findMany({
    orderBy: { name: 'asc' },
  });
};

export const getCollections: GetCollections<void, any> = async (
  _args: any,
  context: any,
) => {
  return context.entities.Collection.findMany({
    orderBy: { createdAt: 'desc' },
  });
};

export const getFavorites: GetFavorites<void, any> = async (_args: any, context: any) => {
  if (!context.user) throw new HttpError(401, 'Autenticação necessária');
  return context.entities.Favorite.findMany({
    where: { userId: context.user.id },
    include: { work: { include: { category: true } } },
    orderBy: { createdAt: 'desc' },
  });
};

export const getHistory: GetHistory<GetHistoryArgs, any> = async (
  args: any,
  context: any,
) => {
  if (!context.user) throw new HttpError(401, 'Autenticação necessária');
  return context.entities.History.findMany({
    include: { user: true, work: true },
    orderBy: { createdAt: 'desc' },
    take: args?.limit ?? 50,
  });
};
