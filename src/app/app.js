import {Table} from '../table/table.js';

export class App {
    constructor({el}) {
        this.el = el;

        this.table = new Table({
            el: document.createElement('div')
        });

        this.el.appendChild(this.table.el);

        this.render();
    }

    render() {
        this.table.render();
    }
}