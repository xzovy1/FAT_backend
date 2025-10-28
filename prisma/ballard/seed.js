import { PrismaClient, DataType } from '@prisma/client';

const prisma = new PrismaClient();

async function createForm() {
  // 1. Create a new form
  const form = await prisma.testForm.create({
    data: {
      name: "Ballard FAT",
      version: 1,
      is_active: true,
    },
  });

  // 2. Create sections for the form
  
  const signon = await prisma.testSection.create({
    data: {
      name: "Worker Sign-on",
      form_id: form.id,
    },
  });
  
  const prechecks = await prisma.testSection.create({
    data: {
      name: "Pre-Start Checks",
      form_id: form.id,
    },
  });

  const safety = await prisma.testSection.create({
    data: {
      name: "Safety Checks",
      form_id: form.id,
    },
  });

  const lowVoltage = await prisma.testSection.create({
	data: {
		name: "Low Voltage",
		form_id: form.id,
	}
  })
  const electricalReadings = await prisma.testSection.create({
	data: {
		name: "Electrical Readings",
		form_id: form.id,
	}
  })
  const evapSection = await prisma.testSection.create({
	data: {
		name: "Evap Section",
		form_id: form.id,
	}
  })
  const motorSection = await prisma.testSection.create({
	data: {
		name: "Motor Section",
		form_id: form.id,
	}
  })
  const shutdown = await prisma.testSection.create({
	data: {
		name: "Shutdown",
		form_id: form.id,
	}
  })
  const signoff = await prisma.testSection.create({
	data: {
		name: "Sign off",
		form_id: form.id,
	}
  })

  // 3. Add test points to sections

  await prisma.testPoint.createMany({
    data: [

      {
        section_id: safety.id,
        sequence: 1,
        name: "Emergency stop functional",
        expected_value: "true",
        data_type: DataType.boolean,
      },
      {
        section_id: safety.id,
        sequence: 2,
        name: "Safety switch engaged",
        expected_value: "true",
        data_type: DataType.boolean,
      },
    ],
  });

  console.log("Form created with sections and test points:", form);
}

createForm()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());