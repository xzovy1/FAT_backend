import { PrismaClient, DataType } from '@prisma/client';

const prisma = new PrismaClient();

async function populatePrechecks(){

	const form = await prisma.testForm.findUnique({
		where: {
			name: "Ballard FAT"
		}
	})

	const prechecks = await prisma.testSection.create({
		data: {
			name: "Pre-Start checks",
			form_id: form.id,
		}
	})

	await prisma.testPoint.createMany({
		data: [
	
		  {
			section_id: prechecks.id,
			sequence: 1,
			name: "Emergency stop functional",
		  },
		  {
			section_id: prechecks.id,
			sequence: 2,
			name: "Safety switch engaged",
		  },
		],
	  });

}

populatePrechecks()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());