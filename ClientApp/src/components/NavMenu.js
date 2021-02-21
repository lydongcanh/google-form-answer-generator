import React from "react";
import { Navbar, Button, Alignment } from "@blueprintjs/core";
import { Link } from "react-router-dom";

export function NavMenu() {

  return (
    <Navbar className="a.navbar-brand">
      <Navbar.Group align={Alignment.CENTER}>
        <Navbar.Heading>
          <Link to="/">
            GGForms Answers Generator
            </Link>
        </Navbar.Heading>
        <Navbar.Divider />
        <Link to="/">
          <Button className="bp3-minimal" icon="home" text="Home" />
        </Link>
      </Navbar.Group>
    </Navbar>
  );
}
