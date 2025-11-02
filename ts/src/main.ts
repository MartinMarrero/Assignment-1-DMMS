import { DecisionView } from './decision-view';
import { DecisionController } from './decision-controller';
import startCanvasBackground from './canvas-bg';

window.addEventListener('DOMContentLoaded', () => {
  // start animated background first
  try { startCanvasBackground(); } catch (e) { /* ignore */ }
  const view = new DecisionView();
  const controller = new DecisionController((results) => {
    view.showResults(results);
  });
  // wire view -> controller
  view.onCompute = (csv, method, opts) => controller.handleCompute(csv, method, opts);
});
