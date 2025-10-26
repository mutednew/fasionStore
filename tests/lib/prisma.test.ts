describe("🧩 lib/prisma", () => {
    const globalAny = global as any;

    beforeEach(() => {
        jest.resetModules();
        delete globalAny.prisma;
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should create a new PrismaClient if not cached", async () => {
        jest.isolateModules(async () => {
            // @ts-ignore
            process.env.NODE_ENV = "development";

            const mockConstructor = jest.fn().mockImplementation(() => ({
                $connect: jest.fn(),
                $disconnect: jest.fn(),
            }));

            jest.doMock("@prisma/client", () => ({ PrismaClient: mockConstructor }));

            const { prisma } = await import("@/lib/prisma");

            expect(mockConstructor).toHaveBeenCalledTimes(1);
            expect(globalAny.prisma).toBe(prisma);
        });
    });

    it("should reuse existing PrismaClient from global cache", async () => {
        jest.isolateModules(async () => {
            // @ts-ignore
            process.env.NODE_ENV = "development";
            globalAny.prisma = { cached: true };

            const mockConstructor = jest.fn();
            jest.doMock("@prisma/client", () => ({ PrismaClient: mockConstructor }));

            const { prisma } = await import("@/lib/prisma");

            expect(prisma).toEqual({ cached: true });
            expect(mockConstructor).not.toHaveBeenCalled();
        });
    });

    it("should not assign to global.prisma in production", async () => {
        jest.isolateModules(async () => {
            // @ts-ignore
            process.env.NODE_ENV = "production";

            const mockConstructor = jest.fn().mockImplementation(() => ({
                $connect: jest.fn(),
                $disconnect: jest.fn(),
            }));

            jest.doMock("@prisma/client", () => ({ PrismaClient: mockConstructor }));

            const { prisma } = await import("@/lib/prisma");

            expect(mockConstructor).toHaveBeenCalledTimes(1);
            expect(globalAny.prisma).toBeUndefined();
            expect(prisma).toBeDefined();
        });
    });
});