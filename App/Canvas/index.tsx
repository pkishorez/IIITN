export {CanvasView} from './CanvasView';
export {canvasElemId} from './Runtime';
import {canvasElemId} from './Runtime';

export let canvasDefaultCode = `import {Canvas} from 'canvas2d';
import {Rectangle, Circle, Shape, CustomShape} from 'canvas2d/Shapes';

let canvasElem = document.getElementById("${canvasElemId}") as HTMLCanvasElement;
canvasElem.style.backgroundColor = "white";

let canvas = new Canvas(canvasElem, true);
`;