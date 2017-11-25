import {CanvasView, canvasElemId} from 'App/Canvas';

export let defaultCode = `import {Canvas} from 'canvas2d';
import {Rectangle, Circle, Shape, CustomShape} from 'canvas2d/Shapes';

let canvasElem = document.getElementById("${canvasElemId}") as HTMLCanvasElement;
canvasElem.style.backgroundColor = "white";

let canvas = new Canvas(canvasElem, true);
`;

export {Task} from './View';
export {TaskManager} from './Manage';