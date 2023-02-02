import React from "react";

import { Form } from "../components/common/Form";
import { TextField } from "../components/common/FormField";

export function SecretAdd() {
  return (
    <section>
      Secret Add
      <Form>
        <TextField>
          <label htmlFor="path-input">Path</label>
          <input id="path-input" type="text" autoCapitalize="off"></input>
        </TextField>
      </Form>
    </section>
  );
}
