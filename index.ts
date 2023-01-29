import * as express from "express";
import * as crypto from "crypto";
import * as jwt from "jsonwebtoken";
import { Auth } from "./db/auth";
import { User } from "./db/user";
import { sequelize } from "./db";

const SECRET = "CS90AJN3458DFGN34NLSD0U4JI28UVS0U3MK23RO";

function getSHA256ofJSON(text: string) {
  return crypto.createHash("sha256").update(text).digest("hex");
}

// sequelize.sync({ force: true }).then((res) => {
//   console.log(res);
// });

const port = process.env.PORT || 3000;
const app = express();
app.use(express.json());

// signUp
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

// signIn
app.post("/auth/token", async (req, res) => {
  const { email, password } = req.body;
  const passHash = getSHA256ofJSON(password);
  const auth = await Auth.findOne({
    where: {
      email,
      password: passHash,
    },
  });
  const token = jwt.sign({ id: auth.dataValues.user_id }, SECRET);
  // Si no hay registro de ese usuario y esa contraseña, devuelve null
  if (auth) {
    res.json({ token });
  } else {
    res.status(401).json({ messaje: "not found" });
  }
});

app.listen(port, () => {
  console.log("Corriendo en puerto http://localhost:" + port);
});
