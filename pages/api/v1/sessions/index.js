import controller from "infra/controller";
import authentication from "models/authentication";
import { createRouter } from "next-connect";
import session from "models/session";

const router = createRouter();
// router.get(getHandler);
router.post(postHandler);

export default router.handler(controller.errorHandler);

async function postHandler(req, res) {
  const userInputValues = req.body;
  const authenticatedUser = await authentication.getAuthenticatedUser(
    userInputValues.email,
    userInputValues.password,
  );

  const newSession = await session.create(authenticatedUser.id);

  controller.setSessionCookie(res, newSession.token);

  return res.status(201).json(newSession);
}
