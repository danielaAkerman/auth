import * as express from "express";
import * as crypto from "crypto";
import { Auth } from "./db/auth";
import { User } from "./db/user";
import { sequelize } from "./db";

function getSHA256ofJSON(text: string) {
  return crypto.createHash("sha256").update(text).digest("hex");
}

sequelize.sync({ force: true }).then((res) => {
  console.log(res);
});

const port = process.env.PORT || 3000;
const app = express();
app.use(express.json());

app.post("/auth", async (req, res) => {
  const { email, name, birthdate, password } = req.body;
  const [user, created] = await User.findOrCreate({
    where: {
      email: req.body.email,
    },
    defaults: {
      email,
      name,
      birthdate,
    },
  });

  const [auth, authCreated] = await Auth.findOrCreate({
    where: {
      user_id: user.dataValues.id,
    },
    defaults: {
      email,
      password: getSHA256ofJSON(password),
      user_id: user.dataValues.id,
    },
  });
  console.log({ authCreated, auth });
  res.json(auth);
});

app.listen(port, () => {
  console.log("Corriendo en puerto http://localhost:" + port);
});
