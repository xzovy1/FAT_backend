const prisma = require("./client.js");
const bcrypt = require('bcryptjs')

// const data = await prisma.user.create({
//     data: {
//         username: "admin",
//         password_hash: await bcrypt.hash("SilentAire132", 10),
//         firstname: "admin",
//         lastname: "",
//         email: "admin",
//         is_admin: true
//     }
// });
async function main() {
    const data = await prisma.testForm.deleteMany();
    console.log(data);
}

main();