import t from "tap";
import { init } from "../../../src";

const getUi = () => init().ui;

t.test("bigbang", async (t) => {
  t.plan(1);
  const ui = getUi();

  t.equal(ui.hello(), "world");
});
