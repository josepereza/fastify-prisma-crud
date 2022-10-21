import Fastify from "fastify";
import { PrismaClient } from "@prisma/client";
import formbody from "@fastify/formbody";


const prisma = new PrismaClient();

const app = Fastify({
  logger: true,
});

app.register(formbody);
// // CommonJs
// const fastify = require('fastify')({
//   logger: true
// })

// Declare a route
app.get("/", function (request, reply) {
  reply.send({ hello: "world" });
});

app.route({
  method: "GET",
  url: "/prueba",
  schema: {
    querystring: {
      name: { type: "string" },
      excitement: { type: "integer" },
    },
    response: {
      200: {
        type: "object",
        properties: {
          hello: { type: "string" },
        },
      },
    },
  },
  preHandler: function (request, reply, done) {
    console.log({ hola: "hola mundillo, prueba hook" });
    done();
  },
  handler: function (request, reply) {
    reply.send({ hello: "prueba" });
  },
});
app.get("/users", async (req, res) => {
    const users = await prisma.user.findMany({
       
      include: { posts: true },
    });
  
    res.send(users);
  });


app.get("/feed", async (req, res) => {
  const posts = await prisma.post.findMany({
    where: { published: true },

    include: { author: true },
  });

  res.send(posts);
});

app.post("/post", async (req, res) => {
  const { title, content, authorEmail } = req.body;

  const post = await prisma.post.create({
    data: {
      title,
      content,
      published: false,
      author: { connect: { email: authorEmail } },
    },
  });

  res.send(post);
});

app.put("/publish/:id", async (req, res) => {
  const { id } = req.params;
  const postNumber=parseInt(id)
console.log({postNumber});
  const post = await prisma.post.update({
    where: { id:postNumber },

    data: { published: true },
  });

  res.send(post);
});

app.delete("/user/:id", async (req, res) => {
  const { id } = req.params;
  const postNumber=parseInt(id)
  const user = await prisma.user.delete({
    where: {
        id:postNumber 
    },
  });

  res.send(user);
});
// Run the server!
app.listen({ port: 3000 }, function (err, address) {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  // Server is now listening on ${address}
});
