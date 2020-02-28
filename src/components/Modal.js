import React from "react";

export const Modal = ({ modalShown, showModal, children }) => {
  return (
    <div
      className={"modal " + (modalShown ? "is-active" : "")}
      onClick={() => showModal(false)}
    >
      <div className="modal-background"></div>
      <div className="modal-content">{children}</div>
      <button className="modal-close is-large" aria-label="close"></button>
    </div>
  );
};
