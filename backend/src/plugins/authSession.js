import fp from "fastify-plugin";
const authSession = async (fastify) => {
  fastify.decorate("requireLogin", async (request, reply) => {
    const user = request.session.get("user");
    if (!user) {
      return reply.code(401).send({
        success: false,
        message: "Login required",
      });
    }
    request.user = user;
  });
};
export default fp(authSession);
