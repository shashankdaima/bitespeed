import swaggerJsDoc from "swagger-jsdoc";

const options :swaggerJsDoc.Options={
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Contact Cluster API: Bitespeed",
            version: "1.0.0",
            description: "An API for managing contact clusters"
        },
        servers: [
            {
                url: "http://localhost:5000",
                description: "Development server"
            },
            {
                url: "https://bitespeed-fyyp.onrender.com/",
                description: "Production server"
            },
        ]
    },
    apis: ["./src/routes/*.ts"]
}
const specs = swaggerJsDoc(options);

export default specs;