import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Start seeding...');

    // 1. Читаем файл JSON
    // Путь указываем относительно корня проекта
    const filePath = path.join(process.cwd(), 'products_db_seed.json');
    const rawData = fs.readFileSync(filePath, 'utf-8');
    const products = JSON.parse(rawData);

    console.log(`📦 Найдено товаров в файле: ${products.length}`);

    // 2. Создаем (или находим) категорию
    // Нам нужно гарантировать, что categoryId из JSON существует в таблице Category
    // Иначе Prisma выдаст ошибку "Foreign Key Constraint failed"

    // Берем ID категории из первого товара (мы в скрапере везде ставили один и тот же)
    const categoryId = products[0]?.categoryId;

    if (categoryId) {
        console.log(`🔧 Проверка категории: ${categoryId}`);
        await prisma.category.upsert({
            where: { id: categoryId }, // Ищем по ID (если в schema.prisma у id нет @unique, возможно придется искать по name, но для uuid лучше так)
            update: {}, // Если нашли - ничего не меняем
            create: {
                id: categoryId,
                name: 'Мужская одежда (PRM)', // Название категории
            },
        });
        console.log('✅ Категория готова');
    }

    // 3. Заливаем товары
    for (const product of products) {
        // Нам нужно удалить createdAt и updatedAt, чтобы Prisma сама поставила текущее время
        // ИЛИ оставить их, если хотим сохранить "скрапленное" время.
        // Обычно лучше позволить базе ставить default(now())
        const { createdAt, updatedAt, ...productData } = product;

        // Используем upsert: если товар с таким ID есть - обновим, нет - создадим
        await prisma.product.upsert({
            where: { id: productData.id },
            update: productData,
            create: productData,
        });
    }

    console.log(`✅ Успешно добавлено/обновлено товаров: ${products.length}`);
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });