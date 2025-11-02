import { PrismaClient, DataType } from '@prisma/client';

const prisma = new PrismaClient();

async function createForm() {
  // 1. Create a new form
  const form = await prisma.testForm.create({
    data: {
      name: "test FAT",
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
        section_id: electricalReadings.id,
        sequence: 1,
        name: "Measure Mains voltage",
        description: "Phase-to-Phase Voltage",
        expected_values: [480, 480, 480],
        data_type: DataType.numeric,
      },
      {
        section_id: electricalReadings.id,
        sequence: 2,
        name: "Measure Mains voltage",
        description: "Phase-to-Ground Voltage",
        expected_values: [277, 277, 277],
        data_type: DataType.numeric,
      },
      {
        section_id: electricalReadings.id,
        sequence: 3,
        name: "Measure Line Reactor Input Voltage",
        description: "Phase-to-Phase Voltage",
        expected_values: [480, 480, 480],
        data_type: DataType.numeric,
      },
      {
        section_id: electricalReadings.id,
        sequence: 4,
        name: "Measure Line Reactor Output Voltage",
        description: "Phase-to-Phase Voltage at VFD",
        expected_values: [500, 500, 500],
        data_type: DataType.numeric,
      },
      {
        section_id: electricalReadings.id,
        sequence: 5,
        name: "Transformer 1",
        description: "Line and Load voltages",
        expected_values: [480, 120],
        data_type: DataType.numeric,
      },
      {
        section_id: electricalReadings.id,
        sequence: 6,
        name: "Transformer 2",
        description: "Line and Load voltages",
        expected_values: [480, 126],
        data_type: DataType.numeric,
      },
      {
        section_id: electricalReadings.id,
        sequence: 7,
        name: "Transformer 3",
        description: "Line and Load voltages",
        expected_values: [480, 120],
        data_type: DataType.numeric,
      },
    ],
  });

  console.log("Form created with sections and test points:", form);
}

createForm()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());