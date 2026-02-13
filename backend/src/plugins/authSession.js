import fp from "fastify-plugin";
const authSession = async (fastify) => {
  const reqLogin = async (request, reply) => {
    const user = request.session.get("user");
    if (!user) {
      return reply.code(401).send({
        success: false,
        message: "Login required",
      });
    }
    return (request.user = user);
  };
  
  fastify.decorate("requireLogin", reqLogin);
};
export default fp(authSession);
