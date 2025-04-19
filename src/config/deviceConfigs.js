import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Go UP directories to the project root (from src/config to project root)
const projectRoot = path.resolve(__dirname, "../../"); // adjust if deeper


const laptop = {
  name: "laptop",
  mockupPath: path.resolve(projectRoot, "assets/Laptop.png"),
  screenPosition: { top: 142, left: 270, width: 1560, height: 980 },
  borderRadius: 1,
};

const tablet = {
  name: "tablet",
  mockupPath: path.resolve(projectRoot, "assets/Tablet.png"),
  screenPosition: { top: 63, left: 82, width: 686, height: 985 },
  borderRadius: 20,
};

const mobile = {
  name: "mobile",
  mockupPath: path.resolve(projectRoot, "assets/Mobile.png"),
  screenPosition: { top: 70, left: 30, width: 335, height: 670 },
  borderRadius: 20,
};

// console.log(mobile?.mockupPath)

export { laptop, tablet, mobile };
