"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const murmurhash_js_1 = require("murmurhash-js");
const ramda_1 = require("ramda");
const React = __importStar(require("react"));
exports.Table = (props) => {
    if (ramda_1.isEmpty(props.data)) {
        const defaultMessage = "No records matched your search";
        const emptyMessage = ramda_1.propOr(defaultMessage, "emptyMessage", props.config);
        return React.createElement("h1", null, emptyMessage);
    }
    const rows = props.data.map(datum => {
        const fields = ramda_1.keys(datum);
        const rowKey = hashObj(datum);
        const rowAttributes = { key: rowKey };
        const cells = fields.map(field => {
            const value = datum[field];
            const cellKey = hashObj({ field, value });
            const cellAttributes = { [`data-field`]: field, key: cellKey };
            return React.createElement("td", Object.assign({}, cellAttributes), value);
        });
        return React.createElement("tr", Object.assign({}, rowAttributes), cells);
    });
    return (React.createElement("table", null,
        React.createElement("tbody", null, rows)));
};
function objToStr(obj) {
    return ramda_1.join("::", ramda_1.values(obj));
}
function hash(value) {
    return murmurhash_js_1.murmur3(value);
}
function hashObj(obj) {
    return hash(objToStr(obj));
}
