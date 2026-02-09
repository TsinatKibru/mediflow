import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function run() {
    try {
        const tenant = await prisma.tenant.findUnique({ where: { subdomain: 'st-jude' } });
        if (!tenant) {
            console.error('Tenant st-jude not found');
            return;
        }

        const dept = await prisma.department.upsert({
            where: { id: 'test-dept-id-1' },
            update: {},
            create: {
                id: 'test-dept-id-1',
                name: 'General Medicine',
                tenantId: tenant.id
            }
        });

        const patient = await prisma.patient.findFirst({ where: { tenantId: tenant.id } });
        if (!patient) {
            console.error('No patient found for st-jude');
            return;
        }

        console.log('JSON_OUTPUT:');
        console.log(JSON.stringify({
            tenantId: tenant.id,
            departmentId: dept.id,
            patientId: patient.id
        }, null, 2));
    } catch (error) {
        console.error('Error during setup:', error);
    } finally {
        await prisma.$disconnect();
    }
}

run();
