"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const React = __importStar(require("react"));
class ErrorBoundary extends React.Component {
    constructor() {
        super(...arguments);
        this.state = { hasError: false };
    }
    static getDerivedStateFromError(_) {
        return { hasError: true };
    }
    componentDidCatch(error) {
        console.log(error);
    }
    render() {
        if (this.state.hasError) {
            return React.createElement("h1", null, "error");
        }
        return this.props.children;
    }
}
exports.ErrorBoundary = ErrorBoundary;
