import * as React from "react";

interface IState {
  hasError: boolean;
}

export class ErrorBoundary extends React.Component<{}, IState> {
  protected static getDerivedStateFromError(_: Error) {
    return { hasError: true };
  }

  public state: IState = { hasError: false };

  public componentDidCatch(error: Error) {
    console.log(error);
  }

  public render() {
    if (this.state.hasError) {
      return <h1>error</h1>;
    }

    return this.props.children;
  }
}
