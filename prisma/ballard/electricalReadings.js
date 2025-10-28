import { PrismaClient, DataType } from '@prisma/client';

const prisma = new PrismaClient();

async function populateElectricalReadings(){
	const form = await prisma.testForm.findUnique({
		where: {
			name: "Ballard FAT"
		}
	})

	const electricalReadings = await prisma.testSection.create({
		data: {
			name: "Electrical Readings",
			form_id: form.id,
		}
	})
	let sequence = 1;
	await prisma.testPoint.createMany({
		data: [
			{
			  section_id: electricalReadings.id,
			  sequence: sequence++,
			  name: "Measure Mains voltage",
			  description: "Phase-to-Phase Voltage",
			  expected_values: [480, 480, 480],
			  data_type: DataType.numeric,
			},
			{
			  section_id: electricalReadings.id,
			  sequence: sequence++,
			  name: "Measure Mains voltage",
			  description: "Phase-to-Ground Voltage",
			  expected_values: [277, 277, 277],
			  data_type: DataType.numeric,
			},
			{
			  section_id: electricalReadings.id,
			  sequence: sequence++,
			  name: "Measure Line Reactor Input Voltage",
			  description: "Phase-to-Phase Voltage",
			  expected_values: [480, 480, 480],
			  data_type: DataType.numeric,
			},
			{
			  section_id: electricalReadings.id,
			  sequence: sequence++,
			  name: "Measure Line Reactor Output Voltage",
			  description: "Phase-to-Phase Voltage at VFD",
			  expected_values: [500, 500, 500],
			  data_type: DataType.numeric,
			},
			{
			  section_id: electricalReadings.id,
			  sequence: sequence++,
			  name: "Transformer 1",
			  description: "Line and Load voltages",
			  expected_values: [480, 120],
			  data_type: DataType.numeric,
			},
			{
			  section_id: electricalReadings.id,
			  sequence: sequence++,
			  name: "Transformer 2",
			  description: "Line and Load voltages",
			  expected_values: [480, 126],
			  data_type: DataType.numeric,
			},
			{
			  section_id: electricalReadings.id,
			  sequence: sequence++,
			  name: "Transformer 3",
			  description: "Line and Load voltages",
			  expected_values: [480, 120],
			  data_type: DataType.numeric,
			},


		]
	})

}

populateElectricalReadings()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());