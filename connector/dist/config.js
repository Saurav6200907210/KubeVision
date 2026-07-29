"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadConfig = loadConfig;
exports.saveConfig = saveConfig;
exports.clearConfig = clearConfig;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const os_1 = __importDefault(require("os"));
const CONFIG_PATH = path_1.default.join(os_1.default.homedir(), '.kubevision-connector.json');
function loadConfig() {
    if (fs_1.default.existsSync(CONFIG_PATH)) {
        try {
            const data = fs_1.default.readFileSync(CONFIG_PATH, 'utf-8');
            return JSON.parse(data);
        }
        catch (e) {
            console.error('Error reading config file');
            return null;
        }
    }
    return null;
}
function saveConfig(config) {
    fs_1.default.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2));
}
function clearConfig() {
    if (fs_1.default.existsSync(CONFIG_PATH)) {
        fs_1.default.unlinkSync(CONFIG_PATH);
    }
}
