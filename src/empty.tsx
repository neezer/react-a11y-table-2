import * as React from "react";

const defaultMessage = "no results";

interface IProps {
  message?: string;
}

export const Empty: React.FunctionComponent<IProps> = ({ message }) => (
  <h1>{message || defaultMessage}</h1>
);
