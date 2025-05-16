import controller from "infra/controller";
import { createRouter } from "next-connect";
import user from "models/user.js";

const router = createRouter();
router.get(getHandler);
router.patch(patchHandler);

export default router.handler(controller.errorHandler);

async function getHandler(req, res) {
  const { username } = req.query;
  const foundUser = await user.findOneByUsername(username);
  return res.status(200).json(foundUser);
}

async function patchHandler(req, res) {
  const { username } = req.query;
  const userInputValues = req.body;

  const updatedUser = await user.update(username, userInputValues);
  return res.status(200).json(updatedUser);
}
