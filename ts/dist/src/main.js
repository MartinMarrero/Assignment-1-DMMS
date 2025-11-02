import { DecisionView } from './decision-view';
import { DecisionController } from './decision-controller';
window.addEventListener('DOMContentLoaded', () => {
    const view = new DecisionView();
    const controller = new DecisionController((results) => {
        view.showResults(results);
    });
    // wire view -> controller
    view.onCompute = (csv, method, opts) => controller.handleCompute(csv, method, opts);
});
