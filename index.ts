import * as express from "express";
import { Auth } from "./db/auth";
import { User } from "./db/user";
import { sequelize } from "./db";

sequelize.sync({ alter: true }).then((res) => {
  console.log(res);
});

const port = process.env.PORT || 3000;
const app = express();
app.use(express.json());

app.post("/auth", async (req, res) => {
  const [user, created] = await User.findOrCreate({
    where: {
      email: req.body.email,
    },
    defaults: {
      email: req.body.email,
      name: req.body.name,
      birthdate: req.body.birthdate,
    },
  });
  console.log({ created, user });
  res.json(user);
});

app.listen(port, () => {
  console.log("Corriendo en puerto http://localhost:" + port);
});
