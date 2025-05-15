import controller from "infra/controller";
import { createRouter } from "next-connect";
import user from "models/user.js";

const router = createRouter();
// router.get(getHandler);
router.post(postHandler);

export default router.handler(controller.errorHandler);

async function postHandler(req, res) {
  const userInputValues = req.body;
  const newUser = await user.create(userInputValues);
  return res.status(201).json(newUser);
}
