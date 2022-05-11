const user = {
    username: "TuUser",
    password: "TuPassword",
    firstName: "TuFirstName",
    lastName: "TuLastName",
    email: "unitTest@email.com",
    zipcode: "78000",
    language: "Fr",
    hash: "wtf"
}
const badUser = {
    username: "TuUser",
    password: "TuPassword",
    firstName: "TuFirstName",
    lastName: "TuLastName",
    zipcode: "78000",
    language: "Fr",
    hash: "wtf"
}


const path = {
    basePath: "./../../",
    baseUrl: "localhost:4000"
}

module.exports = {
    user: user,
    path: path,
};