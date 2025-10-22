const prisma = require("./client.js");


async function main() {
    const allUsers = await prisma.user.findMany();
    console.log(allUsers);
}

main();