import React from "react";
import { NavMenu } from "./NavMenu";

export function Layout(props) {

  return (
    <div>
      <NavMenu />
      <div style={{ marginTop: "24px" }}>
        {props.children}
      </div>
    </div>
  );
}
