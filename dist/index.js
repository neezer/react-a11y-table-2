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
const ErrorBoundary_1 = require("./ErrorBoundary");
const Table_1 = require("./Table");
exports.Table = (props) => (React.createElement(ErrorBoundary_1.ErrorBoundary, null,
    React.createElement(Table_1.Table, Object.assign({}, props))));
var FieldType;
(function (FieldType) {
    FieldType["String"] = "string";
    FieldType["Number"] = "number";
    FieldType["Enum"] = "enum";
})(FieldType = exports.FieldType || (exports.FieldType = {}));
