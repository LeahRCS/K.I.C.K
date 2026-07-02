// @ts-nocheck
import { PrismaClient } from '@prisma/client';

export async function devSeedUsers(prismaClient: PrismaClient) {
  // Seed is only for categories — users are created through auth flow
  console.log('🌱 Seeding cultural categories...');

  const categories = [
    { name: 'HQ & Quadrinhos', description: 'Comics, tirinhas independentes, mangás, zines ilustrados e graphic novels.' },
    { name: 'Fotografia & Arte Visual', description: 'Fotografias, ilustrações, pinturas, grafite e expressões visuais diversas.' },
    { name: 'Obra de Arte Contemporânea', description: 'Instalações, performances, arte digital e obras de vanguarda.' },
    { name: 'Cinema & Audiovisual', description: 'Filmes, curtas-metragens, documentários, vídeo-arte e produções independentes.' },
    { name: 'Meme & Cultura de Internet', description: 'Memes históricos, shitpost, virais, web art e arqueologia digital.' },
    { name: 'Games & Interatividade', description: 'Jogos independentes, mods, ROM hacks, e experiências interativas.' },
    { name: 'Zines & Publicações', description: 'Publicações independentes, fanzines, manifestos impressos e mídia alternativa.' },
    { name: 'Música & Áudio', description: 'Registros sonoros, álbuns, demos, mixtapes e produções musicais independentes.' },
    { name: 'Moda & Vestimenta', description: 'Peças de vestuário, acessórios, estampas e design de moda alternativa.' },
    { name: 'Manifestos & Documentos', description: 'Textos históricos, cartas, declarações e documentos de movimentos culturais.' },
    { name: 'Artefatos & Relíquias', description: 'Objetos físicos, memorabilia, relíquias e artefatos de valor subcultural.' },
  ];

  for (const cat of categories) {
    await prismaClient.category.upsert({
      where: { name: cat.name },
      update: {},
      create: cat,
    });
  }

  console.log(`✅ ${categories.length} categorias culturais semeadas.`);
}
