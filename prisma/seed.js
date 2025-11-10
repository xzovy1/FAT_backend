const { DataType } = require('../generated/prisma/');
const prisma = require('./client.js')

async function createForm() {
  // 1. Create a new form
  const form = await prisma.testForm.create({
    data: {
      name: "test FAT",
      version: 4,
      is_active: true,
    },
  });

  // 2. Create sections for the form

  const signOn = await prisma.testSection.create({
    data: {
      sequence: 1,
      name: "Worker Sign-on",
      form_id: form.id,
    },
  });

  const prechecks = await prisma.testSection.create({
    data: {
      sequence: 2,
      name: "Pre-Start Checks",
      form_id: form.id,
    },
  });

  const safety = await prisma.testSection.create({
    data: {
      sequence: 3,
      name: "Safety Checks",
      form_id: form.id,
    },
  });

  const lowVoltage = await prisma.testSection.create({
    data: {
      sequence: 4,
      name: "Low Voltage",
      form_id: form.id,
    }
  })
  const electricalReadings = await prisma.testSection.create({
    data: {
      sequence: 5,
      name: "Electrical Readings",
      form_id: form.id,
    }
  })
  const evapSection = await prisma.testSection.create({
    data: {
      sequence: 6,
      name: "Evap Section",
      form_id: form.id,
    }
  })
  const motorSection = await prisma.testSection.create({
    data: {
      sequence: 6,
      name: "Motor Section",
      form_id: form.id,
    }
  })
  const shutdown = await prisma.testSection.create({
    data: {
      sequence: 7,
      name: "Shutdown",
      form_id: form.id,
    }
  })
  const signoff = await prisma.testSection.create({
    data: {
      sequence: 8,
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