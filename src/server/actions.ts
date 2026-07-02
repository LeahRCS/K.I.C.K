// @ts-nocheck
import { HttpError } from 'wasp/server';
import type {
  CreateWork,
  UpdateWork,
  DeleteWork,
  ToggleFavorite,
  ApproveWork,
  RejectWork,
} from 'wasp/server/operations';

type CreateWorkInput = {
  title: string;
  description: string;
  authorName?: string;
  creationDate?: string;
  imageUrl?: string;
  relatedFileUrl?: string;
  historicalLocation?: string;
  tags?: string;
  categoryId: string;
  collectionId?: string;
};

type UpdateWorkInput = Partial<CreateWorkInput> & { id: string };
type DeleteWorkInput = { id: string };
type ToggleFavoriteInput = { workId: string };
type ApproveWorkInput = { id: string };
type RejectWorkInput = { id: string };

export const createWork: CreateWork<CreateWorkInput, any> = async (
  args: any,
  context: any,
) => {
  if (!context.user) throw new HttpError(401, 'Autenticação necessária');
  if (context.user.role === 'USER')
    throw new HttpError(403, 'Permissão negada. Apenas curadores e administradores podem submeter obras.');

  const work = await context.entities.Work.create({
    data: {
      title: args.title,
      description: args.description,
      authorName: args.authorName || null,
      creationDate: args.creationDate ? new Date(args.creationDate) : null,
      imageUrl: args.imageUrl || null,
      relatedFileUrl: args.relatedFileUrl || null,
      historicalLocation: args.historicalLocation || null,
      tags: args.tags || '[]',
      categoryId: args.categoryId,
      collectionId: args.collectionId || null,
      submitterId: context.user.id,
    },
  });

  await context.entities.History.create({
    data: {
      action: 'CREATED',
      entityType: 'WORK',
      entityId: work.id,
      details: JSON.stringify({ title: work.title }),
      userId: context.user.id,
      workId: work.id,
    },
  });

  return work;
};

export const updateWork: UpdateWork<UpdateWorkInput, any> = async (
  args: any,
  context: any,
) => {
  if (!context.user) throw new HttpError(401, 'Autenticação necessária');
  if (context.user.role === 'USER')
    throw new HttpError(403, 'Permissão negada');

  const { id, ...data } = args;

  // Clean up the data — only pass defined fields
  const updateData: Record<string, any> = {};
  if (data.title !== undefined) updateData.title = data.title;
  if (data.description !== undefined) updateData.description = data.description;
  if (data.authorName !== undefined) updateData.authorName = data.authorName || null;
  if (data.imageUrl !== undefined) updateData.imageUrl = data.imageUrl || null;
  if (data.relatedFileUrl !== undefined) updateData.relatedFileUrl = data.relatedFileUrl || null;
  if (data.historicalLocation !== undefined)
    updateData.historicalLocation = data.historicalLocation || null;
  if (data.tags !== undefined) updateData.tags = data.tags;
  if (data.categoryId !== undefined) updateData.categoryId = data.categoryId;
  if (data.collectionId !== undefined)
    updateData.collectionId = data.collectionId || null;
  if (data.creationDate !== undefined)
    updateData.creationDate = data.creationDate
      ? new Date(data.creationDate)
      : null;

  const work = await context.entities.Work.update({
    where: { id },
    data: updateData,
  });

  await context.entities.History.create({
    data: {
      action: 'UPDATED',
      entityType: 'WORK',
      entityId: work.id,
      details: JSON.stringify({ title: work.title }),
      userId: context.user.id,
      workId: work.id,
    },
  });

  return work;
};

export const deleteWork: DeleteWork<DeleteWorkInput, void> = async (
  { id }: any,
  context: any,
) => {
  if (!context.user) throw new HttpError(401, 'Autenticação necessária');
  if (context.user.role === 'USER')
    throw new HttpError(403, 'Permissão negada');

  // Get work title for audit log before deleting
  const work = await context.entities.Work.findUnique({ where: { id } });
  if (!work) throw new HttpError(404, 'Registro não encontrado');

  // Delete related favorites first (to avoid FK constraint)
  await context.entities.Favorite.deleteMany({
    where: { workId: id },
  });

  // Disconnect history records (set workId to null)
  await context.entities.History.updateMany({
    where: { workId: id },
    data: { workId: null },
  });

  await context.entities.Work.delete({
    where: { id },
  });

  await context.entities.History.create({
    data: {
      action: 'DELETED',
      entityType: 'WORK',
      entityId: id,
      details: JSON.stringify({ title: work.title }),
      userId: context.user.id,
    },
  });
};

export const toggleFavorite: ToggleFavorite<ToggleFavoriteInput, any> = async (
  { workId }: any,
  context: any,
) => {
  if (!context.user) throw new HttpError(401, 'Autenticação necessária');

  const existing = await context.entities.Favorite.findUnique({
    where: {
      userId_workId: {
        userId: context.user.id,
        workId,
      },
    },
  });

  if (existing) {
    await context.entities.Favorite.delete({
      where: { id: existing.id },
    });
    return { favorited: false };
  }

  await context.entities.Favorite.create({
    data: {
      userId: context.user.id,
      workId,
    },
  });
  return { favorited: true };
};

export const approveWork: ApproveWork<ApproveWorkInput, any> = async (
  { id }: any,
  context: any,
) => {
  if (!context.user) throw new HttpError(401, 'Autenticação necessária');
  if (context.user.role === 'USER')
    throw new HttpError(403, 'Permissão negada');

  const work = await context.entities.Work.update({
    where: { id },
    data: { status: 'APPROVED' },
  });

  await context.entities.History.create({
    data: {
      action: 'UPDATED',
      entityType: 'WORK',
      entityId: work.id,
      details: JSON.stringify({ title: work.title, status: 'APPROVED' }),
      userId: context.user.id,
      workId: work.id,
    },
  });

  return work;
};

export const rejectWork: RejectWork<RejectWorkInput, void> = async (
  { id }: any,
  context: any,
) => {
  if (!context.user) throw new HttpError(401, 'Autenticação necessária');
  if (context.user.role === 'USER')
    throw new HttpError(403, 'Permissão negada');

  const work = await context.entities.Work.findUnique({ where: { id } });
  if (!work) throw new HttpError(404, 'Registro não encontrado');

  // Increment user strikes if they submitted this
  if (work.submitterId) {
    await context.entities.User.update({
      where: { id: work.submitterId },
      data: { strikes: { increment: 1 } },
    });
  }

  // Delete related favorites first (to avoid FK constraint)
  await context.entities.Favorite.deleteMany({
    where: { workId: id },
  });

  // Disconnect history records (set workId to null)
  await context.entities.History.updateMany({
    where: { workId: id },
    data: { workId: null },
  });

  await context.entities.Work.delete({
    where: { id },
  });

  await context.entities.History.create({
    data: {
      action: 'DELETED',
      entityType: 'WORK',
      entityId: id,
      details: JSON.stringify({ title: work.title, status: 'REJECTED' }),
      userId: context.user.id,
    },
  });
};
