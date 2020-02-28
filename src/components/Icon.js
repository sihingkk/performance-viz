import React from "react";
export function Icon({ type, className }) {
  return (
    <span className={"icon " + className}>
      <i className={type}></i>
    </span>
  );
}
